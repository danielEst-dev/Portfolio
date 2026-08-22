# Home section + shared infra audit

**Date:** 2026-06-20
**Scope:** `app/page.tsx`, `app/layout.tsx`, all `components/sections/*`, `lib/*`, `components/ui/*`, shared `components/*`, route handlers, error/not-found pages, `next.config.ts`, env files.
**Method:** Four parallel read-only auditors (dead code, architecture, performance, production readiness). Next.js 16 APIs verified against `node_modules/next/dist/docs/`. No files modified.

---

## Headline verdicts

| Dimension | Verdict | One-line |
|---|---|---|
| Dead code | **~22 findings, 4 safe-deletes** | Two whole `components/ui` files (`card.tsx`, `badge.tsx`) have zero consumers; sections re-roll bespoke surfaces instead. |
| Architecture | **B+** | Strong data layer + error boundaries; undermined by client-island overuse and a broken `error.tsx` navbar claim. |
| Performance | **Good, one big win available** | All 9 sections ship eagerly to `/`; below-fold code-splitting + server-side GitHub fetch are the main levers. |
| Production readiness | **GO with caveats** | Hardened contact API + strict CSP + correct error boundaries; gaps are honeypot, skip-link, print styles, observability, `.env.preview` not gitignored. |

---

## Cross-cutting theme (flagged by ≥2 auditors → high confidence)

**The `components/ui` primitive library is half-dead and half-fought.**
- Dead code audit: `components/ui/card.tsx` (all 7 exports) and `components/ui/badge.tsx` (`Badge` + `badgeVariants`) have **zero** consumers repo-wide (grep-verified). `button.tsx` has a dead `buttonVariants` export + 9 unused CVA variant/size values; `dialog.tsx` has 7 unused sub-component exports.
- Architecture audit: sections use bespoke `corner-bracket border border-border/60 bg-secondary/30` styling instead of `Card`/`Badge`; `contact-form.tsx:151-156` imports `Button` but overrides every default token.

→ **One decision resolves both:** either adopt the primitives across sections (single source of truth for surfaces) or delete the unused ones so the library stops lying. Recommendation: **delete `card.tsx` + `badge.tsx`, trim `button.tsx`/`dialog.tsx` to live exports**, and keep bespoke section styling — it's intentional and looks good.

---

## Top fixes, ordered by impact (cross-dimension)

**1. Fix the `error.tsx` navbar loss — real UX bug.** `app/error.tsx:8-9` claims the navbar stays mounted above the boundary; it doesn't — `Navbar` is rendered per-page, not in `layout.tsx`. A runtime error on any page drops the navbar, leaving users only the "Go back home" link. Either hoist `Navbar` into `app/layout.tsx` (so it survives segment errors) or render `<Navbar />` inside `error.tsx` as `not-found.tsx` already does. *(Architecture MAJOR)*

**2. Move GitHub data to server-side props.** `components/sections/github-activity.tsx:426-443` fetches `/api/github` on mount → load→hydrate→fetch→render waterfall + first-paint skeleton flash. `lib/github.ts` already caches the upstream GraphQL response 6h via `next: { revalidate: 21600 }`. Call `getGitHubActivity()` in `app/page.tsx` (server) and pass as `initialData` to the client child that owns only tooltip/drag interactivity. Add `app/loading.tsx` (or `<Suspense>`) so the server fetch streams. *(Perf win #2 + Architecture MAJOR)*

**3. Code-split below-fold sections.** No `next/dynamic` exists repo-wide; all 9 `"use client"` sections ship eagerly to `/`. Note the v16 caveat: dynamic import of a Client Component **must live in a Client wrapper**, not directly in the server `app/page.tsx` (per `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`). Also lazy-load `command-palette.tsx` and `spotlight.tsx` (`ssr:false` — only needed on ⌘K / first mousemove). *(Perf win #1, biggest expected bundle reduction)*

**4. Delete the dead `components/ui` files + trim the rest.** Safe removes: `card.tsx`, `badge.tsx`, dead CSS at `globals.css:167` and `:270`, and the unused exports/variants in `button.tsx`/`dialog.tsx`. *(Dead code HIGH ×4)*

**5. Add `.env.preview` to `.gitignore`.** `.gitignore` covers `.env`, `.env.local`, `.env*.local`, `.env.production` — **not** `.env.preview`, which exists on disk untracked. A stray `git add .env.preview` commits preview secrets. *(Prod-readiness H1, one-line fix)*

**6. Add a contact-form honeypot.** CSRF + Upstash rate limit (3/15min/IP) are solid, but no honeypot. Add a visually-hidden field, reject non-empty server-side. *(Prod-readiness H2)*

**7. Add skip-link + print styles.** No skip-to-content link (keyboard/SR users tab through the whole sticky header each page); add `<a href="#main" className="sr-only focus:not-sr-only…">` as first child of `<body>` + `id="main"` on `<main>`. Resume page has no `@media print` rules despite being the obvious print target. *(Prod-readiness M1/M2)*

**8. Wire up minimal observability.** Error boundaries only `console.error` to the browser — a deploy operator never sees breakage. Add `@vercel/analytics` + `@vercel/speed-insights`, and/or forward error digests to a server endpoint. *(Prod-readiness H3)*

---

## Smaller cleanups (cheap, batchable)

- **Dead code:** Drop `export` from 7 internal-only symbols in `lib/github.ts` (lines 132, 138–141, 150, 160) — only `GitHubActivityPayload` is consumed externally.
- **Architecture:** Drop `"use client"` from `components/sections/education.tsx`, `components/sections/contact-cta.tsx`, `components/ui/label.tsx` — none use client-only features directly.
- **Duplication (dead code + architecture agree):** Extract the repeated `listContainer`/`listItem` Framer variants (duplicated byte-for-byte in `certifications.tsx`, `featured-projects.tsx`, redefined in `about/skills/github-activity`) and the inlined `[0.25,0.1,0.25,1]` easing (15+ sites) into `lib/motion.ts`.
- **Performance:** `hero.tsx` `LocalTime` re-renders the hero subtree every second via `setInterval` — update the time DOM imperatively via ref or drop seconds granularity. `spotlight.tsx` does `mousemove→setState→repaint` of a full-viewport fixed layer per move — switch to an imperative CSS custom property via ref. Both are the highest-frequency re-renders on the page.
- **Performance:** `code-particles.tsx:89-92` sets `ctx.font` inside the per-particle loop every frame (forces text re-shaping) — hoist once per draw; consider lowering the 55-particle count since it runs in the LCP window.
- **SEO:** Add JSON-LD `Person` schema on home + `BreadcrumbList` on project pages; add per-page `canonical` to each `metadata` export. All other SEO scaffolding (sitemap, robots, manifest, OG, `generateMetadata` for `[slug]`) is complete and correct.

---

## What's done well (don't touch)

- **`lib/github.ts`** — single viewer-scoped GraphQL query, zod at the trust boundary, 6h `revalidate` with stale-on-error, type-only client export, graceful `{available:false}` fallback. Both arch + perf auditors called it the strongest file.
- **Contact API** — server-side zod, CSRF origin allow-list + `sec-fetch-site`, atomic Upstash rate-limit pipeline with counter rollback on every failure path, fail-closed 503, generic error responses (no leakage), non-fatal auto-reply.
- **Error boundaries** — `error.tsx` uses v16.2 `unstable_retry` correctly; `global-error.tsx` renders its own `<html>/<body>` with inline styles (verified against in-repo docs). Only the *navbar claim* is wrong, not the boundary mechanics.
- **Security headers** — strict CSP (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`), HSTS preload-eligible, COOP, Referrer/Permissions-Policy; prod/dev CSP split drops `unsafe-eval` in prod.
- **Hydration discipline** — `CountUp`, `useIsMac`, `useCanHover`, `ThemeToggle`, GitHub tooltip portal all use `useSyncExternalStore` or effect-mounted state to avoid SSR/client mismatches.
- **`prefers-reduced-motion`** — respected consistently across canvas, CSS, framer-motion, count-up, conveyor, and the gated live sparkline (`live = rhythmInView && !reducedMotion`).
- **`next/font/google`** self-hosted Geist + Geist Mono with CSS variables (no CLS, no external request); metadata complete and consistent across every route.

---

## Needs a build/run to confirm

The `.next/` present is a **dev build** (unminified) — chunk sizes observed are not representative. Confirm with a production build:
- Actual gzip share of `framer-motion` and whether `react-email`/`resend`/`@upstash/redis` leak into any client chunk (`@next/bundle-analyzer`).
- Whether `next/dynamic` client-wrapper code-splitting actually shrinks the `/` initial chunk under Turbopack v16.
- That `/` prerenders as fully static (Σ static) in `next build` output.
- OG image font: `app/api/og/route.tsx` references `Geist Sans` but `next/og` doesn't auto-inherit `next/font` families — may render with a system fallback. Verify visually.
- `metadataBase` (`https://daniel-est.vercel.app`) matches the deployed domain in prod/preview.

---

## Appendix — full per-dimension findings

### Dead code (22 findings: 4 HIGH, 10 MEDIUM, 8 LOW)

**HIGH — safe to remove:**
- `components/ui/badge.tsx` — entire file dead (`Badge`, `badgeVariants` have zero external consumers).
- `components/ui/card.tsx` — entire file dead (all 7 exports unused).
- `app/globals.css:167` — `.link-underline-active::after` (no markup reference).
- `app/globals.css:270` — `.side-note` (no markup reference).

**MEDIUM — likely dead, verify:**
- `lib/github.ts:132,138-141,150,160` — 7 exported symbols used only internally (`GitHubResponseSchema`, `ContributionCell`, `GitHubActivityWeek`, `TopLanguage`, `PinnedRepo`, `GitHubIdentity`, `GitHubActivityAvailable`); drop `export`.
- `components/ui/button.tsx:43` — `buttonVariants` export dead (used internally only).
- `components/ui/dialog.tsx` — 7 dead exports: `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogHeader`, `DialogFooter`, `DialogDescription` (live: `Dialog`, `DialogContent`, `DialogTitle`).
- `components/ui/button.tsx:14,18,20,25-33` — CVA variants `secondary`/`destructive`/`link` and sizes `xs`/`sm`/`lg`/`icon`/`icon-xs`/`icon-lg` never rendered (only `default`/`outline`/`ghost` + `default`/`icon-sm` used).

**LOW — duplication / minor:**
- `certifications.tsx:13-25` vs `featured-projects.tsx:17-29` — identical `listContainer`/`listItem` variants.
- `certifications.tsx:34-39` vs `featured-projects.tsx:38-43` — identical "active card" detection pattern (`useRef`+`useReducedMotion`+`useInView`).
- `certifications.tsx:119-126` vs `featured-projects.tsx:111-118` — identical stagger-container JSX props.
- `education.tsx:84-92` vs `experience.tsx:190-199` — identical "View full resume" CTA link.
- `[0.25,0.1,0.25,1]` easing inlined across 15+ sites.
- `theme-toggle` conditional duplicated (`command-palette.tsx:132`, `theme-toggle.tsx:20`).
- `openCommandPalette` event dispatch duplicated (`navbar.tsx:185`, `open-command-palette-button.tsx:13`).
- `⌘K` shortcut label computed in 3 places; `ShortcutKbd` already exists but isn't reused.

No unused imports, unused props, no-op effects, commented-out code blocks, or unused env vars found.

### Architecture (grade B+)

Strengths and findings by category. CRITICAL/MAJOR/MINOR severities.

- **Server/client boundaries** — All 9 sections carry `"use client"`; `Education` and `ContactCta` use only already-client subcomponents and could be server. `components/ui/label.tsx` has `"use client"` despite no hooks.
- **Composition** — `github-activity.tsx` (926 lines) renders identity strip, stat grid, contribution graph, mobile drag-scroll, portaled tooltip, top-languages, activity-rhythm, sparkline, pinned repos — split into `components/sections/github-activity/*` siblings.
- **Data flow** — MAJOR: home page is server, `lib/github.ts` is a cached server data layer, yet `GitHubActivity` client-fetches `/api/github` → round trip + skeleton flash. Fetch in `app/page.tsx`, pass `initialData`.
- **Types** — `lib/data.ts` `projects`/`certifications`/`education`/`skills` are untyped literals with heterogeneous optional fields; consumers do `project.stats &&` with no compile-time guarantee. Define `Project`/`Certification`/`Education`/`SkillSet` interfaces (mirroring existing `Experience`).
- **Error handling** — MAJOR: `error.tsx:8-9` navbar comment is factually wrong; navbar is per-page, so errors lose it.
- **Patterns** — Motion variants + easing tuple duplicated across 5 sections; extract to `lib/motion.ts`.

### Performance

Biggest wins (ordered):
1. No code-splitting on `/` — all 9 client sections ship eagerly. Use a client `LazySection` (`next/dynamic` + IntersectionObserver) for below-fold sections. (Caveat: dynamic import must be in a Client wrapper, not the server page.)
2. GitHub fetch client-side → waterfall. Move to server props.
3. `CodeParticles` canvas rAF `fillText` loop (55 particles) runs in the LCP window; throttle to ~30fps / cache glyph atlas / lower count.
4. `Spotlight` repaints a full-viewport fixed layer per `mousemove`; use imperative CSS var via ref.
5. `LocalTime` re-renders hero every 1s; use ref-based imperative update.

Other:
- `section-number.tsx:9-16` `whileInView` with `once:false` re-animates on every scroll; use `once:true`.
- `code-particles.tsx:89-92` `ctx.font` set per-particle per-frame; hoist once.
- `github-activity.tsx:610-629` ~365 per-cell `motion.div` each register viewport observers; animate container once via CSS cascade.
- `github-activity.tsx:463-472` raw `<img>` for avatar (eslint-disabled); use `next/image` with `remotePatterns` (CSP already allows the host).
- `globals.css:280-291` `.animate-conveyor` runs even off-screen; toggle `animation-play-state` via IntersectionObserver or `content-visibility:auto`.

Looks well-optimized: `next/font`, `lib/github.ts` caching, edge OG route with immutable cache, strict CSP, consistent reduced-motion, IntersectionObserver-paused animations, `useSyncExternalStore` for reduced-motion, imperative tooltip (no per-cell re-render).

### Production readiness (GO with caveats)

Checklist (✅ Ready / ⚠️ Partial / ❌ Missing):
1. Error handling — ✅
2. Loading & Suspense — ⚠️ (no `loading.tsx`; GitHub is client-fetched with skeleton)
3. Forms & validation — ⚠️ (zod client+server; no honeypot, no captcha)
4. Email/API security — ✅
5. Secrets & env — ⚠️ (no `NEXT_PUBLIC_`; pre-commit scanner; `.env.preview` NOT gitignored)
6. Security headers/CSP — ✅
7. Accessibility — ⚠️ (ARIA good; no skip link)
8. SEO & metadata — ⚠️ (full per-page metadata; no JSON-LD, no per-page canonical)
9. Observability — ❌ (`console.*` only)
10. Build & config — ✅
11. Edge cases — ⚠️ (GitHub skeleton+fallback good; resume has no print CSS; no offline)
12. i18n — ✅ (English-only acceptable for portfolio)

No BLOCKERS. HIGH: H1 `.env.preview` not gitignored, H2 no honeypot, H3 no observability. MEDIUM: M1 skip-link, M2 resume print styles, M3 JSON-LD, M4 per-page canonical, M5 no loading.tsx. LOW: L1 CSP `unsafe-inline` (documented trade-off), L2 HSTS preload submission (skip on vercel.app), L3 Resend sandbox sender (fine since `TO_EMAIL` is owner).