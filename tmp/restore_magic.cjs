const fs = require('fs');

const FILES = [
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part1.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part2.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part3.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part4.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part5.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/relics-comprehensive.ts"
];

function restoreMagic(content) {
    // Restore spell names
    content = content.replace(/Detect Protocol/g, "Detect Magic");
    content = content.replace(/Dispel Protocol/g, "Dispel Magic");
    content = content.replace(/Identify Protocol/g, "Identify Magic");
    content = content.replace(/dispel protocol/g, "dispel magic");
    
    // Allow "Magic" to coexist in descriptions if it sounds better
    // (This is subjective, but let's at least fix obvious mechanical terms)
    // For now, I'll just check common phrases.
    
    return content;
}

FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    console.log(`Restoring magic in ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    content = restoreMagic(content);
    fs.writeFileSync(filePath, content, 'utf8');
});
console.log("Magic restored where needed!");
