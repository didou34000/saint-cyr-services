// Checks the static site and optionally its published version. No package installation needed.
// node scripts/check-seo.cjs [--browser] [--live]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const canonicalBase = 'https://www.saint-cyr-services.fr';
const pages = ['index.html', 'mentions-legales.html', ...fs.readdirSync(path.join(root, 'prestations')).filter(p => p.endsWith('.html')).map(p => `prestations/${p}`)];
const route = p => p === 'index.html' ? '/' : '/' + p.replace(/\.html$/, '');
const contents = new Map(pages.map(p => [p, fs.readFileSync(path.join(root, p), 'utf8')]));
const issues = [];
function check(condition, message) { if (!condition) issues.push(message); }
const titles = new Set(), descriptions = new Set(), resources = new Set();
function fileFor(url) { return url.pathname === '/' ? 'index.html' : url.pathname.slice(1) + (path.extname(url.pathname) ? '' : '.html'); }
for (const [p, html] of contents) {
  const label = route(p);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/name="description" content="([^"]*)"/)?.[1];
  check(title && !titles.has(title), `${label}: title missing or duplicate`); titles.add(title);
  check(description && !descriptions.has(description), `${label}: description missing or duplicate`); descriptions.add(description);
  check((html.match(/<h1\b/g) || []).length === 1, `${label}: must have one H1`);
  check(html.includes('<html lang="fr">') && html.includes('name="viewport"'), `${label}: language/viewport`);
  check(html.includes(`rel="canonical" href="${canonicalBase}${label}"`), `${label}: canonical`);
  check(html.includes(`property="og:url" content="${canonicalBase}${label}"`), `${label}: OG URL`);
  check(!/content="[^"\n]*noindex/.test(html), `${label}: unexpected noindex`);
  check(html.includes('tel:+33668053381') && html.includes('https://wa.me/33668053381') && html.includes('mailto:saintcyrlagbo@yahoo.fr'), `${label}: contact links`);
  if (p !== 'mentions-legales.html') {
    check(title.includes('Montpellier'), `${label}: title locality`);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const business = graph.find(n => n['@id'] === canonicalBase + '/#entreprise');
    check(business?.name === 'Saint-Cyr Services' && business?.address?.postalCode === '34080' && business?.telephone === '+33668053381', `${label}: business identity`);
    check(business?.email === 'saintcyrlagbo@yahoo.fr' && business?.areaServed?.some(a => a.name === 'Montpellier'), `${label}: business contact/area`);
    check(!html.includes('aggregateRating') && !html.includes('openingHours'), `${label}: unverified rating/hours`);
    if (p.startsWith('prestations/')) {
      const service = graph.find(n => n['@type'] === 'Service');
      const crumbs = graph.find(n => n['@type'] === 'BreadcrumbList');
      check(service?.url === canonicalBase + label && service?.provider?.['@id'] === business['@id'], `${label}: Service`);
      check(crumbs?.itemListElement?.length === 2 && crumbs.itemListElement[1].item === canonicalBase + label, `${label}: BreadcrumbList`);
      check(html.includes('aria-label="Fil d’Ariane"'), `${label}: visible breadcrumbs`);
    } else check(graph.some(n => n['@type'] === 'WebSite' && n.url === canonicalBase + '/'), `${label}: WebSite`);
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const url = new URL(href, canonicalBase + label);
    if (url.origin !== canonicalBase || !['http:', 'https:'].includes(url.protocol)) continue;
    check(!url.pathname.endsWith('.html'), `${label}: redirecting internal link ${href}`);
    const target = fileFor(url);
    check(fs.existsSync(path.join(root, target)), `${label}: missing link ${href}`);
    if (url.hash && contents.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      check(contents.get(target).includes(`id="${id}"`), `${label}: missing anchor ${href}`);
    }
    if (!target.endsWith('.html')) resources.add(url.pathname);
  }
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    check(/\balt="[^"]*"/.test(tag[0]) && /\bwidth="\d+"/.test(tag[0]) && /\bheight="\d+"/.test(tag[0]), `${label}: image alt/dimensions`);
  }
  const media = [...html.matchAll(/(?:src|data-full)="([^"]+)"/g)].map(m => m[1]);
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) for (const item of set.split(',')) media.push(item.trim().split(/\s+/)[0]);
  for (const src of media) {
    const url = new URL(src, canonicalBase + label);
    check(fs.existsSync(path.join(root, fileFor(url))), `${label}: missing asset ${src}`);
    resources.add(url.pathname);
  }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.deepEqual([...sitemapURLs].sort(), pages.map(p => canonicalBase + route(p)).sort(), 'sitemap inventory');
check(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(`Sitemap: ${canonicalBase}/sitemap.xml`), 'robots sitemap');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
check(config.cleanUrls && config.trailingSlash === false, 'clean URLs');
check(config.redirects.some(r => r.has?.some(h => h.type === 'host' && h.value === 'saint-cyr-services.vercel.app') && r.permanent), 'legacy host redirect');

async function publishedChecks() {
  await Promise.all(pages.map(async p => {
    const url = canonicalBase + route(p), response = await fetch(url, { redirect: 'manual' });
    check(response.status === 200, `${url}: HTTP ${response.status}`);
    check(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${url}: X-Robots-Tag blocks indexing`);
    const html = await response.text();
    const normalize = s => s.replace(/\r\n/g, '\n').trim();
    check(normalize(html) === normalize(contents.get(p)), `${url}: deployed content differs`);
  }));
  for (const resource of [...resources, '/robots.txt', '/sitemap.xml']) {
    const response = await fetch(canonicalBase + resource, { method: 'HEAD', redirect: 'manual' });
    check(response.status === 200, `${resource}: HTTP ${response.status}`);
  }
  check((await (await fetch(canonicalBase + '/sitemap.xml')).text()).replace(/\r\n/g, '\n').trim() === sitemap.replace(/\r\n/g, '\n').trim(), 'published sitemap differs');
  for (const [url, expected] of [
    ['https://saint-cyr-services.fr/', canonicalBase + '/'],
    ['https://saint-cyr-services.vercel.app/prestations/entretien-jardin', canonicalBase + '/prestations/entretien-jardin'],
    [canonicalBase + '/prestations/entretien-jardin.html', canonicalBase + '/prestations/entretien-jardin']
  ]) {
    const response = await fetch(url, { redirect: 'manual' });
    check([301, 308].includes(response.status), `${url}: permanent redirect`);
    check(new URL(response.headers.get('location'), url).href === expected, `${url}: redirect destination`);
  }
  for (const suffix of ['/seo-check-nonexistent', '/empreinte.py', '/docs/seo-plan.md', '/scripts/check-seo.cjs']) {
    const response = await fetch(canonicalBase + suffix, { redirect: 'manual' });
    check(response.status === 404, `${suffix}: expected 404, got ${response.status}`);
  }
}

async function browserChecks() {
  // Load Playwright from the installed runtime, or from the caller's own installation.
  let playwright;
  try { playwright = require('playwright'); }
  catch { playwright = require(process.env.PLAYWRIGHT_MODULE || path.join(require('node:os').homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const file = path.resolve(root, fileFor(url));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'text/plain');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = process.argv.includes('--live') ? canonicalBase : `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', e => issues.push(`${width}px: ${e.message}`));
      page.on('response', r => { if (r.status() >= 400) issues.push(`${width}px: ${r.status()} ${r.url()}`); });
      page.on('requestfailed', r => issues.push(`${width}px: ${r.failure().errorText} ${r.url()}`));
      for (const p of pages) {
        await page.goto(origin + route(p), { waitUntil: 'networkidle' });
        // Force deferred images to load for the audit; leave production lazy loading unchanged.
        await page.evaluate(async () => {
          await Promise.all([...document.images].filter(img => img.getAttribute('src')).map(img => {
            img.loading = 'eager';
            return img.decode().catch(() => {});
          }));
        });
        const metrics = await page.evaluate(() => ({
          width: innerWidth, scroll: document.documentElement.scrollWidth,
          broken: [...document.images].filter(i => i.getAttribute('src') && !i.naturalWidth).map(i => i.getAttribute('src')),
          overflow: [...document.querySelectorAll('main *, footer *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).slice(0, 5).map(e => `${e.tagName}.${e.className}`)
        }));
        check(metrics.scroll <= width + 1, `${route(p)} ${width}px: horizontal overflow ${JSON.stringify(metrics)}`);
        check(!metrics.broken.length, `${route(p)} ${width}px: broken images ${metrics.broken}`);
        await page.evaluate(() => scrollTo(0, 0));
        const toggle = page.locator('.nav-toggle');
        if (await toggle.isVisible()) {
          await toggle.click(); check(await toggle.getAttribute('aria-expanded') === 'true', `${p}: menu open`);
          await page.keyboard.press('Escape'); check(await toggle.getAttribute('aria-expanded') === 'false', `${p}: menu escape`);
          await toggle.click(); await page.locator('#nav-principal a').first().click();
          check(await toggle.getAttribute('aria-expanded') === 'false', `${p}: menu link closes`);
          await page.goto(origin + route(p), { waitUntil: 'networkidle' });
        }
        const shot = page.locator('[data-lightbox] .shot').first();
        if (await shot.count()) {
          await shot.click(); check(await page.locator('dialog.lightbox').evaluate(e => e.open), `${p}: gallery open`);
          await page.locator('.lightbox img').evaluate(img => img.decode());
          const src = await page.locator('.lightbox img').getAttribute('src');
          await page.keyboard.press('ArrowRight'); check(await page.locator('.lightbox img').getAttribute('src') !== src, `${p}: next photo`);
          await page.keyboard.press('Escape'); check(!await page.locator('dialog.lightbox').evaluate(e => e.open), `${p}: gallery close`);
        }
        if (p === 'index.html' && [390, 1440].includes(width)) {
          await page.evaluate(() => scrollTo(0, 0));
          fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
          await page.screenshot({ path: path.join(root, 'artifacts', `seo-home-${width}.png`) });
        }
      }
      await context.close();
      console.log(`Browser: ${pages.length} pages checked at ${width}px`);
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const page = await noJS.newPage();
    await page.goto(origin + '/');
    check(await page.locator('h1').isVisible() && await page.locator('#prestations').innerText(), 'content without JS');
    check(await page.locator('.reveal').evaluateAll(elements => elements.every(e => getComputedStyle(e).opacity === '1')), 'cards visible without JS');
    await noJS.close();
    const motion = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const motionPage = await motion.newPage();
    await motionPage.goto(origin + '/');
    await motionPage.locator('.service.reveal').first().scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(() => document.querySelector('.service.reveal').classList.contains('is-visible'));
    await motion.close();
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}

(async () => {
  if (process.argv.includes('--browser')) await browserChecks();
  if (process.argv.includes('--live')) await publishedChecks();
  if (issues.length) { console.error(issues.join('\n')); process.exitCode = 1; }
  else console.log(`SEO checks passed: ${pages.length} pages, ${resources.size} assets${process.argv.includes('--live') ? ', published site verified' : ''}.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
