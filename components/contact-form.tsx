"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type SubmitStatus = { kind: "idle" } | { kind: "success"; message: string } | { kind: "error"; message: string };

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Message sent! I'll get back to you soon.");
        setStatus({ kind: "success", message: "Message sent! I'll get back to you soon." });
        reset();
      } else {
        const message = result.error || "Failed to send message. Please try again.";
        toast.error(message);
        setStatus({ kind: "error", message });
      }
    } catch {
      const message = "Something went wrong. Please try again later.";
      toast.error(message);
      setStatus({ kind: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left" noValidate>
      {/* Live region for submission status — mirrors the toast for AT users. */}
      <p role="status" aria-live="polite" className="sr-only">
        {status.kind === "success" ? status.message : status.kind === "error" ? status.message : ""}
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="border-0 border-b border-border rounded-none bg-transparent px-0 pt-4 pb-3 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-accent dark:bg-transparent"
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="border-0 border-b border-border rounded-none bg-transparent px-0 pt-4 pb-3 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-accent dark:bg-transparent"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className="border-0 border-b border-border rounded-none bg-transparent px-0 pt-4 pb-3 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-accent dark:bg-transparent"
          {...register("subject")}
        />
        {errors.subject && (
          <p id="subject-error" role="alert" className="text-xs text-destructive">
            {errors.subject.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell me about your project or opportunity..."
          rows={5}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="border-0 border-b border-border rounded-none bg-transparent px-0 pt-4 pb-3 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-accent resize-none dark:bg-transparent"
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>
      <div className="text-center pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="px-8 py-3 h-auto border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors rounded-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
