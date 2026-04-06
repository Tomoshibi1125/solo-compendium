const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
            results.push(filePath);
        }
    });
    return results;
}

const rootDir = path.join(process.cwd(), 'src');
const files = walk(rootDir);
let modifiedCount = 0;

const replacements = [
    // Paths and Imports
    [/warden-protocols/g, 'warden-directives'],
    [/@\/types\/system-rules/g, '@/types/core-rules'],
    [/system-rules/g, 'core-rules'],
    
    // Core Types/Terms
    [/SystemProtocolRegistry/g, 'WardenDirectiveMatrix'],
    [/SystemAbilityScore/g, 'AbilityScore'],
    [/system_favor/g, 'rift_favor'],
    [/System Favor/g, 'Rift Favor'],
    [/systemFavor/g, 'riftFavor'],
    [/useSystemSound/g, 'useRiftSound'],
    [/Protocol Warden/g, 'Warden'],
    [/PW/g, 'Warden'],
    [/getSystemFavorDie/g, 'getRiftFavorDie'],
    
    // Broadcast Themes
    [/"system"/g, '"rift"'], 
    [/'system'/g, "'rift'"],
    [/BroadcastTheme = "system"/g, 'BroadcastTheme = "rift"'],
    
    // Components
    [/SystemBroadcast/g, 'RiftBroadcast'],
    [/SystemNotificationOverlay/g, 'RiftNotificationOverlay'],
    
    // CSS and UI
    [/system-materialize/g, 'ascendant-materialize'],
    [/system-panel/g, 'ascendant-panel'],
    [/system-label/g, 'ascendant-label'],
    [/system-value/g, 'ascendant-value'],
    [/system-title-bar/g, 'rift-title-bar'],
    [/variant="system"/g, 'variant="rift"'],
    [/className="system-/g, 'className="ascendant-'],
    [/\.system-panel/g, '.ascendant-panel'],
    [/system-ui\.css/g, 'ascendant-ui.css'],
];

files.forEach(f => {
    try {
        const orig = fs.readFileSync(f, 'utf8');
        let content = orig;
        
        replacements.forEach(([regex, replacement]) => {
            content = content.replace(regex, replacement);
        });

        // useCharacters.ts fix
        if (f.endsWith('useCharacters.ts')) {
            if (content.includes('type AbilityScore = Database["public"]["Enums"]["ability_score"];')) {
                content = content.replace('type AbilityScore = Database["public"]["Enums"]["ability_score"];', '');
                if (!content.includes("from '@/types/core-rules'")) {
                    content = "import { AbilityScore } from '@/types/core-rules';\n" + content;
                }
            }
        }

        if (orig !== content) {
            fs.writeFileSync(f, content, 'utf8');
            modifiedCount++;
        }
    } catch (err) {
        console.error('Error processing ' + f + ': ' + err.message);
    }
});

// File Renames
const vttDir = path.join(process.cwd(), 'src/components/vtt');
if (fs.existsSync(vttDir)) {
    const oldNotify = path.join(vttDir, 'SystemNotificationOverlay.tsx');
    if (fs.existsSync(oldNotify)) {
        fs.renameSync(oldNotify, path.join(vttDir, 'RiftNotificationOverlay.tsx'));
        console.log('Renamed SystemNotificationOverlay.tsx to RiftNotificationOverlay.tsx');
    }
}

console.log('Finished Rift Ascendant Final Purge v2 in ' + modifiedCount + ' files.');
