import { describe, expect, it } from "vitest";
import {
	buildMarketplaceCsv,
	buildMarketplaceMarkdown,
	type MarketplaceItemExport,
} from "@/lib/communityExport";

const item = (
	over: Partial<MarketplaceItemExport> = {},
): MarketplaceItemExport => ({
	title: "Rift Atlas",
	item_type: "map",
	category: "exploration",
	rating_avg: 4.5,
	rating_count: 12,
	downloads_count: 30,
	tags: ["rift", "atlas"],
	description: "A gilded map of the rifts.",
	...over,
});

describe("marketplace export builders", () => {
	it("renders markdown with a count, type, rating, downloads, and tags", () => {
		const md = buildMarketplaceMarkdown([item()]);
		expect(md).toContain("# Marketplace Listings");
		expect(md).toContain("**Listings:** 1");
		expect(md).toContain("## Rift Atlas");
		expect(md).toContain("map · exploration");
		expect(md).toContain("4.50 (12)"); // rating avg + count
		expect(md).toContain("**Downloads:** 30");
		expect(md).toContain("rift, atlas");
		expect(md).toContain("A gilded map of the rifts.");
	});

	it("has no price line: every listing is free", () => {
		const md = buildMarketplaceMarkdown([item()]);
		expect(md).not.toMatch(/\*\*Price:\*\*/);
	});

	it("builds CSV rows/columns with joined tags and no price columns", () => {
		const { rows, columns } = buildMarketplaceCsv([item()]);
		expect(columns).toContain("title");
		expect(columns).toContain("downloads_count");
		expect(columns.some((column) => column.startsWith("price"))).toBe(false);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			title: "Rift Atlas",
			item_type: "map",
			downloads_count: 30,
			tags: "rift; atlas",
		});
	});
});
