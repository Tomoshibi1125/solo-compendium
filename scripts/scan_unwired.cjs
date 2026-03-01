const fs = require('fs');
const path = require('path');

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            scanDirectory(filePath, fileList);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const componentDir = path.join('c:', 'Users', 'jjcal', 'Documents', 'solo-compendium', 'src', 'components');
const files = scanDirectory(componentDir);

const unwiredInteractive = [];

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const hasIntegration = content.includes('useGlobalDDBeyondIntegration');
    const isInteractive = /on(Click|Change|Toggle|Submit|Press|Remove|Add|Update|Delete|Roll)/i.test(content) || /useCharacterSheetEnhancements/i.test(content) || /usePlayerToolsEnhancements/i.test(content);

    if (isInteractive && !hasIntegration) {
        unwiredInteractive.push(file.replace(componentDir, ''));
    }
}

fs.writeFileSync(path.join('c:', 'Users', 'jjcal', 'Documents', 'solo-compendium', 'audit-artifacts', 'unwired-components.txt'), unwiredInteractive.join('\n'));
console.log('Done');
