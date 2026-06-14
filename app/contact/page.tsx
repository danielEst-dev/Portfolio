import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { personalInfo } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
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
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-[1fr_320px] gap-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent mb-3">
                  Contact
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                  Let&apos;s work together
                </h1>
                <p className="text-muted-foreground mb-8 max-w-xl">
                  Have a project, job opportunity, or just want to connect? Fill out the form and I&apos;ll get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>

              <div className="space-y-5">
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Direct Contact
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-accent" />
                        <Link href={`mailto:${personalInfo.email}`} className="hover:text-accent transition-colors">
                          {personalInfo.email}
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-accent" />
                        <span>{personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{personalInfo.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Online Profiles
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href={personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
                      >
                        <Linkedin className="h-4 w-4 text-accent" />
                        LinkedIn
                      </Link>
                      <Link
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
                      >
                        <Github className="h-4 w-4 text-accent" />
                        GitHub
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
