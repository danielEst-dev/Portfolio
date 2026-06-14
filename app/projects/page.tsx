import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work — Daniel Anthony S. Estrella",
  description: "Explore backend and full-stack projects by Daniel Anthony S. Estrella.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <MotionWrapper>
              <SectionLabel label="Work" />
            </MotionWrapper>

            <MotionWrapper delay={0.1} className="mb-16">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                Selected projects
              </h1>
              <p className="text-muted-foreground max-w-xl text-base">
                A collection of backend systems, full-stack applications, and production microservices.
              </p>
            </MotionWrapper>

            <div className="space-y-0 border-t border-border">
              {projects.map((project, index) => (
                <MotionWrapper key={project.slug} delay={index * 0.08}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block py-8 md:py-10 border-b border-border transition-colors hover:bg-secondary/20"
                  >
                    <div className="grid md:grid-cols-[1fr_220px_80px] gap-6 md:gap-8 items-start">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 group-hover:text-accent transition-colors">
                          {project.name}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                          {project.shortDescription}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 content-start">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-end">
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
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
