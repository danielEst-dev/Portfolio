import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { projects } from "@/lib/data";
import { ArrowLeft, ArrowUpRight, ArrowRight, Github, Lock, Globe } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  const title = `${project.name} — Daniel Anthony S. Estrella`;
  const ogImage = `/api/og?title=${encodeURIComponent(project.name)}&description=${encodeURIComponent(project.shortDescription)}`;

  return {
    title,
    description: project.shortDescription,
    openGraph: {
      title,
      description: project.shortDescription,
      type: "article",
      url: `/projects/${project.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.shortDescription,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    notFound();
  }

  const prevProject = projects[projectIndex - 1] || null;
  const nextProject = projects[projectIndex + 1] || null;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="h-4 w-4" /> Back to work
            </Link>

            <header className="mb-12" style={{ viewTransitionName: `project-${project.slug}` }}>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {project.kicker}
              </p>
              <div className="accent-rule mb-5" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4">
                {project.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {project.role} · {project.date}
              </p>
            </header>

            <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
              <div>
                <section className="mb-12">
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    Context
                  </h2>
                  <div className="space-y-5 text-muted-foreground leading-relaxed">
                    {project.fullDescription.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    What I Built
                  </h2>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex gap-4 text-sm text-muted-foreground">
                        <span className="text-accent mt-1.5">—</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {project.demoNote && (
                  <section className="mb-12 p-5 border border-border bg-secondary/30">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      Demo
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {project.demoNote}{" "}
                      <Link
                        href="/contact"
                        transitionTypes={["nav-forward"]}
                        className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
                      >
                        Request access
                      </Link>
                    </p>
                  </section>
                )}
              </div>

              <aside className="space-y-8">
                <div>
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Stack
                  </h2>
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
                </div>

                {project.stats && (
                  <div>
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      Key Stats
                    </h2>
                    <div className="space-y-3">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-baseline border-b border-border/60 pb-2">
                          <span className="text-xs text-muted-foreground capitalize">{key}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Links
                  </h2>
                  <div className="flex flex-col gap-2">
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                      >
                        <Globe className="h-4 w-4" /> Live Site <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                    {project.adminLink && (
                      <Link
                        href={project.adminLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                      >
                        <Lock className="h-4 w-4" /> Admin Demo <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                    {project.repo && (
                      <Link
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                      >
                        <Github className="h-4 w-4" /> View Code <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </aside>
            </div>

            {(prevProject || nextProject) && (
              <nav className="mt-20 pt-10 border-t border-border" aria-label="Project navigation">
                <div className="grid md:grid-cols-2 gap-6">
                  {prevProject ? (
                    <Link
                      href={`/projects/${prevProject.slug}`}
                      className="group flex flex-col gap-2 p-5 border border-border/60 hover:border-accent transition-colors"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Previous
                      </span>
                      <span className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                        {prevProject.name}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextProject ? (
                    <Link
                      href={`/projects/${nextProject.slug}`}
                      className="group flex flex-col gap-2 p-5 border border-border/60 hover:border-accent transition-colors md:items-end md:text-right"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Next
                      </span>
                      <span className="text-lg font-medium text-foreground group-hover:text-accent transition-colors flex items-center gap-2 md:flex-row-reverse">
                        {nextProject.name} <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </nav>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
