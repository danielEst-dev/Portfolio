import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OpenCommandPaletteButton, ShortcutKbd } from "@/components/open-command-palette-button";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            404
          </p>
          <div className="accent-rule mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-5">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            The page you are looking for does not exist. Try using the command palette to find what you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Go back home
            </Link>
            <OpenCommandPaletteButton>
              Open command palette <ShortcutKbd />
            </OpenCommandPaletteButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
