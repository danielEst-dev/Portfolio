// Brand tokens for email templates. Email clients don't resolve CSS variables,
// so these are hardcoded hex values lifted from app/globals.css (:root).
// Keep in sync with the light-mode palette there.

export const TOKENS = {
  // Surfaces
  BG: "#FAF9F6", // card / inner surface (cream)
  CANVAS: "#F3F1EC", // outer body canvas (warm secondary)
  FG: "#1A1A1A", // primary text / ink
  MUTED: "#6B6B6B", // secondary text / labels
  ACCENT: "#8B6F5C", // warm taupe — accent rule, mono ring, focus
  BORDER: "#E5E2DB", // hairline borders / dividers
  DESTRUCTIVE: "#B54A4A",
} as const;

export const SANS_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
export const MONO_STACK =
  "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace";

// Brand identity. Hardcoded here (not coupled to lib/data.ts, which has no
// tagline field and uses a different role label) — the email is a fixed brand
// artifact. Matches the OG route's hardcoding convention.
export const BRAND = {
  name: "Daniel Anthony S. Estrella",
  role: "Backend Engineer",
  tagline: "Building systems that scale.",
  site: "https://daniel-est.vercel.app",
  monogram: "DE",
} as const;