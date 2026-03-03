import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    if (file.includes('logger.ts')) return;
    let content = fs.readFileSync(file, 'utf8');

    if (content.includes('logAndToastError') && !content.includes('import { logAndToastError } from')) {
        if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
            const parts = content.split('\n');
            parts.splice(1, 0, "import { logAndToastError } from '@/lib/logger';");
            content = parts.join('\n');
        } else {
            content = "import { logAndToastError } from '@/lib/logger';\n" + content;
        }
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log('Modified ' + changedFiles + ' files.');
