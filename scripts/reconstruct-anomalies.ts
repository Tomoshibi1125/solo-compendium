/**
 * Phase D — anomaly statblock reconstruction.
 *
 * Rewrites the five rank files with COMPLETE, 5e-correct statblocks while
 * preserving each monster's identity (id, name, creature type, description,
 * abilities, traits, image). Numbers are re-derived from the rank→CR band
 * (monster5eTable.ts) so a single rank-appropriate anomaly never exceeds the
 * party-of-4 Deadly budget at the rank's entry level. Descriptive fields are
 * filled by creature type with per-entry elemental variety so no two entries
 * collapse into functional clones.
 *
 * Read-only sources; writes the rank-*.ts files. Run: npx tsx scripts/reconstruct-anomalies.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { anomalies_a } from "../src/data/compendium/anomalies/rank-a";
import { anomalies_b } from "../src/data/compendium/anomalies/rank-b";
import { anomalies_c } from "../src/data/compendium/anomalies/rank-c";
import { anomalies_d } from "../src/data/compendium/anomalies/rank-d";
import { anomalies_s } from "../src/data/compendium/anomalies/rank-s";
import {
	crForRankPosition,
	getMonsterCrStats,
	getMonsterCrXp,
} from "../src/lib/monster5eTable";

type Rank = "D" | "C" | "B" | "A" | "S";
type AnyEntry = Record<string, any>;

const ABILITY_LONG = [
	"strength",
	"agility",
	"vitality",
	"intelligence",
	"sense",
	"presence",
] as const;

// Creature-type → 5e profile (RA-flavored). Drives size, alignment, senses,
// languages, immunities and condition immunities so different types read
// differently in play.
interface TypeProfile {
	size: string;
	alignment: string;
	sensesBase: string; // passive Perception appended at build time
	languages: string;
	damage_immunities: string[];
	condition_immunities: string[];
	extraSpeeds?: Record<string, number>;
}

const TYPE_PROFILES: Record<string, TypeProfile> = {
	dragon: {
		size: "Large",
		alignment: "chaotic evil",
		sensesBase: "darkvision 120 ft., blindsight 30 ft.",
		languages: "Common, Draconic",
		damage_immunities: [],
		condition_immunities: ["frightened"],
		extraSpeeds: { fly: 80 },
	},
	elemental: {
		size: "Large",
		alignment: "neutral",
		sensesBase: "darkvision 60 ft.",
		languages: "Primordial",
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
	},
	beast: {
		size: "Medium",
		alignment: "unaligned",
		sensesBase: "darkvision 60 ft.",
		languages: "—",
		damage_immunities: [],
		condition_immunities: [],
	},
	humanoid: {
		size: "Medium",
		alignment: "any alignment",
		sensesBase: "darkvision 30 ft.",
		languages: "Common",
		damage_immunities: [],
		condition_immunities: [],
	},
	anomaly: {
		size: "Medium",
		alignment: "chaotic evil",
		sensesBase: "darkvision 60 ft., truesight 30 ft.",
		languages: "telepathy 60 ft.",
		damage_immunities: [],
		condition_immunities: ["charmed"],
	},
	titan: {
		size: "Huge",
		alignment: "chaotic evil",
		sensesBase: "truesight 60 ft.",
		languages: "Giant, Common",
		damage_immunities: [],
		condition_immunities: ["frightened", "exhaustion"],
	},
	god: {
		size: "Gargantuan",
		alignment: "lawful neutral",
		sensesBase: "truesight 120 ft.",
		languages: "all",
		damage_immunities: ["psychic"],
		condition_immunities: [
			"charmed",
			"exhaustion",
			"frightened",
			"paralyzed",
			"poisoned",
		],
	},
};

const profileFor = (type: string | undefined): TypeProfile => {
	const key = (type ?? "").toLowerCase();
	return TYPE_PROFILES[key] ?? TYPE_PROFILES.anomaly;
};

// Per-entry elemental theme so actions + resistances vary across entries that
// share a CR. Keyed off a stable hash of the entry id.
const ELEMENTS = [
	"necrotic",
	"cold",
	"fire",
	"lightning",
	"psychic",
	"acid",
	"force",
	"thunder",
	"poison",
	"cold",
] as const;

const hash = (s: string): number => {
	let h = 0;
	for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
};

const mod = (score: number): number => Math.floor((score - 10) / 2);

const diceForAverage = (avg: number, die = 6): string => {
	const per = (die + 1) / 2;
	const count = Math.max(1, Math.round(avg / per));
	return `${count}d${die}`;
};

const SAVE_ABILITY_LABEL: Record<string, string> = {
	strength: "Strength",
	agility: "Agility",
	vitality: "Vitality",
	intelligence: "Intelligence",
	sense: "Sense",
	presence: "Presence",
};

// Hit die by creature size (DDB renders HP as "avg (NdX ± mod)").
const SIZE_DIE: Record<string, number> = {
	Tiny: 4,
	Small: 6,
	Medium: 8,
	Large: 10,
	Huge: 12,
	Gargantuan: 20,
};

// Derive a 5e hit-dice formula whose displayed average equals the monster's
// HP (exactly, as DDB shows it). HP stays the unique per-entry value; the flat
// bonus absorbs the rounding so `avg(NdX) + bonus == hp`.
function hitDiceFormula(hp: number, size: string, vitMod: number): string {
	const die = SIZE_DIE[size] ?? 8;
	const avg = (die + 1) / 2;
	const per = Math.max(0.5, avg + vitMod);
	const n = Math.max(1, Math.round(hp / per));
	const bonus = hp - Math.round(n * avg);
	const bonusStr =
		bonus === 0 ? "" : bonus > 0 ? ` + ${bonus}` : ` - ${Math.abs(bonus)}`;
	return `${hp} (${n}d${die}${bonusStr})`;
}

// A type-appropriate proficient skill + the ability it keys off.
const TYPE_SKILL: Record<string, { skill: string; ability: string }> = {
	Dragon: { skill: "Intimidation", ability: "presence" },
	Titan: { skill: "Athletics", ability: "strength" },
	Beast: { skill: "Stealth", ability: "agility" },
	Humanoid: { skill: "Deception", ability: "presence" },
	Elemental: { skill: "Arcana", ability: "intelligence" },
	Anomaly: { skill: "Arcana", ability: "intelligence" },
	God: { skill: "Insight", ability: "sense" },
};

// DDB renders "AC {n} ({source})".
const AC_SOURCE: Record<string, string> = {
	Dragon: "natural armor",
	Titan: "natural armor",
	Beast: "natural armor",
	Humanoid: "natural armor",
	God: "natural armor",
	Elemental: "unarmored (elemental form)",
	Anomaly: "unarmored (lattice ward)",
};

// Which optional DDB sections each creature type logically carries.
const REACTION_TYPES = new Set([
	"Dragon",
	"Titan",
	"Beast",
	"Humanoid",
	"Anomaly",
	"God",
]);
const BONUS_ACTION_TYPES = new Set(["Beast", "Humanoid", "Elemental", "God"]);
const CASTER_TYPES = new Set(["Elemental", "Anomaly", "God"]);

function reconstruct(
	entry: AnyEntry,
	rank: Rank,
	idx: number,
	rankLen: number,
) {
	const position = rankLen > 1 ? idx / (rankLen - 1) : 0;
	const cr = crForRankPosition(rank, position);
	const table = getMonsterCrStats(cr);
	if (!table) throw new Error(`No CR stats for ${cr}`);
	const xp = getMonsterCrXp(cr);
	const profile = profileFor(entry.type);

	// HP spread within the CR band, deterministic + unique per entry.
	const bandSize = table.hp_max - table.hp_min + 1;
	const targetHp = table.hp_min + ((hash(entry.id) + idx * 13) % bandSize);

	// AC: table floor + armor bump for naturally-armored types.
	const acBump =
		entry.type === "Dragon" || entry.type === "Titan" || entry.type === "God"
			? 2
			: 0;
	const ac = table.armor_class + acBump;
	const ac_source = AC_SOURCE[entry.type as string] ?? "natural armor";

	// Keep the authored ability scores (varied per entry); fall back sanely.
	const oldScores =
		entry.stats?.ability_scores &&
		typeof entry.stats.ability_scores === "object"
			? entry.stats.ability_scores
			: {};
	const ability_scores: Record<string, number> = {};
	for (const a of ABILITY_LONG) {
		ability_scores[a] =
			typeof oldScores[a] === "number"
				? oldScores[a]
				: 10 + table.proficiency_bonus;
	}

	// Two highest abilities become proficient saves.
	const savingThrowPairs = [...ABILITY_LONG]
		.map((a) => [a, ability_scores[a]] as const)
		.sort((x, y) => y[1] - x[1])
		.slice(0, 2);
	const saving_throws: Record<string, number> = {};
	for (const [a, score] of savingThrowPairs) {
		saving_throws[SAVE_ABILITY_LABEL[a]] = mod(score) + table.proficiency_bonus;
	}

	// Hit-dice formula (DDB shows HP as "avg (NdX ± mod)"). HP stays the unique
	// per-entry spread value; the formula's average equals it exactly.
	const hp = targetHp;
	const vitMod = mod(ability_scores.vitality);
	const hit_dice = hitDiceFormula(hp, profile.size, vitMod);

	const senseMod = mod(ability_scores.sense);
	const passivePerception = 10 + senseMod + table.proficiency_bonus;
	const senses = `${profile.sensesBase}, passive Perception ${passivePerception}`;

	// Proficient skills: always Perception + one type-appropriate skill (DDB
	// renders "Skills Perception +4, Stealth +5").
	const skills: Record<string, number> = {
		Perception: senseMod + table.proficiency_bonus,
	};
	const typeSkill = TYPE_SKILL[entry.type as string];
	if (typeSkill && typeSkill.skill !== "Perception") {
		skills[typeSkill.skill] =
			mod(ability_scores[typeSkill.ability]) + table.proficiency_bonus;
	}

	// Elemental palette for this entry (3 distinct damage types).
	const e0 = hash(entry.id) % ELEMENTS.length;
	const dt = [
		ELEMENTS[e0],
		ELEMENTS[(e0 + 3) % ELEMENTS.length],
		ELEMENTS[(e0 + 6) % ELEMENTS.length],
	];

	// Vulnerabilities from the authored weaknesses (Light/Holy → radiant): these
	// shadow-army monsters are canonically undone by Light.
	const damage_vulnerabilities = ["radiant"];
	// Resist their own primary element; immunities from the type profile.
	const damage_resistances = Array.from(new Set([dt[0]]));
	const damage_immunities = profile.damage_immunities;
	const condition_immunities = profile.condition_immunities;

	// Save DC + attack from the CR table; damage scaled to the CR band.
	const dc = table.save_dc;
	const atk = table.attack_bonus;
	const avg = Math.round((table.damage_min + table.damage_max) / 2);
	const primarySave = SAVE_ABILITY_LABEL[savingThrowPairs[0][0]];

	const actions: AnyEntry[] = [];
	const oldActions = Array.isArray(entry.actions) ? entry.actions : [];
	const name0 = oldActions[0]?.name ?? "Rending Strike";
	const name1 = oldActions[1]?.name ?? "Surge Blast";
	const name2 = oldActions[2]?.name ?? "Cataclysm";

	actions.push({
		name: name0,
		description: `Melee Weapon Attack: +${atk} to hit, reach 5 ft., one target. Hit: ${diceForAverage(avg)} ${dt[0]} damage.`,
		type: "melee",
		attack_bonus: atk,
		damage: diceForAverage(avg),
		damage_type: dt[0],
		range: 5,
		usage: "at-will",
	});
	actions.push({
		name: name1,
		description: `Ranged Decree (range 60 ft.), one target. The target must succeed on a DC ${dc} ${primarySave} saving throw or take ${diceForAverage(Math.round(avg * 0.8))} ${dt[1]} damage.`,
		type: "ranged",
		damage: diceForAverage(Math.round(avg * 0.8)),
		damage_type: dt[1],
		range: 60,
		save: primarySave,
		dc,
		usage: "at-will",
	});
	actions.push({
		name: name2,
		description: `Recharge 5–6. Each creature in a 20-foot cone must make a DC ${dc} ${primarySave} saving throw, taking ${diceForAverage(avg)} ${dt[2]} damage on a failed save, or half as much on a success.`,
		type: "special",
		damage: diceForAverage(avg),
		damage_type: dt[2],
		range: 20,
		save: primarySave,
		dc,
		recharge: "5-6",
		usage: "recharge",
	});

	// Optional DDB sections, added only where logical for the creature type/rank.
	const reactions: AnyEntry[] = [];
	if (REACTION_TYPES.has(entry.type as string)) {
		reactions.push(
			CASTER_TYPES.has(entry.type as string)
				? {
						name: "Lattice Backlash",
						description: `When the anomaly is hit by an attack, it wreathes itself in ${dt[1]} energy: the attacker must succeed on a DC ${dc} ${primarySave} saving throw or take ${diceForAverage(Math.round(avg * 0.4))} ${dt[1]} damage.`,
					}
				: {
						name: "Retaliate",
						description: `When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one ${name0} attack against that creature.`,
					},
		);
	}

	const bonus_actions: AnyEntry[] = [];
	if (BONUS_ACTION_TYPES.has(entry.type as string)) {
		bonus_actions.push(
			CASTER_TYPES.has(entry.type as string)
				? {
						name: `${dt[1].charAt(0).toUpperCase() + dt[1].slice(1)} Mote`,
						description: `Ranged Spell Attack: +${atk} to hit, range 60 ft., one target. Hit: ${diceForAverage(Math.round(avg * 0.5))} ${dt[1]} damage.`,
					}
				: {
						name: "Nimble Reposition",
						description:
							"The anomaly moves up to half its speed without provoking opportunity attacks.",
					},
		);
	}

	// Lair actions + regional effects for boss-tier ranks (S always; A elite).
	const lair_actions: AnyEntry[] = [];
	const regional_effects: AnyEntry[] = [];
	if (rank === "S" || rank === "A") {
		lair_actions.push({
			name: "Lattice Surge",
			description: `On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC ${dc} ${primarySave} saving throw or take ${diceForAverage(Math.round(avg * 0.5))} ${dt[2]} damage.`,
		});
		if (rank === "S") {
			lair_actions.push({
				name: "Sundering Echo",
				description: `The anomaly pulls on the ${dt[0]} resonance of its lair; difficult terrain laced with ${dt[0]} energy spreads in a 20-foot radius until the next lair action.`,
			});
			regional_effects.push({
				name: "Warped Region",
				description: `Within 1 mile of the lair, ${dt[0]} phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.`,
			});
		}
	}

	const out: AnyEntry = {
		id: entry.id,
		name: entry.name,
		type: entry.type ?? "Anomaly",
		rank,
		source_book: "Rift Ascendant Canon",
		size: profile.size,
		alignment: profile.alignment,
		hp,
		hit_dice,
		ac,
		ac_source,
		skills,
		image: entry.image,
		description: entry.description,
		abilities: Array.isArray(entry.abilities) ? entry.abilities : [],
		weaknesses: Array.isArray(entry.weaknesses) ? entry.weaknesses : ["Light"],
		senses,
		languages: profile.languages,
		damage_vulnerabilities,
		damage_resistances,
		damage_immunities,
		condition_immunities,
		xp,
		stats: {
			ability_scores,
			speed: 30,
			...(profile.extraSpeeds ? { extra_speeds: profile.extraSpeeds } : {}),
			challenge_rating: table.crValue,
			proficiency_bonus: table.proficiency_bonus,
			saving_throws,
		},
		traits:
			Array.isArray(entry.traits) && entry.traits.length > 0
				? entry.traits
				: [
						{
							name: "Ascendant Physiology",
							description:
								"Stabilized by post-reset lattice pressure; cannot be surprised while conscious.",
							action: "passive",
							frequency: "at-will",
						},
					],
		actions,
	};

	if (reactions.length > 0) out.reactions = reactions;
	if (bonus_actions.length > 0) out.bonus_actions = bonus_actions;
	if (lair_actions.length > 0) out.lair_actions = lair_actions;
	if (regional_effects.length > 0) out.regional_effects = regional_effects;

	// S-rank bosses get legendary actions.
	if (rank === "S") {
		out.legendary_actions = [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: `The anomaly makes one ${name0} attack.`,
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: `The anomaly uses ${name1}.`,
				frequency: "1/round",
			},
		];
	}

	return out;
}

// ── TS serializer (unquoted identifier keys, tab indent, matches repo style) ──
const isIdent = (k: string): boolean => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);

function serialize(value: unknown, depth: number): string {
	const pad = "\t".repeat(depth);
	const padIn = "\t".repeat(depth + 1);
	if (value === null) return "null";
	if (typeof value === "string") return JSON.stringify(value);
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	if (Array.isArray(value)) {
		if (value.length === 0) return "[]";
		const items = value
			.map((v) => `${padIn}${serialize(v, depth + 1)}`)
			.join(",\n");
		return `[\n${items},\n${pad}]`;
	}
	if (typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>).filter(
			([, v]) => v !== undefined,
		);
		if (entries.length === 0) return "{}";
		const body = entries
			.map(([k, v]) => {
				const key = isIdent(k) ? k : JSON.stringify(k);
				return `${padIn}${key}: ${serialize(v, depth + 1)}`;
			})
			.join(",\n");
		return `{\n${body},\n${pad}}`;
	}
	return "null";
}

function writeRank(
	rank: Rank,
	constName: string,
	file: string,
	data: AnyEntry[],
) {
	const rebuilt = data.map((e, i) => reconstruct(e, rank, i, data.length));
	const header = `// ${rank}-Rank Anomalies — reconstructed to complete 5e statblocks\n// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single\n// rank-appropriate anomaly stays within a party-of-4 Deadly budget.\n`;
	const body = `${header}\nexport const ${constName} = ${serialize(rebuilt, 0)};\n`;
	const path = join(
		process.cwd(),
		"src",
		"data",
		"compendium",
		"anomalies",
		file,
	);
	writeFileSync(path, body, "utf8");
	console.log(`wrote ${file}: ${rebuilt.length} entries`);
}

if (process.argv.includes("--dry")) {
	// Print one D-rank and one S-rank reconstruction for inspection.
	console.log("=== D[0] ===");
	console.log(
		serialize(
			reconstruct(anomalies_d[0] as AnyEntry, "D", 0, anomalies_d.length),
			0,
		),
	);
	console.log("=== S[0] ===");
	console.log(
		serialize(
			reconstruct(anomalies_s[0] as AnyEntry, "S", 0, anomalies_s.length),
			0,
		),
	);
} else {
	writeRank("D", "anomalies_d", "rank-d.ts", anomalies_d as AnyEntry[]);
	writeRank("C", "anomalies_c", "rank-c.ts", anomalies_c as AnyEntry[]);
	writeRank("B", "anomalies_b", "rank-b.ts", anomalies_b as AnyEntry[]);
	writeRank("A", "anomalies_a", "rank-a.ts", anomalies_a as AnyEntry[]);
	writeRank("S", "anomalies_s", "rank-s.ts", anomalies_s as AnyEntry[]);
	console.log("done");
}
