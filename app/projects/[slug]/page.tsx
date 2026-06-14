import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { projects } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github, Lock, Globe } from "lucide-react";

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
  return {
    title: `${project.name} — Daniel Anthony S. Estrella`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="mb-6 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
              </Button>
            </Link>

            <header className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-2">
                {project.kicker}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{project.name}</h1>
              <p className="text-sm text-muted-foreground mb-4">
                {project.role} · {project.date}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              {project.fullDescription.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <section className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] mb-3">Highlights</h2>
              <ul className="space-y-2">
                {project.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-accent">—</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {project.stats && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] mb-3">Key Stats</h2>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{key}</p>
                        <p className="text-lg font-semibold">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {project.credentials && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] mb-3">Admin Test Credentials</h2>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User</span>
                      <span className="font-mono">{project.credentials.user}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pass</span>
                      <span className="font-mono">{project.credentials.pass}</span>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] mb-3">Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.link && (
                  <Link href={project.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" /> Live Site
                    </Button>
                  </Link>
                )}
                {project.adminLink && (
                  <Link href={project.adminLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Lock className="mr-2 h-4 w-4" /> Admin Demo
                    </Button>
                  </Link>
                )}
                {project.repo && (
                  <Link href={project.repo} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Github className="mr-2 h-4 w-4" /> View Code
                    </Button>
                  </Link>
                )}
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
