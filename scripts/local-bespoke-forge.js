import * as fs from 'fs';
import * as path from 'path';
// Loaders
import { comprehensiveFeats } from '../src/data/compendium/feats-comprehensive';
import { powers } from '../src/data/compendium/powers';
import { techniques } from '../src/data/compendium/techniques';
import { spells_a } from '../src/data/compendium/spells/rank-a';
import { spells_b } from '../src/data/compendium/spells/rank-b';
import { spells_c } from '../src/data/compendium/spells/rank-c';
import { spells_d } from '../src/data/compendium/spells/rank-d';
import { spells_s } from '../src/data/compendium/spells/rank-s';
import { runes_power_powers } from '../src/data/compendium/runes/power-powers';
import { technique_runes } from '../src/data/compendium/runes/technique-techniques';
import { runes_a } from '../src/data/compendium/runes/spell-rank-a';
import { runes_b } from '../src/data/compendium/runes/spell-rank-b';
import { runes_c } from '../src/data/compendium/runes/spell-rank-c';
import { spell_rank_d_runes } from '../src/data/compendium/runes/spell-rank-d';
import { runes_s } from '../src/data/compendium/runes/spell-rank-s';
function titleCase(str) {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' ');
}
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
const origins = [
    "Forged by the Ascendant Bureau in secret.",
    "Uncovered in an S-Rank Red Gate in Siberia.",
    "Passed down by a forgotten Guild Master.",
    "Extracted from a slain Beast-Class anomaly.",
    "Developed by the Academy of High Magic.",
    "A relic of the Shadow Legion."
];
const dmgD = ["1d10", "2d6", "3d4", "1d8 + 2", "1d12"];
const dmgC = ["3d8", "4d6", "2d12", "5d4", "2d10 + 4"];
const dmgB = ["6d8", "5d10", "4d12", "8d6", "10d4"];
const dmgA = ["8d10", "10d8", "6d12", "12d6", "8d12"];
const dmgS = ["12d12", "14d10", "20d8", "15d12", "20d12"];
const conditions = ["Blinded", "Frightened", "Stunned", "Prone", "Restrained", "Incapacitated", "Deafened"];
const shapes = ["Self", "30-foot cone", "60-foot line", "120 feet", "Touch", "20-foot radius burst", "60 feet", "Sight"];
const nounBank = ["Strike", "Aura", "Resonance", "Pulse", "Weave", "Will", "Command", "Ascension", "Mantle"];
const adjBank = ["Sovereign", "Abyssal", "Radiant", "Shadow", "Crimson", "Phantom", "Ethereal", "Unbroken"];
function generateCustomName() {
    return `${rand(adjBank)} ${rand(nounBank)}`;
}
const flavors = [
    "A testament to raw magical superiority.",
    "When words fail, this speaks.",
    "The Bureau tried to ban this. They failed.",
    "A technique born in the bloody depths of a Red Gate.",
    "Elegant. Lethal. Absolute.",
    "The world itself shudders.",
    "An ancient secret reclaimed from the dust.",
    "The manifestation of true Hunter authority."
];
const ranges = ["Self", "30 feet", "60 feet", "120 feet", "Touch", "15-foot cone", "30-foot line"];
const saves = ["Strength", "Agility", "Vitality", "Intelligence", "Sense", "Presence"];
function generateMechanics(rankType, isCombat) {
    let dmgStr = "none";
    let dc = 12;
    const condition = rand(conditions);
    const shape = rand(shapes);
    if (isCombat) {
        if (rankType === 'D') {
            dmgStr = rand(dmgD);
            dc = 12;
        }
        else if (rankType === 'C') {
            dmgStr = rand(dmgC);
            dc = 14;
        }
        else if (rankType === 'B') {
            dmgStr = rand(dmgB);
            dc = 16;
        }
        else if (rankType === 'A') {
            dmgStr = rand(dmgA);
            dc = 18;
        }
        else if (rankType === 'S') {
            dmgStr = rand(dmgS);
            dc = 22;
        }
        // Default tier mapping for unnamed
        if (rankType === 'power' || rankType === 'technique' || rankType === 'feat') {
            dmgStr = rand(dmgC);
            dc = 15;
        }
    }
    return {
        dmgs: dmgStr,
        dc: dc,
        range: shape,
        save: rand(saves),
        cond: `and is ${condition}`
    };
}
function processArray(dataOrigin, type, rankOrType, isSpell, isCombat) {
    return dataOrigin.map((old, index) => {
        const id = old.id || `gen_id_${index}`;
        // Overwrite the generic template names mostly, but keep original if it wasn't overly generic
        let baseName = old.name && old.name.length > 3 ? old.name : generateCustomName();
        if (baseName.includes("Generic") || baseName.includes("Placeholder"))
            baseName = generateCustomName();
        // Let's create a beautiful generic lore
        const lore = {
            origin: rand(origins),
            history: "Recorded in the darkest archives of the Hunter Guilds.",
            curse: "Strains the core of those who channel it too frequently.",
            personality: "Silent, hungry.",
            current_owner: "Known only to an elite few.",
            prior_owners: ["A dead Guild Master", "The First Ascendant"]
        };
        const mec = generateMechanics(rankOrType, isCombat);
        const desc = isCombat ?
            `Unleashes a surge of magical power dealing ${mec.dmgs} damage. Targets must succeed on a DC ${mec.dc} ${mec.save} saving throw or suffer its full effects ${mec.cond}.` :
            `A subtle manipulation of the magical weave, granting immense utility and control over the environment.`;
        const effects = {
            primary: isCombat ? `Deals ${mec.dmgs} damage.` : `Grants utility scaling with the user's level.`,
            secondary: isCombat ? `On failure, the target is ${mec.cond.split(' ')[2]}.` : "Applies a lingering magical pressure to the area."
        };
        // Construct exactly based on compendium.ts types
        let res = {
            id: id,
            name: baseName,
            display_name: baseName,
            description: desc,
            lore: lore,
            flavor: rand(flavors),
            tags: ["awakened", "magic", rankOrType],
            rarity: rankOrType === 'S' || rankOrType === 'A' ? "legendary" : "rare",
            source_book: "Ascendant Core Rulebook",
            effects: effects
        };
        if (type === 'CompendiumSpell') {
            res.level = rankOrType === 'S' ? 9 : rankOrType === 'A' ? 7 : rankOrType === 'B' ? 5 : rankOrType === 'C' ? 3 : 1;
            res.school = "Evocation";
            res.casting_time = "1 action";
            res.range = mec.range;
            res.duration = "Instantaneous";
            res.components = { verbal: true, somatic: true, material: false };
            res.concentration = false;
            res.ritual = false;
            res.rank = rankOrType.toUpperCase();
            res.attack = { type: "spell", ability: "Intelligence", damage: mec.dmgs };
            res.saving_throw = { ability: mec.save, dc: mec.dc, success: "Half damage", failure: "Full damage" };
        }
        else if (type === 'CompendiumPower') {
            res.power_type = "Innate";
            res.power_level = 3;
            res.casting_time = "1 action";
            res.range = mec.range;
            res.duration = "Instantaneous";
            res.concentration = false;
            res.ritual = false;
            res.school = "Transmutation";
            res.damage_roll = mec.dmgs;
            res.damage_type = "force";
            res.mechanics = {
                action_type: "Action",
                duration: "Instant",
                damage_profile: mec.dmgs,
                range: mec.range
            };
            res.limitations = {
                uses: "3/long rest",
                recharge: "long rest",
                requires_attunement: false,
                conditions: ["Must be conscious"]
            };
        }
        else if (type === 'CompendiumTechnique') {
            res.type = "Combat Arts";
            res.style = "Guild Vanguard";
            res.level_requirement = 5;
            res.activation = { type: "action", cost: "1 Stamina" };
            res.range = mec.range;
            res.duration = "Instantaneous";
            res.mechanics = {
                action_type: "Action",
                duration: "Instant",
                damage_profile: mec.dmgs,
                range: mec.range
            };
            res.limitations = {
                uses: "Unlimited as long as Stamina permits",
                recharge: "Short Rest",
                requires_attunement: false,
                conditions: ["Requires a melee weapon"]
            };
        }
        else if (type === 'CompendiumFeat') {
            res.prerequisites = ["Level 4 Hunter"];
            res.repeatable = false;
            res.mechanics = {
                action_type: "Passive",
                duration: "Permanent",
                damage_profile: "N/A",
                range: "Self"
            };
            res.limitations = {
                uses: "Permanent",
                recharge: "N/A",
                requires_attunement: false,
                conditions: []
            };
        }
        else if (type === 'CompendiumRune') {
            res.effect_description = desc;
            res.rune_type = "Socketable";
            res.effect_type = "active";
            res.activation_action = "Action";
            res.activation_cost = "Mana";
            res.activation_cost_amount = 1;
            res.duration = "Instantaneous";
            res.range = mec.range;
            res.concentration = false;
            res.rune_level = 5;
            res.rank = rankOrType.toUpperCase();
            res.mechanics = {
                action_type: "Action",
                duration: "Instant",
                damage_profile: mec.dmgs,
                range: mec.range
            };
            res.limitations = {
                uses: "1/long rest",
                recharge: "long rest",
                requires_attunement: false,
                conditions: []
            };
        }
        return res;
    });
}
function dump(filename, exportName, typeName, importPathStr, arr) {
    const full = path.resolve(process.cwd(), filename);
    let c = `import type { ${typeName} } from "${importPathStr}";\n\n`;
    c += `export const ${exportName}: ${typeName}[] = [\n`;
    const s = arr.map(a => '\t' + JSON.stringify(a, null, '\t').split('\n').join('\n\t')).join(',\n');
    c += s + '\n];\n';
    fs.writeFileSync(full, c, 'utf8');
    console.log(`Saved ${filename} [${arr.length} items]`);
}
dump('src/data/compendium/feats-comprehensive.ts', 'comprehensiveFeats', 'CompendiumFeat', '../../types/compendium', processArray(comprehensiveFeats, 'CompendiumFeat', 'feat', false, false));
dump('src/data/compendium/powers.ts', 'powers', 'CompendiumPower', '../../types/compendium', processArray(powers, 'CompendiumPower', 'power', false, true));
dump('src/data/compendium/techniques.ts', 'techniques', 'CompendiumTechnique', '../../types/compendium', processArray(techniques, 'CompendiumTechnique', 'technique', false, true));
dump('src/data/compendium/spells/rank-s.ts', 'spells_s', 'CompendiumSpell', '../../../types/compendium', processArray(spells_s, 'CompendiumSpell', 'S', true, true));
dump('src/data/compendium/spells/rank-a.ts', 'spells_a', 'CompendiumSpell', '../../../types/compendium', processArray(spells_a, 'CompendiumSpell', 'A', true, true));
dump('src/data/compendium/spells/rank-b.ts', 'spells_b', 'CompendiumSpell', '../../../types/compendium', processArray(spells_b, 'CompendiumSpell', 'B', true, true));
dump('src/data/compendium/spells/rank-c.ts', 'spells_c', 'CompendiumSpell', '../../../types/compendium', processArray(spells_c, 'CompendiumSpell', 'C', true, true));
dump('src/data/compendium/spells/rank-d.ts', 'spells_d', 'CompendiumSpell', '../../../types/compendium', processArray(spells_d, 'CompendiumSpell', 'D', true, true));
dump('src/data/compendium/runes/spell-rank-s.ts', 'runes_s', 'CompendiumRune', '../../../types/compendium', processArray(runes_s, 'CompendiumRune', 'S', false, true));
dump('src/data/compendium/runes/spell-rank-a.ts', 'runes_a', 'CompendiumRune', '../../../types/compendium', processArray(runes_a, 'CompendiumRune', 'A', false, true));
dump('src/data/compendium/runes/spell-rank-b.ts', 'runes_b', 'CompendiumRune', '../../../types/compendium', processArray(runes_b, 'CompendiumRune', 'B', false, true));
dump('src/data/compendium/runes/spell-rank-c.ts', 'runes_c', 'CompendiumRune', '../../../types/compendium', processArray(runes_c, 'CompendiumRune', 'C', false, true));
dump('src/data/compendium/runes/spell-rank-d.ts', 'spell_rank_d_runes', 'CompendiumRune', '../../../types/compendium', processArray(spell_rank_d_runes, 'CompendiumRune', 'D', false, true));
dump('src/data/compendium/runes/power-powers.ts', 'runes_power_powers', 'CompendiumRune', '../../../types/compendium', processArray(runes_power_powers, 'CompendiumRune', 'power', false, true));
dump('src/data/compendium/runes/technique-techniques.ts', 'technique_runes', 'CompendiumRune', '../../../types/compendium', processArray(technique_runes, 'CompendiumRune', 'technique', false, true));
