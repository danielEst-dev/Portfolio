import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Hr,
  Link,
  Preview,
} from "react-email";
import type { ReactNode } from "react";
import { TOKENS, SANS_STACK, MONO_STACK, BRAND } from "./_tokens";

// Shared style fragments — inline styles only (email clients strip <style>/classes).
const bodyStyle = {
  backgroundColor: TOKENS.CANVAS,
  fontFamily: SANS_STACK,
  color: TOKENS.FG,
  margin: 0,
  padding: "32px 16px",
  WebkitTextSizeAdjust: "100%",
} as const;

const containerStyle = {
  backgroundColor: TOKENS.BG,
  border: `1px solid ${TOKENS.BORDER}`,
  borderRadius: 6,
  maxWidth: 560,
  margin: "0 auto",
  padding: 36,
} as const;

const nameStyle = {
  fontFamily: SANS_STACK,
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: TOKENS.FG,
  margin: 0,
  lineHeight: 1.25,
} as const;

const roleStyle = {
  fontFamily: SANS_STACK,
  fontSize: 13,
  color: TOKENS.MUTED,
  margin: 0,
  marginTop: 2,
  lineHeight: 1.25,
} as const;

const footerNameStyle = {
  fontFamily: SANS_STACK,
  fontSize: 14,
  fontWeight: 500,
  color: TOKENS.FG,
  margin: 0,
} as const;

const footerMutedStyle = {
  fontFamily: SANS_STACK,
  fontSize: 13,
  color: TOKENS.MUTED,
  margin: 0,
  marginTop: 4,
} as const;

const footerLinkStyle = {
  fontFamily: MONO_STACK,
  fontSize: 12,
  color: TOKENS.MUTED,
  textDecoration: "underline",
  textDecorationColor: TOKENS.BORDER,
} as const;

// 40×2px taupe accent rule — table-based so height holds in Outlook (Word).
function AccentRule() {
  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ width: 40, height: 2, backgroundColor: TOKENS.ACCENT, margin: "24px 0" }}
    >
      <tr>
        <td style={{ height: 2, lineHeight: "2px", fontSize: 0 }}>&nbsp;</td>
      </tr>
    </table>
  );
}

// DE monogram — dark circle with a thin taupe ring. Border-radius degrades to a
// square in Outlook (Word) but stays a branded mark everywhere.
function Monogram() {
  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{
        width: 40,
        height: 40,
        backgroundColor: TOKENS.FG,
        border: `1px solid ${TOKENS.ACCENT}`,
        borderRadius: "50%",
        textAlign: "center",
      }}
    >
      <tr>
        <td
          align="center"
          valign="middle"
          style={{
            color: TOKENS.BG,
            fontFamily: SANS_STACK,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            height: 40,
            verticalAlign: "middle",
          }}
        >
          {BRAND.monogram}
        </td>
      </tr>
    </table>
  );
}

function Header() {
  return (
    <Section>
      <Row>
        <Column style={{ width: 48, verticalAlign: "middle", paddingLeft: 0, paddingRight: 0 }}>
          <Monogram />
        </Column>
        <Column style={{ verticalAlign: "middle", paddingLeft: 12, paddingRight: 0 }}>
          <Text style={nameStyle}>{BRAND.name}</Text>
          <Text style={roleStyle}>{BRAND.role}</Text>
        </Column>
      </Row>
      <AccentRule />
    </Section>
  );
}

function Footer() {
  return (
    <Section>
      <Hr
        style={{
          borderColor: TOKENS.BORDER,
          borderWidth: 1,
          borderStyle: "solid",
          margin: "0 0 24px 0",
          width: "100%",
        }}
      />
      <Text style={footerNameStyle}>{BRAND.name}</Text>
      <Text style={footerMutedStyle}>{BRAND.tagline}</Text>
      <Text style={{ ...footerMutedStyle, marginTop: 8 }}>
        <Link href={BRAND.site} style={footerLinkStyle}>
          daniel-est.vercel.app
        </Link>
      </Text>
    </Section>
  );
}

export interface EmailShellProps {
  /** Preheader text shown in inbox previews. */
  preview: string;
  children: ReactNode;
}

export function EmailShell({ preview, children }: EmailShellProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Header />
          {children}
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

// Reusable building blocks shared by every template.
export const labelStyle = {
  fontFamily: SANS_STACK,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: TOKENS.MUTED,
  margin: 0,
} as const;

export const headingStyle = {
  fontFamily: SANS_STACK,
  fontSize: 22,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: TOKENS.FG,
  margin: 0,
  lineHeight: 1.2,
} as const;

export const bodyTextStyle = {
  fontFamily: SANS_STACK,
  fontSize: 15,
  lineHeight: 1.6,
  color: TOKENS.FG,
  margin: 0,
} as const;

export const mutedTextStyle = {
  fontFamily: SANS_STACK,
  fontSize: 14,
  lineHeight: 1.6,
  color: TOKENS.MUTED,
  margin: 0,
} as const;

export const sectionSpacing = { margin: "24px 0" } as const;

// Definition-list row: a muted uppercase label on the left, the value on the right.
export function MetaRow({
  label,
  children,
  mono,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <Row>
      <Column
        style={{
          width: 72,
          verticalAlign: "top",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Text
          style={{
            ...labelStyle,
            fontSize: 10,
            letterSpacing: "0.16em",
          }}
        >
          {label}
        </Text>
      </Column>
      <Column
        style={{
          verticalAlign: "top",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Text
          style={{
            ...(mono
              ? { fontFamily: MONO_STACK, fontSize: 13, color: TOKENS.FG, margin: 0 }
              : { fontFamily: SANS_STACK, fontSize: 14, color: TOKENS.FG, margin: 0 }),
          }}
        >
          {children}
        </Text>
      </Column>
    </Row>
  );
}

// Editorial primary CTA — sharp corners, dark fill, cream text (the portfolio's
// "inverted" button state, since hover can't be relied on in email).
export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: TOKENS.FG,
        color: TOKENS.BG,
        borderRadius: 0,
        border: `1px solid ${TOKENS.FG}`,
        padding: "12px 22px",
        fontFamily: SANS_STACK,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.02em",
        textDecoration: "none",
      }}
    >
      {children}
    </Button>
  );
}