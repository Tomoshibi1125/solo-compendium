import fs from 'fs';
import { pathToFileURL } from 'url';

const files = [
    'src/data/compendium/backgrounds.ts',
    'src/data/compendium/feats-comprehensive.ts',
    'src/data/compendium/items-part1.ts',
    'src/data/compendium/items-part2.ts',
    'src/data/compendium/items-part3.ts',
    'src/data/compendium/items-part4.ts',
    'src/data/compendium/items-part5.ts',
    'src/data/compendium/jobs.ts',
    'src/data/compendium/locations.ts',
    'src/data/compendium/monsters/rank-a.ts',
    'src/data/compendium/monsters/rank-b.ts',
    'src/data/compendium/monsters/rank-c.ts',
    'src/data/compendium/monsters/rank-d.ts',
    'src/data/compendium/monsters/rank-s.ts',
    'src/data/compendium/paths.ts',
    'src/data/compendium/regents.ts',
    'src/data/compendium/relics-comprehensive.ts',
    'src/data/compendium/runes/technique-techniques.ts',
    'src/data/compendium/techniques.ts',
];

async function run() {
    for (const file of files) {
        const filePath = 'c:/Users/jjcal/Documents/solo-compendium/' + file;
        try {
            const module = await import(pathToFileURL(filePath).href);
            const exportNames = Object.keys(module);
            
            for (const exportName of exportNames) {
                const data = module[exportName];
                if (!Array.isArray(data)) continue;

                const seenNames = new Set();
                const uniqueData = data.filter(item => {
                    if (!item.name) return true;
                    if (seenNames.has(item.name)) return false;
                    seenNames.add(item.name);
                    return true;
                });

                if (uniqueData.length !== data.length) {
                    console.log(`Deduping ${exportName} in ${file}: ${data.length} -> ${uniqueData.length}`);
                    
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const headerEnd = content.indexOf(`export const ${exportName}`);
                    if (headerEnd === -1) {
                        console.log("Could not find export declaration in source.");
                        continue;
                    }

                    const header = content.slice(0, headerEnd);
                    const newContent = header + `export const ${exportName} = ` + JSON.stringify(uniqueData, null, '\t') + ';\n';
                    fs.writeFileSync(filePath, newContent);
                }
            }
        } catch (e) {
            console.error("Error processing", file, e);
        }
    }
}

run().catch(console.error);
