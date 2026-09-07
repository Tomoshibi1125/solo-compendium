export type ConditionAutomationState =
	| "automated"
	| "manual"
	| "review-blocked";

export type ConditionEffectPerspective = "self" | "against";

export type MechanicalEffectType =
	| "disadvantage"
	| "advantage"
	| "auto_fail"
	| "speed_zero"
	| "speed_halved"
	| "modifier"
	| "incapacitated"
	| "prohibited_action"
	| "damage_resistance";

export interface MechanicalEffect {
	type: MechanicalEffectType;
	target: string;
	/** Whether the effect changes the bearer or a roll made against the bearer. */
	perspective?: ConditionEffectPerspective;
	value?: number;
}

export interface ConditionEffect {
	id: string;
	name: string;
	description: string;
	/** Whether this catalog entry is safe to execute without a table ruling. */
	automationState: ConditionAutomationState;
	mechanicalEffects: MechanicalEffect[];
	/** Human-readable explanation for prose that deliberately remains manual. */
	manualReason?: string;
	/** Catalog prose intentionally excluded from executable mechanics. */
	manualEffects?: string[];
}

export const CONDITION_CATALOG_IDS = [
	"blinded",
	"charmed",
	"deafened",
	"exhaustion",
	"frightened",
	"grappled",
	"incapacitated",
	"invisible",
	"paralyzed",
	"petrified",
	"poisoned",
	"prone",
	"restrained",
	"stunned",
	"unconscious",
	"shadow-corrupted",
	"gate-exhausted",
	"essence-drained",
	"shadow-bound",
	"regent-marked",
	"shadow-fused",
] as const;

export type CatalogConditionId = (typeof CONDITION_CATALOG_IDS)[number];

/**
 * Authoritative executable condition vocabulary.
 *
 * Entries may include a safe mechanical subset and explicitly list contextual
 * prose that still needs a table ruling. Rift-specific prose-only conditions
 * are intentionally represented as manual entries with no executable effects;
 * callers must never infer mechanics from their descriptions.
 */
export const CONDITION_EFFECTS: Record<string, ConditionEffect> = {
	blinded: {
		id: "blinded",
		name: "Blinded",
		description:
			"Cannot see. Auto-fails checks requiring sight. Attack rolls have disadvantage. Attacks against have advantage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "auto_fail", target: "sight_checks" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
	},
	charmed: {
		id: "charmed",
		name: "Charmed",
		description:
			"Cannot attack the charmer. Charmer has advantage on social checks.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "prohibited_action", target: "attack-charmer" },
		],
		manualEffects: ["Identify the charmer for harmful-action restrictions."],
	},
	deafened: {
		id: "deafened",
		name: "Deafened",
		description: "Cannot hear. Auto-fails checks requiring hearing.",
		automationState: "automated",
		mechanicalEffects: [{ type: "auto_fail", target: "hearing_checks" }],
	},
	exhaustion: {
		id: "exhaustion",
		name: "Exhaustion",
		description:
			"Cumulative six-level condition resolved by the numeric exhaustion table.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"A string condition has no level. Use the numeric exhaustionLevel and EXHAUSTION_TABLE APIs.",
	},
	frightened: {
		id: "frightened",
		name: "Frightened",
		description:
			"Disadvantage on ability checks and attack rolls while the source of fear is in line of sight.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "disadvantage", target: "ability_checks" },
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "prohibited_action", target: "move-toward-source" },
		],
		manualEffects: ["Confirm that the source of fear is in line of sight."],
	},
	grappled: {
		id: "grappled",
		name: "Grappled",
		description: "Speed becomes 0.",
		automationState: "automated",
		mechanicalEffects: [{ type: "speed_zero", target: "speed" }],
	},
	incapacitated: {
		id: "incapacitated",
		name: "Incapacitated",
		description: "Cannot take actions or reactions.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "incapacitated", target: "actions" },
			{ type: "prohibited_action", target: "action" },
			{ type: "prohibited_action", target: "reaction" },
		],
	},
	invisible: {
		id: "invisible",
		name: "Invisible",
		description:
			"Advantage on attack rolls. Attacks against have disadvantage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "advantage", target: "attack_rolls" },
			{
				type: "disadvantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
	},
	paralyzed: {
		id: "paralyzed",
		name: "Paralyzed",
		description:
			"Incapacitated. Speed 0. Auto-fail STR and AGI saves. Attacks against have advantage. Nearby hits are critical.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "incapacitated", target: "actions" },
			{ type: "speed_zero", target: "speed" },
			{ type: "auto_fail", target: "STR_saves" },
			{ type: "auto_fail", target: "AGI_saves" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
		manualEffects: ["Confirm range before converting a hit to a critical hit."],
	},
	petrified: {
		id: "petrified",
		name: "Petrified",
		description:
			"Incapacitated. Speed 0. Auto-fail STR and AGI saves. Resistance to all damage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "incapacitated", target: "actions" },
			{ type: "speed_zero", target: "speed" },
			{ type: "auto_fail", target: "STR_saves" },
			{ type: "auto_fail", target: "AGI_saves" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
			{ type: "damage_resistance", target: "all_damage" },
		],
		manualEffects: ["Poison/disease immunity and transformation details."],
	},
	poisoned: {
		id: "poisoned",
		name: "Poisoned",
		description: "Disadvantage on attack rolls and ability checks.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "disadvantage", target: "ability_checks" },
		],
	},
	prone: {
		id: "prone",
		name: "Prone",
		description:
			"Disadvantage on attack rolls. Nearby attacks against have advantage; distant attacks have disadvantage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "disadvantage", target: "attack_rolls" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
		manualEffects: [
			"The incoming attack modifier assumes the tracker legacy nearby-attacker behavior; adjudicate distant attacks manually.",
			"Crawling and standing movement costs.",
		],
	},
	restrained: {
		id: "restrained",
		name: "Restrained",
		description:
			"Speed 0. Disadvantage on AGI saves and attack rolls. Attacks against have advantage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "speed_zero", target: "speed" },
			{ type: "disadvantage", target: "AGI_saves" },
			{ type: "disadvantage", target: "attack_rolls" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
	},
	stunned: {
		id: "stunned",
		name: "Stunned",
		description:
			"Incapacitated. Speed 0. Auto-fail STR and AGI saves. Attacks against have advantage.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "incapacitated", target: "actions" },
			{ type: "speed_zero", target: "speed" },
			{ type: "auto_fail", target: "STR_saves" },
			{ type: "auto_fail", target: "AGI_saves" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
	},
	unconscious: {
		id: "unconscious",
		name: "Unconscious",
		description:
			"Incapacitated. Speed 0. Auto-fail STR and AGI saves. Attacks against have advantage. Nearby hits are critical.",
		automationState: "automated",
		mechanicalEffects: [
			{ type: "incapacitated", target: "actions" },
			{ type: "speed_zero", target: "speed" },
			{ type: "auto_fail", target: "STR_saves" },
			{ type: "auto_fail", target: "AGI_saves" },
			{
				type: "advantage",
				target: "incoming_attack_rolls",
				perspective: "against",
			},
		],
		manualEffects: [
			"Dropping held items and falling prone.",
			"Confirm range before converting a hit to a critical hit.",
		],
	},
	"shadow-corrupted": {
		id: "shadow-corrupted",
		name: "Shadow Corrupted",
		description:
			"Shadow corruption with contextual saves, periodic damage, healing limits, and light interactions.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"The catalog prose depends on turn timing, damage, light level, and healing source metadata that this engine does not receive.",
	},
	"gate-exhausted": {
		id: "gate-exhausted",
		name: "Rift Exhausted",
		description:
			"Rift exposure exhaustion with ability, speed, shadow-action, and damage interactions.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"This is distinct from numeric exhaustion and its prose does not define executable values for every effect.",
	},
	"essence-drained": {
		id: "essence-drained",
		name: "Essence Drained",
		description:
			"Essence loss affecting maximum HP, saves, healing, and shadow attackers.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"The effect requires source-aware healing, attacker identity, and maximum-HP provenance.",
	},
	"shadow-bound": {
		id: "shadow-bound",
		name: "Shadow Bound",
		description: "A contextual bond to a specific master or location.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"The binder, binding point, movement, teleportation, and triggered damage require authored identities and choices.",
	},
	"regent-marked": {
		id: "regent-marked",
		name: "Regent Marked",
		description:
			"A Regent-specific tracking, communication, stealth, and disguise mark.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"The marked Regent and their servants must be explicitly identified; no identity may be inferred from prose.",
	},
	"shadow-fused": {
		id: "shadow-fused",
		name: "Shadow Fused",
		description:
			"Temporary shadow fusion with checks, resistances, senses, saves, and compulsory targeting.",
		automationState: "manual",
		mechanicalEffects: [],
		manualReason:
			"Turn timing, nearest-target selection, damage typing, and ability-specific context require explicit authored mechanics.",
	},
};

export function normalizeConditionId(value: string): string {
	return value.trim().toLowerCase();
}

export function getConditionEffect(
	conditionName: string,
): ConditionEffect | undefined {
	return CONDITION_EFFECTS[
		normalizeConditionId(conditionName) as CatalogConditionId
	];
}

export function getExecutableConditionEffects(
	conditions: readonly string[],
): MechanicalEffect[] {
	return conditions.flatMap(
		(conditionName) =>
			getConditionEffect(conditionName)?.mechanicalEffects ?? [],
	);
}

// ---------------------------------------------------------------------------
// Exhaustion table (SRD 5e)
// ---------------------------------------------------------------------------

export interface ExhaustionLevel {
	level: number;
	effects: MechanicalEffect[];
	description: string;
}

export const EXHAUSTION_TABLE: ExhaustionLevel[] = [
	{ level: 0, effects: [], description: "No exhaustion." },
	{
		level: 1,
		effects: [{ type: "disadvantage", target: "ability_checks" }],
		description: "Disadvantage on ability checks.",
	},
	{
		level: 2,
		effects: [
			{ type: "disadvantage", target: "ability_checks" },
			{ type: "speed_halved", target: "speed" },
		],
		description: "Disadvantage on ability checks. Speed halved.",
	},
	{
		level: 3,
		effects: [
			{ type: "disadvantage", target: "ability_checks" },
			{ type: "speed_halved", target: "speed" },
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "disadvantage", target: "saving_throws" },
		],
		description:
			"Disadvantage on ability checks, attack rolls, and saving throws. Speed halved.",
	},
	{
		level: 4,
		effects: [
			{ type: "disadvantage", target: "ability_checks" },
			{ type: "speed_halved", target: "speed" },
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "disadvantage", target: "saving_throws" },
			{ type: "modifier", target: "hp_max", value: -0.5 },
		],
		description: "All level 3 effects. HP maximum halved.",
	},
	{
		level: 5,
		effects: [
			{ type: "disadvantage", target: "ability_checks" },
			{ type: "speed_zero", target: "speed" },
			{ type: "disadvantage", target: "attack_rolls" },
			{ type: "disadvantage", target: "saving_throws" },
			{ type: "modifier", target: "hp_max", value: -0.5 },
		],
		description: "All level 4 effects. Speed reduced to 0.",
	},
	{ level: 6, effects: [], description: "Death." },
];

export type AdvantageState = "advantage" | "disadvantage" | "normal";

export type ConditionRollType =
	| "attack_rolls"
	| "ability_checks"
	| "saving_throws"
	| "AGI_saves"
	| "STR_saves"
	| "sight_checks"
	| "hearing_checks";

export interface RollModifiers {
	advantageState: AdvantageState;
	autoFail: boolean;
	flatModifier: number;
	speedMultiplier: number;
	hpMaxMultiplier: number;
	isIncapacitated: boolean;
	isDead: boolean;
	activeConditions: string[];
	exhaustionLevel: number;
}

function resolveAdvantageState(
	hasAdvantage: boolean,
	hasDisadvantage: boolean,
): AdvantageState {
	if (hasAdvantage === hasDisadvantage) return "normal";
	return hasAdvantage ? "advantage" : "disadvantage";
}

function normalizedExhaustionLevel(level: number): number {
	if (!Number.isFinite(level)) return 0;
	return Math.max(0, Math.floor(level));
}

/** Resolve bearer-facing condition and numeric exhaustion modifiers. */
export function resolveRollModifiers(
	conditions: string[],
	exhaustionLevel: number,
	rollType: ConditionRollType,
): RollModifiers {
	const normalizedExhaustion = normalizedExhaustionLevel(exhaustionLevel);
	const result: RollModifiers = {
		advantageState: "normal",
		autoFail: false,
		flatModifier: 0,
		speedMultiplier: 1,
		hpMaxMultiplier: 1,
		isIncapacitated: false,
		isDead: false,
		activeConditions: [...conditions],
		exhaustionLevel: normalizedExhaustion,
	};

	if (normalizedExhaustion >= 6) {
		result.isDead = true;
		return result;
	}

	let hasAdvantage = false;
	let hasDisadvantage = false;
	for (const effect of getExecutableConditionEffects(conditions)) {
		if ((effect.perspective ?? "self") !== "self") continue;

		if (effect.type === "incapacitated") result.isIncapacitated = true;
		if (effect.type === "speed_zero") result.speedMultiplier = 0;
		if (effect.type === "speed_halved" && result.speedMultiplier > 0) {
			result.speedMultiplier = Math.min(result.speedMultiplier, 0.5);
		}

		if (effect.target !== rollType && effect.target !== "all") continue;
		if (effect.type === "disadvantage") hasDisadvantage = true;
		if (effect.type === "advantage") hasAdvantage = true;
		if (effect.type === "auto_fail") result.autoFail = true;
		if (effect.type === "modifier") result.flatModifier += effect.value ?? 0;
	}

	const exhaustion = EXHAUSTION_TABLE[Math.min(normalizedExhaustion, 5)];
	for (const effect of exhaustion?.effects ?? []) {
		if (effect.target === rollType || effect.target === "all") {
			if (effect.type === "disadvantage") hasDisadvantage = true;
			if (effect.type === "advantage") hasAdvantage = true;
			if (effect.type === "auto_fail") result.autoFail = true;
		}
		if (effect.type === "speed_halved" && result.speedMultiplier > 0) {
			result.speedMultiplier = Math.min(result.speedMultiplier, 0.5);
		}
		if (effect.type === "speed_zero") result.speedMultiplier = 0;
		if (effect.type === "modifier" && effect.target === "hp_max") {
			result.hpMaxMultiplier = Math.min(result.hpMaxMultiplier, 0.5);
		}
	}

	result.advantageState = resolveAdvantageState(hasAdvantage, hasDisadvantage);
	return result;
}

/** Resolve modifiers contributed by conditions on the target of an attack. */
export function resolveIncomingAttackModifiers(
	conditions: readonly string[],
): AdvantageState {
	let hasAdvantage = false;
	let hasDisadvantage = false;
	for (const effect of getExecutableConditionEffects(conditions)) {
		if (effect.perspective !== "against") continue;
		if (effect.target !== "incoming_attack_rolls" && effect.target !== "all") {
			continue;
		}
		if (effect.type === "advantage") hasAdvantage = true;
		if (effect.type === "disadvantage") hasDisadvantage = true;
	}
	return resolveAdvantageState(hasAdvantage, hasDisadvantage);
}

export function hasConditionMechanicalEffect(
	conditions: readonly string[],
	type: MechanicalEffectType,
	target?: string,
	perspective: ConditionEffectPerspective = "self",
): boolean {
	return getExecutableConditionEffects(conditions).some(
		(effect) =>
			effect.type === type &&
			(effect.perspective ?? "self") === perspective &&
			(target === undefined || effect.target === target),
	);
}

export function hasAllDamageResistance(conditions: readonly string[]): boolean {
	return hasConditionMechanicalEffect(
		conditions,
		"damage_resistance",
		"all_damage",
	);
}

export function getEffectiveSpeed(
	baseSpeed: number,
	conditions: string[],
	exhaustionLevel: number,
): number {
	const mods = resolveRollModifiers(
		conditions,
		exhaustionLevel,
		"ability_checks",
	);
	return Math.floor(baseSpeed * mods.speedMultiplier);
}

/** Speed multiplier from numeric exhaustion alone. */
export function getExhaustionSpeedMultiplier(exhaustionLevel: number): number {
	const normalized = normalizedExhaustionLevel(exhaustionLevel);
	const exhaustion = EXHAUSTION_TABLE[Math.min(normalized, 5)];
	if (!exhaustion) return 1;
	let multiplier = 1;
	for (const effect of exhaustion.effects) {
		if (effect.type === "speed_zero") return 0;
		if (effect.type === "speed_halved") multiplier = Math.min(multiplier, 0.5);
	}
	return multiplier;
}

export function applyExhaustionToHpMax(
	baseHPMax: number,
	exhaustionLevel: number,
): number {
	if (normalizedExhaustionLevel(exhaustionLevel) >= 4) {
		return Math.max(1, Math.floor(baseHPMax * 0.5));
	}
	return baseHPMax;
}

export function isIncapacitated(conditions: string[]): boolean {
	return hasConditionMechanicalEffect(conditions, "incapacitated");
}

export function getActivePenaltySummary(
	conditions: string[],
	exhaustionLevel: number,
): string[] {
	const summaries: string[] = [];
	for (const conditionName of conditions) {
		const condition = getConditionEffect(conditionName);
		if (!condition) continue;
		const manual =
			condition.automationState === "automated"
				? ""
				: ` [${condition.automationState}: ${condition.manualReason ?? "table ruling required"}]`;
		summaries.push(`${condition.name}: ${condition.description}${manual}`);
	}

	const normalized = normalizedExhaustionLevel(exhaustionLevel);
	if (normalized > 0 && normalized <= 5) {
		summaries.push(
			`Exhaustion ${normalized}: ${EXHAUSTION_TABLE[normalized].description}`,
		);
	} else if (normalized >= 6) {
		summaries.push("Exhaustion 6: Death.");
	}
	return summaries;
}
