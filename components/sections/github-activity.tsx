"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { SectionNumber } from "@/components/section-number";
import { MotionWrapper } from "@/components/motion-wrapper";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/lib/data";
import { Github, ArrowUpRight, RefreshCw } from "lucide-react";
import type { GitHubActivityPayload } from "@/lib/github";
import type { ActivityData } from "./github-activity/shared";
import { listContainer, listItem } from "./github-activity/shared";
import { IdentityStrip } from "./github-activity/IdentityStrip";
import { ContributionGraph } from "./github-activity/ContributionGraph";
import { ActivityRhythm } from "./github-activity/ActivityRhythm";
import { PinnedRepos } from "./github-activity/PinnedRepos";

function Stat({
  label,
  value,
  hero,
}: {
  label: string;
  value: ReactNode;
  // Hero stat spans the full width of its row on mobile (see the stat grid),
  // so it gets a larger value to read as a headline; on md+ it collapses back
  // to the same size as the other four.
  hero?: boolean;
}) {
  return (
    <div className="bg-background p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </p>
      <div
        className={cn(
          "font-medium text-foreground tabular-nums",
          hero ? "text-3xl md:text-2xl" : "text-2xl"
        )}
      >
        {value}
      </div>
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
          <div className="h-2 w-full bg-secondary rounded-full mb-5" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-secondary" />
            ))}
          </div>
          <div className="h-3 w-48 bg-secondary mt-5" />
        </div>
        <div className="border border-border/60 p-5">
          <div className="h-3 w-28 bg-secondary mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-secondary" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div className="h-3 w-32 bg-secondary mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border/60 p-5 h-24">
              <div className="h-4 w-32 bg-secondary mb-2" />
              <div className="h-3 w-full bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fallback({ onRetry }: { onRetry?: () => void }) {
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
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors link-underline"
        >
          Open GitHub profile
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function GitHubActivity({ initialData }: { initialData?: GitHubActivityPayload }) {
  // When the server passes initialData (the 6h-cached GitHub payload), use it
  // for the first paint and skip the mount-time fetch below — the panel renders
  // immediately with no client round-trip. The /api/github refetch path still
  // exists via the refresh button for on-demand updates.
  const [data, setData] = useState<ActivityData | null>(
    initialData && initialData.available ? initialData : null
  );
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    initialData ? (initialData.available ? "ready" : "fallback") : "loading"
  );
  const [refreshing, setRefreshing] = useState(false);

  // On-demand refresh: re-fetch /api/github and swap in the new payload on
  // success. Leaves the current state intact on failure so a transient error
  // never blanks out an already-rendered panel.
  const refetch = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/github", { headers: { accept: "application/json" } });
      const payload: GitHubActivityPayload | null = r.ok ? await r.json() : null;
      if (payload && payload.available) {
        setData(payload);
        setStatus("ready");
      }
    } catch {
      // keep current state
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // The server already resolved the first paint via initialData; don't
    // fetch on mount. When no initialData is supplied, fall back to the
    // original client-side mount fetch.
    if (initialData) return;
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
  }, [initialData]);

  return (
    <section className="pt-12 md:pt-16 pb-20 md:pb-28 relative overflow-hidden">
      <SectionNumber index={8} />
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <MotionWrapper>
          <SectionLabel label="GitHub Activity" number="08" />
        </MotionWrapper>

        {status === "loading" && <Skeleton />}
        {status === "fallback" && (
          <MotionWrapper delay={0.1}>
            <Fallback onRetry={refetch} />
          </MotionWrapper>
        )}
        {status === "ready" && data && (
          <>
            <IdentityStrip identity={data.identity} />

            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border mb-10"
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delayChildren: 0.1 }}
            >
              <motion.div variants={listItem} className="bg-background col-span-2 md:col-span-1">
                <Stat
                  hero
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

            <ContributionGraph weeks={data.weeks} />

            {/* Top languages + Activity rhythm — a balanced 2-col row that
                always fills the width regardless of whether pinned repos
                exist. Drops to a single column when there are no languages. */}
            <div className={cn("grid gap-10", data.topLanguages.length > 0 && "md:grid-cols-2")}>
              {data.topLanguages.length > 0 && (
                <MotionWrapper delay={0.23}>
                  <div className="corner-bracket p-5 border border-border/60">
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
                            {/* Driven by the parent <motion.ul>'s whileInView="show"
                                rather than its own viewport observer. A standalone
                                whileInView here is unreliable on mobile: nested inside
                                a variant parent, its activation can lose to the
                                inherited variant state and the fill never animates
                                past width:0. Inheriting hidden/show from the ul (whose
                                reveal demonstrably fires — the row labels are visible)
                                guarantees the fill animates on every viewport. */}
                            <motion.div
                              className="h-full bg-accent rounded-full"
                              variants={{
                                hidden: { width: 0 },
                                show: {
                                  width: `${l.percent}%`,
                                  transition: {
                                    duration: 0.7,
                                    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                                  },
                                },
                              }}
                            />
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                    <p className="text-[11px] font-mono text-muted-foreground mt-5 pt-4 border-t border-border/60">
                      Across {data.publicRepos} public repos ·{" "}
                      {data.topLanguages[0]?.name} leads at{" "}
                      {Math.round(data.topLanguages[0]?.percent ?? 0)}%
                    </p>
                  </div>
                </MotionWrapper>
              )}

              <ActivityRhythm weeks={data.weeks} />
            </div>

            <PinnedRepos pinnedRepos={data.pinnedRepos} />

            <MotionWrapper delay={0.33} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
              >
                <Github className="h-4 w-4" />
                View full GitHub profile
              </Link>
              <button
                type="button"
                onClick={refetch}
                disabled={refreshing}
                aria-label="Refresh GitHub activity"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline disabled:opacity-50 disabled:pointer-events-none"
              >
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin motion-reduce:animate-none")}
                />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>
            </MotionWrapper>
          </>
        )}
      </div>
    </section>
  );
}