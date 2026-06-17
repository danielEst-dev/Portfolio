import type { MetadataRoute } from "next";

// Generated manifest — auto-served at /manifest and auto-linked from
// app/layout.tsx via metadata.manifest. Icons point at the sizes
// emitted by app/icon.tsx (32, 192, 512).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daniel Anthony S. Estrella — Backend Engineer",
    short_name: "Daniel Estrella",
    description:
      "Portfolio of Daniel Anthony S. Estrella, backend engineer and Magna Cum Laude graduate.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#8B6F5C",
    icons: [
      {
        src: "/icon/32",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
