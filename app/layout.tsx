import type { Metadata } from "next";
import { Inter, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Daniel Anthony S. Estrella — Backend Engineer",
  description:
    "Magna Cum Laude BS IT graduate and Junior Backend Developer building scalable systems with ASP.NET Core, Node.js, PostgreSQL, and microservices.",
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
    title: "Daniel Anthony S. Estrella — Backend Engineer",
    description:
      "Junior Backend Developer building scalable systems with ASP.NET Core, Node.js, and PostgreSQL.",
    type: "website",
    locale: "en_US",
    url: "https://daniel-est.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Anthony S. Estrella — Backend Engineer",
    description:
      "Junior Backend Developer building scalable systems with ASP.NET Core, Node.js, and PostgreSQL.",
  },
  metadataBase: new URL("https://daniel-est.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable} ${dmMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
