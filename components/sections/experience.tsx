"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { experiences } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  return (
    <section id="experience" className="py-16 md:py-20 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Professional Experience" />
        </MotionWrapper>

        <div className="space-y-10">
          {experiences.map((exp, index) => (
            <MotionWrapper key={exp.company + exp.role} delay={index * 0.1}>
              <div className="border-b border-border pb-8 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-wide uppercase">
                      {exp.company}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{exp.role}</p>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs font-normal">
                    {exp.date}
                  </Badge>
                </div>

                <ul className="space-y-3">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-xs text-muted-foreground/60 font-medium min-w-[20px] pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
