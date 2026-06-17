import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Non-nonce CSP baseline from
// node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
// (lines 424-435). 'unsafe-eval' is only needed in dev for HMR / React
// debugging. Static pages remain cacheable — nonces would force dynamic
// rendering, which is the wrong trade-off for a static portfolio.
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'unsafe-inline'";

const csp = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: https://avatars.githubusercontent.com`,
  `font-src 'self'`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  headers: async () => [
    // Hashed static assets get a long, immutable cache. Match the path
    // precisely so we don't accidentally cache /_next/image or other
    // dynamic endpoints.
    {
      source: "/_next/static/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        // 2 years, preload-eligible.
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Content-Security-Policy", value: csp },
      ],
    },
  ],
};

export default nextConfig;
