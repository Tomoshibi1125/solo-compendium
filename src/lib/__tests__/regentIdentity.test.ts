import { describe, expect, it } from "vitest";
import {
	CANONICAL_REGENT_IDS,
	requireDistinctCanonicalRegents,
	resolveCanonicalRegentId,
} from "@/lib/regentIdentity";

const LOCKED_IDS = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
] as const;

describe("canonical Regent identity", () => {
	it("locks the exact ordered twelve-ID roster", () => {
		expect(CANONICAL_REGENT_IDS).toEqual(LOCKED_IDS);
	});

	it("accepts exact canonical IDs with incidental surrounding whitespace", () => {
		for (const id of LOCKED_IDS) {
			expect(resolveCanonicalRegentId(id)).toBe(id);
			expect(resolveCanonicalRegentId(`  ${id}\t`)).toBe(id);
		}
	});

	it("maps only the four explicit retired IDs", () => {
		expect(resolveCanonicalRegentId("shadow_regent")).toBe("umbral_regent");
		expect(resolveCanonicalRegentId("dragon_regent")).toBe(
			"destruction_regent",
		);
		expect(resolveCanonicalRegentId("titan_regent")).toBe("steel_regent");
		expect(resolveCanonicalRegentId("architect_regent")).toBe("spatial_regent");
	});

	it.each([
		"Umbral Regent",
		"umbral",
		"UMBRAL_REGENT",
		"Umbral_Regent",
		"umbral-regent",
		"shadow",
		"Shadow Regent",
		"Umbral and Death",
		"550e8400-e29b-41d4-a716-446655440000",
		"transfiguration_regent",
		"constructor",
		"toString",
		"__proto__",
		"",
	])("rejects non-ID identity %j", (value) => {
		expect(resolveCanonicalRegentId(value)).toBeNull();
	});

	it("returns the canonical pair in A-then-B order", () => {
		expect(
			requireDistinctCanonicalRegents("shadow_regent", "frost_regent"),
		).toEqual(["umbral_regent", "frost_regent"]);
		expect(
			requireDistinctCanonicalRegents("frost_regent", "shadow_regent"),
		).toEqual(["frost_regent", "umbral_regent"]);
	});

	it("rejects unresolved and normalized-equal pairs", () => {
		expect(() =>
			requireDistinctCanonicalRegents("unknown", "frost_regent"),
		).toThrow(/Regent A/i);
		expect(() =>
			requireDistinctCanonicalRegents("umbral_regent", "unknown"),
		).toThrow(/Regent B/i);
		expect(() =>
			requireDistinctCanonicalRegents("shadow_regent", "umbral_regent"),
		).toThrow(/distinct canonical Regents/i);
	});
});
