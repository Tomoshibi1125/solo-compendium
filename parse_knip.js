const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, 'knip-report-utf8.txt');
const reportContent = fs.readFileSync(reportPath, 'utf-8');
const lines = reportContent.split('\n');

const unusedExports = [];
const unusedTypes = [];

let currentSection = null;

for (const line of lines) {
    if (line.includes('Unused exports')) {
        currentSection = 'exports';
        continue;
    }
    if (line.includes('Unused exported types')) {
        currentSection = 'types';
        continue;
    }
    if (line.includes('Duplicate exports') || line.includes('Configuration hints')) {
        currentSection = null;
        continue;
    }

    if (currentSection && line.trim()) {
        const cleanedLine = line.replace(/\x1b\[.*?m/g, '').trim(); // Remove ANSI codes
        if (!cleanedLine) continue;

        // E.g., "isTouchDevice                    function  src/lib/mobile.ts:17:17"
        // E.g., "buildToolStorageKey                        src/hooks/useToolState.ts:9:14"
        const parts = cleanedLine.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
            const filePart = parts[parts.length - 1];
            if (filePart.includes('src/')) {
                const name = parts[0];
                const fileSplit = filePart.split(':');
                const filePath = fileSplit[0];
                const lineNum = fileSplit[1] ? parseInt(fileSplit[1], 10) : 0;
                
                let typeDef = 'variable';
                if (parts.length > 2 && ['function', 'class', 'interface', 'type'].includes(parts[1])) {
                    typeDef = parts[1];
                }

                const item = { name, typeDef, filePath, lineNum };
                if (currentSection === 'exports') unusedExports.push(item);
                else unusedTypes.push(item);
            }
        }
    }
}

const groupedByFile = {};
[...unusedExports, ...unusedTypes].forEach(item => {
    // Group by file
    if (!groupedByFile[item.filePath]) {
        groupedByFile[item.filePath] = [];
    }
    groupedByFile[item.filePath].push(item);
});

console.log(`Found ${unusedExports.length} unused exports`);
console.log(`Found ${unusedTypes.length} unused types`);
console.log(`Across ${Object.keys(groupedByFile).length} files`);

const majorFiles = Object.entries(groupedByFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20);

console.log('\nTop 20 files with most unused exports/types:');
majorFiles.forEach(([file, items]) => {
    console.log(`- ${file}: ${items.length} items`);
});

fs.writeFileSync(path.join(__dirname, 'parsed_knip.json'), JSON.stringify(groupedByFile, null, 2));
console.log('\nSaved parsed data to parsed_knip.json');
