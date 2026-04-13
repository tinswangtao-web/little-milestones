import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prod = process.argv[2] === "production";

// Obsidian vault plugin directory — adjust if needed
const VAULT_PLUGIN_DIR =
  "C:/Users/FinalHome/Documents/Obsidian Vault/.obsidian/plugins/little-milestones";

const context = await esbuild.context({
  entryPoints: ["main.ts"],
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
  plugins: prod
    ? []
    : [
        {
          name: "deploy-on-build",
          setup(build) {
            build.onEnd(() => {
              try {
                execSync(
                  `cp main.js "${VAULT_PLUGIN_DIR}/main.js" && cp styles.css "${VAULT_PLUGIN_DIR}/styles.css"`,
                  { stdio: "inherit", shell: "bash" }
                );
                console.log("✓ Deployed to Obsidian vault");
              } catch (e) {
                console.error("Deploy failed:", e.message);
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
