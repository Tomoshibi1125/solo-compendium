/**
 * DDB-parity weapon automation: ammunition matching + versatile damage.
 *
 * Ammunition property weapons consume a matching ammo inventory row per
 * attack; versatile weapons expose a two-handed damage variant. Both are
 * derived from equipment properties + the canonical catalog shapes
 * ("Arrows (20)", "Crossbow Bolts (20)", bare "versatile" property).
 */

import { describe, expect, it } from "vitest";
import {
	findAmmunitionRow,
	getVersatileDamageDice,
	weaponRequiresAmmunition,
} from "@/lib/weaponAutomation";

const rows = [
	{ id: "eq-sword", name: "Longsword", quantity: 1 },
	{ id: "eq-arrows", name: "Arrows (20)", quantity: 18 },
	{ id: "eq-bolts", name: "Crossbow Bolts (20)", quantity: 20 },
	{ id: "eq-needles", name: "Blowgun Needles (50)", quantity: 50 },
	{ id: "eq-bullets", name: "Sling Bullets (20)", quantity: 0 },
];

describe("weaponRequiresAmmunition", () => {
	it("keys off the 5e ammunition property", () => {
		expect(weaponRequiresAmmunition(["ammunition", "heavy"])).toBe(true);
		expect(weaponRequiresAmmunition(["Ammunition (range 80/320)"])).toBe(true);
		expect(weaponRequiresAmmunition(["finesse", "light"])).toBe(false);
	});
});

describe("findAmmunitionRow", () => {
	it("matches a bow to arrows", () => {
		const match = findAmmunitionRow("Longbow", rows);
		expect(match?.id).toBe("eq-arrows");
		expect(match?.remaining).toBe(18);
	});

	it("matches a crossbow to bolts, not arrows", () => {
		expect(findAmmunitionRow("Heavy Crossbow", rows)?.id).toBe("eq-bolts");
	});

	it("matches a blowgun to needles and a sling to bullets", () => {
		expect(findAmmunitionRow("Blowgun", rows)?.id).toBe("eq-needles");
		const sling = findAmmunitionRow("Sling", rows);
		expect(sling?.id).toBe("eq-bullets");
		expect(sling?.remaining).toBe(0);
	});

	it("falls back to any ammo-named row for unrecognized launchers", () => {
		const match = findAmmunitionRow("Gate-Rail Launcher", rows);
		expect(match).not.toBeNull();
	});

	it("returns null when the character carries no ammo", () => {
		expect(
			findAmmunitionRow("Longbow", [
				{ id: "eq-sword", name: "Longsword", quantity: 1 },
			]),
		).toBeNull();
	});
});

describe("getVersatileDamageDice", () => {
	it("uses the die from a 'versatile (1d10)' property when present", () => {
		expect(getVersatileDamageDice(["versatile (1d10)"], "1d8")).toBe("1d10");
	});

	it("steps the die up one size for a bare 'versatile' property", () => {
		expect(getVersatileDamageDice(["versatile"], "1d6")).toBe("1d8");
		expect(getVersatileDamageDice(["versatile"], "1d8")).toBe("1d10");
		expect(getVersatileDamageDice(["versatile"], "1d10")).toBe("1d12");
	});

	it("keeps the die count when stepping up", () => {
		expect(getVersatileDamageDice(["versatile"], "2d6")).toBe("2d8");
	});

	it("returns null for non-versatile weapons, d12s, and missing dice", () => {
		expect(getVersatileDamageDice(["finesse"], "1d8")).toBeNull();
		expect(getVersatileDamageDice(["versatile"], "1d12")).toBeNull();
		expect(getVersatileDamageDice(["versatile"], null)).toBeNull();
	});
});
