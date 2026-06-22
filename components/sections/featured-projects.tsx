"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { SectionNumber } from "@/components/section-number";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useCanHover } from "@/lib/hooks";
import { listContainer, listItem } from "@/lib/motion";

// Module-scope: `projects` is a stable static import, so the slice can be
// computed once instead of on every render.
const featured = projects.slice(0, 2);

function FeaturedCard({
  project,
  canHover,
}: {
  project: (typeof projects)[number];
  canHover: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // A card flips "active" when it sits in the central band of the viewport, so
  // scrolling through the stack highlights cards one at a time on touch
  // devices — standing in for hover (which has no equivalent on mobile).
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const active = !canHover && !prefersReducedMotion && inView;

  return (
    <motion.div
      ref={ref}
      variants={listItem}
      // `md:bg-background` fills the joined desktop panel's cell; on mobile the
      // bordered Link below carries its own background.
      className="md:bg-background h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="corner-bracket group block h-full p-6 md:p-10 border border-border/60 md:border-0 bg-background md:bg-transparent transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-secondary/40 group-data-[active=true]:border-accent/60 group-data-[active=true]:bg-secondary/40"
        data-active={active ? "true" : undefined}
      >
        <div className="flex flex-col h-full">
          <div className="mb-auto">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {project.kicker}
            </p>
            <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4 group-hover:text-accent group-data-[active=true]:text-accent transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2 md:line-clamp-none">
              {project.shortDescription}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1 ${i >= 2 ? "hidden md:inline-block" : ""}`}
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="md:hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground arrow-nudge group-hover:[animation-play-state:paused] group-hover:text-accent group-data-[active=true]:[animation-play-state:paused] group-data-[active=true]:text-accent transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const canHover = useCanHover();

  return (
    <section id="projects" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <SectionNumber className="top-1/2 right-0 translate-x-1/3 -translate-y-1/2">03</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Selected Work" number="03" />
        </MotionWrapper>

        {/* Project cards — joined hairline panel on desktop, separated bordered
            tiles on mobile. Cards stagger in on scroll-into-view, and on touch
            devices highlight one at a time as each passes the viewport's center
            band (standing in for hover): title, arrow, border, and corner
            brackets all shift to accent. */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-px bg-transparent md:bg-border md:border md:border-border"
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delayChildren: 0.15 }}
        >
          {featured.map((project) => (
            <FeaturedCard key={project.slug} project={project} canHover={canHover} />
          ))}
        </motion.div>

        <MotionWrapper delay={0.2} className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            View all projects
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}