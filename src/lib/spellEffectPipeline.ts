/**
 * Spell Effect → Stat Pipeline
 *
 * Bridges `spellAutomation.ts` → the derived-stats stack so casting a
 * buff/debuff spell automatically updates computed character stats.
 *
 * Pipeline: castSpell() → createActiveSpellEffect() → persisted active-spell
 *   row → `useMergedCustomModifiers` → `useCharacterDerivedStats` recomputes.
 */

// ─── Types ──────────────────────────────────────────────────
export interface ActiveSpellEffectEntry {
	id: string;
	spellId: string;
	spellName: string;
	casterId: string;
	targetId: string;
	effects: SpellModifier[];
	concentration: boolean;
	durationRounds: number | null; // null = permanent/until dispelled
	remainingRounds: number | null;
	appliedAt: string; // ISO timestamp
	expiresAt: string | null;
	sourceType: "spell";
}

export interface SpellModifier {
	target: EffectTarget;
	value: number;
	type: "bonus" | "penalty" | "set" | "advantage" | "disadvantage";
	description?: string;
}

export type EffectTarget =
	| "ac"
	| "attack_rolls"
	| "saving_throws"
	| "ability_checks"
	| "damage"
	| "speed"
	| "hp_max"
	| "hp_temp"
	| "str"
	| "agi"
	| "vit"
	| "int"
	| "sense"
	| "pre"
	| "str_save"
	| "agi_save"
	| "vit_save"
	| "int_save"
	| "sense_save"
	| "pre_save"
	| "spell_dc"
	| "initiative";

// ─── Known Spell Effect Definitions ─────────────────────────
// Maps spell names to their mechanical effects for auto-application
const SPELL_EFFECT_MAP: Record<string, SpellModifier[]> = {
	bless: [
		{
			target: "attack_rolls",
			value: 3,
			type: "bonus",
			description: "+1d4 (avg 2.5, rounded up)",
		},
		{
			target: "saving_throws",
			value: 3,
			type: "bonus",
			description: "+1d4 (avg 2.5, rounded up)",
		},
	],
	"shield of faith": [{ target: "ac", value: 2, type: "bonus" }],
	shield: [{ target: "ac", value: 5, type: "bonus" }],
	haste: [
		{ target: "ac", value: 2, type: "bonus" },
		{ target: "agi_save", value: 0, type: "advantage" },
		{ target: "speed", value: 2, type: "bonus", description: "speed doubled" },
	],
	"mage armor": [
		{ target: "ac", value: 13, type: "set", description: "13 + AGI mod" },
	],
	barkskin: [
		{
			target: "ac",
			value: 16,
			type: "set",
			description: "AC cannot be less than 16",
		},
	],
	aid: [
		{
			target: "hp_max",
			value: 5,
			type: "bonus",
			description: "+5 HP max (scales)",
		},
	],
	heroism: [
		{
			target: "hp_temp",
			value: 0,
			type: "bonus",
			description: "Gain temp HP = casting mod each turn",
		},
	],
	"protection from evil and good": [
		{
			target: "attack_rolls",
			value: 0,
			type: "disadvantage",
			description: "Enemy attacks have disadvantage",
		},
	],
	blur: [
		{
			target: "attack_rolls",
			value: 0,
			type: "disadvantage",
			description: "Enemy attacks have disadvantage",
		},
	],
	"enhance ability": [
		{
			target: "ability_checks",
			value: 0,
			type: "advantage",
			description: "Chosen ability checks",
		},
	],
	longstrider: [{ target: "speed", value: 10, type: "bonus" }],
	resistance: [
		{
			target: "saving_throws",
			value: 3,
			type: "bonus",
			description: "+1d4 (avg 2.5, rounded up)",
		},
	],
	guidance: [
		{
			target: "ability_checks",
			value: 3,
			type: "bonus",
			description: "+1d4 (avg 2.5, rounded up)",
		},
	],
};

// ─── Pipeline Functions ─────────────────────────────────────

/**
 * Create an active spell effect entry from a cast spell
 */
export function createActiveSpellEffect(
	spellName: string,
	casterId: string,
	targetId: string,
	concentration: boolean,
	durationRounds: number | null,
	overrides?: Partial<SpellModifier>[],
): ActiveSpellEffectEntry {
	const canonicalName = spellName.toLowerCase().trim();
	const effects = overrides?.length
		? overrides.map((o) => ({
				target: "ac" as EffectTarget,
				value: 0,
				type: "bonus" as const,
				...o,
			}))
		: (SPELL_EFFECT_MAP[canonicalName] ?? []);

	return {
		id: `spell-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		spellId: canonicalName,
		spellName,
		casterId,
		targetId,
		effects,
		concentration,
		durationRounds,
		remainingRounds: durationRounds,
		appliedAt: new Date().toISOString(),
		expiresAt: null,
		sourceType: "spell",
	};
}

/**
 * Drop concentration — removes all concentration spells from a caster
 */
export function dropConcentration(
	activeSpells: ActiveSpellEffectEntry[],
	casterId: string,
): { updated: ActiveSpellEffectEntry[]; dropped: string[] } {
	const dropped: string[] = [];
	const updated = activeSpells.filter((s) => {
		if (s.casterId === casterId && s.concentration) {
			dropped.push(s.id);
			return false;
		}
		return true;
	});
	return { updated, dropped };
}

/**
 * Check if a spell has known mechanical effects
 */
export function hasKnownEffects(spellName: string): boolean {
	return spellName.toLowerCase().trim() in SPELL_EFFECT_MAP;
}
