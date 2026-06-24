import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientGlobals } from "@/components/client-globals";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const defaultTitle = "Daniel Anthony S. Estrella";
const defaultDescription =
  "Magna Cum Laude BS IT graduate and Junior Backend Developer building scalable systems with ASP.NET Core, Node.js, PostgreSQL, and microservices.";

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  keywords: [
    "Daniel Anthony Estrella",
    "Backend Engineer",
    "ASP.NET Core",
    "C#",
    "Node.js",
    "PostgreSQL",
    "Microservices",
    "Software Developer",
  ],
  authors: [{ name: "Daniel Anthony S. Estrella" }],
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(defaultTitle)}&description=${encodeURIComponent(defaultDescription)}`,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      `/api/og?title=${encodeURIComponent(defaultTitle)}&description=${encodeURIComponent(defaultDescription)}`,
    ],
  },
  metadataBase: new URL("https://daniel-est.vercel.app"),
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip-to-content link: visually hidden until focused (see .skip-link
            in globals.css). First child of <body> so it is the first tab stop. */}
        <a href="#main" className="skip-link">Skip to content</a>
        <noscript>
          <style>{`
            /* Reveal framer-motion elements that ship hidden (opacity:0)
               before hydration, so no-JS visitors see the real content
               instead of an empty shell. Scoped to multi-property inline
               styles (opacity:0;) so faint decorative numerals (opacity:0.01)
               and empty graph cells (opacity:0 alone) are left untouched. */
            [style*="opacity:0;"] {
              opacity: 1 !important;
              transform: none !important;
              -webkit-transform: none !important;
            }
          `}</style>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <ClientGlobals />
          {/*
            id="main" is the skip-link target. The <main> element itself lives
            in each page (app/page.tsx, app/not-found.tsx, app/error.tsx) which
            are not owned by this file, so we wrap {children} with a
            focusable wrapper as the skip target (display: contents preserves
            the body's flex-column layout — the wrapper contributes no box).
          */}
          <div id="main" tabIndex={-1} className="contents">
            {children}
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
        {/* Vercel Web Analytics + Speed Insights. In production these inject
            same-origin scripts under /_vercel/... and beacon to same-origin,
            so the existing CSP (script-src 'self' 'unsafe-inline',
            connect-src 'self') needs no changes. Does not track in dev. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
