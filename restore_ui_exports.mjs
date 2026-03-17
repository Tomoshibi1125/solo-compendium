import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiDir = path.join(__dirname, 'src/components/ui');

let count = 0;

fs.readdirSync(uiDir).forEach(file => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    
    const filePath = path.join(uiDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // The cleanup script turned `export { A, B };` into `{ A, B };`
    // We regex match lines that are just `{ Something };` at the end of the file.
    
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        // If it starts with { and ends with }; and has some uppercase component names
        if (trimmed.startsWith('{') && trimmed.endsWith('};')) {
            lines[i] = lines[i].replace(/^(\s*)\{/, '$1export {');
            modified = true;
            count++;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`Restored exports in ${file}`);
    }
});

console.log(`Restored ${count} export blocks in UI components.`);
