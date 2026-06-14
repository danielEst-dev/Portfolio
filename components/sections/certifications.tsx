"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { certifications } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="section-number bottom-0 right-0 translate-x-1/4 translate-y-1/4">05</div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Certifications" number="05" />
        </MotionWrapper>

        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-4">
          {certifications.map((cert, index) => (
            <MotionWrapper key={cert.name} delay={index * 0.05}>
              <div className="group flex items-start justify-between py-4 border-b border-border/60 hover:border-accent/60 transition-colors">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
                {cert.credential && (
                  <Link
                    href={cert.credential}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors ml-4"
                    aria-label="View credential"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
