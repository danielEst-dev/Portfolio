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
    <EmailShell preview={`New message from ${name}: ${subject}`}>
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
          padding: "4px 20px",
          marginTop: 24,
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

      <Section style={{ marginTop: 28 }}>
        <Text style={{ ...labelStyle, marginBottom: 12 }}>Message</Text>
        <Section style={{ borderLeft: `2px solid ${TOKENS.ACCENT}`, paddingLeft: 16 }}>
          <MessageBody text={message} />
        </Section>
      </Section>

      <Section style={{ marginTop: 32 }}>
        <PrimaryButton href={replyHref}>Reply to {firstName(name)} →</PrimaryButton>
      </Section>
    </EmailShell>
  );
}