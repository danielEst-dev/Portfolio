"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function FeaturedProjects() {
  const featured = projects.slice(0, 2);

  return (
    <section id="projects" className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Selected Work" />
        </MotionWrapper>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {featured.map((project, index) => (
            <MotionWrapper key={project.slug} delay={index * 0.1} className="bg-background">
              <Link
                href={`/projects/${project.slug}`}
                className="group block p-8 md:p-10 h-full transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-auto">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      {project.kicker}
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {project.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper delay={0.2} className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            View all projects
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}
