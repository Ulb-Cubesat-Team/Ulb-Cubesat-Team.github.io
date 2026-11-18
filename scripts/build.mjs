import { rm, mkdir, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { render, pages, filename } from '../src/render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');

// Every generated file, keyed by its path relative to the site root.
const output = new Map();
for (const lang of ['en', 'fr']) {
  for (const page of pages) output.set(path.join(lang === 'fr' ? 'fr' : '', filename(page)), render(lang, page));
}
// Root-relative URLs keep the 404 page working for arbitrarily nested unknown paths.
output.set('404.html', render('en', '404').replace(/(href|src)="(?!https?:|mailto:|#|\/)([^"]+)"/g, '$1="/$2"'));

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'fr'), { recursive: true });
// assets/jcdecaux/ holds the raw brand-kit export (misnamed files, PDFs); only the cleaned copies in assets/brand/ are published.
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, filter: src => !src.includes(`${path.sep}jcdecaux`) });
await cp(path.join(root, '_headers'), path.join(dist, '_headers'));

// dist/ is the Cloudflare output. The repository root gets the same pages so GitHub Pages stays in sync.
for (const target of [dist, root]) {
  await mkdir(path.join(target, 'fr'), { recursive: true });
  for (const [file, html] of output) await writeFile(path.join(target, file), html);
}
console.log(`Built ${output.size} pages and copied assets to dist/ (pages mirrored at the repository root for GitHub Pages).`);
