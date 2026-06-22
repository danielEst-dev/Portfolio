"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { MotionWrapper } from "@/components/motion-wrapper";
import { cn } from "@/lib/utils";
import type { ActivityData } from "./shared";

// Contribution level → background class. Opacities of the accent token map
// GitHub's quartile buckets; level 0 is the muted "no activity" cell.
const LEVEL_CLASS = [
  "bg-secondary",
  "bg-accent/20",
  "bg-accent/40",
  "bg-accent/70",
  "bg-accent",
] as const;

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

// CSS keyframe for the per-cell reveal cascade. Previously each of the ~365
// cells registered its own framer-motion IntersectionObserver via whileInView;
// that was wasteful and scaled with O(cells). Now a single self-contained
// <style> tag (scoped by a unique class prefix) drives a CSS animation-delay
// cascade — one animation declaration, ~365 cheap inline styles. The section
// is lazy-mounted by LazyBoundary near the viewport, so cells animate on mount.
// `prefers-reduced-motion` disables the animation and renders cells static.
const CELL_KEYFRAME_CSS = `
.gh-contrib-cell {
  opacity: 0;
  transform: scale(0.6);
  animation-name: gh-contrib-cell-in;
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  animation-fill-mode: forwards;
}
@keyframes gh-contrib-cell-in {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .gh-contrib-cell {
    opacity: 1;
    transform: none;
    animation: none;
  }
}`;

export function ContributionGraph({ weeks }: { weeks: ActivityData["weeks"] }) {
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
  }, [updateThumb, weeks]);

  return (
    <MotionWrapper delay={0.18} className="mb-10">
      {/* eslint-disable-next-line react/no-danger -- static, constant string */}
      <style dangerouslySetInnerHTML={{ __html: CELL_KEYFRAME_CSS }} />
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
              {weeks.map((week, wi) => (
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
            Each cell is `aspect-square w-full` so it fills its column.
            The per-cell reveal is a CSS animation-delay cascade (one shared
            keyframe, no per-cell IntersectionObserver) — see CELL_KEYFRAME_CSS. */}
        <div
          className="hidden md:grid gap-[3px]"
          style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
          onMouseOver={handleCellOver}
          onMouseLeave={handleTipLeave}
        >
          {weeks.flatMap((week, wi) =>
            week.days.map((d, di) => (
              <div
                key={d.date}
                data-cell
                data-date={d.date}
                data-count={d.count}
                className={cn(
                  "gh-contrib-cell aspect-square w-full rounded-[2px]",
                  LEVEL_CLASS[d.level]
                )}
                // Per-cell stagger, capped so the cascade stays under ~1s.
                // Matches the previous framer delay: (wi*7+di)*0.003s, max 0.9s.
                style={{ animationDelay: `${Math.min((wi * 7 + di) * 3, 900)}ms` }}
              />
            ))
          )}
        </div>
      </div>

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
    </MotionWrapper>
  );
}