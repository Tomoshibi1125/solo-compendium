import * as fs from 'fs';
import * as path from 'path';

// Our zero-legacy default base that MUST exist on every item
const baseDefaults = {
    created_at: "2024-04-06",
    updated_at: "2024-04-06",
    source_kind: "Warden Authority",
    source_name: "Rift Compendium",
    theme_tags: [],
    generated_reason: "Direct Rift Extraction",
    discovery_lore: "Unearthed from the archives.",
    concentration: false,
    image: "/images/compendium/placeholder.webp",
    image_url: "/images/compendium/placeholder.webp",
    license_note: "Restricted",
    flavor: "A cold, absolute lattice pulse emanates from this object.",
    lore: {
        origin: "",
        history: "",
        curse: "",
        personality: "",
        current_owner: "",
        prior_owners: []
    },
    source: "Rift Ascendant Core",
    source_book: "Manual of Ascension",
    tags: [],
    system_interaction: "Standard",
    mechanics: {
        action_type: "",
        duration: "",
        save_dc: 0,
        damage_profile: "",
        range: "",
        lattice_interaction: "",
        type: "",
        frequency: "",
        action: "",
        ability: "",
        save: "",
        dc: 0,
        attack: { type: "", mode: "", resolution: "", modifier: "", damage: "1", damage_type: "none" },
        saving_throw: { ability: "", dc: 0, success: "", failure: "" },
        movement: "",
        condition: [],
        stat_bonuses: {},
        special_abilities: [],
        restrictions: [],
        progression: {},
        ac_formula: "",
        replaces_armor: false,
        detection_target: "",
        usage: "",
        check: "",
        scaling: "",
        critical: false,
        fumble: false,
        bonus: { type: "none", value: 0, ability: "", skills: [] },
        immunity: [],
        resistance: [],
        vulnerability: [],
        special: [],
        healing: { dice: "", type: "", bonus: 0 }
    },
    limitations: {
        uses: "",
        recharge: "",
        requires_attunement: false,
        conditions: [],
        charges: 0,
        uses_per_rest: 0,
        consumable: false,
        prerequisites: [],
        cost: 0
    },
    effects: {
        primary: "",
        secondary: "",
        tertiary: "",
        passive: [],
        active: [],
        primaryEffect: "",
        secondaryEffect: "",
        passiveBonuses: []
    },
    rarity: "common",
    cr: "0"
};

// Specialized defaults for category compliance
const anomalyDefaults = {
    damage_resistances: [],
    damage_immunities: [],
    damage_vulnerabilities: [],
    condition_immunities: [],
    senses: "None",
    languages: "None",
    traits: [],
    actions: [],
    legendary_actions: [],
    lair: { type: "none", range: 0, passive: false },
    abilities: [],
    weaknesses: [],
    xp: 0,
    treasure: { coin: 0, items: [] },
    environment: [],
    organization: "Solitary",
    alignment: "Unaligned",
    hp: 1,
    ac: 10,
    speed: "30 ft",
    size: "Medium",
    stats: {
        ability_scores: {
            strength: 10,
            agility: 10,
            vitality: 10,
            intelligence: 10,
            sense: 10,
            presence: 10
        },
        challenge_rating: 0,
        proficiency_bonus: 2,
        saving_throws: {}
    }
};

const pantheonDefaults = {
    avatar_id: "none-yet",
    rank: "Grand Deity",
    directive: "Absolute",
    portfolio: ["Unknown"],
    sigil: "Unknown",
    manifestation: "Unknown",
    specializations: [],
    dogma: [],
    worshippers: "None",
    temples: "None",
    home_realm: "The Rift",
    relationships: []
};

const relicDefaults = {
    type: "accessory",
    attunement: false,
    properties: [],
    stats: {},
    abilities: [],
    legendary_actions: []
};

const spellDefaults = {
    level: 0,
    rank: "D",
    school: "Evocation",
    casting_time: "1 action",
    range: "60 ft",
    components: { verbal: true, somatic: true, material: false, focus: "" },
    duration: "Instantaneous",
    concentration: false,
    ritual: false,
    effect: "",
    attack: { type: "ranged", ability: "Intelligence", damage: "1d10" },
    activation: { type: "action", cost: 1 },
    higher_levels: "",
    saving_throw: { ability: "", dc: 0, success: "", failure: "" },
    area: { type: "point", size: "small", shape: "sphere" },
    type: "spell"
};

// simple deep merge
function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target: any, source: any) {
    if (!source) return target;
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

const filesToProcess = [
    { path: './src/data/compendium/spells/rank-a.ts', type: 'spells', varName: 'spells_a', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-b.ts', type: 'spells', varName: 'spells_b', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-c.ts', type: 'spells', varName: 'spells_c', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-d.ts', type: 'spells', varName: 'spells_d', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-e.ts', type: 'spells', varName: 'spells_e', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-s.ts', type: 'spells', varName: 'spells_s', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/spells/rank-z.ts', type: 'spells', varName: 'spells_z', typeDef: 'CompendiumSpell' },
    { path: './src/data/compendium/anomalies/index.ts', type: 'anomalies', varName: 'anomalies_comprehensive', typeDef: 'CompendiumAnomaly' },
    { path: './src/data/compendium/pantheon.ts', type: 'pantheon', varName: 'PRIME_PANTHEON', typeDef: 'CompendiumDeity' },
    { path: './src/data/compendium/relics-comprehensive.ts', type: 'relics', varName: 'relics_comprehensive', typeDef: 'CompendiumRelic' },
    { path: './src/data/compendium/feats-comprehensive.ts', type: 'feats', varName: 'feats_comprehensive', typeDef: 'CompendiumFeat' },
    { path: './src/data/compendium/backgrounds.ts', type: 'backgrounds', varName: 'backgrounds_comprehensive', typeDef: 'CompendiumBackground' },
    { path: './src/data/compendium/locations.ts', type: 'locations', varName: 'locations_comprehensive', typeDef: 'CompendiumLocation' },
    { path: './src/data/compendium/conditions.ts', type: 'conditions', varName: 'conditions_comprehensive', typeDef: 'CompendiumCondition' },
    { path: './src/data/compendium/skills-comprehensive.ts', type: 'skills', varName: 'skills_comprehensive', typeDef: 'CompendiumSkill' },
    { path: './src/data/compendium/paths.ts', type: 'paths', varName: 'paths_comprehensive', typeDef: 'CompendiumPath' },
    { path: './src/data/compendium/techniques.ts', type: 'techniques', varName: 'techniques_comprehensive', typeDef: 'CompendiumTechnique' },
    { path: './src/data/compendium/jobs.ts', type: 'jobs', varName: 'jobs_comprehensive', typeDef: 'CompendiumJob' }
];

filesToProcess.forEach(fileMeta => {
    const fullPath = path.resolve(fileMeta.path);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Dynamically find ANY export const array matching the general pattern
    const regex = new RegExp(`export\\s+const\\s+(\\w+)\\s*(?::\\s*${fileMeta.typeDef}\\[\\])?\\s*=\\s*(\\[[\\s\\S]*?\\])(?:;\\s*$|;\\s*\\n|$)`, 'm');
    const match = content.match(regex);
    
    if (!match) {
        console.warn(`Could not find suitable array export in ${fileMeta.path}`);
        return;
    }

    const actualVarName = match[1];
    let arr;
    try {
        arr = eval(`(${match[2]})`);
    } catch(e) {
        console.error(`Failed to parse array in ${fileMeta.path}: ${e}`);
        return;
    }

    const updatedArr = arr.map((item: any) => {
        // Migration logic
        if (item.duration && typeof item.duration === 'object' && item.duration.type) item.duration = item.duration.type;
        if (item.range && typeof item.range === 'object' && item.range.type) {
            item.range = item.range.type + (item.range.distance ? ` ${item.range.distance}` : '');
        }

        let finalItem = mergeDeep(baseDefaults, item);

        // Category specific overrides
        if (fileMeta.type === 'anomalies') finalItem = mergeDeep(anomalyDefaults, finalItem);
        if (fileMeta.type === 'pantheon') finalItem = mergeDeep(pantheonDefaults, finalItem);
        if (fileMeta.type === 'relics') finalItem = mergeDeep(relicDefaults, finalItem);
        if (fileMeta.type === 'spells') finalItem = mergeDeep(spellDefaults, finalItem);

        // Branding cleanup
        if (finalItem.description) {
            finalItem.description = finalItem.description.replace(/sovereign/gi, 'Fusion').replace(/sovereignty/gi, 'Ascendancy');
        }

        return finalItem;
    });

    const newArrStr = JSON.stringify(updatedArr, null, '\t');

    // Header cleanup - calculate relative path to types
    const relativeDepth = fileMeta.path.split('/').length - 2; // ./src/data/...
    const upPrefix = '../'.repeat(relativeDepth);
    const importPath = `${upPrefix}types/compendium`.replace(/\/\//g, '/');

    const headerLines = [
        `import type { ${fileMeta.typeDef} } from "${importPath}";`,
        "",
        `export const ${actualVarName}: ${fileMeta.typeDef}[] = ${newArrStr};`
    ];

    fs.writeFileSync(fullPath, headerLines.join('\n'), 'utf8');
    console.log(`Purified and Fleshed out: ${fileMeta.path}`);
});
