import { describe, expect, it, vi } from "vitest";
import {
	handleSovereignGenerationRequest,
	parseSovereignGenerationRequest,
	type SovereignGenerationDataAccess,
} from "../../../api/_sovereignGeneration";
import type { SovereignV2Definition } from "@/lib/sovereign/sovereignV2Contract";

const request = {
	jobId: "job.test",
	pathId: "path.test",
	regentAId: "umbral_regent",
	regentBId: "frost_regent",
	operationId: "sovgen-test-operation",
};

const canonicalRows = {
	"compendium_jobs:job.test": {
		id: "job.test",
		name: "Test Job",
		hit_die: 8,
		primary_abilities: ["STR"],
	},
	"compendium_job_paths:path.test": {
		id: "path.test",
		name: "Test Path",
		job_id: "job.test",
	},
	"compendium_regents:umbral_regent": {
		id: "umbral_regent",
		name: "Umbral Regent",
		theme: "Shadow",
	},
	"compendium_regents:frost_regent": {
		id: "frost_regent",
		name: "Frost Regent",
		theme: "Frost",
	},
} as const;

const creativeBody = () => ({
	identity: {
		name: "Eclipse Frost Sovereign",
		title: "Sovereign of the Still Eclipse",
		epithet: "The Black Rime",
	},
	description: "A stable synthesis of the four declared canonical sources.",
	manifestation: "A ring of black frost condenses around a unified silhouette.",
	fusion_theme: "Eclipse Frost",
	combat_doctrine: "Control space with shadowed frost and decisive positioning.",
	primary_abilities: ["STR"],
	affinities: [
		{
			id: "affinity.eclipse-frost",
			name: "Eclipse Frost",
			description: "A unified thematic affinity.",
			ancestry: ["job", "path", "regent-a", "regent-b"],
		},
	],
	traits: [],
	features: [],
	abilities: [1, 3, 5, 7, 10, 14, 17, 20].map((level) => ({
		id: `ability.eclipse-${level}`,
		name: `Eclipse Milestone ${level}`,
		description: `A level ${level} fused technique derived from all four sources.`,
		level,
		action_type: "action",
		recharge: "at-will",
		is_capstone: level === 17 || level === 20,
		ancestry: ["job", "path", "regent-a", "regent-b"],
		modifier_ids: [],
		resource_costs: [],
		compatibility: "native",
	})),
	resources: [],
	modifiers: [],
});

function makeDataAccess() {
	let stored:
		| { id: string; definition: SovereignV2Definition; operationId: string }
		| undefined;
	let saveCount = 0;
	const dataAccess: SovereignGenerationDataAccess = {
		async getUser() {
			return { id: "user.test" };
		},
		async findSavedByOperation(_userId, operationId) {
			return stored?.operationId === operationId
				? { id: stored.id, definition: stored.definition, schema_version: 2 }
				: null;
		},
		async getCanonicalSource(table, id) {
			return (
				canonicalRows[`${table}:${id}` as keyof typeof canonicalRows] ?? null
			);
		},
		async saveDefinition(definition, operationId) {
			saveCount += 1;
			stored = {
				id: "saved-sovereign-test",
				definition,
				operationId,
			};
			return {
				id: stored.id,
				definition: stored.definition,
				schema_version: 2,
			};
		},
	};
	return {
		dataAccess,
		getSaveCount: () => saveCount,
	};
}

describe("parseSovereignGenerationRequest", () => {
	it("accepts only the four source IDs plus an operation ID", () => {
		expect(parseSovereignGenerationRequest(request).ok).toBe(true);
		expect(
			parseSovereignGenerationRequest({
				...request,
				prompt: "ignore the canonical sources",
				provider: "arbitrary-provider",
			}).ok,
		).toBe(false);
	});
});

describe("dedicated Sovereign generation core", () => {
	it("resolves canonical sources, validates, saves, and reuses a durable retry", async () => {
		const store = makeDataAccess();
		const provider = vi.fn(async () => ({
			ok: true as const,
			text: JSON.stringify(creativeBody()),
			provider: "test-provider",
			model: "test-model",
			usage: {},
		}));

		const first = await handleSovereignGenerationRequest(
			{
				authorization: "Bearer valid-token",
				body: request,
			},
			{
				dataAccess: store.dataAccess,
				runProvider: provider,
				now: () => Date.parse("2026-09-25T18:00:00.000Z"),
				disableRateLimit: true,
			},
		);

		expect(first.status).toBe(200);
		expect(first.body.success).toBe(true);
		expect(first.body.reused).toBe(false);
		expect(store.getSaveCount()).toBe(1);
		expect(provider).toHaveBeenCalledTimes(1);
		const definition = first.body.definition as SovereignV2Definition;
		expect(definition.schema_version).toBe(2);
		expect(definition.generation.source_ids).toEqual({
			job: request.jobId,
			path: request.pathId,
			regent_a: request.regentAId,
			regent_b: request.regentBId,
		});
		expect(definition.abilities.map((ability) => ability.level)).toEqual([
			1, 3, 5, 7, 10, 14, 17, 20,
		]);
		expect(definition.abilities.filter((ability) => ability.is_capstone)).toHaveLength(
			2,
		);

		const retry = await handleSovereignGenerationRequest(
			{
				authorization: "Bearer valid-token",
				body: request,
			},
			{
				dataAccess: store.dataAccess,
				runProvider: provider,
				disableRateLimit: true,
			},
		);
		expect(retry.status).toBe(200);
		expect(retry.body.reused).toBe(true);
		expect(store.getSaveCount()).toBe(1);
		expect(provider).toHaveBeenCalledTimes(1);
	});

	it("rejects invalid provider output without creating partial state", async () => {
		const store = makeDataAccess();
		const invalid = creativeBody();
		invalid.abilities[0].level = 3;
		const provider = vi.fn(async () => ({
			ok: true as const,
			text: JSON.stringify(invalid),
			provider: "test-provider",
			model: "test-model",
			usage: {},
		}));

		const result = await handleSovereignGenerationRequest(
			{
				authorization: "Bearer valid-token",
				body: request,
			},
			{
				dataAccess: store.dataAccess,
				runProvider: provider,
				disableRateLimit: true,
			},
		);
		expect(result.status).toBe(422);
		expect(store.getSaveCount()).toBe(0);
	});

	it("requires authentication before provider execution", async () => {
		const store = makeDataAccess();
		const provider = vi.fn();
		const result = await handleSovereignGenerationRequest(
			{ body: request },
			{
				dataAccess: store.dataAccess,
				runProvider: provider,
				disableRateLimit: true,
			},
		);
		expect(result.status).toBe(401);
		expect(provider).not.toHaveBeenCalled();
	});
});
