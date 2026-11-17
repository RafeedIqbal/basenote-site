import config from "@payload-config";
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const OPTIONS = REST_OPTIONS(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const DELETE = REST_DELETE(config);
const post = REST_POST(config);
export const POST: typeof post = async (req, ctx) => {
  const { slug } = await ctx.params;
  if (slug?.at(-1) === "first-register") return new Response(null, { status: 404 });
  return post(req, ctx);
};
