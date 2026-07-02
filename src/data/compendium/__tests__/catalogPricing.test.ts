import { describe, expect, it } from "vitest";
import { baseEquipment } from "@/data/compendium/items-base-equipment";
import { staticDataProvider } from "@/data/compendium/providers";
import { RA_CURRENCY_TYPES, type RaCurrencyId } from "@/lib/currency";

const CURRENCY_IDS = new Set<RaCurrencyId>(RA_CURRENCY_TYPES.map((c) => c.id));

// Guardrail for the Part-2 structured re-pricing: catalog prices must be
// explicit { currency, amount } with the credit TYPE varied by tier (cheap goods
// in mana/crystal, gear in Rift, legendary/artifacts in core) — not all Rift.

describe("catalog pricing — raw item data is structured", () => {
	it("every base-equipment entry has a structured { currency, amount } value", () => {
		for (const item of baseEquipment) {
			expect(
				typeof item.value === "object" && item.value !== null,
				`${item.id} value should be structured`,
			).toBe(true);
			expect(CURRENCY_IDS.has(item.value.currency)).toBe(true);
			expect(item.value.amount).toBeGreaterThan(0);
			expect(Number.isInteger(item.value.amount)).toBe(true);
		}
	});
});

describe("catalog pricing — surfaced prices are varied + tier-correct", () => {
	it("provider item entries carry a structured price with a valid currency", async () => {
		const entries = await staticDataProvider.getItems("");
		expect(entries.length).toBeGreaterThan(100);
		for (const entry of entries) {
			expect(entry.price, `${entry.id} missing price`).toBeTruthy();
			expect(CURRENCY_IDS.has(entry.price?.currency as RaCurrencyId)).toBe(
				true,
			);
			expect(entry.price?.amount ?? 0).toBeGreaterThan(0);
		}
	});

	it("uses at least three distinct credit types across the catalog", async () => {
		const entries = await staticDataProvider.getItems("");
		const currencies = new Set(entries.map((e) => e.price?.currency));
		expect(currencies.size).toBeGreaterThanOrEqual(3);
	});

	it("rarity tiers map to sensible credit types (no common in core, legendary in core)", async () => {
		const entries = await staticDataProvider.getItems("");
		for (const entry of entries) {
			const currency = entry.price?.currency;
			const rarity = (entry.rarity ?? "").toString();
			// Common goods stay cheap (never priced in the highest denomination).
			if (rarity === "common") expect(currency).not.toBe("core");
			// Legendary/artifact gear settles in core (the S-rank denomination).
			if (rarity === "legendary" || rarity === "artifact") {
				expect(currency).toBe("core");
			}
		}
	});

	it("tattoos carry a rarity-derived structured price (add-menu cost parity)", async () => {
		const entries = await staticDataProvider.getTattoos("");
		expect(entries.length).toBeGreaterThan(0);
		for (const entry of entries) {
			const price = (
				entry as { price?: { currency?: string; amount?: number } }
			).price;
			expect(price, `${entry.id} missing price`).toBeTruthy();
			expect(CURRENCY_IDS.has(price?.currency as RaCurrencyId)).toBe(true);
			expect(price?.amount ?? 0).toBeGreaterThan(0);
		}
	});

	it("vehicles/mounts carry a rank-derived structured price (add-menu cost parity)", async () => {
		const entries = await staticDataProvider.getVehicles("");
		expect(entries.length).toBeGreaterThan(0);
		for (const entry of entries) {
			const price = (
				entry as { price?: { currency?: string; amount?: number } }
			).price;
			expect(price, `${entry.id} missing price`).toBeTruthy();
			expect(CURRENCY_IDS.has(price?.currency as RaCurrencyId)).toBe(true);
			expect(price?.amount ?? 0).toBeGreaterThan(0);
		}
	});

	it("relics carry a structured price in the top denominations (Rift/core)", async () => {
		const entries = await staticDataProvider.getRelics("");
		expect(entries.length).toBeGreaterThan(0);
		for (const entry of entries) {
			const price = (
				entry as { price?: { currency?: string; amount?: number } }
			).price;
			expect(price, `${entry.id} missing price`).toBeTruthy();
			// Relics are rare+ tier: never priced in the small denominations.
			// "gate" is the persisted currency ID (display name is "Rift").
			expect(["gate", "core"]).toContain(price?.currency);
			expect(price?.amount ?? 0).toBeGreaterThan(0);
		}
	});

	it("artifacts carry varied core prices (no flat placeholder values)", async () => {
		const entries = await staticDataProvider.getArtifacts("");
		expect(entries.length).toBeGreaterThan(0);
		const amounts = new Set<number>();
		for (const entry of entries) {
			const price = (
				entry as { price?: { currency?: string; amount?: number } }
			).price;
			expect(price, `${entry.id} missing price`).toBeTruthy();
			// World-unique pieces trade only in Core Credits.
			expect(price?.currency).toBe("core");
			expect(price?.amount ?? 0).toBeGreaterThan(0);
			amounts.add(price?.amount ?? 0);
		}
		// The old placeholder set 14/17 artifacts to a flat 1,000,000 — prices
		// must stay differentiated by mythos weight.
		expect(amounts.size).toBeGreaterThanOrEqual(10);
	});
});
