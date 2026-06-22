import type { Variants } from "framer-motion";

/**
 * Shared ease curve used across section entrance animations.
 * Extracted from the inline `[0.25, 0.1, 0.25, 1]` definitions that were
 * duplicated across the section files.
 */
export const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

/**
 * Shared item variant: fade + rise over 0.45s with the shared ease.
 * Used by sections whose list items share this exact entrance (e.g.
 * certifications, featured-projects).
 */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

/**
 * Shared container variant: stagger children by 0.04s with no child delay.
 * Sections whose entrance timing matches this can use it directly; sections
 * that need a different stagger/delay (e.g. skills) use `makeListContainer`.
 */
export const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

/**
 * Build a container variant with a custom stagger (and optional child delay)
 * for sections whose entrance timing differs from the shared `listContainer`.
 */
export function makeListContainer(
  stagger: number,
  delayChildren?: number,
): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}