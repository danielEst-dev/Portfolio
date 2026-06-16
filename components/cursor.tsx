"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function Cursor() {
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Dot follows instantly
  const dotX = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.1 });
  const dotY = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.1 });

  // Ring lags behind with spring physics
  const ringX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.8 });
  const ringY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.8 });

  useEffect(() => {
    // Don't show on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    // Detect when cursor is over a clickable element
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [tabindex]"
      );
      setIsPointer(!!clickable);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mouseenter", handleEnter);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mouseenter", handleEnter);
      window.removeEventListener("mouseover", handleOver);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Dot — snappy, accent-coloured */}
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
      {/* Ring — lags behind with spring physics */}
      <motion.div
        className={`cursor-ring ${isPointer ? "cursor-ring--active" : ""}`}
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
}
