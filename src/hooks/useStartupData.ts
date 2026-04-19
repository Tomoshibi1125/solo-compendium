import { useQuery } from "@tanstack/react-query";
import type { StaticCompendiumEntry } from "@/data/compendium/providers";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import type { ArtifactAbility, CompendiumProperties } from "@/types/compendium";

// Define the interface to match Compendium.tsx exactly
export interface CompendiumEntry {
	id: string;
	name: string;
	type:
		| "jobs"
		| "paths"
		| "powers"
		| "runes"
		| "relics"
		| "anomalies"
		| "backgrounds"
		| "conditions"
		| "regents"
		| "feats"
		| "skills"
		| "equipment"
		| "shadow-soldiers"
		| "techniques"
		| "items"
		| "spells"
		| "artifacts"
		| "locations"
		| "sigils"
		| "tattoos"
		| "pantheon"
		| "sovereigns";
	rarity?:
		| "common"
		| "uncommon"
		| "rare"
		| "very_rare"
		| "legendary"
		| string
		| null;
	description: string | null; // Allow null to match database/static sources
	level?: number;
	cr?: string;
	gate_rank?: string;
	is_boss?: boolean;
	tags?: string[] | null;
	created_at?: string | null;
	source_book?: string | null;
	image_url?: string | null;
	isFavorite: boolean;
	// Type-specific fields
	power_level?: number | null;
	flavor?: string | null;
	higher_levels?: string | null;
	atHigherLevels?: string | null;
	properties?: string[] | CompendiumProperties | null;
	abilities?: Record<string, ArtifactAbility> | null;
	school?: string | null;
	title?: string | null;
	theme?: string | null;
	prerequisites?: string | Record<string, unknown> | null;
	fusion_theme?: string | null;
	equipment_type?: string | null;
	ability?: string | null;
	rune_type?: string | null;
	rune_category?: string | null;
	role?: string | null;
	rank?: string | null;
	element?: string | null;
	weight?: number | null;
	value?: number | null;
	attunement?: boolean | null;
}

// ALL categories to preload at startup - comprehensive loading
const STARTUP_CATEGORIES = [
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
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"pantheon",
	"sovereigns",
] as const;

type _StartupCategory = (typeof STARTUP_CATEGORIES)[number];

type StartupSupabaseEntry = {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	created_at?: string | null;
	tags?: string[] | null;
	source_book?: string | null;
	image_url?: string | null;
	rarity?: string | null;
	cr?: string | null;
	gate_rank?: string | null;
	is_boss?: boolean | null;
	power_level?: number | null;
	school?: string | null;
	rune_type?: string | null;
	rune_category?: string | null;
	rune_level?: number | null;
	equipment_type?: string | null;
	ability?: string | null;
	prerequisites?: string | Record<string, unknown> | null;
	title?: string | null;
	theme?: string | null;
	role?: string | null;
	rank?: string | null;
};

const STARTUP_LIMIT = 200; // Load comprehensive items per category for full compendium coverage

interface StartupData {
	entries: CompendiumEntry[];
	categories: string[];
	totalCounts: Record<string, number>;
}

export const useStartupData = () => {
	return useQuery({
		queryKey: ["startup-data"],
		queryFn: async (): Promise<StartupData> => {
			const allEntries: CompendiumEntry[] = [];
			const totalCounts: Record<string, number> = {};

			const { staticDataProvider } = await import(
				"@/data/compendium/providers"
			);

			if (!isSupabaseConfigured) {
				// Use static data for development/preview - load ALL categories with COMPLETE data
				for (const category of STARTUP_CATEGORIES) {
					let data: StaticCompendiumEntry[] = [];

					switch (category) {
						case "jobs":
							data = await staticDataProvider.getJobs("");
							break;
						case "anomalies":
							data = await staticDataProvider.getAnomalies("");
							break;
						case "powers":
							data = await staticDataProvider.getPowers("");
							break;
						case "equipment":
							data = await staticDataProvider.getItems("");
							break;
						case "paths":
							data = await staticDataProvider.getPaths("");
							break;
						case "runes":
							data = await staticDataProvider.getRunes("");
							break;
						case "backgrounds":
							data = await staticDataProvider.getBackgrounds("");
							break;
						case "relics":
							data = await staticDataProvider.getRelics("");
							break;
						case "conditions":
							data = await staticDataProvider.getConditions("");
							break;
						case "regents":
							data = await staticDataProvider.getRegents("");
							break;
						case "feats":
							data = await staticDataProvider.getFeats("");
							break;
						case "skills":
							data = await staticDataProvider.getSkills("");
							break;
						case "shadow-soldiers":
							data = await staticDataProvider.getShadowSoldiers("");
							break;
						case "items":
							// Items are already loaded via the "equipment" case above;
							// skip to avoid duplicates.
							data = [];
							break;
						case "spells":
							data = await staticDataProvider.getSpells("");
							break;
						case "techniques":
							data = await staticDataProvider.getTechniques("");
							break;
						case "artifacts":
							data = await staticDataProvider.getArtifacts("");
							break;
						case "locations":
							data = await staticDataProvider.getLocations("");
							break;
						case "sigils":
							data = await staticDataProvider.getSigils("");
							break;
						case "tattoos":
							data = await staticDataProvider.getTattoos("");
							break;
						case "pantheon":
							data = await staticDataProvider.getPantheon("");
							break;
						case "sovereigns":
							// Sovereigns are AI-generated via Gemini protocol;
							// no static data — they only exist in Supabase.
							data = [];
							break;
						default:
							data = [];
							break;
					}

					// Transform and limit to startup limit
					const accessibleData = await filterRowsBySourcebookAccess(
						data,
						(item) => item.source_book,
					);
					const limitedData = accessibleData.slice(0, STARTUP_LIMIT);
					allEntries.push(
						...limitedData.map((item) => ({
							id: item.id,
							name: item.display_name || item.name,
							type: category as CompendiumEntry["type"],
							description: item.description || "No description available", // Ensure description is always provided
							rarity: item.rarity || "common",
							tags: item.tags || [],
							level: item.level ?? undefined,
							created_at: item.created_at,
							source_book: item.source_book,
							image_url: item.image_url,
							isFavorite: false,
							// Include type-specific fields
							...(category === "anomalies" && {
								cr: item.cr ?? undefined,
								gate_rank: item.gate_rank ?? undefined,
								is_boss: item.is_boss ?? undefined,
							}),
							...(category === "powers" && {
								power_level: item.power_level,
								school: item.school,
							}),
							...(category === "runes" && {
								rune_type: item.rune_type,
								rune_category: item.rune_category,
								level: item.rune_level ?? undefined,
							}),
							...(category === "equipment" && {
								equipment_type: item.equipment_type,
							}),
							...(category === "skills" && {
								ability: item.ability,
							}),
							...(category === "feats" && {
								prerequisites: item.prerequisites,
							}),
							...(category === "regents" && {
								title: item.title,
								theme: item.theme,
							}),
							...(category === "shadow-soldiers" && {
								role: item.role,
								rank: item.rank,
							}),
							...(category === "relics" && {
								equipment_type: item.equipment_type,
							}),
						})),
					);

					totalCounts[category] = accessibleData.length;
				}

				// Deduplicate by type:id to prevent any duplicate entries
				const seen = new Set<string>();
				const deduped = allEntries.filter((entry) => {
					const key = `${entry.type}:${entry.id}`;
					if (seen.has(key)) return false;
					seen.add(key);
					return true;
				});

				return {
					entries: deduped,
					categories: [...STARTUP_CATEGORIES],
					totalCounts,
				};
			}

			// Use Supabase for production
			try {
				// Parallel fetch of ALL startup categories
				const promises = STARTUP_CATEGORIES.map(async (category) => {
					let query: unknown;

					switch (category) {
						case "jobs":
							query = supabase
								.from("compendium_jobs")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "anomalies":
							query = supabase
								.from("compendium_Anomalies")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, image_url, cr, gate_rank, is_boss",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "powers":
							query = supabase
								.from("compendium_powers")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, power_level, school",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "paths":
							query = supabase
								.from("compendium_job_paths")
								.select(
									"id, name, display_name, description, created_at, tags, source_book",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "runes":
							query = supabase
								.from("compendium_runes")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rune_level, rune_type, rune_category, rarity",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "relics":
							query = supabase
								.from("compendium_relics")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rarity, item_type, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "backgrounds":
							query = supabase
								.from("compendium_backgrounds")
								.select(
									"id, name, display_name, description, created_at, tags, source_book",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "conditions":
							query = supabase
								.from("compendium_conditions")
								.select("id, name, display_name, description, created_at")
								.limit(STARTUP_LIMIT);
							break;
						case "regents":
							query = supabase
								.from("compendium_regents")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, title, theme",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "feats":
							query = supabase
								.from("compendium_feats")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, prerequisites",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "skills":
							query = supabase
								.from("compendium_skills")
								.select(
									"id, name, display_name, description, created_at, source_book, ability",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "equipment":
							query = supabase
								.from("compendium_equipment")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, equipment_type, damage, armor_class, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "shadow-soldiers":
							query = supabase
								.from("compendium_shadow_soldiers")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, role, rank",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "sigils":
							query = supabase
								.from("compendium_sigils")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rarity, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "sovereigns":
							query = supabase
								.from("compendium_sovereigns")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rarity, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "spells":
							query = supabase
								.from("compendium_spells")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rarity, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						case "techniques":
							query = supabase
								.from("compendium_techniques")
								.select(
									"id, name, display_name, description, created_at, tags, source_book, rarity, image_url",
								)
								.limit(STARTUP_LIMIT);
							break;
						default: {
							// Categories without Supabase tables (items, artifacts, locations)
							// fall back to static data provider
							let staticFallback: StaticCompendiumEntry[] = [];
							switch (category) {
								case "items":
									staticFallback = await staticDataProvider.getItems("");
									break;
								case "artifacts":
									staticFallback = await staticDataProvider.getArtifacts("");
									break;
								case "locations":
									staticFallback = await staticDataProvider.getLocations("");
									break;
							}
							if (staticFallback.length > 0) {
								const limited = staticFallback.slice(0, STARTUP_LIMIT);
								const transformed = limited.map(
									(item: StaticCompendiumEntry): CompendiumEntry => ({
										id: item.id,
										name: item.display_name || item.name,
										type: category as CompendiumEntry["type"],
										description: item.description || "No description available",
										rarity: item.rarity || "common",
										tags: Array.isArray(item.tags) ? item.tags : [],
										created_at: item.created_at,
										source_book: item.source_book,
										image_url: item.image_url,
										isFavorite: false,
									}),
								);
								return { entries: transformed, count: limited.length };
							}
							return { entries: [], count: 0 };
						}
					}

					const { data, error } = (await query) as {
						data: StartupSupabaseEntry[] | null;
						error: { message?: string } | null;
					};
					if (error || !data) return { entries: [], count: 0 };

					const rows = data as StartupSupabaseEntry[];
					const accessibleData = await filterRowsBySourcebookAccess(
						rows,
						(item) => item.source_book,
					);

					const transformedEntries = accessibleData.map(
						(item): CompendiumEntry => ({
							id: item.id,
							name: item.display_name || item.name,
							type: category as CompendiumEntry["type"],
							description: item.description || "No description available", // Ensure description is always provided
							rarity: item.rarity || "common",
							tags: Array.isArray(item.tags) ? item.tags : [],
							created_at: item.created_at,
							source_book: item.source_book,
							image_url: item.image_url,
							isFavorite: false,
							// Include type-specific fields
							...(category === "anomalies" && {
								cr: item.cr ?? undefined,
								gate_rank: item.gate_rank ?? undefined,
								is_boss: item.is_boss ?? undefined,
							}),
							...(category === "powers" && {
								power_level: item.power_level,
								school: item.school,
							}),
							...(category === "runes" && {
								rune_type: item.rune_type,
								rune_category: item.rune_category,
								level: item.rune_level ?? undefined,
							}),
							...(category === "equipment" && {
								equipment_type: item.equipment_type,
							}),
							...(category === "skills" && {
								ability: item.ability,
							}),
							...(category === "feats" && {
								prerequisites: item.prerequisites,
							}),
							...(category === "regents" && {
								title: item.title,
								theme: item.theme,
							}),
							...(category === "shadow-soldiers" && {
								role: item.role,
								rank: item.rank,
							}),
						}),
					);

					return { entries: transformedEntries, count: accessibleData.length };
				});

				const results = await Promise.all(promises);

				results.forEach((result, index) => {
					allEntries.push(...result.entries);
					totalCounts[STARTUP_CATEGORIES[index]] = result.count;
				});

				// Merge marketplace-entitled content
				try {
					const {
						data: { user },
					} = await supabase.auth.getUser();
					if (user) {
						const { data: entitlements } = await supabase
							.from("user_marketplace_entitlements")
							.select("item_id")
							.eq("user_id", user.id);

						if (entitlements && entitlements.length > 0) {
							const entitledIds = entitlements.map(
								(e: { item_id: string }) => e.item_id,
							);
							const { data: marketplaceItems } = await supabase
								.from("marketplace_items")
								.select("id, title, description, item_type, tags, content")
								.in("id", entitledIds)
								.eq("is_listed", true);

							if (marketplaceItems) {
								for (const item of marketplaceItems as Array<{
									id: string;
									title: string;
									description: string;
									item_type: string;
									tags: string[];
									content: Record<string, unknown>;
								}>) {
									allEntries.push({
										id: `marketplace:${item.id}`,
										name: item.title,
										type: (item.item_type === "item"
											? "equipment"
											: item.item_type) as CompendiumEntry["type"],
										description: item.description || "Marketplace content",
										tags: [...(item.tags || []), "marketplace"],
										source_book: "Marketplace",
										isFavorite: false,
									});
								}
							}
						}
					}
				} catch (marketplaceError) {
					logger.warn(
						"Failed to load marketplace content for startup data:",
						marketplaceError,
					);
				}

				// Deduplicate by type:id to prevent any duplicate entries
				const seen = new Set<string>();
				const dedupedEntries = allEntries.filter((entry) => {
					const key = `${entry.type}:${entry.id}`;
					if (seen.has(key)) return false;
					seen.add(key);
					return true;
				});

				return {
					entries: dedupedEntries,
					categories: [...STARTUP_CATEGORIES],
					totalCounts,
				};
			} catch (error) {
				logger.error("Failed to load startup data:", error);
				throw error;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: 2,
	});
};
