import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Validate the published files, independently of the renderer and its route list.
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const routeNames = ['index', 'team', 'payload', 'recruitment', 'announcements'];
const routes = routeNames.flatMap(name => [`${name}.html`, `fr/${name}.html`]);
routes.push('404.html');
const failures = [];
const pages = new Map();
let linksChecked = 0;
let assetsChecked = 0;
const expect = (condition, file, message) => { if (!condition) failures.push(`${file}: ${message}`); };
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39|#(\d+)|#x([\da-f]+));/gi, (entity, decimal, hex) => decimal ? String.fromCodePoint(Number(decimal)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>' }[entity.toLowerCase()] ?? entity));
const text = value => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function tags(html) {
  return [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(match => {
    const attrs = {};
    for (const attr of match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    return { name: match[1].toLowerCase(), attrs };
  });
}

async function getPage(file) {
  if (pages.has(file)) return pages.get(file);
  try {
    const html = await readFile(path.join(root, file), 'utf8');
    const elements = tags(html);
    const ids = elements.map(el => el.attrs.id).filter(Boolean);
    const page = { html, elements, ids: new Set(ids) };
    pages.set(file, page);
    expect(ids.length === page.ids.size, file, 'duplicate IDs can break navigation and accessibility relationships');
    return page;
  } catch {
    failures.push(`${file}: required page is missing or unreadable`);
    return null;
  }
}

function localReference(value, from) {
  if (/^(?:https?:|mailto:|tel:|data:|blob:|\/\/)/i.test(value)) return null;
  if (/^[\w+.-]+:/.test(value)) {
    failures.push(`${from}: unsupported link or asset scheme in ${value}`);
    return null;
  }
  const url = new URL(value, `https://static-check.invalid/${from}`);
  return { file: decodeURIComponent(url.pathname).replace(/^\//, ''), fragment: decodeURIComponent(url.hash.slice(1)) };
}

async function checkReference(value, from, label) {
  expect(Boolean(value.trim()), from, `${label} is empty`);
  const reference = localReference(value, from);
  if (!reference) return;
  let file = reference.file;
  if (!file || file.endsWith('/')) file += 'index.html';
  const target = path.resolve(root, file);
  expect(target.startsWith(root), from, `${label} escapes the published directory: ${value}`);
  let info = await stat(target).catch(() => null);
  if (info?.isDirectory()) {
    file = `${file}/index.html`;
    info = await stat(path.join(root, file)).catch(() => null);
  }
  expect(info?.isFile(), from, `missing ${label} target: ${value}`);
  if (!info?.isFile()) return;
  if (label === 'asset') assetsChecked++; else linksChecked++;
  if (reference.fragment && /\.html$/i.test(file)) {
    const targetPage = await getPage(file);
    expect(targetPage?.ids.has(reference.fragment), from, `missing fragment #${reference.fragment} in ${file}`);
  }
}

// These URLs preserve the existing team's contact destinations.
const sourceLinks = [
  'https://www.instagram.com/ulbcubesat/',
  'https://be.linkedin.com/company/ulb-cubesat-team',
  'mailto:cubesat.team@ulb.be',
];

for (const file of routes) {
  const page = await getPage(file);
  if (!page) continue;
  const { html, elements, ids } = page;
  const language = file.startsWith('fr/') ? 'fr' : 'en';
  const byTag = tag => elements.filter(el => el.name === tag);
  const links = byTag('a');
  const meta = byTag('meta');
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const heading = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  expect(/^\s*<!doctype html>/i.test(html), file, 'missing HTML doctype');
  expect(byTag('html')[0]?.attrs.lang === language, file, `document language must be ${language}`);
  expect(Boolean(title && text(title[1])), file, 'missing page title');
  expect(heading.length === 1 && text(heading[0][1]).length > 0, file, 'page must have one nonempty h1');
  expect(meta.some(el => el.attrs.name === 'description' && el.attrs.content?.trim()), file, 'missing description');
  expect(meta.some(el => el.attrs.name === 'viewport' && el.attrs.content?.includes('width=device-width')), file, 'missing responsive viewport');
  expect(byTag('main').length === 1, file, 'page must expose one main landmark');
  expect(links.some(el => el.attrs.href === '#main'), file, 'missing skip-to-content link');
  expect(!/\b(?:undefined|NaN)\b/.test(text(html)), file, 'unresolved JavaScript value appears in the page');
  expect(!byTag('form').length, file, 'local forms need a working submission handler; recruitment currently uses the hosted form');

  for (const element of elements) {
    const { name, attrs } = element;
    if (name === 'img') expect('alt' in attrs, file, `image ${attrs.src} needs alternative text or an empty decorative alt`);
    if ('tabindex' in attrs) expect(Number(attrs.tabindex) <= 0, file, 'positive tabindex disrupts keyboard order');
    for (const relationship of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
      if (attrs[relationship]) for (const id of attrs[relationship].split(/\s+/)) {
        expect(ids.has(id), file, `${relationship} references missing ID ${id}`);
      }
    }
    if (attrs.href !== undefined) await checkReference(attrs.href, file, name === 'link' && attrs.rel !== 'alternate' ? 'asset' : 'link');
    if (attrs.src !== undefined) await checkReference(attrs.src, file, 'asset');
    if (name === 'a' && attrs.target === '_blank') expect(/\bnoopener\b/.test(attrs.rel || ''), file, 'new-window links must include rel="noopener"');
    // Inline SVG paint servers and markers must resolve within the same document.
    for (const value of Object.values(attrs)) for (const match of value.matchAll(/url\(\s*#([^\s)]+)\s*\)/g)) {
      expect(ids.has(match[1]), file, `SVG references missing ID ${match[1]}`);
    }
  }

  for (const href of sourceLinks) expect(links.some(el => el.attrs.href === href), file, `missing team destination ${href}`);

  const currentRoute = file === '404.html' ? 'index.html' : path.posix.basename(file);
  const languageNav = html.match(/<nav\b[^>]*class="language-switch"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  expect(Boolean(languageNav), file, 'missing language switch');
  for (const lang of ['en', 'fr']) {
    const switchLink = tags(languageNav || '').find(el => el.name === 'a' && el.attrs.hreflang === lang);
    const target = switchLink && localReference(switchLink.attrs.href || '', file);
    expect(target?.file === `${lang === 'fr' ? 'fr/' : ''}${currentRoute}`, file, `${lang.toUpperCase()} switch must keep the same page`);
    expect(switchLink?.attrs.lang === lang, file, `${lang.toUpperCase()} switch needs its language declared`);
    expect(Boolean(switchLink?.attrs['aria-current']) === (language === lang), file, 'language switch current state is incorrect');
  }

  if (file.endsWith('payload.html')) {
    const tabs = elements.filter(el => el.attrs.role === 'tab');
    const selected = tabs.filter(el => el.attrs['aria-selected'] === 'true');
    expect(tabs.length >= 2 && selected.length === 1, file, 'experiment tabs need one selected tab');
    expect(tabs.every(el => el.attrs.tabindex === (el.attrs['aria-selected'] === 'true' ? '0' : '-1')), file, 'experiment tabs need a single keyboard entry point');
    for (const tab of tabs) {
      const panel = elements.find(el => el.attrs.id === tab.attrs['aria-controls']);
      expect(panel && !('hidden' in panel.attrs), file, 'experiment content must remain readable before JavaScript enhancement');
    }
    const visibleText = text(html.replace(/<head>[\s\S]*?<\/head>/i, ''));
    expect(language === 'en' ? /no onboard propulsion/i.test(visibleText) : /aucune propulsion embarquée/i.test(visibleText), file, 'payload must clearly state there is no onboard propulsion');
  }
}

async function checkStyles(folder) {
  for (const entry of await readdir(path.join(root, folder), { withFileTypes: true }).catch(() => [])) {
    const file = path.posix.join(folder, entry.name);
    if (entry.isDirectory()) await checkStyles(file);
    else if (entry.name.endsWith('.css')) {
      const css = await readFile(path.join(root, file), 'utf8');
      for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/g)) {
        await checkReference(match[1] ?? match[2] ?? match[3], file, 'asset');
      }
    }
  }
}
await checkStyles('assets');

for (const name of routeNames) {
  const en = pages.get(`${name}.html`), fr = pages.get(`fr/${name}.html`);
  if (en && fr) {
    const h1 = html => text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
    expect(h1(en.html) !== h1(fr.html), `fr/${name}.html`, 'French heading must be translated');
  }
}

if (failures.length) {
  console.error(`Website checks failed (${failures.length}):\n${failures.map(message => `  - ${message}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${routes.length} pages, ${linksChecked} local links and ${assetsChecked} asset references.`);
  console.log('Language routes, metadata, contact links, no-propulsion scope and static accessibility checks passed.');
  console.log('Visual layout and JavaScript interactions require browser verification.');
}
