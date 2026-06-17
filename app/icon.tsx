import { ImageResponse } from "next/og";

// The DE monogram is the brand mark used in the navbar, OG images, and
// these icons. Visual reference: app/api/og/route.tsx renders the same
// dark circle + cream "DE" at large size for the social cards.
//
// The favicon and apple-touch-icon use a transparent background so the
// browser tab and home-screen icon show *just* the dark circle — the
// cream square from the OG card is dropped here. The "DE" text stays
// cream so it remains readable on the dark circle.
const FG = "#1A1A1A"; // --foreground
const ACCENT = "#8B6F5C"; // --accent
const ON_DARK = "#FAF9F6"; // text on the dark circle (matches --background)

const SIZES = [
  { id: "32", size: 32 },
  { id: "192", size: 192 },
  { id: "512", size: 512 },
] as const;

export const contentType = "image/png";
// `size` is required by the file convention; the actual width/height for
// each emitted icon comes from `generateImageMetadata` below.
export const size = { width: 32, height: 32 };

export function generateImageMetadata() {
  return SIZES.map(({ id, size }) => ({
    id,
    size: { width: size, height: size },
    contentType: "image/png" as const,
  }));
}

export default async function Icon({
  id,
}: {
  id: Promise<string | number>;
}) {
  const iconId = await id;
  const px = SIZES.find((s) => s.id === String(iconId))?.size ?? 32;

  // Sizing scaled to the rendered output so the visual is identical
  // across resolutions. The "DE" character mark stays recognizable down
  // to 32px because the surrounding dark circle is the dominant shape.
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
