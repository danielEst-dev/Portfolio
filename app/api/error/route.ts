// Forward error digests from the client error boundaries to the server.
// The client (app/error.tsx, app/global-error.tsx) POSTs { digest, message }
// here on mount; we log a structured record server-side and return 204 so the
// error UI is never blocked. No external service — a console.error is enough
// to surface digests in the Vercel runtime logs, where they can be matched
// against the server-side error that produced the digest.
//
// Signature per Next 16 route handler docs (see node_modules/next/dist/docs/
// 01-app/03-api-reference/03-file-conventions/route.md): `export async
// function POST(request: Request)`. Returning `null` with status 204 via
// `new Response(null, { status: 204 })`.

const MAX_DIGEST_LEN = 128;
const MAX_MESSAGE_LEN = 1024;

interface ErrorPayload {
  digest?: unknown;
  message?: unknown;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // Malformed JSON — nothing useful to log. Respond 204 so the client
    // doesn't retry; the error UI is unaffected.
    return new Response(null, { status: 204 });
  }

  if (typeof body !== "object" || body === null) {
    return new Response(null, { status: 204 });
  }

  const { digest, message } = body as ErrorPayload;
  const digestStr = isString(digest) ? digest.slice(0, MAX_DIGEST_LEN) : "";
  const messageStr = isString(message) ? message.slice(0, MAX_MESSAGE_LEN) : "";

  if (!digestStr && !messageStr) {
    return new Response(null, { status: 204 });
  }

  // Structured single-line log so it is easy to grep in the platform runtime
  // logs. `digest` is the stable hash that matches the server-side error.
  console.error(
    `[client-error] digest=${digestStr || "(none)"} message=${messageStr || "(none)"}`,
  );

  return new Response(null, { status: 204 });
}