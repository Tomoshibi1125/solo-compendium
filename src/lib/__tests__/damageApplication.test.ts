import { describe, expect, it } from "vitest";
import { applyDamageMitigation } from "@/lib/damageApplication";

describe("applyDamageMitigation", () => {
	it("halves resisted damage", () => {
		const result = applyDamageMitigation({
			rawDamage: 11,
			damageType: "fire",
			mitigation: { resistances: ["Fire"] },
		});

		expect(result.finalDamage).toBe(5);
		expect(result.resistanceApplied).toBe(true);
		expect(result.summary).toMatch(/halved/i);
	});

	it("zeroes immune damage", () => {
		const result = applyDamageMitigation({
			rawDamage: 18,
			damageType: "cold",
			mitigation: { immunities: ["cold"] },
		});

		expect(result.finalDamage).toBe(0);
		expect(result.immunityApplied).toBe(true);
	});

	it("doubles vulnerable damage", () => {
		const result = applyDamageMitigation({
			rawDamage: 7,
			damageType: "radiant",
			mitigation: { vulnerabilities: ["radiant"] },
		});

		expect(result.finalDamage).toBe(14);
		expect(result.vulnerabilityApplied).toBe(true);
	});

	it("leaves unknown typed damage unchanged", () => {
		const result = applyDamageMitigation({
			rawDamage: 9,
			damageType: "thunder",
			mitigation: { resistances: ["fire"], immunities: ["cold"] },
		});

		expect(result.finalDamage).toBe(9);
		expect(result.resistanceApplied).toBe(false);
		expect(result.immunityApplied).toBe(false);
	});

	it("bypasses mitigation in raw mode", () => {
		const result = applyDamageMitigation({
			rawDamage: 12,
			damageType: "fire",
			mode: "raw",
			mitigation: {
				resistances: ["fire"],
				immunities: ["fire"],
				vulnerabilities: ["fire"],
			},
		});

		expect(result.finalDamage).toBe(12);
		expect(result.appliedMode).toBe("raw");
	});
});
