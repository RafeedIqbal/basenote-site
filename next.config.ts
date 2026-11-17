import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { validateProductionContactConfig } from "./lib/contact-configuration";

const securityHeaders = [
  // Script sources stay open: a strict script-src needs per-request nonces, which would
  // stop static prerendering and must cover GTM, Meta Pixel and Turnstile.
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: { bodySizeLimit: "4mb" }
  },
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default function createNextConfig(phase: string): NextConfig {
  validateProductionContactConfig(phase, process.env);
  return withPayload(nextConfig);
}
