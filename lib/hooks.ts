import { useEffect, useState } from "react";

/**
 * Returns true if the user is on macOS/iOS, false otherwise.
 *
 * Returns `false` during SSR and the first client render so the markup
 * matches and React doesn't warn about hydration mismatches; the real
 * value is set in an effect and reflected on the next paint. On macOS
 * the navbar command-palette chip will swap from "Ctrl+K" to "⌘K" one
 * frame after mount.
 *
 * The `navigator.userAgent` value never changes during a session, so
 * this is a one-shot sync from the (client-only) platform to React
 * state — exactly the case where `react-hooks/set-state-in-effect` is
 * too strict. The alternatives are worse:
 *   - `useSyncExternalStore` with a no-op `subscribe` would never
 *     re-render, leaving Mac users stuck on "Ctrl+K" (the original bug).
 *   - Reading `navigator.userAgent` during render would hydrate-mismatch.
 */
// The `setIsMac` call below triggers `react-hooks/set-state-in-effect`,
// but the alternatives are worse — see the doc comment above.
export function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
  }, []);
  return isMac;
}

/**
 * Whether the current input can hover at all. Defaults to `true` during SSR
 * and the first client render to avoid a hydration mismatch, then resolves to
 * the real value in an effect. Touch devices report no hover, so callers drive
 * the "active" highlight from scroll position there instead of relying on
 * `:hover` (which has no equivalent on mobile). Used by the numbered-index
 * sections (Certifications, Skills).
 */
export function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return canHover;
}
