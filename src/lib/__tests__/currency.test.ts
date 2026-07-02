import { describe, expect, it } from "vitest";
import {
	convertCurrencyAmount,
	formatRaCurrencyAmount,
	formatRaCurrencyFromBaseUnits,
	getRaCurrencyDefinition,
	parseRaCurrencyString,
	RA_CURRENCY_TYPES,
} from "../currency";

describe("RA currency", () => {
	it("defines uniform Credits denominations", () => {
		expect(RA_CURRENCY_TYPES.map((currency) => currency.name)).toEqual([
			"Core Credits",
			"Rift Credits",
			"Crystal Credits",
			"Mana Credits",
		]);
		expect(
			RA_CURRENCY_TYPES.every(
				(currency) =>
					currency.description.includes("Bureau") &&
					currency.description.includes("essence reserves"),
			),
		).toBe(true);
	});

	it("converts by decimal RA denomination ladder", () => {
		expect(convertCurrencyAmount(1, "core", "gate")).toBe(10);
		expect(convertCurrencyAmount(1, "gate", "crystal")).toBe(10);
		expect(convertCurrencyAmount(1, "crystal", "mana")).toBe(10);
		expect(convertCurrencyAmount(100, "mana", "gate")).toBe(1);
	});

	it("normalizes legacy 5e coin and gate-era aliases into RA denominations", () => {
		expect(getRaCurrencyDefinition("gp")?.name).toBe("Rift Credits");
		expect(getRaCurrencyDefinition("gold")?.name).toBe("Rift Credits");
		expect(getRaCurrencyDefinition("gate credits")?.name).toBe("Rift Credits");
		expect(getRaCurrencyDefinition("rift credit")?.name).toBe("Rift Credits");
		expect(getRaCurrencyDefinition("pp")?.name).toBe("Core Credits");
		expect(getRaCurrencyDefinition("cp")?.name).toBe("Mana Credits");
	});

	it("formats standard and base-unit credit values", () => {
		expect(formatRaCurrencyAmount(1, "gate")).toBe("1 Rift Credit");
		expect(formatRaCurrencyAmount(2, "gate")).toBe("2 Rift Credits");
		expect(formatRaCurrencyFromBaseUnits(1000)).toBe("1 Core Credit");
		expect(formatRaCurrencyFromBaseUnits(250)).toBe("25 Crystal Credits");
		expect(formatRaCurrencyFromBaseUnits(7)).toBe("7 Mana Credits");
	});

	it("parses human-entered RA and legacy currency strings", () => {
		expect(parseRaCurrencyString("12 Gate Credits")).toMatchObject({
			amount: 12,
			currencyId: "gate",
			baseUnits: 1200,
		});
		expect(parseRaCurrencyString("5 gp")).toMatchObject({
			amount: 5,
			currencyId: "gate",
			baseUnits: 500,
		});
	});
});
