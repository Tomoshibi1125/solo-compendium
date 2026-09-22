const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'compendium', 'regents.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find each regent object
// We can find `primary_ability: ["Stat1", "Stat2"]`
// and then find `name: "Regent Attribute Enhancement"` inside that regent
// Since a file is just a giant string, this might be tricky with regex.

// Let's use a simpler approach. We know the stats map to lowercase in `stat_bonuses`.
// We can split the file by `{ id: "` or similar.

const parts = content.split(/(\t\{\n\t\tid: ".*?_regent")/g);

for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('\t{\n\t\tid: "')) {
        let block = parts[i] + parts[i+1];
        
        // Extract primary abilities
        const primaryMatch = block.match(/primary_ability:\s+\[(.*?)\]/);
        if (primaryMatch) {
            const stats = primaryMatch[1].split(',').map(s => s.replace(/"/g, '').trim().toLowerCase());
            
            // Format stat bonuses
            const statBonuses = `stat_bonuses: { ${stats.map(s => `${s}: 2`).join(', ')} }`;
            const mechanicsStr = `\n\t\t\t\tmechanics: {\n\t\t\t\t\t${statBonuses}\n\t\t\t\t},`;

            // Add mechanics to Regent Attribute Enhancement
            // It looks like:
            // name: "Regent Attribute Enhancement",
            // description: "...",
            // type: "passive",
            // },
            
            const regex = /(name:\s+"Regent Attribute Enhancement",\s+description:\s+".*?",\s+type:\s+"passive",)/g;
            block = block.replace(regex, `$1${mechanicsStr}`);
        }
        
        // Also enrich abilities with attack/save if they don't have mechanics?
        // Wait, the user specifically mentioned "Regent Attribute Enhancement". 
        // Did they say they want attack/save for regents? "our regents may need the same treatment we gave the others"
        // Let's add flavor and lore if they are missing?
        // Let's check if they have flavor and lore.
        if (!block.includes('flavor:')) {
            const nameMatch = block.match(/name:\s+"(.*?)"/);
            if (nameMatch) {
                const name = nameMatch[1];
                block = block.replace(/(source_book:\s+".*?",)/, `$1\n\t\tflavor: "A specialized manifestation of Regent Resonance. This form allows the caster to weave the ${name} into an Absolute Decree.",\n\t\tlore: "The ${name} is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",`);
            }
        }

        parts[i] = "";
        parts[i+1] = block;
        i++;
    }
}

fs.writeFileSync(filePath, parts.join(''));
console.log('Regents enriched!');
