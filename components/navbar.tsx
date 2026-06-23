"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, personalInfo } from "@/lib/data";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useIsMac } from "@/lib/hooks";
import { motion, useReducedMotion } from "framer-motion";

// Shared easing used across the site's motion (hero entrance, accent rule,
// link underline). Reusing it keeps the nav's motion in the same dialect.
const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMac = useIsMac();
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Scroll-aware header: borderless + transparent at the very top, hairline
  // border + blurred background materialize once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape + lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const monogram = (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 text-xs font-semibold tracking-tight transition-colors group-hover:border-foreground/50 group-hover:bg-foreground group-hover:text-background">
      DE
    </span>
  );

  const isActiveRoute = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  // The sliding accent indicator tracks the hovered link and falls back to the
  // active route when the cursor leaves the nav. Position is measured from the
  // target link and applied as a transform/width transition on a single
  // absolutely-positioned span — deliberately NOT framer-motion `layoutId`,
  // which fights the native view transition on route changes and jumps.
  const activeIndex = navLinks.findIndex((link) => isActiveRoute(link.href));
  const indicatorIndex = hovered !== null ? hovered : activeIndex;
  const indexRef = useRef(indicatorIndex);

  const measure = useCallback((i: number) => {
    const el = linkRefs.current[i];
    if (!el) {
      setIndicator(null);
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  // Re-measure whenever the target link changes (hover or route). The ref is
  // updated here (in an effect, not during render) so the resize handler below
  // can read the latest index.
  useLayoutEffect(() => {
    indexRef.current = indicatorIndex;
    measure(indicatorIndex);
  }, [indicatorIndex, measure]);

  // Enable the transition only after first paint so the indicator snaps to
  // the active route on load instead of sliding in. Also re-measure on resize
  // and once webfonts settle (link widths shift when the mono font loads).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    const onResize = () => measure(indexRef.current);
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measure(indexRef.current)).catch(() => {});
    }
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  return (
    <motion.header
      // No entrance animation: <Navbar> is rendered per-page (not in the
      // persistent layout), so a mount entrance would re-play on every
      // navigation. Render in place instantly instead. The scroll-aware
      // background/border transition below (CSS) and the `site-header`
      // view-transition pin are unaffected.
      className={`sticky top-0 z-50 w-full backdrop-blur-2xl transition-[background-color,border-color] duration-[800ms] ${
        scrolled
          ? "border-b border-border/40 bg-background/40 backdrop-saturate-200 backdrop-contrast-105 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_2px_2px_-1px_rgba(255,90,90,0.06),inset_0_-2px_2px_-1px_rgba(90,170,255,0.06)]"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Desktop: three-zone grid — identity / centered nav / utility.
            Centering the nav (instead of justify-between) is what makes the
            bar read as a deliberate, full frame rather than a thin spread. */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:h-16 md:gap-6">
          {/* Identity */}
          <Link
            href="/"
            className="group flex items-center gap-3 justify-self-start text-foreground"
            aria-label={personalInfo.name}
          >
            {monogram}
            <span className="text-sm font-medium tracking-tight">{personalInfo.name}</span>
          </Link>

          {/* Centered primary nav with a sliding accent indicator. The
              indicator is driven by measured positions + a CSS transition,
              so it slides on hover and follows the active route on navigate
              without fighting the view transition. */}
          <nav
            className="relative flex items-center gap-7 justify-self-center"
            aria-label="Primary"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link, i) => {
              const isActive = i === activeIndex;
              return (
                <Link
                  key={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  transitionTypes={["nav-forward"]}
                  onMouseEnter={() => setHovered(i)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {indicator && (
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-[-2px] left-0 h-px bg-accent"
                style={{
                  width: `${indicator.width}px`,
                  transform: `translateX(${indicator.left}px)`,
                  transition:
                    mounted && !reduce
                      ? `transform 320ms ${EASE}, width 320ms ${EASE}`
                      : "none",
                }}
              />
            )}
          </nav>

          {/* Utility cluster — ⌘K + theme grouped into an inset container */}
          <div className="flex items-center gap-1 justify-self-end rounded-md border border-border/60 bg-secondary/40 p-1">
            <button
              onClick={() => {
                document.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open command palette"
            >
              <Search className="h-3 w-3" />
              <span>{isMac ? "⌘K" : "Ctrl+K"}</span>
            </button>
            <span className="h-4 w-px bg-border/60" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: mark left, controls right */}
        <div className="flex md:hidden h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-foreground"
            aria-label={personalInfo.name}
          >
            {monogram}
            <span className="text-sm font-medium tracking-tight">{personalInfo.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={toggleRef}
              onClick={() => setOpen(!open)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border/40 bg-background"
        >
          <nav
            aria-label="Mobile primary"
            className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => {
              const isActive = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={["nav-forward"]}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </motion.header>
  );
}