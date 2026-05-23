import * as fs from 'fs';
import * as path from 'path';

const spellDir = 'src/data/compendium/spells';
const files = fs.readdirSync(spellDir).filter(f => f.endsWith('.ts'));

interface Spell {
    name: string;
    level: number;
    desc: string;
}

const allSpells: Spell[] = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(spellDir, file), 'utf-8');
    const objects = content.split('display_name:');
    for (let i = 1; i < objects.length; i++) {
        const obj = objects[i];
        
        const nameMatch = obj.match(/^\s*"([^"]+)"/);
        const levelMatch = obj.match(/level:\s*(\d+)/);
        
        if (nameMatch && levelMatch) {
            allSpells.push({
                name: nameMatch[1],
                level: parseInt(levelMatch[1]),
                desc: obj.toLowerCase()
            });
        }
    }
}

function findBestMatches(regex: RegExp, limitPerLevel: number = 2) {
    const matches: Record<number, string[]> = {1: [], 2: [], 3: [], 4: [], 5: []};
    const sortedSpells = allSpells.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const spell of sortedSpells) {
        if (spell.level >= 1 && spell.level <= 5 && matches[spell.level].length < limitPerLevel) {
            if (regex.test(spell.desc) || regex.test(spell.name.toLowerCase())) {
                matches[spell.level].push(spell.name);
            }
        }
    }
    return matches;
}

function generateGrant(jobName: string, pathName: string, regex: RegExp, sourceTokens: string[]) {
    const matches = findBestMatches(regex);
    const names = Object.values(matches).flat();
    if (names.length === 0) return "";
    
    return `	{
		jobName: "${jobName}",
		pathName: "${pathName}",
		level: 1,
		kind: "spell",
		sourceTokens: ${JSON.stringify(sourceTokens)},
		entryNames: [
${names.map(n => `			"${n}"`).join(',\n')}
		],
		progression: "base",
	},`;
}

let newGrants = "";

// Herald
newGrants += generateGrant("Herald", "Path of the Restoration Mandate", /heal|cure|mend|revive|restore|vitality|life|bless/, ["Herald"]);
newGrants += generateGrant("Herald", "Path of the Combat Mandate", /strike|weapon|war|battle|smite|shield|armor/, ["Herald", "Mage"]);
newGrants += generateGrant("Herald", "Path of the Triage Mandate", /death|grave|necrotic|false life|vampiric|decay|wither|doom/, ["Revenant"]);

// Summoner
newGrants += generateGrant("Summoner", "Path of the Dream Weaver", /dream|sleep|charm|fey|illusion|mind|peace/, ["Idol", "Esper"]);
newGrants += generateGrant("Summoner", "Path of the Pack Commander", /beast|pack|animal|summon|wolf|hunt/, ["Summoner"]);
newGrants += generateGrant("Summoner", "Path of the Symbiotic Host", /spore|poison|disease|decay|fungus|cloudkill/, ["Revenant", "Mage"]);
newGrants += generateGrant("Summoner", "Path of the Cosmic Conduit", /star|moon|sun|radiant|cosmic|divination|meteor/, ["Herald", "Mage"]);

// Contractor
newGrants += generateGrant("Contractor", "Path of the Cursed Blade", /blade|smite|shield|blur|weapon|strike|curse/, ["Mage", "Destroyer"]);
newGrants += generateGrant("Contractor", "Path of the Deep Dweller", /water|ocean|sea|cold|ice|tentacle|drown/, ["Mage"]);

// Esper
newGrants += generateGrant("Esper", "Path of the Aetheric Dragon", /dragon|fire|fly|breath|wing|elemental|scale/, ["Mage"]);
newGrants += generateGrant("Esper", "Path of the Void Resonance", /shadow|dark|blind|stealth|void|night|gloom/, ["Mage", "Revenant"]);
newGrants += generateGrant("Esper", "Path of the Tempest Core", /storm|thunder|lightning|wind|tempest|shock/, ["Mage"]);
newGrants += generateGrant("Esper", "Path of the Psionic Breach", /mind|psychic|telepath|telekinesis|charm|brain/, ["Esper"]);

// Revenant
newGrants += generateGrant("Revenant", "Path of the Void Lord", /fear|fright|terror|doom|undead|control/, ["Contractor", "Mage"]);
newGrants += generateGrant("Revenant", "Path of the Entropy Drinker", /blood|drain|vampire|life steal|siphon/, ["Revenant"]);
newGrants += generateGrant("Revenant", "Path of the Wither Guard", /blight|wither|decay|disease|rot|necrotic/, ["Revenant"]);
newGrants += generateGrant("Revenant", "Path of the Plague Weaver", /plague|poison|disease|contagion|sickness|toxic/, ["Revenant", "Summoner"]);

// Holy Knight
newGrants += generateGrant("Holy Knight", "Path of the Dominance Mandate", /fear|command|hold|conquest|dominate|crush/, ["Contractor", "Esper"]);
newGrants += generateGrant("Holy Knight", "Path of the Atonement Mandate", /peace|sanctuary|calm|sleep|protect|ward/, ["Herald"]);
newGrants += generateGrant("Holy Knight", "Path of the Exaltation Mandate", /glory|hero|enhance|haste|speed|brave|courage/, ["Herald", "Idol"]);

// Stalker
newGrants += generateGrant("Stalker", "Path of the Umbral Hunter", /shadow|dark|stealth|gloom|fear|hide|invisible/, ["Mage"]);
newGrants += generateGrant("Stalker", "Path of the Apex Slayer", /protect|zone|truth|banish|monster|slay|hunt/, ["Herald", "Mage"]);
newGrants += generateGrant("Stalker", "Path of the Hive Synchronist", /swarm|web|insect|bug|fly|gaseous/, ["Summoner", "Mage"]);

// Technomancer
newGrants += generateGrant("Technomancer", "Design: The Aether Vessel", /armor|shield|missile|thunder|shatter|construct/, ["Mage"]);
newGrants += generateGrant("Technomancer", "Design: Resonance Siege", /siege|blast|fire|wall|force|explosion|artillery/, ["Mage"]);
newGrants += generateGrant("Technomancer", "Design: Synchronist Binary", /hero|ward|bond|smite|vitality|construct|protect/, ["Herald"]);

fs.writeFileSync('missing_paths.ts', newGrants);
console.log("Generated script successfully.");
