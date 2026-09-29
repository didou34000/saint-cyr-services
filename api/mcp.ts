import { createHash } from "node:crypto";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const DOMAIN = "saint-cyr-services.fr";
const OVH_BASE = "https://eu.api.ovh.com/1.0";
const CONFIRMATION_PHRASE = `CONFIRMER ${DOMAIN}`;

const RECORD_TYPES = [
  "A", "AAAA", "CAA", "CNAME", "DNAME", "LOC", "MX", "NAPTR",
  "NS", "PTR", "SPF", "SRV", "SSHFP", "TLSA", "TXT",
] as const;

type OvhCredentials = {
  appKey: string;
  appSecret: string;
  consumerKey: string;
};

function corsHeaders(extra: Record<string, string> = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Accept, Authorization, Content-Type, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    ...extra,
  };
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders())) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function unauthorized(message = "Authentication required") {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message },
    }),
    {
      status: 401,
      headers: corsHeaders({
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="OVH Domain Manager"',
      }),
    },
  );
}

function decodeCredentials(request: Request): OvhCredentials | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) return null;

  const token = authorization.slice(7).trim();
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (
      typeof parsed?.appKey !== "string" ||
      typeof parsed?.appSecret !== "string" ||
      typeof parsed?.consumerKey !== "string" ||
      !parsed.appKey ||
      !parsed.appSecret ||
      !parsed.consumerKey
    ) {
      return null;
    }
    return {
      appKey: parsed.appKey,
      appSecret: parsed.appSecret,
      consumerKey: parsed.consumerKey,
    };
  } catch {
    return null;
  }
}

function ovhSignature(
  credentials: OvhCredentials,
  method: string,
  url: string,
  body: string,
  timestamp: number,
) {
  const clear = [
    credentials.appSecret,
    credentials.consumerKey,
    method,
    url,
    body,
    String(timestamp),
  ].join("+");
  return `$1$${createHash("sha1").update(clear).digest("hex")}`;
}

let clockCache: { delta: number; expiresAt: number } | null = null;

async function ovhTimestamp() {
  const now = Date.now();
  if (clockCache && clockCache.expiresAt > now) {
    return Math.floor(now / 1000) + clockCache.delta;
  }

  const response = await fetch(`${OVH_BASE}/auth/time`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`OVH time endpoint failed (${response.status})`);

  const ovhTime = Number(await response.text());
  if (!Number.isFinite(ovhTime)) throw new Error("OVH time endpoint returned an invalid value");

  const local = Math.floor(now / 1000);
  clockCache = { delta: ovhTime - local, expiresAt: now + 5 * 60 * 1000 };
  return ovhTime;
}

async function ovhRequest(
  credentials: OvhCredentials,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  query?: Record<string, string | number | undefined>,
) {
  if (!path.startsWith(`/domain/${DOMAIN}`) && !path.startsWith(`/domain/zone/${DOMAIN}`)) {
    throw new Error("Blocked request outside the allowed domain");
  }

  const url = new URL(`${OVH_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }

  const serializedBody = body === undefined ? "" : JSON.stringify(body);
  const timestamp = await ovhTimestamp();
  const signature = ovhSignature(credentials, method, url.toString(), serializedBody, timestamp);

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Ovh-Application": credentials.appKey,
      "X-Ovh-Consumer": credentials.consumerKey,
      "X-Ovh-Timestamp": String(timestamp),
      "X-Ovh-Signature": signature,
    },
    ...(serializedBody ? { body: serializedBody } : {}),
  });

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message)
        : typeof data === "string"
          ? data
          : `HTTP ${response.status}`;
    throw new Error(`OVH API ${response.status}: ${detail}`);
  }

  return data;
}

async function safeOvh(
  credentials: OvhCredentials,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  query?: Record<string, string | number | undefined>,
) {
  try {
    return { ok: true, data: await ovhRequest(credentials, method, path, body, query) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function toolText(data: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    ...(isError ? { isError: true } : {}),
  };
}

function normalizeSubDomain(value?: string) {
  if (!value || value === "@" || value === DOMAIN) return "";
  const trimmed = value.trim().replace(/\.$/, "");
  if (trimmed.endsWith(`.${DOMAIN}`)) return trimmed.slice(0, -(DOMAIN.length + 1));
  if (/\s/.test(trimmed) || trimmed.length > 255) throw new Error("Invalid subdomain");
  return trimmed;
}

function requireConfirmation(confirmation: string) {
  if (confirmation !== CONFIRMATION_PHRASE) {
    throw new Error(`Confirmation required. Exact phrase: ${CONFIRMATION_PHRASE}`);
  }
}

async function listRecords(
  credentials: OvhCredentials,
  filters: { fieldType?: (typeof RECORD_TYPES)[number]; subDomain?: string },
) {
  const ids = await ovhRequest(credentials, "GET", `/domain/zone/${DOMAIN}/record`, undefined, {
    fieldType: filters.fieldType,
    subDomain: filters.subDomain === undefined ? undefined : normalizeSubDomain(filters.subDomain),
  });

  if (!Array.isArray(ids)) return [];
  const limited = ids.slice(0, 500);
  return Promise.all(
    limited.map(async (id) => {
      const result = await safeOvh(
        credentials,
        "GET",
        `/domain/zone/${DOMAIN}/record/${Number(id)}`,
      );
      return result.ok ? result.data : { id, error: result.error };
    }),
  );
}

function createServer(credentials: OvhCredentials) {
  return createMcpHandler(
    (server) => {
      server.registerTool(
        "check_connection",
        {
          title: "Check OVH connection",
          description: `Validate the supplied OVH API credentials and confirm access to ${DOMAIN}.`,
          inputSchema: z.object({}),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async () => {
          try {
            const [domain, zone] = await Promise.all([
              ovhRequest(credentials, "GET", `/domain/${DOMAIN}`),
              ovhRequest(credentials, "GET", `/domain/zone/${DOMAIN}`),
            ]);
            return toolText({ connected: true, domain: DOMAIN, domainDetails: domain, zone });
          } catch (error) {
            return toolText(
              { connected: false, error: error instanceof Error ? error.message : String(error) },
              true,
            );
          }
        },
      );

      server.registerTool(
        "get_domain_overview",
        {
          title: "Get domain overview",
          description: `Read-only overview of ${DOMAIN}: domain settings, service information, DNS-zone metadata and nameserver IDs.`,
          inputSchema: z.object({}),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async () => {
          const [domainDetails, serviceInfo, zone, nameServerIds] = await Promise.all([
            safeOvh(credentials, "GET", `/domain/${DOMAIN}`),
            safeOvh(credentials, "GET", `/domain/${DOMAIN}/serviceInfos`),
            safeOvh(credentials, "GET", `/domain/zone/${DOMAIN}`),
            safeOvh(credentials, "GET", `/domain/${DOMAIN}/nameServer`),
          ]);
          return toolText({ domain: DOMAIN, domainDetails, serviceInfo, zone, nameServerIds });
        },
      );

      server.registerTool(
        "get_dns_zone",
        {
          title: "Get DNS zone",
          description: `Read the OVHcloud DNS-zone metadata for ${DOMAIN}.`,
          inputSchema: z.object({}),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async () => toolText(await ovhRequest(credentials, "GET", `/domain/zone/${DOMAIN}`)),
      );

      server.registerTool(
        "list_dns_records",
        {
          title: "List DNS records",
          description: `List DNS records for ${DOMAIN}, optionally filtered by type or subdomain.`,
          inputSchema: z.object({
            fieldType: z.enum(RECORD_TYPES).optional(),
            subDomain: z.string().max(255).optional(),
          }),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async (args) => toolText(await listRecords(credentials, args)),
      );

      server.registerTool(
        "get_dns_record",
        {
          title: "Get DNS record",
          description: `Read one DNS record for ${DOMAIN} by OVH record ID.`,
          inputSchema: z.object({ id: z.number().int().positive() }),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async ({ id }) =>
          toolText(await ovhRequest(credentials, "GET", `/domain/zone/${DOMAIN}/record/${id}`)),
      );

      server.registerTool(
        "list_name_servers",
        {
          title: "List nameservers",
          description: `Read the nameservers declared for ${DOMAIN}. This tool cannot change them.`,
          inputSchema: z.object({}),
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async () => {
          const ids = await ovhRequest(credentials, "GET", `/domain/${DOMAIN}/nameServer`);
          if (!Array.isArray(ids)) return toolText([]);
          const servers = await Promise.all(
            ids.map(async (id) => {
              const result = await safeOvh(
                credentials,
                "GET",
                `/domain/${DOMAIN}/nameServer/${Number(id)}`,
              );
              return result.ok ? result.data : { id, error: result.error };
            }),
          );
          return toolText(servers);
        },
      );

      server.registerTool(
        "create_dns_record",
        {
          title: "Create DNS record",
          description: `Create a DNS record in ${DOMAIN}, then refresh the zone. Only use after the user explicitly confirms the proposed change.`,
          inputSchema: z.object({
            fieldType: z.enum(RECORD_TYPES),
            subDomain: z.string().max(255).optional(),
            target: z.string().min(1).max(4096),
            ttl: z.number().int().nonnegative().optional(),
            confirmation: z.literal(CONFIRMATION_PHRASE),
          }),
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
          },
        },
        async ({ fieldType, subDomain, target, ttl, confirmation }) => {
          requireConfirmation(confirmation);
          const payload: Record<string, unknown> = {
            fieldType,
            subDomain: normalizeSubDomain(subDomain),
            target,
          };
          if (ttl !== undefined) payload.ttl = ttl;
          const created = await ovhRequest(
            credentials,
            "POST",
            `/domain/zone/${DOMAIN}/record`,
            payload,
          );
          const refresh = await safeOvh(credentials, "POST", `/domain/zone/${DOMAIN}/refresh`);
          return toolText({ domain: DOMAIN, created, zoneRefresh: refresh });
        },
      );

      server.registerTool(
        "update_dns_record",
        {
          title: "Update DNS record",
          description: `Update an existing DNS record in ${DOMAIN}, then refresh the zone. Only use after the user explicitly confirms the proposed change.`,
          inputSchema: z.object({
            id: z.number().int().positive(),
            subDomain: z.string().max(255).optional(),
            target: z.string().min(1).max(4096).optional(),
            ttl: z.number().int().nonnegative().optional(),
            confirmation: z.literal(CONFIRMATION_PHRASE),
          }),
          annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async ({ id, subDomain, target, ttl, confirmation }) => {
          requireConfirmation(confirmation);
          const before = (await ovhRequest(
            credentials,
            "GET",
            `/domain/zone/${DOMAIN}/record/${id}`,
          )) as Record<string, unknown>;

          const payload = {
            subDomain: subDomain === undefined ? before.subDomain : normalizeSubDomain(subDomain),
            target: target === undefined ? before.target : target,
            ttl: ttl === undefined ? before.ttl : ttl,
          };

          await ovhRequest(
            credentials,
            "PUT",
            `/domain/zone/${DOMAIN}/record/${id}`,
            payload,
          );
          const after = await ovhRequest(
            credentials,
            "GET",
            `/domain/zone/${DOMAIN}/record/${id}`,
          );
          const refresh = await safeOvh(credentials, "POST", `/domain/zone/${DOMAIN}/refresh`);
          return toolText({ domain: DOMAIN, before, after, zoneRefresh: refresh });
        },
      );

      server.registerTool(
        "delete_dns_record",
        {
          title: "Delete DNS record",
          description: `Delete one DNS record from ${DOMAIN}, then refresh the zone. Only use after the user explicitly confirms the deletion.`,
          inputSchema: z.object({
            id: z.number().int().positive(),
            confirmation: z.literal(CONFIRMATION_PHRASE),
          }),
          annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
          },
        },
        async ({ id, confirmation }) => {
          requireConfirmation(confirmation);
          const deleted = await ovhRequest(
            credentials,
            "GET",
            `/domain/zone/${DOMAIN}/record/${id}`,
          );
          await ovhRequest(credentials, "DELETE", `/domain/zone/${DOMAIN}/record/${id}`);
          const refresh = await safeOvh(credentials, "POST", `/domain/zone/${DOMAIN}/refresh`);
          return toolText({ domain: DOMAIN, deleted, zoneRefresh: refresh });
        },
      );

      server.registerTool(
        "refresh_dns_zone",
        {
          title: "Refresh DNS zone",
          description: `Publish pending OVHcloud DNS-zone changes for ${DOMAIN}. Requires explicit user confirmation.`,
          inputSchema: z.object({ confirmation: z.literal(CONFIRMATION_PHRASE) }),
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
        async ({ confirmation }) => {
          requireConfirmation(confirmation);
          const result = await ovhRequest(credentials, "POST", `/domain/zone/${DOMAIN}/refresh`);
          return toolText({ domain: DOMAIN, result });
        },
      );
    },
    {
      serverInfo: {
        name: "saint-cyr-ovh-domain-manager",
        title: "Saint-Cyr OVH Domain Manager",
        version: "0.1.0",
      },
    },
  );
}

async function handleRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const credentials = decodeCredentials(request);
  if (!credentials) {
    return unauthorized(
      "Connect this private plugin with a bearer token containing scoped OVH API credentials.",
    );
  }

  try {
    const handler = createServer(credentials);
    return withCors(await handler(request));
  } catch (error) {
    return withCors(
      new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : String(error),
          },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      ),
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
