import type {
	StaticCompendiumEntry,
	StaticDataProvider,
} from "@/data/compendium/providers/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
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
	CompendiumCraftingMaterial,
	CompendiumCraftingProject,
	CompendiumDeity,
	CompendiumFeat,
	CompendiumItem,
	CompendiumJob,
	CompendiumLocation,
	CompendiumNPC,
	CompendiumPath,
	CompendiumRecipe,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumSigil,
	CompendiumSkill,
	CompendiumSovereign,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
	CompendiumVehicle,
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
	"vehicles",
	"crafting",
	"guild-base",
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
	| CompendiumSigil
	| CompendiumSovereign
	| CompendiumDeity
	| CompendiumVehicle
	| CompendiumCraftingMaterial
	| CompendiumRecipe
	| CompendiumCraftingProject
	| CompendiumNPC;

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
 * Check if a string is a valid EntryType
 */
export function isValidEntryType(value: string): value is EntryType {
	return entryTypes.includes(value as EntryType);
}
