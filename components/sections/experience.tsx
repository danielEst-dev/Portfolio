"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { SectionNumber } from "@/components/section-number";
import { experiences } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/rich-text";

export function Experience() {
  const [openIndex, setOpenIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">04</SectionNumber>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Experience" number="04" />
        </MotionWrapper>

        <div className="mt-12">
          {/* Top hairline */}
          <div className="h-px w-full bg-border" />

          {experiences.map((exp, index) => {
            const isOpen = openIndex === index;
            const panelId = `experience-panel-${index}`;
            const buttonId = `experience-button-${index}`;
            const numeral = String(index + 1).padStart(2, "0");

            return (
              <MotionWrapper key={exp.company + exp.role} delay={index * 0.06}>
                {exp.muted ? (
                  /* Demoted entry — quiet single line, no expand */
                  <div className="py-4 border-b border-border">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="text-muted-foreground">{exp.role}</span>
                      <span className="mx-1.5 text-border">—</span>
                      <span>{exp.company}</span>
                      <span className="mx-1.5 text-border">·</span>
                      <span className="text-muted-foreground">{exp.date}</span>
                    </p>
                  </div>
                ) : (
                  <div
                    className={`border-b transition-colors duration-300 ${
                      isOpen ? "border-accent/20" : "border-border"
                    }`}
                  >
                    {/* ── Header row ── */}
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group w-full py-5 md:py-6 text-left
                                 grid grid-cols-[28px_1fr] gap-x-4
                                 md:gap-x-5
                                 items-start"
                    >
                      {/* Numeral */}
                      <span
                        className={`font-mono text-[10px] tracking-[0.06em] pt-0.5 select-none
                                    transition-colors duration-200
                                    ${isOpen ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {numeral}
                      </span>

                      {/* Role · date · company · stack — role leads, company demoted */}
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <h3
                            className={`text-xl md:text-2xl font-medium tracking-tight leading-snug
                                        transition-colors duration-200
                                        ${isOpen
                                          ? "text-accent"
                                          : "text-foreground group-hover:text-accent"}`}
                          >
                            {exp.role}
                          </h3>
                          <span className="hidden md:block font-mono text-xs tracking-[0.04em] text-muted-foreground md:ml-auto whitespace-nowrap">
                            {exp.date}
                          </span>
                        </div>
                        <p className="text-base text-muted-foreground mt-1 leading-snug">
                          <span className="text-muted-foreground">at</span>{" "}
                          {exp.company}
                        </p>
                        {/* Date — below the company line on mobile. On desktop the
                            date sits top-right on the role row above (hidden
                            md:block), so this copy is mobile-only (display:none
                            removes it from the a11y tree at md and up). */}
                        <span className="block md:hidden mt-1 font-mono text-xs tracking-[0.04em] text-muted-foreground whitespace-nowrap">
                          {exp.date}
                        </span>
                        {exp.stack && exp.stack.length > 0 && (
                          /* Outlined hairline chips — sans + uppercase tracking to
                             match the SectionLabel voice, sized to sit below the
                             "at company" line in the hierarchy (role 18 > 14 > 11).
                             A span (not div) keeps this phrasing-content-valid inside
                             the button. */
                          <span className="mt-2.5 flex flex-wrap gap-1.5">
                            {exp.stack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground border border-border px-2 py-1"
                              >
                                {tech}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* ── Expanded panel ── */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          key="panel"
                          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          {/* Indent aligns with the content column */}
                          <div className="pb-6 pl-[calc(28px+1rem)] md:pl-[calc(28px+1.25rem)]">
                            {/* Accent left-border — editorial pull-quote feel.
                                Capped at max-w-3xl so bullet lines stay readable
                                now that the section spans the full max-w-6xl
                                column used by every other section. */}
                            <div className="border-l border-accent/50 pl-4 md:pl-5 max-w-3xl">
                              <motion.ul
                                className="space-y-3"
                                initial={prefersReducedMotion ? false : "hidden"}
                                animate="show"
                                variants={{
                                  hidden: {},
                                  show: {
                                    transition: {
                                      staggerChildren: 0.07,
                                      delayChildren: 0.08,
                                    },
                                  },
                                }}
                              >
                                {exp.bullets.map((bullet, bIndex) => (
                                  <motion.li
                                    key={bIndex}
                                    variants={{
                                      hidden: { opacity: 0, y: 6 },
                                      show: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                          duration: 0.3,
                                          ease: [0.25, 0.1, 0.25, 1],
                                        },
                                      },
                                    }}
                                    className="text-sm text-muted-foreground leading-relaxed"
                                  >
                                    <RichText text={bullet} />
                                  </motion.li>
                                ))}
                              </motion.ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </MotionWrapper>
            );
          })}
        </div>

        <MotionWrapper delay={0.25} className="mt-10 text-center">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 text-sm font-medium
                       text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            View full resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}