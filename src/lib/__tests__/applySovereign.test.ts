import { describe, expect, it } from "vitest";
import type {
	GeneratedSovereign,
	Job,
	Path,
	Regent,
} from "@/lib/geminiProtocol";
import {
	buildSovereignGeminiState,
	geminiOverlayFromState,
	isActionableActionType,
	isSovereignFeatureSource,
	SOVEREIGN_FEATURE_SOURCE_PREFIX,
	sovereignAbilitiesToFeatureRows,
} from "@/lib/sovereign/applySovereign";

const sovereign = {
	name: "Frostvoid Sovereign",
	title: "Sovereign of the Frozen Shadow",
	description: "origin",
	fusion_theme: "Singularity Frost",
	fusion_description: "doctrine",
	fusion_method: "Gemini Protocol (External Fusion)",
	power_multiplier: "Zenith-Tier",
	fusion_stability: "Stable",
	job: { id: "job-1", name: "Destroyer" } as unknown as Job,
	path: { id: "path-1", name: "Path of the Frostwarden" } as unknown as Path,
	regentA: { id: "umbral_regent", name: "Umbral Regent" } as unknown as Regent,
	regentB: { id: "frost_regent", name: "Frost Regent" } as unknown as Regent,
	abilities: [1, 3, 5, 7, 10, 14, 17, 20].map((level) => ({
		name: `Ability ${level}`,
		description: `Effect ${level}`,
		level,
		action_type: level === 1 ? "Passive" : "1 action",
		recharge: null,
		is_capstone: level >= 17,
		origin_sources: ["Job+Path"],
		fusion_type: "fusion",
	})),
} as GeneratedSovereign;

describe("buildSovereignGeminiState", () => {
	it("captures the overlay payload + runtime metadata", () => {
		const state = buildSovereignGeminiState(sovereign, "sov-row-1");
		expect(state.sovereignId).toBe("sov-row-1");
		expect(state.sovereignName).toBe("Frostvoid Sovereign");
		expect(state.isActive).toBe(true);
		expect(state.regent1Id).toBe("umbral_regent");
		expect(state.regent2Id).toBe("frost_regent");
		expect(state.features).toHaveLength(8);
		expect(state.features[0]).toEqual({
			name: "Ability 1",
			description: "Effect 1",
			type: "Passive",
		});
		// Sovereigns grant abilities, not stat bonuses.
		expect(state.statBonuses).toEqual({});
		expect(state.modifiers).toEqual([]);
	});
});

describe("geminiOverlayFromState", () => {
	it("round-trips the overlay block consumed by the engine", () => {
		const state = buildSovereignGeminiState(sovereign, "sov-row-1");
		const overlay = geminiOverlayFromState(state);
		expect(overlay).toBeDefined();
		expect(overlay?.sovereignId).toBe("sov-row-1");
		expect(overlay?.regent1Id).toBe("umbral_regent");
		expect(overlay?.features).toHaveLength(8);
	});

	it("preserves unrelated gemini_state keys are not required to read overlay", () => {
		const merged = {
			leveling_type: "milestone",
			conditions: [],
			...buildSovereignGeminiState(sovereign, "sov-row-2"),
		};
		const overlay = geminiOverlayFromState(merged);
		expect(overlay?.sovereignId).toBe("sov-row-2");
		expect(overlay?.features).toHaveLength(8);
	});

	it("returns undefined when no sovereign is locked in", () => {
		expect(geminiOverlayFromState(null)).toBeUndefined();
		expect(geminiOverlayFromState({})).toBeUndefined();
		expect(geminiOverlayFromState([])).toBeUndefined();
		expect(
			geminiOverlayFromState({ sovereignId: "x", features: [] }),
		).toBeUndefined();
	});
});

describe("sovereignAbilitiesToFeatureRows", () => {
	it("maps all 8 abilities to character_features rows under one Sovereign source", () => {
		const rows = sovereignAbilitiesToFeatureRows(sovereign);
		expect(rows).toHaveLength(8);
		for (const row of rows) {
			expect(row.source).toBe(
				`${SOVEREIGN_FEATURE_SOURCE_PREFIX} Frostvoid Sovereign`,
			);
			expect(isSovereignFeatureSource(row.source)).toBe(true);
			// FeaturesList groups by source.split(":")[0] → "Sovereign".
			expect(row.source.split(":")[0]).toBe("Sovereign");
			expect(row.modifiers).toBeNull();
			expect(row.is_active).toBe(true);
		}
		expect(rows[0]).toMatchObject({
			name: "Ability 1",
			level_acquired: 1,
			action_type: "Passive",
		});
	});
});

describe("isActionableActionType", () => {
	it("treats action/bonus/reaction as actionable, passive as not", () => {
		expect(isActionableActionType("1 action")).toBe(true);
		expect(isActionableActionType("1 bonus action")).toBe(true);
		expect(isActionableActionType("1 reaction")).toBe(true);
		expect(isActionableActionType("Passive")).toBe(false);
		expect(isActionableActionType(null)).toBe(false);
		expect(isActionableActionType(undefined)).toBe(false);
	});
});

describe("isSovereignFeatureSource", () => {
	it("matches only Sovereign-prefixed sources", () => {
		expect(isSovereignFeatureSource("Sovereign: Frostvoid")).toBe(true);
		expect(isSovereignFeatureSource("Job: Destroyer")).toBe(false);
		expect(isSovereignFeatureSource(null)).toBe(false);
	});
});
