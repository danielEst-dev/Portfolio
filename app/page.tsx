import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Skills } from "@/components/sections/skills";
import { Certifications } from "@/components/sections/certifications";
import { ContactCta } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <FeaturedProjects />
        <Skills />
        <Certifications />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
