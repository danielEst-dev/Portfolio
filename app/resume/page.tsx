import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personalInfo, experiences, education, certifications, skills } from "@/lib/data";
import { Download, ArrowUpRight } from "lucide-react";
import { RichText } from "@/components/rich-text";

const title = "Resume — Daniel Anthony S. Estrella";
const description = "View the resume of Daniel Anthony S. Estrella, backend engineer and Magna Cum Laude graduate.";
const ogImage = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "profile",
    url: "/resume",
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 md:py-24">
          {/* Header */}
          <MotionWrapper>
            <header className="mb-16 md:mb-20">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Resume
                  </p>
                  <div className="accent-rule mb-5" />
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground">
                    {personalInfo.name}
                  </h1>
                </div>
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </Link>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {personalInfo.summary}
              </p>
            </header>
          </MotionWrapper>

          {/* Experience */}
          <section className="mb-16 md:mb-20">
            <MotionWrapper>
              <SectionLabel label="Experience" />
            </MotionWrapper>
            <div className="relative border-l border-border ml-3 md:ml-4 space-y-10">
              {experiences.map((exp, index) => (
                <MotionWrapper key={exp.company + exp.role} delay={index * 0.08}>
                  <div className="pl-8 md:pl-10 relative">
                    <span className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-medium text-foreground">{exp.company}</h3>
                        <p className="text-sm text-muted-foreground">{exp.role}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{exp.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                          <span className="text-xs text-muted-foreground/50 font-medium min-w-[20px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span><RichText text={bullet} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-16 md:mb-20">
            <MotionWrapper>
              <SectionLabel label="Education" />
            </MotionWrapper>
            <MotionWrapper delay={0.1}>
              <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium text-foreground mb-1">{education.school}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{education.degree}</p>
                  <p className="text-xs text-muted-foreground mb-4">{education.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    {education.awards.map((award) => (
                      <span
                        key={award}
                        className="text-[11px] text-muted-foreground border border-border px-2 py-1"
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-secondary/50 border border-border p-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    Honors
                  </p>
                  <p className="text-3xl md:text-4xl font-medium text-accent mb-2">{education.honors}</p>
                  <p className="text-sm text-muted-foreground">GWA 1.25</p>
                </div>
              </div>
            </MotionWrapper>
            <MotionWrapper delay={0.15}>
              <div className="mt-8 pt-6 border-t border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{education.shs.school}</h4>
                    <p className="text-xs text-muted-foreground">{education.shs.strand}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{education.shs.year}</span>
                </div>
              </div>
            </MotionWrapper>
          </section>

          {/* Skills */}
          <section className="mb-16 md:mb-20">
            <MotionWrapper>
              <SectionLabel label="Skills" />
            </MotionWrapper>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
              {Object.entries(skills).map(([category, items], index) => (
                <MotionWrapper key={category} delay={index * 0.05}>
                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-3 py-1.5 border border-border/80 text-sm text-foreground hover:border-accent hover:text-accent transition-colors cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16 md:mb-20">
            <MotionWrapper>
              <SectionLabel label="Certifications" />
            </MotionWrapper>
            <div className="grid sm:grid-cols-2 gap-x-16 gap-y-4">
              {certifications.map((cert, index) => (
                <MotionWrapper key={cert.name} delay={index * 0.05}>
                  <div className="flex items-start justify-between py-3 border-b border-border/60">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">{cert.name}</h4>
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
                </MotionWrapper>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
