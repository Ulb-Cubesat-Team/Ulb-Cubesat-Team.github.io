import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { copy, links, members, supporters, announcements } from './content.mjs';

// Content hash appended to CSS/JS URLs so browsers fetch the new files after each deploy.
const version = createHash('sha256').update(['styles.css', 'app.js'].map(f => readFileSync(new URL(`../assets/${f}`, import.meta.url))).join('')).digest('hex').slice(0, 8);

export const pages = ['home', 'payload', 'design', 'announcements', 'team', 'recruitment'];
export const filename = page => page === 'home' ? 'index.html' : `${page}.html`;
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.75"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" stroke="currentColor" stroke-width="1.75"/></svg>';
const link = (href, label, cls = 'text-link', isExternal = false) => `<a class="${cls}" href="${e(href)}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${e(label)}${isExternal ? external : arrow}</a>`;
const eyebrow = text => `<p class="eyebrow">${e(text)}</p>`;
const socialLinks = () => `<div class="social-links">${link(links.instagram, 'Instagram', 'text-link', true)}${link(links.linkedin, 'LinkedIn', 'text-link', true)}</div>`;
// Both logo variants are in the page; CSS shows the one that suits the active theme.
const brand = asset => `<img class="logo-light" src="${asset}brand/logo.svg" alt="ULB CubeSat Team" width="178" height="60"><img class="logo-dark" src="${asset}brand/logo-white.svg" alt="ULB CubeSat Team" width="178" height="60">`;
const sun = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.25" stroke="currentColor" stroke-width="1.75"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.75 1.75M16.95 16.95l1.75 1.75M5.3 18.7l1.75-1.75M16.95 7.05l1.75-1.75" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';
const moon = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>';
// Runs before first paint so a saved dark preference never flashes the light theme.
const themeBoot = `<script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}</script>`;
const siteURL = 'https://ulbcubesat.org/';
const logo = (lang, asset, cls = 'epb-logo') => `<img class="${cls}" src="${asset}images/logo-epb-ulb.png" alt="${e(copy[lang].logoAlt)}" width="900" height="184" loading="lazy">`;

function header(lang, page, asset) {
  const t = copy[lang];
  const current = filename(page === '404' ? 'home' : page);
  return `<a class="skip-link" href="#main">${e(t.skip)}</a>
  <header class="site-header"><div class="header-inner wrap">
    <a href="index.html" class="brand" title="ULB CubeSat Team — ${e(t.nav.home)}">${brand(asset)}</a>
    <nav class="navigation" id="navigation" aria-label="${lang === 'fr' ? 'Navigation principale' : 'Main navigation'}">${pages.filter(p => p !== 'home').map(p => `<a href="${filename(p)}"${page === p ? ' aria-current="page"' : ''}>${e(t.nav[p])}</a>`).join('')}</nav>
    <div class="header-controls"><button type="button" class="theme-toggle" aria-pressed="false" aria-label="${e(t.darkTheme)}" title="${e(t.darkTheme)}" hidden>${moon}${sun}</button><nav class="language-switch" aria-label="${e(t.language)}"><a href="${lang === 'en' ? '' : '../'}${current}" lang="en" hreflang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a><a href="${lang === 'en' ? 'fr/' : ''}${current}" lang="fr" hreflang="fr"${lang === 'fr' ? ' aria-current="true"' : ''}>FR</a></nav>
    <button class="menu-toggle" aria-label="${e(t.menu)}" aria-controls="navigation" aria-expanded="false" data-open-label="${e(t.menu)}" data-close-label="${e(t.closeMenu)}"><span>${e(t.menu)}</span><i aria-hidden="true"></i></button></div>
  </div></header>`;
}

function footer(lang, asset) {
  const t = copy[lang];
  return `<footer class="site-footer"><div class="wrap footer-main">
    <div class="footer-about"><a class="brand" href="index.html">${brand(asset)}</a><p>${e(t.footerLine)}</p></div>
    <div><h2 class="footer-title">${e(t.contact)}</h2><a class="footer-email" href="mailto:${links.email}">${links.email}</a></div>
    <div><h2 class="footer-title">${e(t.socials)}</h2>${socialLinks()}</div>
  </div><div class="wrap footer-bottom"><a class="footer-logo" href="https://polytech.ulb.be" target="_blank" rel="noopener noreferrer">${logo(lang, asset)}</a><span>© ${new Date().getFullYear()} ULB CubeSat Team</span></div></footer>`;
}

function pageHero(t, extra = '') {
  return `<section class="page-hero"><div class="wrap">${eyebrow(t.eyebrow)}<h1>${e(t.title)}</h1><div class="page-hero-bottom"><p class="intro">${e(t.intro)}</p>${extra}</div></div></section>`;
}

function home(lang, asset) {
  const t = copy[lang], h = t.home;
  return `<section class="home-hero"><div class="wrap hero-grid"><div class="hero-copy">${eyebrow(h.eyebrow)}<h1>${e(h.title)}</h1><p class="intro">${e(h.intro)}</p><div class="hero-actions">${link('payload.html', h.primary, 'button button-primary')}${link('recruitment.html', h.secondary, 'button button-secondary')}</div><div class="hero-affiliation"><span>${e(t.partOf)}</span>${logo(lang, asset)}</div></div></div></section>
  <section class="facts-strip" aria-label="${lang === 'fr' ? 'Chiffres clés' : 'Key facts'}"><dl class="wrap facts-grid">${h.facts.map(([value, label]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>
  <section class="section wrap mission-section"><div>${eyebrow(h.missionLabel)}<h2>${e(h.missionTitle)}</h2>${h.missionText.map(p => `<p class="body-large">${e(p)}</p>`).join('')}${link('payload.html', h.missionLink)}</div><div><h3 class="list-title">${e(h.stepsTitle)}</h3><ol class="numbered-list">${h.steps.map(([title, body]) => `<li><h4>${e(title)}</h4><p>${e(body)}</p></li>`).join('')}</ol></div></section>
  <section class="section-alt"><div class="wrap section"><h2>${e(h.exploreTitle)}</h2><div class="card-grid">${h.explore.map(([page, title, body]) => `<a href="${filename(page)}" class="card"><h3>${e(title)}${arrow}</h3><p>${e(body)}</p></a>`).join('')}</div></div></section>
  <section class="cta-banner"><div class="wrap"><div><h2>${e(h.joinTitle)}</h2><p>${e(h.joinText)}</p></div>${link('recruitment.html', h.joinLink, 'button button-white')}</div></section>`;
}

function team(lang, asset) {
  const t = copy[lang], c = t.team;
  return `${pageHero(c)}<section class="section wrap"><h2 class="section-title">${e(c.section)}</h2><ul class="team-grid">${members.map(member => `<li class="person">${member.photo ? `<img class="portrait" src="${asset}${e(member.photo)}" alt="" width="480" height="540" loading="lazy">` : `<span class="avatar" aria-hidden="true">${e(member.initials)}</span>`}<div><h3>${e(member.name)}</h3>${member.role ? `<p>${e(member.role[lang])}</p>` : ''}${member.board ? `<span class="board-tag">${e(t.board)}</span>` : ''}</div></li>`).join('')}</ul>
  <div class="inline-cta"><div><h3>${e(c.joinTitle)}</h3><p>${e(c.joinText)}</p></div>${link('recruitment.html', c.joinLink)}</div></section>
  <section class="section-alt"><div class="wrap section two-column"><div><h2>${e(c.supportTitle)}</h2><p>${e(c.supportText)}</p></div><dl class="spec-list">${supporters.map(s => `<div><dt>${e(s.name)}</dt><dd>${e(s.department)}</dd></div>`).join('')}</dl></div></section>`;
}

function intakeDiagram(c) {
  const trajectories = [80, 120, 160, 200, 240, 280, 320];
  return `<figure class="intake-figure" data-diagram data-step="environment"><p class="figure-label">${e(c.diagramLabel)}</p><svg viewBox="0 0 900 365" role="img" aria-label="${e(c.diagramNote)}"><defs><linearGradient id="funnel-fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#cfe0f0"/><stop offset="1" stop-color="#f2f7fb"/></linearGradient><marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 7 4-7 4" fill="none" stroke="#3a6fa8" stroke-width="1.4"/></marker></defs><g class="flow-field" stroke="#7aa2c8" stroke-width="1.2" fill="none">${trajectories.map((y, i) => `<path d="M60 ${y}H300L540 ${155 + i * 15}H706" stroke-dasharray="4 7" marker-end="url(#flow-arrow)"/><circle cx="${100 + (i % 3) * 50}" cy="${y}" r="3" fill="#2a64a0" stroke="none"/>`).join('')}</g><g class="intake-shell" fill="none"><path d="M300 64 540 150H732V260H540L300 336V315L535 240H711V171H535L300 87Z" fill="url(#funnel-fill)" stroke="#014a94" stroke-width="2"/><path d="M300 64V336M288 64h24M288 336h24M540 150v21M540 240v20M732 150v110" stroke="#014a94" stroke-width="2"/></g><g class="measurement-lines" stroke="#014a94" fill="none"><path d="M745 140h30v130h-30"/><circle cx="760" cy="203" r="32" stroke-width="1.5"/></g></svg><div class="diagram-legend"><span>${e(c.particles)}</span><span>${e(c.inlet)}</span><span>${e(c.collected)}</span></div><figcaption>${e(c.diagramNote)}</figcaption></figure>`;
}

function payload(lang) {
  const c = copy[lang].payload;
  return `${pageHero(c, `<p class="scope-note">${e(c.scope)}</p>`)}<section class="wrap section payload-section">${intakeDiagram(c)}<div class="experiment-explorer" data-explorer><div class="experiment-tabs" role="tablist" aria-label="${e(c.selectLabel)}" hidden>${c.tabs.map((tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" aria-controls="panel-${tab.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-step="${tab.id}">${e(tab.label)}</button>`).join('')}</div><div class="experiment-panels">${c.tabs.map(tab => `<section id="panel-${tab.id}" class="experiment-panel" data-panel="${tab.id}"><h2>${e(tab.heading)}</h2><p>${e(tab.body)}</p></section>`).join('')}</div></div><p class="footnote">${e(c.definition)}</p></section>`;
}

function recruitment(lang) {
  const c = copy[lang].recruitment;
  return `${pageHero(c, `<div class="hero-action"><p class="badge">${e(c.badge)}</p>${link(links.apply, c.apply, 'button button-primary', true)}</div>`)}<section class="section wrap"><h2 class="section-title">${e(c.pathwaysTitle)}</h2><div class="card-grid">${c.pathways.map(([type, title, body]) => `<article class="card card-static"><p class="card-label">${e(type)}</p><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></section><section class="section-alt"><div class="wrap section two-column"><h2>${e(c.skillsTitle)}</h2><ul class="tag-list">${c.skills.map(s => `<li>${e(s)}</li>`).join('')}</ul></div></section><section class="section wrap two-column"><div><h2>${e(c.processTitle)}</h2><div class="stacked-actions">${link(links.apply, c.apply, 'button button-primary', true)}${link(`mailto:${links.email}`, c.secondary)}</div></div><ol class="numbered-list">${c.process.map(([title, text]) => `<li><h3>${e(title)}</h3><p>${e(text)}</p></li>`).join('')}</ol></section>`;
}

function design(lang, asset) {
  const t = copy[lang], c = t.design;
  return `${pageHero(c)}<section class="section wrap two-column design-overview"><figure class="design-figure"><img src="${asset}cubesat-concept.svg" alt="${e(t.concept)}" width="760" height="760" loading="lazy"><figcaption>${e(t.concept)}</figcaption></figure><div><h2>${e(c.platformTitle)}</h2><p class="body-large">${e(c.platformText)}</p><dl class="spec-list">${c.table.map(([key, value]) => `<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></div></section><section class="section-alt"><div class="wrap section"><h2 class="section-title">${e(c.disciplinesTitle)}</h2><div class="card-grid card-grid-4">${c.disciplines.map(([title, body]) => `<article class="card card-static"><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></div></section>`;
}

function announcementPage(lang) {
  const c = copy[lang].announcements;
  const date = d => new Intl.DateTimeFormat(lang === 'fr' ? 'fr-BE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d));
  return `${pageHero(c)}<section class="section wrap">${announcements.length
    ? `<div class="news-list">${announcements.map(post => `<article><time datetime="${e(post.date)}">${date(post.date)}</time><div><h2>${e(post.title[lang])}</h2><p>${e(post.body[lang])}</p></div></article>`).join('')}</div>`
    : `<div class="empty-state"><h2>${e(c.emptyTitle)}</h2><p>${e(c.emptyText)}</p>${socialLinks()}</div>`}</section>`;
}

export function render(lang, page) {
  const t = copy[lang], asset = lang === 'fr' ? '../assets/' : 'assets/';
  const title = page === 'home' ? 'ULB CubeSat Team' : `${page === '404' ? t.notFound.title : t.nav[page]} — ULB CubeSat Team`;
  const bodies = { home, team, payload, recruitment, design, announcements: announcementPage };
  const body = page === '404' ? `<section class="section wrap not-found">${eyebrow('404')}<h1>${e(t.notFound.title)}</h1><p>${e(t.notFound.text)}</p>${link('index.html', t.back, 'button button-primary')}</section>` : bodies[page](lang, asset);
  const current = filename(page === '404' ? 'home' : page);
  return `<!doctype html>
<html lang="${lang}" id="top">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(t.meta)}">
<meta name="theme-color" content="#ffffff">${themeBoot}
<meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(t.meta)}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang === 'fr' ? 'fr_BE' : 'en_GB'}">
<meta property="og:image" content="${siteURL}assets/brand/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${asset}brand/favicon.svg"><link rel="apple-touch-icon" href="${asset}brand/apple-touch-icon.png">
<link rel="alternate" hreflang="en" href="${lang === 'fr' ? '../' : ''}${current}"><link rel="alternate" hreflang="fr" href="${lang === 'en' ? 'fr/' : ''}${current}">
<link rel="stylesheet" href="${asset}styles.css?v=${version}"><script src="${asset}app.js?v=${version}" defer></script>
</head><body class="page-${page}">${header(lang, page, asset)}<main id="main">${body}</main>${footer(lang, asset)}</body></html>\n`;
}
