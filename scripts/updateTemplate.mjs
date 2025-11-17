#!/usr/bin/env node
/**
 * Template Update Script
 * Checks for template updates and applies them to existing installations
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJSON(p) { 
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")); 
  } catch (error) {
    return null;
  }
}

function writeJSON(p, obj) { 
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8"); 
}

function exists(p) { 
  try { 
    fs.accessSync(p); 
    return true; 
  } catch { 
    return false; 
  } 
}

function parseArgs(argv) {
  const args = { target: null, checkOnly: false, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target") args.target = argv[++i];
    else if (a === "--check-only") args.checkOnly = true;
    else if (a === "--force") args.force = true;
    else if (a === "-h" || a === "--help") args.help = true;
    else if (!args.target) args.target = a;
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/updateTemplate.mjs <target-path> [--check-only] [--force]
  
Options:
  --check-only    Only check for updates, don't apply them
  --force         Force update even if versions match
  --help          Show this help message`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.target) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const targetRoot = path.resolve(process.cwd(), args.target);
  const templateMarkerPath = path.join(targetRoot, ".cursor", "template.json");
  
  // Check if target has template installed
  if (!exists(templateMarkerPath)) {
    console.log("❌ No template installation found in target directory.");
    console.log("   Run 'node setup.mjs <target>' to install the template first.");
    process.exit(1);
  }

  const installedMarker = readJSON(templateMarkerPath);
  if (!installedMarker) {
    console.log("❌ Invalid template marker file.");
    process.exit(1);
  }

  // Get current template version
  const manifestPath = path.resolve(__dirname, "../apply-kit/template.manifest.json");
  if (!exists(manifestPath)) {
    console.log("❌ Template manifest not found.");
    process.exit(1);
  }

  const manifest = readJSON(manifestPath);
  const currentVersion = manifest.version || "1.0.0";
  const installedVersion = installedMarker.version || "1.0.0";

  console.log(`📋 Template Update Check`);
  console.log(`   Installed version: ${installedVersion}`);
  console.log(`   Available version: ${currentVersion}`);

  if (currentVersion === installedVersion && !args.force) {
    console.log("✅ Template is up to date.");
    return;
  }

  if (args.checkOnly) {
    console.log("🔄 Update available! Run without --check-only to apply.");
    return;
  }

  console.log("🔄 Applying template update...");
  
  // Run the apply template script
  try {
    const { execSync } = await import("child_process");
    execSync(`node ${path.join(__dirname, "../apply-kit/scripts/applyTemplate.mjs")} --target "${targetRoot}" --force`, {
      stdio: "inherit"
    });
    
    // Update the marker with new version
    writeJSON(templateMarkerPath, {
      ...installedMarker,
      version: currentVersion,
      updated_at: new Date().toISOString()
    });
    
    console.log("✅ Template update completed successfully!");
  } catch (error) {
    console.log(`❌ Update failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(err => { 
  console.error(err); 
  process.exit(1); 
});
