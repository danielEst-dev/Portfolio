import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { MotionWrapper } from "@/components/motion-wrapper";
import { SectionNumber } from "@/components/section-number";
import { education } from "@/lib/data";
import { ArrowRight } from "lucide-react";

// Surface only the most distinctive honors on the home page so the card
// stays scannable. The full list lives on /resume.
const homeAwards = [
  "Top 8 Overall Graduate",
  "President's List",
  "Highest-Ranking Male Graduate",
];

// Home page drops the campus qualifier for brevity; the full name
// ("Centro Escolar University Malolos") lives on /resume.
const homeSchool = education.school.replace(/ Malolos$/, "");

export function Education() {
  return (
    <section id="education" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <SectionNumber className="top-0 right-0 translate-x-1/4 -translate-y-1/4">05</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="Education" number="05" />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="corner-bracket bg-secondary/50 border border-border/60 p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-x-12 md:gap-y-0 items-start">
              {/* Achievement hero — leads the hierarchy on mobile (achievement
                  first, school as context), top-right on desktop. The year
                  joins the GWA meta line on mobile but stays under the degree on
                  desktop, so the desktop right column is unchanged. */}
              <div className="order-2 md:order-none md:col-start-2 md:row-start-1 md:text-right">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Honors
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-accent mb-2 leading-tight">
                  {education.honors}
                </p>
                <p className="text-sm text-muted-foreground">
                  GWA 1.25<span className="md:hidden"> · {education.year}</span>
                </p>
              </div>

              {/* School info — leads on mobile, left column on desktop */}
              <div className="order-1 md:order-none md:col-start-1 md:row-start-1">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mb-1 md:mb-2 leading-tight">
                  {homeSchool}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{education.degree}</p>
                <p className="text-xs text-muted-foreground hidden md:block">{education.year}</p>
              </div>

              {/* Awards — last on mobile, bottom-right on desktop (spaced from
                  the hero via mt rather than a grid row gap so the desktop
                  rhythm matches the previous single-cell honors block) */}
              <div className="order-3 md:order-none md:col-start-2 md:row-start-2 md:text-right md:mt-4">
                <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-end gap-2">
                  {homeAwards.map((award, i) => {
                    // When the count is odd, the final award would sit alone in a
                    // half-width cell — stretch it across both columns so the
                    // last row reads as a full banner instead of an orphan.
                    const orphan = i === homeAwards.length - 1 && homeAwards.length % 2 === 1;
                    return (
                      <span
                        key={award}
                        className={`text-[11px] text-muted-foreground border border-border/80 px-2.5 py-1.5 text-center md:px-2 md:py-1 md:text-left ${orphan ? "col-span-2" : ""}`}
                      >
                        {award}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.2} className="mt-10 text-center">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            View full resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}
