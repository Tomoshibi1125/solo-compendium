import { supabase } from "@/integrations/supabase/client";

/**
 * Shared persistence for regent ability picks (powers / techniques / cantrips /
 * spells), used by both the level-up wizard's regent deltas and the one-time
 * retroactive catch-up picker (`RegentCatchUpModal`). Regents are canonical
 * (Supabase) content only, so this covers the DB path — the same insert shapes
 * the wizard writes at level-up, with id/name dedup so a re-run never doubles.
 */

export interface CanonicalPickEntry {
	id: string;
	name: string;
	power_level: number;
	casting_time?: string | null;
	range?: string | null;
	duration?: string | null;
	concentration?: boolean;
	ritual?: boolean;
	description?: string | null;
	higher_levels?: string | null;
}

async function powerExists(characterId: string, entry: CanonicalPickEntry) {
	const query = supabase
		.from("character_powers")
		.select("id")
		.eq("character_id", characterId)
		.limit(1);
	const { data } = entry.id
		? await query.eq("power_id", entry.id)
		: await query.eq("name", entry.name);
	return (data?.length ?? 0) > 0;
}

async function spellExists(characterId: string, entry: CanonicalPickEntry) {
	const query = supabase
		.from("character_spells")
		.select("id")
		.eq("character_id", characterId)
		.limit(1);
	const { data } = entry.id
		? await query.eq("spell_id", entry.id)
		: await query.eq("name", entry.name);
	return (data?.length ?? 0) > 0;
}

export async function persistRegentPowers(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
): Promise<void> {
	for (const power of entries) {
		if (await powerExists(characterId, power)) continue;
		await supabase.from("character_powers").insert({
			character_id: characterId,
			power_id: power.id,
			name: power.name,
			power_level: power.power_level,
			source,
			casting_time: power.casting_time || null,
			range: power.range || null,
			duration: power.duration || null,
			concentration: power.concentration || false,
			description: power.description || null,
			higher_levels: power.higher_levels || null,
			is_prepared: false,
			is_known: true,
		});
	}
}

export async function persistRegentTechniques(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
): Promise<void> {
	for (const technique of entries) {
		const { data: existing } = await supabase
			.from("character_techniques")
			.select("id")
			.eq("character_id", characterId)
			.eq("technique_id", technique.id)
			.limit(1);
		if ((existing?.length ?? 0) > 0) continue;
		await supabase.from("character_techniques").insert({
			character_id: characterId,
			technique_id: technique.id,
			source,
		});
	}
}

/**
 * Persist cantrips + leveled spells. `countsAgainstLimit` is false for spellbook
 * inscriptions (mirrors the wizard); cantrips/known spells count against it.
 */
export async function persistRegentSpells(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
	countsAgainstLimit = true,
): Promise<void> {
	for (const spell of entries) {
		if (await spellExists(characterId, spell)) continue;
		await supabase.from("character_spells").insert({
			character_id: characterId,
			spell_id: spell.id,
			name: spell.name,
			spell_level: spell.power_level,
			source,
			casting_time: spell.casting_time || null,
			range: spell.range || null,
			duration: spell.duration || null,
			concentration: spell.concentration || false,
			ritual: spell.ritual || false,
			description: spell.description || null,
			higher_levels: spell.higher_levels || null,
			is_prepared: false,
			is_known: true,
			counts_against_limit: countsAgainstLimit,
		});
	}
}
