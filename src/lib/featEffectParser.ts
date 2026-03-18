/**
 * Feat & Fighting Style Effect Parser
 *
 * Parses SA feats and fighting styles into mechanical FeatEffect[] for the
 * characterEngine aggregation pipeline. Priority 200 (above equipment 100,
 * below spells 300).
 *
 * Uses standalone FeatEffect type (broader than characterEngine's Effect)
 * to support combat-specific targets. Will be bridged to the engine at integration time.
 */

/** Standalone effect type — broader than characterEngine.Effect to support feat/style targets */
export interface FeatEffect {
	source: string;
	target: string;
	value: number;
	type: "bonus" | "set" | "advantage" | "disadvantage";
	priority: number;
	description: string;
}

// ─── Fighting Style Effects ─────────────────────────────────
const FIGHTING_STYLE_EFFECTS: Record<string, FeatEffect[]> = {
	archery: [
		{
			source: "Fighting Style: Archery",
			target: "ranged_attack",
			value: 2,
			type: "bonus",
			priority: 200,
			description: "+2 to ranged attack rolls",
		},
	],
	defense: [
		{
			source: "Fighting Style: Defense",
			target: "ac",
			value: 1,
			type: "bonus",
			priority: 200,
			description: "+1 AC while wearing armor",
		},
	],
	dueling: [
		{
			source: "Fighting Style: Dueling",
			target: "melee_damage",
			value: 2,
			type: "bonus",
			priority: 200,
			description: "+2 damage with one-handed melee",
		},
	],
	"great weapon fighting": [
		{
			source: "Fighting Style: Great Weapon",
			target: "damage_reroll",
			value: 2,
			type: "bonus",
			priority: 200,
			description: "Reroll 1s and 2s on damage dice",
		},
	],
	protection: [
		{
			source: "Fighting Style: Protection",
			target: "ally_ac",
			value: 0,
			type: "disadvantage",
			priority: 200,
			description:
				"Impose disadvantage on attacks against adjacent allies (reaction)",
		},
	],
	"two-weapon fighting": [
		{
			source: "Fighting Style: Two-Weapon",
			target: "offhand_damage",
			value: 0,
			type: "bonus",
			priority: 200,
			description: "Add ability modifier to off-hand damage",
		},
	],
	"blind fighting": [
		{
			source: "Fighting Style: Blind Fighting",
			target: "blindsight",
			value: 10,
			type: "bonus",
			priority: 200,
			description: "10 ft. blindsight",
		},
	],
	interception: [
		{
			source: "Fighting Style: Interception",
			target: "damage_reduction",
			value: 10,
			type: "bonus",
			priority: 200,
			description: "Reduce damage to ally by 1d10 + proficiency (reaction)",
		},
	],
	"thrown weapon fighting": [
		{
			source: "Fighting Style: Thrown Weapon",
			target: "thrown_damage",
			value: 2,
			type: "bonus",
			priority: 200,
			description: "+2 damage with thrown weapons",
		},
	],
	"unarmed fighting": [
		{
			source: "Fighting Style: Unarmed",
			target: "unarmed_damage",
			value: 8,
			type: "set",
			priority: 200,
			description: "Unarmed strikes deal 1d6/1d8 + STR",
		},
	],
};

// ─── Feat Effects ───────────────────────────────────────────
const FEAT_EFFECTS: Record<string, (level: number) => FeatEffect[]> = {
	alert: () => [
		{
			source: "Feat: Alert",
			target: "initiative",
			value: 5,
			type: "bonus",
			priority: 200,
			description: "+5 to initiative",
		},
		{
			source: "Feat: Alert",
			target: "surprise_immunity",
			value: 1,
			type: "bonus",
			priority: 200,
			description: "Cannot be surprised",
		},
	],
	tough: (level) => [
		{
			source: "Feat: Tough",
			target: "hp_max",
			value: level * 2,
			type: "bonus",
			priority: 200,
			description: `+${level * 2} HP (2 per level)`,
		},
	],
	observant: () => [
		{
			source: "Feat: Observant",
			target: "passive_perception",
			value: 5,
			type: "bonus",
			priority: 200,
			description: "+5 passive Perception and Investigation",
		},
		{
			source: "Feat: Observant",
			target: "passive_investigation",
			value: 5,
			type: "bonus",
			priority: 200,
			description: "+5 passive Investigation",
		},
	],
	mobile: () => [
		{
			source: "Feat: Mobile",
			target: "speed",
			value: 10,
			type: "bonus",
			priority: 200,
			description: "+10 ft. speed",
		},
	],
	sentinel: () => [
		{
			source: "Feat: Sentinel",
			target: "opportunity_attack",
			value: 1,
			type: "bonus",
			priority: 200,
			description: "Enemies hit by your opportunity attack have 0 speed",
		},
	],
	"war caster": () => [
		{
			source: "Feat: War Caster",
			target: "concentration_save",
			value: 0,
			type: "advantage",
			priority: 200,
			description: "Advantage on concentration saves",
		},
	],
	resilient: () => [
		{
			source: "Feat: Resilient",
			target: "saving_throws",
			value: 0,
			type: "bonus",
			priority: 200,
			description: "Proficiency in chosen saving throw",
		},
	],
	lucky: () => [
		{
			source: "Feat: Lucky",
			target: "luck_points",
			value: 3,
			type: "bonus",
			priority: 200,
			description: "3 luck points per long rest",
		},
	],
	"heavily armored": () => [
		{
			source: "Feat: Heavily Armored",
			target: "str",
			value: 1,
			type: "bonus",
			priority: 200,
			description: "+1 STR",
		},
	],
	sharpshooter: () => [
		{
			source: "Feat: Sharpshooter",
			target: "ranged_attack",
			value: -5,
			type: "bonus",
			priority: 200,
			description: "Can take -5 attack for +10 damage",
		},
		{
			source: "Feat: Sharpshooter",
			target: "ranged_damage",
			value: 10,
			type: "bonus",
			priority: 200,
			description: "+10 damage (when using power attack)",
		},
	],
	"great weapon master": () => [
		{
			source: "Feat: Great Weapon Master",
			target: "melee_attack",
			value: -5,
			type: "bonus",
			priority: 200,
			description: "Can take -5 attack for +10 damage",
		},
		{
			source: "Feat: Great Weapon Master",
			target: "melee_damage",
			value: 10,
			type: "bonus",
			priority: 200,
			description: "+10 damage (when using power attack)",
		},
	],
	"defensive duelist": () => [
		{
			source: "Feat: Defensive Duelist",
			target: "ac",
			value: 0,
			type: "bonus",
			priority: 200,
			description: "Add proficiency to AC vs one attack (reaction)",
		},
	],
	"mage slayer": () => [
		{
			source: "Feat: Mage Slayer",
			target: "concentration_break",
			value: 0,
			type: "advantage",
			priority: 200,
			description: "Advantage on saves vs. spells from adjacent casters",
		},
	],
};

// ─── Parser Functions ───────────────────────────────────────

/**
 * Parse fighting style name into Effect[]
 */
export function parseFightingStyleEffects(styleName: string): FeatEffect[] {
	const key = styleName.toLowerCase().trim();
	return FIGHTING_STYLE_EFFECTS[key] ?? [];
}

/**
 * Parse feat name into Effect[] (some feats scale with level)
 */
export function parseFeatEffects(
	featName: string,
	characterLevel: number,
): FeatEffect[] {
	const key = featName.toLowerCase().trim();
	const factory = FEAT_EFFECTS[key];
	return factory ? factory(characterLevel) : [];
}

/**
 * Parse all character feats + fighting styles into aggregated Effect[]
 */
export function aggregateFeatAndStyleEffects(
	feats: string[],
	fightingStyles: string[],
	characterLevel: number,
): FeatEffect[] {
	const effects: FeatEffect[] = [];

	for (const feat of feats) {
		effects.push(...parseFeatEffects(feat, characterLevel));
	}

	for (const style of fightingStyles) {
		effects.push(...parseFightingStyleEffects(style));
	}

	return effects;
}

/**
 * Compute attacks per action from Job + Regent features
 */
export function computeAttacksPerAction(
	job: string | null | undefined,
	level: number,
	regentIds: string[],
	hasExtraAttack: boolean = false,
): number {
	let attacks = 1;

	if (!job) return attacks;

	const j = job.toLowerCase().trim();

	// Martial Jobs get Extra Attack at level 5
	const martialJobs = [
		"destroyer",
		"berserker",
		"striker",
		"holy knight",
		"stalker",
	];
	if (martialJobs.includes(j) && level >= 5) {
		attacks = 2;
	}

	// Destroyer gets 3 attacks at level 11, 4 at level 20 (Fighter-like)
	if (j === "destroyer") {
		if (level >= 20) attacks = 4;
		else if (level >= 11) attacks = 3;
	}

	// Regent bonus attacks
	for (const regentId of regentIds) {
		const r = regentId.toLowerCase().trim();
		if (r === "steel" || r === "titan") {
			// Steel/Titan Regents grant an additional attack at regent unlock
			attacks = Math.max(attacks, 2);
		}
	}

	// Feature-granted extra attack
	if (hasExtraAttack && attacks < 2) {
		attacks = 2;
	}

	return attacks;
}

/**
 * Check if a feat name has known mechanical effects
 */
export function hasFeatEffects(featName: string): boolean {
	return featName.toLowerCase().trim() in FEAT_EFFECTS;
}

/**
 * Check if a fighting style has known effects
 */
export function hasFightingStyleEffects(styleName: string): boolean {
	return styleName.toLowerCase().trim() in FIGHTING_STYLE_EFFECTS;
}
