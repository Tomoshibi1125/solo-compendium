/**
 * Character Resources — DDB / 5e parity regression tests.
 *
 * Locks in the rest-recharge cadence, temp-HP timing, inspiration toggle,
 * and death-save bookkeeping for the character-resources sub-system.
 */
import { describe, expect, it } from "vitest";
import {
	addTemporaryHP,
	applyInspiration,
	applyResourceRest,
	type CharacterResources,
	type CustomResource,
	calculateTotalTempHP,
	clearExpiredTempHP,
	gainInspiration,
	handleDeathSave,
	initializeCharacterResources,
	normalizeCharacterResources,
	resetDeathSaves,
} from "@/lib/characterResources";

const baseResources = (
	overrides: Partial<CharacterResources> = {},
): CharacterResources => ({
	...initializeCharacterResources(),
	...overrides,
});

const customResource = (
	overrides: Partial<CustomResource> = {},
): CustomResource => ({
	id: overrides.id ?? "r1",
	name: overrides.name ?? "Channel Divinity",
	current: overrides.current ?? 0,
	max: overrides.max ?? 2,
	recharge: overrides.recharge ?? "short-rest",
	dieSize: overrides.dieSize,
	notes: overrides.notes,
});

describe("initializeCharacterResources", () => {
	it("starts with zero inspiration and clean death saves", () => {
		const r = initializeCharacterResources();
		expect(r.inspiration.inspiration_points).toBe(0);
		expect(r.inspiration.inspiration_used).toBe(false);
		expect(r.death_saves.death_save_successes).toBe(0);
		expect(r.death_saves.death_save_failures).toBe(0);
		expect(r.death_saves.is_stable).toBe(false);
		expect(r.temp_hp_sources).toEqual([]);
		expect(r.custom_resources).toEqual([]);
	});
});

describe("normalizeCharacterResources", () => {
	it("returns defaults for null/undefined", () => {
		expect(normalizeCharacterResources(null)).toEqual(
			initializeCharacterResources(),
		);
		expect(normalizeCharacterResources(undefined)).toEqual(
			initializeCharacterResources(),
		);
	});

	it("preserves inspiration points from input", () => {
		const r = normalizeCharacterResources({
			inspiration: { inspiration_points: 3, inspiration_used: false },
		});
		expect(r.inspiration.inspiration_points).toBe(3);
	});

	it("clamps custom resource current to [0, max]", () => {
		const r = normalizeCharacterResources({
			custom_resources: [
				{ id: "x", name: "Ki", current: 999, max: 5, recharge: "short-rest" },
				{ id: "y", name: "Slots", current: -3, max: 4, recharge: "long-rest" },
			],
		});
		expect(r.custom_resources[0].current).toBe(5);
		expect(r.custom_resources[1].current).toBe(0);
	});

	it("filters out invalid custom resources without a name", () => {
		const r = normalizeCharacterResources({
			custom_resources: [
				{ id: "x", current: 1, max: 1 } as unknown as CustomResource,
				customResource({ name: "Ok" }),
			],
		});
		expect(r.custom_resources).toHaveLength(1);
		expect(r.custom_resources[0].name).toBe("Ok");
	});

	it("preserves conditions array", () => {
		const r = normalizeCharacterResources({
			conditions: [
				{
					id: "c1",
					conditionName: "Poisoned",
					sourceType: "spell",
					sourceId: null,
					sourceName: null,
					appliedAt: new Date().toISOString(),
					durationRounds: null,
					remainingRounds: null,
					concentrationSpellId: null,
					isActive: true,
				},
			],
		});
		expect(r.conditions).toHaveLength(1);
		expect(r.conditions[0].conditionName).toBe("Poisoned");
	});
});

describe("applyResourceRest (DDB short/long rest cadence)", () => {
	it("short rest restores short-rest and encounter resources only", () => {
		const r = baseResources({
			custom_resources: [
				customResource({
					id: "sr",
					name: "SR",
					current: 0,
					max: 3,
					recharge: "short-rest",
				}),
				customResource({
					id: "lr",
					name: "LR",
					current: 0,
					max: 3,
					recharge: "long-rest",
				}),
				customResource({
					id: "enc",
					name: "Enc",
					current: 0,
					max: 1,
					recharge: "encounter",
				}),
				customResource({
					id: "daily",
					name: "Daily",
					current: 0,
					max: 1,
					recharge: "daily",
				}),
				customResource({
					id: "none",
					name: "None",
					current: 0,
					max: 1,
					recharge: "none",
				}),
			],
		});
		const after = applyResourceRest(r, "short");
		const byId = Object.fromEntries(
			after.custom_resources.map((c) => [c.id, c]),
		);
		expect(byId.sr.current).toBe(3);
		expect(byId.enc.current).toBe(1);
		expect(byId.lr.current).toBe(0);
		expect(byId.daily.current).toBe(0);
		expect(byId.none.current).toBe(0);
	});

	it("long rest restores short-rest, long-rest, encounter, and daily resources", () => {
		const r = baseResources({
			custom_resources: [
				customResource({
					id: "sr",
					name: "SR",
					current: 0,
					max: 3,
					recharge: "short-rest",
				}),
				customResource({
					id: "lr",
					name: "LR",
					current: 0,
					max: 3,
					recharge: "long-rest",
				}),
				customResource({
					id: "enc",
					name: "Enc",
					current: 0,
					max: 1,
					recharge: "encounter",
				}),
				customResource({
					id: "daily",
					name: "Daily",
					current: 0,
					max: 1,
					recharge: "daily",
				}),
				customResource({
					id: "none",
					name: "None",
					current: 0,
					max: 1,
					recharge: "none",
				}),
			],
		});
		const after = applyResourceRest(r, "long");
		const byId = Object.fromEntries(
			after.custom_resources.map((c) => [c.id, c]),
		);
		expect(byId.sr.current).toBe(3);
		expect(byId.lr.current).toBe(3);
		expect(byId.enc.current).toBe(1);
		expect(byId.daily.current).toBe(1);
		// Resources marked as "none" never recharge automatically.
		expect(byId.none.current).toBe(0);
	});

	it("long rest resets death saves; short rest leaves them alone", () => {
		const r = baseResources({
			death_saves: {
				death_save_successes: 2,
				death_save_failures: 1,
				is_stable: false,
			},
		});
		const short = applyResourceRest(r, "short");
		expect(short.death_saves.death_save_successes).toBe(2);
		expect(short.death_saves.death_save_failures).toBe(1);

		const long = applyResourceRest(r, "long");
		expect(long.death_saves).toEqual({
			death_save_successes: 0,
			death_save_failures: 0,
			is_stable: false,
		});
	});

	it("does not mutate the input resources", () => {
		const r = baseResources({
			custom_resources: [
				customResource({ current: 0, max: 3, recharge: "long-rest" }),
			],
		});
		const snapshot = JSON.stringify(r);
		applyResourceRest(r, "long");
		expect(JSON.stringify(r)).toBe(snapshot);
	});
});

describe("temporary HP", () => {
	it("addTemporaryHP appends a source", () => {
		const r = baseResources();
		const after = addTemporaryHP(r, 5, "Aid");
		expect(after.temp_hp_sources).toHaveLength(1);
		expect(after.temp_hp_sources[0]).toMatchObject({
			amount: 5,
			source: "Aid",
		});
	});

	it("calculateTotalTempHP sums non-expired sources", () => {
		const future = new Date(Date.now() + 60_000).toISOString();
		const past = new Date(Date.now() - 60_000).toISOString();
		const r = baseResources({
			temp_hp_sources: [
				{ amount: 5, source: "Aid", expires_at: future },
				{ amount: 3, source: "Bless", expires_at: past }, // expired
				{ amount: 2, source: "Permanent" }, // no expiry
			],
		});
		expect(calculateTotalTempHP(r)).toBe(7);
	});

	it("clearExpiredTempHP drops expired entries", () => {
		const future = new Date(Date.now() + 60_000).toISOString();
		const past = new Date(Date.now() - 60_000).toISOString();
		const r = baseResources({
			temp_hp_sources: [
				{ amount: 5, source: "Aid", expires_at: future },
				{ amount: 3, source: "Old", expires_at: past },
			],
		});
		const after = clearExpiredTempHP(r);
		expect(after.temp_hp_sources).toHaveLength(1);
		expect(after.temp_hp_sources[0].source).toBe("Aid");
	});

	it("addTemporaryHP with duration sets expires_at", () => {
		const r = baseResources();
		const after = addTemporaryHP(r, 5, "Spell", 10); // 10 minutes
		expect(after.temp_hp_sources[0].expires_at).toBeDefined();
	});
});

describe("inspiration toggle", () => {
	it("gainInspiration adds 1 point and clears the used flag", () => {
		const r = baseResources({
			inspiration: { inspiration_points: 0, inspiration_used: true },
		});
		const after = gainInspiration(r);
		expect(after.inspiration.inspiration_points).toBe(1);
		expect(after.inspiration.inspiration_used).toBe(false);
	});

	it("applyInspiration decrements points and sets used flag", () => {
		const r = baseResources({
			inspiration: { inspiration_points: 1, inspiration_used: false },
		});
		const after = applyInspiration(r);
		expect(after.inspiration.inspiration_points).toBe(0);
		expect(after.inspiration.inspiration_used).toBe(true);
	});

	it("applyInspiration never goes below 0", () => {
		const r = baseResources({
			inspiration: { inspiration_points: 0, inspiration_used: false },
		});
		const after = applyInspiration(r);
		expect(after.inspiration.inspiration_points).toBe(0);
	});

	it("does not mutate the input", () => {
		const r = baseResources({
			inspiration: { inspiration_points: 2, inspiration_used: false },
		});
		const snapshot = { ...r.inspiration };
		gainInspiration(r);
		applyInspiration(r);
		expect(r.inspiration).toEqual(snapshot);
	});
});

describe("handleDeathSave", () => {
	it("3 successes → stable", () => {
		let r = baseResources({
			death_saves: {
				death_save_successes: 2,
				death_save_failures: 0,
				is_stable: false,
			},
		});
		const result = handleDeathSave(r, true);
		expect(result.outcome).toBe("stable");
		expect(result.updated.death_saves.is_stable).toBe(true);
		expect(result.updated.death_saves.death_save_successes).toBe(3);
		// Type narrowing
		r = result.updated;
	});

	it("3 failures → dead", () => {
		const r = baseResources({
			death_saves: {
				death_save_successes: 0,
				death_save_failures: 2,
				is_stable: false,
			},
		});
		const result = handleDeathSave(r, false);
		expect(result.outcome).toBe("dead");
		expect(result.updated.death_saves.death_save_failures).toBe(3);
	});

	it("incremental success → 'ongoing'", () => {
		const r = baseResources();
		const result = handleDeathSave(r, true);
		expect(result.outcome).toBe("ongoing");
		expect(result.updated.death_saves.death_save_successes).toBe(1);
	});

	it("incremental failure → 'ongoing'", () => {
		const r = baseResources();
		const result = handleDeathSave(r, false);
		expect(result.outcome).toBe("ongoing");
		expect(result.updated.death_saves.death_save_failures).toBe(1);
	});
});

describe("resetDeathSaves", () => {
	it("clears all counters and the stable flag", () => {
		const r = baseResources({
			death_saves: {
				death_save_successes: 2,
				death_save_failures: 1,
				is_stable: true,
			},
		});
		const after = resetDeathSaves(r);
		expect(after.death_saves).toEqual({
			death_save_successes: 0,
			death_save_failures: 0,
			is_stable: false,
		});
	});
});
