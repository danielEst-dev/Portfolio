"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GitHubActivityPayload } from "@/lib/github";

// ---------------------------------------------------------------------------
// Below-fold Client Sections, code-split via next/dynamic.
//
// Per the in-repo lazy-loading guide, `dynamic()` must be called at module top
// level (not inside render) for chunk preloading to work, and `ssr: false` is
// only valid inside a Client Component module — both satisfied here. Each
// chunk is requested only once its section nears the viewport, so the initial
// client bundle stays small. The wrappers themselves are plain Client
// Components (server-rendered), so their placeholder markup is in the first
// paint and reserves space; only the inner section chunk is deferred.
// ---------------------------------------------------------------------------
const GitHubActivityDynamic = dynamic(
  () => import("@/components/sections/github-activity").then((m) => m.GitHubActivity),
  { ssr: false }
);
const ExperienceDynamic = dynamic(
  () => import("@/components/sections/experience").then((m) => m.Experience),
  { ssr: false }
);
const SkillsDynamic = dynamic(
  () => import("@/components/sections/skills").then((m) => m.Skills),
  { ssr: false }
);
const CertificationsDynamic = dynamic(
  () => import("@/components/sections/certifications").then((m) => m.Certifications),
  { ssr: false }
);

/**
 * Flip to `true` the first time the watched element enters the `rootMargin`
 * band, then disconnect. Stays `true` for the component's life so a revealed
 * section never unmounts. The 200px margin preloads the chunk just before the
 * section is visible, hiding most of the load latency.
 */
function useNearViewport(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return; // already revealed — observer is no longer needed
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [near, rootMargin]);
  return { ref, near };
}

// A minimal, on-brand skeleton that reserves space (no CLS) and respects
// prefers-reduced-motion via the Tailwind `motion-reduce:` variant — matches
// the codebase's existing skeleton styling (bg-secondary + animate-pulse).
function SectionSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div className="h-px w-full bg-border" />
      <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-12 md:pt-16 space-y-3">
        <div className="h-3 w-32 bg-secondary rounded" />
        <div className="h-40 w-full bg-secondary rounded" />
        <div className="h-24 w-2/3 bg-secondary rounded" />
      </div>
    </div>
  );
}

/**
 * Wrap a below-fold section: render a min-height skeleton (reserving space in
 * the initial HTML so there's no layout shift) until the wrapper nears the
 * viewport, then mount the section's client chunk. The `minHeight` lives on
 * the wrapper div itself, so the space stays reserved even during the brief
 * moment between reveal and chunk load.
 */
function LazyBoundary({ minHeight, children }: { minHeight: number; children: ReactNode }) {
  const { ref, near } = useNearViewport();
  return (
    <div ref={ref} style={{ minHeight }}>
      {near ? children : <SectionSkeleton />}
    </div>
  );
}

export function LazyGitHubActivity({ initialData }: { initialData: GitHubActivityPayload }) {
  return (
    <LazyBoundary minHeight={900}>
      <GitHubActivityDynamic initialData={initialData} />
    </LazyBoundary>
  );
}

export function LazyExperience() {
  return (
    <LazyBoundary minHeight={560}>
      <ExperienceDynamic />
    </LazyBoundary>
  );
}

export function LazySkills() {
  return (
    <LazyBoundary minHeight={560}>
      <SkillsDynamic />
    </LazyBoundary>
  );
}

export function LazyCertifications() {
  return (
    <LazyBoundary minHeight={480}>
      <CertificationsDynamic />
    </LazyBoundary>
  );
}