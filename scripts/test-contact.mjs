import { mkdtemp, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = await mkdtemp(path.join(os.tmpdir(), "basenote-contact-tests-"));
const tests = ["lib/turnstile.test.ts", "app/actions/contact.test.ts"];

try {
  const program = ts.createProgram(tests.map((file) => path.join(root, file)), {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    esModuleInterop: true,
    resolveJsonModule: true,
    strict: true,
    skipLibCheck: true,
    noEmitOnError: true,
    rootDir: root,
    outDir: output,
    baseUrl: root,
    paths: { "@/*": ["./*"] },
  });
  const emitted = program.emit(undefined, undefined, undefined, undefined, {
    before: [(context) => (source) => {
      const visit = (node) => {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
          const specifier = node.moduleSpecifier.text;
          // Next enforces the server-only boundary; this harness runs directly in Node.
          if (specifier === "server-only") return undefined;
          if (specifier.startsWith("@/")) {
            const relative = path.relative(path.dirname(source.fileName), path.join(root, specifier.slice(2))).split(path.sep).join("/");
            return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause,
              ts.factory.createStringLiteral(relative.startsWith(".") ? relative : `./${relative}`), node.attributes);
          }
        }
        return ts.visitEachChild(node, visit, context);
      };
      return ts.visitNode(source, visit);
    }],
  });
  const diagnostics = ts.sortAndDeduplicateDiagnostics([...ts.getPreEmitDiagnostics(program), ...emitted.diagnostics]);
  if (diagnostics.length) {
    console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (file) => file,
      getNewLine: () => "\n",
    }));
    process.exitCode = 1;
  } else {
    await symlink(path.join(root, "node_modules"), path.join(output, "node_modules"), "dir");
    const result = spawnSync(process.execPath, ["--test", ...tests.map((file) => path.join(output, file.replace(/\.ts$/, ".js")))], { stdio: "inherit" });
    process.exitCode = result.status ?? 1;
  }
} finally {
  await rm(output, { recursive: true, force: true });
}
