/**
 * Companion substrate — shared types + pure derivations for the character-sheet
 * Companions section (mounts, pets, familiars, sidekicks, and guild-NPC allies).
 *
 * Guild-ally companions are a snapshot of a recruited `SandboxNPC` (see
 * `src/data/compendium/sandbox-npcs.ts`) carried onto a character sheet via the
 * `character_extras` table. These helpers keep HP/AC math and JSON parsing in
 * one pure, unit-testable place so the panel, the sub-sheet, and the guild
 * "Add to Sheet" mutation all agree.
 */
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";

/** A single piece of gear equipped to a companion (lightweight, not slotted). */
export interface CompanionEquipment {
	/** Optional compendium item id, for a future item picker. */
	id?: string;
	name: string;
	/** Flat bonus added to the companion's AC while equipped. */
	ac_bonus?: number;
	/** Free-text attack line, e.g. "+5 to hit, reach 5 ft". */
	attack?: string;
	/** Free-text damage line, e.g. "1d8+3 slashing". */
	damage?: string;
	notes?: string;
}

/** A companion action/ability shown on the combat sub-sheet. */
export interface CompanionAbility {
	name: string;
	description?: string;
	action_type?: string;
}

/** A tracked condition on a companion (matches the shadow-soldier shape). */
export interface CompanionCondition {
	id: string;
	name: string;
	source?: string;
	applied_at: string;
}

/** Companion `extra_type` used for a guild NPC carried onto a sheet. */
export const GUILD_ALLY_EXTRA_TYPE = "ally";

/**
 * Effective HP for a guild NPC at a given level. Mirrors the formula used in
 * the guild roster (`GuildDetail.tsx`): base HP plus per-level HP for every
 * level gained since recruitment. Never drops below the base HP.
 */
export function leveledCompanionHp(npc: SandboxNPC, level: number): number {
	const gained = Math.max(0, (level || npc.level) - npc.level);
	return npc.hp + gained * npc.leveling.hpPerLevel;
}

/** Sum of AC bonuses from equipped gear (ignores non-finite bonuses). */
export function equipmentAcBonus(equipment: CompanionEquipment[]): number {
	return equipment.reduce((sum, item) => {
		const bonus = Number(item?.ac_bonus);
		return Number.isFinite(bonus) ? sum + bonus : sum;
	}, 0);
}

/** Base AC plus all equipped gear bonuses. */
export function effectiveCompanionAc(
	baseAc: number,
	equipment: CompanionEquipment[],
): number {
	return (Number.isFinite(baseAc) ? baseAc : 10) + equipmentAcBonus(equipment);
}

/** Derive a display ability list from an NPC's key abilities. */
export function abilitiesFromNpc(npc: SandboxNPC): CompanionAbility[] {
	return (npc.keyAbilities ?? []).map((name) => ({
		name,
		action_type: "action",
	}));
}

// ── JSON parsing (columns are `Json`; normalize to typed arrays) ────────────

export function parseEquipment(raw: unknown): CompanionEquipment[] {
	if (!Array.isArray(raw)) return [];
	return raw
		.filter(
			(e): e is Record<string, unknown> => typeof e === "object" && e !== null,
		)
		.map((e) => ({
			id: typeof e.id === "string" ? e.id : undefined,
			name: String(e.name ?? ""),
			ac_bonus:
				typeof e.ac_bonus === "number" && Number.isFinite(e.ac_bonus)
					? e.ac_bonus
					: undefined,
			attack: typeof e.attack === "string" ? e.attack : undefined,
			damage: typeof e.damage === "string" ? e.damage : undefined,
			notes: typeof e.notes === "string" ? e.notes : undefined,
		}))
		.filter((e) => e.name.length > 0);
}

export function parseAbilities(raw: unknown): CompanionAbility[] {
	if (!Array.isArray(raw)) return [];
	return raw
		.filter(
			(a): a is Record<string, unknown> => typeof a === "object" && a !== null,
		)
		.map((a) => ({
			name: String(a.name ?? ""),
			description:
				typeof a.description === "string" ? a.description : undefined,
			action_type: typeof a.action_type === "string" ? a.action_type : "action",
		}))
		.filter((a) => a.name.length > 0);
}

export function parseConditions(raw: unknown): CompanionCondition[] {
	if (!Array.isArray(raw)) return [];
	return raw
		.filter(
			(c): c is Record<string, unknown> => typeof c === "object" && c !== null,
		)
		.map((c) => ({
			id: String(c.id ?? crypto.randomUUID()),
			name: String(c.name ?? ""),
			source: typeof c.source === "string" ? c.source : undefined,
			applied_at:
				typeof c.applied_at === "string"
					? c.applied_at
					: new Date().toISOString(),
		}))
		.filter((c) => c.name.length > 0);
}
