import * as fs from 'fs';
import * as path from 'path';

const featsFilePath = path.join(process.cwd(), 'src/data/compendium/feats-comprehensive.ts');
const newFeatsPath = path.join(process.cwd(), 'new_feats.json');

const newFeatsJson = fs.readFileSync(newFeatsPath, 'utf-8');
const featsArray = JSON.parse(newFeatsJson);

// We convert the JSON to a string that looks like JS objects
const featsString = featsArray.map(f => JSON.stringify(f, null, '\t\t').replace(/"([^"]+)":/g, '$1:')).join(',\n\t');

let content = fs.readFileSync(featsFilePath, 'utf-8');

// Find the last "];"
const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex !== -1) {
    content = content.slice(0, lastBracketIndex) + ',\n\t' + featsString + '\n];\n';
    fs.writeFileSync(featsFilePath, content);
    console.log('Appended feats successfully.');
} else {
    console.log('Failed to find the end of the array.');
}
