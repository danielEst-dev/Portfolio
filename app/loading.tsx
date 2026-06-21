// Route-level loading UI. Next.js renders this as the <Suspense> fallback for
// the page while Home() awaits the (6h-cached) GitHub activity fetch —
// normally a near-instant cache hit, so this only paints on a cold cache.
//
// This is a Server Component (no "use client"): the markup is static, so it is
// inherently hydration-safe, and prefers-reduced-motion is honored via the
// Tailwind `motion-reduce:` variant (no client JS required).
export default function Loading() {
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <span className="size-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em]">Loading</span>
      </div>
    </div>
  );
}