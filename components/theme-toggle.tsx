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

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        <Sun className="h-[18px] w-[18px]" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      <span className="relative block h-[18px] w-[18px]" aria-hidden="true">
        <Sun
          className="absolute inset-0 h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
            opacity: isDark ? 1 : 0,
          }}
        />
        <Moon
          className="absolute inset-0 h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{
            transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
            opacity: isDark ? 0 : 1,
          }}
        />
      </span>
    </button>
  );
}
