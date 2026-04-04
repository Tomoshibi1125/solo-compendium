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
	manaCost: number;
	damage?: number;
	healing?: number;
	image: string;
	effect: string;
	range?: number | { type?: string; value?: number; unit?: string };
	cooldown: number;
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
	const out: CompendiumSpell = {
		id: spell.id,
		name: spell.name,
		description: spell.description,
		type: spell.type,
		rank: spell.rank,
		image: spell.image,
		effect: spell.effect,
	};

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
		};
	}

	if (!isRecord(out.range)) {
		out.range = {
			type: "distance",
			value: legacyRangeValue,
			unit: "ft",
		};
	}

	if (!isRecord(out.components)) {
		out.components = {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus (attuned conduit)",
		};
	}

	out.effects = isRecord(out.effects)
		? out.effects
		: {
				primary: hasNonEmptyString(spell.effect)
					? spell.effect
					: "Channels ascendant force into a defined outcome.",
			};

	const currentEffects = out.effects as Record<string, unknown>;
	if (!hasNonEmptyString(currentEffects.primary)) {
		currentEffects.primary = hasNonEmptyString(spell.effect)
			? spell.effect
			: "Channels ascendant force into a defined outcome.";
	}

	const mechanics = isRecord(out.mechanics)
		? (out.mechanics as Record<string, unknown>)
		: null;
	const hasAttack = !!(mechanics && isRecord(mechanics.attack));
	const hasSave = !!(mechanics && isRecord(mechanics.saving_throw));
	const hasHealing = !!(mechanics && isRecord(mechanics.healing));

	if (!out.mechanics) {
		out.mechanics = {};
	}

	const mechanicsOut = out.mechanics as Record<string, unknown>;

	if (!hasAttack && !hasSave && !hasHealing) {
		if (spell.type === "Attack") {
			mechanicsOut.attack = {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: rankToDice(spell.rank, "damage"),
					type: damageType,
				},
			};
		} else if (spell.type === "Healing") {
			mechanicsOut.healing = {
				dice: rankToDice(spell.rank, "healing"),
				notes: "Restores vitality; does not remove conditions unless stated.",
			};
		} else {
			mechanicsOut.saving_throw = {
				ability: "CON",
				dc,
				on_save: "Half effect or negates secondary impairment (if any).",
			};
		}
	}

	if (!isRecord(out.limitations)) {
		out.limitations = {
			mana_cost: spell.manaCost,
			cooldown: spell.cooldown,
		};
	}

	if (!hasNonEmptyString(out.flavor)) {
		out.flavor = `In the post-reset lattice, ${spell.name} is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.`;
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
	};

	const traits = out.traits;
	if (!traits || traits.length === 0) {
		out.traits = [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: `${anomaly.type} Instinct`,
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		];
	}

	const actions = out.actions;
	if (!actions || actions.length === 0) {
		const damageType = inferDamageType(anomaly.name, anomaly.description);
		const baseDice = rankToDice(anomaly.rank, "damage");
		const bonus = Math.max(
			0,
			prof + Math.floor((inferredScores.strength - 10) / 2),
		);

		const abilityActions = Array.isArray(anomaly.abilities)
			? anomaly.abilities
			: [];
		const templated = abilityActions.slice(0, 3).map((name, idx) => ({
			name,
			description:
				idx === 0
					? `Melee Weapon Attack: +${bonus} to hit, reach 5 ft., one target. Hit: ${baseDice} ${damageType} damage.`
					: `Protocol action. The target must succeed on a DC ${rankToSpellSaveDC(anomaly.rank)} Constitution saving throw or take ${baseDice} ${damageType} damage and suffer a brief impairment (start-of-next-turn).`,
			type: idx === 0 ? "melee" : "special",
			attack_bonus: idx === 0 ? bonus : undefined,
			damage: baseDice,
			damage_type: damageType,
			range: idx === 0 ? 5 : 60,
			save: idx === 0 ? undefined : "Constitution",
			dc: idx === 0 ? undefined : rankToSpellSaveDC(anomaly.rank),
			recharge: idx === 0 ? "recharge" : "short-rest",
			usage: idx === 0 ? "at-will" : "recharge",
		}));

		const fallback: NonNullable<CompendiumAnomaly["actions"]>[number] = {
			name: "Lattice Strike",
			description: `Melee Weapon Attack: +${bonus} to hit, reach 5 ft., one target. Hit: ${baseDice} ${damageType} damage.`,
			type: "melee",
			attack_bonus: bonus,
			damage: baseDice,
			damage_type: damageType,
			range: 5,
			recharge: "recharge",
			usage: "at-will",
		};

		out.actions =
			templated.length > 0
				? (templated as CompendiumAnomaly["actions"])
				: [fallback];
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
