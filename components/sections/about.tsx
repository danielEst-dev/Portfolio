"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personalInfo } from "@/lib/data";
import { motion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";

const statContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const statItem = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <SectionNumber className="bottom-0 left-0 -translate-x-1/4 translate-y-1/4">02</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="About" number="02" />
        </MotionWrapper>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 items-start">
          <MotionWrapper delay={0.1}>
            <div className="border-l-2 border-accent pl-6 md:pl-8">
              <p className="text-2xl md:text-3xl font-medium leading-snug text-foreground mb-6">
                Backend engineer focused on building reliable, scalable systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <div className="corner-bracket bg-secondary/50 border border-border/60 p-6 md:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                At a glance
              </p>
              <motion.div
                className="space-y-4"
                variants={statContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
              >
                <motion.div variants={statItem} className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium text-foreground">Junior Backend Developer</span>
                </motion.div>
                <motion.div variants={statItem} className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">Education</span>
                  <span className="text-sm font-medium text-foreground">BS IT, Magna Cum Laude</span>
                </motion.div>
                <motion.div variants={statItem} className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">APIs built</span>
                  <span className="text-sm font-medium text-foreground">300+ endpoints</span>
                </motion.div>
                <motion.div variants={statItem} className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Microservices</span>
                  <span className="text-sm font-medium text-foreground">7 repositories</span>
                </motion.div>
              </motion.div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
