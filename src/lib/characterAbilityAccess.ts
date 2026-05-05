import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getMaxAbilityLevelForJobAtLevel } from "@/lib/abilityProgression";
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
import {
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
} from "@/lib/jobAbilityAccess";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";

export interface CharacterAbilityAccessContext
	extends LearnableCastableOptions {
	campaignId: string | null;
	characterLevel: number | null;
	maxSpellLevel: number | null;
	maxPowerLevel: number | null;
	maxTechniqueLevel: number | null;
	jobName: string | null;
	pathName: string | null;
	regentNames: string[];
}

type CharacterAccessRow = Pick<
	Database["public"]["Tables"]["characters"]["Row"],
	"job" | "path" | "regent_overlays" | "level"
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
		.select("job, path, regent_overlays, level")
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
	const characterLevel =
		typeof character?.level === "number" ? character.level : null;
	const jobName = character?.job ?? null;
	return {
		campaignId,
		accessContext: { campaignId },
		jobName,
		pathName: character?.path ?? null,
		regentNames,
		characterLevel,
		maxSpellLevel:
			jobName && characterLevel
				? getMaxAbilityLevelForJobAtLevel(jobName, characterLevel, "spell")
				: null,
		maxPowerLevel:
			jobName && characterLevel
				? getMaxAbilityLevelForJobAtLevel(jobName, characterLevel, "power")
				: null,
		maxTechniqueLevel: characterLevel,
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

function getRequiredCharacterLevelForAbility(
	jobName: string,
	abilityLevel: number,
	kind: "spell" | "power",
): number | null {
	for (let level = 1; level <= 20; level += 1) {
		if (getMaxAbilityLevelForJobAtLevel(jobName, level, kind) >= abilityLevel) {
			return level;
		}
	}
	return null;
}

function getTechniqueLevelRequirement(entry: StaticCompendiumEntry): number {
	const direct =
		(entry as { level_requirement?: unknown }).level_requirement ??
		(entry as { requires_level?: unknown }).requires_level ??
		entry.level;
	return typeof direct === "number" ? direct : 0;
}

function getCastableLevelError(
	entry: { power_level: number },
	context: CharacterAbilityAccessContext,
	kind: "spell" | "power",
): string | null {
	const maxLevel =
		kind === "spell" ? context.maxSpellLevel : context.maxPowerLevel;
	const canLearn =
		kind === "spell"
			? jobCanLearnSpells(context.jobName)
			: jobCanLearnPowers(context.jobName);
	if (
		!canLearn ||
		typeof maxLevel !== "number" ||
		entry.power_level <= maxLevel
	) {
		return null;
	}
	const requiredLevel = context.jobName
		? getRequiredCharacterLevelForAbility(
				context.jobName,
				entry.power_level,
				kind,
			)
		: null;
	return requiredLevel
		? `This ${kind} requires character level ${requiredLevel}.`
		: `This ${kind} exceeds this character's progression.`;
}

function getTechniqueLevelError(
	entry: StaticCompendiumEntry,
	context: CharacterAbilityAccessContext,
): string | null {
	const requiredLevel = getTechniqueLevelRequirement(entry);
	const maxLevel = context.maxTechniqueLevel ?? context.characterLevel;
	if (
		!jobCanLearnTechniques(context.jobName) ||
		typeof maxLevel !== "number" ||
		requiredLevel <= maxLevel
	) {
		return null;
	}
	return `This technique requires character level ${requiredLevel}.`;
}

export function assertCanonicalPowerLearnable(
	entry: CanonicalCastableEntry,
	context: CharacterAbilityAccessContext,
): void {
	requireCharacterJob(context, "power");
	const levelError = getCastableLevelError(entry, context, "power");
	if (levelError) throw new Error(levelError);
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
	const levelError = getCastableLevelError(entry, context, "spell");
	if (levelError) throw new Error(levelError);
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
	const levelError = getTechniqueLevelError(entry, context);
	if (levelError) throw new Error(levelError);
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
	const levelError = getCastableLevelError(power, context, "power");
	if (levelError) throw new Error(levelError);
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
	const levelError = getCastableLevelError(spell, context, "spell");
	if (levelError) throw new Error(levelError);
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
