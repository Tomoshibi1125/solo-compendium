const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const Array_list = fs.readdirSync(dir);
    Array_list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.json')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(process.cwd(), 'src'));
let modifiedCount = 0;

const replacements = [
    [/System Ascendant/g, 'Rift Ascendant'],
    [/variant=\"system\"/g, 'variant=\"rift\"'],
    [/variant=\'system\'/g, 'variant=\'rift\''],
    [/warden-protocol/g, 'warden-directive'],
    [/Warden \(System\)/g, 'Warden'],
    [/VTT System/g, 'VTT Interface'],
    [/system-rules/g, 'core-rules'],
    [/system-console/g, 'rift-console'],
    [/category: \"system\"/g, 'category: \"rift\"'], // For WardenProtocols.tsx
    [/\{ id: \"system\"/g, '{ id: \"rift\"'],
    [/font-system/g, 'font-heading'],
    [/system-text-glow/g, 'ascendant-text-glow'],
    [/System UI/g, 'Ascendant UI'],
    [/System Awakening/g, 'Ascendant Awakening'],
    [/system guidelines/g, 'rift guidelines'],
    [/theraw energy of the System/g, 'the raw energy of the Rift'],
    [/memory of the System/g, 'memory of the Rift'],
    [/weight of the System/g, 'weight of the Rift'],
    [/optimized by the System/g, 'optimized by the Rift'],
    [/distortion they leave in the System/g, 'distortion they leave in the Rift'],
    [/Quotes the System/g, 'Quotes the Rift'],
    [/rewarded by the System/g, 'rewarded by the Rift'],
];

files.forEach(f => {
    try {
        let orig = fs.readFileSync(f, 'utf8');
        let content = orig;
        
        replacements.forEach(([regex, replacement]) => {
            content = content.replace(regex, replacement);
        });

        if (orig !== content) {
            fs.writeFileSync(f, content, 'utf8');
            modifiedCount++;
        }
    } catch (err) {
        console.error('Error processing ' + f + ': ' + err.message);
    }
});

console.log('Finished deep terminology purge in ' + modifiedCount + ' files.');
