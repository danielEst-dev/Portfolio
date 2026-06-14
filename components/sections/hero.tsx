"use client";

import Link from "next/link";
import { personalInfo } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-[1fr_220px] gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-foreground mb-8">
              Building systems<br />that scale.
            </h1>
            <div className="max-w-xl">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                {personalInfo.shortBio}
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors group"
              >
                View selected work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:pt-4 space-y-6"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Contact</p>
              <p className="text-sm font-medium text-foreground">{personalInfo.email}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
