"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { personalInfo } from "@/lib/data";
import { ArrowRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";
import { MagneticLink } from "@/components/magnetic-link";
import { CodeParticles } from "@/components/code-particles";

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

// Broader-than-backend descriptors the role line cycles through. Includes his
// actual title as one of the terms so the truth is always in rotation.
const ROLES = ["Junior Backend Developer", "API Engineer", "Systems thinker", "Software Engineer"];

// Headline word with the entrance fade-up reveal. `emphasize` draws an
// animated accent underline beneath the word once the reveal settles.
function HeadlineWord({ word, emphasize }: { word: string; emphasize?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span variants={wordVariant} className="inline-block relative" style={{ marginRight: "0.28em" }}>
      {word}
      {emphasize && (
        <motion.span
          aria-hidden
          className="absolute left-0 -bottom-1 lg:-bottom-1.5 h-[3px] w-full bg-[var(--accent)] origin-left"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}
    </motion.span>
  );
}

// Split a string into animated word spans. Words are inline-block so the
// headline wraps naturally across viewports instead of being locked to fixed
// lines — it never overflows the column on small screens.
function AnimatedWords({ text, emphasizeLast = false }: { text: string; emphasizeLast?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <HeadlineWord key={i} word={word} emphasize={emphasizeLast && i === words.length - 1} />
      ))}
    </>
  );
}

// Rotating role descriptor with a crossfade. Terms are absolutely stacked and
// right-aligned so the width never collapses mid-transition (no layout jump).
// Static under prefers-reduced-motion.
function RotatingRole() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) return <span>{ROLES[0]}</span>;
  return (
    <span className="relative inline-block min-w-[16ch] lg:min-w-[20ch] min-h-[1.3em] align-top">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute right-0 top-0 whitespace-nowrap"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Live local time (Asia/Manila, GMT+8, no DST). Rendered empty until mount to
// avoid an SSR/client hydration mismatch, then ticks each second.
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {personalInfo.location}
      {time ? (
        <>
          {" · "}
          <span className="whitespace-nowrap tabular-nums">{time}</span>
        </>
      ) : null}
    </>
  );
}

// Icon-only copy-to-clipboard button. Swaps to a check mark briefly on success.
function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy email"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
    >
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <CodeParticles />
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">01</SectionNumber>
      {/* min-h pushes the contact row to the bottom of the viewport for the
          cover-style asymmetry; content taller than the min-height just flows. */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-8 md:pt-12 lg:pt-12 pb-14 md:pb-20 lg:pb-20 relative z-10 flex flex-col sm:min-h-[calc(100vh-4rem)]">
        {/* Top row: accent rule (left) + name / rotating role / live time (right) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-start justify-between gap-6 mb-8 lg:mb-10"
        >
          <div className="accent-rule mt-3" />
          <div className="text-right">
            <p className="text-sm lg:text-lg uppercase tracking-[0.14em] font-bold text-foreground">{personalInfo.name}</p>
            <div className="mt-0.5 text-[11px] lg:text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <RotatingRole />
            </div>
            <p className="mt-1.5 text-[11px] font-mono text-muted-foreground">
              <LocalTime />
            </p>
          </div>
        </motion.div>

        {/* Oversized headline. The aria-label is the accessible name; the
            per-word motion spans are decorative so AT reads it as one phrase. */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground"
          variants={headlineContainer}
          initial="hidden"
          animate="show"
          aria-label="Building software that lasts."
        >
          {/* Two groups, each forced onto its own line at sm+ so the break is
              "Building software" / "that lasts." On mobile the spans stay inline
              so words wrap naturally and never overflow the column. */}
          <span className="sm:block">
            <AnimatedWords text="Building software" />
          </span>
          <span className="sm:block">
            <AnimatedWords text="that lasts." emphasizeLast />
          </span>
        </motion.h1>

        {/* Bio + primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 lg:mt-10 max-w-xl"
        >
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
        </motion.div>

        {/* Contact row pinned to the bottom of the hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="sm:mt-auto pt-8 lg:pt-10"
        >
          <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Available for work
              </p>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Link
                href={`mailto:${personalInfo.email}`}
                className="font-mono text-[13px] break-all text-foreground hover:text-accent transition-colors"
              >
                {personalInfo.email}
              </Link>
              <CopyEmailButton email={personalInfo.email} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}