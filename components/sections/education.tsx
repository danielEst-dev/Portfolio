"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { education } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Education() {
  return (
    <section id="education" className="py-16 md:py-20 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Education" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="border-b border-border pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
              <h3 className="text-lg font-semibold tracking-wide uppercase">
                {education.school}
              </h3>
              <span className="text-xs text-muted-foreground">{education.year}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
              <p className="text-sm text-muted-foreground">{education.degree}</p>
              <span className="text-base font-semibold text-accent tracking-wide uppercase">
                {education.honors}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{education.detail}</p>
            <div className="flex flex-wrap gap-2">
              {education.awards.map((award) => (
                <Badge key={award} variant="outline" className="text-[10px] font-normal">
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.2}>
          <Card>
            <CardContent className="p-4">
              <Badge variant="secondary" className="text-[9px] font-semibold uppercase tracking-wider mb-2">
                Secondary Education
              </Badge>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold tracking-wide uppercase">
                    {education.shs.school}
                  </h4>
                  <p className="text-xs text-muted-foreground">{education.shs.strand}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {education.shs.year}
                </span>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </section>
  );
}
