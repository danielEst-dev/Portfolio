import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skills } from "@/components/sections/skills";
import { Certifications } from "@/components/sections/certifications";
import { GitHubActivity } from "@/components/sections/github-activity";
import { ContactCta } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <FeaturedProjects />
        <Experience />
        <Education />
        <Skills />
        <Certifications />
        <GitHubActivity />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
