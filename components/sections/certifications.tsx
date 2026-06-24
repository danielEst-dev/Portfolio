"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { certifications } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";
import { useRef } from "react";
import { useCanHover } from "@/lib/hooks";
import { listContainer, listItem } from "@/lib/motion";

function CertCard({
  cert,
  canHover,
}: {
  cert: (typeof certifications)[number];
  canHover: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // A card flips "active" when it sits in the central band of the viewport, so
  // scrolling through the grid highlights cards one row at a time on touch
  // devices — standing in for hover (which has no equivalent on mobile).
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const active = !canHover && !prefersReducedMotion && inView;

  // Hover (desktop) and scroll-active (touch) share the same accent states,
  // driven by `group-hover:` and `group-data-[active=true]:` respectively.
  const highlight =
    "group-hover:border-accent/60 group-hover:bg-secondary/50 group-data-[active=true]:border-accent/60 group-data-[active=true]:bg-secondary/50";
  const eyebrowHighlight =
    "group-hover:text-accent group-data-[active=true]:text-accent";
  const arrowHighlight =
    "group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-data-[active=true]:text-accent group-data-[active=true]:translate-x-0.5 group-data-[active=true]:-translate-y-0.5";

  const inner = (
    <div
      className={`corner-bracket border border-border/60 bg-secondary/30 p-5 md:p-6 h-full flex flex-col transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${highlight}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 ${eyebrowHighlight}`}
        >
          {cert.issuer}
        </span>
        {cert.credential && (
          <ArrowUpRight
            aria-hidden="true"
            className={`h-4 w-4 text-muted-foreground transition-all duration-300 shrink-0 ${arrowHighlight}`}
          />
        )}
      </div>

      <h3 className="mt-4 text-base md:text-lg font-medium text-foreground leading-snug">
        {cert.name}
      </h3>

      {/* mt-auto pins the date to the card's bottom so dates align across a
          row even when cert names wrap to different heights. */}
      <p className="mt-auto pt-4 text-xs text-muted-foreground">{cert.date}</p>
    </div>
  );

  return (
    <motion.div ref={ref} variants={listItem} className="h-full">
      {cert.credential ? (
        <Link
          href={cert.credential}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full"
          data-active={active ? "true" : undefined}
          aria-label={`${cert.name} — view credential`}
        >
          {inner}
        </Link>
      ) : (
        <div className="group block h-full" data-active={active ? "true" : undefined}>
          {inner}
        </div>
      )}
    </motion.div>
  );
}

export function Certifications() {
  const canHover = useCanHover();

  return (
    <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-secondary/30 relative overflow-hidden">
      <SectionNumber index={7} />
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Certifications" number="07" />
        </MotionWrapper>

        {/* Credential card grid — same layout on every breakpoint (2 cols at
            sm, 3 cols at lg, single column on mobile). Cards highlight on
            hover (desktop) and on scroll-into-view (touch): issuer eyebrow,
            arrow, border, and corner brackets all shift to accent. */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delayChildren: 0.15 }}
        >
          {certifications.map((cert) => (
            <CertCard key={cert.name} cert={cert} canHover={canHover} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}