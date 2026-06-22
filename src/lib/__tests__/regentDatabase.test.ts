import { describe, expect, it } from "vitest";
import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import { ALL_REGENTS, canonicalRegentToPath } from "@/lib/regentDatabase";
import { RegentGeminiSystem } from "@/lib/regentGeminiSystem";

describe("REGENT_DATABASE completeness", () => {
	it("contains EVERY canonical regent by its canonical id", () => {
		const ids = new Set(RegentGeminiSystem.REGENT_DATABASE.map((r) => r.id));
		const missing = CANONICAL_REGENTS.filter((r) => !ids.has(r.id)).map(
			(r) => r.id,
		);
		expect(missing).toEqual([]);
	});

	it("resolves a saved sovereign's canonical monarch_a_id / monarch_b_id", () => {
		// monarch ids stored on saved_sovereigns are canonical regent ids.
		for (const id of ["umbral_regent", "steel_regent", "gravity_regent"]) {
			expect(
				RegentGeminiSystem.REGENT_DATABASE.find((r) => r.id === id),
			).toBeTruthy();
		}
	});

	it("maps canonical class_features into the RegentPath feature shape", () => {
		const withFeatures = CANONICAL_REGENTS.find(
			(r) => (r.class_features?.length ?? 0) > 0,
		);
		expect(withFeatures).toBeTruthy();
		if (!withFeatures) return;
		const path = canonicalRegentToPath(withFeatures);
		expect(path.id).toBe(withFeatures.id);
		expect(path.features.length).toBeGreaterThan(0);
		expect(path.features[0]).toHaveProperty("name");
		expect(path.features[0]).toHaveProperty("description");
	});

	it("preserves legacy nine-regent ids for backward compatibility", () => {
		const ids = new Set(ALL_REGENTS.map((r) => r.id));
		// 'shadow_regent' exists only in the legacy NINE_REGENTS table.
		expect(ids.has("shadow_regent")).toBe(true);
	});

	it("has no duplicate ids", () => {
		const ids = ALL_REGENTS.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
