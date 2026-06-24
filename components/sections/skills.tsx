"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { skills, skillBeltItems } from "@/lib/data";
import { SectionNumber } from "@/components/section-number";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { EASE, makeListContainer } from "@/lib/motion";

// Entrance animations only — no hover required, so they play on every device.
// Reduced-motion users get `initial={false}`, which renders the final state
// with no movement (variant propagation handles the rest).
const listContainer = makeListContainer(0.08, 0.15);

const rowContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

const rowItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const skillItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

function SkillRow({
  category,
  items,
  index,
}: {
  category: string;
  items: string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Only the row currently sitting in the central band of the viewport is
  // "active", so scrolling through the section highlights one category at a
  // time — on every device. Skill rows aren't links, so there's no hover
  // affordance to fall back on; scroll position is the single driver.
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const active = !prefersReducedMotion && inView;

  return (
    <motion.div
      ref={ref}
      variants={rowItem}
      data-active={active ? "true" : undefined}
      className="group/index relative pl-6 md:pl-8 py-6 border-b border-border/40 first:pt-0"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-6 bottom-6 w-px bg-accent origin-top scale-y-0 group-data-[active=true]/index:scale-y-100 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      />
      <div className="flex items-baseline gap-4 md:gap-6">
        <span
          className={cn(
            "font-mono font-medium leading-none text-4xl md:text-6xl text-accent/25 group-data-[active=true]/index:text-accent transition-colors duration-300 tabular-nums",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className={cn(
            "text-[11px] md:text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground group-data-[active=true]/index:text-foreground transition-colors duration-300",
          )}
        >
          {category}
        </h3>
      </div>
      <motion.div
        className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1"
        variants={rowContainer}
      >
        {items.map((item, itemIndex) => (
          <motion.span key={item} variants={skillItem} className="inline-flex items-baseline">
            <span className="text-sm text-foreground/80 group-data-[active=true]/index:text-foreground/95 transition-colors duration-300">
              {item}
            </span>
            {itemIndex < items.length - 1 && (
              <span className="text-muted-foreground mx-1.5 select-none">·</span>
            )}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <SectionNumber className="top-0 left-0 -translate-x-1/4 -translate-y-1/4">06</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Technical Skills" number="06" />
        </MotionWrapper>

        {/* Ambient ticker — purely decorative. Hidden on mobile (busy at
            narrow widths); the numbered index below is the authoritative
            list. aria-hidden + the sr-only list keep it out of AT, so it
            never duplicates the index semantically. */}
        <div
          className="relative overflow-hidden py-3 mb-10 border-y border-border/40 hidden md:block"
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
                <span className="px-6 md:px-8 text-sm font-mono uppercase tracking-[0.12em] text-foreground whitespace-nowrap">
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

        {/* Numbered index — the row currently centered in the viewport
            highlights as you scroll, on every device. No hover state, since
            the rows aren't links and hover would be dead feedback. */}
        <motion.div
          className="max-w-4xl"
          variants={listContainer}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {Object.entries(skills).map(([category, items], index) => (
            <SkillRow key={category} category={category} items={items} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}