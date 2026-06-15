"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, personalInfo } from "@/lib/data";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useIsMac } from "@/lib/hooks";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMac = useIsMac();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-foreground" aria-label={personalInfo.name}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 text-xs font-semibold tracking-tight transition-colors group-hover:border-foreground/50 group-hover:bg-foreground group-hover:text-background">
              DE
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:inline">
              {personalInfo.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline ${
                    isActive ? "text-foreground link-underline-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                document.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="hidden lg:flex items-center gap-2 rounded border border-border/60 bg-secondary/50 px-2 py-1 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              aria-label="Open command palette"
            >
              <Search className="h-3 w-3" />
              <span>{isMac ? "⌘K" : "Ctrl+K"}</span>
            </button>
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
    </header>
  );
}
