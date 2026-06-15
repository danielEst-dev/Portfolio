"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function Spotlight() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [enabled, setEnabled] = useState(false);
  const rafId = useRef<number>(0);
  const latestPos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const timeoutId = window.setTimeout(() => {
      setEnabled(true);
    }, 0);

    const handleMouseMove = (e: MouseEvent) => {
      latestPos.current = { x: e.clientX, y: e.clientY };
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          setPosition(latestPos.current);
          rafId.current = 0;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  if (!enabled) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{
        background: isDark
          ? `radial-gradient(700px circle at ${position.x}px ${position.y}px, rgba(245, 244, 240, 0.06), transparent 45%)`
          : `radial-gradient(700px circle at ${position.x}px ${position.y}px, rgba(139, 111, 92, 0.14), transparent 45%)`,
      }}
      aria-hidden="true"
    />
  );
}
