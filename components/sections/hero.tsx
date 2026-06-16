"use client";

import Link from "next/link";
import { personalInfo } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";
import { MagneticLink } from "@/components/magnetic-link";

// Variants for the headline container — staggers children
const headlineContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Each word fades up individually
const wordVariant = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

// Split a string into framer-motion animated word spans
function AnimatedWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className={`inline-block ${className ?? ""}`}
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">01</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
        <div className="grid lg:grid-cols-[1fr_220px] gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Accent rule animates its width via CSS on mount */}
            <div className="accent-rule mb-8" />

            {/* Word-by-word headline reveal */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-foreground mb-8"
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              aria-label="Building systems that scale."
            >
              <span className="block overflow-hidden pb-1">
                <AnimatedWords text="Building systems" />
              </span>
              <span className="block overflow-hidden pb-1">
                <AnimatedWords text="that scale." />
              </span>
            </motion.h1>

            <div className="max-w-xl">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 drop-cap">
                {personalInfo.shortBio}
              </p>
              <MagneticLink>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors group"
                >
                  View selected work
                  {/* arrow-nudge pauses on group hover so it doesn't fight the translate-x from group-hover */}
                  <ArrowRight className="h-4 w-4 arrow-nudge group-hover:[animation-play-state:paused] group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:pt-4 space-y-6 border-l border-border/60 pl-6"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Contact</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.email}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
