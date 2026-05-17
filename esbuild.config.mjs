import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "node:module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const prod = args.includes("production") || args.includes("--production");
const watchMode = args.includes("--watch") || !prod;
const outfileArg = args.find((arg) => arg.startsWith("--outfile="));
const outfile = outfileArg ? outfileArg.slice("--outfile=".length) : "main.js";
const builtins = Array.from(new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]));

function buildStyles() {
  const styleDir = path.join(__dirname, "styles");
  const outFile = path.join(__dirname, "styles.css");
  if (!fs.existsSync(styleDir)) return;
  const files = fs
    .readdirSync(styleDir)
    .filter((f) => f.endsWith(".css"))
    .sort();
  let css = "";
  for (const f of files) {
    css += fs.readFileSync(path.join(styleDir, f), "utf-8").replace(/\r\n?/g, "\n") + "\n";
  }
  fs.writeFileSync(outFile, css);
  console.log(`✓ styles.css built from ${files.length} modules`);
}

buildStyles();

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins,
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile,
  allowOverwrite: true,
  plugins: [],
});

if (!watchMode) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
