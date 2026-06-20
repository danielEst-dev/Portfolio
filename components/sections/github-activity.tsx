"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
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

// Short "Mon D" date for the best-day row of the activity card.
function formatShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

// "Mon D, YYYY" for the contribution-cell tooltip.
function formatCellDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

// Structural subset of DOMRect — accepts a real rect (cell/row) or a synthetic
// cursor-point rect built from a mouse event.
type TipRect = { top: number; bottom: number; left: number; right: number; width: number; height: number };

// Position a fixed tooltip above (or, if too close to the top, below) a rect,
// clamping horizontally so it can't spill off the viewport edges.
function positionTooltip(tip: HTMLElement, rect: TipRect): void {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const placeBelow = rect.top < 64;
  const left = Math.max(64, Math.min(rect.left + rect.width / 2, vw - 64));
  tip.style.left = `${left}px`;
  tip.style.top = placeBelow ? `${rect.bottom + 8}px` : `${rect.top - 8}px`;
  tip.style.transform = placeBelow ? "translateX(-50%)" : "translateX(-50%) translateY(-100%)";
}

// Derive an "activity rhythm" summary from the contribution calendar weeks,
// which are already shipped to the client for the graph — so this adds no
// payload and no extra API call. Runs only post-fetch, like the formatters above.
const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
] as const;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

type Momentum = { pct: number | null; dir: "up" | "down" | "flat" };

type ActivityRhythm = {
  activeDays: number;
  totalDays: number;
  longestGap: number;
  avgPerActiveDay: number | null;
  bestDay: { count: number; date: string } | null;
  busiestWeekday: string | null;
  busiestMonth: string | null;
  momentum: Momentum | null;
};

// Format the momentum row as "↑ 23%" / "↓ 8%" / "flat" / "↑ new activity"
// (the last when there was no activity in the prior window to compare to).
function momentumLabel(m: Momentum): string {
  if (m.pct === null) return m.dir === "up" ? "↑ new activity" : "flat";
  if (m.pct === 0) return "flat";
  return `${m.dir === "up" ? "↑" : "↓"} ${Math.abs(m.pct)}%`;
}

function computeActivityRhythm(weeks: ActivityData["weeks"]): ActivityRhythm {
  const days = weeks.flatMap((w) => w.days);

  const weekdaySums = new Array(7).fill(0);
  const monthSums = new Array(12).fill(0);
  let activeDays = 0;
  let totalContribs = 0;
  let bestDay: { count: number; date: string } | null = null;

  for (const day of days) {
    totalContribs += day.count;
    if (day.count > 0) activeDays += 1;
    if (!bestDay || day.count > bestDay.count) bestDay = { count: day.count, date: day.date };
    const d = new Date(day.date);
    if (!Number.isNaN(d.getTime())) {
      weekdaySums[d.getUTCDay()] += day.count;
      monthSums[d.getUTCMonth()] += day.count;
    }
  }

  // Longest gap: longest run of zero-contribution days. Drop the final day if
  // it's zero (today isn't over) so an in-progress day can't inflate the gap.
  const gapDays =
    days.length && days[days.length - 1].count === 0 ? days.slice(0, -1) : days;
  let gapRun = 0;
  let longestGap = 0;
  for (const d of gapDays) {
    if (d.count > 0) gapRun = 0;
    else if ((gapRun += 1) > longestGap) longestGap = gapRun;
  }

  // Recent momentum: total of the last 30 days vs the 30 before that. Needs a
  // 60-day window to be meaningful; otherwise leave it null.
  let momentum: Momentum | null = null;
  if (days.length >= 60) {
    const last30 = days.slice(-30).reduce((s, d) => s + d.count, 0);
    const prev30 = days.slice(-60, -30).reduce((s, d) => s + d.count, 0);
    if (prev30 === 0) {
      momentum = { pct: null, dir: last30 > 0 ? "up" : "flat" };
    } else {
      const pct = Math.round(((last30 - prev30) / prev30) * 100);
      momentum = { pct, dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat" };
    }
  }

  const topWeekday = weekdaySums.reduce((best, v, i) => (v > weekdaySums[best] ? i : best), 0);
  const topMonth = monthSums.reduce((best, v, i) => (v > monthSums[best] ? i : best), 0);

  return {
    activeDays,
    totalDays: days.length,
    longestGap,
    avgPerActiveDay: activeDays > 0 ? Math.round((totalContribs / activeDays) * 10) / 10 : null,
    bestDay: bestDay && bestDay.count > 0 ? bestDay : null,
    busiestWeekday: weekdaySums[topWeekday] > 0 ? WEEKDAY_NAMES[topWeekday] : null,
    busiestMonth: monthSums[topMonth] > 0 ? MONTH_NAMES[topMonth] : null,
    momentum,
  };
}

export function GitHubActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  // Derived from the calendar weeks already in the payload — no extra fetch.
  const rhythm = useMemo(() => (data ? computeActivityRhythm(data.weeks) : null), [data]);

  // ---- Contribution-cell tooltip (instant, themed) -------------------------
  // Imperative tooltip updated on hover so sweeping across ~365 cells never
  // triggers a React re-render. Portaled to <body> so it escapes the section's
  // overflow-hidden and any transformed ancestors, and positions fixed to the
  // viewport. `isClient` gates the portal to avoid an SSR/hydration mismatch.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipPrimaryRef = useRef<HTMLDivElement | null>(null);
  const tooltipSecondaryRef = useRef<HTMLDivElement | null>(null);

  // ---- Custom mobile scroll (drag-to-scroll + themed thumb) ----------------
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScroll: 0 });

  // Generic tooltip shower: writes the two lines and positions the fixed,
  // portaled tooltip above (or below, near the top) the hovered rect. Shared
  // by the contribution graph cells and the top-languages rows so both get the
  // same instant, themed, re-render-free hover tooltip.
  const showTip = (primary: string, secondary: string, rect: TipRect) => {
    const tip = tooltipRef.current;
    if (!tip || !tooltipPrimaryRef.current || !tooltipSecondaryRef.current) return;
    tooltipPrimaryRef.current.textContent = primary;
    tooltipSecondaryRef.current.textContent = secondary;
    positionTooltip(tip, rect);
    tip.style.opacity = "1";
  };
  const hideTip = () => {
    if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
  };

  const handleCellOver = (e: ReactMouseEvent) => {
    if (dragRef.current.dragging) return;
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]");
    if (el) {
      const count = Number(el.dataset.count ?? 0);
      showTip(
        `${count} ${count === 1 ? "contribution" : "contributions"}`,
        formatCellDate(el.dataset.date ?? ""),
        el.getBoundingClientRect()
      );
    }
  };
  const handleTipLeave = () => hideTip();

  const updateThumb = useCallback(() => {
    const el = mobileScrollRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const max = el.scrollWidth - el.clientWidth;
    const width = el.scrollWidth > 0 ? (el.clientWidth / el.scrollWidth) * 100 : 100;
    const left = max > 0 ? (el.scrollLeft / max) * (100 - width) : 0;
    thumb.style.left = `${left}%`;
    thumb.style.width = `${width}%`;
  }, []);

  // Mouse-only drag-to-scroll; touch keeps native horizontal panning.
  const handlePointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget as HTMLElement;
    dragRef.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    hideTip();
  };
  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current.dragging) return;
    const el = e.currentTarget as HTMLElement;
    el.scrollLeft = dragRef.current.startScroll - (e.clientX - dragRef.current.startX);
  };
  const handlePointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current.dragging) return;
    const el = e.currentTarget as HTMLElement;
    dragRef.current.dragging = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [updateThumb, data]);

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

            <MotionWrapper delay={0.18} className="mb-10">
              <div className="corner-bracket p-5 border border-border/60">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  Contribution graph · last 12 months
                </p>
                {/* Mobile (<md): fixed-size cells in a custom drag-to-scroll
                    track with a themed thumb indicator. Native scrollbar is
                    hidden; touch still pans natively, mouse drags to scroll. */}
                <div className="md:hidden">
                  <div
                    ref={mobileScrollRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onScroll={updateThumb}
                    className="overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [touch-action:pan-x]"
                  >
                    <div
                      className="flex gap-[3px] w-max"
                      onMouseOver={handleCellOver}
                      onMouseLeave={handleTipLeave}
                    >
                      {data.weeks.map((week, wi) => (
                        <div
                          key={week.days[0]?.date ?? wi}
                          className="grid grid-rows-7 gap-[3px]"
                        >
                          {week.days.map((d) => (
                            <div
                              key={d.date}
                              data-cell
                              data-date={d.date}
                              data-count={d.count}
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
                  <div className="mt-3 h-1 bg-secondary rounded-full relative" aria-hidden="true">
                    <div
                      ref={thumbRef}
                      className="absolute top-0 h-full bg-accent rounded-full"
                      style={{ left: "0%", width: "100%" }}
                    />
                  </div>
                </div>
                {/* md+: cells stretch edge-to-edge via a fixed 53-column grid.
                    Each cell is `aspect-square w-full` so it fills its column. */}
                <div
                  className="hidden md:grid gap-[3px]"
                  style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
                  onMouseOver={handleCellOver}
                  onMouseLeave={handleTipLeave}
                >
                  {data.weeks.flatMap((week, wi) =>
                    week.days.map((d, di) => (
                      <motion.div
                        key={d.date}
                        data-cell
                        data-date={d.date}
                        data-count={d.count}
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

                  {rhythm && (
                    <MotionWrapper delay={0.28}>
                      <div className="corner-bracket p-5 border border-border/60">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                          Activity rhythm
                        </p>
                        <motion.ul
                          className="space-y-3"
                          variants={listContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, margin: "-60px" }}
                        >
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Days active</span>
                            <span className="text-xs font-mono text-foreground tabular-nums">
                              {rhythm.activeDays} days
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Longest gap</span>
                            <span className="text-xs font-mono text-foreground tabular-nums">
                              {rhythm.longestGap} days
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Avg / active day</span>
                            <span className="text-xs font-mono text-foreground tabular-nums">
                              {rhythm.avgPerActiveDay ?? "—"}
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Best day</span>
                            <span className="text-xs font-mono text-foreground tabular-nums">
                              {rhythm.bestDay
                                ? `${rhythm.bestDay.count} · ${formatShortDate(rhythm.bestDay.date)}`
                                : "—"}
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Busiest weekday</span>
                            <span className="text-xs font-mono text-foreground">
                              {rhythm.busiestWeekday ?? "—"}
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Busiest month</span>
                            <span className="text-xs font-mono text-foreground">
                              {rhythm.busiestMonth ?? "—"}
                            </span>
                          </motion.li>
                          <motion.li variants={listItem} className="flex items-baseline justify-between gap-3">
                            <span className="text-xs text-muted-foreground">Recent momentum</span>
                            <span className="text-xs font-mono text-foreground tabular-nums">
                              {rhythm.momentum ? momentumLabel(rhythm.momentum) : "—"}
                            </span>
                          </motion.li>
                        </motion.ul>
                      </div>
                    </MotionWrapper>
                  )}
            </div>

              {data.pinnedRepos.length > 0 && (
                <MotionWrapper delay={0.33} className="mt-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    Pinned repositories
                  </p>
                  <motion.ul
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
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
                          className="corner-bracket group block h-full p-5 border border-border/60 hover:border-accent/60 transition-colors"
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

            {isClient &&
              createPortal(
                <div
                  ref={tooltipRef}
                  className="fixed z-50 pointer-events-none opacity-0"
                  style={{ opacity: 0 }}
                >
                  <div className="bg-background border border-border shadow-sm rounded px-2 py-1 text-center whitespace-nowrap">
                    <div
                      ref={tooltipPrimaryRef}
                      className="text-[11px] font-mono text-foreground tabular-nums"
                    />
                    <div ref={tooltipSecondaryRef} className="text-[10px] text-muted-foreground" />
                  </div>
                </div>,
                document.body
              )}
          </>
        )}
      </div>
    </section>
  );
}