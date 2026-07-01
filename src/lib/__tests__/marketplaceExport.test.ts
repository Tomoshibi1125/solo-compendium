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
	price_type: "paid",
	price_amount: 5,
	price_currency: "USD",
	rating_avg: 4.5,
	rating_count: 12,
	downloads_count: 30,
	tags: ["rift", "atlas"],
	description: "A gilded map of the rifts.",
	...over,
});

describe("marketplace export builders", () => {
	it("renders markdown with a count, priced label, rating, and tags", () => {
		const md = buildMarketplaceMarkdown([item()]);
		expect(md).toContain("# Marketplace Listings");
		expect(md).toContain("**Listings:** 1");
		expect(md).toContain("## Rift Atlas");
		expect(md).toContain("USD 5"); // paid price label
		expect(md).toContain("4.50 (12)"); // rating avg + count
		expect(md).toContain("rift, atlas");
		expect(md).toContain("A gilded map of the rifts.");
	});

	it("labels free listings by their price type", () => {
		const md = buildMarketplaceMarkdown([
			item({ title: "Freebie", price_type: "free", price_amount: null }),
		]);
		expect(md).toMatch(/\*\*Price:\*\* free/);
	});

	it("builds CSV rows/columns with joined tags", () => {
		const { rows, columns } = buildMarketplaceCsv([item()]);
		expect(columns).toContain("title");
		expect(columns).toContain("downloads_count");
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			title: "Rift Atlas",
			item_type: "map",
			price_amount: 5,
			tags: "rift; atlas",
		});
	});

	it("blanks a null price amount in CSV", () => {
		const { rows } = buildMarketplaceCsv([
			item({ price_type: "free", price_amount: null }),
		]);
		expect(rows[0].price_amount).toBe("");
	});
});
