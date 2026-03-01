const fs = require('fs');
const path = require('path');

function scanDirectory(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Ignore generic UI, admin, auth, art, audio, etc.
            const ignoredDirs = ['ui', 'admin', 'auth', 'art', 'audio', 'compendium'];
            if (!ignoredDirs.includes(file)) {
                scanDirectory(filePath, fileList);
            }
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const srcDir = path.join('c:', 'Users', 'jjcal', 'Documents', 'solo-compendium', 'src');
const componentsFiles = scanDirectory(path.join(srcDir, 'components'));
const pagesFiles = scanDirectory(path.join(srcDir, 'pages'));
const allFiles = [...componentsFiles, ...pagesFiles];

const auditResults = {
    totalScanned: allFiles.length,
    interactiveFiles: 0,
    wiredFiles: 0,
    unwiredFiles: 0,
    parityPercentage: 0,
    unwiredList: [],
    wiredList: []
};

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check if the file has interactive elements or actions
    const isInteractive = /on(Click|Change|Toggle|Submit|Press|Remove|Add|Update|Delete|Roll)/i.test(content) ||
        /useCharacterSheetEnhancements/i.test(content) ||
        /usePlayerToolsEnhancements/i.test(content) ||
        /<(Button|Input|Select|form|textarea)/i.test(content);

    // Check if it's wired to DDB or Campaign Engine
    const hasIntegration = content.includes('useGlobalDDBeyondIntegration') ||
        content.includes('useCharacterRoll') ||
        content.includes('ddbEnhancements') ||
        content.includes('trackInventoryChange') ||
        content.includes('broadcastCampaignEvent') ||
        content.includes('supabase.from(\'campaign_messages\')') ||
        content.includes('useSendCampaignMessage') ||
        content.includes('trackHealthChange') ||
        content.includes('trackConditionChange') ||
        content.includes('trackCustomFeatureUsage') ||
        content.includes('supabase.channel'); // low-level wiring count

    if (isInteractive) {
        auditResults.interactiveFiles++;

        const relativePath = file.replace(srcDir, '');
        if (hasIntegration) {
            auditResults.wiredFiles++;
            auditResults.wiredList.push(relativePath);
        } else {
            auditResults.unwiredFiles++;
            auditResults.unwiredList.push(relativePath);
        }
    }
}

if (auditResults.interactiveFiles > 0) {
    auditResults.parityPercentage = ((auditResults.wiredFiles / auditResults.interactiveFiles) * 100).toFixed(2);
}

const reportPath = path.join(srcDir, '..', 'audit-artifacts', 'comprehensive_audit_report.json');
if (!fs.existsSync(path.dirname(reportPath))) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
}
fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));

console.log(`Audit complete. Found ${auditResults.unwiredFiles} unwired out of ${auditResults.interactiveFiles} interactive files. Parity: ${auditResults.parityPercentage}%`);
console.log(`Results saved to ${reportPath}`);
