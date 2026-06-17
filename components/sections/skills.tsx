"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { skills, skillBeltItems } from "@/lib/data";
import { motion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";

const tagContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

const tagItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28 relative overflow-hidden">
      <SectionNumber className="top-0 left-0 -translate-x-1/4 -translate-y-1/4">04</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Technical Skills" number="04" />
        </MotionWrapper>

        {/* Conveyor belt is purely visual — the duplicated list and
            continuous marquee would be announced twice to AT users. The
            list below is the accessible equivalent. */}
        <div
          className="relative overflow-hidden py-4 mb-10 border-y border-border/40"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          <div className="flex w-max animate-conveyor hover:[animation-play-state:paused]">
            {[...skillBeltItems, ...skillBeltItems].map((skill, index) => (
              <div key={`${skill}-${index}`} className="flex items-center shrink-0">
                <span className="px-6 md:px-8 text-sm md:text-base font-mono uppercase tracking-[0.12em] text-foreground whitespace-nowrap">
                  {skill}
                </span>
                <span className="text-muted-foreground">/</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="sr-only" aria-label="Technical skills">
          {skillBeltItems.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {Object.entries(skills).map(([category, items], index) => (
            <MotionWrapper key={category} delay={index * 0.05}>
              <div className="corner-bracket p-5 border border-border/60 bg-transparent">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  {category}
                </h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={tagContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  {items.map((item) => (
                    <motion.span
                      key={item}
                      variants={tagItem}
                      className="inline-flex items-center px-3 py-1.5 border border-border/80 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
