"use client";

import { useIsMac } from "@/lib/hooks";

export function OpenCommandPaletteButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => {
        document.dispatchEvent(new CustomEvent("open-command-palette"));
      }}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
    >
      {children}
    </button>
  );
}

export function ShortcutKbd() {
  const isMac = useIsMac();
  return (
    <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono">
      {isMac ? "⌘K" : "Ctrl+K"}
    </kbd>
  );
}
