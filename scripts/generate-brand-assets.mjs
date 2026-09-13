import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";

import {
  SITE_DESCRIPTION,
  SITE_LOGO_SOURCE,
  SITE_ORIGIN,
  SITE_SHORT_NAME,
  SITE_SOCIAL_IMAGE,
  SITE_TAGLINE,
  SITE_THEME_COLOR
} from "../lib/site.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const logo = await sharp(join(root, "public", SITE_LOGO_SOURCE))
  .trim()
  .png()
  .toBuffer();

async function save(relativePath, buffer) {
  const destination = join(root, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, buffer);
  console.log(`${relativePath} (${buffer.length.toLocaleString()} bytes)`);
}

async function icon(size, coverage = 0.82, rounded = false) {
  const mark = await sharp(logo)
    .resize({ width: Math.round(size * coverage) })
    .png()
    .toBuffer();
  const layers = [{ input: mark, gravity: "centre" }];

  if (rounded) {
    layers.push({
      input: Buffer.from(
        `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.18}" fill="white"/></svg>`
      ),
      blend: "dest-in"
    });
  }

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: SITE_THEME_COLOR
    }
  })
    .composite(layers)
    .png()
    .toBuffer();
}

// ICO directory entries point to PNG payloads at each native browser size.
const faviconSizes = [16, 32, 48];
const faviconImages = await Promise.all(
  faviconSizes.map((size) => icon(size, 0.88, true))
);
const directory = Buffer.alloc(6 + 16 * faviconSizes.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(faviconSizes.length, 4);
let offset = directory.length;

faviconImages.forEach((buffer, index) => {
  const entry = 6 + index * 16;
  directory[entry] = faviconSizes[index];
  directory[entry + 1] = faviconSizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(buffer.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += buffer.length;
});

await save("app/favicon.ico", Buffer.concat([directory, ...faviconImages]));
await save("app/icon.png", await icon(96, 0.82, true));
// Apple and maskable icons have opaque, square backgrounds; the OS applies its mask.
await save("app/apple-icon.png", await icon(180));
await save("public/icons/icon-192.png", await icon(192));
await save("public/icons/icon-512.png", await icon(512));
// The whole mark fits inside the central circle with radius 40% of the canvas.
await save("public/icons/icon-maskable-512.png", await icon(512, 0.6));

const [serif, body] = await Promise.all([
  readFile(join(root, "assets/brand-fonts/SourceSerif4-Regular.otf")),
  readFile(join(root, "assets/brand-fonts/LexendDeca-Regular.ttf"))
]);
const mark = await sharp(logo).resize({ width: 168 }).png().toBuffer();
const taglineLines = SITE_TAGLINE.replace(" Meets ", "\nMeets ").split("\n");

const card = new ImageResponse(
  h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "64px 72px",
        background: SITE_THEME_COLOR,
        color: "#ffffff",
        fontFamily: "Lexend Deca"
      }
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 22 } },
        h("img", {
          src: `data:image/png;base64,${mark.toString("base64")}`,
          width: 84,
          height: 57,
          alt: ""
        }),
        h("span", {
          style: { fontFamily: "Source Serif 4", fontSize: 30, letterSpacing: "0.06em" }
        }, SITE_SHORT_NAME.toUpperCase())
      ),
      h("span", {
        style: { fontSize: 17, color: "#a8a8a8" }
      }, new URL(SITE_ORIGIN).hostname.replace(/^www\./, ""))
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "Source Serif 4",
          fontSize: 88,
          lineHeight: 1.04,
          letterSpacing: "-0.045em"
        }
      },
      ...taglineLines.map((line) => h("span", { key: line }, line))
    ),
    h("div", {
      style: { display: "flex", maxWidth: 910, color: "#a8a8a8", fontSize: 21, lineHeight: 1.5 }
    }, SITE_DESCRIPTION)
  ),
  {
    width: SITE_SOCIAL_IMAGE.width,
    height: SITE_SOCIAL_IMAGE.height,
    fonts: [
      { name: "Source Serif 4", data: serif, weight: 400, style: "normal" },
      { name: "Lexend Deca", data: body, weight: 400, style: "normal" }
    ]
  }
);

await save("public/og.png", Buffer.from(await card.arrayBuffer()));
