"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { skills, skillBeltItems } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28 relative overflow-hidden">
      <div className="section-number top-0 left-0 -translate-x-1/4 -translate-y-1/4">04</div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Technical Skills" number="04" />
        </MotionWrapper>

        <div
          className="relative overflow-hidden py-4 mb-10 border-y border-border/40"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-conveyor hover:[animation-play-state:paused]">
            {[...skillBeltItems, ...skillBeltItems].map((skill, index) => (
              <div key={`${skill}-${index}`} className="flex items-center shrink-0">
                <span className="px-6 md:px-8 text-sm md:text-base font-mono uppercase tracking-[0.12em] text-foreground whitespace-nowrap">
                  {skill}
                </span>
                <span className="text-muted-foreground" aria-hidden="true">
                  /
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {Object.entries(skills).map(([category, items], index) => (
            <MotionWrapper key={category} delay={index * 0.05}>
              <div className="corner-bracket p-5 border border-border/60 bg-transparent">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1.5 border border-border/80 text-sm text-foreground hover:border-accent hover:text-accent transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
