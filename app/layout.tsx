import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/command-palette";
import { Spotlight } from "@/components/spotlight";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <Spotlight />
          {children}
          <Toaster position="bottom-right" richColors />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
