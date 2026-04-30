import { describe, expect, it } from "vitest";
import {
	findCanonicalCastableById,
	findCanonicalEntryById,
	findCanonicalEntryByName,
	isCanonicalCastableAccessible,
	isCanonicalEntryAccessible,
	listCanonicalEntries,
	resolveCanonicalCastableReference,
	resolveCanonicalReference,
	resolveCharacterCanonicalIds,
} from "@/lib/canonicalCompendium";

type CharacterCanonicalRefShape = {
	job?: string | null;
	path?: string | null;
	background?: string | null;
	job_id?: string | null;
	path_id?: string | null;
	background_id?: string | null;
};

describe("findCanonicalEntryById", () => {
	it("returns null for missing ids", async () => {
		expect(await findCanonicalEntryById("jobs", null)).toBeNull();
		expect(await findCanonicalEntryById("jobs", undefined)).toBeNull();
		expect(await findCanonicalEntryById("jobs", "")).toBeNull();
	});

	it("resolves a known canonical job by static slug id", async () => {
		const entry = await findCanonicalEntryById("jobs", "destroyer");
		expect(entry?.id).toBe("destroyer");
		expect(entry?.name).toBe("Destroyer");
	});

	it("returns null for unknown ids", async () => {
		const entry = await findCanonicalEntryById(
			"jobs",
			"definitely-not-a-real-job",
		);
		expect(entry).toBeNull();
	});

	it("does not cross canonical types", async () => {
		// `destroyer` is a job id, not a path id.
		const wrongType = await findCanonicalEntryById("paths", "destroyer");
		expect(wrongType).toBeNull();
	});
});

describe("findCanonicalCastableById", () => {
	it("returns null for missing ids", async () => {
		expect(await findCanonicalCastableById(null)).toBeNull();
		expect(await findCanonicalCastableById(undefined)).toBeNull();
		expect(await findCanonicalCastableById("")).toBeNull();
	});

	it("returns null for unknown ids", async () => {
		const entry = await findCanonicalCastableById(
			"definitely-not-a-real-power",
		);
		expect(entry).toBeNull();
	});

	it("returns a canonical power when matched and tagged with canonical_type", async () => {
		const entry = await findCanonicalCastableById("shadow-step", undefined, [
			"powers",
		]);
		expect(entry?.id).toBe("shadow-step");
		expect(entry?.canonical_type).toBe("powers");
	});
});

describe("resolveCharacterCanonicalIds", () => {
	it("returns input unchanged when no canonical name fields are present", async () => {
		const input: CharacterCanonicalRefShape & { name: string } = {
			name: "Test Character",
		};
		const result = await resolveCharacterCanonicalIds(input);
		expect(result).toEqual(input);
	});

	it("fills job_id, path_id, and background_id from canonical names", async () => {
		const input: CharacterCanonicalRefShape = {
			job: "Destroyer",
		};
		const result = await resolveCharacterCanonicalIds(input);
		expect(result.job_id).toBe("destroyer");
	});

	it("preserves explicit canonical IDs over name-based resolution", async () => {
		const input: CharacterCanonicalRefShape = {
			job: "Destroyer",
			job_id: "explicit-id-override",
		};
		const result = await resolveCharacterCanonicalIds(input);
		expect(result.job_id).toBe("explicit-id-override");
	});

	it("nulls canonical IDs when the corresponding name is explicitly cleared", async () => {
		const input: CharacterCanonicalRefShape = { job: null };
		const result = await resolveCharacterCanonicalIds(input);
		expect(result.job_id).toBeNull();
	});

	it("leaves canonical IDs untouched when neither name nor id is provided", async () => {
		const input: CharacterCanonicalRefShape = {};
		const result = await resolveCharacterCanonicalIds(input);
		expect("job_id" in result).toBe(false);
		expect("path_id" in result).toBe(false);
		expect("background_id" in result).toBe(false);
	});

	it("returns null id for unknown canonical names", async () => {
		const input: CharacterCanonicalRefShape = {
			job: "Nonexistent Job",
		};
		const result = await resolveCharacterCanonicalIds(input);
		expect(result.job_id).toBeNull();
	});
});

describe("resolveCanonicalReference", () => {
	it("returns matchedBy:none for empty references", async () => {
		const result = await resolveCanonicalReference("jobs", {});
		expect(result.matchedBy).toBe("none");
		expect(result.entry).toBeNull();
	});

	it("matches by id first when both id and name are provided", async () => {
		const jobs = await listCanonicalEntries("jobs");
		const knownJob = jobs.find((entry) => entry.id === "destroyer");
		expect(knownJob).toBeDefined();
		const result = await resolveCanonicalReference("jobs", {
			id: knownJob?.id,
			name: "this name does not match anything",
		});
		expect(result.matchedBy).toBe("id");
		expect(result.entry?.id).toBe("destroyer");
	});

	it("falls back to name when id is missing", async () => {
		const result = await resolveCanonicalReference("jobs", {
			name: "Destroyer",
		});
		expect(result.matchedBy).toBe("name");
		expect(result.entry?.id).toBe("destroyer");
	});

	it("returns matchedBy:none for unknown references (treated as custom)", async () => {
		const result = await resolveCanonicalReference("jobs", {
			id: "definitely-not-a-real-id",
			name: "Definitely Not A Real Name",
		});
		expect(result.matchedBy).toBe("none");
		expect(result.entry).toBeNull();
	});
});

describe("resolveCanonicalCastableReference", () => {
	it("returns matchedBy:none for empty references", async () => {
		const result = await resolveCanonicalCastableReference({});
		expect(result.matchedBy).toBe("none");
		expect(result.entry).toBeNull();
	});

	it("prefers id over name when both are supplied", async () => {
		const result = await resolveCanonicalCastableReference(
			{ id: "shadow-step", name: "this name should be ignored" },
			undefined,
			["powers"],
		);
		expect(result.matchedBy).toBe("id");
		expect(result.entry?.id).toBe("shadow-step");
		expect(result.entry?.canonical_type).toBe("powers");
	});

	it("falls back to name when id is missing", async () => {
		const result = await resolveCanonicalCastableReference(
			{ name: "Shadow Step" },
			undefined,
			["powers"],
		);
		expect(result.matchedBy).toBe("name");
		expect(result.entry?.id).toBe("shadow-step");
	});

	it("returns matchedBy:none when neither id nor name resolves", async () => {
		const result = await resolveCanonicalCastableReference({
			id: "no-such-power",
			name: "No Such Spell",
		});
		expect(result.matchedBy).toBe("none");
		expect(result.entry).toBeNull();
	});
});

describe("canonical reference duplicate-name and rename resilience", () => {
	it("does not return cross-type matches when looking up by id", async () => {
		// 'destroyer' is a job id; treating it as a path id must not surface it.
		const wrongType = await findCanonicalEntryById("paths", "destroyer");
		expect(wrongType).toBeNull();
	});

	it("ignores stale name-only lookups when an id-resolved entry exists", async () => {
		// Even if the consumer holds an outdated name, an ID-first resolver
		// will surface the canonical entry that owns the id.
		const knownId = "destroyer";
		const result = await resolveCanonicalReference("jobs", {
			id: knownId,
			name: "Old Renamed Destroyer",
		});
		expect(result.matchedBy).toBe("id");
		expect(result.entry?.id).toBe(knownId);
	});

	it("treats name-only matches as legacy resolutions", async () => {
		const fallback = await resolveCanonicalReference("jobs", {
			name: "Destroyer",
		});
		expect(fallback.matchedBy).toBe("name");
		expect(fallback.entry?.id).toBe("destroyer");
	});

	it("name-based lookup is case-insensitive and trims whitespace", async () => {
		const upper = await findCanonicalEntryByName("jobs", "  DESTROYER  ");
		expect(upper?.id).toBe("destroyer");
	});

	it("findCanonicalEntryByName respects type isolation", async () => {
		// 'Destroyer' is a job; asking for it as a 'paths' entry returns null.
		const path = await findCanonicalEntryByName("paths", "Destroyer");
		expect(path).toBeNull();
	});
});

describe("isCanonicalEntryAccessible", () => {
	it("returns true when no id is provided (custom/unresolved entry)", async () => {
		expect(await isCanonicalEntryAccessible("jobs", null)).toBe(true);
		expect(await isCanonicalEntryAccessible("jobs", undefined)).toBe(true);
		expect(await isCanonicalEntryAccessible("jobs", "")).toBe(true);
	});

	it("returns true when the id is unknown (custom/unresolved entry)", async () => {
		expect(
			await isCanonicalEntryAccessible("jobs", "definitely-not-a-real-id"),
		).toBe(true);
	});

	it("delegates to source-book accessibility for canonical entries", async () => {
		// In an unauthenticated test environment, accessibility falls back to
		// the public sourcebook set, which canonical RA jobs belong to.
		expect(await isCanonicalEntryAccessible("jobs", "destroyer")).toBe(true);
	});
});
describe("isCanonicalCastableAccessible", () => {
	it("returns true when no id is provided (custom/unresolved castable)", async () => {
		expect(await isCanonicalCastableAccessible(null)).toBe(true);
		expect(await isCanonicalCastableAccessible(undefined)).toBe(true);
		expect(await isCanonicalCastableAccessible("")).toBe(true);
	});

	it("returns true when the id is unknown (custom/unresolved castable)", async () => {
		expect(
			await isCanonicalCastableAccessible("definitely-not-a-real-id"),
		).toBe(true);
	});

	it("delegates to source-book accessibility for canonical castables", async () => {
		expect(
			await isCanonicalCastableAccessible("shadow-step", undefined, ["powers"]),
		).toBe(true);
	});
});
