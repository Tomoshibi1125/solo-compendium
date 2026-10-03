/**
 * Companion scaling (RA-10, docs/canon/rift-ascendant-canon-locks.md).
 *
 * Each species has one version, scaled to the level of the character that
 * owns it. An Anomaly companion, or a mount linked to an Anomaly, scales from
 * that stat block; a combat-capable catalog mount scales from its size. Every
 * other companion keeps its saved stats. The numbers themselves live in
 * `companionProgression.ts`.
 */
import { anomalies } from "@/data/compendium/anomalies";
import { allMounts } from "@/data/compendium/vehicles";
import { getAbilityModifier } from "@/lib/5eRulesEngine";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	type CompanionHitDie,
	type CompanionScalingKind,
	companionDamageExpression,
	naturalAttackDie,
	parseStatBlockHitDie,
	rewriteCompanionText,
	type ScaledCompanionCombatStats,
	scaleCompanionAtLevel,
	scaleCompanionText,
	sizeHitDie,
	UNKNOWN_SIZE_HIT_DIE,
} from "@/lib/companionProgression";
import { calculateSkillModifier, findSkillDefinition } from "@/lib/skills";
import type {
	CompendiumAnomaly,
	CompendiumMountNaturalAttack,
	CompendiumVehicle,
} from "@/types/compendium";
import type { AbilityScore } from "@/types/core-rules";

type CompanionSourceRef = Pick<
	CompanionInstanceRecord,
	"source_collection" | "source_id"
>;

const NATURAL_ATTACK_REACH_FT = 5;

const anomalyById: ReadonlyMap<string, CompendiumAnomaly> = new Map(
	anomalies.map((entry) => [entry.id, entry]),
);
const mountById: ReadonlyMap<string, CompendiumVehicle> = new Map(
	allMounts.map((entry) => [entry.id, entry]),
);

const asRecord = (value: unknown): Record<string, unknown> | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;

const nonEmptyString = (value: unknown): string | null =>
	typeof value === "string" && value.trim().length > 0 ? value : null;

// ── Catalog source ──────────────────────────────────────────────────────

function catalogMount(instance: CompanionSourceRef): CompendiumVehicle | null {
	return instance.source_collection === "vehicles" && instance.source_id
		? (mountById.get(instance.source_id) ?? null)
		: null;
}

function catalogAnomaly(
	instance: CompanionSourceRef,
	mount: CompendiumVehicle | null,
): CompendiumAnomaly | null {
	const id =
		mount?.anomaly_id ??
		(instance.source_collection === "anomalies" ? instance.source_id : null);
	return id ? (anomalyById.get(id) ?? null) : null;
}

const trimmedOrNull = (value: unknown): string | null =>
	nonEmptyString(value)?.trim() ?? null;

/**
 * A species' rank: the canonical catalog entry's rank (a mount's own entry,
 * even when linked to an Anomaly), else the rank frozen in the saved snapshot.
 * The server's `app_private.companion_rank_tier` reads the same order.
 */
export function companionSourceRank(
	instance: CompanionSourceRef &
		Pick<CompanionInstanceRecord, "source_snapshot">,
): string | null {
	const mount = catalogMount(instance);
	const catalogRank = mount
		? mount.rank
		: instance.source_collection === "anomalies"
			? catalogAnomaly(instance, null)?.rank
			: null;
	return (
		trimmedOrNull(catalogRank) ??
		trimmedOrNull(
			asRecord(asRecord(instance.source_snapshot)?.sourceFields)?.rank,
		)
	);
}

export function companionSourceName(
	instance: CompanionSourceRef &
		Pick<CompanionInstanceRecord, "source_snapshot">,
): string {
	const frozen = asRecord(
		asRecord(instance.source_snapshot)?.sourceFields,
	)?.name;
	if (typeof frozen === "string" && frozen.trim()) return frozen;
	const mount = catalogMount(instance);
	return (
		mount?.name ??
		(instance.source_collection === "anomalies"
			? catalogAnomaly(instance, null)?.name
			: undefined) ??
		"Companion"
	);
}

export interface CompanionScalingSource {
	kind: CompanionScalingKind;
	/** The stat block an Anomaly companion or linked mount scales from. */
	anomaly: CompendiumAnomaly | null;
	/** The catalog entry, when the creature is a mount. */
	mount: CompendiumVehicle | null;
	hitDie: CompanionHitDie;
}

/** How a living creature scales, or null when it keeps its saved stats. */
export function resolveCompanionScalingSource(
	instance: CompanionSourceRef,
): CompanionScalingSource | null {
	const mount = catalogMount(instance);
	if (instance.source_collection === "anomalies" || mount?.anomaly_id) {
		const anomaly = catalogAnomaly(instance, mount);
		return {
			kind: "stat-block",
			anomaly,
			mount,
			hitDie:
				parseStatBlockHitDie(anomaly?.hit_dice) ??
				sizeHitDie(anomaly?.size ?? mount?.size) ??
				UNKNOWN_SIZE_HIT_DIE,
		};
	}
	if (mount?.combat_capable) {
		return {
			kind: "size",
			anomaly: null,
			mount,
			hitDie: sizeHitDie(mount.size) ?? UNKNOWN_SIZE_HIT_DIE,
		};
	}
	return null;
}

export function isLevelScaledCompanion(instance: CompanionSourceRef): boolean {
	return resolveCompanionScalingSource(instance) !== null;
}

/** A companion scales with the character that owns it, never with a rider. */
export function companionScalingCharacterId(
	instance: Pick<
		CompanionInstanceRecord,
		| "owner_character_id"
		| "primary_handler_character_id"
		| "combat_controller_character_id"
	>,
): string | null {
	return (
		instance.owner_character_id ??
		instance.primary_handler_character_id ??
		instance.combat_controller_character_id ??
		null
	);
}

/**
 * Scaled numbers for one living creature at its owner's level. `fallbackRank`
 * applies only when neither the catalog nor the snapshot records a rank.
 */
export function scaleCompanionInstance(
	instance: CompanionSourceRef &
		Pick<CompanionInstanceRecord, "source_snapshot">,
	level: number | null | undefined,
	fallbackRank: string | null = null,
): ScaledCompanionCombatStats | null {
	const source = resolveCompanionScalingSource(instance);
	return source
		? scaleCompanionAtLevel(level, {
				rank: companionSourceRank(instance) ?? fallbackRank,
				hitDie: source.hitDie,
				kind: source.kind,
			})
		: null;
}

// ── Hit Dice ────────────────────────────────────────────────────────────

export interface CompanionHitDicePool {
	die: CompanionHitDie;
	/** L dice at the owner's level. */
	max: number;
	/** Spent on Short Rests since the last Long Rest. */
	spent: number;
	available: number;
}

/**
 * A level-scaled companion has L Hit Dice of its scaling die (RA-10). It
 * spends them on a Short Rest and regains half on a Long Rest, as its
 * character does; the server counts spent dice in `combat_state.hitDiceSpent`.
 * A companion that keeps its saved stats has no Hit Dice.
 */
export function companionHitDicePool(
	instance: Pick<CompanionInstanceRecord, "combat_state">,
	scaling: ScaledCompanionCombatStats | null,
): CompanionHitDicePool | null {
	if (!scaling) return null;
	const raw = asRecord(instance.combat_state)?.hitDiceSpent;
	const spent =
		typeof raw === "number" && Number.isFinite(raw)
			? Math.min(scaling.level, Math.max(0, Math.floor(raw)))
			: 0;
	return {
		die: scaling.hitDie,
		max: scaling.level,
		spent,
		available: scaling.level - spent,
	};
}

// ── Merged actions and traits ───────────────────────────────────────────

/** Where an action sits in the action economy. */
export type CompanionActionGroup =
	| "action"
	| "bonus"
	| "reaction"
	| "legendary";
export type CompanionActionSource = "anomaly" | "mount" | "natural";
export type CompanionActionKind = "attack" | "save" | "other";

export interface ScaledCompanionAction {
	name: string;
	source: CompanionActionSource;
	group: CompanionActionGroup;
	kind: CompanionActionKind;
	attackBonus: number | null;
	saveDc: number | null;
	/** The first damage roll, e.g. `2d8 + 3`. */
	damage: string | null;
	damageType: string | null;
	recharge: string | null;
	/** Authored use limit, e.g. a legendary action's `1/round`. */
	frequency: string | null;
	description: string;
}

export interface ScaledCompanionTrait {
	name: string;
	source: "anomaly" | "mount";
	/** Authored use limit, e.g. `once-per-day`. */
	frequency: string | null;
	description: string;
}

export interface MergedCompanionCombat {
	traits: ScaledCompanionTrait[];
	actions: ScaledCompanionAction[];
	anomalyId: string | null;
}

const GROUP_ORDER: readonly CompanionActionGroup[] = [
	"action",
	"bonus",
	"reaction",
	"legendary",
];
const ATTACK_TEXT =
	/\b(?:melee|ranged)\s+(?:weapon|spell)\s+attack\b|\bto hit\b|\bon a hit\b|\bhit:/i;
const SAVE_TEXT = /\bsaving throw\b|\bsave\b|\bDC\s*\d+/i;
const RECHARGE_TEXT = /\brecharge\s+(\d+(?:\s*[–-]\s*\d+)?)/i;

function mountAbilityGroup(actionType: string): CompanionActionGroup | null {
	const normalized = actionType
		.trim()
		.toLowerCase()
		.replaceAll("_", "-")
		.replaceAll(" ", "-");
	if (normalized === "passive") return null;
	if (normalized === "bonus" || normalized === "bonus-action") return "bonus";
	if (normalized === "reaction") return "reaction";
	if (normalized === "legendary") return "legendary";
	return "action";
}

function scaledAction(input: {
	name: string;
	description: string;
	source: CompanionActionSource;
	group: CompanionActionGroup;
	scaled: ScaledCompanionCombatStats;
	attackBonus?: unknown;
	save?: unknown;
	dc?: unknown;
	damage?: unknown;
	damageType?: unknown;
	recharge?: unknown;
	frequency?: unknown;
}): ScaledCompanionAction {
	const { description, scaled } = input;
	const kind: CompanionActionKind =
		typeof input.attackBonus === "number" || ATTACK_TEXT.test(description)
			? "attack"
			: nonEmptyString(input.save) ||
					typeof input.dc === "number" ||
					SAVE_TEXT.test(description)
				? "save"
				: "other";
	const rewritten = rewriteCompanionText(
		description,
		scaled,
		kind === "attack" ? "attack" : "dice",
	);
	// Structured damage with no dice in the text still scales by count.
	const structuredDie = /d(\d+)/i.exec(nonEmptyString(input.damage) ?? "")?.[1];
	const damage =
		rewritten.firstDamage ??
		(structuredDie
			? companionDamageExpression(
					scaled.damageDiceCount,
					Number(structuredDie),
					kind === "attack" ? scaled.proficiencyBonus : 0,
				)
			: null);
	const hasDc =
		kind === "save" ||
		typeof input.dc === "number" ||
		/\bDC\s*\d+/i.test(description);
	const recharge =
		nonEmptyString(input.recharge) ?? RECHARGE_TEXT.exec(description)?.[1];
	return {
		name: input.name,
		source: input.source,
		group: input.group,
		kind,
		attackBonus: kind === "attack" ? scaled.attackBonus : null,
		saveDc: hasDc ? scaled.saveDc : null,
		damage,
		damageType:
			nonEmptyString(input.damageType)?.toLowerCase() ??
			rewritten.firstDamageType,
		recharge: recharge ? recharge.replace(/\s*–\s*/g, "-") : null,
		frequency: nonEmptyString(input.frequency),
		description: rewritten.text,
	};
}

function naturalAttackAction(
	attack: CompendiumMountNaturalAttack,
	mount: CompendiumVehicle,
	scaled: ScaledCompanionCombatStats,
): ScaledCompanionAction {
	const reach = attack.reach ?? NATURAL_ATTACK_REACH_FT;
	const damage = companionDamageExpression(
		scaled.damageDiceCount,
		naturalAttackDie(attack, mount.size),
		scaled.proficiencyBonus,
	);
	return {
		name: attack.name,
		source: "natural",
		group: "action",
		kind: "attack",
		attackBonus: scaled.attackBonus,
		saveDc: null,
		damage,
		damageType: attack.damage_type,
		recharge: null,
		frequency: null,
		description: `Melee Weapon Attack: +${scaled.attackBonus} to hit, reach ${reach} ft., one target. Hit: ${damage} ${attack.damage_type} damage.`,
	};
}

const nameKey = (name: string) => name.trim().toLowerCase();

/** Unlimited or recharge-gated use is already implied by the entry itself. */
const usageLimit = (usage: unknown): string | null => {
	const value = nonEmptyString(usage);
	return value && !["at-will", "recharge"].includes(value.toLowerCase())
		? value
		: null;
};

/**
 * One creature's scaled actions and traits. A linked Anomaly contributes its
 * actions, bonus actions, reactions, legendary actions, and traits; the mount
 * overlay adds its own abilities and replaces a same-named Anomaly entry.
 * Lair actions and regional effects stay with a wild creature's lair.
 */
export function mergeCompanionCombat(
	instance: CompanionSourceRef,
	scaled: ScaledCompanionCombatStats,
): MergedCompanionCombat {
	const source = resolveCompanionScalingSource(instance);
	if (!source) return { traits: [], actions: [], anomalyId: null };
	const { anomaly, mount } = source;
	const overlayNames = new Set(
		(mount?.abilities ?? []).map((ability) => nameKey(ability.name)),
	);
	const fromAnomaly = <T extends { name?: string }>(entries: T[] | undefined) =>
		(entries ?? []).filter(
			(entry): entry is T & { name: string } =>
				!!nonEmptyString(entry.name) &&
				!overlayNames.has(nameKey(entry.name ?? "")),
		);
	const naturalAttacks = mount
		? (mount.natural_attacks ?? [])
				.filter((attack) => !overlayNames.has(nameKey(attack.name)))
				.map((attack) => naturalAttackAction(attack, mount, scaled))
		: [];

	const actions: ScaledCompanionAction[] = [
		...fromAnomaly(anomaly?.actions).map((entry) =>
			scaledAction({
				name: entry.name,
				description: entry.description,
				source: "anomaly",
				group: "action",
				scaled,
				attackBonus: entry.attack_bonus,
				save: entry.save,
				dc: entry.dc,
				damage: entry.damage,
				damageType: entry.damage_type,
				recharge: entry.recharge,
				frequency: usageLimit(entry.usage),
			}),
		),
		...fromAnomaly(anomaly?.bonus_actions).map((entry) =>
			scaledAction({
				name: entry.name,
				description: entry.description,
				source: "anomaly",
				group: "bonus",
				scaled,
			}),
		),
		...fromAnomaly(anomaly?.reactions).map((entry) =>
			scaledAction({
				name: entry.name,
				description: entry.description,
				source: "anomaly",
				group: "reaction",
				scaled,
			}),
		),
		...fromAnomaly(anomaly?.legendary_actions).map((entry) =>
			scaledAction({
				name: entry.name,
				description: entry.description ?? "",
				source: "anomaly",
				group: "legendary",
				scaled,
				dc: entry.dc,
				frequency: entry.frequency,
			}),
		),
		...naturalAttacks,
		...(mount?.abilities ?? []).flatMap((entry) => {
			const group = mountAbilityGroup(entry.action_type);
			return group
				? [
						scaledAction({
							name: entry.name,
							description: entry.description,
							source: "mount",
							group,
							scaled,
						}),
					]
				: [];
		}),
	];
	// Groups follow the action economy; Multiattack leads its group, as in a stat block.
	const order = (entry: ScaledCompanionAction) =>
		GROUP_ORDER.indexOf(entry.group) * 2 +
		(nameKey(entry.name) === "multiattack" ? 0 : 1);
	actions.sort((left, right) => order(left) - order(right));

	const namedElsewhere = new Set(
		[
			...(anomaly?.traits ?? []),
			...(anomaly?.actions ?? []),
			...(anomaly?.bonus_actions ?? []),
			...(anomaly?.reactions ?? []),
			...(anomaly?.legendary_actions ?? []),
		].flatMap((entry) => (entry.name ? [nameKey(entry.name)] : [])),
	);
	const traits: ScaledCompanionTrait[] = [
		...fromAnomaly(anomaly?.traits).map((entry) => ({
			name: entry.name,
			source: "anomaly" as const,
			frequency: usageLimit(entry.frequency),
			description: scaleCompanionText(entry.description, scaled, "dice"),
		})),
		...(anomaly?.abilities ?? [])
			.filter(
				(name) =>
					!namedElsewhere.has(nameKey(name)) &&
					!overlayNames.has(nameKey(name)),
			)
			.map((name) => ({
				name,
				source: "anomaly" as const,
				frequency: null,
				description:
					"Named in the stat block without rules text; the Warden adjudicates its effect.",
			})),
		...(mount?.abilities ?? [])
			.filter((entry) => mountAbilityGroup(entry.action_type) === null)
			.map((entry) => ({
				name: entry.name,
				source: "mount" as const,
				frequency: null,
				description: scaleCompanionText(entry.description, scaled, "dice"),
			})),
	];
	return { traits, actions, anomalyId: anomaly?.id ?? null };
}

// ── Species facts ───────────────────────────────────────────────────────

const ABILITY_KEYS: ReadonlyArray<
	readonly [AbilityScore, keyof StatBlockAbilityScores]
> = [
	["STR", "strength"],
	["AGI", "agility"],
	["VIT", "vitality"],
	["INT", "intelligence"],
	["SENSE", "sense"],
	["PRE", "presence"],
];
type StatBlockAbilityScores = NonNullable<
	NonNullable<CompendiumAnomaly["stats"]>["ability_scores"]
>;

const ABILITY_BY_NAME: Readonly<Record<string, AbilityScore>> = {
	strength: "STR",
	str: "STR",
	agility: "AGI",
	agi: "AGI",
	vitality: "VIT",
	vit: "VIT",
	intelligence: "INT",
	int: "INT",
	sense: "SENSE",
	presence: "PRE",
	pre: "PRE",
};

/** Mount speed keys and stat-block extra speeds, as movement modes. */
const SPEED_MODES: Readonly<Record<string, string>> = {
	land: "walk",
	walk: "walk",
	air: "fly",
	fly: "fly",
	water: "swim",
	swim: "swim",
	climb: "climb",
	burrow: "burrow",
	rift: "rift",
};

/** `30 ft., fly 80 ft.`: walking speed first and unlabeled, as in a stat block. */
export function formatCompanionSpeeds(
	speeds: ReadonlyArray<{ mode: string; feet: number }>,
): string {
	return [...speeds]
		.sort(
			(left, right) =>
				Number(right.mode === "walk") - Number(left.mode === "walk"),
		)
		.map((entry) =>
			entry.mode === "walk"
				? `${entry.feet} ft.`
				: `${entry.mode} ${entry.feet} ft.`,
		)
		.join(", ");
}

export interface CompanionSpeciesFacts {
	/** The species stat block's name (differs from a mount's catalog name). */
	speciesName: string | null;
	size: string | null;
	creatureType: string | null;
	abilities: Array<{ ability: AbilityScore; score: number; modifier: number }>;
	/** Proficient saves: ability modifier + the companion's PB. */
	savingThrows: Array<{ ability: AbilityScore; bonus: number }>;
	/** Proficient skills: ability modifier + the companion's PB. */
	skills: Array<{ name: string; bonus: number }>;
	speeds: Array<{ mode: string; feet: number }>;
	senses: string | null;
	languages: string | null;
	damageVulnerabilities: string[];
	damageResistances: string[];
	damageImmunities: string[];
	conditionImmunities: string[];
	weaknesses: string[];
}

const stringList = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter(
				(entry): entry is string =>
					typeof entry === "string" && entry.trim().length > 0,
			)
		: [];

function speciesSpeeds(
	anomaly: CompendiumAnomaly | null,
	mount: CompendiumVehicle | null,
): CompanionSpeciesFacts["speeds"] {
	const entries: Array<[string, unknown]> = mount
		? Object.entries(mount.speed ?? {})
		: [
				["walk", anomaly?.stats?.speed ?? anomaly?.speed],
				...Object.entries(anomaly?.stats?.extra_speeds ?? {}),
			];
	return entries.flatMap(([key, feet]) => {
		const mode = SPEED_MODES[key.toLowerCase()];
		return mode && typeof feet === "number" && feet > 0 ? [{ mode, feet }] : [];
	});
}

/**
 * The species facts shown on a scaled companion's sheet. Ability scores,
 * senses, languages, and defenses come from the stat block; proficient saves
 * and skills use the companion's scaled proficiency bonus, and passive
 * Perception follows from them. A size-scaled mount has no stat block, so it
 * reports only its size and speeds.
 */
export function companionSpeciesFacts(
	instance: CompanionSourceRef,
	scaled: ScaledCompanionCombatStats,
): CompanionSpeciesFacts | null {
	const source = resolveCompanionScalingSource(instance);
	if (!source) return null;
	const { anomaly, mount } = source;
	const pb = scaled.proficiencyBonus;

	const scores = anomaly?.stats?.ability_scores;
	const abilityScores: Partial<Record<AbilityScore, number>> = {};
	const abilities = ABILITY_KEYS.flatMap(([ability, key]) => {
		const score = scores?.[key];
		if (typeof score !== "number" || !Number.isFinite(score)) return [];
		abilityScores[ability] = score;
		return [{ ability, score, modifier: getAbilityModifier(score) }];
	});
	const hasScores = abilities.length > 0;
	const allScores = abilityScores as Record<AbilityScore, number>;

	const proficientSaves = new Set(
		Object.keys(anomaly?.stats?.saving_throws ?? {}).flatMap((name) => {
			const ability = ABILITY_BY_NAME[name.trim().toLowerCase()];
			return ability ? [ability] : [];
		}),
	);
	const savingThrows = ABILITY_KEYS.flatMap(([ability]) => {
		const score = abilityScores[ability];
		return proficientSaves.has(ability) && score !== undefined
			? [{ ability, bonus: getAbilityModifier(score) + pb }]
			: [];
	});

	const proficientSkills = Object.keys(anomaly?.skills ?? {});
	const skills = hasScores
		? proficientSkills.flatMap((name) => {
				const definition = findSkillDefinition(name);
				return definition
					? [
							{
								name: definition.name,
								bonus: calculateSkillModifier(
									name,
									allScores,
									proficientSkills,
									[],
									pb,
								),
							},
						]
					: [];
			})
		: [];
	const passivePerception = hasScores
		? 10 +
			calculateSkillModifier("Perception", allScores, proficientSkills, [], pb)
		: null;
	const authoredSenses = nonEmptyString(anomaly?.senses);

	return {
		speciesName: anomaly?.name ?? mount?.name ?? null,
		size: nonEmptyString(mount?.size ?? anomaly?.size),
		creatureType: nonEmptyString(anomaly?.type),
		abilities,
		savingThrows,
		skills,
		speeds: speciesSpeeds(anomaly, mount),
		senses:
			authoredSenses && passivePerception !== null
				? authoredSenses.replace(
						/passive Perception \d+/i,
						`passive Perception ${passivePerception}`,
					)
				: authoredSenses,
		languages: nonEmptyString(anomaly?.languages),
		damageVulnerabilities: stringList(anomaly?.damage_vulnerabilities),
		damageResistances: stringList(anomaly?.damage_resistances),
		damageImmunities: stringList(anomaly?.damage_immunities),
		conditionImmunities: stringList(anomaly?.condition_immunities),
		weaknesses: stringList(anomaly?.weaknesses),
	};
}
