import Link from "next/link";
import { personalInfo } from "@/lib/data";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {personalInfo.name}
          </p>

          <div className="flex items-center gap-5">
            <Link
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href={`mailto:${personalInfo.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
