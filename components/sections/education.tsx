"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { SectionNumber } from "@/components/section-number";
import { education } from "@/lib/data";
import { ArrowRight } from "lucide-react";

// Surface only the most distinctive honors on the home page so the card
// stays scannable. The full list lives on /resume.
const homeAwards = [
  "Top 8 Overall Graduate",
  "Highest-Ranking Male Graduate",
  "Consistent President's List",
];

export function Education() {
  return (
    <section id="education" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">05</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Education" number="05" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="corner-bracket bg-secondary/50 border border-border/60 p-6 md:p-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-start">
              <div>
                <h3 className="text-3xl md:text-4xl font-medium text-foreground mb-2">
                  {education.school}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{education.degree}</p>
                <p className="text-xs text-muted-foreground">{education.year}</p>
              </div>
              <div className="md:text-right">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Honors
                </p>
                <p className="text-3xl md:text-4xl font-medium text-accent mb-2">
                  {education.honors}
                </p>
                <p className="text-sm text-muted-foreground mb-4">GWA 1.25</p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {homeAwards.map((award) => (
                    <span
                      key={award}
                      className="text-[11px] text-muted-foreground border border-border/80 px-2 py-1"
                    >
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.2} className="mt-10 text-center">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            View full resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}
