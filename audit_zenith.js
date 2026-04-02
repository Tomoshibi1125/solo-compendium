const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2] || './src';
const keywords = ['TODO', 'FIXME', 'PARTIAL', 'XXX', 'TBD', 'placeholder'];
const results = [];

function auditDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && !file.startsWith('.')) {
                auditDir(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                keywords.forEach(keyword => {
                    // Match whole word or specific markers to avoid 'Partial<T>' type being flagged
                    // We check for case-insensitive keyword but exclude the TS type 'Partial<' explicitly
                    const lowLine = line.toLowerCase();
                    const lowKey = keyword.toLowerCase();
                    
                    if (lowLine.includes(lowKey)) {
                        // Exclude the legitimate TS utility type 'Partial<' or 'Partial< '
                        if (lowKey === 'partial' && (line.includes('Partial<') || line.includes('Partial <'))) {
                            return;
                        }
                        
                        results.push({
                            file: fullPath,
                            line: index + 1,
                            keyword: keyword,
                            content: line.trim()
                        });
                    }
                });
            });
        }
    }
}

console.log(`Starting Zenith Audit in ${rootDir}...`);
auditDir(rootDir);
console.log(`Found ${results.length} markers.`);

const outputPath = './zenith_audit_results.json';
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`Results written to ${outputPath}`);
