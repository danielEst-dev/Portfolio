"use client";

// Root error boundary. Per Next 16 docs (see node_modules/next/dist/
// docs/01-app/03-api-reference/03-file-conventions/error.md, "Global
// Error" section), this file REPLACES the root layout when active — so
// it must render its own <html> and <body>, and it can't rely on
// Tailwind, the navbar, or the footer. Inline styles only.

// React's <title> is the only way to set a tab title from a client
// component (metadata is not exported by global-error).
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error.message, "digest:", error.digest);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF9F6",
          color: "#1A1A1A",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              margin: "0 0 16px",
            }}
          >
            Error
          </p>
          <div
            style={{
              width: 40,
              height: 2,
              background: "#8B6F5C",
              margin: "0 auto 24px",
            }}
          />
          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.15,
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#6B6B6B",
              fontSize: 15,
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}
          >
            A critical error prevented the page from loading. You can try
            again, or come back later.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => unstable_retry()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                border: "1px solid #1A1A1A",
                background: "transparent",
                color: "#1A1A1A",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#6B6B6B",
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              Go back home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
