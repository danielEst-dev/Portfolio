"use client";

import { useRef, ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

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

  const rawX = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
  const rawY = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });

  // Cap displacement to ±strength
  const x = useTransform(rawX, (v) => Math.max(-strength, Math.min(strength, v)));
  const y = useTransform(rawY, (v) => Math.max(-strength, Math.min(strength, v)));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * 0.4);
    rawY.set((e.clientY - cy) * 0.4);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}
