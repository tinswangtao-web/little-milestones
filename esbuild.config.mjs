import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prod = process.argv[2] === "production";

// Obsidian vault plugin directory — adjust if needed
const VAULT_PLUGIN_DIR =
  "/Users/tins-macmini/Documents/Obsidian Vault/.obsidian/plugins/little-milestones";

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
    css += fs.readFileSync(path.join(styleDir, f), "utf-8") + "\n";
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
  outfile: "main.js",
  allowOverwrite: true,
  plugins: prod
    ? []
    : [
        {
          name: "deploy-on-build",
          setup(build) {
            build.onEnd(() => {
              buildStyles();
              try {
                fs.copyFileSync("main.js", path.join(VAULT_PLUGIN_DIR, "main.js"));
                fs.copyFileSync("styles.css", path.join(VAULT_PLUGIN_DIR, "styles.css"));
                console.log("✓ Deployed to Obsidian vault");
              } catch (e) {
                console.error("Deploy failed:", e?.message || e);
              }
            });
          },
        },
      ],
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
