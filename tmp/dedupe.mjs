import fs from 'fs';
import { pathToFileURL } from 'url';

async function dedupe(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/export const (\w+) = \[\s*(?=\{|\/\/)/);
    if (!match) {
        console.log("No array export found in", filePath);
        return;
    }
    const exportName = match[1];
    const header = content.slice(0, match.index);
    
    // Import the module dynamically to get the parsed array
    console.log("Importing", filePath);
    const module = await import(pathToFileURL(filePath).href);
    const data = module[exportName];
    if (!Array.isArray(data)) {
        console.log(exportName, "is not an array in", filePath);
        return;
    }

    const seenNames = new Set();
    const uniqueData = data.filter(item => {
        if (!item.name) return true;
        if (seenNames.has(item.name)) return false;
        seenNames.add(item.name);
        return true;
    });

    if (uniqueData.length === data.length) {
        console.log("No duplicates in", filePath);
        return;
    }

    console.log(`Deduped ${filePath}: ${data.length} -> ${uniqueData.length}`);
    const newContent = header + `export const ${exportName} = ` + JSON.stringify(uniqueData, null, '\t') + ';\n';
    fs.writeFileSync(filePath, newContent);
}

dedupe('c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/backgrounds.ts').catch(console.error);
