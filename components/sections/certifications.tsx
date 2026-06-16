"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { certifications } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionNumber } from "@/components/section-number";

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <SectionNumber className="bottom-0 right-0 translate-x-1/4 translate-y-1/4">05</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Certifications" number="05" />
        </MotionWrapper>

        <motion.div
          className="grid sm:grid-cols-2 gap-x-16 gap-y-4"
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {certifications.map((cert) => (
            <motion.div key={cert.name} variants={listItem}>
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
