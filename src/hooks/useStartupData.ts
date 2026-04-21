import { useQuery } from "@tanstack/react-query";
import type { StaticCompendiumEntry } from "@/data/compendium/providers";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
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

const STARTUP_LIMIT = 200; // Load comprehensive items per category for full compendium coverage

interface StartupData {
	entries: CompendiumEntry[];
	categories: string[];
	totalCounts: Record<string, number>;
}

const staticStartupCategories = STARTUP_CATEGORIES.filter(
	(category): category is Exclude<_StartupCategory, "sovereigns"> =>
		category !== "sovereigns",
);

function mapStaticStartupEntry(
	category: Exclude<CompendiumEntry["type"], "sovereigns">,
	item: StaticCompendiumEntry,
): CompendiumEntry {
	return {
		id: item.id,
		name: item.display_name || item.name,
		type: category,
		description: item.description || "No description available",
		rarity: item.rarity || "common",
		tags: Array.isArray(item.tags) ? item.tags : [],
		level: item.level ?? undefined,
		created_at: item.created_at,
		source_book: item.source_book,
		image_url: item.image_url,
		isFavorite: false,
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
	};
}

function dedupeStartupEntries(entries: CompendiumEntry[]): CompendiumEntry[] {
	const seen = new Set<string>();
	return entries.filter((entry) => {
		const key = `${entry.type}:${entry.id}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

async function loadCanonicalStartupEntries(): Promise<{
	entries: CompendiumEntry[];
	totalCounts: Record<string, number>;
}> {
	const totalCounts: Record<string, number> = {};
	const results = await Promise.all(
		staticStartupCategories.map(async (category) => {
			const entries = await listCanonicalEntries(category);
			return [category, entries] as const;
		}),
	);

	const entries = results.flatMap(([category, categoryEntries]) => {
		totalCounts[category] = categoryEntries.length;
		return categoryEntries
			.slice(0, STARTUP_LIMIT)
			.map((item) => mapStaticStartupEntry(category, item));
	});

	return { entries, totalCounts };
}

async function loadSovereignStartupEntries(): Promise<{
	entries: CompendiumEntry[];
	count: number;
}> {
	if (!isSupabaseConfigured) {
		return { entries: [], count: 0 };
	}

	const { data, error } = await supabase
		.from("compendium_sovereigns")
		.select(
			"id, name, display_name, description, created_at, tags, source_book, image_url",
		)
		.limit(STARTUP_LIMIT);

	if (error || !data) {
		return { entries: [], count: 0 };
	}

	const accessibleData = await filterRowsBySourcebookAccess(
		data,
		(item) => item.source_book,
	);

	return {
		entries: accessibleData.map(
			(item): CompendiumEntry => ({
				id: item.id,
				name: item.display_name || item.name,
				type: "sovereigns",
				description: item.description || "No description available",
				rarity: null,
				tags: Array.isArray(item.tags) ? item.tags : [],
				created_at: item.created_at,
				source_book: item.source_book,
				image_url: item.image_url,
				isFavorite: false,
			}),
		),
		count: accessibleData.length,
	};
}

async function loadMarketplaceStartupEntries(): Promise<CompendiumEntry[]> {
	if (!isSupabaseConfigured) {
		return [];
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return [];
		}

		const { data: entitlements } = await supabase
			.from("user_marketplace_entitlements")
			.select("item_id")
			.eq("user_id", user.id);

		if (!entitlements || entitlements.length === 0) {
			return [];
		}

		const entitledIds = entitlements.map((entitlement) => entitlement.item_id);
		const { data: marketplaceItems } = await supabase
			.from("marketplace_items")
			.select("id, title, description, item_type, tags, content")
			.in("id", entitledIds)
			.eq("is_listed", true);

		if (!marketplaceItems) {
			return [];
		}

		return marketplaceItems.map((item) => ({
			id: `marketplace:${item.id}`,
			name: item.title,
			type: (item.item_type === "item"
				? "equipment"
				: item.item_type) as CompendiumEntry["type"],
			description: item.description || "Marketplace content",
			tags: [...(item.tags || []), "marketplace"],
			source_book: "Marketplace",
			isFavorite: false,
		}));
	} catch (marketplaceError) {
		logger.warn(
			"Failed to load marketplace content for startup data:",
			marketplaceError,
		);
		return [];
	}
}

export const useStartupData = () => {
	return useQuery({
		queryKey: ["startup-data"],
		queryFn: async (): Promise<StartupData> => {
			try {
				const allEntries: CompendiumEntry[] = [];
				const totalCounts: Record<string, number> = {};

				const canonicalData = await loadCanonicalStartupEntries();
				allEntries.push(...canonicalData.entries);
				Object.assign(totalCounts, canonicalData.totalCounts);

				const sovereignData = await loadSovereignStartupEntries();
				allEntries.push(...sovereignData.entries);
				totalCounts.sovereigns = sovereignData.count;

				const marketplaceEntries = await loadMarketplaceStartupEntries();
				allEntries.push(...marketplaceEntries);

				return {
					entries: dedupeStartupEntries(allEntries),
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
