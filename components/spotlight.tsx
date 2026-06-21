"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Subscribe to (prefers-reduced-motion: reduce). Returns false on the server
// and on the first client render (no hydration mismatch), then updates — same
// useSyncExternalStore pattern used by CountUp and the GitHub activity section.
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function Spotlight() {
  const { theme } = useTheme();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  // One-shot mount gate: deferred one tick so the fixed layer doesn't paint on
  // the very first frame, and disabled on touch devices (no hover to track).
  const [enabled, setEnabled] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const latestPos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const timeoutId = window.setTimeout(() => {
      setEnabled(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Imperative spotlight: write CSS custom properties straight to the DOM
  // element on mousemove, coalesced with requestAnimationFrame. No setState,
  // no React re-render per mouse move — only the gradient reads the vars.
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    // Start off-screen so the layer is invisible until the first mouse move.
    el.style.setProperty("--spotlight-x", "-1000px");
    el.style.setProperty("--spotlight-y", "-1000px");

    const handleMouseMove = (e: MouseEvent) => {
      latestPos.current = { x: e.clientX, y: e.clientY };
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          el.style.setProperty("--spotlight-x", `${latestPos.current.x}px`);
          el.style.setProperty("--spotlight-y", `${latestPos.current.y}px`);
          rafId.current = 0;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, [enabled, prefersReducedMotion]);

  if (!enabled || prefersReducedMotion) return null;

  const isDark = theme === "dark";

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{
        background: isDark
          ? "radial-gradient(700px circle at var(--spotlight-x) var(--spotlight-y), rgba(245, 244, 240, 0.06), transparent 45%)"
          : "radial-gradient(700px circle at var(--spotlight-x) var(--spotlight-y), rgba(139, 111, 92, 0.14), transparent 45%)",
      }}
      aria-hidden="true"
    />
  );
}