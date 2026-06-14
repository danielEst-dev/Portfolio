"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

export function FeaturedProjects() {
  const featured = projects.slice(0, 3);

  return (
    <section id="projects" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <SectionLabel label="Featured Projects" />
        </MotionWrapper>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project, index) => (
            <MotionWrapper key={project.slug} delay={index * 0.1}>
              <Card className="h-full flex flex-col group hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-2">
                    {project.kicker}
                  </p>
                  <h3 className="text-base font-semibold tracking-wide uppercase">
                    {project.name}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/projects/${project.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View Case Study <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper delay={0.3} className="mt-8 text-center">
          <Link href="/projects">
            <Button variant="ghost">
              See all projects <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}
