import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('type="number"') && !content.includes('inputMode="numeric"')) {
        content = content.replace(/type="number"/g, 'type="number" inputMode="numeric" pattern="[0-9]*"');
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log('Modified ' + changedFiles + ' files.');
