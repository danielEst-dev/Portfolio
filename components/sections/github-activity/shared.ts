import type { GitHubActivityPayload } from "@/lib/github";

// The "available" branch of the GitHub payload — the only shape the rendered
// panel ever operates on. The `{ available: false }` branch short-circuits to
// the Fallback before any sub-component mounts.
export type ActivityData = Extract<GitHubActivityPayload, { available: true }>;

// Staggered reveal variants for inner lists. Kept LOCAL to this folder per the
// audit split — do NOT import from lib/motion.ts (owned by another agent).
// The "show" parent triggers children; the "item" child fades up with the same
// easing used elsewhere in the codebase.
export const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};