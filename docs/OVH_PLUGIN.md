# Private OVH Domain Manager

This repository exposes a private MCP endpoint at `/api/mcp` for the single domain `saint-cyr-services.fr`.

## Security model

- The server code is hard-locked to `saint-cyr-services.fr`.
- No OVH secret is stored in GitHub or Vercel.
- The MCP connection supplies a bearer token containing a dedicated OVH API application key, application secret and consumer key.
- The OVH credential must itself be scoped to this domain only.
- Nameserver changes, ownership changes, transfers and purchases are not exposed.
- DNS create/update/delete operations require the exact confirmation phrase `CONFIRMER saint-cyr-services.fr`.

## Create the OVH API credentials

Create a dedicated OVH API token for this plugin in the OVH EU API console/token page. Grant only these rules:

- `GET /domain/saint-cyr-services.fr`
- `GET /domain/saint-cyr-services.fr/*`
- `GET /domain/zone/saint-cyr-services.fr`
- `GET /domain/zone/saint-cyr-services.fr/*`
- `POST /domain/zone/saint-cyr-services.fr/record`
- `POST /domain/zone/saint-cyr-services.fr/refresh`
- `PUT /domain/zone/saint-cyr-services.fr/record/*`
- `DELETE /domain/zone/saint-cyr-services.fr/record/*`

Store the returned application key, application secret and consumer key securely. Do not commit them.

## Bearer-token format

The MCP connection uses one bearer token. The token is the base64url encoding of this JSON object:

```json
{"appKey":"...","appSecret":"...","consumerKey":"..."}
```

The token is transport encoding, not encryption. Store it as a secret in the client/connection settings and never put it in this repository.

## MCP endpoint

Production endpoint after deployment:

`https://saint-cyr-services.vercel.app/api/mcp`

## Exposed tools

Read-only:

- `check_connection`
- `get_domain_overview`
- `get_dns_zone`
- `list_dns_records`
- `get_dns_record`
- `list_name_servers`

Writes with explicit confirmation:

- `create_dns_record`
- `update_dns_record`
- `delete_dns_record`
- `refresh_dns_zone`
