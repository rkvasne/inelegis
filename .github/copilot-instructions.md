# Inelegis – Copilot Instructions

## Core Architecture
- Multi-page static frontend lives in `public/*.html` and consumes modules from `src/js` (main entry `src/js/script.js`). Always edit the sources in `src/`; the built copies under `public/assets/js` are overwritten by `npm run sync:js` / `npm run dev`.
- Search logic flows through `SearchIndex.buscar()` → `SearchHistory.add()` → modal rendering; keep results sanitized with helpers from `src/js/modules/sanitizer.js` and prefer the existing render functions instead of injecting raw `innerHTML`.
- CSS tokens, component primitives, and dark-mode rules are centralized in `public/styles/styles.css`. Extend styles by reusing the existing custom properties, and scope overrides with the `.dark-theme` class toggled by `ThemeManager`.
- Serverless endpoints in `api/` (analytics, dashboard, search-history) use Redis via `ioredis`. They expect `REDIS_URL`, `ANALYTICS_ADMIN_TOKEN`, etc. from `.env.local` / Vercel; don’t introduce new storage layers on the frontend—only the `inelegis_uid` cookie is persisted client-side.

## Critical Workflows
- `npm run dev` (alias for `npm run serve`) first syncs `src/js` → `public/assets/js` and then runs `scripts/serve.js` on `PORT` (defaults to 3300). Use this whenever you need hot updates while editing markup/CSS/JS.
- `npm run build` executes `scripts/build.js` and emits `dist/`; prebuild hooks force `npm run check` (lint + data validation + integration tests), so keep those scripts passing before attempting a production build.
- Test matrix: `npm run test:unit` runs the two core unit suites; `npm run test:all` chains unit + theme-manager + components + integration harness in `scripts/test.js`. Tests are plain Node programs (no Jest), so run individual files via `node tests/<name>.test.js` when debugging.
- Data integrity: after touching `src/js/data.js` or anything under `docs/references/`, run `npm run validate` (alias `node scripts/verify-data.js`) to ensure the TRE-SP mapping and indexes still align.
- Theme validation lives in `scripts/validate-theme.js`; use `npm run validate:theme:fix` before committing significant CSS changes to keep the design-system checker green.

## Patterns & Conventions
- UI components (`components.js`, `history-ui.js`, `modal-manager.js`, etc.) expose small factory methods; prefer composing these instead of duplicating markup per page.
- History/analytics UX (`HistoryPage`, `SearchHistory`) must continue to read/write via the API helpers. When Redis calls fail, fall back to cached in-memory data and surface status messages through `historyStatusMessage`.
- New CSS blocks should follow the structural comments already present in `styles.css` (tokens → layout → modules → dark theme). Keep selectors semantic (`.history-hero-headline`, `.stat-card`) and avoid IDs unless you are wiring them directly to JS.
- Never bypass the sanitizer when rendering user input (leis, artigos, observações). Use `Sanitizer.safeInnerHTML` or textContent assignments and keep templates in template literals with interpolated sanitized values.
- When editing docs, drop updates into `docs/` under the matching domain (`guides/`, `design/`, `history/`). High-level README changes should mirror the documentation so onboarding stays consistent.
- API development uses `vercel dev` with `.env.local`; keep the route signatures documented in `api/README.md` and reuse the shared Redis utility functions already exported in each handler.
