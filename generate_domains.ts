import * as fs from 'fs';
import * as path from 'path';

const spellDir = 'src/data/compendium/spells';
const files = fs.readdirSync(spellDir).filter(f => f.endsWith('.ts'));

interface Spell {
    name: string;
    level: number;
    desc: string;
    school: string;
    tags: string[];
}

const allSpells: Spell[] = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(spellDir, file), 'utf-8');
    const objects = content.split('display_name:');
    for (let i = 1; i < objects.length; i++) {
        const obj = objects[i];
        
        const nameMatch = obj.match(/^\s*"([^"]+)"/);
        const levelMatch = obj.match(/level:\s*(\d+)/);
        const schoolMatch = obj.match(/school:\s*"([^"]+)"/);
        
        if (nameMatch && levelMatch) {
            allSpells.push({
                name: nameMatch[1],
                level: parseInt(levelMatch[1]),
                school: schoolMatch ? schoolMatch[1] : "",
                desc: obj.toLowerCase(),
                tags: []
            });
        }
    }
}

function findBestMatches(regex: RegExp, limitPerLevel: number = 2) {
    const matches: Record<number, string[]> = {1: [], 2: [], 3: [], 4: [], 5: []};
    
    // Sort by name for consistency
    const sortedSpells = allSpells.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const spell of sortedSpells) {
        if (spell.level >= 1 && spell.level <= 5 && matches[spell.level].length < limitPerLevel) {
            if (regex.test(spell.desc) || regex.test(spell.name.toLowerCase())) {
                // Avoid clearly wrong themes
                if (regex.source.includes('fire') && (spell.desc.includes('ice') || spell.desc.includes('frost') || spell.desc.includes('water'))) continue;
                if (regex.source.includes('lightning') && (spell.desc.includes('fire') || spell.desc.includes('flame'))) continue;
                
                matches[spell.level].push(spell.name);
            }
        }
    }
    return matches;
}

function formatList(name: string, matches: Record<number, string[]>) {
    console.log(`\n### ${name}`);
    for (let i = 1; i <= 5; i++) {
        console.log(`- **Level ${i}:** ${matches[i].join(', ') || 'None'}`);
    }
}

formatList("Radiance Mandate (Light / Fire)", findBestMatches(/fire|flame|burn|scorch|ignite|radiant|sunburst|corona/));
formatList("Storm Mandate (Lightning / Thunder)", findBestMatches(/lightning|thunder|storm|tempest|shock|bolt/));
formatList("Knowledge Mandate (Divination / Mind)", findBestMatches(/identify|comprehend|detect|scry|mind|truth|knowledge|memory/));
formatList("Radiant Vessel / Absolute Spark (Healing)", findBestMatches(/heal|cure|mend|revive|restore|vitality/));
formatList("Biome Architect (Nature / Earth)", findBestMatches(/stone|earth|plant|vine|tree|nature|thorn|root/));
formatList("Infernal Conduit (Hellfire / Demonic)", findBestMatches(/demon|fiend|hell|abyssal|fire|flame/));
formatList("Void Whisperer (Mind / Tentacles / Aberrant)", findBestMatches(/whisper|tentacle|mind|madness|insanity|aberrant/));
formatList("Glamour Weaver (Fey / Charm / Illusion)", findBestMatches(/charm|fey|glamour|illusion|beauty|beguile/));
formatList("Absolute Devotion (Protection / Abjuration)", findBestMatches(/protect|shield|sanctuary|ward|aegis|defend/));
formatList("Retribution Mandate (Hunter / Vengeance)", findBestMatches(/hunt|track|vengeance|pursuit|mark|smite|retribution/));
