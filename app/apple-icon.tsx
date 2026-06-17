import { ImageResponse } from "next/og";

// The apple-touch-icon is a single 180×180 PNG. The visual matches
// app/icon.tsx — a dark circle with cream "DE" on a transparent
// background — so the home-screen icon is the same brand mark as the
// favicon and the navbar avatar. See app/api/og/route.tsx for the
// same circle visual at larger size (with the cream square retained
// for the social card).

const FG = "#1A1A1A";
const ACCENT = "#8B6F5C";
const ON_DARK = "#FAF9F6";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const px = 180;
  const circleSize = Math.round(px * 0.78);
  const fontSize = Math.round(circleSize * 0.45);
  const ringWidth = Math.max(1, Math.round(px * 0.015));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            background: FG,
            border: `${ringWidth}px solid ${ACCENT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ON_DARK,
            fontSize,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            fontFamily: "Geist Sans, sans-serif",
          }}
        >
          DE
        </div>
      </div>
    ),
    { width: px, height: px }
  );
}
