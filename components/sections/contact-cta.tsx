"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { ArrowRight } from "lucide-react";

export function ContactCta() {
  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
      <div className="section-number top-0 right-0 translate-x-1/4 -translate-y-1/4">06</div>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Get in Touch" number="06" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="max-w-2xl">
            <div className="accent-rule mb-6" />
            <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-5">
              Let&apos;s build something meaningful.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I&apos;m open to backend engineering roles, freelance projects, and collaboration opportunities. If you have a project in mind, I&apos;d love to hear about it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors group"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
