"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { navLinks, projects, personalInfo } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useIsMac } from "@/lib/hooks";
import {
  Home,
  Briefcase,
  FileText,
  Mail,
  Sun,
  Moon,
  User,
  Layers,
  Award,
  Wrench,
  MessageSquare,
  Command,
} from "lucide-react";

const sectionLinks = [
  { href: "/#about", label: "About", icon: User },
  { href: "/#projects", label: "Featured Projects", icon: Briefcase },
  { href: "/#skills", label: "Technical Skills", icon: Wrench },
  { href: "/#certifications", label: "Certifications", icon: Award },
  { href: "/#contact", label: "Contact", icon: MessageSquare },
];

const pageIcons: Record<string, React.ElementType> = {
  "/": Home,
  "/projects": Layers,
  "/resume": FileText,
  "/contact": Mail,
};

type CommandItem = {
  id: string;
  label: string;
  group: string;
  icon: React.ElementType;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQueryState] = useState("");
  const [selectedIndex, setSelectedIndexState] = useState(0);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isMac = useIsMac();

  const setQuery = (value: string) => {
    setQueryState(value);
    setSelectedIndexState(0);
  };

  const setSelectedIndex = (value: number | ((prev: number) => number)) => {
    setSelectedIndexState(value);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const paletteEvent = () => setOpen(true);
    document.addEventListener("keydown", down);
    document.addEventListener("open-command-palette", paletteEvent);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("open-command-palette", paletteEvent);
    };
  }, []);

  const items: CommandItem[] = useMemo(() => {
    const all: CommandItem[] = [];

    navLinks.forEach((link) => {
      all.push({
        id: `page-${link.href}`,
        label: link.label,
        group: "Pages",
        icon: pageIcons[link.href] || Home,
        action: () => router.push(link.href),
      });
    });

    sectionLinks.forEach((link) => {
      all.push({
        id: `section-${link.href}`,
        label: link.label,
        group: "Sections",
        icon: link.icon,
        action: () => router.push(link.href),
      });
    });

    projects.forEach((project) => {
      all.push({
        id: `project-${project.slug}`,
        label: project.name,
        group: "Projects",
        icon: Briefcase,
        action: () => router.push(`/projects/${project.slug}`),
      });
    });

    all.push({
      id: "action-theme",
      label: "Toggle theme",
      group: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
    });

    all.push({
      id: "action-email",
      label: "Send email",
      group: "Actions",
      icon: Mail,
      action: () => window.open(`mailto:${personalInfo.email}`, "_self"),
    });

    return all;
  }, [router, theme, setTheme]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.group.toLowerCase().includes(normalized)
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    });
    return map;
  }, [filtered]);

  // Precompute a flat index for each item id, avoiding mutable variables during render
  const flatIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let idx = 0;
    for (const [, groupItems] of grouped) {
      for (const item of groupItems) {
        map.set(item.id, idx++);
      }
    }
    return map;
  }, [grouped]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQueryState("");
      setSelectedIndexState(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[selectedIndex];
      if (item) {
        setOpen(false);
        item.action();
      }
    }
  };



  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg gap-0 overflow-hidden border border-border bg-popover p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Command className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="h-auto flex-1 border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          <kbd className="hidden rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          ) : (
            Array.from(grouped.entries()).map(([group, groupItems]) => (
              <div key={group} className="px-2 py-1">
                <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const index = flatIndexMap.get(item.id) ?? 0;
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        setOpen(false);
                        item.action();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border px-1 font-mono">↑</kbd>
              <kbd className="rounded border border-border px-1 font-mono">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border px-1 font-mono">↵</kbd>
              to select
            </span>
          </div>
          <span>
            <kbd className="rounded border border-border px-1 font-mono">{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd className="rounded border border-border px-1 font-mono">K</kbd>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
