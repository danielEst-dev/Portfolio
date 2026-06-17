import { Fragment } from "react";
import { Section, Text } from "react-email";
import { EmailShell, labelStyle, headingStyle, bodyTextStyle, sectionSpacing, PrimaryButton } from "./_shell";
import { TOKENS, BRAND, SANS_STACK } from "./_tokens";

export interface ContactAutoReplyProps {
  name: string;
  subject: string;
  message: string;
}

const firstName = (name: string) => name.split(" ")[0] || name;

function MessageBody({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <Text style={bodyTextStyle}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line || " "}
        </Fragment>
      ))}
    </Text>
  );
}

export default function ContactAutoReply({ name, subject, message }: ContactAutoReplyProps) {
  return (
    <EmailShell preview={`Thanks, ${firstName(name)} — I've received your message.`}>
      <Section style={sectionSpacing}>
        <Text style={labelStyle}>Message received</Text>
      </Section>

      <Section style={{ ...sectionSpacing, marginTop: 12 }}>
        <Text style={headingStyle}>Thanks for reaching out, {firstName(name)}.</Text>
      </Section>

      <Section style={{ marginTop: 20 }}>
        <Text style={bodyTextStyle}>
          I&apos;ve received your message and will get back to you shortly. A copy of what you sent is
          below for your records.
        </Text>
      </Section>

      {/* Echoed message — secondary band */}
      <Section
        style={{
          backgroundColor: TOKENS.CANVAS,
          border: `1px solid ${TOKENS.BORDER}`,
          borderRadius: 6,
          padding: "16px 20px",
          marginTop: 24,
        }}
      >
        <Text style={{ ...labelStyle, fontSize: 10, marginBottom: 8 }}>You wrote</Text>
        <Text
          style={{
            fontFamily: SANS_STACK,
            fontSize: 15,
            fontWeight: 500,
            color: TOKENS.FG,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {subject}
        </Text>
        <Section style={{ borderLeft: `2px solid ${TOKENS.ACCENT}`, paddingLeft: 16, marginTop: 12 }}>
          <MessageBody text={message} />
        </Section>
      </Section>

      <Section style={{ marginTop: 32 }}>
        <PrimaryButton href={BRAND.site}>View my work →</PrimaryButton>
      </Section>
    </EmailShell>
  );
}