"use client";

import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personalInfo } from "@/lib/data";
import { MapPin, Phone, Mail } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="About" />
        </MotionWrapper>

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
          <MotionWrapper delay={0.1}>
            <div className="space-y-4">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                Backend engineer focused on building reliable, scalable systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-accent" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
