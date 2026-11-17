import path from "node:path";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import { Admins, Articles, Media, Pages } from "@/cms/collections";

const root = process.cwd();
const sender = process.env.RESEND_SENDER_EMAIL?.trim();
if (process.env.VERCEL_ENV === "production") {
  for (const key of ["DATABASE_URL", "PAYLOAD_SECRET", "BLOB_READ_WRITE_TOKEN", "RESEND_API_KEY", "RESEND_SENDER_EMAIL"]) {
    if (!process.env[key]?.trim()) throw new Error("Missing production CMS configuration: " + key);
  }
}
const connection = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : undefined;
if (connection?.hostname.endsWith(".neon.tech")) connection.searchParams.set("sslmode", "verify-full");

export default buildConfig({
  admin: { user: "admins", components: { graphics: { Logo: "/components/cms/Brand#Logo", Icon: "/components/cms/Brand#Icon" } }, importMap: { baseDir: root }, meta: { titleSuffix: " · Basenote CMS" } },
  serverURL: process.env.VERCEL_ENV === "production" ? "https://www.basenotesolutions.com" : "",
  collections: [Pages, Articles, Media, Admins],
  db: postgresAdapter({ pool: { connectionString: connection?.toString(), max: 3 }, push: false, migrationDir: path.join(root, "cms/migrations") }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.join(root, "cms/payload-types.ts") },
  email: process.env.RESEND_API_KEY && sender ? resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: sender.match(/<([^>]+)>/)?.[1] ?? sender, defaultFromName: "Basenote Solutions" }) : () => ({ name: "disabled", defaultFromName: "Basenote", defaultFromAddress: "cms@localhost.invalid", sendEmail: async () => { throw new Error("Configure Resend to send CMS account emails."); } }),
  plugins: [vercelBlobStorage({ collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN, alwaysInsertFields: true })],
  graphQL: { disable: true }, upload: { limits: { fileSize: 3 * 1024 * 1024 }, abortOnLimit: true }, sharp
});
