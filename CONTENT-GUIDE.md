# Content editing guide

Edit `src/content.mjs`, update both languages, run `npm run build`, then `npm run check`. Preview with `npm run dev`. Commit or upload the updated source and `dist/` together.

## Quick edits

| Change | What to update |
| --- | --- |
| Headings and descriptions | Matching English and French text in `src/content.mjs` |
| Contact or social links | Update `links`: use complete `https://` URLs for socials and applications, and a plain address for `email` |
| Team members | Set `role` to `{ en: '…', fr: '…' }` once confirmed; add portraits to `assets/` and set `photo` to the filename (e.g. `team/gael.webp`). Members without a role are shown by name only. Add `group: 'management'` for non-engineering roles (shown in their own amber group) |
| Announcements | Add a real title, ISO date and short update in both languages to the `announcements` array in `src/content.mjs` |
| Satellite details | Replace technical placeholders only with team-approved information |
| Page layout | `src/render.mjs` and the relevant stylesheet in `assets/` |

Unconfirmed details are left out of the pages rather than shown as placeholders; add them once confirmed. Do not use invented portraits, project milestones, partnerships or performance figures.

## Information supplied

- ULB CubeSat Team, École polytechnique de Bruxelles, Université libre de Bruxelles.
- A 3U CubeSat with an ABEP air-intake prototype; **no onboard propulsion**.
- A mission concept studying intake performance in very low Earth orbit. The old presentation mentions approximately 200 km as an objective, not a confirmed orbit.
- Student participation from BA2 to MA2; MA1 course projects, MA2 theses and open projects. The supplied recruitment presentation covers 2026–2027.
- Five names listed in the old presentation: Derbaise Gael, Desmedt Edouard, Fallik Gabriel, Lottin Enzo and Napolitano Pablo. Their roles and complete team membership are unconfirmed.
- Academic supporters listed in the source: Axel Coussement (ATM), Thierry Magin (ATM), François Quitin (BEAMS) and Cédric Boey (BAPP). This does not establish financial sponsorship.

The original Instagram, LinkedIn, application form and email links are retained. Review the form and recruitment information when opening a new academic year's applications.

## Still to complete

Team roles, biographies and photos; payload specifications; finalized spacecraft design; CAD and technical documents; confirmed project status; milestones and announcement dates; launch date and provider; mission orbit; budgets and partners.

All launch, build, test and operational statuses are unconfirmed. A conceptual drawing does not establish selected components or dimensions beyond the stated 3U format.

Do not describe the intake as a working propulsion system or imply this spacecraft can use it to maintain its orbit.

## Before publishing

Read the English and French pages, check the application form, and replace any placeholders you are ready to fill. Set your preferred search indexing policy explicitly; the old page's private-link `noindex` setting is not an instruction for this new site.
