import { describe, expect, it } from "vitest";
import type {
	GeneratedSovereign,
	Job,
	Path,
	Regent,
} from "@/lib/geminiProtocol";
import {
	buildLegacySovereignSavePayload,
	canonicalizeLegacySovereign,
	isRebuildableSovereignFeature,
	legacySovereignSaveOperationId,
	SOVEREIGN_PROJECTION_REVISION,
	sovereignAttachmentOperationId,
} from "@/lib/sovereign/sovereignPersistence";

const job = {
	id: "11111111-1111-4111-8111-111111111111",
	name: "Destroyer",
} as Job;
const path = {
	id: "22222222-2222-4222-8222-222222222222",
	name: "Path of the Frostwarden",
} as Path;
const regentA = { id: "shadow_regent", name: "Umbral Regent" } as Regent;
const regentB = { id: "frost_regent", name: "Frost Regent" } as Regent;

const sovereign = {
	name: " Frostvoid Sovereign ",
	title: " Sovereign of Frozen Shadow ",
	description: " A fused origin. ",
	fusion_theme: " Singularity Frost ",
	fusion_description: " A fused combat doctrine. ",
	fusion_method: " Gemini Protocol ",
	power_multiplier: " Zenith-Tier ",
	fusion_stability: " Stable ",
	job,
	path,
	regentA,
	regentB,
	abilities: [1, 3, 5, 7, 10, 14, 17, 20].map((level) => ({
		name: `Ability ${level}`,
		description: `Effect ${level}`,
		level,
		action_type: level === 1 ? "Passive" : "1 action",
		recharge: null,
		is_capstone: level === 17 || level === 20,
		origin_sources: ["Job+Path+RegentA+RegentB"],
		fusion_type: "fusion",
	})),
} as GeneratedSovereign;

describe("Sovereign S2 persistence helpers", () => {
	it("drops imported Sovereign projection rows so a backup cannot attach foreign mechanics", () => {
		expect(
			isRebuildableSovereignFeature({
				source: "Sovereign: Frostvoid",
				sovereign_definition_id: null,
			}),
		).toBe(true);
		expect(
			isRebuildableSovereignFeature({
				source: "Other",
				sovereign_definition_id: "foreign-save-id",
			}),
		).toBe(true);
		expect(isRebuildableSovereignFeature({ source: "Job: Destroyer" })).toBe(
			false,
		);
	});
	it("canonicalizes explicit Regent aliases without swapping source order", () => {
		const canonical = canonicalizeLegacySovereign(sovereign);
		expect(canonical.regentA.id).toBe("umbral_regent");
		expect(canonical.regentB.id).toBe("frost_regent");
	});

	it("builds a trimmed canonical legacy payload for server validation", () => {
		const payload = buildLegacySovereignSavePayload(sovereign);
		expect(payload.name).toBe("Frostvoid Sovereign");
		expect(payload.job_id).toBe(job.id);
		expect(payload.path_id).toBe(path.id);
		expect(payload.regent_a_id).toBe("umbral_regent");
		expect(payload.regent_b_id).toBe("frost_regent");
		expect(payload.abilities).toHaveLength(8);
	});

	it("uses deterministic content identity for retry-safe legacy saves", () => {
		const first = buildLegacySovereignSavePayload(sovereign);
		const reordered = {
			...first,
			abilities: first.abilities.map((ability) => ({ ...ability })),
		};
		expect(legacySovereignSaveOperationId(first)).toBe(
			legacySovereignSaveOperationId(reordered),
		);
		expect(legacySovereignSaveOperationId(first)).toMatch(
			/^s2-save-legacy-[0-9a-f]{8}$/,
		);
	});

	it("changes the save identity when mechanics change", () => {
		const first = buildLegacySovereignSavePayload(sovereign);
		const changed = {
			...first,
			abilities: first.abilities.map((ability, index) =>
				index === 0 ? { ...ability, description: "Different effect" } : ability,
			),
		};
		expect(legacySovereignSaveOperationId(first)).not.toBe(
			legacySovereignSaveOperationId(changed),
		);
	});

	it("pins attachment retry identity to the projection revision", () => {
		const id = sovereignAttachmentOperationId(
			"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
			"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
		);
		expect(id).toContain(SOVEREIGN_PROJECTION_REVISION);
		expect(id.length).toBeLessThanOrEqual(200);
	});
});
