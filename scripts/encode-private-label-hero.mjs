import { mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = process.argv[2] ?? "/private/tmp/basenote-bottle-work/frames";
const destination = path.join(root, "public/media/private-label/hero");
const frames = (await readdir(source)).filter((name) => /^\d{3}\.png$/.test(name)).sort();
if (frames.length !== 121) throw new Error(`Expected 121 frames, found ${frames.length}`);
await mkdir(path.join(destination, "desktop"), { recursive: true });
await mkdir(path.join(destination, "mobile"), { recursive: true });

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
