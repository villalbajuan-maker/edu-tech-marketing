import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(appRoot, "dist");
const entries = ["index.html", "styles.css", "src"];

rmSync(output, { force: true, recursive: true });
mkdirSync(output, { recursive: true });

for (const entry of entries) {
  const source = resolve(appRoot, entry);
  if (!existsSync(source)) {
    throw new Error(`No existe ${entry} en ${appRoot}`);
  }
  cpSync(source, resolve(output, entry), { recursive: true });
}

writeFileSync(
  resolve(output, "build-info.json"),
  JSON.stringify(
    {
      app: "diagnostico-v1",
      root: "apps/diagnostico-v1",
      output: "dist",
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

console.log(`Diagnostico V1 listo en ${output}`);

