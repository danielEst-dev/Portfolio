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

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Message sent! I'll get back to you soon.");
        reset();
      } else {
        toast.error(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            className="border-0 border-b border-border rounded-none bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-accent"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="border-0 border-b border-border rounded-none bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-accent"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          className="border-0 border-b border-border rounded-none bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-accent"
          {...register("subject")}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell me about your project or opportunity..."
          rows={5}
          className="border-0 border-b border-border rounded-none bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-accent resize-none"
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <div className="text-center pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
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
