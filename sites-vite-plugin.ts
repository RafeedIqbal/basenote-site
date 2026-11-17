import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// vinext discovers every route below its app directory. Project only the public tree
// into its build cache so Node-only Payload handlers stay on the primary host.
export function publicSiteRoot() {
  const root = resolve(".vinext", "basenote-public");
  const output = resolve(root, "app");
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  for (const item of readdirSync("app", { withFileTypes: true })) {
    if (item.isFile() || item.name === "(site)") {
      cpSync(resolve("app", item.name), resolve(output, item.name), { recursive: true });
    }
  }
  return root;
}

export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }
    }
  };
}
