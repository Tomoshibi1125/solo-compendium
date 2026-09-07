import type { StaticCompendiumEntry } from "@/data/compendium/providers";
import { supabase } from "@/integrations/supabase/client";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
	listCanonicalPowers,
	listCanonicalSpells,
} from "@/lib/canonicalCompendium";
import { getAbilityUseFields } from "@/lib/characterCreation";
import { isLocalCharacterId } from "@/lib/guestStore";

/** Canonical catalog fields required by Regent catch-up persistence. */
export interface CanonicalPickEntry {
	id: string;
	name: string;
	power_level?: number | null;
	level_requirement?: number | null;
	atWill?: boolean | null;
	casting_time?: string | null;
	range?: string | null;
	duration?: string | null;
	concentration?: boolean | null;
	ritual?: boolean | null;
	description?: string | null;
	higher_levels?: string | null;
}

export interface RegentPickPersistenceResult {
	requested: number;
	inserted: number;
	existingSameSource: number;
	verified: number;
	canonicalIds: string[];
}

export interface RegentPickPersistenceOptions {
	campaignId?: string;
	countsAgainstLimit?: boolean;
}

type ExistingPick = {
	id: string;
	canonicalId: string | null;
	name: string | null;
	source: string | null;
};

function assertRemoteCharacter(characterId: string): void {
	if (!characterId || isLocalCharacterId(characterId)) {
		throw new Error("Regent catch-up cannot persist abilities locally.");
	}
}

function assertCatchUpSource(source: string): void {
	if (!source.trim())
		throw new Error("Regent catch-up requires an exact source.");
}

function normalizedName(value: string | null | undefined): string {
	return (value ?? "").trim().toLocaleLowerCase();
}

function validateEntries(entries: CanonicalPickEntry[], bucket: string): void {
	const seenIds = new Set<string>();
	for (const entry of entries) {
		if (!entry.id?.trim()) {
			throw new Error(
				`${bucket} catch-up contains an unresolved canonical ID.`,
			);
		}
		if (!entry.name?.trim()) {
			throw new Error(
				`${bucket} catch-up entry ${entry.id} has no canonical name.`,
			);
		}
		if (seenIds.has(entry.id)) {
			throw new Error(
				`${bucket} catch-up requested canonical ID ${entry.id} more than once.`,
			);
		}
		seenIds.add(entry.id);
	}
}

/**
 * Resolve the requested IDs against one canonical bucket before any database
 * read or write. Returned metadata comes from the catalog, never the caller.
 */
export function resolveCanonicalPickEntries(
	requested: readonly CanonicalPickEntry[],
	catalog: readonly CanonicalPickEntry[],
	bucket: string,
): CanonicalPickEntry[] {
	validateEntries([...requested], bucket);
	const byId = new Map<string, CanonicalPickEntry>();
	for (const entry of catalog) {
		if (!entry.id?.trim() || byId.has(entry.id)) continue;
		byId.set(entry.id, entry);
	}
	return requested.map((entry) => {
		const canonical = byId.get(entry.id);
		if (!canonical) {
			throw new Error(
				`${bucket} "${entry.name}" (${entry.id}) is not in the canonical ${bucket.toLocaleLowerCase()} catalog.`,
			);
		}
		return { ...canonical };
	});
}

function toCanonicalCastable(
	entry: CanonicalCastableEntry,
): CanonicalPickEntry {
	return {
		id: entry.id,
		name: entry.name,
		power_level: entry.power_level,
		atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
		casting_time: entry.casting_time,
		range: entry.range,
		duration: entry.duration,
		concentration: entry.concentration,
		ritual: entry.ritual,
		description: entry.description,
		higher_levels: entry.higher_levels,
	};
}

function toCanonicalTechnique(
	entry: StaticCompendiumEntry,
): CanonicalPickEntry {
	return {
		id: entry.id,
		name: entry.name,
		level_requirement: entry.level_requirement ?? entry.level ?? null,
		atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
		description: entry.description,
	};
}

function createTechniqueIdentityMap(
	catalog: readonly StaticCompendiumEntry[],
): Map<string, StaticCompendiumEntry | null> {
	const identities = new Map<string, StaticCompendiumEntry | null>();
	for (const entry of catalog) {
		for (const identity of [entry.id, ...(entry.aliases ?? [])]) {
			if (!identity?.trim()) continue;
			const existing = identities.get(identity);
			identities.set(
				identity,
				existing && existing.id !== entry.id ? null : entry,
			);
		}
	}
	return identities;
}

function findExistingPick(
	existing: ExistingPick[],
	entry: CanonicalPickEntry,
	source: string,
	bucket: string,
): ExistingPick | null {
	const idMatches = existing.filter(
		(candidate) => candidate.canonicalId === entry.id,
	);
	const nameKey = normalizedName(entry.name);
	const nameMatches = existing.filter(
		(candidate) => normalizedName(candidate.name) === nameKey,
	);
	const collisions = new Map(
		[...idMatches, ...nameMatches].map((candidate) => [
			candidate.id,
			candidate,
		]),
	);

	for (const candidate of collisions.values()) {
		if (candidate.canonicalId !== entry.id || candidate.source !== source) {
			throw new Error(
				`${bucket} "${entry.name}" collides with an existing ability from ${candidate.source ?? "another source"}.`,
			);
		}
	}

	return idMatches.find((candidate) => candidate.source === source) ?? null;
}

function createResult(
	entries: CanonicalPickEntry[],
): RegentPickPersistenceResult {
	return {
		requested: entries.length,
		inserted: 0,
		existingSameSource: 0,
		verified: 0,
		canonicalIds: entries.map((entry) => entry.id),
	};
}

function assertVerified(
	result: RegentPickPersistenceResult,
	bucket: string,
): void {
	if (result.verified !== result.requested) {
		throw new Error(
			`${bucket} catch-up verified ${result.verified} of ${result.requested} requested canonical IDs.`,
		);
	}
}

async function verifyPower(
	characterId: string,
	entry: CanonicalPickEntry,
	source: string,
): Promise<void> {
	const { data, error } = await supabase
		.from("character_powers")
		.select("id")
		.eq("character_id", characterId)
		.eq("power_id", entry.id)
		.eq("source", source)
		.limit(1);
	if (error) throw error;
	if ((data?.length ?? 0) !== 1) {
		throw new Error(
			`Power "${entry.name}" was not persisted with its canonical ID and catch-up source.`,
		);
	}
}

async function verifyTechnique(
	characterId: string,
	entry: CanonicalPickEntry,
	source: string,
): Promise<void> {
	const { data, error } = await supabase
		.from("character_techniques")
		.select("id")
		.eq("character_id", characterId)
		.eq("technique_id", entry.id)
		.eq("source", source)
		.limit(1);
	if (error) throw error;
	if ((data?.length ?? 0) !== 1) {
		throw new Error(
			`Technique "${entry.name}" was not persisted with its canonical ID and catch-up source.`,
		);
	}
}

async function verifySpell(
	characterId: string,
	entry: CanonicalPickEntry,
	source: string,
): Promise<void> {
	const { data, error } = await supabase
		.from("character_spells")
		.select("id")
		.eq("character_id", characterId)
		.eq("spell_id", entry.id)
		.eq("source", source)
		.limit(1);
	if (error) throw error;
	if ((data?.length ?? 0) !== 1) {
		throw new Error(
			`Spell "${entry.name}" was not persisted with its canonical ID and catch-up source.`,
		);
	}
}

export async function persistRegentPowers(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
	options: RegentPickPersistenceOptions = {},
): Promise<RegentPickPersistenceResult> {
	assertRemoteCharacter(characterId);
	assertCatchUpSource(source);
	validateEntries(entries, "Power");
	if (entries.length === 0) return createResult(entries);

	const catalog = (
		await listCanonicalPowers(undefined, {
			campaignId: options.campaignId,
		})
	).map(toCanonicalCastable);
	const canonicalEntries = resolveCanonicalPickEntries(
		entries,
		catalog,
		"Power",
	);
	const result = createResult(canonicalEntries);
	const { data, error } = await supabase
		.from("character_powers")
		.select("id, power_id, name, source")
		.eq("character_id", characterId);
	if (error) throw error;
	const existing: ExistingPick[] = (data ?? []).map((row) => ({
		id: row.id,
		canonicalId: row.power_id,
		name: row.name,
		source: row.source,
	}));

	for (const power of canonicalEntries) {
		if (!Number.isInteger(power.power_level) || (power.power_level ?? -1) < 0) {
			throw new Error(`Power "${power.name}" has no valid canonical tier.`);
		}
		const sameSource = findExistingPick(existing, power, source, "Power");
		if (sameSource) {
			result.existingSameSource += 1;
		} else {
			const useFields = await getAbilityUseFields(characterId, {
				kind: "power",
				powerLevel: power.power_level,
				atWill: power.atWill ?? null,
			});
			const { error: insertError } = await supabase
				.from("character_powers")
				.insert({
					character_id: characterId,
					power_id: power.id,
					name: power.name,
					power_level: power.power_level ?? 0,
					source,
					casting_time: power.casting_time ?? null,
					range: power.range ?? null,
					duration: power.duration ?? null,
					concentration: power.concentration ?? false,
					description: power.description ?? null,
					higher_levels: power.higher_levels ?? null,
					is_prepared: false,
					is_known: true,
					...useFields,
				});
			if (insertError) throw insertError;
			result.inserted += 1;
			existing.push({
				id: `inserted:${power.id}`,
				canonicalId: power.id,
				name: power.name,
				source,
			});
		}
		await verifyPower(characterId, power, source);
		result.verified += 1;
	}

	assertVerified(result, "Power");
	return result;
}

export async function persistRegentTechniques(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
	options: RegentPickPersistenceOptions = {},
): Promise<RegentPickPersistenceResult> {
	assertRemoteCharacter(characterId);
	assertCatchUpSource(source);
	validateEntries(entries, "Technique");
	if (entries.length === 0) return createResult(entries);

	const catalog = await listCanonicalEntries("techniques", undefined, {
		campaignId: options.campaignId,
	});
	const canonicalEntries = resolveCanonicalPickEntries(
		entries,
		catalog.map(toCanonicalTechnique),
		"Technique",
	);
	const result = createResult(canonicalEntries);
	const { data, error } = await supabase
		.from("character_techniques")
		.select("id, technique_id, source")
		.eq("character_id", characterId);
	if (error) throw error;
	const techniqueByIdentity = createTechniqueIdentityMap(catalog);
	const unresolvedExisting = (data ?? []).filter(
		(row) => !techniqueByIdentity.get(row.technique_id),
	);
	if (unresolvedExisting.length > 0) {
		throw new Error(
			`Task 9 identity catalog could not resolve known technique ID ${unresolvedExisting[0].technique_id}.`,
		);
	}
	const existing: ExistingPick[] = (data ?? []).map((row) => ({
		id: row.id,
		canonicalId: row.technique_id,
		name: techniqueByIdentity.get(row.technique_id)?.name ?? null,
		source: row.source,
	}));

	for (const technique of canonicalEntries) {
		const sameSource = findExistingPick(
			existing,
			technique,
			source,
			"Technique",
		);
		if (sameSource) {
			result.existingSameSource += 1;
		} else {
			const useFields = await getAbilityUseFields(characterId, {
				kind: "technique",
				levelRequirement: technique.level_requirement ?? null,
				atWill: technique.atWill ?? null,
			});
			const { error: insertError } = await supabase
				.from("character_techniques")
				.insert({
					character_id: characterId,
					technique_id: technique.id,
					source,
					...useFields,
				});
			if (insertError) throw insertError;
			result.inserted += 1;
			existing.push({
				id: `inserted:${technique.id}`,
				canonicalId: technique.id,
				name: technique.name,
				source,
			});
		}
		await verifyTechnique(characterId, technique, source);
		result.verified += 1;
	}

	assertVerified(result, "Technique");
	return result;
}

/** Persist cantrips and leveled spells as exact canonical catch-up picks. */
export async function persistRegentSpells(
	characterId: string,
	entries: CanonicalPickEntry[],
	source: string,
	options: RegentPickPersistenceOptions = {},
): Promise<RegentPickPersistenceResult> {
	assertRemoteCharacter(characterId);
	assertCatchUpSource(source);
	validateEntries(entries, "Spell");
	if (entries.length === 0) return createResult(entries);

	const catalog = (
		await listCanonicalSpells(undefined, {
			campaignId: options.campaignId,
		})
	).map(toCanonicalCastable);
	const canonicalEntries = resolveCanonicalPickEntries(
		entries,
		catalog,
		"Spell",
	);
	const result = createResult(canonicalEntries);
	const { data, error } = await supabase
		.from("character_spells")
		.select("id, spell_id, name, source")
		.eq("character_id", characterId);
	if (error) throw error;
	const existing: ExistingPick[] = (data ?? []).map((row) => ({
		id: row.id,
		canonicalId: row.spell_id,
		name: row.name,
		source: row.source,
	}));

	for (const spell of canonicalEntries) {
		if (!Number.isInteger(spell.power_level) || (spell.power_level ?? -1) < 0) {
			throw new Error(`Spell "${spell.name}" has no valid canonical tier.`);
		}
		const sameSource = findExistingPick(existing, spell, source, "Spell");
		if (sameSource) {
			result.existingSameSource += 1;
		} else {
			const { error: insertError } = await supabase
				.from("character_spells")
				.insert({
					character_id: characterId,
					spell_id: spell.id,
					name: spell.name,
					spell_level: spell.power_level ?? 0,
					source,
					casting_time: spell.casting_time ?? null,
					range: spell.range ?? null,
					duration: spell.duration ?? null,
					concentration: spell.concentration ?? false,
					ritual: spell.ritual ?? false,
					description: spell.description ?? null,
					higher_levels: spell.higher_levels ?? null,
					is_prepared: false,
					is_known: true,
					counts_against_limit: options.countsAgainstLimit ?? true,
				});
			if (insertError) throw insertError;
			result.inserted += 1;
			existing.push({
				id: `inserted:${spell.id}`,
				canonicalId: spell.id,
				name: spell.name,
				source,
			});
		}
		await verifySpell(characterId, spell, source);
		result.verified += 1;
	}

	assertVerified(result, "Spell");
	return result;
}
