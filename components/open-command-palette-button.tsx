"use client";

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
