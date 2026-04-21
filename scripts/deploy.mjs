import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const DEFAULT_VAULT_PLUGIN_DIR =
  "/Users/tins-macmini/Documents/Obsidian Vault/.obsidian/plugins/little-milestones";
const VAULT_PLUGIN_DIR =
  process.env.LITTLE_MILESTONES_VAULT_DIR || DEFAULT_VAULT_PLUGIN_DIR;
const skipBuild = process.argv.includes("--no-build");

if (!skipBuild) {
  console.log("🔨 Building...");
  execSync("node esbuild.config.mjs production", { cwd: rootDir, stdio: "inherit" });
}

fs.mkdirSync(VAULT_PLUGIN_DIR, { recursive: true });

const files = ["main.js", "styles.css", "manifest.json"];
for (const file of files) {
  const src = path.join(rootDir, file);
  const dest = path.join(VAULT_PLUGIN_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ ${file} → vault`);
  } else {
    console.warn(`⚠ ${file} not found, skipping`);
  }
}

console.log("🚀 Synced to Obsidian vault:", VAULT_PLUGIN_DIR);
