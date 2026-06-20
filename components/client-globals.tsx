"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Module-top-level dynamic imports. next/dynamic requires the call at module
// top level (not inside render) so the bundler can wire up code-splitting +
// preloading. ssr: false is ONLY valid in Client Components — this wrapper is
// one ("use client" above) — and would ERROR in a Server Component, which is
// why app/layout.tsx (a Server Component) cannot declare these directly.
// Both target components are NAMED exports (verified: command-palette.tsx
// line 57 `export function CommandPalette`, spotlight.tsx line 6
// `export function Spotlight`), so we use the .then((m) => m.X) form from the
// lazy-loading guide. ssr:false keeps them out of the initial client bundle;
// they load on first interaction (see the effects below).
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);
const Spotlight = dynamic(
  () => import("@/components/spotlight").then((m) => m.Spotlight),
  { ssr: false },
);

export function ClientGlobals() {
  const [mountSpotlight, setMountSpotlight] = useState(false);
  const [mountCommandPalette, setMountCommandPalette] = useState(false);

  // Spotlight: mount on the first pointermove/mousemove (one-shot). Skipped
  // entirely when prefers-reduced-motion: reduce — the listener is never
  // attached, so reduced-motion users never download the Spotlight chunk.
  //
  // lib/hooks.ts has no reduced-motion hook (the codebase uses framer-motion's
  // useReducedMotion elsewhere); we use the inline matchMedia pattern from
  // components/code-particles.tsx and components/count-up.tsx. The check runs
  // in an effect (not during render) so SSR output is stable — the wrapper
  // renders nothing until interaction, with no window/navigator access during
  // render, so there is no hydration mismatch.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // reduced motion: never attach, never mount

    let fired = false;
    const onMove = () => {
      if (fired) return;
      fired = true;
      setMountSpotlight(true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
    };
    // pointermove covers mouse + pen + touch-as-pointer; mousemove is the
    // legacy fallback. Both are one-shot via the `fired` guard, so only the
    // first event triggers a mount and the listeners are removed immediately.
    window.addEventListener("pointermove", onMove);
    window.addEventListener("mousemove", onMove);

    // If the user enables reduced motion mid-session (OS accessibility
    // toggle), stop listening and unmount Spotlight so it disappears.
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("mousemove", onMove);
        setMountSpotlight(false);
      }
    };
    mq.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  // CommandPalette: mount on first ⌘K/Ctrl+K keydown OR the custom
  // "open-command-palette" event. The event is dispatched by:
  //   - components/navbar.tsx (the ⌘K chip in the desktop utility cluster)
  //   - components/open-command-palette-button.tsx (used on app/not-found.tsx)
  // and the palette itself listens for it (command-palette.tsx line 87).
  // Mounting on the event is required: a button click can dispatch it BEFORE
  // any ⌘K, and if the palette isn't mounted the dispatch hits no listener.
  // Once mounted, the palette's own listeners handle all subsequent
  // opens/closes (its keydown handler toggles on ⌘K; its open-command-palette
  // handler forces open). Mounted regardless of reduced-motion preference
  // (it is not motion).
  useEffect(() => {
    let mounted = false;
    const mount = () => {
      if (mounted) return;
      mounted = true;
      setMountCommandPalette(true);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("open-command-palette", onOpen);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore key-repeat (holding ⌘K) — matches the palette's own handler.
      if (e.repeat) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // preventDefault stops the browser's native ⌘K binding (e.g. focus
        // search bar) so the gesture goes to the palette. The palette's own
        // handler does the same; since we remove our listener after mount,
        // there is no double-preventDefault.
        e.preventDefault();
        mount();
      }
    };
    const onOpen = () => mount();
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("open-command-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Replay the open after mount. The dynamic import means the palette's own
  // listeners are NOT attached in time for the TRIGGERING event (the ⌘K keydown
  // or the open-command-palette dispatch that caused this mount). Once the
  // chunk loads, dispatch the open event so the FIRST interaction opens the
  // palette — without this, the first ⌘K / button-click would only mount it
  // and the user would have to interact again to open it. Idempotent: the
  // palette's handler calls setOpen(true), a no-op if already open.
  //
  // The import() here is deduped with the module-top-level dynamic import
  // (same module path -> same chunk), so .then() fires when the palette's code
  // is available. Two rAFs cover the rare case where the first rAF fires
  // before React commits the real CommandPalette and runs its effect (which
  // attaches the open-command-palette listener).
  useEffect(() => {
    if (!mountCommandPalette) return;
    let cancelled = false;
    const rafIds: number[] = [];
    import("@/components/command-palette")
      .then(() => {
        if (cancelled) return;
        rafIds.push(
          requestAnimationFrame(() => {
            if (!cancelled)
              document.dispatchEvent(new CustomEvent("open-command-palette"));
          }),
        );
        rafIds.push(
          requestAnimationFrame(() => {
            if (!cancelled)
              document.dispatchEvent(new CustomEvent("open-command-palette"));
          }),
        );
      })
      .catch(() => {
        // Chunk failed to load — the dynamic component also fails in this
        // case, so there is nothing to open. Swallow to avoid an unhandled
        // rejection; the user can retry and the next interaction re-mounts.
      });
    return () => {
      cancelled = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, [mountCommandPalette]);

  // SSR renders nothing (both states start false; no window/navigator access
  // during render). The dynamic components are ssr:false so they render only
  // on the client after mount. No hydration mismatch.
  return (
    <>
      {mountSpotlight && <Spotlight />}
      {mountCommandPalette && <CommandPalette />}
    </>
  );
}