"use client";

import { motion } from "framer-motion";

interface SectionNumberProps {
  children: string;
  className?: string;
}

export function SectionNumber({ children, className = "" }: SectionNumberProps) {
  return (
    <motion.div
      className={`section-number ${className}`}
      initial={{ opacity: 0.01 }}
      whileInView={{ opacity: 0.05 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
