import type {
	StaticCompendiumEntry,
	StaticDataProvider,
} from "@/data/compendium/providers/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	isStaticCanonicalEntryType,
	listCanonicalEntries,
} from "@/lib/canonicalCompendium";
import { logger } from "@/lib/logger";
import { isSourcebookAccessible } from "@/lib/sourcebookAccess";
import type {
	CompendiumAnomaly,
	CompendiumBackground,
	CompendiumCondition,
	CompendiumDeity,
	CompendiumFeat,
	CompendiumItem,
	CompendiumJob,
	CompendiumLocation,
	CompendiumPath,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumSkill,
	CompendiumSovereign,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";

export const entryTypes = [
	"jobs",
	"paths",
	"powers",
	"runes",
	"relics",
	"anomalies",
	"backgrounds",
	"conditions",
	"regents",
	"feats",
	"skills",
	"equipment",
	"sovereigns",
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"deities",
	"pantheon",
	"npcs",
] as const;

export type EntryType = (typeof entryTypes)[number];

export type CompendiumEntity =
	| CompendiumJob
	| CompendiumPath
	| CompendiumAnomaly
	| CompendiumBackground
	| CompendiumCondition
	| CompendiumRegent
	| CompendiumFeat
	| CompendiumSkill
	| CompendiumItem
	| CompendiumSpell
	| CompendiumTattoo
	| CompendiumTechnique
	| CompendiumLocation
	| CompendiumRelic
	| CompendiumRune
	| CompendiumSovereign
	| CompendiumDeity;

export type { StaticDataProvider };

const supabaseTableMap: Partial<
	Record<EntryType, keyof Database["public"]["Tables"]>
> = {
	jobs: "compendium_jobs",
	paths: "compendium_job_paths",
	powers: "compendium_powers",
	runes: "compendium_runes",
	relics: "compendium_relics",
	anomalies: "compendium_Anomalies",
	backgrounds: "compendium_backgrounds",
	conditions: "compendium_conditions",
	regents: "compendium_regents" as never,
	feats: "compendium_feats",
	skills: "compendium_skills",
	equipment: "compendium_equipment",
	sovereigns: "compendium_sovereigns",
	"shadow-soldiers": "compendium_shadow_soldiers",
	sigils: "compendium_sigils" as never,
	tattoos: "compendium_tattoos" as never,
};

const legacyIdMap: Partial<Record<EntryType, Record<string, string>>> = {
	regents: {
		"umbral-sovereign-overlay": "umbral-regent-overlay",
	},
};

const getStaticEntries = async (
	type: EntryType,
	search?: string,
): Promise<StaticCompendiumEntry[] | null> => {
	if (!isStaticCanonicalEntryType(type)) {
		return null;
	}

	return listCanonicalEntries(type, search);
};

export async function listStaticEntries(
	type: EntryType,
): Promise<StaticCompendiumEntry[] | null> {
	return getStaticEntries(type);
}

/**
 * Resolve a compendium reference to its entity
 *
 * @param type - The type of compendium entry
 * @param id - The ID of the entry
 * @returns The resolved entity, or null if not found
 */
export async function resolveRef(
	type: EntryType,
	id: string,
): Promise<CompendiumEntity | null> {
	if (id.startsWith("marketplace:") && isSupabaseConfigured) {
		try {
			const realId = id.replace("marketplace:", "");
			const { data, error } = await supabase
				.from("marketplace_items")
				.select("id, title, description, content")
				.eq("id", realId)
				.maybeSingle();

			if (error) {
				logger.warn(`Error resolving marketplace item ${id}:`, error);
				return null;
			}

			if (data?.content && typeof data.content === "object") {
				const content = data.content as Record<string, unknown>;
				return {
					...content,
					id: `marketplace:${data.id}`,
					name: data.title || content.name || "Unknown Item",
					description: data.description || content.description || null,
					type,
				} as unknown as CompendiumEntity;
			}
			return null;
		} catch (error) {
			logger.warn(`Exception resolving marketplace item ${id}:`, error);
			return null;
		}
	}

	const resolvedId = legacyIdMap[type]?.[id] ?? id;
	const staticEntries = await listStaticEntries(type);
	if (staticEntries) {
		const entry = staticEntries.find((item) => item.id === resolvedId);
		if (entry) {
			const resolvedName = entry.display_name || entry.name;
			return {
				...entry,
				id: entry.id,
				name: resolvedName,
				type,
				description:
					typeof entry.description === "string" ? entry.description : null,
			} as unknown as CompendiumEntity;
		}
	}

	const tableName = supabaseTableMap[type];

	if (isSupabaseConfigured && tableName) {
		try {
			// Standard compendium entity resolution
			const { data, error } = await supabase
				.from(tableName as never)
				.select("*")
				.eq("id", resolvedId)
				.maybeSingle();

			if (error) {
				logger.warn(`Error resolving ${type}:${id}:`, error);
			} else if (data) {
				if (data === null || typeof data !== "object") {
					return null;
				}

				const checkedData = data as Record<string, unknown>;
				if (!("id" in checkedData) || !("name" in checkedData)) {
					return null;
				}

				const entityData = checkedData as {
					id: unknown;
					name: unknown;
					display_name?: unknown;
					description?: unknown;
					[key: string]: unknown;
				};
				if (
					typeof entityData.id !== "string" ||
					typeof entityData.name !== "string"
				) {
					return null;
				}

				const sourceBook =
					typeof entityData.source_book === "string"
						? entityData.source_book
						: null;
				if (!(await isSourcebookAccessible(sourceBook))) {
					return null;
				}

				const displayName =
					typeof entityData.display_name === "string" &&
					entityData.display_name.trim().length > 0
						? entityData.display_name
						: entityData.name;

				return {
					...entityData,
					id: entityData.id,
					name: displayName,
					type,
					description:
						typeof entityData.description === "string"
							? entityData.description
							: null,
				} as unknown as CompendiumEntity;
			}
		} catch (error) {
			logger.warn(`Exception resolving ${type}:${id}:`, error);
		}
	}

	return null;
}

/**
 * Resolve multiple compendium references in batch
 *
 * @param refs - Array of {type, id} pairs
 * @returns Map of resolved entities keyed by "type:id"
 */
export async function resolveRefs(
	refs: Array<{ type: EntryType; id: string }>,
): Promise<Map<string, CompendiumEntity>> {
	const results = new Map<string, CompendiumEntity>();

	// Resolve in parallel
	const promises = refs.map(async ({ type, id }) => {
		const entity = await resolveRef(type, id);
		if (entity) {
			results.set(`${type}:${id}`, entity);
		}
	});

	await Promise.all(promises);
	return results;
}

/**
 * Get the Supabase table name for an entry type
 */
export function getTableName(
	type: EntryType,
): keyof Database["public"]["Tables"] {
	const tableName = supabaseTableMap[type];
	if (!tableName) {
		throw new AppError(
			`No Supabase table for entry type: ${type}`,
			"INVALID_INPUT",
		);
	}
	return tableName;
}

/**
 * Validate that a reference exists
 */
export async function validateRef(
	type: EntryType,
	id: string,
): Promise<boolean> {
	const entity = await resolveRef(type, id);
	return entity !== null;
}

/**
 * Check if a string is a valid EntryType
 */
export function isValidEntryType(value: string): value is EntryType {
	return entryTypes.includes(value as EntryType);
}

/**
 * Map homebrew content_type to compendium EntryType.
 */
const homebrewTypeToEntryType: Record<string, EntryType> = {
	job: "jobs",
	path: "paths",
	relic: "relics",
	spell: "spells",
	item: "items",
};

/**
 * Merge published homebrew content into a compendium entry list.
 * Returns combined array with homebrew entries tagged with `source: 'homebrew'`.
 *
 * @param type - The compendium entry type to merge for
 * @param userId - Current user id
 * @param campaignId - Optional campaign id
 */
export async function mergeHomebrewEntries(
	type: EntryType,
	userId?: string | null,
	campaignId?: string | null,
): Promise<CompendiumEntity[]> {
	if (!isSupabaseConfigured || !userId) return [];

	// Map EntryType → homebrew content_type
	const homebrewContentType = Object.keys(homebrewTypeToEntryType).find(
		(key) => homebrewTypeToEntryType[key] === type,
	);

	if (!homebrewContentType) return [];

	try {
		// Get user's published homebrew + campaign-scoped homebrew
		const visibilityConditions = [
			{ visibility_scope: "public", status: "published" },
			{ visibility_scope: "private", status: "published", user_id: userId },
		];

		if (campaignId) {
			visibilityConditions.push({
				visibility_scope: "campaign",
				status: "published",
				campaign_id: campaignId,
			} as never);
		}

		const homebrewItems: Array<{
			id: string;
			name: string;
			description: string | null;
			data: unknown;
			source_book: string | null;
		}> = [];

		for (const condition of visibilityConditions) {
			const { data: items, error: _error } = await supabase
				.from("homebrew_content")
				.select("id, name, description, data, source_book")
				.eq("content_type", homebrewContentType)
				.eq("visibility_scope", condition.visibility_scope)
				.eq("status", condition.status)
				.eq(
					"user_id",
					(condition as Record<string, string>).user_id ||
						(condition as Record<string, string>).campaign_id ||
						"",
				)
				.neq("user_id", userId); // Don't include user's own content twice

			if (items) {
				homebrewItems.push(
					...(items as Array<{
						id: string;
						name: string;
						description: string | null;
						data: Json;
						source_book: string | null;
					}>),
				);
			}
		}

		return homebrewItems.map((item) => ({
			id: `homebrew:${item.id}`,
			name: item.name,
			type,
			description: item.description || undefined,
			source: "homebrew" as const,
			homebrew_id: item.id,
			...((item.data as Record<string, Json>) || {}),
		})) as unknown as CompendiumEntity[];
	} catch (err) {
		logger.warn(`[mergeHomebrewEntries] Exception for ${type}:`, err);
		return [];
	}
}
