import fs from "node:fs";
import path from "node:path";
import { anomalies as rawAnomalies } from "../src/data/compendium/anomalies";
import { spells as rawSpells } from "../src/data/compendium/spells";
import type {
	CompendiumAnomaly,
	CompendiumSpell,
} from "../src/types/compendium";

type SpellRank = "D" | "C" | "B" | "A" | "S";

type SpellInput = {
	id: string;
	name: string;
	description: string;
	type: "Attack" | "Defense" | "Utility" | "Healing";
	rank: SpellRank;
	image: string;
	effect: string;
	range?: number | { type?: string; value?: number; unit?: string };
};

type RawAnomalyStats = {
	ability_scores?: {
		strength?: number;
		agility?: number;
		vitality?: number;
		intelligence?: number;
		sense?: number;
		presence?: number;
	};
	armor_class?: number;
	hit_points?: number;
	challenge_rating?: number;
	proficiency_bonus?: number;
	saving_throws?: Record<string, number>;
	speed?: string | number;
};

type LegacyAnomaly = {
	id: string;
	name: string;
	type: string;
	rank: SpellRank;
	stats?: RawAnomalyStats;
	traits?: CompendiumAnomaly["traits"];
	actions?: Array<{
		name: string;
		description: string;
		type?: string;
		attack_bonus?: number;
		damage?: string;
		damage_type?: string;
		range?: number | string;
		recharge?: string;
		usage?: string;
	}>;
	legendary?: CompendiumAnomaly["legendary_actions"];
	lair?: CompendiumAnomaly["lair"];
	image: string;
	description: string;
	abilities: string[];
	weaknesses: string[];
	hp?: number;
	ac?: number;
	skills?: Record<string, string | number>;
	damageResistances?: string[];
	damageImmunities?: string[];
	damageVulnerabilities?: string[];
	conditionImmunities?: string[];
	senses?: string;
	languages?: string;
	xp?: number;
};

function cyrb128(str: string) {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [
		(h1 ^ h2 ^ h3 ^ h4) >>> 0,
		(h2 ^ h1) >>> 0,
		(h3 ^ h1) >>> 0,
		(h4 ^ h1) >>> 0,
	];
}

function sfc32(a: number, b: number, c: number, d: number) {
	return () => {
		a >>>= 0;
		b >>>= 0;
		c >>>= 0;
		d >>>= 0;
		let t = (a + b) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		d = (d + 1) | 0;
		t = (t + d) | 0;
		c = (t + c) | 0;
		return (t >>> 0) / 4294967296;
	};
}

const traitNames = [
	"{TYPE} Physiology", "Void Resilience", "Lattice Anchor", "Dimensional Phasing",
	"Predatory Instinct", "Furious Assault", "Unnatural Fortitude", "Temporal Shift",
	"Mana Distortion", "Sovereign Aura"
];
const traitDesc = [
	"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
	"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet.",
	"Its body dynamically adapts to damage. The first time it takes damage each round, it reduces the damage by its proficiency bonus.",
	"It exists slightly out of phase with reality, causing attacks from farther than 30 feet to have disadvantage.",
	"It can sense the presence of any creature within 60 feet that is not protected by mind-shielding magic.",
	"Once per turn, when it hits with a melee attack, it can push the target up to 10 feet away.",
	"Whenever it succeeds on a saving throw, it gains temporary hit points equal to twice its Challenge Rating.",
	"If it starts its turn with a movement-impairing condition, it can attempt a new saving throw to end the effect immediately.",
	"Its presence warps ambient mana. Healing spells cast within 30 feet of it restore half the normal amount.",
	"Creatures that start their turn within 10 feet of this entity must spend 1 extra foot of movement for every foot moved."
];

const actionNames = [
	"Lattice Strike", "Void Rupture", "Shattering Blow", "Umbral Lash",
	"Feral Rend", "Ethereal Blast", "Cataclysmic Burst", "Phantom Talon",
	"Oblivion Beam", "Shockwave Stomp"
];
const actionDescPrimary = [
	"Melee Weapon Attack: +{HIT} to hit, reach 5 ft., one target. Hit: {DICE} {TYPE} damage.",
	"Ranged Spell Attack: +{HIT} to hit, range 60 ft., one target. Hit: {DICE} {TYPE} damage.",
	"Melee Weapon Attack: +{HIT} to hit, reach 10 ft., one target. Hit: {DICE} {TYPE} damage and the target is pushed 5 ft.",
	"Ranged Weapon Attack: +{HIT} to hit, range 30/120 ft., one target. Hit: {DICE} {TYPE} damage."
];
const actionDescSpecial = [
	"Protocol action. The target must succeed on a DC {DC} {SAVE} saving throw or take {DICE} {TYPE} damage and suffer a brief impairment.",
	"Energy pulse. Each creature within 15 feet must make a DC {DC} {SAVE} saving throw, taking {DICE} {TYPE} damage on a failed save, or half as much on a successful one.",
	"Focus blast. A line of force 30 feet long and 5 feet wide erupts from it. Creatures in the line must succeed on a DC {DC} {SAVE} saving throw or take {DICE} {TYPE} damage and fall prone.",
	"Miasma surge. Target area (10 ft radius, 30 ft range) is flooded with hazardous energy. Creatures inside must pass a DC {DC} {SAVE} save or take {DICE} {TYPE} damage."
];

const savesList = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const hasNonEmptyString = (value: unknown) =>
	typeof value === "string" && value.trim().length > 0;

const clamp = (n: number, min: number, max: number) =>
	Math.max(min, Math.min(max, n));

const rankToCr = (rank: SpellRank): number => {
	switch (rank) {
		case "D":
			return 1;
		case "C":
			return 4;
		case "B":
			return 8;
		case "A":
			return 13;
		case "S":
			return 18;
	}
};

const crToProf = (cr: number): number => {
	if (cr <= 4) return 2;
	if (cr <= 8) return 3;
	if (cr <= 12) return 4;
	if (cr <= 16) return 5;
	return 6;
};

const rankToSpellSaveDC = (rank: SpellRank): number => {
	switch (rank) {
		case "D":
			return 12;
		case "C":
			return 13;
		case "B":
			return 14;
		case "A":
			return 16;
		case "S":
			return 18;
	}
};

const inferDamageType = (name: string, effect: string): string => {
	const text = `${name} ${effect}`.toLowerCase();
	if (text.includes("shadow") || text.includes("umbral")) return "necrotic";
	if (text.includes("void") || text.includes("abyss")) return "force";
	if (text.includes("frost") || text.includes("ice")) return "cold";
	if (
		text.includes("infernal") ||
		text.includes("demonic") ||
		text.includes("flame")
	)
		return "fire";
	if (
		text.includes("thunder") ||
		text.includes("storm") ||
		text.includes("lightning")
	)
		return "lightning";
	if (
		text.includes("holy") ||
		text.includes("divine") ||
		text.includes("celestial")
	)
		return "radiant";
	return "arcane";
};

const rankToDice = (rank: SpellRank, kind: "damage" | "healing"): string => {
	if (kind === "healing") {
		switch (rank) {
			case "D":
				return "1d8";
			case "C":
				return "2d8";
			case "B":
				return "3d8";
			case "A":
				return "4d8";
			case "S":
				return "6d8";
		}
	}

	switch (rank) {
		case "D":
			return "2d6";
		case "C":
			return "3d6";
		case "B":
			return "5d6";
		case "A":
			return "7d6";
		case "S":
			return "10d6";
	}
};

const getAnomalyBaselineHP = (rank: SpellRank): number => {
	switch (rank) {
		case "D":
			return 45;
		case "C":
			return 85;
		case "B":
			return 135;
		case "A":
			return 195;
		case "S":
			return 285;
	}
};

const getAnomalyBaselineAC = (rank: SpellRank): number => {
	switch (rank) {
		case "D":
			return 12;
		case "C":
			return 14;
		case "B":
			return 16;
		case "A":
			return 18;
		case "S":
			return 20;
	}
};

const inferAnomalyScores = (anomalyType: string, rank: SpellRank) => {
	const t = anomalyType.toLowerCase();

	const base = {
		strength: 12,
		dexterity: 12,
		constitution: 12,
		intelligence: 10,
		wisdom: 10,
		charisma: 10,
	};

	if (t.includes("dragon") || t.includes("titan")) {
		base.strength += 6;
		base.constitution += 6;
		base.charisma += 2;
	} else if (t.includes("undead")) {
		base.constitution += 4;
		base.wisdom += 2;
	} else if (t.includes("demon")) {
		base.strength += 4;
		base.charisma += 4;
	} else if (t.includes("elemental")) {
		base.constitution += 4;
		base.dexterity += 2;
	} else if (t.includes("beast")) {
		base.strength += 4;
		base.dexterity += 2;
	} else if (t.includes("humanoid")) {
		base.dexterity += 2;
		base.intelligence += 2;
		base.wisdom += 2;
	}

	const rankBoost =
		rank === "D"
			? 0
			: rank === "C"
				? 2
				: rank === "B"
					? 4
					: rank === "A"
						? 6
						: 8;

	return {
		strength: clamp(base.strength + rankBoost, 6, 30),
		dexterity: clamp(base.dexterity + rankBoost, 6, 30),
		constitution: clamp(base.constitution + rankBoost, 6, 30),
		intelligence: clamp(base.intelligence + Math.floor(rankBoost / 2), 3, 30),
		wisdom: clamp(base.wisdom + Math.floor(rankBoost / 2), 3, 30),
		charisma: clamp(base.charisma + Math.floor(rankBoost / 2), 3, 30),
	};
};

const ensureSpellStructured = (spell: SpellInput): CompendiumSpell => {
	const out = {
		id: spell.id,
		name: spell.name,
		description: spell.description,
		type: spell.type,
		rank: spell.rank,
		image: spell.image,
		effect: spell.effect,
	} as unknown as CompendiumSpell;

	const damageType = inferDamageType(spell.name, spell.effect);
	const dc = rankToSpellSaveDC(spell.rank);

	const legacyRangeValue =
		typeof spell.range === "number"
			? spell.range
			: isRecord(spell.range) && typeof spell.range.value === "number"
				? spell.range.value
				: 60;

	if (!isRecord(out.activation)) {
		out.activation = {
			type: "action",
			cost: 1,
		};
	}

	if (!isRecord(out.duration)) {
		out.duration = {
			type: "instant",
		} as unknown as CompendiumSpell["duration"];
	}

	if (!isRecord(out.range)) {
		out.range = {
			type: "distance",
			value: legacyRangeValue,
			unit: "ft",
		};
	}

	const seed = cyrb128(`${spell.id}spell`);
	const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
	const pickRand = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

	const verbalOpts = [true, false];
	const somaticOpts = [true, false];
	const hasVerbal = pickRand(verbalOpts);
	const hasSomatic = hasVerbal ? pickRand(somaticOpts) : true;

	if (!isRecord(out.components)) {
		out.components = {
			verbal: hasVerbal,
			somatic: hasSomatic,
			material: false,
			focus: pickRand([
				"Ascendant focus (attuned conduit)",
				"Resonance crystal",
				"Runic catalyst",
				"None required"
			]),
		};
	}

	const effectDescriptions = [
		hasNonEmptyString(spell.effect) ? spell.effect : "Channels ascendant force into a defined outcome.",
		"Manipulates the local mana field to enforce the user's will.",
		"Bypasses the natural laws of physics with concentrated essence.",
		"Imprints a systemic command onto the immediate environment."
	];

	const primaryEff = isRecord(out.effects) && hasNonEmptyString(out.effects.primary) 
		? out.effects.primary 
		: pickRand(effectDescriptions);

	out.effects = (isRecord(out.effects)
		? { ...out.effects, primary: primaryEff }
		: { primary: primaryEff }) as unknown as CompendiumSpell["effects"];

	const mechanics = isRecord(out.mechanics)
		? (out.mechanics as Record<string, unknown>)
		: null;
	const hasAttack = !!(mechanics && isRecord(mechanics.attack));
	const hasSave = !!(mechanics && isRecord(mechanics.saving_throw));
	const hasHealing = !!(mechanics && isRecord(mechanics.healing));

	if (!out.mechanics) {
		out.mechanics = {} as unknown as CompendiumSpell["mechanics"];
	}

	const mechanicsOut = out.mechanics as unknown as Record<string, unknown>;

	if (!hasAttack && !hasSave && !hasHealing) {
		if (spell.type === "Attack") {
			mechanicsOut.attack = {
				mode: pickRand(["ranged", "melee"]),
				resolution: "spell_attack",
				damage: {
					dice: rankToDice(spell.rank, "damage"),
					type: damageType,
				},
			};
		} else if (spell.type === "Healing") {
			mechanicsOut.healing = {
				dice: rankToDice(spell.rank, "healing"),
				notes: pickRand([
					"Restores vitality; does not remove conditions unless stated.",
					"Rapid cellular regeneration fueled by mana.",
					"Stitches wounds utilizing ambient life force."
				]),
			};
		} else {
			mechanicsOut.saving_throw = {
				ability: pickRand(["CON", "DEX", "WIS", "STR"]),
				dc,
				on_save: pickRand([
					"Half effect.",
					"Negates impairment.",
					"Target is pushed instead.",
					"Reduced duration."
				]),
			};
		}
	}

	if (!isRecord(out.limitations)) {
		out.limitations = {} as unknown as CompendiumSpell["limitations"];
	}

	if (!hasNonEmptyString(out.flavor)) {
		const flavorPrefixes = [
			"In the post-reset lattice,",
			"Considered a foundational technique,",
			"Derived from forgotten archives,",
			"A potent assertion of system authority,"
		];
		const flavorSuffixes = [
			"is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.",
			"demands absolute control to prevent devastating feedback loops.",
			"temporarily rewrites the rules governing ambient mana.",
			"serves as a brutal reminder of an Awakened's superiority."
		];
		out.flavor = `${pickRand(flavorPrefixes)} ${spell.name} ${pickRand(flavorSuffixes)}`;
	}

	return out;
};

const ensureAnomalyStructured = (anomaly: LegacyAnomaly): CompendiumAnomaly => {
	const inferredScores = inferAnomalyScores(anomaly.type, anomaly.rank);

	const armorClass =
		typeof anomaly.stats?.armor_class === "number"
			? (anomaly.stats.armor_class as number)
			: typeof anomaly.ac === "number"
				? anomaly.ac
				: getAnomalyBaselineAC(anomaly.rank);

	const hitPoints =
		typeof anomaly.stats?.hit_points === "number"
			? (anomaly.stats.hit_points as number)
			: typeof anomaly.hp === "number"
				? anomaly.hp
				: getAnomalyBaselineHP(anomaly.rank);

	const crValue =
		typeof anomaly.stats?.challenge_rating === "number"
			? (anomaly.stats.challenge_rating as number)
			: rankToCr(anomaly.rank);

	const prof =
		typeof anomaly.stats?.proficiency_bonus === "number"
			? (anomaly.stats.proficiency_bonus as number)
			: crToProf(crValue);

	const out: CompendiumAnomaly = {
		id: anomaly.id,
		name: anomaly.name,
		type: anomaly.type,
		rank: anomaly.rank,
		image: anomaly.image,
		description: anomaly.description,
		abilities: anomaly.abilities,
		weaknesses: anomaly.weaknesses,
		xp: anomaly.xp,
		stats: {
			ability_scores: {
				strength:
					anomaly.stats?.ability_scores?.strength ?? inferredScores.strength,
				agility:
					anomaly.stats?.ability_scores?.agility ?? inferredScores.dexterity,
				vitality:
					anomaly.stats?.ability_scores?.vitality ??
					inferredScores.constitution,
				intelligence:
					anomaly.stats?.ability_scores?.intelligence ??
					inferredScores.intelligence,
				sense: anomaly.stats?.ability_scores?.sense ?? inferredScores.wisdom,
				presence:
					anomaly.stats?.ability_scores?.presence ?? inferredScores.charisma,
			},
			challenge_rating: crValue,
			proficiency_bonus: prof,
			saving_throws: anomaly.stats?.saving_throws || {},
		},
		hp: hitPoints,
		ac: armorClass,
		armor_class: armorClass,
		hit_points: hitPoints,
		challenge_rating: String(crValue),
	} as unknown as CompendiumAnomaly;

	const seed = cyrb128(`${anomaly.id}generator`);
	const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

	const pickRand = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
	const damageType = inferDamageType(anomaly.name, anomaly.description);
	const baseDice = rankToDice(anomaly.rank, "damage");
	const bonus = Math.max(0, prof + Math.floor((inferredScores.strength - 10) / 2));
	const dcValue = rankToSpellSaveDC(anomaly.rank);

	const traits = out.traits;
	if (!traits || traits.length === 0) {
		const traitGen1 = pickRand(traitNames).replace("{TYPE}", anomaly.type);
		const traitGen2 = pickRand(traitNames).replace("{TYPE}", anomaly.type);
		const traitNamesOutput = traitGen1 === traitGen2 ? traitGen1 + " Resilience" : traitGen1;

		out.traits = [
			{
				name: traitNamesOutput,
				description: pickRand(traitDesc),
			},
			{
				name: traitGen2,
				description: pickRand(traitDesc),
			},
		];
	}

	const actions = out.actions;
	if (!actions || actions.length === 0) {
		const abilityActions = Array.isArray(anomaly.abilities) ? anomaly.abilities : [];
		
		const templated = abilityActions.slice(0, 3).map((name, idx) => {
			const actionDesc = idx === 0 
				? pickRand(actionDescPrimary)
				: pickRand(actionDescSpecial);
			const selectedSave = pickRand(savesList);

			const formattedDesc = actionDesc
				.replace("{HIT}", String(bonus))
				.replace("{DICE}", baseDice)
				.replace("{TYPE}", damageType)
				.replace("{DC}", String(dcValue))
				.replace("{SAVE}", selectedSave);

			// Safely structuring without undefined
			const baseAction = {
				name,
				description: formattedDesc,
				action_type: "action" as const,
				damage: baseDice,
				damage_type: damageType,
				usage: idx === 0 ? "at-will" : "recharge",
			};

			if (idx === 0) {
				return { ...baseAction, attack_bonus: bonus };
			} else {
				return { ...baseAction, save: selectedSave, dc: dcValue, recharge: "short-rest" };
			}
		});

		if (templated.length === 0) {
			const baseAction = {
				name: pickRand(actionNames),
				description: pickRand(actionDescPrimary)
					.replace("{HIT}", String(bonus))
					.replace("{DICE}", baseDice)
					.replace("{TYPE}", damageType),
				action_type: "action" as const,
				attack_bonus: bonus,
				damage: baseDice,
				damage_type: damageType,
				usage: "at-will",
			};
			templated.push(baseAction);
		}

		out.actions = templated as NonNullable<CompendiumAnomaly["actions"]>;
	}

	return out;
};

const replaceExportedArray = (
	fileText: string,
	exportConstName: string,
	newArrayText: string,
) => {
	const startToken = `export const ${exportConstName} = [`;
	const start = fileText.indexOf(startToken);
	if (start === -1) {
		throw new Error(`Could not find ${startToken}`);
	}

	const fromArrayStart = start + startToken.length;
	const end = fileText.indexOf("];", fromArrayStart);
	if (end === -1) {
		throw new Error(
			`Could not find end of export const ${exportConstName} array`,
		);
	}

	return `${fileText.slice(0, start)}export const ${exportConstName} = ${newArrayText};${fileText.slice(end + 2)}`;
};

const formatArray = (value: unknown) => JSON.stringify(value, null, 2);

async function main() {
	const args = new Set(process.argv.slice(2));
	const write = args.has("--write");

	const projectRoot = path.resolve(process.cwd());

	const spellsPath = path.join(
		projectRoot,
		"src",
		"data",
		"compendium",
		"spells.ts",
	);
	const anomaliesPath = path.join(
		projectRoot,
		"src",
		"data",
		"compendium",
		"anomalies.ts",
	);

	const enrichedSpells = (rawSpells as SpellInput[]).map(ensureSpellStructured);
	const enrichedAnomalies = (rawAnomalies as LegacyAnomaly[]).map(
		ensureAnomalyStructured,
	);

	if (!write) {
		process.stdout.write(`Enrichment preview (no files written).\n`);
		process.stdout.write(`- spells: ${enrichedSpells.length}\n`);
		process.stdout.write(`- anomalies: ${enrichedAnomalies.length}\n`);
		process.stdout.write(`\nRun with --write to apply changes.\n`);
		return;
	}

	const spellsText = fs.readFileSync(spellsPath, "utf8");
	const anomaliesText = fs.readFileSync(anomaliesPath, "utf8");

	const spellsUpdated = replaceExportedArray(
		spellsText,
		"spells",
		formatArray(enrichedSpells),
	);
	const anomaliesUpdated = replaceExportedArray(
		anomaliesText,
		"anomalies",
		formatArray(enrichedAnomalies),
	);

	fs.writeFileSync(spellsPath, spellsUpdated, "utf8");
	fs.writeFileSync(anomaliesPath, anomaliesUpdated, "utf8");

	process.stdout.write(`Enrichment applied.\n`);
}

main().catch((err) => {
	process.stderr.write(`${String(err)}\n`);
	process.exitCode = 1;
});
