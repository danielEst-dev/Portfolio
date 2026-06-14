"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle theme">
        <Sun className="h-[18px] w-[18px]" />
      </button>
    );
  }

  return (
    <button
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] transition-all" />
      ) : (
        <Moon className="h-[18px] w-[18px] transition-all" />
      )}
    </button>
  );
}
