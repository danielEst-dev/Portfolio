"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personalInfo } from "@/lib/data";
import { motion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";
import { CountUp } from "@/components/count-up";

const statContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const statItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <SectionNumber index={2} />
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="About" number="02" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="border-l-2 border-accent pl-6 md:pl-8 max-w-3xl">
            <p className="text-2xl md:text-3xl font-medium leading-snug text-foreground mb-6">
              Backend engineer focused on building reliable, scalable systems.
            </p>
            {/* Trimmed intro on mobile, full summary on md+ */}
            <p className="text-muted-foreground leading-relaxed md:hidden">
              {personalInfo.shortBio}
            </p>
            <p className="hidden md:block text-muted-foreground leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.2}>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border/60 border border-border/60 corner-bracket bg-secondary/50 mt-10 md:mt-12"
            variants={statContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.div variants={statItem} className="p-4 md:p-5">
              <div className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
                <CountUp to={130} suffix="+" duration={1600} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                REST endpoints
              </div>
            </motion.div>
            <motion.div variants={statItem} className="p-4 md:p-5">
              <div className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
                <CountUp to={7} duration={900} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Microservices
              </div>
            </motion.div>
            <motion.div variants={statItem} className="p-4 md:p-5">
              <div className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
                1.25
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                College GWA
              </div>
            </motion.div>
            <motion.div variants={statItem} className="p-4 md:p-5">
              <div className="text-2xl md:text-3xl font-semibold text-foreground">
                Top 8
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Overall graduate
              </div>
            </motion.div>
          </motion.div>
        </MotionWrapper>
      </div>
    </section>
  );
}