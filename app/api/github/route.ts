import { NextResponse } from "next/server";

import { getGitHubActivity } from "@/lib/github";

// No segment config exports: the route stays dynamic (runs per request) and
// the upstream fetch in lib/github.ts is the cache of record via
// `next: { revalidate }`. This avoids prerendering at build time, which would
// bake in `{ available: false }` if GITHUB_TOKEN isn't present at build.
export async function GET() {
  const payload = await getGitHubActivity();
  return NextResponse.json(payload, {
    headers: {
      // Happy path: let the CDN serve the response briefly and revalidate in
      // the background. Fallback: short cache so an unavailable state self
      // heals quickly once a token is added.
      "Cache-Control": payload.available
        ? "public, max-age=60, s-maxage=600, stale-while-revalidate=3600"
        : "public, max-age=60",
    },
  });
}