import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { pageRoutes } from "@/data/cms-pages";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "/";
  if (!Object.values(pageRoutes).some(page => page.path === path) && !/^\/(blogs|case-studies)\/[a-z0-9-]+$/.test(path)) return new Response(null, { status: 400 });
  const mode = await draftMode();
  if (url.searchParams.has("exit")) mode.disable();
  else {
    const payload = await getPayload({ config });
    if (!(await payload.auth({ headers: request.headers })).user) return new Response("Sign in to the CMS to preview drafts.", { status: 403 });
    mode.enable();
  }
  return Response.redirect(new URL(path, url.origin), 303);
}
