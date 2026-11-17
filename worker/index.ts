import { SITE_ORIGIN } from "../lib/site-brand";
import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  passThroughOnException(): void;
  waitUntil(promise: Promise<unknown>): void;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (/^\/(admin|api|cms)(\/|$)/.test(url.pathname)) {
      return Response.redirect(SITE_ORIGIN + url.pathname + url.search, 307);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) => path.startsWith("/api/media/file/")
            ? fetch(SITE_ORIGIN + path)
            : env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          }
        },
        allowedWidths
      );
    }

    return handler.fetch(request, env, ctx);
  }
};

export default worker;
