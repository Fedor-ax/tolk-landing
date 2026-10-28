/**
 * Локальная раздача собранного `out/` — для проверки статики так, как
 * её будет раздавать боевой веб-сервер: чистые адреса (`/legal` →
 * `legal.html`), 404 из `404.html`.
 *
 *   PORT=3100 npm run serve
 *   LEAD_PROXY=https://next.tolk.global npm run serve   # прокси /api/lead
 *
 * Без LEAD_PROXY запрос `/api/lead` получает 502 — квиз покажет экран
 * ошибки отправки, как и на живом сайте при недоступной CRM.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', 'out');
const PORT = Number(process.env.PORT || 3100);
const LEAD_PROXY = process.env.LEAD_PROXY;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const base = path.join(ROOT, clean);
  for (const candidate of [base, `${base}.html`, path.join(base, 'index.html')]) {
    if (candidate.startsWith(ROOT) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

async function proxyLead(req, res) {
  if (!LEAD_PROXY) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end('{"error":"lead_proxy_not_configured"}');
    return;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const upstream = await fetch(new URL('/api/lead', LEAD_PROXY), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: Buffer.concat(chunks),
  });
  res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
  res.end(await upstream.text());
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname === '/api/lead' && req.method === 'POST') {
      proxyLead(req, res).catch(() => {
        res.writeHead(502);
        res.end();
      });
      return;
    }
    const file = resolveFile(pathname);
    const status = file ? 200 : 404;
    const target = file ?? path.join(ROOT, '404.html');
    res.writeHead(status, {
      'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream',
    });
    fs.createReadStream(target).pipe(res);
  })
  .listen(PORT, () => console.log(`out/ → http://localhost:${PORT}`));
