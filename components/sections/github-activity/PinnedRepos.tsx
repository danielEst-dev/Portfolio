"use client";

import { motion } from "framer-motion";
import { Github, Star, GitFork, ArrowUpRight } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { listContainer, listItem } from "./shared";
import type { ActivityData } from "./shared";

// Absolute month-year (not relative "2 days ago") so it never drifts across
// the 6h cache window. Runs only post-fetch, never during SSR.
function formatMonthYear(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
}

export function PinnedRepos({ pinnedRepos }: { pinnedRepos: ActivityData["pinnedRepos"] }) {
  if (pinnedRepos.length === 0) return null;

  return (
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
        {pinnedRepos.map((r) => (
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
  );
}