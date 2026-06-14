import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Daniel Anthony S. Estrella";
  const description =
    searchParams.get("description") ||
    "Junior Backend Developer building scalable systems with ASP.NET Core, Node.js, and PostgreSQL.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#FAF9F6",
          padding: "80px",
          fontFamily: "Geist Sans, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FAF9F6",
              fontSize: "32px",
              fontWeight: 500,
            }}
          >
            DE
          </div>
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#8B6F5C",
            }}
          />
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 500,
            color: "#1A1A1A",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "32px",
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "#6B6B6B",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {description}
        </p>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            color: "#8B6F5C",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          <span>daniel-est.vercel.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
