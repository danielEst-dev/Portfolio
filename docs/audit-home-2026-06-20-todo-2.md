# Audit TODO 2 — additional dimensions

Generated from [audit-home-2026-06-20-dimensions-2.md](./audit-home-2026-06-20-dimensions-2.md) (testing, dependency security, a11y, content, resilience, design-system, DX/CI, legal/privacy). Check off as you go. Companion to the first [audit-home-2026-06-20-todo.md](./audit-home-2026-06-20-todo.md).

## P0 — high impact, low risk (batch these)

- [ ] **Fix the Oracle cert date** in `lib/data.ts:203`: `Oct 2025 — Oct 2027` → `Jun 2025 — Jun 2027` (verified against live badge).
- [ ] **Add `.env.preview` to `.gitignore`** (carried from TODO 1 — still open; currently untracked secret-leak risk).
- [ ] **Add `aria-hidden="true"`** to `components/section-number.tsx` numerals ("01"…"09" read as stray text to SRs).
- [ ] **Add `DialogDescription` (sr-only)** to `components/command-palette.tsx` so the dialog has an accessible description.

## P1 — high-impact behavior / a11y / resilience

- [ ] **Fix pre-hydration invisibility:** add `<noscript><style>` in `app/layout.tsx` forcing `opacity:1 !important; transform:none !important` on motion elements, OR switch reveals to a CSS class applied on mount. (Resilience HIGH — biggest UX gap; affects all `MotionWrapper` sections + hero.)
- [ ] **Add fetch timeouts:** `AbortSignal.timeout(ms)` on GitHub upstream fetch (`lib/github.ts:306`), each contact API external call (`app/api/contact/route.ts`), and a client `AbortController` + timeout on the contact form fetch (`components/contact-form.tsx:41`).
- [ ] **Add skip-to-content link** as first child of `<body>` in `app/layout.tsx`; add `id="main"` to `<main>`. (A11y Blocker 2.4.1 — also in TODO 1.)
- [ ] **Make `SectionLabel` render `<h2>`** so the home page has h1 → h2 → h3 hierarchy. (A11y 1.3.1/2.4.6.)
- [ ] **Replace `text-muted-foreground/40–/75` on informational text** with a `--muted-foreground-strong` token (≥4.5:1). Offenders: `experience.tsx:41-113`, `skills.tsx:87-91`. (A11y 1.4.3 — systemic.)
- [ ] **Fix icon-only link target sizes to ≥24×24:** footer socials, hero copy-email, resume "View credential", contact LinkedIn/GitHub. Wrap in `inline-flex size-6 items-center justify-center`. (A11y 2.5.8.)
- [ ] **Command-palette combobox:** remove `outline-none` from input; make option elements `tabIndex={-1}` so `aria-activedescendant` owns the virtual cursor. (A11y 2.1.1/4.1.2.)
- [ ] **Render mobile nav without JS:** render the mobile link list inside `<noscript>` in `components/navbar.tsx`. (Resilience.)
- [ ] **Default GitHub `status` to `"fallback"`** (flip to `loading` in `useEffect`) so no-JS shows fallback, not perpetual skeleton. `components/sections/github-activity.tsx:311`. (Resilience.)
- [ ] **Add a baseline `:focus-visible` outline** in `app/globals.css` (2px `--ring` + offset) for every focusable element. (A11y 2.4.7/2.4.13.)

## P1 — testing & CI (the biggest blind spot)

- [ ] **Add `.github/workflows/ci.yml`** running `npm ci && npm run lint && npx tsc --noEmit && npm run build` on push/PR.
- [ ] **Add `"typecheck": "tsc --noEmit"`** to `package.json` scripts.
- [ ] **Enable `noUnusedLocals` + `noUncheckedIndexedAccess`** in `tsconfig.json` (noUncheckedIndexedAccess highest value — catches unsafe `issues[0]` etc.).
- [ ] **Install Vitest** and add the 6 highest-value test targets: contact API route (validation/CSRF/rate-limit/rollback/fail-closed), `lib/github.ts` `computeStreaks`/`computeTopLanguages` (export them first), OG `sanitize()` (export it), contact-form component, `cn()`, `CountUp` reduced-motion path.
- [ ] (Optional) Extend pre-commit hook to run `npm run lint` alongside the secret scan.

## P2 — content / privacy / polish

- [ ] **Verify these credential URLs manually:** LinkedIn (`lib/data.ts:12`), freeCodeCamp slug (`:197`), both Fortinet codes (`:185, :191`).
- [ ] **Reconcile canonical job title:** "Junior Backend Developer" (`personalInfo.role`) vs "Backend Engineer" (`manifest.ts:8`) vs OG fallback — pick one.
- [ ] **Pick one ASP.NET Core/C# convention** — listed together in `skills.Backend` but split in `skillBeltItems`.
- [ ] **Add a privacy notice** on `components/contact-form.tsx` (one line: "Your message is emailed to me and not stored elsewhere…").
- [ ] **Add a short `/privacy` page** linked in the footer (data collected → where it goes → retention → no cookies/analytics → processor list).
- [ ] **Replace stock README** with real env-setup + deploy docs (the `.env.example` already has the raw material).
- [ ] **Extract `lib/motion.ts`** (`EASE`, `staggerContainer`, `fadeUp` variants) — removes ~6 copies of the ease array + container pattern.
- [ ] **Extract the eyebrow label** to a `.eyebrow` utility or `<Eyebrow>` primitive — collapses ~15 hand-typed copies.
- [ ] **Gate the navbar's hardcoded shadow** behind a `dark:` variant or drive the inset from a token (`components/navbar.tsx:116` — reads wrong in dark mode).
- [ ] **Expose the contribution-graph data accessibly** in `github-activity.tsx` — visually-hidden per-cell labels or `<table>` alternative; make the tooltip keyboard/focus-driven + `aria-live`. (A11y 1.3.1/1.4.1.)
- [ ] **Add `aria-busy` + live region** for the GitHub loading→ready transition. (A11y 4.1.3.)
- [ ] **Wrap app in `<MotionConfig reducedMotion="user">`** in `app/layout.tsx` so the GitHub cell cascade + language-bar fills respect the preference without per-variant gating.

## P3 — dependency / cleanup

- [ ] **Do NOT run `npm audit fix --force`** (force-downgrades Next to 9.x). Watch for Next 16.2.10+ to clear the postcss advisory cleanly.
- [ ] **Avoid `npm run email:dev` on Windows with untrusted input** until `@react-email/ui` bumps esbuild >0.28.0.
- [ ] (Optional) Add `"overrides": { "postcss": "^8.5.10" }` + reinstall to clear the postcss advisory early — verify build after. Requires your approval (not read-only).
- [ ] **Do NOT blind-upgrade lucide-react** 0.460 → 1.x (review changelog for icon renames); schedule typescript 5→6 and eslint 9→10 separately (both breaking, dev-only).
- [ ] **Delete `components/ui/card.tsx` + `badge.tsx`** (carried from TODO 1 — still open, dead code).
- [ ] **Add a "these mirror `:root` tokens" comment** in `app/global-error.tsx` so the raw hex values don't drift from the palette.
- [ ] (Optional) Add `eslint-plugin-jsx-a11y` and `eslint-plugin-import` if you want lint-time a11y + import-order enforcement.
- [ ] (Optional) Write a one-page `docs/architecture.md` (routes → sections → data flow → contact pipeline) for future contributors/LLMs.

## Verify (needs a build / browser / manual check)

- [ ] **A11y contrast:** run axe in both light + dark; confirm all `text-muted-foreground/*` pairs + `text-accent` on `bg-background` at small sizes.
- [ ] **A11y focus:** confirm visible focus rings on nav/footer/`link-underline` links; measure contact input 1px border vs WCAG 2.4.13; confirm command-palette Tab doesn't desync `aria-activedescendant`.
- [ ] **A11y SR:** confirm sonner toasts announce; dialog focus trap; hero `<h1 aria-label>` reads correctly over motion spans.
- [ ] **Resilience:** load home on Slow 3G (confirm blank-shell-then-pop); load home/projects/contact with JS disabled; black-hole Upstash URL (confirm contact API hangs, no timeout); block api.github.com (confirm GitHub skeleton persists); enable reduced-motion (confirm GitHub cascade + language-bar still animate — ungated).
- [ ] **Content:** confirm freeCodeCamp cert renders publicly; confirm Fortinet codes map to named certs; confirm LinkedIn + live project links in a browser.
- [ ] **Performance (from TODO 1):** `@next/bundle-analyzer` production run; confirm `/` prerenders static; confirm OG image renders in Geist (next/og doesn't auto-load next/font).