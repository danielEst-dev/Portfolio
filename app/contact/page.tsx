import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { personalInfo } from "@/lib/data";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Daniel Anthony S. Estrella",
  description: "Get in touch with Daniel Anthony S. Estrella for backend engineering opportunities and collaborations.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Contact
            </p>
            <div className="accent-rule mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
              Let&apos;s talk
            </h1>
            <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
              Have a project, job opportunity, or just want to connect? Send a message and I&apos;ll get back to you soon.
            </p>

            <ContactForm />

            <div className="mt-16 pt-10 border-t border-border/60">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <Link
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" /> {personalInfo.email}
                </Link>
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {personalInfo.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {personalInfo.location}
                </span>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <Link
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
