import { mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewOnly = process.argv.includes("--preview-only");
const source = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "/private/tmp/basenote-bottle-work/frames";
const destination = path.join(root, "public/media/private-label/hero");

let bytes = 0;
async function transparentRender(input, width) {
  const { data, info } = await sharp(input).resize({ width }).blur(0.35).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  // Recover the glow's coverage from the black render, preserving warm edge
  // colours. Real alpha avoids rectangular backdrops in isolated mobile layers.
  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    const sourceOffset = pixel * info.channels;
    const offset = pixel * 4;
    const alpha = Math.max(data[sourceOffset], data[sourceOffset + 1], data[sourceOffset + 2]);
    // Remove near-black render dithering before unpremultiplication; otherwise
    // imperceptible noise becomes high-entropy colour in transparent pixels.
    if (alpha > 6) {
      rgba[offset + 3] = Math.round((alpha - 6) * 255 / 249);
      for (let channel = 0; channel < 3; channel++) {
        rgba[offset + channel] = alpha < 20
          ? [255, 173, 104][channel]
          : Math.round(data[sourceOffset + channel] * 255 / alpha);
      }
    }
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
}
if (!previewOnly) {
  const frames = (await readdir(source)).filter((name) => /^\d{3}\.png$/.test(name)).sort();
  if (frames.length !== 121) throw new Error(`Expected 121 frames, found ${frames.length}`);
  await mkdir(path.join(destination, "desktop"), { recursive: true });
  await mkdir(path.join(destination, "mobile"), { recursive: true });
  for (const name of frames) {
    for (const [variant, width, quality] of [["desktop", 1280, 78], ["mobile", 800, 78]]) {
      const file = path.join(destination, variant, name.replace(".png", ".webp"));
      await (await transparentRender(path.join(source, name), width)).webp({ quality, alphaQuality: 80, effort: 5 }).toFile(file);
      bytes += (await stat(file)).size;
    }
  }
  for (const [name, sourceFrame] of [["closed", frames[0]], ["open", frames.at(-1)]]) {
    await (await transparentRender(path.join(source, sourceFrame), 1920)).webp({ quality: 90, alphaQuality: 80, effort: 6 }).toFile(path.join(destination, `bottle-${name}.webp`));
  }
  console.log(`Encoded ${frames.length} frames in two sizes: ${(bytes / 1024 / 1024).toFixed(2)} MiB total.`);
}

// One small request makes every pose available before the full-size frames.
// Keep these dimensions aligned with privateLabel.hero.preview.
const tiles = [];
for (let index = 0; index < 121; index++) {
  tiles.push({
    input: await sharp(path.join(destination, "desktop", `${String(index).padStart(3, "0")}.webp`)).resize(320, 180).png().toBuffer(),
    left: (index % 11) * 320,
    top: Math.floor(index / 11) * 180,
  });
}
const preview = path.join(destination, "scrub-preview.webp");
await sharp({ create: { width: 3520, height: 1980, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(tiles).webp({ quality: 65, alphaQuality: 65, effort: 6 }).toFile(preview);
console.log(`Preview sequence: ${((await stat(preview)).size / 1024).toFixed(0)} KiB.`);
