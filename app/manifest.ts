import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Basenote Solutions",
    short_name: "Basenote",
    description:
      "Designing and launching fragrance brands through scent, craft, and strategy.",
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
