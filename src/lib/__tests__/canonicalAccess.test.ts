import { beforeEach, describe, expect, it, vi } from "vitest";

const accessMocks = vi.hoisted(() => ({
	isDenied: (context?: { campaignId?: string | null }) =>
		context?.campaignId === "denied-campaign",
}));

vi.mock("@/lib/sourcebookAccess", () => ({
	filterRowsBySourcebookAccess: async <T>(
		rows: T[],
		_getSourcebook: (row: T) => string | null | undefined,
		context?: { campaignId?: string | null },
	) => (accessMocks.isDenied(context) ? [] : rows),
	isSourcebookAccessible: async (
		_sourceBook: string | null | undefined,
		context?: { campaignId?: string | null },
	) => !accessMocks.isDenied(context),
}));

import {
	findCanonicalCastableById,
	findCanonicalEntryById,
	findCanonicalEntryByName,
	isCanonicalCastableAccessible,
	isCanonicalEntryAccessible,
	resolveCanonicalCastableReference,
	resolveCanonicalReference,
} from "@/lib/canonicalCompendium";

const deniedContext = { campaignId: "denied-campaign" } as const;

describe("canonical identity and sourcebook authorization boundary", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("filters denied canonical IDs and names from public lookup", async () => {
		await expect(
			findCanonicalEntryById("jobs", "destroyer", deniedContext),
		).resolves.toBeNull();
		await expect(
			findCanonicalEntryByName("jobs", "Destroyer", deniedContext),
		).resolves.toBeNull();
	});

	it("classifies a denied known ID as inaccessible rather than custom", async () => {
		const resolution = await resolveCanonicalReference(
			"jobs",
			{ id: "destroyer", name: "an unrelated legacy name" },
			deniedContext,
		);

		expect(resolution).toMatchObject({
			matchedBy: "inaccessible",
			attemptedBy: "id",
			canonicalId: "destroyer",
			entry: null,
		});
		await expect(
			isCanonicalEntryAccessible("jobs", "destroyer", deniedContext),
		).resolves.toBe(false);
	});

	it("preserves access context on legacy name fallback", async () => {
		const resolution = await resolveCanonicalReference(
			"jobs",
			{ id: "unknown-legacy-id", name: "Destroyer" },
			deniedContext,
		);

		expect(resolution).toMatchObject({
			matchedBy: "inaccessible",
			attemptedBy: "name",
			canonicalId: "destroyer",
			entry: null,
		});
	});

	it("continues to treat genuinely unknown IDs as custom", async () => {
		await expect(
			isCanonicalEntryAccessible(
				"jobs",
				"definitely-not-canonical",
				deniedContext,
			),
		).resolves.toBe(true);
	});

	it("applies the same fail-closed boundary to castables", async () => {
		await expect(
			findCanonicalCastableById("shadow-step", deniedContext, ["powers"]),
		).resolves.toBeNull();
		await expect(
			isCanonicalCastableAccessible("shadow-step", deniedContext, ["powers"]),
		).resolves.toBe(false);

		const resolution = await resolveCanonicalCastableReference(
			{ id: "shadow-step" },
			deniedContext,
			["powers"],
		);
		expect(resolution).toMatchObject({
			matchedBy: "inaccessible",
			attemptedBy: "id",
			canonicalId: "shadow-step",
			entry: null,
		});
	});
});
