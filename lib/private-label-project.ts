import { privateLabelGuide } from "../data/site-content";

export const MAX_PROJECT_IMAGE_BYTES = 3 * 1024 * 1024;
export const PROJECT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProjectResult =
  | { ok: true; fullName: string; email: string; message: string }
  | { ok: false; error: string };

export function parseProjectDetails(formData: FormData): ProjectResult {
  const limits = {
    fullName: 120,
    email: 320,
    phone: 80,
    spoken: 3,
    packaging: 120,
    bottle: 120,
    cap: 120,
    finish: 40,
    fragrance: 40,
    notes: 3500,
  };
  const values: Record<string, string> = {};
  for (const [field, max] of Object.entries(limits)) {
    const input = formData.get(field);
    if (input !== null && typeof input !== "string")
      return { ok: false, error: "Please check your project details." };
    const value = typeof input === "string" ? input.trim() : "";
    if (value.length > max)
      return {
        ok: false,
        error:
          "One or more fields are too long. Please shorten your project details.",
      };
    values[field] = value;
  }
  if (
    !values.fullName ||
    !values.email ||
    !["Yes", "No"].includes(values.spoken)
  )
    return {
      ok: false,
      error:
        "Please add your name, email and whether you have already spoken to Basenote.",
    };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    return { ok: false, error: "Please enter a valid email address." };
  const allowlists = {
    packaging: [
      "",
      privateLabelGuide.packaging.paperTitle,
      ...privateLabelGuide.packaging.types.map((type) => type.title),
      "Not sure yet",
    ],
    finish: [
      "",
      ...privateLabelGuide.components.finishes.map((finish) => finish.title),
      "Not sure yet",
    ],
    fragrance: ["Inspired by", "Bespoke", "Not sure yet"],
  };
  for (const [field, options] of Object.entries(allowlists)) {
    if (!options.includes(values[field]))
      return {
        ok: false,
        error: "Please choose one of the available options.",
      };
  }
  const message = [
    "Private Label Guide — project details",
    "",
    `Phone / WhatsApp: ${values.phone || "Not provided"}`,
    `Already spoken to Basenote: ${values.spoken}`,
    "",
    `Packaging type: ${values.packaging || "Not chosen yet"}`,
    `Bottle PN: ${values.bottle || "Not chosen yet"}`,
    `Cap PN: ${values.cap || "Not chosen yet"}`,
    `Finish: ${values.finish || "Not chosen yet"}`,
    `Fragrance route: ${values.fragrance}`,
    "",
    "Notes / references:",
    values.notes || "Not provided",
  ].join("\n");
  return { ok: true, fullName: values.fullName, email: values.email, message };
}

export async function parseProjectImages(formData: FormData) {
  const entries = formData.getAll("inspiration");
  if (entries.some((entry) => typeof entry === "string"))
    return { ok: false as const, error: "Please upload image files only." };
  const files = (entries as File[]).filter(
    (file) => file.name !== "" || file.size !== 0,
  );
  if (
    files.length > 3 ||
    files.reduce((sum, file) => sum + file.size, 0) > MAX_PROJECT_IMAGE_BYTES
  )
    return {
      ok: false as const,
      error: "Choose up to 3 images, no more than 3 MB in total.",
    };
  const attachments: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[] = [];
  for (const [index, file] of files.entries()) {
    if (!file.size || !PROJECT_IMAGE_TYPES.includes(file.type))
      return { ok: false as const, error: "Use JPG, PNG or WebP images." };
    const bytes = Buffer.from(await file.arrayBuffer());
    const format = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      ? ["image/png", "png"]
      : bytes.length >= 3 &&
          bytes[0] === 255 &&
          bytes[1] === 216 &&
          bytes[2] === 255
        ? ["image/jpeg", "jpg"]
        : bytes.length >= 12 &&
            bytes.subarray(0, 4).equals(Buffer.from("RIFF")) &&
            bytes.subarray(8, 12).equals(Buffer.from("WEBP"))
          ? ["image/webp", "webp"]
          : null;
    if (!format || format[0] !== file.type)
      return {
        ok: false as const,
        error:
          "An image could not be read. Please choose a valid JPG, PNG or WebP file.",
      };
    attachments.push({
      filename: `inspiration-${index + 1}.${format[1]}`,
      content: bytes,
      contentType: format[0],
    });
  }
  return { ok: true as const, attachments };
}
