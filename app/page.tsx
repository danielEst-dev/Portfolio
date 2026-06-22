import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Education } from "@/components/sections/education";
import { ContactCta } from "@/components/sections/contact-cta";
import {
  LazyExperience,
  LazySkills,
  LazyCertifications,
  LazyGitHubActivity,
} from "@/components/lazy-sections";
import { getGitHubActivity } from "@/lib/github";
import { personalInfo } from "@/lib/data";

// Canonical for the home page; relative path resolves against `metadataBase`
// set in app/layout.tsx (https://daniel-est.vercel.app).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// JSON-LD Person schema. Rendered as an inline script in this Server Component
// so crawlers receive it in the initial HTML payload.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name,
  url: "https://daniel-est.vercel.app",
  image: "https://daniel-est.vercel.app/api/og",
  jobTitle: personalInfo.role,
  description: personalInfo.shortBio,
  email: personalInfo.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: personalInfo.location,
  },
  sameAs: [personalInfo.linkedin, personalInfo.github],
};

// Async Server Component. The GitHub activity fetch is cached for 6h via
// `next: { revalidate }` in lib/github.ts, so this await is normally a
// near-instant cache hit; on a cold cache, app/loading.tsx streams as the
// Suspense fallback while Home() resolves. The resolved payload is plain
// serializable data and crosses the server→client boundary as the
// `initialData` prop to the lazy GitHubActivity wrapper, letting that panel
// render its first paint with no client round-trip.
export default async function Home() {
  const initialData = await getGitHubActivity();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Navbar />
      <main className="flex-1">
        {/* Above-the-fold + server sections render eagerly in the initial HTML. */}
        <Hero />
        <About />
        <FeaturedProjects />
        {/* Below-fold section anchors live on the lazy wrappers so hash links work before the chunks mount. */}
        <LazyExperience />
        <Education />
        <LazySkills />
        <LazyCertifications />
        <LazyGitHubActivity initialData={initialData} />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}