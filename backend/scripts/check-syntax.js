import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const ignoredDirectories = new Set(["coverage", "logs", "node_modules"]);
const rootDirectory = process.cwd();

function collectJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : collectJavaScriptFiles(path);
    }

    return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
  });
}

const files = collectJavaScriptFiles(rootDirectory);
let hasSyntaxError = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    hasSyntaxError = true;
    console.error(`Syntax check failed: ${relative(rootDirectory, file)}`);
    console.error(result.stderr || result.stdout);
  }
}

if (hasSyntaxError) {
  process.exitCode = 1;
}
