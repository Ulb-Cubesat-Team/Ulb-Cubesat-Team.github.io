import { rm, mkdir, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { render, pages, filename } from '../src/render.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'fr'), { recursive: true });
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
for (const lang of ['en', 'fr']) {
  for (const page of pages) {
    await writeFile(path.join(dist, lang === 'fr' ? 'fr' : '', filename(page)), render(lang, page));
  }
}
// Root-relative assets keep the Cloudflare 404 usable for arbitrarily nested unknown URLs.
await writeFile(path.join(dist, '404.html'), render('en', '404').replace(/(href|src)="(?!https?:|mailto:|#)([^"]+)"/g, '$1="/$2"'));
await writeFile(path.join(dist, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n\n/assets/*\n  Cache-Control: public, max-age=3600\n');
console.log('Built 12 bilingual pages, a 404 page and local assets in dist/.');
