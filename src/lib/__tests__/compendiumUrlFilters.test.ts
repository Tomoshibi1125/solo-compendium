/**
 * Guard for the sidebar → compendium deep-link contract.
 *
 * The sidebar's Compendium section links are all `/compendium?category=X`;
 * the route never changes, so the page cannot rely on remounting. This pins
 * the reactive semantics: category applies on change, tab= maps for legacy
 * links, and navigating back to a bare /compendium resets to "all" — but a
 * first render with no params leaves persisted filters alone.
 */
import { describe, expect, it } from "vitest";
import { computeCompendiumFilterUpdates } from "@/lib/compendiumUrlFilters";

const params = (query: string) => new URLSearchParams(query);

describe("computeCompendiumFilterUpdates", () => {
	it("applies ?category= on first run (fresh navigation from another page)", () => {
		expect(
			computeCompendiumFilterUpdates(params("category=anomalies"), true),
		).toEqual({ selectedCategory: "anomalies" });
	});

	it("applies ?category= on subsequent runs (sidebar click while mounted)", () => {
		expect(
			computeCompendiumFilterUpdates(params("category=backgrounds"), false),
		).toEqual({ selectedCategory: "backgrounds" });
	});

	it("maps legacy ?tab= links to categories", () => {
		expect(
			computeCompendiumFilterUpdates(params("tab=classes"), false),
		).toEqual({ selectedCategory: "jobs" });
		expect(computeCompendiumFilterUpdates(params("tab=gear"), false)).toEqual({
			selectedCategory: "equipment",
		});
	});

	it("falls back to 'all' for unknown ?tab= values", () => {
		expect(
			computeCompendiumFilterUpdates(params("tab=sovereign"), false),
		).toEqual({ selectedCategory: "all" });
	});

	it("resets to 'all' when params disappear while mounted (bare /compendium nav)", () => {
		expect(computeCompendiumFilterUpdates(params(""), false)).toEqual({
			selectedCategory: "all",
		});
	});

	it("leaves persisted filters alone on first run with no params", () => {
		expect(computeCompendiumFilterUpdates(params(""), true)).toEqual({});
	});

	it("parses search, favorites, and sources params", () => {
		expect(
			computeCompendiumFilterUpdates(
				params(
					"category=items&search=medkit&favorites=true&sources=Rift%20Ascendant%20Canon",
				),
				false,
			),
		).toEqual({
			selectedCategory: "items",
			searchQuery: "medkit",
			showFavoritesOnly: true,
			selectedSourceBooks: ["Rift Ascendant Canon"],
		});
	});
});
