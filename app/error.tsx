"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Per-segment error boundary. The navbar lives on each page (app/page.tsx,
// app/not-found.tsx) — it is NOT in app/layout.tsx, which only mounts
// Spotlight/Toaster/CommandPalette around {children}. So a segment error
// would otherwise leave users with no navigation. Render our own <Navbar />
// here, consistent with not-found.tsx. `unstable_retry` is the Next 16.2+
// recommended recovery function (see node_modules/next/dist/docs/01-app/
// 03-api-reference/03-file-conventions/error.md).

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // The `digest` is a stable hash that matches server logs — log it
    // alongside the message so a support request can be cross-referenced.
    console.error("Page error:", error.message, "digest:", error.digest);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Error
          </p>
          <div className="accent-rule mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-5">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            A page failed to load. You can retry, or head back to the home page.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => unstable_retry()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors link-underline"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
