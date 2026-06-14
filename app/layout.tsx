import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Daniel Anthony S. Estrella — Backend Engineer",
  description:
    "Magna Cum Laude BS Information Technology graduate and backend developer with professional experience building production-grade microservice architectures using ASP.NET Core (C#), Node.js, and PostgreSQL.",
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
      "Backend developer specializing in ASP.NET Core microservices, REST APIs, and cloud-ready systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Anthony S. Estrella — Backend Engineer",
    description:
      "Backend developer specializing in ASP.NET Core microservices, REST APIs, and cloud-ready systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
