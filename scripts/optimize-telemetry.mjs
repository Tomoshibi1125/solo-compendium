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
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    if (file.includes('logger.ts')) return; // Skip logger itself
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Pattern: .catch(console.error) -> .catch((e) => logAndToastError(e, "Operation"))
    // We'll just replace `.catch(console.error)` with a generic `.catch((e) => logAndToastError(e, "Action Failed"))`
    // To keep it simple, if no import exists, we must add it.

    if (content.includes('.catch(console.error)')) {
        content = content.replace(/\.catch\(console\.error\)/g, '.catch((e) => logAndToastError(e, "Operation Failed"))');
        if (!content.includes('logAndToastError')) {
            // Insert import at the top after standard imports
            content = "import { logAndToastError } from '@/lib/logger';\n" + content;
        }
        hasChanges = true;
    }

    // Handle generic console.error
    if (content.includes('console.error') && !content.includes('console.error(')) {
        // some bare references might exist but we'll ignore those
    }

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log('Modified ' + changedFiles + ' files.');
