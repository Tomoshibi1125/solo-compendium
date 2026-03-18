import fs from "fs";
import path from "path";

const logData = fs.readFileSync("tsc_errors_utf8_2.txt", "utf-8");

// src/lib/characterCalculations.ts(9,2): error TS2459: Module '"./5eCharacterCalculations"' declares 'CalculatedStats' locally, but it is not exported.
const regex = /error TS2459: Module '\"([^\"]+)\"' declares '([^']+)' locally, but it is not exported/g;
// src/lib/vtt/index.ts(90,8): error TS2306: File 'C:/Users/jjcal/Documents/solo-compendium/src/lib/vtt/particlePresets.ts' is not a module.
// We'll also just blanket export the things inside those files.

const missingExports = new Map(); // filepath -> Set of symbols

let match;
while ((match = regex.exec(logData)) !== null) {
  let modulePath = match[1]; // e.g. ./5eCharacterCalculations
  const symbol = match[2]; // e.g. CalculatedStats
  
  // They are relative to the file where the error happened.
  // Wait, the regex needs the source file to resolve correctly.
}

// Alternatively, let's just search the whole src for those symbols and export them.
const symbolsToExport = new Set();
const logLines = logData.split('\n');
for (const line of logLines) {
  const m1 = line.match(/declares '([^']+)' locally, but it is not exported/);
  if (m1) symbolsToExport.add(m1[1]);
  
  const m2 = line.match(/has no exported member named '([^']+)'/);
  if (m2) symbolsToExport.add(m2[1]);
}

// For TS2306, we can manually check files:
// src/lib/vtt/particlePresets.ts
// src/lib/vtt/rollMacros.ts
// src/lib/vtt/vttAssetManifest.ts

console.log("Symbols to export:", Array.from(symbolsToExport));

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let changed = false;
  
  for (const sym of symbolsToExport) {
    const regex1 = new RegExp(`^const ${sym}\\b`, "gm");
    if (regex1.test(content)) {
      content = content.replace(regex1, `export const ${sym}`);
      changed = true;
    }
    
    const regex2 = new RegExp(`^function ${sym}\\b`, "gm");
    if (regex2.test(content)) {
      content = content.replace(regex2, `export function ${sym}`);
      changed = true;
    }
    
    const regex3 = new RegExp(`^type ${sym}\\b`, "gm");
    if (regex3.test(content)) {
      content = content.replace(regex3, `export type ${sym}`);
      changed = true;
    }
    
    const regex4 = new RegExp(`^interface ${sym}\\b`, "gm");
    if (regex4.test(content)) {
      content = content.replace(regex4, `export interface ${sym}`);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Restored exports in", filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), "src"));

// Also fix the TS2306 files manually exporting everything
function exportAllInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf-8");
  content = content.replace(/^const /gm, "export const ");
  content = content.replace(/^function /gm, "export function ");
  content = content.replace(/^type /gm, "export type ");
  content = content.replace(/^interface /gm, "export interface ");
  fs.writeFileSync(filePath, content, "utf-8");
  console.log("Blanket exported", filePath);
}

exportAllInFile(path.join(process.cwd(), "src/lib/vtt/particlePresets.ts"));
exportAllInFile(path.join(process.cwd(), "src/lib/vtt/rollMacros.ts"));
exportAllInFile(path.join(process.cwd(), "src/lib/vtt/vttAssetManifest.ts"));
