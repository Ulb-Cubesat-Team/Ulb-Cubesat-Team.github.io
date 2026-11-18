import { copy, links, members, supporters, announcements } from './content.mjs';

export const pages = ['home', 'team', 'payload', 'recruitment', 'design', 'announcements'];
export const filename = page => page === 'home' ? 'index.html' : `${page}.html`;
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const diagonal = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5"/></svg>';
const link = (href, label, cls = 'text-link', external = false) => `<a class="${cls}" href="${e(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${e(label)}${external ? diagonal : arrow}</a>`;
const heading = (lines, tag = 'h1') => `<${tag}>${e(lines[0])}<br><span>${e(lines[1])}</span></${tag}>`;
const eyebrow = text => `<p class="eyebrow">${e(text)}</p>`;
const socialLinks = (cls = 'social-links') => `<div class="${cls}">${link(links.instagram, 'Instagram', 'text-link', true)}${link(links.linkedin, 'LinkedIn', 'text-link', true)}</div>`;
const star = '<svg class="orbit-star" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="50" r="29" stroke="currentColor" stroke-width="1.5"/></svg>';

function header(lang, page, asset) {
  const t = copy[lang];
  return `<a class="skip-link" href="#main">${e(t.skip)}</a>
  <header class="site-header"><div class="header-inner">
    <a href="index.html" class="brand" aria-label="ULB CubeSat Team — ${e(t.nav.home)}"><img src="${asset}mark.svg" alt="" width="44" height="44"><span>ULB<span class="brand-bottom">CUBESAT TEAM</span></span></a>
    <nav class="navigation" id="navigation" aria-label="${lang === 'fr' ? 'Navigation principale' : 'Main navigation'}">${pages.filter(p => p !== 'home').map(p => `<a href="${filename(p)}"${page === p ? ' aria-current="page"' : ''}>${e(t.nav[p])}</a>`).join('')}</nav>
    <div class="header-controls"><nav class="language-switch" aria-label="${e(t.language)}"><a href="${lang === 'en' ? '' : '../'}${filename(page === '404' ? 'home' : page)}" lang="en" hreflang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a><span aria-hidden="true">/</span><a href="${lang === 'en' ? 'fr/' : ''}${filename(page === '404' ? 'home' : page)}" lang="fr" hreflang="fr"${lang === 'fr' ? ' aria-current="true"' : ''}>FR</a></nav>
    <button class="menu-toggle" aria-label="${e(t.menu)}" aria-controls="navigation" aria-expanded="false" data-open-label="${e(t.menu)}" data-close-label="${e(t.closeMenu)}"><span>${e(t.menu)}</span><i aria-hidden="true"></i></button></div>
  </div></header>`;
}

function footer(lang, asset) {
  const t = copy[lang];
  return `<footer class="site-footer"><div class="wrap footer-main"><div class="footer-brand"><a class="brand" href="index.html"><img src="${asset}mark.svg" alt="" width="44" height="44"><span>ULB<span class="brand-bottom">CUBESAT TEAM</span></span></a><p>${e(t.footerLine)}</p></div><div><p class="eyebrow">${e(t.contact)}</p><a class="footer-email" href="mailto:${links.email}">${links.email}</a></div><div><p class="eyebrow">${e(t.socials)}</p>${socialLinks()}</div></div><div class="wrap footer-bottom"><span>${e(t.footerNote)}</span><span class="mono">ULB CUBESAT / 2026–2027</span><a href="#top" aria-label="${lang === 'fr' ? 'Retour en haut' : 'Back to top'}">↑</a></div></footer>`;
}

function pageHero(t, extra = '', cls = '') {
  return `<section class="page-hero ${cls}"><div class="wrap">${eyebrow(t.eyebrow)}${heading(t.title)}<div class="page-hero-bottom"><p class="intro">${e(t.intro)}</p>${extra}</div></div><div class="hero-coordinate" aria-hidden="true">50° 51′ N<br>04° 21′ E</div></section>`;
}

function home(lang, asset) {
  const t = copy[lang], h = t.home;
  return `<section class="home-hero"><div class="wrap hero-grid"><div class="hero-copy">${eyebrow(h.eyebrow)}${heading(h.title)}<p class="intro">${e(h.intro)}</p><div class="hero-actions">${link('payload.html', h.primary, 'button button-primary')}${link('team.html', h.secondary)}</div><div class="hero-affiliation"><span class="mini-orbit" aria-hidden="true"></span><span>${e(t.school)}<br><strong>Université libre de Bruxelles</strong></span></div></div>
  <figure class="satellite-stage"><span class="giant-unit" aria-hidden="true">3U</span><div class="drawing-top"><span class="crosshair" aria-hidden="true">+</span><span>${e(h.illustrationLabel)}</span><span class="crosshair" aria-hidden="true">+</span></div><img class="hero-satellite" src="${asset}cubesat-concept.svg" alt="${lang === 'fr' ? 'Illustration conceptuelle d’un CubeSat 3U à panneaux bleus et entrée d’air sur sa face supérieure' : 'Concept illustration of a 3U CubeSat with blue panels and an air intake on its upper face'}" width="760" height="760" fetchpriority="high"><span class="diagram-callout intake-callout"><i></i>${e(h.intakeLabel)}</span><span class="diagram-callout structure-callout"><i></i>${e(h.structureLabel)}</span><figcaption><span>FIG. 01</span>${e(t.concept)}</figcaption></figure></div>
  <div class="hero-baseline wrap"><span class="mono">ULB CUBESAT TEAM</span><span class="scroll-cue" aria-hidden="true">↓</span><span class="mono">BRUSSELS → VLEO</span></div></section>
  <div class="facts-strip"><div class="wrap facts-grid">${h.facts.map(([value, label]) => `<div><strong>${e(value)}</strong><span>${e(label)}</span></div>`).join('')}</div></div>
  <section class="section wrap mission-section"><div>${eyebrow(h.missionLabel)}${heading(h.missionTitle, 'h2')}<p class="body-large">${e(h.missionText)}</p><p class="mission-note">${e(h.missionNote)}</p>${link('payload.html', h.missionLink)}</div><div class="mission-steps">${h.steps.map(([title, body], i) => `<div class="mission-step"><span class="step-number mono">0${i + 1}</span><div><h3>${e(title)}</h3><p>${e(body)}</p></div><span class="step-mark" aria-hidden="true">${['↘', '◎', '＋'][i]}</span></div>`).join('')}</div></section>
  <section class="explore-section"><div class="wrap section">${eyebrow(h.exploreLabel)}<h2>${e(h.exploreTitle)}</h2><div class="explore-grid">${h.explore.map(([page, title, body, number]) => `<a href="${filename(page)}" class="explore-item"><div class="explore-art art-${page}" aria-hidden="true"><span class="mono">${number} / ${e(t.nav[page])}</span>${page === 'team' ? '<div class="team-orbits"><i></i><i></i><i></i><b>+</b></div>' : page === 'design' ? '<div class="wire-cube"><i></i><i></i><i></i></div>' : '<div class="journal-lines"><i></i><i></i><i></i><span>↗</span></div>'}</div><div class="explore-heading"><h3>${e(title)}</h3>${arrow}</div><p>${e(body)}</p></a>`).join('')}</div></div></section>
  ${joinBanner(lang)}`;
}

function joinBanner(lang) {
  const t = copy[lang].home;
  return `<section class="join-banner"><div class="wrap">${star}<div>${eyebrow(t.joinEyebrow)}<h2>${e(t.joinTitle)}</h2><p>${e(t.joinText)}</p></div>${link('recruitment.html', t.joinLink, 'button button-white')}</div></section>`;
}

function team(lang, asset) {
  const t = copy[lang], c = t.team;
  return `${pageHero(c, '<span class="page-symbol" aria-hidden="true">↗</span>')}<section class="section wrap"><div class="section-heading"><h2>${e(c.section)}</h2><p>${e(c.note)}</p></div><div class="team-grid">${members.map((member, i) => `<article class="person"><div class="portrait${member.photo ? ' has-photo' : ''}">${member.photo ? `<img src="${asset}${e(member.photo)}" alt="${e(member.name)}" width="480" height="540" loading="lazy">` : `<span class="portrait-index mono">0${i + 1}</span><span class="initials" aria-hidden="true">${e(member.initials)}</span><span class="photo-note mono">${e(t.photoPlaceholder)}</span><span class="portrait-cross" aria-hidden="true">+</span>`}</div><h3>${e(member.name)}</h3><p>${e(member.role[lang])}</p></article>`).join('')}<article class="person join-person"><div>${star}<h3>${e(c.joinTitle)}</h3><p>${e(c.joinText)}</p>${link('recruitment.html', c.joinLink)}</div></article></div></section><section class="academic-section section"><div class="wrap academic-grid"><div>${eyebrow('ULB / EPB')}<h2>${e(c.supportTitle)}</h2><p>${e(c.supportText)}</p></div><div class="supporter-list">${supporters.map(s => `<div><h3>${e(s.name)}</h3><span class="mono">${e(s.department)}</span></div>`).join('')}</div></div></section>`;
}

function intakeDiagram(c) {
  const trajectories = [80, 120, 160, 200, 240, 280, 320];
  return `<figure class="intake-figure" data-diagram data-step="environment">${eyebrow(c.diagramLabel)}<svg viewBox="0 0 900 365" role="img" aria-label="${e(c.diagramNote)}"><defs><linearGradient id="funnel-fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#c4dff4"/><stop offset="1" stop-color="#eff7fd"/></linearGradient><marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 7 4-7 4" fill="none" stroke="#377bb6" stroke-width="1.4"/></marker></defs><g class="flow-field" stroke="#73a8d1" stroke-width="1.2" fill="none">${trajectories.map((y, i) => `<path d="M60 ${y}H300L540 ${155 + i * 15}H706" stroke-dasharray="4 7" marker-end="url(#flow-arrow)"/><circle cx="${100 + (i % 3) * 50}" cy="${y}" r="3" fill="#2d75b5" stroke="none"/>`).join('')}</g><g class="intake-shell" fill="none"><path d="M300 64 540 150H732V260H540L300 336V315L535 240H711V171H535L300 87Z" fill="url(#funnel-fill)" stroke="#1d4d90" stroke-width="2"/><path d="M300 64V336M288 64h24M288 336h24M540 150v21M540 240v20M732 150v110" stroke="#1d4d90" stroke-width="2"/><path d="M320 52 550 133H746M320 349 550 279H746" stroke="#8baeca" stroke-width="1" stroke-dasharray="3 5"/></g><g class="measurement-lines" stroke="#1d4d90" fill="none"><path d="M745 140h30v130h-30"/><path d="M760 140v130" stroke-dasharray="3 5"/><circle cx="760" cy="203" r="32" stroke-width="1.5"/></g></svg><div class="diagram-legend"><span>${e(c.particles)}</span><span>${e(c.inlet)}</span><span>${e(c.collected)}</span></div><figcaption><span>FIG. 02</span>${e(c.diagramNote)}</figcaption></figure>`;
}

function payload(lang) {
  const c = copy[lang].payload;
  return `${pageHero(c, `<div class="scope-note"><span aria-hidden="true">↳</span>${e(c.scope)}</div>`)}<section class="wrap section payload-section">${intakeDiagram(c)}<div class="experiment-explorer" data-explorer><div class="experiment-tabs" role="tablist" aria-label="${e(c.selectLabel)}" hidden>${c.tabs.map((tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" aria-controls="panel-${tab.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-step="${tab.id}"><span class="mono">${tab.number}</span>${e(tab.label)}</button>`).join('')}</div><div class="experiment-panels">${c.tabs.map(tab => `<section id="panel-${tab.id}" class="experiment-panel" data-panel="${tab.id}"><h2>${e(tab.heading)}</h2><div><p>${e(tab.body)}</p><p class="experiment-detail mono">${e(tab.detail)}</p></div></section>`).join('')}</div></div><p class="abep-definition">${e(c.definition)}</p></section><section class="pending-section section"><div class="wrap two-column"><h2>${e(c.detailsTitle)}</h2><dl class="spec-list">${c.details.map(([key, value]) => `<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></div></section>`;
}

function recruitment(lang) {
  const c = copy[lang].recruitment;
  return `${pageHero(c, `<div class="recruit-hero-action"><span class="mono">${e(c.badge)}</span>${link(links.apply, c.apply, 'button button-primary', true)}</div>`, 'recruit-hero')}<section class="section wrap"><div class="section-heading"><h2>${e(c.pathwaysTitle)}</h2><span class="mono">BA2 → MA2</span></div><div class="pathways">${c.pathways.map(([number, type, title, body]) => `<article class="pathway"><div class="pathway-top"><span class="pathway-number">${number}</span><span class="mono">${e(type)}</span></div><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></section><section class="skills-section"><div class="wrap"><h2>${e(c.skillsTitle)}</h2><ul class="skills-list">${c.skills.map(s => `<li>${e(s)}</li>`).join('')}</ul></div></section><section class="section wrap apply-section"><div><h2>${e(c.processTitle)}</h2>${link(links.apply, c.apply, 'button button-primary', true)}<p class="small muted">${e(c.note)}</p>${link(`mailto:${links.email}`, c.secondary)}</div><ol class="apply-steps">${c.process.map(([title, text], i) => `<li><span class="mono">0${i + 1}</span><div><h3>${e(title)}</h3><p>${e(text)}</p></div></li>`).join('')}</ol></section>`;
}

function design(lang, asset) {
  const t = copy[lang], c = t.design;
  return `${pageHero(c, '<span class="page-symbol design-symbol" aria-hidden="true">3U</span>')}<section class="section wrap design-overview"><figure class="design-drawing">${eyebrow(c.figureLabel)}<img src="${asset}cubesat-concept.svg" alt="${e(t.concept)}" width="760" height="760"><figcaption><span>FIG. 01</span>${e(t.concept)}</figcaption></figure><div class="design-specs"><h2>${e(c.platformTitle)}</h2><p>${e(c.platformText)}</p><h3 class="eyebrow">${e(c.tableTitle)}</h3><dl class="spec-list">${c.table.map(([key, value]) => `<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></div></section><section class="disciplines-section section"><div class="wrap"><h2>${e(c.disciplinesTitle)}</h2><div class="discipline-grid">${c.disciplines.map(([title, body], i) => `<article><span class="mono">0${i + 1}</span><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></div></section><section class="section wrap documents-section"><div><h2>${e(c.documentsTitle)}</h2><p>${e(c.documentsText)}</p></div><span class="status-label"><i aria-hidden="true"></i>${e(c.documentsStatus)}</span></section>`;
}

function announcementPage(lang) {
  const c = copy[lang].announcements;
  return `${pageHero(c, '<span class="page-symbol" aria-hidden="true">↙</span>')}<section class="section wrap journal-section">${announcements.length ? `<div class="journal-list">${announcements.map(post => `<article><time class="mono" datetime="${e(post.date)}">${new Intl.DateTimeFormat(lang === 'fr' ? 'fr-BE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date))}</time><div><h2>${e(post.title[lang])}</h2><p>${e(post.body[lang])}</p></div></article>`).join('')}</div>` : `<div class="journal-empty"><div class="signal-art" aria-hidden="true"><span></span><span></span><span></span><b>+</b></div><div>${eyebrow(c.emptyLabel)}<h2>${e(c.emptyTitle)}</h2><p>${e(c.emptyText)}</p>${socialLinks()}</div><span class="empty-cross" aria-hidden="true">+</span></div>`}</section><section class="social-banner"><div class="wrap"><div><h2>${e(c.socialTitle)}</h2><p>${e(c.socialText)}</p></div>${socialLinks()}</div></section>`;
}

export function render(lang, page) {
  const t = copy[lang], asset = lang === 'fr' ? '../assets/' : 'assets/';
  const title = `${page === 'home' ? 'ULB CubeSat Team' : `${t.nav[page] || '404'} — ULB CubeSat Team`}`;
  const bodies = { home, team, payload, recruitment, design, announcements: announcementPage };
  const body = page === '404' ? `<section class="section wrap not-found">${eyebrow('404 / ULB CUBESAT')}<h1>${e(t.notFound.title)}</h1><p>${e(t.notFound.text)}</p>${link('index.html', t.back, 'button button-primary')}</section>` : bodies[page](lang, asset);
  return `<!doctype html>
<html lang="${lang}" id="top">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(t.meta)}">
<meta name="theme-color" content="#edf6fc">
<meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(t.meta)}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang === 'fr' ? 'fr_BE' : 'en_GB'}">
<link rel="icon" type="image/svg+xml" href="${asset}mark.svg">
<link rel="alternate" hreflang="en" href="${lang === 'fr' ? '../' : ''}${filename(page === '404' ? 'home' : page)}"><link rel="alternate" hreflang="fr" href="${lang === 'en' ? 'fr/' : ''}${filename(page === '404' ? 'home' : page)}">
<link rel="stylesheet" href="${asset}styles.css"><script src="${asset}app.js" defer></script>
</head><body class="page-${page}">${header(lang, page, asset)}<main id="main">${body}</main>${footer(lang, asset)}</body></html>\n`;
}
