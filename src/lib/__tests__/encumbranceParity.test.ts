/**
 * Encumbrance parity (Jul 18 audit follow-up).
 *
 * Two implementations disagreed: `characterEngine.computeEncumbrance` used 5e's
 * OPTIONAL variant thresholds (5×/10×/15× STR → −10/−20/speed 0) while
 * `calculateEncumbrance` used lenient percentage bands, and the sheet rendered
 * the lenient one. A character at 12×STR pounds was "heavily encumbered" and
 * slowed 20 ft according to the engine, and carrying a "Medium Load" with no
 * penalty at all according to the sheet.
 *
 * RA keeps the LENIENT model by design (nothing slows you until you exceed
 * capacity); both entry points now derive from one tier ladder.
 */
import { describe, expect, it } from "vitest";
import { computeEncumbrance } from "@/lib/characterEngine";
import {
	calculateEncumbrance,
	ENCUMBRANCE_SPEED_PENALTY,
	encumbranceTierForWeight,
} from "@/lib/encumbrance";

describe("encumbranceTierForWeight (the one ladder)", () => {
	// STR 10 → capacity 150.
	it("classifies by percentage of carrying capacity", () => {
		expect(encumbranceTierForWeight(0, 150)).toBe("unencumbered");
		expect(encumbranceTierForWeight(49, 150)).toBe("unencumbered"); // ≤33%
		expect(encumbranceTierForWeight(60, 150)).toBe("light"); // ≤66%
		expect(encumbranceTierForWeight(120, 150)).toBe("medium"); // ≤100%
		expect(encumbranceTierForWeight(200, 150)).toBe("heavy"); // ≤200%
		expect(encumbranceTierForWeight(400, 150)).toBe("overloaded"); // >200%
	});

	it("only penalises speed once capacity is exceeded (lenient by design)", () => {
		expect(ENCUMBRANCE_SPEED_PENALTY.unencumbered).toBe(0);
		expect(ENCUMBRANCE_SPEED_PENALTY.light).toBe(0);
		expect(ENCUMBRANCE_SPEED_PENALTY.medium).toBe(0);
		expect(ENCUMBRANCE_SPEED_PENALTY.heavy).toBe(10);
		expect(ENCUMBRANCE_SPEED_PENALTY.overloaded).toBe(20);
	});

	it("guards against a zero/absent capacity", () => {
		expect(encumbranceTierForWeight(50, 0)).toBe("unencumbered");
	});
});

describe("both entry points agree for the same carried weight", () => {
	const strScore = 10; // capacity 150
	const cases = [
		{ weight: 40, tier: "unencumbered" },
		{ weight: 60, tier: "light" },
		{ weight: 120, tier: "medium" },
		{ weight: 200, tier: "heavy" },
		{ weight: 400, tier: "overloaded" },
	] as const;

	it.each(cases)("$weight lb → $tier from engine and sheet alike", ({
		weight,
		tier,
	}) => {
		const engine = computeEncumbrance(strScore, [
			{
				id: "load",
				name: "Load",
				type: "other",
				isEquipped: true,
				weight,
			},
		]);
		const sheet = calculateEncumbrance(weight, strScore * 15);
		expect(engine.tier).toBe(tier);
		expect(sheet.status).toBe(tier);
	});

	it("a 12×STR load is NOT slowed — the old engine wrongly cut 20 ft", () => {
		// 120 lb at STR 10 is 80% of capacity: medium load, no penalty.
		const engine = computeEncumbrance(strScore, [
			{ id: "l", name: "Load", type: "other", isEquipped: true, weight: 120 },
		]);
		expect(ENCUMBRANCE_SPEED_PENALTY[engine.tier]).toBe(0);
	});
});
