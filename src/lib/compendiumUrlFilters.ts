/**
 * URL → compendium-filter synchronization.
 *
 * Pure logic behind the reactive search-param effect in `pages/Compendium.tsx`,
 * extracted so the sidebar deep-link behavior is unit-testable: category/tab
 * params apply on every change (the sidebar links only change the query string,
 * so the page never remounts), and an explicit navigation back to a bare
 * `/compendium` resets the category to "all". On first run with no params the
 * persisted filters win.
 */

/** Backward-compatible mapping for older links like /compendium?tab=classes */
const TAB_TO_CATEGORY: Record<string, string> = {
	classes: "jobs",
	features: "feats",
	gear: "equipment",
	items: "items",
	runes: "runes",
	sigils: "sigils",
};

export interface CompendiumUrlFilterUpdates {
	selectedCategory?: string;
	searchQuery?: string;
	showFavoritesOnly?: boolean;
	selectedSourceBooks?: string[];
}

export function computeCompendiumFilterUpdates(
	searchParams: URLSearchParams,
	isFirstRun: boolean,
): CompendiumUrlFilterUpdates {
	const updates: CompendiumUrlFilterUpdates = {};

	const categoryParam = searchParams.get("category");
	const tabParam = searchParams.get("tab");
	if (categoryParam) {
		updates.selectedCategory = categoryParam;
	} else if (tabParam) {
		updates.selectedCategory = TAB_TO_CATEGORY[tabParam] || "all";
	} else if (!isFirstRun) {
		updates.selectedCategory = "all";
	}

	const searchParam = searchParams.get("search");
	if (searchParam) {
		updates.searchQuery = searchParam;
	}
	if (searchParams.get("favorites") === "true") {
		updates.showFavoritesOnly = true;
	}
	const sourcesParam = searchParams.get("sources");
	if (sourcesParam) {
		updates.selectedSourceBooks = sourcesParam.split(",");
	}

	return updates;
}
