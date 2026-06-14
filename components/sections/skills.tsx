"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Technical Skills" />
        </MotionWrapper>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {Object.entries(skills).map(([category, items], index) => (
            <MotionWrapper key={category} delay={index * 0.05}>
              <div>
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
