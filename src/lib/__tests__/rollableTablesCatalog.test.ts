import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";

describe("canonical rollable tables", () => {
	it("returns canonical table entries with rollable results", async () => {
		const tables = await staticDataProvider.getRollableTables();

		expect(tables.length).toBeGreaterThan(0);
		expect(tables.some((table) => table.id === "rift-complications")).toBe(true);
		for (const table of tables) {
			expect(typeof table.id).toBe("string");
			expect(typeof table.name).toBe("string");
			expect(Array.isArray(table.rollable_entries)).toBe(true);
			expect(table.rollable_entries?.length ?? 0).toBeGreaterThan(0);
		}
	});
});
