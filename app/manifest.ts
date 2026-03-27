import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Basenote Solutions",
    short_name: "Basenote",
    description:
      "Private label perfumes, brand strategy, and AI-powered fragrance technology for modern launches.",
    start_url: "/",
    display: "browser",
    background_color: "#030f26",
    theme_color: "#030f26",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
