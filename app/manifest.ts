import type { MetadataRoute } from "next";

import {
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_THEME_COLOR
} from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: SITE_THEME_COLOR,
    theme_color: SITE_THEME_COLOR,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: SITE_LOGO,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
