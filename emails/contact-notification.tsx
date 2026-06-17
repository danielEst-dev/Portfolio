import { Fragment } from "react";
import { Section, Text, Link } from "react-email";
import {
  EmailShell,
  labelStyle,
  headingStyle,
  bodyTextStyle,
  sectionSpacing,
  MetaRow,
  PrimaryButton,
} from "./_shell";
import { TOKENS } from "./_tokens";

export interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** ISO timestamp the form was submitted. */
  submittedAt: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCDate())}, ${d.getUTCFullYear()} · ${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())} UTC`;
}

const firstName = (name: string) => name.split(" ")[0] || name;

// Preserve line breaks across email clients — split on \n and join with <br/>.
function MessageBody({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <Text style={bodyTextStyle}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line || " "}
        </Fragment>
      ))}
    </Text>
  );
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  submittedAt,
}: ContactNotificationProps) {
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  return (
    <EmailShell preview={`${name} — ${subject}`}>
      <Section style={sectionSpacing}>
        <Text style={labelStyle}>New message · Portfolio contact</Text>
      </Section>

      <Section style={{ ...sectionSpacing, marginTop: 12 }}>
        <Text style={headingStyle}>{subject}</Text>
      </Section>

      {/* Sender meta — secondary band, mono values for email + timestamp */}
      <Section
        style={{
          backgroundColor: TOKENS.CANVAS,
          border: `1px solid ${TOKENS.BORDER}`,
          borderRadius: 6,
          padding: "6px 20px",
          marginTop: 20,
        }}
      >
        <MetaRow label="From">{name}</MetaRow>
        <MetaRow label="Email" mono>
          <Link href={`mailto:${email}`} style={{ color: TOKENS.FG, textDecoration: "none" }}>
            {email}
          </Link>
        </MetaRow>
        <MetaRow label="Sent" mono>
          {formatTimestamp(submittedAt)}
        </MetaRow>
      </Section>

      <Section style={{ marginTop: 24 }}>
        <Text style={{ ...labelStyle, marginBottom: 10 }}>Message</Text>
        <Section style={{ borderLeft: `2px solid ${TOKENS.ACCENT}`, paddingLeft: 16 }}>
          <MessageBody text={message} />
        </Section>
      </Section>

      <Section style={{ marginTop: 32, paddingBottom: 16 }}>
        <PrimaryButton href={replyHref}>Reply to {firstName(name)} →</PrimaryButton>
      </Section>
    </EmailShell>
  );
}

// Sample props used by `react-email`'s dev server. Edit a template and the
// preview re-renders instantly with these values. Ignored at runtime by the
// production route handler (which always passes real form data).
ContactNotification.PreviewProps = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  subject: "Project inquiry — backend consulting",
  message:
    "Hi Daniel,\n\nI came across your portfolio and was impressed by the system-design work on your projects page. I'd love to chat about a 6-week engagement to audit and harden our payments service.\n\nA few specifics:\n- Rate-limit strategy under flash crowds\n- Idempotency on the retry path\n- Observability for the reconciliation job\n\nAre you open to a 30-min call next week?\n\n— Jane",
  submittedAt: "2026-06-17T16:30:00.000Z",
};