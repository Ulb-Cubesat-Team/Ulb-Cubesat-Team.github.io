# ULB CubeSat

A bilingual (EN/FR) static website for the ULB CubeSat Team: mission (payload and spacecraft), news, team, partners and recruitment.

The payload is an **ABEP air-intake prototype. The satellite has no onboard propulsion.**

## Preview and build

Use Node.js 20 or newer. There are no package dependencies to install.

```sh
npm run build
npm run check
npm run dev
```

Open `http://localhost:4173`. Rebuild after editing source files, then refresh the browser. `npm run check` validates the generated website.

## Edit the site

| File or folder | Purpose |
| --- | --- |
| `src/content.mjs` | English and French text, links and editable content |
| `src/render.mjs` | Page templates and shared navigation |
| `assets/` | Styles, browser interactions, logo and illustration |
| `scripts/` | Build, checks and local preview server |
| `dist/` | Complete generated website (Cloudflare build output) |
| `*.html`, `fr/` at the root | Copies of the generated pages, so GitHub Pages serves the same site. Do not edit by hand |

Edit the source, then run `npm run build`. Changes made only inside `dist/` are overwritten by the next build. See `CONTENT-GUIDE.md` for the content checklist.

English pages are at `index.html`, `payload.html` (payload and spacecraft), `announcements.html`, `team.html`, `partners.html` and `recruitment.html`; `design.html` only redirects to `payload.html#spacecraft`. French pages mirror these filenames under `fr/`. Each language has its own HTML pages; the language switch opens the equivalent page.

## GitHub and Cloudflare Pages

Upload this repository's files and folders to your GitHub repository. Keep `package.json`, `src/`, `assets/` and `scripts/` at the repository root.

For the Cloudflare Pages project connected to that repository, use:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node.js | 20 or newer |

Cloudflare builds and deploys the static output when the connected branch changes. See Cloudflare's [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) and [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

For a buildless deployment, use the included `dist/` as the site root: its `index.html` must be at the published root. On a Git-connected Pages project, you can use build command `exit 0` with output directory `dist`; rebuild and upload the updated `dist/` whenever you change the source. See [static HTML hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

A separate Pages Direct Upload project can receive the `dist/` folder, or a ZIP containing its contents. Dashboard drag-and-drop is unavailable for an existing Git-connected Pages project. See [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## Content and assets

The supplied logo is adapted for a light background. The satellite illustration is a visual concept, not confirmed flight hardware or CAD. Names, contact details and recruitment information come from the supplied HTML; missing details remain visible placeholders.

Archivo is served locally; its open font license is included in `assets/fonts/`. The EPB/ULB logo is in `assets/images/` (`logo_EPB.png` is the full-resolution original, `logo-epb-ulb.png` the web-sized copy used by the pages).

No launch, manufacturing, testing or flight-readiness status is confirmed. The source page's `noindex` setting has not been carried over automatically; choose your search visibility before publishing. No license has been assigned by this repository.
