import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { personalInfo, experiences, education, certifications, skills, additionalSkills } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume — Daniel Anthony S. Estrella",
  description: "View the resume of Daniel Anthony S. Estrella, backend engineer and Magna Cum Laude graduate.",
};

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <header className="mb-10 border-b border-foreground pb-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{personalInfo.name}</h1>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">
                  {personalInfo.title}
                </p>
              </div>
              <div className="text-sm text-muted-foreground md:text-right space-y-1">
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.email}</p>
                <p>{personalInfo.location}</p>
                <div className="flex gap-3 md:justify-end">
                  <Link href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    LinkedIn
                  </Link>
                  <Link href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {personalInfo.summary}
            </p>
          </header>

          {/* Experience */}
          <section className="mb-10">
            <SectionLabel label="Professional Experience" />
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.company + exp.role}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-foreground pb-2 mb-3">
                    <h3 className="text-base font-semibold tracking-wide uppercase">{exp.company}</h3>
                    <div className="text-right sm:text-right">
                      <p className="text-sm text-muted-foreground">{exp.role}</p>
                      <p className="text-xs text-muted-foreground">{exp.date}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="text-xs text-muted-foreground/50 font-medium min-w-[20px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-10">
            <SectionLabel label="Education" />
            <div className="border-b border-border pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <h3 className="text-base font-semibold tracking-wide uppercase">{education.school}</h3>
                <span className="text-xs text-muted-foreground">{education.year}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <p className="text-sm text-muted-foreground">{education.degree}</p>
                <span className="text-base font-semibold text-accent tracking-wide uppercase">
                  {education.honors}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{education.detail}</p>
              <div className="flex flex-wrap gap-2">
                {education.awards.map((award) => (
                  <Badge key={award} variant="outline" className="text-[10px] font-normal">
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <Badge variant="secondary" className="text-[9px] font-semibold uppercase tracking-wider mb-2">
                Secondary Education
              </Badge>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h4 className="text-sm font-semibold tracking-wide uppercase">{education.shs.school}</h4>
                  <p className="text-xs text-muted-foreground">{education.shs.strand}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{education.shs.year}</span>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-10">
            <SectionLabel label="Licenses & Certifications" />
            <div className="grid sm:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.name} className="border-b border-border pb-2">
                  <h4 className="text-sm font-semibold leading-snug">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer} · {cert.date}
                  </p>
                  {cert.credential && (
                    <Link
                      href={cert.credential}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                    >
                      Credential <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-10">
            <SectionLabel label="Technical Skills" />
            <div className="space-y-3">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="grid sm:grid-cols-[140px_1fr] gap-2 border-b border-border pb-2 last:border-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-[10px] font-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Skills */}
          <section className="mb-10">
            <SectionLabel label="Additional Skills" />
            <div className="space-y-3">
              {Object.entries(additionalSkills).map(([category, items]) => (
                <div key={category} className="grid sm:grid-cols-[140px_1fr] gap-2 border-b border-border pb-2 last:border-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge key={item} variant="outline" className="text-[10px] font-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Download */}
          <div className="flex justify-center print:hidden">
            <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download PDF Resume
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
