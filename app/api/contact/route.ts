import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { render, toPlainText } from "react-email";
import { jsx } from "react/jsx-runtime";
import { personalInfo } from "@/lib/data";
import ContactNotification from "@/emails/contact-notification";
import ContactAutoReply from "@/emails/contact-auto-reply";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Build the CSRF origin allow-list. Includes localhost in dev and any
// Vercel preview deployment (*.vercel.app) when running in a preview env.
function getAllowedOrigins(): string[] {
  const origins: string[] = ["https://daniel-est.vercel.app"];
  if (process.env.NODE_ENV === "development") {
    origins.push("http://localhost:3000");
  }
  // Preview deployments use https://<project>-<hash>-<team>.vercel.app.
  if (process.env.VERCEL_ENV === "preview") {
    origins.push("https://*.vercel.app");
  }
  return origins;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  return allowed.some((entry) => {
    if (entry.includes("*")) {
      // Convert the simple wildcard "https://*.vercel.app" into a regex.
      const re = new RegExp("^" + entry.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+") + "$");
      return re.test(origin);
    }
    return entry === origin;
  });
}

// Fail closed: if rate-limit env vars are missing, refuse traffic rather
// than silently allow unlimited submissions through Resend.
const hasRedisConfig = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis: Redis | null = hasRedisConfig ? Redis.fromEnv() : null;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  // CSRF defense: allow-list + same-origin check. Defense in depth — also
  // reject when sec-fetch-site says the request is cross-site.
  const origin = req.headers.get("origin");
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (!isAllowedOrigin(origin) || secFetchSite === "cross-site") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  if (!redis) {
    return NextResponse.json(
      { success: false, error: "Contact form temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot: if the hidden "website" field is non-empty, a bot filled it.
    // Respond as if the submission succeeded so the bot learns nothing, but
    // do no further work (no rate-limit hit, no email). Checked before the
    // normal schema validation so an invalid honeypot payload can't surface a
    // 400 that would reveal the trap.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const ip = getClientIp(req);
    const rateKey = `contact:${ip}`;

    const attempts = await redis.get(rateKey);
    if (attempts && Number(attempts) >= 3) {
      return NextResponse.json(
        { success: false, error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    // Use a pipeline for atomic incr + expire so a crash mid-pipeline
    // can't leave a TTL-less key.
    const pipeline = redis.pipeline();
    pipeline.incr(rateKey);
    pipeline.expire(rateKey, 900);
    await pipeline.exec();

    if (!resend) {
      console.warn("Contact form: RESEND_API_KEY not configured, email not sent.");
      // Roll back the rate counter so the user isn't penalized for our misconfig.
      await redis.decr(rateKey);
      return NextResponse.json(
        { success: false, error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const toEmail = process.env.TO_EMAIL || personalInfo.email;

    // Render the branded HTML notification. render() is async (internal dynamic
    // import) and can throw on a template error — wrap it so we can roll back
    // the rate counter and not penalize the user for our rendering failure.
    const submittedAt = new Date().toISOString();
    let notifHtml: string;
    try {
      notifHtml = await render(
        jsx(ContactNotification, { name, email, subject, message, submittedAt })
      );
    } catch (renderError) {
      console.error("Contact form render failed:", renderError);
      await redis.decr(rateKey);
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    // Resend returns { data, error } instead of throwing. Roll back the
    // counter on failure so the user can retry immediately.
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[Portfolio] ${subject}`,
      html: notifHtml,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      replyTo: email,
    });

    if (error) {
      console.error("Resend send failed:", error);
      await redis.decr(rateKey);
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    // Auto-reply to the submitter. Gated behind CONTACT_AUTOREPLY_FROM, which
    // requires a verified custom sending domain in Resend — the shared
    // onboarding@resend.dev sandbox can only deliver to the account owner, not
    // arbitrary third-party addresses. A failure here must never fail the
    // request, since the inbound notification already succeeded.
    const autoreplyFrom = process.env.CONTACT_AUTOREPLY_FROM;
    if (autoreplyFrom) {
      try {
        const autoHtml = await render(jsx(ContactAutoReply, { name, subject, message }));
        await resend.emails.send({
          from: autoreplyFrom,
          to: [email],
          subject: "Thanks for reaching out — Daniel Estrella",
          html: autoHtml,
          text: toPlainText(autoHtml),
          replyTo: toEmail,
        });
      } catch (autoreplyError) {
        console.error("Contact form auto-reply failed:", autoreplyError);
      }
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
