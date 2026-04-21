import fs from "node:fs";
import path from "node:path";
// Helpers
const randomTitle = (prefixes, suffixes) => `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
// Generators
const WEAPON_PREFIXES = [
    "Aetheric",
    "Shattered",
    "Void",
    "Crimson",
    "Abyssal",
    "Starlight",
    "Obsidian",
    "Hunter's",
    "Guild-Issue",
    "Mana-Infused",
];
const WEAPON_SUFFIXES = [
    "Longsword",
    "Dagger",
    "Katana",
    "Gauntlets",
    "Halberd",
    "Revolver",
    "Sniper Rifle",
    "Spear",
    "Warhammer",
    "Whip",
];
const ARMOR_PREFIXES = [
    "Shadow",
    "Titanium",
    "Dragon-Scale",
    "Aegis",
    "Vanguard",
    "Phantom",
    "Gate-Forged",
    "Ceramic",
    "Nano-Weave",
    "Aether-Plated",
];
const ARMOR_SUFFIXES = [
    "Breastplate",
    "Trench Coat",
    "Combat Vest",
    "Exo-Suit",
    "Spaulders",
    "Shin Guards",
    "Tactical Helmet",
    "Bracers",
];
const CONSUMABLE_PREFIXES = [
    "High-Grade",
    "Lesser",
    "Greater",
    "Guild-Standard",
    "Black-Market",
    "Unstable",
    "Purified",
    "Concentrated",
];
const CONSUMABLE_SUFFIXES = [
    "Health Potion",
    "Mana Elixir",
    "Stamina Stim",
    "Aetheric Antidote",
    "Beast Repellent",
    "Liquid Shadow",
];
function generateItem(idPrefix, index) {
    const typeRand = Math.random();
    let name, desc, itemType, type, effect, rarity, damage;
    if (typeRand < 0.4) {
        name = randomTitle(WEAPON_PREFIXES, WEAPON_SUFFIXES);
        desc = `A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.`;
        itemType = "weapon";
        type = "weapon";
        effect = "+1 to attack rolls against beasts.";
        rarity = Math.random() > 0.8 ? "rare" : "uncommon";
        damage = Math.random() > 0.5 ? "1d8" : "1d10";
    }
    else if (typeRand < 0.7) {
        name = randomTitle(ARMOR_PREFIXES, ARMOR_SUFFIXES);
        desc = `Modern tactical armor laced with mana-reactive alloys for enhanced protection.`;
        itemType = "armor";
        type = "armor";
        effect = "Resistance to minor piercing damage.";
        rarity = Math.random() > 0.8 ? "rare" : "uncommon";
    }
    else {
        name = randomTitle(CONSUMABLE_PREFIXES, CONSUMABLE_SUFFIXES);
        desc = `A popular item among hunters venturing into E to C rank gates.`;
        itemType = "consumable";
        type = "consumable";
        effect = "Restores 2d4 + 2 HP or Mana.";
        rarity = "common";
    }
    return {
        id: `${idPrefix}_${index}`,
        name,
        description: desc,
        rarity: rarity,
        type: type,
        image: "",
        weight: Math.floor(Math.random() * 8) + 1,
        value: Math.floor(Math.random() * 500) + 10,
        item_type: itemType,
        source: "Rift Ascendant Canon",
        effects: { passive: [effect] },
        ...(damage
            ? { damage: damage, damage_type: "kinetic", weapon_type: "martial melee" }
            : {}),
        ...(itemType === "armor"
            ? { armor_type: "Medium", armor_class: "14 + Dex modifier (max 2)" }
            : {}),
    };
}
// Generate parts 2 through 9
for (let partNum = 2; partNum <= 9; partNum++) {
    const items = [];
    for (let i = 0; i < 50; i++) {
        items.push(generateItem(`item_p${partNum}`, i));
    }
    const content = `import type { Item } from "./items";

export const items_part${partNum}: Item[] = ${JSON.stringify(items, null, 2)};
`;
    fs.writeFileSync(path.join(process.cwd(), `src/data/compendium/items-part${partNum}.ts`), content);
    console.log(`Generated items-part${partNum}.ts (50 items)`);
}
// Generate Artifacts
const artifacts = [
    {
        id: "artifact_1",
        name: "Kamish's Wrath",
        display_name: "Kamish's Wrath",
        description: "A pair of twin daggers forged from the fang of humanity's greatest calamity. The blades vibrate with draconic malice.",
        rarity: "legendary",
        type: "weapon",
        image: "",
        weight: 2,
        value: 50000000,
        item_type: "weapon",
        weapon_type: "martial melee",
        damage: "3d6 + 5",
        damage_type: "slashing",
        simple_properties: ["light", "finesse", "thrown"],
        requires_attunement: true,
        source: "Rift Ascendant Canon",
        effects: {
            passive: [
                "Attacks ignore resistance to slashing damage.",
                "On critical hit, inflicts a bleeding condition that deals 1d6 damage per turn.",
            ],
        },
    },
    {
        id: "artifact_2",
        name: "Demon King's Longsword",
        display_name: "Demon King's Longsword",
        description: "A colossal dark blade that crackles with white lightning. Belonged to the sovereign of white flames.",
        rarity: "legendary",
        type: "weapon",
        image: "",
        weight: 15,
        value: 80000000,
        item_type: "weapon",
        weapon_type: "martial melee",
        damage: "2d10",
        damage_type: "slashing",
        simple_properties: ["heavy", "two-handed"],
        requires_attunement: true,
        source: "Rift Ascendant Canon",
        effects: {
            passive: [
                "Deals an additional 2d6 lightning damage.",
                "Grants resistance to fire and lightning damage.",
            ],
        },
    },
    {
        id: "artifact_3",
        name: "Shadow Monarch's Mantle",
        display_name: "Shadow Monarch's Mantle",
        description: "Woven from pure abyssal mana, this pitch-black cloak billows silently even when there is no wind.",
        rarity: "legendary",
        type: "armor",
        image: "",
        weight: 1,
        value: 100000000,
        item_type: "armor",
        armor_type: "Light",
        armor_class: "15 + Dex modifier",
        requires_attunement: true,
        source: "Rift Ascendant Canon",
        effects: {
            passive: [
                "Grants immunity to necrotic damage.",
                "Advantage on stealth checks in dim light or darkness.",
            ],
        },
    },
];
// Add some more procedurally generated artifacts
for (let i = 4; i <= 20; i++) {
    artifacts.push({
        id: `artifact_${i}`,
        name: randomTitle([
            "Monarch's",
            "Calamity",
            "Sovereign",
            "Abyssal",
            "World-Ender",
            "Origin",
        ], ["Core", "Edge", "Aegis", "Crown", "Reliquary"]),
        display_name: `Mythic Rank S Item`,
        description: "An artifact recovered from an S-Rank gate. Its power is beyond conventional measurement.",
        rarity: "legendary",
        type: i % 2 === 0 ? "weapon" : "armor",
        image: "",
        weight: Math.floor(Math.random() * 20) + 1,
        value: 10000000,
        item_type: i % 2 === 0 ? "weapon" : "armor",
        requires_attunement: true,
        source: "Rift Ascendant Canon",
        effects: { passive: ["Grants extraordinary supernatural abilities."] },
        ...(i % 2 === 0
            ? { weapon_type: "martial melee", damage: "3d8", damage_type: "force" }
            : { armor_type: "Heavy", armor_class: "20" }),
    });
}
const artifactContent = `import type { Item } from "./items";

export const artifacts: Item[] = ${JSON.stringify(artifacts, null, 2)};
`;
fs.writeFileSync(path.join(process.cwd(), "src/data/compendium/artifacts.ts"), artifactContent);
console.log("Generated artifacts.ts (20 artifacts)");
