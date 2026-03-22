import fs from 'node:fs';
const report = fs.readFileSync('knip_report.txt', 'utf16le');
const lines = report.split('\n').filter(line => line.trim() !== '');

let section = '';
const unusedFiles = [];
const unusedExports = [];
const unusedDependencies = [];

for (const line of lines) {
    if (line.includes('Unused files (')) {
        section = 'files';
        continue;
    } else if (line.includes('Unused exports (')) {
        section = 'exports';
        continue;
    } else if (line.includes('Unused dependencies (')) {
        section = 'deps';
        continue;
    } else if (line.includes('Unused devDependencies (')) {
        section = 'devDeps';
        continue;
    }

    if (section === 'files') {
        unusedFiles.push(line.trim());
    } else if (section === 'exports') {
        unusedExports.push(line.trim());
    }
}

console.log('--- Unused Files Summary ---');
const filesByDir = unusedFiles.reduce((acc, file) => {
    const dir = file.split('/')[0] || 'root';
    acc[dir] = (acc[dir] || 0) + 1;
    return acc;
}, {});
console.log(JSON.stringify(filesByDir, null, 2));

console.log('\n--- Unused Hooks/Components/Lib ---');
const prioritized = unusedFiles.filter(f => f.startsWith('src/hooks') || f.startsWith('src/components') || f.startsWith('src/lib'));
console.log(prioritized.join('\n'));

console.log('\n--- Unused Exports in src ---');
const exportsInSrc = unusedExports.filter(e => e.includes('src/'));
console.log(exportsInSrc.slice(0, 50).join('\n')); // Show first 50
