import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { ROUTES } from './prerender-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4183);
const TIMEOUT = Number(process.env.PRERENDER_TIMEOUT || 30000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startStaticServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = join(DIST, urlPath);

    if (!existsSync(filePath) || extname(filePath) === '') {
      filePath = join(DIST, 'index.html');
    }

    try {
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });

  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html no existe. Ejecuta `vite build` primero.');
    process.exit(1);
  }

  const server = await startStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ userAgent: 'XOpsPrerender/1.0 (+https://xopsconference.com)' });

  const failures = [];
  let written = 0;

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await page.waitForSelector('#root > *', { timeout: TIMEOUT });

      const html = await page.content();

      const rendered = await page.evaluate(() => {
        /* global document */
        const root = document.getElementById('root');
        return (root?.innerText || '').trim().length;
      });

      if (rendered < 200) {
        failures.push(`${route} — contenido insuficiente (${rendered} chars)`);
        continue;
      }

      const outPath = route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, route.replace(/^\//, ''), 'index.html');

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf-8');
      written += 1;
      console.log(`[prerender] ${route} -> ${rendered} chars`);
    } catch (err) {
      failures.push(`${route} — ${err.message.split('\n')[0]}`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\n[prerender] ${written}/${ROUTES.length} rutas prerenderizadas`);

  if (failures.length) {
    console.error('[prerender] Fallos:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[prerender] Error fatal:', err);
  process.exit(1);
});
