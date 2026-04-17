import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "apps/diagnostico-v1");
const output = resolve(root, "dist");

if (!existsSync(source)) {
  throw new Error(`No existe la app fuente: ${source}`);
}

rmSync(output, { force: true, recursive: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, {
  recursive: true,
  filter: (path) => !path.includes("/qa/") && !path.endsWith("/README.md"),
});

writeFileSync(
  resolve(output, "build-info.json"),
  JSON.stringify(
    {
      app: "diagnostico-v1",
      source: "apps/diagnostico-v1",
      output: "dist",
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

console.log(`Diagnostico V1 listo en ${output}`);

