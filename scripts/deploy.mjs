import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const VAULT_PLUGIN_DIR =
  "/Users/tins-macmini/Documents/Obsidian Vault/.obsidian/plugins/little-milestones";

// 1. Build
console.log("🔨 Building...");
execSync("node esbuild.config.mjs production", { cwd: rootDir, stdio: "inherit" });

// 2. Deploy
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

console.log("🚀 Deployed to Obsidian vault!");
