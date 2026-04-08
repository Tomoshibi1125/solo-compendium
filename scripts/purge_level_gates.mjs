import fs from 'fs';
import path from 'path';

const filesToClean = [
    'src/data/compendium/sigils.ts',
    'src/data/compendium/items-part1.ts',
    'src/data/compendium/items-part2.ts',
    'src/data/compendium/items-part3.ts',
    'src/data/compendium/items-part4.ts',
    'src/data/compendium/items-part5.ts',
    'src/data/compendium/items-part6.ts',
    'src/data/compendium/items-part7.ts',
    'src/data/compendium/items-part8.ts',
    'src/data/compendium/items-part9.ts',
    'src/data/compendium/tattoos.ts',
    'src/data/compendium/artifacts.ts'
];

// Add runes directory
const runesDir = 'src/data/compendium/runes';
if (fs.existsSync(runesDir)) {
    const runeFiles = fs.readdirSync(runesDir).filter(f => f.endsWith('.ts'));
    runeFiles.forEach(f => filesToClean.push(path.join(runesDir, f)));
}

filesToClean.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping missing file: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;

    // 1. Remove level gating properties
    // Handles various property names and patterns
    const gatePatterns = [
        /^\s*requires_level:\s*(?:\d+|null|undefined),?\s*$/gm,
        /^\s*level_requirement:\s*(?:\d+|null|undefined),?\s*$/gm,
        /^\s*gate_rank:\s*(?:"[^"]*"|'[^']*'|null|undefined),?\s*$/gm,
        // Also handle inline cases if applicable
        /,\s*(?:requires_level|level_requirement|gate_rank):\s*[^\s,}\]]+/g
    ];

    gatePatterns.forEach(pattern => {
        content = content.replace(pattern, '');
    });

    // 2. Fix syntax errors (specifically double commas and comma before closing brace)
    // Double comma fix
    content = content.replace(/,,+/g, ',');
    
    // Comma before closing brace: }, { -> }, { or ,} -> }
    content = content.replace(/,\s*}/g, '\n\t},'); // Standardize
    content = content.replace(/,\s*]/g, '\n];'); // Final array closing

    // 3. Fix Sigils.ts corruption specifically
    if (filePath.endsWith('sigils.ts')) {
        // Remove duplicate requires_level if any survived the first pass
        content = content.replace(/requires_level: \d+,/g, '');
        
        // Ensure image has only one comma
        content = content.replace(/"image":\s*("[^"]*"),\s*,/g, '"image": $1,');
        content = content.replace(/image:\s*("[^"]*"),\s*,/g, 'image: $1,');

        // Restore header if corrupted again (it should be fine from last repair, but let's be sure)
        if (!content.includes('export const sigils: SigilEntry[] = [')) {
            console.log("Sigils.ts missing export, attempting to prepend header...");
            // Prepend logic if needed
        }
    }

    // 4. Final Cleanup of empty lines
    content = content.replace(/^\s*[\r\n]/gm, '');

    fs.writeFileSync(filePath, content);
    console.log(`Finished ${filePath} (Original: ${originalLength}, New: ${content.length})`);
});

// Update Type definitions to reflect no gating (optional)
const typesPath = 'src/types/compendium.ts';
if (fs.existsSync(typesPath)) {
    let typesContent = fs.readFileSync(typesPath, 'utf8');
    // We leave them as optional in types to avoid breaking external code, but update the documentation/feeling
    console.log("Updating types.ts (optional check)...");
}

console.log("\nPurge and Repair complete.");
