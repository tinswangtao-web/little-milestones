import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
// Override with env KID_SCORE_VAULT_DIR or LITTLE_MILESTONES_VAULT_DIR if the vault lives elsewhere.
const DEFAULT_VAULT_PLUGIN_DIR =
  "/Users/tins-macmini/Documents/Tins'Vault/.obsidian/plugins/kid-score";
const VAULT_PLUGIN_DIR =
  process.env.KID_SCORE_VAULT_DIR || process.env.LITTLE_MILESTONES_VAULT_DIR || DEFAULT_VAULT_PLUGIN_DIR;
const skipBuild = process.argv.includes("--no-build");
const verifyOnly = process.argv.includes("--verify-only");
const files = ["main.js", "styles.css", "manifest.json"];
const artifactInputs = {
  "main.js": ["src"],
  "styles.css": ["styles"],
  "manifest.json": ["manifest.json"],
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function getMtimeMs(filePath) {
  return fs.statSync(filePath).mtimeMs;
}

function newestMtimeMs(targetPath) {
  const stat = fs.statSync(targetPath);
  if (!stat.isDirectory()) return stat.mtimeMs;

  let newest = stat.mtimeMs;
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const childPath = path.join(targetPath, entry.name);
    newest = Math.max(newest, newestMtimeMs(childPath));
  }
  return newest;
}

function assertRequiredFilesExist() {
  const missing = files.filter((file) => !fs.existsSync(path.join(rootDir, file)));
  if (missing.length > 0) {
    fail(`Required deploy artifact(s) missing: ${missing.join(", ")}. Run npm run build first.`);
    process.exit(1);
  }
}

function assertArtifactsFreshForNoBuild() {
  for (const [artifact, inputs] of Object.entries(artifactInputs)) {
    const artifactPath = path.join(rootDir, artifact);
    const artifactMtime = getMtimeMs(artifactPath);
    for (const input of inputs) {
      const inputPath = path.join(rootDir, input);
      if (!fs.existsSync(inputPath)) continue;
      if (newestMtimeMs(inputPath) > artifactMtime) {
        fail(
          `${artifact} may be stale: ${input} is newer. Run npm run build, or deploy without --no-build.`
        );
        process.exit(1);
      }
    }
  }
}

function fileHash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function verifyVaultHashes() {
  let ok = true;
  for (const file of files) {
    const src = path.join(rootDir, file);
    const dest = path.join(VAULT_PLUGIN_DIR, file);
    if (!fs.existsSync(dest)) {
      console.error(`✗ ${file}: MISSING in vault`);
      ok = false;
      continue;
    }
    const srcHash = fileHash(src);
    const destHash = fileHash(dest);
    if (srcHash === destHash) {
      console.log(`MATCH ${file} ${srcHash.slice(0, 12)}`);
    } else {
      console.error(`✗ ${file}: HASH MISMATCH workspace=${srcHash} vault=${destHash}`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);
}

const vaultSource = process.env.KID_SCORE_VAULT_DIR
  ? "KID_SCORE_VAULT_DIR"
  : process.env.LITTLE_MILESTONES_VAULT_DIR
  ? "LITTLE_MILESTONES_VAULT_DIR"
  : "default path";
console.log(`Vault target (${vaultSource}): ${VAULT_PLUGIN_DIR}`);

if (!skipBuild && !verifyOnly) {
  console.log("🔨 Building...");
  execSync("node esbuild.config.mjs production", { cwd: rootDir, stdio: "inherit" });
} else if (verifyOnly) {
  console.log("Verifying Vault files without build or copy because --verify-only was provided.");
} else {
  console.log("Skipping build because --no-build was provided.");
}

assertRequiredFilesExist();
if (skipBuild && !verifyOnly) assertArtifactsFreshForNoBuild();

if (verifyOnly) {
  verifyVaultHashes();
  console.log("✓ Vault files match workspace:", VAULT_PLUGIN_DIR);
  process.exit(0);
}

fs.mkdirSync(VAULT_PLUGIN_DIR, { recursive: true });

for (const file of files) {
  const src = path.join(rootDir, file);
  const dest = path.join(VAULT_PLUGIN_DIR, file);
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    fail(
      `Failed to copy ${file} to Vault: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
  console.log(`✓ ${file} → vault`);
}

verifyVaultHashes();
console.log("🚀 Synced to Obsidian vault:", VAULT_PLUGIN_DIR);
