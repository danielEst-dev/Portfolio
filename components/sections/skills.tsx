"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { skills } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function Skills() {
  return (
    <section id="skills" className="py-16 md:py-20 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Technical Skills" />
        </MotionWrapper>

        <div className="space-y-4">
          {Object.entries(skills).map(([category, items], index) => (
            <MotionWrapper key={category} delay={index * 0.05}>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="grid sm:grid-cols-[140px_1fr] divide-y sm:divide-y-0 sm:divide-x divide-border">
                  <div className="bg-muted/50 px-4 py-3 flex items-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {category}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex flex-wrap gap-2 items-center">
                    {items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-[11px] font-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
