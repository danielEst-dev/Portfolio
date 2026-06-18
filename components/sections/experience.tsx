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
    <section id="experience" className="py-20 md:py-28 relative overflow-hidden">
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">04</SectionNumber>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
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
                    <p className="text-sm leading-relaxed text-muted-foreground/55">
                      <span className="text-muted-foreground/75">{exp.role}</span>
                      <span className="mx-1.5 text-border">—</span>
                      <span>{exp.company}</span>
                      <span className="mx-1.5 text-border">·</span>
                      <span className="text-muted-foreground/40">{exp.date}</span>
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
                                    ${isOpen ? "text-accent" : "text-muted-foreground/40"}`}
                      >
                        {numeral}
                      </span>

                      {/* Role · date · company · stack — role leads, company demoted */}
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
                          <h3
                            className={`text-lg md:text-xl font-medium tracking-tight leading-snug
                                        transition-colors duration-200
                                        ${isOpen
                                          ? "text-accent"
                                          : "text-foreground group-hover:text-accent"}`}
                          >
                            {exp.role}
                          </h3>
                          <span className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground/50 md:ml-auto whitespace-nowrap">
                            {exp.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground/70 mt-1 leading-snug">
                          <span className="text-muted-foreground/45">at</span>{" "}
                          {exp.company}
                        </p>
                        {exp.stack && exp.stack.length > 0 && (
                          <p className="mt-2 font-mono text-[10px] tracking-[0.04em] text-muted-foreground/55">
                            {exp.stack.join(" / ")}
                          </p>
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
                            {/* Accent left-border — editorial pull-quote feel */}
                            <div className="border-l border-accent/50 pl-4 md:pl-5">
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