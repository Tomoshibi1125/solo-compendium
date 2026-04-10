const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/data/compendium/runes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

let replacedCount = 0;
files.forEach(file => {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('rune_type: "Socketable"')) {
        const newContent = content.replace(/rune_type: "Socketable"/g, 'rune_type: "Consumable"');
        fs.writeFileSync(fullPath, newContent);
        replacedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Total files updated: ${replacedCount}`);
