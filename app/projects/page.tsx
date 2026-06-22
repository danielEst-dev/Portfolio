import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const title = "Work — Daniel Anthony S. Estrella";
const description = "Explore backend and full-stack projects by Daniel Anthony S. Estrella.";
const ogImage = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/projects",
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

// BreadcrumbList: Home → Projects
const projectsBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://daniel-est.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projects",
      item: "https://daniel-est.vercel.app/projects",
    },
  ],
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsBreadcrumbSchema) }}
      />
      <Navbar />
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <MotionWrapper>
              <SectionLabel label="Work" />
            </MotionWrapper>

            <MotionWrapper delay={0.1} className="mb-16">
              <div className="accent-rule mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4">
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
                    className="group relative block py-8 md:py-10 border-b border-border"
                    style={{ viewTransitionName: `project-${project.slug}` }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-accent origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-x-100 z-10"
                    />
                    <div className="grid md:grid-cols-[1fr_220px_80px] gap-6 md:gap-8 items-start">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-2 group-hover:text-accent transition-colors">
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
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-foreground" />
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
