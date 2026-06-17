"use client";

import { useRef, ReactNode } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";

interface MagneticLinkProps {
  children: ReactNode;
  className?: string;
  strength?: number; // max px displacement, default 8
}

export function MagneticLink({
  children,
  className = "",
  strength = 8,
}: MagneticLinkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Cap displacement to ±strength
  const x = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
  const cappedX = useTransform(x, (v) => Math.max(-strength, Math.min(strength, v)));
  const cappedY = useTransform(y, (v) => Math.max(-strength, Math.min(strength, v)));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.4);
    y.set((e.clientY - cy) * 0.4);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { x: cappedX, y: cappedY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}
