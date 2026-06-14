"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export function ContactCta() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Get in Touch" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
            <Mail className="h-10 w-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Let&apos;s work together</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              I&apos;m open to backend engineering roles, freelance projects, and collaboration opportunities. Send me a message and I&apos;ll get back to you as soon as possible.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <Button>
                  Send a message <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resume">
                <Button variant="outline">View resume</Button>
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
