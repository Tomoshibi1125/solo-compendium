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
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it ends with a multi-line `{ ... };` that lacks `export `
    // A quick way is to check the last few characters.
    // If it doesn't have `export {` anywhere in the file but does have `};` at the end
    
    if (!content.includes('export {')) {
        // find the last occurrence of "{\n" or "{\r\n"
        const lastBraceIdx = content.lastIndexOf('{');
        if (lastBraceIdx > -1) {
            const upToBrace = content.substring(0, lastBraceIdx);
            // Verify there is no "export" keyword immediately before this brace
            if (!upToBrace.trim().endsWith('export')) {
                 // Prepend 'export '
                 content = upToBrace + 'export ' + content.substring(lastBraceIdx);
                 fs.writeFileSync(filePath, content);
                 console.log(`Restored multi-line export in ${file}`);
                 count++;
            }
        }
    }
});

console.log(`Restored ${count} multi-line export blocks in UI components.`);
