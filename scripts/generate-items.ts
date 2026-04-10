import * as fs from "node:fs";
import * as path from "node:path";

const targetCount = 650;

const prefixes = [
	"Shadow",
	"Luminous",
	"Void",
	"System",
	"Abyssal",
	"Monarch's",
	"Astral",
	"Blood",
	"Iron",
	"Crystal",
	"Ethereal",
	"Nether",
	"Sovereign",
	"Echo",
	"Dread",
	"Celestial",
	"Null",
	"Nexus",
	"Chaos",
	"Order",
	"Rift",
	"Gate",
	"Aether",
	"Quantum",
	"Plasma",
	"Obsidian",
];
const weapons = [
	"Blade",
	"Sword",
	"Dagger",
	"Spear",
	"Bow",
	"Crossbow",
	"Staff",
	"Wand",
	"Hammer",
	"Axe",
	"Mace",
	"Scythe",
	"Gauntlets",
	"Whip",
	"Halberd",
	"Glaive",
];
const armor = [
	"Plate",
	"Mail",
	"Leather",
	"Robes",
	"Shield",
	"Buckler",
	"Helm",
	"Greaves",
	"Gauntlets",
	"Mantle",
];
const ringsAmus = [
	"Ring",
	"Amulet",
	"Pendant",
	"Signet",
	"Band",
	"Necklace",
	"Choker",
];
const wondrous = [
	"Orb",
	"Cube",
	"Tome",
	"Grimoire",
	"Lens",
	"Prism",
	"Crown",
	"Cloak",
	"Boots",
	"Belt",
];
const suffixes = [
	"of the Void",
	"of the Monarch",
	"of Blood",
	"of Shadows",
	"of the System",
	"of Annihilation",
	"of the Stars",
	"of Eternity",
	"of Time",
	"of Space",
	"of Silence",
	"of the Abyss",
	"of the Dragon",
	"of the Phoenix",
	"of the Demon",
	"of the Angel",
];

const rarities = ["common", "uncommon", "rare", "epic", "legendary"];

// Lore Fragments
const originStories = [
	"Forged in the heart of a collapsing C-Rank dimensional rift.",
	"A manifestation of pure Arcane authority, designed to bypass mortal limitations.",
	"Translated from an ancient Monarch's combat stance during the First Awakening.",
	"Salvaged by an S-Rank hunter from the depths of the Abyssal gates.",
	"An anomaly in the local mana distribution network, crystallized over decades.",
	"Refined from the crystallized essence of a fallen Regent of the Void.",
	"A tactical asset optimized for modern urban awakening zones by rogue engineers.",
	"Developed by top Guild researchers studying concentrated void energy.",
];

const weaponMechanicsMap: Record<string, { dmg: string; prop: string }> = {
	Blade: { dmg: "1d8 slashing", prop: "finesse, light" },
	Sword: { dmg: "1d8 slashing", prop: "versatile (1d10)" },
	Dagger: { dmg: "1d4 piercing", prop: "finesse, light, thrown (range 20/60)" },
	Spear: { dmg: "1d6 piercing", prop: "thrown (range 20/60), versatile (1d8)" },
	Bow: {
		dmg: "1d8 piercing",
		prop: "ammunition (range 150/600), heavy, two-handed",
	},
	Crossbow: {
		dmg: "1d10 piercing",
		prop: "ammunition (range 100/400), heavy, loading, two-handed",
	},
	Staff: { dmg: "1d6 bludgeoning", prop: "versatile (1d8), spell focus" },
	Wand: { dmg: "1d4 bludgeoning", prop: "spell focus, light" },
	Hammer: { dmg: "2d6 bludgeoning", prop: "heavy, two-handed" },
	Axe: { dmg: "1d8 slashing", prop: "versatile (1d10)" },
	Mace: { dmg: "1d6 bludgeoning", prop: "" },
	Scythe: { dmg: "2d4 slashing", prop: "reach, two-handed" },
	Gauntlets: { dmg: "1d4 bludgeoning", prop: "finesse, unarmed strike focus" },
	Whip: { dmg: "1d4 slashing", prop: "finesse, reach" },
	Halberd: { dmg: "1d10 slashing", prop: "heavy, reach, two-handed" },
	Glaive: { dmg: "1d10 slashing", prop: "heavy, reach, two-handed" },
};

const armorMechanicsMap: Record<string, { ac: string; prop: string }> = {
	Plate: { ac: "18", prop: "Disadvantage on Stealth. Str 15 required." },
	Mail: { ac: "16", prop: "Disadvantage on Stealth. Str 13 required." },
	Leather: { ac: "11 + Dex modifier", prop: "Light armor." },
	Robes: {
		ac: "10 + Dex modifier",
		prop: "Unarmored defense. Mana flow increased.",
	},
	Shield: { ac: "+2", prop: "Requires 1 hand." },
	Buckler: { ac: "+1", prop: "Leaves hand free for somatic components." },
	Helm: { ac: "None", prop: "Grants resistance to psychic damage." },
	Greaves: { ac: "None", prop: "Increases movement speed by 5ft." },
	Gauntlets: { ac: "None", prop: "Prevents disarming." },
	Mantle: {
		ac: "None",
		prop: "Advantage on saving throws against environmental hazards.",
	},
};

const buffs = [
	"resistance to necrotic damage",
	"resistance to fire damage",
	"advantage on saving throws against illusions",
	"+1 bonus to attack and damage rolls",
	"+2 bonus to attack and damage rolls",
	"+1 bonus to AC",
	"darkvision out to 60 feet",
	"immunity to the frightened condition",
	"advantage on Initiative rolls",
	"the ability to sense nearby rifts within 1 mile",
];

function randomArray(arr: string[]): string {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateNameAndType(): {
	name: string;
	type: string;
	rarity: string;
	base: string;
} {
	const typeRoll = Math.random();
	let type = "",
		name = "",
		base = "";
	if (typeRoll < 0.4) {
		type = "weapon";
		base = randomArray(weapons);
	} else if (typeRoll < 0.7) {
		type = "armor";
		base = randomArray(armor);
	} else if (typeRoll < 0.85) {
		type = Math.random() < 0.5 ? "ring" : "amulet";
		base = randomArray(ringsAmus);
	} else {
		type = "wondrous";
		base = randomArray(wondrous);
	}

	name = `${randomArray(prefixes)} ${base} ${randomArray(suffixes)}`;
	return { name, type, rarity: randomArray(rarities), base };
}

function generateDetailedDescription(
	_name: string,
	type: string,
	base: string,
	rarity: string,
): string {
	let desc = `${randomArray(originStories)} `;

	if (type === "weapon") {
		const mech = weaponMechanicsMap[base] || { dmg: "1d6", prop: "" };
		desc += `This weapon hits with brutal kinetic force dealing **${mech.dmg}** damage. Properties: *${mech.prop}*. `;
	} else if (type === "armor") {
		const mech = armorMechanicsMap[base] || { ac: "+1", prop: "" };
		desc += `This defensive gear provides Base AC/Bonus: **${mech.ac}**. Properties: *${mech.prop}*. `;
	} else {
		desc += `When equipped, the wearer feels an immediate surge of wild Mana integrating into their body. `;
	}

	desc += `As a ${rarity} artifact, Guilds have cataloged it as highly valuable for Hunters facing high-rank dungeon threats.`;
	return desc;
}

interface ActiveAbility {
	name: string;
	description: string;
	action: string;
	frequency: string;
}
interface ItemEffect {
	passive: string[];
	active?: ActiveAbility[];
}

function generateEffect(rarity: string, _type: string): ItemEffect {
	const passiveCount =
		rarity === "common"
			? 1
			: rarity === "uncommon"
				? 1
				: rarity === "rare"
					? 2
					: rarity === "epic"
						? 3
						: 4;
	const passives: string[] = [];

	for (let i = 0; i < passiveCount; i++) {
		passives.push(`Passive Benefit: Grants ${randomArray(buffs)}.`);
	}

	const effect: ItemEffect = { passive: passives };
	if (Math.random() > 0.5 && rarity !== "common") {
		const cost =
			rarity === "uncommon"
				? "10 Mana"
				: rarity === "rare"
					? "25 Mana"
					: "50 Mana";
		effect.active = [
			{
				name: "Arcane Overchannel",
				description: `Expend ${cost} to unleash a violent burst of stored dimensional energy. Target must succeed on a DC ${12 + (rarity === "legendary" ? 6 : rarity === "epic" ? 4 : 2)} saving throw or be stunned until the end of its next turn.`,
				action: "action",
				frequency: "once-per-day",
			},
		];
	}
	return effect;
}

interface GeneratedItem {
	id: string;
	name: string;
	description: string;
	rarity: string;
	type: string;
	image: string;
	effects: ItemEffect;
	attunement: boolean;
	weight: number;
	value: number;
	source: string;
	lore: string;
}

const items: GeneratedItem[] = [];
const namesSet = new Set<string>();
let idCounter = 1;

while (items.length < targetCount) {
	const { name, type, rarity, base } = generateNameAndType();

	// Ensure uniqueness
	if (!namesSet.has(name)) {
		namesSet.add(name);

		const item = {
			id: `sys-exp-item-${String(idCounter).padStart(4, "0")}`,
			name,
			description: generateDetailedDescription(name, type, base, rarity),
			rarity,
			type,
			image: `/generated/compendium/items/sys-item-${String(Math.floor(Math.random() * 20) + 1).padStart(4, "0")}.webp`,
			effects: generateEffect(rarity, type),
			attunement:
				rarity === "epic" || rarity === "legendary" || Math.random() > 0.5,
			weight: Math.floor(Math.random() * 10) + 1,
			value:
				(rarity === "common"
					? 50
					: rarity === "uncommon"
						? 200
						: rarity === "rare"
							? 1000
							: rarity === "epic"
								? 5000
								: 20000) + Math.floor(Math.random() * 100),
			source: "System Ascendant Expansion",
			lore: `Registered by the System post-Awakening.`,
		};
		items.push(item);
		idCounter++;
	}
}

// Split into parts (e.g. part 6, 7, 8)
const chunkSize = 200;
let partNum = 6;

for (let i = 0; i < items.length; i += chunkSize) {
	const chunk = items.slice(i, i + chunkSize);
	const jsonStr = JSON.stringify(chunk, null, "\t").replace(
		/"([^"]+)":/g,
		"$1:",
	);

	const content = `// Items Compendium - Part ${partNum}: Mass Expansion\n// Auto-generated detailed System Ascendant items perfectly adhering to 5e rules\n\nexport const items = ${jsonStr};\n`;
	const filename = `items-part${partNum}.ts`;
	fs.writeFileSync(
		path.join(process.cwd(), "src", "data", "compendium", filename),
		content,
	);
	console.log(`Generated ${filename} with ${chunk.length} items.`);
	partNum++;
}

console.log(
	"Successfully overhauled and generated",
	items.length,
	"high-detail items.",
);
