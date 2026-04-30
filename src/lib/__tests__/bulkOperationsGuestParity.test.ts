/**
 * DDB-parity regression tests for bulk character operations on guest IDs.
 *
 * These exercise only the local (`isLocalCharacterId`) branches of
 * `bulkOperations.ts` so we avoid Supabase round-trips. The remote paths
 * are covered by integration tests elsewhere.
 *
 * NOTE: vitest in this project uses a persistent localStorage file shared
 * across test files (see `vitest.config.ts:execArgv`). To stay
 * parallel-safe we never call `localStorage.clear()` here — each test
 * creates its own characters with unique IDs and cleans them up after.
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import {
	type BulkLevelUpResult,
	bulkDeleteCharacters,
	bulkLevelUp,
	bulkRest,
	bulkUpdateCharacters,
	detectBulkLevelUpChoiceRequirement,
} from "@/lib/bulkOperations";
import {
	createLocalCharacter,
	deleteLocalCharacter,
	getLocalCharacterState,
	isLocalCharacterId,
} from "@/lib/guestStore";
import { initializeProtocolData } from "@/lib/ProtocolDataManager";
import type { StaticJob } from "@/types/character";

const createdIds: string[] = [];

function makeLocalCharacter(
	overrides: Partial<Parameters<typeof createLocalCharacter>[0]> = {},
) {
	const character = createLocalCharacter({
		name: overrides.name ?? "Bulk Test Subject",
		job: overrides.job ?? "Destroyer",
		level: overrides.level ?? 1,
		hp_current: overrides.hp_current ?? 10,
		hp_max: overrides.hp_max ?? 10,
		hit_dice_current: overrides.hit_dice_current ?? 1,
		hit_dice_max: overrides.hit_dice_max ?? 1,
		hit_dice_size: overrides.hit_dice_size ?? 12,
		rift_favor_current: overrides.rift_favor_current ?? 0,
		rift_favor_max: overrides.rift_favor_max ?? 3,
		rift_favor_die: overrides.rift_favor_die ?? 4,
		exhaustion_level: overrides.exhaustion_level ?? 2,
		conditions: overrides.conditions ?? null,
		...overrides,
	});
	createdIds.push(character.id);
	return character;
}

function syntheticChoiceJob(): StaticJob {
	return {
		id: "synthetic-choice-job",
		name: "Synthetic Choice Job",
		type: "Job",
		rank: "C",
		description: "Synthetic test job",
		hitDie: "1d8",
		awakeningFeatures: [
			{
				level: 5,
				name: "Power Choice Gate",
				description: "Choose one additional power.",
			},
			{
				level: 5,
				name: "Technique Choice Gate",
				description: "Learn two additional techniques.",
			},
		],
		jobTraits: [],
	} as unknown as StaticJob;
}

describe("bulkOperations — guest parity & ASI safety", () => {
	beforeAll(async () => {
		// Static path/job catalogs are needed for the path-unlock gate to
		// fire under the choice-requirement detector.
		await initializeProtocolData();
	});

	afterEach(() => {
		// Clean up only the IDs we created so we don't trample on other
		// test files' state under parallel execution.
		while (createdIds.length > 0) {
			const id = createdIds.pop();
			if (id) {
				try {
					deleteLocalCharacter(id);
				} catch {
					// Already gone — fine.
				}
			}
		}
	});

	describe("bulkDeleteCharacters", () => {
		it("removes guest characters via guestStore (no remote call)", async () => {
			const a = makeLocalCharacter({ name: "Alpha" });
			const b = makeLocalCharacter({ name: "Beta" });

			expect(isLocalCharacterId(a.id)).toBe(true);
			expect(isLocalCharacterId(b.id)).toBe(true);

			const result = await bulkDeleteCharacters([a.id, b.id]);
			expect(result).toEqual({ success: 2, failed: 0 });

			expect(getLocalCharacterState(a.id)).toBeNull();
			expect(getLocalCharacterState(b.id)).toBeNull();
		});

		it("returns success=0 / failed=0 for an empty list", async () => {
			const result = await bulkDeleteCharacters([]);
			expect(result).toEqual({ success: 0, failed: 0 });
		});
	});

	describe("bulkUpdateCharacters", () => {
		it("applies partial updates to local characters", async () => {
			const c = makeLocalCharacter({ level: 1, hp_max: 10 });
			const result = await bulkUpdateCharacters([c.id], { hp_max: 25 });
			expect(result).toEqual({ success: 1, failed: 0 });

			const after = getLocalCharacterState(c.id);
			expect(after?.character.hp_max).toBe(25);
		});

		it("counts missing local IDs as failed", async () => {
			const result = await bulkUpdateCharacters(["local_does_not_exist"], {
				hp_max: 50,
			});
			expect(result.failed).toBe(1);
			expect(result.success).toBe(0);
		});
	});

	describe("bulkLevelUp", () => {
		it("detects job-granted power and technique choice tiers", () => {
			const choiceBlock = detectBulkLevelUpChoiceRequirement(
				4,
				"Synthetic Choice Job",
				"Any Path",
				[syntheticChoiceJob()],
			);

			expect(choiceBlock).toMatchObject({ newLevel: 5 });
			expect(choiceBlock?.reason).toContain("1 power choice");
			expect(choiceBlock?.reason).toContain("2 technique choices");
		});

		it("allows bulk level-up when no new job-granted choices appear", () => {
			expect(
				detectBulkLevelUpChoiceRequirement(
					5,
					"Synthetic Choice Job",
					"Any Path",
					[syntheticChoiceJob()],
				),
			).toBeNull();
		});

		it("levels a non-ASI character (Mage L1 → L2 with path) and bumps stats", async () => {
			// Mage ASI levels are 4/8/12/16/19, but Mage paths unlock at L2.
			// Provide a path up-front so the path-unlock gate doesn't fire.
			const m = makeLocalCharacter({
				job: "Mage",
				level: 1,
				hp_max: 8,
				path: "Path of the Detonation Specialist",
			});
			const result = await bulkLevelUp([m.id]);

			expect(result.success).toBe(1);
			expect(result.failed).toBe(0);
			expect(result.skipped).toEqual([]);

			const after = getLocalCharacterState(m.id)?.character;
			expect(after?.level).toBe(2);
			expect(after?.hit_dice_max).toBe(2);
		});

		it("skips characters whose new level requires an ASI/Feat choice", async () => {
			// Mage L3 → L4 is an ASI tier. Bulk should skip with a reason.
			// (Provide a path so we isolate the ASI gate from the path gate.)
			const m = makeLocalCharacter({
				job: "Mage",
				level: 3,
				path: "Path of the Detonation Specialist",
			});
			const result = await bulkLevelUp([m.id]);

			expect(result.success).toBe(0);
			expect(result.failed).toBe(0);
			expect(result.skipped).toHaveLength(1);
			expect(result.skipped[0]).toMatchObject({
				id: m.id,
				newLevel: 4,
			});
			expect(result.skipped[0].reason).toContain("ASI");

			// And the character must NOT have been advanced silently.
			const after = getLocalCharacterState(m.id)?.character;
			expect(after?.level).toBe(3);
		});

		it("mixed batch reports separate success and skipped counts", async () => {
			// `safe` already has a Path so it advances; `needsChoice` is at
			// an ASI tier so it must be skipped.
			const safe = makeLocalCharacter({
				job: "Mage",
				level: 1,
				path: "Path of the Detonation Specialist",
			});
			const needsChoice = makeLocalCharacter({
				job: "Mage",
				level: 3,
				path: "Path of the Detonation Specialist",
			});

			const result = await bulkLevelUp([safe.id, needsChoice.id]);

			expect(result.success).toBe(1);
			expect(result.skipped).toHaveLength(1);
			expect(result.skipped[0].id).toBe(needsChoice.id);
		});

		it("skips Path-unlock level when character has no path yet", async () => {
			// Mage's first Path unlocks at level 2, so L1 → L2 fires the
			// path gate. Bulk should skip until the user picks one in the
			// wizard.
			const m = makeLocalCharacter({
				job: "Mage",
				level: 1,
				path: null,
			});
			const result = await bulkLevelUp([m.id]);

			expect(result.success).toBe(0);
			expect(result.skipped).toHaveLength(1);
			expect(result.skipped[0]).toMatchObject({
				id: m.id,
				newLevel: 2,
			});
			expect(result.skipped[0].reason).toContain("Path");

			// Character must remain at L1.
			const after = getLocalCharacterState(m.id)?.character;
			expect(after?.level).toBe(1);
		});

		it("does NOT skip Path-unlock level when character already has a path", async () => {
			// Same scenario but with a Path already chosen — the gate
			// should let the level-up proceed normally.
			const m = makeLocalCharacter({
				job: "Mage",
				level: 1,
				path: "Path of the Detonation Specialist",
			});
			const result = await bulkLevelUp([m.id]);

			expect(result.success).toBe(1);
			expect(result.skipped).toEqual([]);

			const after = getLocalCharacterState(m.id)?.character;
			expect(after?.level).toBe(2);
		});

		it("recomputes proficiency_bonus on level-up", async () => {
			// PB: lvl 1-4 = +2, lvl 5-8 = +3 — so L4→L5 (non-ASI for at least
			// some jobs) should bump PB, but Mage L4 IS an ASI level. Use a
			// scenario known to be safe: L5→L6 (Mage non-ASI tier).
			const m = makeLocalCharacter({ job: "Mage", level: 5, hp_max: 30 });
			const result = await bulkLevelUp([m.id]);
			expect(result.success).toBe(1);
			const after = getLocalCharacterState(m.id)?.character;
			// L6 → ceil(6/4)+1 = 2+1 = 3
			expect(after?.proficiency_bonus).toBe(3);
		});
	});

	describe("bulkRest", () => {
		it("short rest restores half max hit dice (rounded up)", async () => {
			const c = makeLocalCharacter({
				hit_dice_max: 10,
				hit_dice_current: 0,
			});
			const result = await bulkRest([c.id], "short");
			expect(result).toEqual({ success: 1, failed: 0 });

			const after = getLocalCharacterState(c.id)?.character;
			// Math.ceil(10/2) = 5
			expect(after?.hit_dice_current).toBe(5);
		});

		it("long rest fully resets HP, hit dice, rift favor, exhaustion -1, conditions cleared", async () => {
			const c = makeLocalCharacter({
				hp_current: 1,
				hp_max: 30,
				hit_dice_current: 0,
				hit_dice_max: 5,
				rift_favor_current: 0,
				rift_favor_max: 4,
				exhaustion_level: 3,
				conditions: ["poisoned"],
			});
			const result = await bulkRest([c.id], "long");
			expect(result).toEqual({ success: 1, failed: 0 });

			const after = getLocalCharacterState(c.id)?.character;
			expect(after?.hp_current).toBe(30);
			expect(after?.hit_dice_current).toBe(5);
			expect(after?.rift_favor_current).toBe(4);
			expect(after?.exhaustion_level).toBe(2);
			expect(after?.conditions).toEqual([]);
		});

		it("long rest exhaustion never goes below 0", async () => {
			const c = makeLocalCharacter({ exhaustion_level: 0 });
			await bulkRest([c.id], "long");
			const after = getLocalCharacterState(c.id)?.character;
			expect(after?.exhaustion_level).toBe(0);
		});
	});

	// NOTE: `bulkAddEquipment` calls `resolveEquipment()` at top-level which
	// hits Supabase via `listCanonicalEntries`. Under parallel test-file
	// execution that creates flakiness for tests that rely on local state
	// surviving across the await. Coverage for the local-add path is
	// implicit via guestStore's own `addLocalEquipment`/`updateLocalEquipment`
	// tests — re-add an integration test here once the canonical resolver
	// can be mocked cleanly.

	describe("BulkLevelUpResult shape", () => {
		it("includes all three fields", () => {
			const empty: BulkLevelUpResult = { success: 0, failed: 0, skipped: [] };
			expect(empty).toHaveProperty("success");
			expect(empty).toHaveProperty("failed");
			expect(empty).toHaveProperty("skipped");
		});
	});
});
