"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { listContainer, listItem } from "./shared";
import type { ActivityData } from "./shared";

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
  totalContribs: number;
  longestGap: number;
  avgPerActiveDay: number | null;
  bestDay: { count: number; date: string } | null;
  busiestWeekday: string | null;
  busiestMonth: string | null;
  momentum: Momentum | null;
  // Last 30 days of contribution counts, oldest→newest. Drives the trend
  // sparkline. Fewer than 30 if the calendar is shorter; empty if no days.
  recentSeries: number[];
};

// Format the momentum row as "↑ 23%" / "↓ 8%" / "flat" / "↑ new activity"
// (the last when there was no activity in the prior window to compare to).
function momentumLabel(m: Momentum): string {
  if (m.pct === null) return m.dir === "up" ? "↑ new activity" : "flat";
  if (m.pct === 0) return "flat";
  return `${m.dir === "up" ? "↑" : "↓"} ${Math.abs(m.pct)}%`;
}

// Short "Mon D" date for the best-day row of the activity card.
function formatShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

// Derive an "activity rhythm" summary from the contribution calendar weeks,
// which are already shipped to the client for the graph — so this adds no
// payload and no extra API call. Runs only post-fetch, like the formatters above.
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

  const recentSeries = days.slice(-30).map((d) => d.count);

  return {
    activeDays,
    totalDays: days.length,
    totalContribs,
    longestGap,
    avgPerActiveDay: activeDays > 0 ? Math.round((totalContribs / activeDays) * 10) / 10 : null,
    bestDay: bestDay && bestDay.count > 0 ? bestDay : null,
    busiestWeekday: weekdaySums[topWeekday] > 0 ? WEEKDAY_NAMES[topWeekday] : null,
    busiestMonth: monthSums[topMonth] > 0 ? MONTH_NAMES[topMonth] : null,
    momentum,
    recentSeries,
  };
}

export function ActivityRhythm({ weeks }: { weeks: ActivityData["weeks"] }) {
  const rhythm = useMemo(() => computeActivityRhythm(weeks), [weeks]);

  // Live-motion gate for the activity-rhythm dashboard. The perpetual "data
  // flow" animations only run while the panel is on screen (saves CPU/battery
  // when scrolled away) and the user hasn't requested reduced motion.
  const rhythmPanelRef = useRef<HTMLDivElement | null>(null);
  const [rhythmInView, setRhythmInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = rhythmPanelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setRhythmInView(entry.isIntersecting),
      { rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rhythm]);

  // `live` gates every perpetual animation below: on-screen AND no
  // reduced-motion preference. When false, each animated element resolves to
  // a static target (no repeat) so motion stops cleanly instead of freezing.
  const live = rhythmInView && !reducedMotion;

  const series = rhythm.recentSeries;
  const showSparkline = series.length >= 2;
  const W = 300;
  const H = 48;
  const maxS = Math.max(1, ...series);
  const coords = series.map((c, i) => {
    const x = series.length > 1 ? (i / (series.length - 1)) * W : 0;
    const y = H - (c / maxS) * (H - 6) - 3;
    return { x, y };
  });
  const linePoints = coords
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = showSparkline
    ? `M0,${H} ${coords
        .map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ")} L${W},${H} Z`
    : "";
  // One flow cycle = dash + gap, so the bright dash travels the whole line
  // before the loop repeats seamlessly.
  const FLOW_DASH = 6;
  const FLOW_GAP = 200;
  const FLOW_LEN = FLOW_DASH + FLOW_GAP;

  const kpis: { label: string; value: string; sub?: string }[] = [
    { label: "Active days", value: `${rhythm.activeDays}` },
    {
      label: "Best day",
      value: rhythm.bestDay ? `${rhythm.bestDay.count}` : "—",
      sub: rhythm.bestDay ? formatShortDate(rhythm.bestDay.date) : undefined,
    },
    { label: "Momentum", value: rhythm.momentum ? momentumLabel(rhythm.momentum) : "—" },
  ];

  return (
    <MotionWrapper delay={0.28}>
      <div ref={rhythmPanelRef} className="corner-bracket p-5 border border-border/60 h-full">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
          Activity rhythm
        </p>

        {/* KPI tiles. */}
        <motion.div
          className="grid grid-cols-3 gap-px bg-border border border-border mb-5"
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {kpis.map((k) => (
            <motion.div
              key={k.label}
              variants={listItem}
              className="bg-background p-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
                {k.label}
              </p>
              <p className="text-xl font-medium text-foreground tabular-nums leading-none">
                {k.value}
              </p>
              {k.sub && (
                <p className="text-[10px] font-mono text-muted-foreground mt-1">{k.sub}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* 30-day trend sparkline. A dim base line plus a bright dash that
            travels along it (marching-ants "data streaming" effect), over a
            soft area fill. */}
        {showSparkline && (
          <motion.div
            variants={listItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                30-day trend
              </p>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {series.reduce((s, c) => s + c, 0)} contribs
              </span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="w-full h-12 text-accent"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="rhythmArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#rhythmArea)" />
              <polyline
                points={linePoints}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <motion.polyline
                points={linePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${FLOW_DASH} ${FLOW_GAP}`}
                initial={{ strokeDashoffset: 0 }}
                animate={live ? { strokeDashoffset: [0, -FLOW_LEN] } : { strokeDashoffset: 0 }}
                transition={
                  live ? { duration: 2.4, repeat: Infinity, ease: "linear" } : undefined
                }
              />
            </svg>
          </motion.div>
        )}
      </div>
    </MotionWrapper>
  );
}