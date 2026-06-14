"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personalInfo } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="section-number bottom-0 left-0 -translate-x-1/4 translate-y-1/4">02</div>
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
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium text-foreground">Junior Backend Developer</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">Education</span>
                  <span className="text-sm font-medium text-foreground">BS IT, Magna Cum Laude</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/60 pb-3">
                  <span className="text-sm text-muted-foreground">APIs built</span>
                  <span className="text-sm font-medium text-foreground">300+ endpoints</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Microservices</span>
                  <span className="text-sm font-medium text-foreground">7 repositories</span>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
