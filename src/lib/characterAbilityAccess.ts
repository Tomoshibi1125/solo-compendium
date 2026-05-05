import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	type CanonicalCastableEntry,
	findCanonicalEntryById,
	isCanonicalPowerLearnable,
	isCanonicalSpellLearnable,
	isCanonicalTechniqueLearnable,
	type LearnableCastableOptions,
	listCanonicalEntries,
} from "@/lib/canonicalCompendium";
import { getLocalCharacterState, isLocalCharacterId } from "@/lib/guestStore";
import {
	type HomebrewRuntimeRecord,
	mapHomebrewPowerForRuntime,
	mapHomebrewSpellForRuntime,
	runtimePowerMatchesCharacter,
	runtimeSpellMatchesCharacter,
} from "@/lib/homebrewRuntime";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";

export interface CharacterAbilityAccessContext
	extends LearnableCastableOptions {
	campaignId: string | null;
	jobName: string | null;
	pathName: string | null;
	regentNames: string[];
}

type CharacterAccessRow = Pick<
	Database["public"]["Tables"]["characters"]["Row"],
	"job" | "path" | "regent_overlays"
>;

function normalizeAccessKey(value: string | null | undefined): string {
	return (value ?? "")
		.trim()
		.toLowerCase()
		.replace(/_/g, "-")
		.replace(/\s+/g, "-");
}

async function resolveRegentNames(
	regentOverlays: string[] | null | undefined,
): Promise<string[]> {
	const overlays = (regentOverlays ?? []).filter(
		(value): value is string => typeof value === "string" && value.length > 0,
	);
	if (overlays.length === 0) return [];
	const overlayKeys = new Set(overlays.map(normalizeAccessKey));
	const regents = await listCanonicalEntries("regents");
	const names = new Set<string>();
	for (const regent of regents) {
		const candidates = [regent.id, regent.name, regent.display_name]
			.map(normalizeAccessKey)
			.filter(Boolean);
		if (candidates.some((candidate) => overlayKeys.has(candidate))) {
			names.add(regent.name);
		}
	}
	for (const overlay of overlays) {
		if (!names.has(overlay)) names.add(overlay);
	}
	return Array.from(names);
}

async function getCharacterAccessRow(
	characterId: string,
): Promise<CharacterAccessRow | null> {
	if (isLocalCharacterId(characterId)) {
		return getLocalCharacterState(characterId)?.character ?? null;
	}
	if (!isSupabaseConfigured || !characterId) return null;
	const { data, error } = await supabase
		.from("characters")
		.select("job, path, regent_overlays")
		.eq("id", characterId)
		.maybeSingle();
	if (error) throw error;
	return data as CharacterAccessRow | null;
}

export async function getCharacterAbilityAccessContext(
	characterId: string,
): Promise<CharacterAbilityAccessContext> {
	const [character, campaignId] = await Promise.all([
		getCharacterAccessRow(characterId),
		getCharacterCampaignId(characterId),
	]);
	const regentNames = await resolveRegentNames(character?.regent_overlays);
	return {
		campaignId,
		accessContext: { campaignId },
		jobName: character?.job ?? null,
		pathName: character?.path ?? null,
		regentNames,
	};
}

function requireCharacterJob(
	context: CharacterAbilityAccessContext,
	abilityKind: string,
): void {
	if (!context.jobName) {
		throw new Error(`Cannot add ${abilityKind}: character job is missing.`);
	}
}

export function assertCanonicalPowerLearnable(
	entry: CanonicalCastableEntry,
	context: CharacterAbilityAccessContext,
): void {
	requireCharacterJob(context, "power");
	if (!isCanonicalPowerLearnable(entry, context)) {
		throw new Error(
			"This power is not available to this character's job, path, or regents.",
		);
	}
}

export function assertCanonicalSpellLearnable(
	entry: CanonicalCastableEntry,
	context: CharacterAbilityAccessContext,
): void {
	requireCharacterJob(context, "spell");
	if (!isCanonicalSpellLearnable(entry, context)) {
		throw new Error(
			"This spell is not available to this character's job, path, or regents.",
		);
	}
}

export function assertCanonicalTechniqueLearnable(
	entry: StaticCompendiumEntry,
	context: CharacterAbilityAccessContext,
): void {
	requireCharacterJob(context, "technique");
	if (!isCanonicalTechniqueLearnable(entry, context)) {
		throw new Error(
			"This technique is not available to this character's job, path, or regents.",
		);
	}
}

async function findPublishedHomebrewByName(
	contentType: "power" | "spell",
	name: string,
	context: CharacterAbilityAccessContext,
): Promise<HomebrewRuntimeRecord | null> {
	if (!isSupabaseConfigured || !name.trim()) return null;
	const { data: auth } = await supabase.auth.getUser();
	const userId = auth.user?.id ?? null;
	const query = supabase
		.from("homebrew_content")
		.select(
			"id, content_type, name, description, data, source_book, tags, created_at, updated_at, user_id, visibility_scope, campaign_id, status",
		)
		.eq("content_type", contentType)
		.eq("status", "published")
		.ilike("name", name.trim());
	const { data, error } = await query;
	if (error) throw error;
	const normalizedName = name.trim().toLowerCase();
	const records = (data ?? []).filter((record) => {
		if (record.name?.trim().toLowerCase() !== normalizedName) return false;
		if (userId && record.user_id === userId) return true;
		if (record.visibility_scope === "public") return true;
		return (
			!!context.campaignId &&
			record.visibility_scope === "campaign" &&
			record.campaign_id === context.campaignId
		);
	});
	return (records[0] as HomebrewRuntimeRecord | undefined) ?? null;
}

export async function assertHomebrewPowerLearnable(
	name: string,
	context: CharacterAbilityAccessContext,
): Promise<void> {
	requireCharacterJob(context, "power");
	const record = await findPublishedHomebrewByName("power", name, context);
	if (!record) {
		throw new Error("This homebrew power is not available to this character.");
	}
	const power = mapHomebrewPowerForRuntime(record);
	if (!runtimePowerMatchesCharacter(power, context.jobName, context.pathName)) {
		throw new Error(
			"This homebrew power is not available to this character's job or path.",
		);
	}
}

export async function assertHomebrewSpellLearnable(
	name: string,
	context: CharacterAbilityAccessContext,
): Promise<void> {
	requireCharacterJob(context, "spell");
	const record = await findPublishedHomebrewByName("spell", name, context);
	if (!record) {
		throw new Error("This homebrew spell is not available to this character.");
	}
	const spell = mapHomebrewSpellForRuntime(record);
	if (!runtimeSpellMatchesCharacter(spell, context.jobName, context.pathName)) {
		throw new Error(
			"This homebrew spell is not available to this character's job or path.",
		);
	}
}

export async function findAccessibleCanonicalTechnique(
	techniqueId: string,
	context: CharacterAbilityAccessContext,
): Promise<StaticCompendiumEntry | null> {
	return findCanonicalEntryById(
		"techniques",
		techniqueId,
		context.accessContext,
	);
}
