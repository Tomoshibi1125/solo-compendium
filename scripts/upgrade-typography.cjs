const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files);
        } else if (fullPath.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = getFiles('c:/Users/jjcal/Documents/solo-compendium/src/pages');

let filesChanged = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const initialContent = content;

    // Pattern: <p className="...text-muted-foreground...">...</p>
    const pRegex = /<p([^>]*)className="([^"]*text-muted-foreground[^"]*)"([^>]*)>([\s\S]*?)<\/p>/g;

    if (pRegex.test(content)) {
        content = content.replace(pRegex, (match, prefix, className, suffix, inner) => {
            // Retain block behavior of <p> tag
            const newClassName = className.includes('block') || className.includes('flex') || className.includes('grid') ? className : `block ${className}`;
            return `<SystemText${prefix}className="${newClassName}"${suffix}>${inner}</SystemText>`;
        });

        // Determine if we need to add the import
        const hasAnySystemTextImport = content.includes('@/components/ui/SystemText"');
        const hasSpecificSystemTextImport = /import\s+{[^}]*?\bSystemText\b[^}]*?}\s+from\s+"@\/components\/ui\/SystemText"/.test(content);

        if (!hasAnySystemTextImport) {
            // Prepend to top of file
            content = 'import { SystemText } from "@/components/ui/SystemText";\n' + content;
        } else if (!hasSpecificSystemTextImport) {
            // It has the import from the path, but not the 'SystemText' export.
            content = content.replace(/import\s*{([^}]+)}\s*from\s*"@\/components\/ui\/SystemText";/, 'import { SystemText, $1 } from "@/components/ui/SystemText";');
        }

        if (content !== initialContent) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${path.basename(file)}`);
            filesChanged++;
        }
    }
}
console.log(`Updated ${filesChanged} files.`);
