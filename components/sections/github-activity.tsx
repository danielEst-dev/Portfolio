"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { SectionNumber } from "@/components/section-number";
import { MotionWrapper } from "@/components/motion-wrapper";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/lib/data";
import { Github, Star, GitFork, ArrowUpRight } from "lucide-react";
import type { GitHubActivityPayload } from "@/lib/github";

// Contribution level → background class. Opacities of the accent token map
// GitHub's quartile buckets; level 0 is the muted "no activity" cell.
const LEVEL_CLASS = [
  "bg-secondary",
  "bg-accent/20",
  "bg-accent/40",
  "bg-accent/70",
  "bg-accent",
] as const;

type ActivityData = Extract<GitHubActivityPayload, { available: true }>;

// Staggered reveal for inner lists. The "show" parent triggers children; the
// "item" child fades up with the same easing used elsewhere in the codebase.
const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="bg-background p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </p>
      <div className="text-2xl font-medium text-foreground tabular-nums">{value}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      {/* Identity strip placeholder — mirrors the avatar + name + meta + bio layout */}
      <div className="flex items-start gap-5 p-5 border border-border/60 mb-8">
        <div className="size-14 rounded-full bg-secondary shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-40 bg-secondary" />
            <div className="h-3 w-24 bg-secondary" />
            <div className="h-3 w-32 bg-secondary" />
          </div>
          <div className="h-3 w-full bg-secondary" />
          <div className="h-3 w-2/3 bg-secondary" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-background p-5">
            <div className="h-3 w-16 bg-secondary mb-3" />
            <div className="h-7 w-20 bg-secondary" />
          </div>
        ))}
      </div>
      <div className="border border-border/60 p-5 mb-10">
        <div className="h-3 w-40 bg-secondary mb-4" />
        <div className="h-[88px] w-full bg-secondary" />
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="border border-border/60 p-5">
          <div className="h-3 w-24 bg-secondary mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-secondary" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border/60 p-5">
              <div className="h-4 w-32 bg-secondary mb-2" />
              <div className="h-3 w-full bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fallback() {
  return (
    <div className="corner-bracket max-w-md border border-border/60 p-8">
      <Github className="h-6 w-6 text-accent mb-4" />
      <h3 className="text-xl font-medium text-foreground mb-2">
        GitHub activity isn&apos;t available right now.
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Live contribution data couldn&apos;t be loaded. You can still browse my repositories
        directly.
      </p>
      <Link
        href={personalInfo.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors link-underline"
      >
        Open GitHub profile
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// Absolute month-year (not relative "2 days ago") so it never drifts across
// the 6h cache window. Runs only post-fetch, never during SSR.
function formatMonthYear(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
}

export function GitHubActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github", { headers: { accept: "application/json" }, signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload: GitHubActivityPayload | null) => {
        if (controller.signal.aborted) return;
        if (payload && payload.available) {
          setData(payload);
          setStatus("ready");
        } else {
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("fallback");
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="github" className="pt-12 md:pt-16 pb-20 md:pb-28 relative overflow-hidden">
      <SectionNumber className="bottom-0 left-0 -translate-x-1/4 translate-y-1/4">08</SectionNumber>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="GitHub Activity" number="08" />
        </MotionWrapper>

        {status === "loading" && <Skeleton />}
        {status === "fallback" && (
          <MotionWrapper delay={0.1}>
            <Fallback />
          </MotionWrapper>
        )}
        {status === "ready" && data && (
          <>
            <MotionWrapper delay={0.05} className="mb-8">
              <div className="corner-bracket flex items-start gap-4 sm:gap-5 p-5 border border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.identity.avatarUrl}
                  alt={data.identity.name ?? data.identity.login}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="rounded-full border border-border/60 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg sm:text-xl font-medium text-foreground truncate">
                      {data.identity.name ?? data.identity.login}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      @{data.identity.login}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · on GitHub since {data.identity.memberSince}
                    </span>
                    {data.identity.isHireable && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-accent border border-accent/40 px-1.5 py-0.5">
                        Open to work
                      </span>
                    )}
                  </div>
                  {data.identity.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                      {data.identity.bio}
                    </p>
                  )}
                  {data.identity.status && (
                    <p className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center gap-1.5">
                      {data.identity.status.emoji && (
                        <span className="text-base leading-none">
                          {data.identity.status.emoji}
                        </span>
                      )}
                      {data.identity.status.message && (
                        <span>{data.identity.status.message}</span>
                      )}
                      {data.identity.status.limited && (
                        <span className="opacity-60">· limited availability</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </MotionWrapper>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border mb-10"
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delayChildren: 0.1 }}
            >
              <motion.div variants={listItem} className="bg-background">
                <Stat
                  label="Contributions"
                  value={<CountUp to={data.totalContributions} duration={1600} />}
                />
              </motion.div>
              <motion.div variants={listItem} className="bg-background">
                <Stat
                  label="Current streak"
                  value={<CountUp to={data.currentStreak} suffix=" days" duration={1200} />}
                />
              </motion.div>
              <motion.div variants={listItem} className="bg-background">
                <Stat
                  label="Longest streak"
                  value={<CountUp to={data.longestStreak} suffix=" days" duration={1200} />}
                />
              </motion.div>
              <motion.div variants={listItem} className="bg-background">
                <Stat label="Public repos" value={<CountUp to={data.publicRepos} duration={1000} />} />
              </motion.div>
              <motion.div variants={listItem} className="bg-background">
                <Stat label="Followers" value={<CountUp to={data.followers} duration={1000} />} />
              </motion.div>
            </motion.div>

            <MotionWrapper delay={0.18} className="mb-10">
              <div className="corner-bracket p-5 border border-border/60">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  Contribution graph · last 12 months
                </p>
                {/* Mobile (<md): fixed-size cells scroll horizontally. */}
                <div className="md:hidden overflow-x-auto pb-2">
                  <div className="flex gap-[3px] w-max">
                    {data.weeks.map((week, wi) => (
                      <div
                        key={week.days[0]?.date ?? wi}
                        className="grid grid-rows-7 gap-[3px]"
                      >
                        {week.days.map((d) => (
                          <div
                            key={d.date}
                            title={`${d.date} · ${d.count} contribution${d.count === 1 ? "" : "s"}`}
                            className={cn(
                              "size-[10px] rounded-[2px]",
                              LEVEL_CLASS[d.level]
                            )}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* md+: cells stretch edge-to-edge via a fixed 53-column grid.
                    Each cell is `aspect-square w-full` so it fills its column. */}
                <div
                  className="hidden md:grid gap-[3px]"
                  style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
                >
                  {data.weeks.flatMap((week, wi) =>
                    week.days.map((d, di) => (
                      <motion.div
                        key={d.date}
                        title={`${d.date} · ${d.count} contribution${d.count === 1 ? "" : "s"}`}
                        className={cn(
                          "aspect-square w-full rounded-[2px]",
                          LEVEL_CLASS[d.level]
                        )}
                        // Per-cell stagger, capped so the cascade stays under ~1s.
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min((wi * 7 + di) * 0.003, 0.9),
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </MotionWrapper>

            <div className="grid md:grid-cols-2 gap-10">
              {data.topLanguages.length > 0 && (
                <MotionWrapper delay={0.23}>
                  <div className="corner-bracket p-5 border border-border/60 h-full">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                      Top languages
                    </p>
                    <motion.ul
                      className="space-y-3"
                      variants={listContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-60px" }}
                    >
                      {data.topLanguages.map((l) => (
                        <motion.li key={l.name} variants={listItem}>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-foreground">{l.name}</span>
                            <span className="text-muted-foreground">
                              {Math.round(l.percent)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-accent rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${l.percent}%` }}
                              viewport={{ once: true, margin: "-60px" }}
                              transition={{
                                duration: 0.7,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                            />
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </MotionWrapper>
              )}

              {data.pinnedRepos.length > 0 && (
                <MotionWrapper delay={0.28}>
                  <motion.ul
                    className="space-y-3"
                    variants={listContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                  >
                    {data.pinnedRepos.map((r) => (
                      <motion.li key={r.name} variants={listItem}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="corner-bracket group block p-5 border border-border/60 hover:border-accent/60 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                              <Github className="h-3.5 w-3.5" />
                              {r.name}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                          </div>
                          {r.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                              {r.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground">
                            {r.primaryLanguage && (
                              <span className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-accent" />
                                {r.primaryLanguage}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {r.stars}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {r.forks}
                            </span>
                            {r.updatedAt && <span>updated {formatMonthYear(r.updatedAt)}</span>}
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </MotionWrapper>
              )}
            </div>

            <MotionWrapper delay={0.33} className="mt-10 text-center">
              <Link
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
              >
                <Github className="h-4 w-4" />
                View full GitHub profile
              </Link>
            </MotionWrapper>
          </>
        )}
      </div>
    </section>
  );
}