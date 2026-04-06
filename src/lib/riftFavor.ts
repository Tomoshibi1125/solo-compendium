// ── Rift Favor ────────────────────────────────────────────────────────
// Core mechanic: identical to D&D Inspiration (roll die, add to d20 roll).
// Additional usage options provide thematic versatility fitting the
// Rift Ascendant tone. Each costs 1 Rift Favor unless noted.

export interface RiftFavorOption {
	id: string;
	name: string;
	cost: number;
	description: string;
	rulesText: string;
	minLevel: number;
}

const SYSTEM_FAVOR_OPTIONS: RiftFavorOption[] = [
	// ── Core (D&D Inspiration equivalent) ──
	{
		id: "favor-inspiration",
		name: "System Boost",
		cost: 1,
		description:
			"The Rift augments your action. Add your Rift Favor die to one ability check, attack roll, or saving throw.",
		rulesText:
			"Before or after rolling a d20 for an ability check, attack roll, or saving throw, roll your Rift Favor die and add the result to the total. You must decide to use this before the Warden (Warden) declares the outcome.",
		minLevel: 1,
	},
	// ── Thematic extras ──
	{
		id: "favor-reroll",
		name: "System Override",
		cost: 1,
		description:
			"The Rift intervenes — reroll a failed d20 and take either result.",
		rulesText:
			"When you fail an ability check, attack roll, or saving throw, you may spend 1 Rift Favor to reroll the d20. You must use the new result, even if it is lower.",
		minLevel: 1,
	},
	{
		id: "favor-status-recovery",
		name: "System Recovery",
		cost: 1,
		description: "The Rift purges a harmful effect from your body.",
		rulesText:
			"As a bonus action, spend 1 Rift Favor to end one condition currently affecting you (except unconscious or dead). Alternatively, reduce your exhaustion level by 1.",
		minLevel: 3,
	},
	{
		id: "favor-death-defiance",
		name: "Death Defiance",
		cost: 2,
		description:
			"The Rift refuses to let you fall. When reduced to 0 HP, you cling to consciousness.",
		rulesText:
			"When you are reduced to 0 hit points but not killed outright, spend 2 Rift Favor to drop to 1 HP instead. You can use this after the damage is applied. Usable once per long rest.",
		minLevel: 5,
	},
	{
		id: "favor-system-insight",
		name: "System Insight",
		cost: 1,
		description:
			"The Rift reveals hidden information about a creature or object.",
		rulesText:
			"As an action, spend 1 Rift Favor to learn the AC, current HP percentage (full/bloodied/critical), one damage vulnerability, one damage resistance, or one condition immunity of a creature you can see within 60 feet.",
		minLevel: 1,
	},
	{
		id: "favor-flash-step",
		name: "Flash Step",
		cost: 1,
		description: "The Rift briefly accelerates your body beyond normal limits.",
		rulesText:
			"As part of your movement on your turn, spend 1 Rift Favor to teleport up to 10 feet to an unoccupied space you can see. This movement does not provoke opportunity attacks.",
		minLevel: 5,
	},
	{
		id: "favor-critical-surge",
		name: "Critical Surge",
		cost: 2,
		description: "Channel the Rift's power into a devastating strike.",
		rulesText:
			"When you hit with an attack, spend 2 Rift Favor to turn the hit into a critical hit. Usable once per long rest.",
		minLevel: 9,
	},
	{
		id: "favor-party-link",
		name: "Party Link",
		cost: 1,
		description: "The Rift synchronizes your awareness with nearby allies.",
		rulesText:
			"As a bonus action, spend 1 Rift Favor. Until the end of your next turn, you and all allies within 30 feet cannot be surprised, have advantage on initiative rolls, and can communicate telepathically.",
		minLevel: 7,
	},
];

export function getAvailableFavorOptions(level: number): RiftFavorOption[] {
	return SYSTEM_FAVOR_OPTIONS.filter((opt) => level >= opt.minLevel);
}

// Aligned with unified engine: 3/4/5/6 by tier (Rift Ascendant canonical formula)
export function getRiftFavorMax(level: number): number {
	if (level <= 4) return 3;
	if (level <= 10) return 4;
	if (level <= 16) return 5;
	return 6;
}

export function getRiftFavorDie(level: number): number {
	if (level <= 4) return 4;
	if (level <= 10) return 6;
	if (level <= 16) return 8;
	return 10;
}
