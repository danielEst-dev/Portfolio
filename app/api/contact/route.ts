import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { personalInfo } from "@/lib/data";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv();
  } catch {
    redis = null;
  }
}

const ALLOWED_ORIGINS = [
  "https://daniel-est.vercel.app",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    // CSRF origin check
    const origin = req.headers.get("origin");
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
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

    if (redis) {
      const attempts = await redis.get(rateKey);
      if (attempts && Number(attempts) >= 3) {
        return NextResponse.json(
          { success: false, error: "Too many messages. Please try again later." },
          { status: 429 }
        );
      }
      // Use pipeline for atomic incr + expire to prevent TTL-less keys on crash
      const pipeline = redis.pipeline();
      pipeline.incr(rateKey);
      pipeline.expire(rateKey, 900);
      await pipeline.exec();
    }

    if (!resend) {
      console.warn("Contact form: RESEND_API_KEY not configured, email not sent.");
      return NextResponse.json(
        { success: false, error: "Email service is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const toEmail = process.env.TO_EMAIL || personalInfo.email;

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
