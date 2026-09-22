const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'compendium', 'regents.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find each regent object
const parts = content.split(/(\t\{\n\t\tid: ".*?_regent")/g);

for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('\t{\n\t\tid: "')) {
        let block = parts[i] + parts[i+1];
        
        // Extract primary abilities
        const primaryMatch = block.match(/primary_ability:\s+\[(.*?)\]/);
        if (primaryMatch) {
            const stats = primaryMatch[1].split(',').map(s => s.replace(/"/g, '').trim().toLowerCase());
            const statBonuses = `stat_bonuses: { ${stats.map(s => `${s}: 2`).join(', ')} }`;
            
            // The string to inject/replace
            const featureDef = `\t\t\t{\n\t\t\t\tlevel: 4,\n\t\t\t\tname: "Regent Attribute Enhancement",\n\t\t\t\tdescription:\n\t\t\t\t\t"Your primary and secondary attributes increase by +2, reflecting your growing Regent power.",\n\t\t\t\ttype: "passive",\n\t\t\t\tmechanics: {\n\t\t\t\t\t${statBonuses}\n\t\t\t\t},\n\t\t\t},`;

            // If it already has one, replace it
            if (block.includes('name: "Regent Attribute Enhancement"')) {
                const regex = /\{\s*level:\s*\d+,\s*name:\s*"Regent Attribute Enhancement"[\s\S]*?\},/g;
                block = block.replace(regex, featureDef);
            } else {
                // Otherwise, append it to class_features
                // We find `class_features: [` and insert it right after
                block = block.replace(/class_features:\s*\[/, `class_features: [\n${featureDef}`);
            }
        }
        
        parts[i] = "";
        parts[i+1] = block;
        i++;
    }
}

fs.writeFileSync(filePath, parts.join(''));
console.log('Regents fully enriched with Attribute Enhancement!');
