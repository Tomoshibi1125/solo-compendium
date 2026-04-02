import fs from 'node:fs';

const filePath = 'src/components/warden-protocols/SystemProtocolRegistry.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// 1. Identify all imports and their type status
const importRegex = /import\s+(type\s+)?{?([^}]+)}?\s+from\s+['"]([^'"]+)['"]/g;
let match;
const typeAliases = new Set();
const valueAliases = new Set();

const lines = content.split('\n');
for (const line of lines) {
    if (line.trim().startsWith('import ')) {
        const isTypeImport = line.includes('import type ');
        const aliasMatch = line.match(/[wf]\d+_[a-zA-Z0-9_]+/g);
        if (aliasMatch) {
            aliasMatch.forEach(alias => {
                // If it's a value import, but the specific part is 'type alias as wXXX', it's a type
                // But simplified: check if 'type ' precedes the alias in the same line
                const idx = line.indexOf(alias);
                const before = line.slice(0, idx);
                if (isTypeImport || before.includes('type ')) {
                    typeAliases.add(alias);
                } else {
                    valueAliases.add(alias);
                }
            });
        }
    }
}

const wAliases = Array.from(typeAliases).sort((a,b) => {
    const na = parseInt(a.slice(1).split('_')[0]) || 0;
    const nb = parseInt(b.slice(1).split('_')[0]) || 0;
    return na - nb;
});
const fAliases = Array.from(valueAliases).sort((a,b) => {
    const na = parseInt(a.slice(1).split('_')[0]) || 0;
    const nb = parseInt(b.slice(1).split('_')[0]) || 0;
    return na - nb;
});

// 2. Generate ProtocolWiringMatrix
let matrixLines = wAliases.map(alias => {
    if (alias.includes('FilterableQuery')) return `\t${alias}: ${alias}<unknown>;`;
    if (alias.includes('TablesInsert') || alias.includes('TablesUpdate')) return `\t${alias}: ${alias}<"characters">;`;
    if (alias.includes('Enums')) return `\t${alias}: ${alias}<"ability_score">;`;
    if (alias.includes('CompositeTypes')) return `\t${alias}: ${alias}<never>;`;
    // Add more special cases as needed
    return `\t${alias}: ${alias};`;
});

const newMatrix = `export type ProtocolWiringMatrix = {\n${matrixLines.join('\n')}\n};`;

// 3. Generate useEffect Usage
let effectLines = fAliases.map(alias => {
    return `\t\tif (typeof ${alias} !== "undefined") {\n\t\t\tconst _ = ${alias};\n\t\t}`;
});

const newEffectBody = `\tuseEffect(() => {\n\t\t// Protocol Matrix Initialization\n${effectLines.join('\n')}\n\t}, []);`;

// 4. Replace in content
const matrixRegex = /export type ProtocolWiringMatrix = {[\s\S]+?};/;
const effectRegex = /useEffect\(\(\) => {[\s\S]+?}, \[\]\);/;

let newContent = content.replace(matrixRegex, newMatrix);
newContent = newContent.replace(effectRegex, newEffectBody);

fs.writeFileSync(filePath, newContent);
console.log(`Successfully wired ${wAliases.length} types and ${fAliases.length} values.`);
