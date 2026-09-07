import { describe, expect, it } from "vitest";
import {
	normalizeCharacterOverlayFields,
	normalizeGeminiState,
	normalizeRegentOverlayIds,
} from "@/lib/characterOverlayValidation";

describe("normalizeRegentOverlayIds", () => {
	it("normalizes explicit IDs and aliases while deduplicating by canonical ID", async () => {
		await expect(
			normalizeRegentOverlayIds([
				"umbral_regent",
				" shadow_regent ",
				"radiant_regent",
				"architect_regent",
				"spatial_regent",
				"Radiant Regent",
				"UMBRAL_REGENT",
				"umbral-regent",
				"550e8400-e29b-41d4-a716-446655440000",
				42,
			]),
		).resolves.toEqual(["umbral_regent", "radiant_regent", "spatial_regent"]);
	});

	it("returns null for missing or fully invalid overlay arrays", async () => {
		await expect(normalizeRegentOverlayIds(null)).resolves.toBeNull();
		await expect(
			normalizeRegentOverlayIds(["Unknown Regent", "Umbral Regent"]),
		).resolves.toBeNull();
	});
});

describe("normalizeGeminiState", () => {
	it("normalizes known runtime fields without dropping unrelated JSON state", async () => {
		await expect(
			normalizeGeminiState({
				sovereignId: " sovereign-1 ",
				sovereignName: " Test Sovereign ",
				isActive: "yes",
				fusionTheme: " Shadow ",
				fusionStability: "Volatile",
				powerMultiplier: "Critical",
				corruptionRisk: 140,
				conditions: ["poisoned"],
				regent_overlays: ["shadow_regent", "umbral_regent", "Umbral Regent"],
				modifiers: [
					{
						stat: "ac",
						source: "Test",
						value: "2",
						operation: "add",
					},
					{
						stat: "speed",
						source: "Bad",
						value: 5,
						operation: "divide",
					},
				],
			}),
		).resolves.toMatchObject({
			sovereignId: "sovereign-1",
			sovereignName: "Test Sovereign",
			isActive: false,
			fusionTheme: "Shadow",
			fusionStability: "Volatile",
			powerMultiplier: "Critical",
			corruptionRisk: 100,
			conditions: ["poisoned"],
			regent_overlays: ["umbral_regent"],
			modifiers: [
				{
					stat: "ac",
					source: "Test",
					value: 2,
					operation: "add",
					condition: null,
				},
			],
		});
	});

	it("returns null for non-object gemini state", async () => {
		await expect(normalizeGeminiState(null)).resolves.toBeNull();
		await expect(normalizeGeminiState([])).resolves.toBeNull();
	});
});

describe("normalizeCharacterOverlayFields", () => {
	it("normalizes only present overlay fields through the ID-only policy", async () => {
		const normalized = await normalizeCharacterOverlayFields({
			name: "Overlay Test",
			regent_overlays: ["radiant_regent", "Radiant Regent"],
			monarch_overlays: ["shadow_regent"],
		});

		expect(normalized).toEqual({
			name: "Overlay Test",
			regent_overlays: ["radiant_regent"],
			monarch_overlays: ["umbral_regent"],
		});
	});
});
