"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { certifications } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";

export function Certifications() {
  return (
    <section id="certifications" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Licenses & Certifications" />
        </MotionWrapper>

        <div className="grid sm:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <MotionWrapper key={cert.name} delay={index * 0.05}>
              <Card className="h-full group hover:border-accent/50 transition-colors">
                <CardContent className="p-4 flex gap-3">
                  <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug mb-1">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {cert.issuer} · {cert.date}
                    </p>
                    {cert.credential && (
                      <Link
                        href={cert.credential}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        Credential <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
