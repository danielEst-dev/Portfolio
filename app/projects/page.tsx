import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects — Daniel Anthony S. Estrella",
  description: "Explore backend and full-stack projects by Daniel Anthony S. Estrella.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <MotionWrapper>
              <SectionLabel label="Projects" />
            </MotionWrapper>

            <MotionWrapper delay={0.1} className="mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Selected Work</h1>
              <p className="text-muted-foreground max-w-2xl">
                A collection of backend systems, full-stack applications, and production microservices I&apos;ve built or contributed to.
              </p>
            </MotionWrapper>

            <div className="grid md:grid-cols-2 gap-5">
              {projects.map((project, index) => (
                <MotionWrapper key={project.slug} delay={index * 0.1}>
                  <Card className="h-full flex flex-col group hover:border-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-2">
                        {project.kicker}
                      </p>
                      <h3 className="text-lg font-semibold tracking-wide uppercase">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">{project.date}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
