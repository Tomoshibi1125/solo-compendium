/**
 * Item Enrichment Script
 * Reads items-part1 through items-part5, detects stub entries (missing properties/weight),
 * and enriches them with full SRD-quality data.
 *
 * Usage: node scripts/enrich-items.mjs
 */

import fs from "node:fs";
import path from "node:path";

const PARTS = [
	"items-part1.ts",
	"items-part2.ts",
	"items-part3.ts",
	"items-part4.ts",
	"items-part5.ts",
];
const BASE = path.resolve("src/data/compendium");

function parseItemsFile(filePath) {
	const raw = fs.readFileSync(filePath, "utf8");
	const headerEnd = raw.indexOf("export const items");
	const header = raw.slice(0, headerEnd);
	const arrayStart = raw.indexOf("[", headerEnd);
	const arrayBody = raw.slice(arrayStart + 1);

	const entries = [];
	let depth = 0,
		current = "",
		inString = false,
		escape = false;

	for (let i = 0; i < arrayBody.length; i++) {
		const ch = arrayBody[i];
		if (escape) {
			current += ch;
			escape = false;
			continue;
		}
		if (ch === "\\") {
			current += ch;
			escape = true;
			continue;
		}
		if (ch === '"') {
			inString = !inString;
			current += ch;
			continue;
		}
		if (inString) {
			current += ch;
			continue;
		}
		if (ch === "{") {
			if (depth === 0) current = "{";
			else current += ch;
			depth++;
		} else if (ch === "}") {
			depth--;
			current += ch;
			if (depth === 0) {
				try {
					entries.push(
						JSON.parse(current.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]")),
					);
				} catch {}
				current = "";
			}
		} else if (depth > 0) current += ch;
	}
	return { header, entries };
}

// ── Item enrichment logic ───────────────────────────────────────────────

const WEAPON_DATA = {
	sword: { damage: "1d8", damageType: "slashing", weight: 3 },
	longsword: {
		damage: "1d8",
		damageType: "slashing",
		versatile: "1d10",
		weight: 3,
	},
	shortsword: {
		damage: "1d6",
		damageType: "piercing",
		finesse: true,
		weight: 2,
	},
	greatsword: { damage: "2d6", damageType: "slashing", weight: 6 },
	dagger: { damage: "1d4", damageType: "piercing", finesse: true, weight: 1 },
	axe: { damage: "1d8", damageType: "slashing", weight: 4 },
	greataxe: { damage: "1d12", damageType: "slashing", weight: 7 },
	mace: { damage: "1d6", damageType: "bludgeoning", weight: 4 },
	hammer: { damage: "1d8", damageType: "bludgeoning", weight: 5 },
	spear: { damage: "1d6", damageType: "piercing", versatile: "1d8", weight: 3 },
	bow: { damage: "1d8", damageType: "piercing", range: 150, weight: 2 },
	crossbow: { damage: "1d10", damageType: "piercing", range: 100, weight: 6 },
	staff: {
		damage: "1d6",
		damageType: "bludgeoning",
		versatile: "1d8",
		weight: 4,
	},
	wand: { damage: "1d4", damageType: "force", range: 60, weight: 1 },
	blade: { damage: "1d8", damageType: "slashing", weight: 3 },
	rapier: { damage: "1d8", damageType: "piercing", finesse: true, weight: 2 },
	scythe: { damage: "1d10", damageType: "slashing", weight: 5 },
	whip: { damage: "1d4", damageType: "slashing", finesse: true, weight: 2 },
	trident: {
		damage: "1d6",
		damageType: "piercing",
		versatile: "1d8",
		weight: 4,
	},
	glaive: { damage: "1d10", damageType: "slashing", weight: 6 },
};

const ARMOR_DATA = {
	light: { ac: 11, weight: 8, type: "light" },
	medium: { ac: 14, weight: 20, type: "medium" },
	heavy: { ac: 16, weight: 45, type: "heavy" },
	shield: { ac: 2, weight: 6, type: "shield" },
	robe: { ac: 11, weight: 4, type: "light" },
	plate: { ac: 18, weight: 65, type: "heavy" },
	chain: { ac: 16, weight: 55, type: "heavy" },
	leather: { ac: 11, weight: 10, type: "light" },
	scale: { ac: 14, weight: 45, type: "medium" },
	hide: { ac: 12, weight: 12, type: "medium" },
};

const RARITY_BONUS = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 3 };
const RARITY_VALUE = {
	common: 50,
	uncommon: 500,
	rare: 5000,
	epic: 25000,
	legendary: 50000,
};
const RARITY_WEIGHT_MULT = {
	common: 1,
	uncommon: 1,
	rare: 0.9,
	epic: 0.8,
	legendary: 0.7,
};

function getWeaponBase(name) {
	const lower = name.toLowerCase();
	for (const [key, data] of Object.entries(WEAPON_DATA)) {
		if (lower.includes(key)) return data;
	}
	return WEAPON_DATA.sword; // default
}

function getArmorBase(name) {
	const lower = name.toLowerCase();
	for (const [key, data] of Object.entries(ARMOR_DATA)) {
		if (lower.includes(key)) return data;
	}
	return ARMOR_DATA.medium; // default
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

const ELEMENTS = [
	"fire",
	"ice",
	"lightning",
	"necrotic",
	"radiant",
	"force",
	"psychic",
	"thunder",
	"poison",
	"acid",
];
const EFFECTS_WEAPON = [
	"Glows faintly when enemies are within 60 feet",
	"Deals an extra 1d6 elemental damage on a critical hit",
	"You gain +1 to initiative while carrying this weapon",
	"Once per day, the weapon can cast a cantrip-level effect",
	"The weapon returns to your hand when thrown (range 20/60)",
];
const EFFECTS_ARMOR = [
	"Grants advantage on saving throws against one damage type",
	"Reduces damage from critical hits by your proficiency bonus",
	"You can cast Shield once per long rest while wearing this armor",
	"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
	"Grants resistance to one elemental damage type while attuned",
];
const EFFECTS_CONSUMABLE = [
	"Restores 2d4+2 hit points when consumed",
	"Grants advantage on ability checks for 1 hour",
	"Removes one condition affecting the user",
	"Grants temporary hit points equal to your level for 1 hour",
	"Allows the user to see invisible creatures for 10 minutes",
];
const EFFECTS_ACCESSORY = [
	"Grants +1 to one ability score while attuned",
	"You can cast Detect Magic at will while wearing this",
	"Grants darkvision 60 feet if you don't already have it",
	"You gain proficiency in one saving throw while attuned",
	"Once per day, reroll a failed saving throw",
];

function enrichItem(item) {
	const bonus = RARITY_BONUS[item.rarity] || 0;
	const baseValue = RARITY_VALUE[item.rarity] || 100;
	const weightMult = RARITY_WEIGHT_MULT[item.rarity] || 1;

	// Ensure weight exists
	if (!item.weight && item.weight !== 0) {
		if (item.type === "weapon")
			item.weight = Math.round(
				(getWeaponBase(item.name).weight || 3) * weightMult,
			);
		else if (item.type === "armor")
			item.weight = Math.round(
				(getArmorBase(item.name).weight || 20) * weightMult,
			);
		else if (item.type === "consumable") item.weight = 0.5;
		else if (item.type === "scroll") item.weight = 0.1;
		else item.weight = 1;
	}

	// Ensure value exists and is reasonable
	if (!item.value || item.value < 1) {
		item.value = baseValue + Math.floor(Math.random() * baseValue * 0.5);
	}

	// Add properties if missing for weapons
	if (item.type === "weapon" && !item.properties?.weapon) {
		const base = getWeaponBase(item.name);
		const dmgDice = base.damage.replace(/\d+d/, (m) => {
			const sides = parseInt(m);
			return m; // keep base dice, add bonus
		});
		item.properties = {
			...item.properties,
			weapon: {
				damage: bonus > 0 ? `${base.damage} + ${bonus}` : base.damage,
				damageType: base.damageType,
				...(base.range ? { range: base.range } : {}),
				...(base.versatile
					? {
							versatile:
								bonus > 0 ? `${base.versatile} + ${bonus}` : base.versatile,
						}
					: {}),
				...(base.finesse ? { finesse: true } : {}),
			},
		};
		if (bonus > 0) {
			item.properties.magical = {
				...item.properties?.magical,
				bonus: { attack: bonus, damage: bonus },
			};
		}
	}

	// Add properties if missing for armor
	if (item.type === "armor" && !item.properties?.magical) {
		const base = getArmorBase(item.name);
		if (bonus > 0) {
			item.properties = {
				...item.properties,
				magical: {
					bonus: { armorClass: bonus },
				},
			};
		}
	}

	// Add effects if missing
	if (!item.effects || (!item.effects.passive && !item.effects.active)) {
		const effectPool =
			item.type === "weapon"
				? EFFECTS_WEAPON
				: item.type === "armor"
					? EFFECTS_ARMOR
					: item.type === "consumable"
						? EFFECTS_CONSUMABLE
						: EFFECTS_ACCESSORY;

		const numEffects = Math.min(bonus + 1, 3);
		const passiveEffects = [];
		const usedIndices = new Set();
		for (let i = 0; i < numEffects; i++) {
			let idx;
			do {
				idx = Math.floor(Math.random() * effectPool.length);
			} while (usedIndices.has(idx) && usedIndices.size < effectPool.length);
			usedIndices.add(idx);
			passiveEffects.push(effectPool[idx]);
		}

		item.effects = {
			...item.effects,
			passive: passiveEffects,
			value: item.value,
		};
	}

	// Add attunement for rare+ items if not set
	if (
		item.attunement === undefined &&
		["rare", "epic", "legendary"].includes(item.rarity)
	) {
		item.attunement = true;
	}

	// Add source if missing
	if (!item.source) {
		item.source = "System Ascendant Canon";
	}

	// Enrich description if it's a stub/generic
	if (
		item.description &&
		/legendary \w+ forged in the shadow realm/i.test(item.description)
	) {
		const element = pick(ELEMENTS);
		const adjectives = [
			"ancient",
			"enchanted",
			"cursed",
			"blessed",
			"awakened",
			"forged",
			"crafted",
			"imbued",
		];
		const origins = [
			"a fallen gate boss",
			"a master artificer",
			"the depths of an A-rank gate",
			"a forgotten dungeon",
			"a legendary hunter's collection",
		];
		item.description =
			`An ${pick(adjectives)} ${item.type} recovered from ${pick(origins)}. Infused with ${element} energy, it resonates with power when wielded by a worthy hunter. ${item.rarity === "legendary" ? "Only a handful exist in the known world." : ""}`.trim();
	}

	return item;
}

// ── Process each part file ──────────────────────────────────────────────
let totalEnriched = 0;

for (const partFile of PARTS) {
	const filePath = path.join(BASE, partFile);
	const { header, entries } = parseItemsFile(filePath);

	let enriched = 0;
	for (const item of entries) {
		const hadWeight = item.weight !== undefined;
		const hadProperties = item.properties?.weapon || item.properties?.magical;
		enrichItem(item);
		if (!hadWeight || !hadProperties) enriched++;
	}

	const output =
		header +
		"export const items: Item[] = [\n" +
		entries
			.map((e) => "  " + JSON.stringify(e, null, 2).split("\n").join("\n  "))
			.join(",\n") +
		"\n];\n";

	fs.writeFileSync(filePath, output, "utf8");
	console.log(`${partFile}: enriched ${enriched}/${entries.length} items`);
	totalEnriched += enriched;
}

console.log(
	`Total: enriched ${totalEnriched} items across ${PARTS.length} files`,
);
