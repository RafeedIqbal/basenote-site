import type { NextConfig } from "next";
import { validateProductionContactConfig } from "@/lib/contact-configuration";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "4mb" }
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default function createNextConfig(phase: string): NextConfig {
  validateProductionContactConfig(phase, process.env);
  return nextConfig;
}
