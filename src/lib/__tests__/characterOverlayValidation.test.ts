import { describe, expect, it } from "vitest";
import {
	normalizeCharacterOverlayFields,
	normalizeGeminiState,
	normalizeRegentOverlayIds,
} from "@/lib/characterOverlayValidation";

describe("normalizeRegentOverlayIds", () => {
	it("canonicalizes regent overlay names and IDs while dropping invalid entries", async () => {
		await expect(
			normalizeRegentOverlayIds([
				"umbral_regent",
				"Radiant Regent",
				" umbral_regent ",
				"Not A Regent",
				42,
			]),
		).resolves.toEqual(["umbral_regent", "radiant_regent"]);
	});

	it("returns null for missing or fully invalid overlay arrays", async () => {
		await expect(normalizeRegentOverlayIds(null)).resolves.toBeNull();
		await expect(
			normalizeRegentOverlayIds(["Unknown Regent"]),
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
				regent_overlays: ["Umbral Regent", "missing"],
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
	it("normalizes only overlay fields that are present on character data", async () => {
		const normalized = await normalizeCharacterOverlayFields({
			name: "Overlay Test",
			regent_overlays: ["Radiant Regent", "unknown"],
			monarch_overlays: ["umbral_regent"],
		});

		expect(normalized).toEqual({
			name: "Overlay Test",
			regent_overlays: ["radiant_regent"],
			monarch_overlays: ["umbral_regent"],
		});
	});
});
