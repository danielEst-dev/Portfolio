# Home section audit — additional dimensions

**Date:** 2026-06-20
**Scope:** same as [audit-home-2026-06-20.md](./audit-home-2026-06-20.md) — `app/`, `components/`, `lib/`, route handlers, error pages, config, content.
**Dimensions covered:** testing & QA, dependency & supply-chain security, deep accessibility (WCAG 2.2 AA), content & data integrity, resilience & graceful degradation, plus a lighter pass over design-system / DX-CI / legal-privacy.
**Method:** Six parallel read-only auditors. Static analysis only; runtime-dependent claims flagged explicitly. No files modified.

This is a companion to the first audit. The first covered dead code, architecture, performance, production readiness. This one covers the dimensions I recommended adding.

---

## Dimension verdicts at a glance

| Dimension | Verdict | One-line |
|---|---|---|
| Testing & QA | **Lint-and-typecheck only** | Zero tests, no test runner, no CI; only gates are Vercel build-on-push + a pre-commit secret scanner. Biggest blind spot. |
| Dependency & supply-chain | **Good** | 4 advisories, all dev/build-time only, no prod-runtime attack surface; all licenses permissive; no supply-chain risk signals. |
| Accessibility (WCAG AA) | **Partial conformance** | Real AA failures (muted-foreground opacity contrast, target sizes) + a Level A gap (skip link, heading hierarchy). |
| Content & data integrity | **Strong** | Internal links/slugs/routes all consistent; one verifiable accuracy bug (Oracle cert date); a few credential URLs need human verification. |
| Resilience & degradation | **Mixed** | API failure paths are excellent; systemic no-JS/pre-hydration invisibility (framer-motion `initial opacity:0`) + no fetch timeouts anywhere. |
| Design-system | **Strong foundation, soft editorial layer** | Tokens/radii/dark-parity excellent; eyebrow label + motion variants duplicated by hand. |
| DX / CI | **Below bar** | No CI, no typecheck step, README is stock boilerplate; pre-commit only does secret scan. |
| Legal / privacy | **Low risk** | One real gap: no privacy notice on the contact form. |

---

## Cross-cutting findings (flagged by ≥2 auditors → high confidence)

**1. No CI / no typecheck step.** Testing audit (HIGH) and DX audit (B2) both independently flag it: `.github/` does not exist, there's no `typecheck` script, and the pre-commit hook runs only the secret scanner. Every regression is caught only at Vercel build time. → Fix: one `ci.yml` running `npm ci && npm run lint && npx tsc --noEmit && npm run build`, plus a `"typecheck": "tsc --noEmit"` script. ~25 lines.

**2. TS strictness flags missing.** Testing audit (MED) and DX audit (B4) both flag `noUncheckedIndexedAccess`, `noUnusedLocals` absent from `tsconfig.json`. The contact route does `forwarded?.split(",")[0]?.trim()` and `parsed.error.issues[0]` — unsafe indexed access that the flag would catch. → Enable `noUncheckedIndexedAccess` first (highest value).

**3. The pre-hydration invisibility problem (resilience HIGH).** `MotionWrapper` and the hero use framer-motion `initial={{opacity:0}}`. SSR ships `opacity:0` inline; without JS (or on slow networks before hydration) the content never clears. The home page paints as an empty shell. → Fix: `<noscript><style>` forcing `opacity:1`, or a CSS-class-applied-on-mount reveal so SSR content is visible by default. *Only the resilience auditor caught this — it's the single biggest UX gap in the whole project and wasn't in the first audit.*

**4. Icon-only link target sizes < 24×24 (WCAG 2.5.8 AA).** Footer socials (~18×18), hero copy-email (~16×16), resume "View credential" (~16×16), contact LinkedIn/GitHub (~20×20). The prior mobile-audit P0 tap-target fixes evidently didn't cover these standalone icon links. → Wrap each in `inline-flex size-6 items-center justify-center`.

**5. The eyebrow label + framer-motion variants are duplicated by hand.** Design-system audit (A1/A2) and the first audit's "smaller cleanups" agree: `text-[11px] font-medium uppercase tracking-[0.18em]` re-typed ~15×, the `[0.25,0.1,0.25,1]` ease array re-declared in 6 sections. → `lib/motion.ts` + an `.eyebrow` utility / `<Eyebrow>` primitive.

**6. Dead `components/ui` files confirmed twice.** First audit + design-system audit both verified `card.tsx` and `badge.tsx` have zero consumers. → Delete, or adopt.

---

## Top fixes, ordered by impact (cross-dimension)

**1. Fix pre-hydration invisibility.** Add a `<noscript><style>` (or CSS-class-on-mount reveal) so content is visible without JS / before hydration. Affects every section via `MotionWrapper` + hero. *(Resilience HIGH — biggest single UX gap.)*

**2. Add minimal CI + a `typecheck` script.** `.github/workflows/ci.yml` running lint + `tsc --noEmit` + build; `"typecheck": "tsc --noEmit"` in package.json. Decouples the quality gate from Vercel. *(Testing HIGH + DX B2.)*

**3. Add a skip-to-content link.** First focusable element in `app/layout.tsx`, `id="main"` on `<main>`. Blocker for keyboard/SR users. *(A11y A/2.4.1 — also flagged in the first audit.)*

**4. Replace opacity-reduced `text-muted-foreground/40–/75` on informational text.** `experience.tsx` dates/roles, `skills.tsx` separator — all fail AA contrast (~1.7–3.2:1). Introduce a `--muted-foreground-strong` token ≥4.5:1. *(A11y AA/1.4.3 — the most systemic a11y failure.)*

**5. Make section labels headings (`<h2>`).** Home page is h1 → h3 with no h2; SR heading-nav can't reach About/Work/Experience/etc. Change `SectionLabel` to render `<h2>`. *(A11y A/1.3.1 + AA/2.4.6.)*

**6. Add fetch timeouts.** No `AbortSignal.timeout` anywhere — GitHub upstream, contact API external calls, client contact fetch can all hang unbounded. *(Resilience MEDIUM.)*

**7. Fix icon-only target sizes to ≥24×24.** Footer socials, hero copy button, resume credential link, contact socials. *(A11y AA/2.5.8.)*

**8. Fix the Oracle cert date.** `lib/data.ts:203` shows `Oct 2025 — Oct 2027`; live Oracle badge shows granted 07 Jun 2025 / expiring 07 Jun 2027. *(Content HIGH — a verifiable accuracy bug.)*

**9. Add a privacy notice on the contact form + `/privacy` page.** No statement of where data goes / that an auto-reply may be sent. ~15 min fix. *(Legal/privacy.)*

**10. Start the pragmatic test suite.** Vitest, 6 targets, ~25–35 tests — contact API (rollback logic), `lib/github.ts` reducers, OG `sanitize()`, contact form, `cn()`, `CountUp` reduced-motion. *(Testing — the highest-value targets only.)*

---

## Smaller / batchable

- **A11y:** Command-palette combobox — remove `outline-none`, make option elements `tabIndex={-1}` so `aria-activedescendant` owns the virtual cursor. Add a baseline `:focus-visible` outline in `globals.css`. `aria-hidden` on `SectionNumber` numerals. `aria-busy` + live region for GitHub loading→ready. `DialogDescription` (sr-only) for the command palette. Expose contribution-graph data accessibly (visually-hidden per-cell labels or `<table>` alternative).
- **Resilience:** Render mobile nav links inside `<noscript>`; default GitHub `status` to `"fallback"` (flip to loading in `useEffect`) so no-JS shows fallback not perpetual skeleton; add `action={mailto:}` / noscript CTA to contact form; wrap app in `<MotionConfig reducedMotion="user">`.
- **DX:** Replace stock README with real env/deploy docs; add `eslint-plugin-jsx-a11y` (or rely on next core-web-vitals); optionally extend pre-commit to run lint; a one-page `docs/architecture.md`.
- **TS:** Enable `noUnusedLocals`, `noUncheckedIndexedAccess` (highest value), consider `noImplicitOverride`.
- **Design-system:** Extract `lib/motion.ts` (`EASE`, `staggerContainer`, `fadeUp`); extract `.eyebrow` utility; gate the navbar's hardcoded theme-blind shadow behind a `dark:` variant or token; add a "these mirror `:root` tokens" comment in `global-error.tsx`.
- **Content:** Reconcile canonical job title ("Junior Backend Developer" vs manifest "Backend Engineer"); pick one ASP.NET Core/C# convention in `skills` vs `skillBeltItems`; verify freeCodeCamp slug, Fortinet codes, LinkedIn URL manually.
- **Dependency:** Watch for Next 16.2.10+ (clears the postcss advisory without overrides); do NOT run `npm audit fix --force` (it force-downgrades Next to 9.x); avoid `email:dev` on Windows with untrusted input until `@react-email/ui` bumps esbuild >0.28.

---

## What's done well (new strengths this round)

- **Contact API resilience** — every external-failure branch (Resend, render, missing config) rolls back the Upstash rate counter and returns a recoverable error; form re-enables in `finally`. *(Resilience)*
- **GitHub data degradation** — `next.revalidate` serves stale on error, client `AbortController` cleans up on unmount, zod schema means malformed responses fall to fallback not crash. *(Resilience)*
- **Error boundary pair** — `error.tsx` + `global-error.tsx` (inline-styled, Tailwind-independent) with `error.digest` logging. *(Resilience)*
- **Reduced-motion coverage** — thorough and consistent across canvas, CSS, framer-motion, count-up, conveyor, gated sparkline. *(A11y + Resilience)*
- **Contact form a11y** — explicit labels, `aria-invalid`, `aria-describedby`, `role="alert"` errors, `aria-busy` button, duplicate sr-only live region. *(A11y)*
- **Command-palette combobox semantics** — `role="combobox"`, `aria-activedescendant`, full Home/End/Arrow/Enter keys, focus restore on close. *(A11y)*
- **Token foundation** — Tailwind v4 `@theme inline` mapping is exemplary; dark mode is a pure variable swap giving automatic parity; radius scale derived from one `--radius`. *(Design-system)*
- **Data-minimization privacy posture** — no DB, only a short-TTL IP rate-limit counter that's rolled back on failure; no analytics/cookies. *(Legal/privacy)*
- **Dependency hygiene** — Next/React/eslint-config-next exact-pinned; `@react-email/ui` correctly in devDependencies (isolating its advisories from prod); all licenses permissive; reputable multi-maintainer packages. *(Supply-chain)*
- **Pre-commit secret scanner** — 7 token regexes with documented false-positive avoidance (Upstash boundary guards against lockfile integrity hashes). *(DX)*
- **Content consistency** — name/email/location/socials consistent everywhere; internal link graph fully consistent (nav → routes, slugs → `generateStaticParams`, anchors → section ids, `/resume.pdf` → file); metadata unique and placeholder-free. *(Content)*

---

## Needs runtime verification

- **A11y contrast** — every pair in the auditor's contrast table, especially `text-accent` on `bg-background` at small sizes (borderline) and all `text-muted-foreground/*` opacity variants, in both light + dark. Run axe in both themes.
- **A11y focus indicators** — links/buttons relying on UA default (nav, footer, `link-underline`); contact input 1px border vs WCAG 2.4.13 (2px minimum); command-palette Tab behavior under base-ui focus trap (does Tab desync `aria-activedescendant`?).
- **A11y SR output** — sonner toast live-region announcement; dialog focus trap; hero `<h1 aria-label>` read correctly over per-word motion spans.
- **Resilience** — pre-hydration paint on Slow 3G (confirm blank-shell-then-pop); home/projects/contact with JS disabled; contact API under a hanging Upstash (black-hole the URL); GitHub fetch hang (block api.github.com); reduced-motion on the GitHub cell cascade + language-bar fill (confirm they still animate — ungated).
- **Content** — freeCodeCamp `daniel_est_03` slug renders publicly; Fortinet codes map to the named certs; LinkedIn URL valid in browser; live project links (brewbank.app, ceu-vault.vercel.app, latinpay.com) still render intended content.
- **Performance** (carried from first audit) — production bundle sizes via `@next/bundle-analyzer`; `/` prerenders static; OG image font actually renders Geist (next/og doesn't auto-load next/font families).

---

## Appendix — dimension summaries

### Testing & QA (lint-and-typecheck only)
Zero tests, no test runner (no vitest/jest/playwright in deps), no test files, no CI (`.github/` absent), no `typecheck` script. Pre-commit runs only `check-secrets.mjs`. Vercel build-on-push is the only quality gate. TS strict but missing `noUnusedLocals`/`noUncheckedIndexedAccess`/`exactOptionalPropertyTypes`. Pre-commit scanner is well-built (7 token patterns, false-positive aware). **Pragmatic plan:** Vitest, 6 targets (~25–35 tests): contact API route (validation/CSRF/rate-limit/rollback/fail-closed), `lib/github.ts` reducers (`computeStreaks`, `computeTopLanguages` — needs exporting), OG `sanitize()` (needs exporting), contact-form component, `cn()`, `CountUp` reduced-motion path. Skip Playwright/e2e, snapshots, `lib/data.ts`, `lib/hooks.ts`, config files, email templates.

### Dependency & supply-chain (good)
4 advisories, all dev/build-time: postcss <8.5.10 (XSS in stringify — build-time, your own CSS) via Next's bundled postcss ×2, and esbuild 0.27.3–0.28.0 (Windows dev-server file read) via `@react-email/ui` (devDep). No prod-runtime vuln. No safe `npm audit fix` (force-downgrades Next to 9.x — do NOT run). Outdated: @base-ui/react, react-hook-form, resend — minor, `^`-safe. Major-bump-with-risk (dev-only): typescript 5→6, eslint 9→10, lucide-react 0.460→1.x (do NOT blind-upgrade; icon renames). Licenses all permissive (MIT/Apache/ISC). No supply-chain risk signals; reputable multi-maintainer packages. Lockfile v3, consistent, Next/React exact-pinned. Action: wait for Next 16.2.10+ to clear postcss; avoid `email:dev` on Windows w/ untrusted input.

### Accessibility (partial AA conformance)
Confirmed failures: skip link missing (A 2.4.1, Blocker); home heading hierarchy h1→h3 no h2 (A 1.3.1 + AA 2.4.6, Serious — SectionLabel renders spans not headings); muted-foreground opacity variants fail AA contrast (1.4.3, Serious — experience/skills dates ~1.7–3.2:1); icon-only link target sizes <24×24 (AA 2.5.8, Serious); command-palette `outline-none` + focusable options may desync `aria-activedescendant` (A 2.1.1/4.1.2, Serious — needs runtime). Needs runtime: computed contrast of all token pairs, focus-indicator visibility, sonner live-region, dialog trap. Strengths: reduced-motion thorough, contact-form a11y strong, combobox semantics correct, accordion aria correct, decorative canvases aria-hidden, landmarks + lang present.

### Content & data integrity (strong)
One verifiable bug: Oracle AI Foundations Associate cert date wrong (`lib/data.ts:203`: `Oct 2025 — Oct 2027` → should be `Jun 2025 — Jun 2027`, verified against live badge). Inconclusive (human-verify): LinkedIn (bot-blocked 999), freeCodeCamp slug (empty body), two Fortinet codes (resolve to generic form). Internal links/slugs/routes/anchors all consistent. Metadata unique/placeholder-free; sitemap/robots/metadataBase agree. Optional project fields conditionally rendered — nothing renders blank. Name/email/socials consistent everywhere. Minor: job-title string inconsistent (personalInfo "Junior Backend Developer" vs manifest "Backend Engineer"); ASP.NET Core/C# listed together in skills but split in skillBeltItems. No lorem/TODO/FIXME.

### Resilience & graceful degradation (mixed)
Strengths: contact API fail-closed + rollback; GitHub stale-on-error + AbortController cleanup; error boundary pair; theme FOUC handled (next-themes + suppressHydrationWarning). Gaps: **pre-hydration invisibility** (HIGH — framer-motion `initial opacity:0` ships in SSR, never clears without JS; affects all MotionWrapper sections + hero); **no fetch timeouts anywhere** (GitHub upstream, contact API, client fetch — all unbounded); mobile nav has no links without JS; contact form no `action` without JS (mitigated by existing mailto link); GitHub `status` defaults to `loading` so no-JS shows perpetual skeleton; GitHub cell cascade + language-bar fill not reduced-motion gated (no global `MotionConfig reducedMotion="user"`); per-route `error.tsx` missing so errors drop the navbar. Unknown slug → `notFound()` → good 404. No service worker (acceptable; manifest exists for install).

### Design-system (strong foundation, soft editorial)
Tokens/radii/dark-parity excellent (Tailwind v4 `@theme inline`, single-`--radius` derivation). Editorial drift: eyebrow label re-typed ~15×; framer-motion ease + variants duplicated 6×; navbar shadow hardcoded/theme-blind (reads wrong in dark); `global-error.tsx` uses raw hex (defensive, correct, just needs a "mirror tokens" comment). `card.tsx` + `badge.tsx` dead. Theme-transition scoping (color/fill/stroke only) is deliberate and well-documented. 100% lucide-react.

### DX / CI (below bar)
No `.github/` workflows; no `typecheck` script; README is unedited create-next-app boilerplate (no env/deploy docs — but `.env.example` is exemplary). TS strict but missing stricter flags. ESLint minimal (next/core-web-vitals + typescript only). Pre-commit wired and fires (secret scan only). Conventional commits consistent but unenforced. No architecture doc. `github-activity.tsx` 926 lines (known).

### Legal / privacy (low risk)
One real gap: no privacy notice on contact form (where data goes / auto-reply). Auto-reply is opt-in and off by default, but undisclosed if enabled. Data retention minimal and correct (email to owner via Resend, no DB; Upstash stores only 15-min-TTL IP counter, rolled back on failure). No cookies; localStorage only for theme. No analytics → no cookie banner needed. No privacy/terms/imprint page. Fix: one-paragraph form note + short `/privacy` page linked in footer; disclose Resend/Upstash/Vercel as processors in one sentence.