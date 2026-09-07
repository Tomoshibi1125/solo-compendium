/**
 * Unified resource tracking — auto-population invariants.
 *
 * Locks in: job pools seed themselves (no Enable click), reconcile follows
 * level/ability changes, equipment rows classify into the tracker sections
 * that attacks/consumption actually draw from, legacy localStorage trackers
 * migrate without duplicates, and pack-named starting gear carries its real
 * quantity ("Arrows (20)" = 20 arrows — the DDB-parity bug).
 */
import { describe, expect, it } from "vitest";
import {
	applyResourceRest,
	type CustomResource,
	initializeCharacterResources,
} from "@/lib/characterResources";
import {
	applyJobPoolReconcile,
	characterRowToJobPoolShape,
	classifyEquipmentResources,
	type EquipmentResourceRowLike,
	expandEquipmentGrant,
	jobPoolSourceKey,
	migrateLocalTrackedResources,
	parsePackQuantity,
	reconcileJobPools,
} from "@/lib/unifiedResources";

const equipmentRow = (
	overrides: Partial<EquipmentResourceRowLike> & { id: string; name: string },
): EquipmentResourceRowLike => ({
	item_type: "gear",
	quantity: 1,
	charges_current: null,
	charges_max: null,
	...overrides,
});

const customResource = (
	overrides: Partial<CustomResource> & { id: string; name: string },
): CustomResource => ({
	current: 0,
	max: 0,
	...overrides,
});

describe("characterRowToJobPoolShape (DB row → pool formula shape)", () => {
	it("maps short ability columns to the full-name pool shape", () => {
		const shape = characterRowToJobPoolShape({
			level: 1,
			str: 14,
			agi: 12,
			vit: 16,
			int: 15,
			sense: 10,
			pre: 8,
		});
		expect(shape).toEqual({
			level: 1,
			strength: 14,
			agility: 12,
			vitality: 16,
			intelligence: 15,
			sense: 10,
			presence: 8,
		});
	});

	it("level-1 Revenant Remnants derive from real INT, not a phantom 10", () => {
		// Regression: the hook cast the row directly, so `intelligence` was
		// undefined and the pool seeded at max(1, mod(10) + PB) = 2. With the
		// mapper it must be mod(15) + 2 = 4.
		const row = { level: 1, str: 14, agi: 12, vit: 16, int: 15, pre: 8 };
		const result = reconcileJobPools(
			"Revenant",
			characterRowToJobPoolShape(row),
			[],
		);
		expect(result?.additions[0]?.name).toBe("Remnants");
		expect(result?.additions[0]?.max).toBe(4);
		expect(result?.additions[0]?.recharge).toBe("none");
		// The un-mapped row reproduces the old bug — pinned as distinct.
		expect(reconcileJobPools("Revenant", row, [])?.additions[0]?.max).toBe(2);
	});

	it("repairs stale Remnant recovery without refilling spent Remnants", () => {
		const stale = customResource({
			id: "remnants",
			name: "Remnants",
			current: 1,
			max: 4,
			recharge: "long-rest",
			origin: "job-pool",
			sourceKey: jobPoolSourceKey("remnant-pool"),
		});
		const result = reconcileJobPools(
			"Revenant",
			{ level: 1, intelligence: 15 },
			[stale],
		);
		expect(result).toEqual({
			additions: [],
			updates: [{ id: "remnants", recharge: "none" }],
			removals: [],
		});
		expect(
			applyJobPoolReconcile(
				[stale],
				result ?? { additions: [], updates: [], removals: [] },
			)[0],
		).toMatchObject({ current: 1, max: 4, recharge: "none" });
	});

	it("passes through rows that already use full-name fields", () => {
		const shape = characterRowToJobPoolShape({ level: 3, intelligence: 18 });
		expect(shape.intelligence).toBe(18);
	});
});

describe("reconcileJobPools", () => {
	const herald = { level: 4 };

	it("does not duplicate feature-backed Task 5 resources as custom pools", () => {
		for (const job of ["Esper", "Idol", "Summoner"]) {
			expect(
				reconcileJobPools(job, { level: 20, presence: 18 }, []),
			).toBeNull();
		}
	});

	it("seeds a standalone missing pool at full, tagged with origin and sourceKey", () => {
		const result = reconcileJobPools("Herald", herald, []);
		expect(result).not.toBeNull();
		expect(result?.additions).toHaveLength(1);
		const pool = result?.additions[0];
		expect(pool?.name).toBe("Mantra Reservoir");
		expect(pool?.max).toBe(20);
		expect(pool?.current).toBe(20);
		expect(pool?.recharge).toBe("long-rest");
		expect(pool?.origin).toBe("job-pool");
		expect(pool?.sourceKey).toBe(jobPoolSourceKey("mantra-reservoir"));
	});

	it("returns null when a supported pool already matches (idempotent)", () => {
		const seeded = reconcileJobPools("Herald", herald, []);
		const pools = applyJobPoolReconcile(
			[],
			seeded ?? { additions: [], updates: [], removals: [] },
		);
		expect(reconcileJobPools("Herald", herald, pools)).toBeNull();
	});

	it("re-derives a supported pool max on level change and clamps current", () => {
		const pools = [
			customResource({
				id: "p1",
				name: "Mantra Reservoir",
				current: 15,
				max: 20,
				recharge: "long-rest",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("mantra-reservoir"),
			}),
		];
		const up = reconcileJobPools("Herald", { level: 7 }, pools);
		expect(up?.updates).toEqual([{ id: "p1", max: 35, current: 15 }]);

		const down = reconcileJobPools("Herald", { level: 2 }, pools);
		expect(down?.updates).toEqual([{ id: "p1", max: 10, current: 10 }]);
	});

	it("does not automatically seed Berserker, Striker, or Assassin pools", () => {
		for (const job of ["Berserker", "Striker", "Assassin"]) {
			expect(reconcileJobPools(job, { level: 20, agility: 20 }, [])).toBeNull();
		}
	});

	it("removes only exact deprecated automatic rows, including Task 3 keys", () => {
		const automaticRows = [
			customResource({
				id: "old-oath",
				name: "Oath Channel",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("oath-channel"),
			}),
			customResource({
				id: "old-adrenaline",
				name: "Adrenaline Surge",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("adrenaline-surge"),
			}),
			customResource({
				id: "old-overload",
				name: "Overload",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("overload-charges"),
			}),
			customResource({
				id: "old-impulse",
				name: "Impulse Points",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("impulse-points"),
			}),
			customResource({
				id: "old-killing-focus",
				name: "Killing Focus",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("killing-focus"),
			}),
			customResource({
				id: "old-flux",
				name: "Flux Pool",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("flux-pool"),
			}),
			customResource({
				id: "old-hype",
				name: "Hype Dice",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("hype-dice"),
			}),
			customResource({
				id: "old-biome",
				name: "Biome Command",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("biome-charges"),
			}),
		];
		const nearMatches = [
			customResource({
				id: "near-source-key",
				name: "Overload",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("overload-charges-v2"),
			}),
			customResource({
				id: "name-only",
				name: "Impulse Points",
				origin: "job-pool",
			}),
		];
		const rows = [...automaticRows, ...nearMatches];
		const result = reconcileJobPools("Mage", {}, rows);

		expect(result).toEqual({
			additions: [],
			updates: [],
			removals: [
				"old-oath",
				"old-adrenaline",
				"old-overload",
				"old-impulse",
				"old-killing-focus",
				"old-flux",
				"old-hype",
				"old-biome",
			],
		});
		expect(
			applyJobPoolReconcile(
				rows,
				result ?? { additions: [], updates: [], removals: [] },
			).map((row) => row.id),
		).toEqual(["near-source-key", "name-only"]);
	});

	it("leaves same-named manual and migrated rows untouched and untagged", () => {
		const cases = [
			{
				job: "Berserker",
				name: "Overload",
				defId: "overload-charges",
			},
			{
				job: "Striker",
				name: "Impulse Points",
				defId: "impulse-points",
			},
			{
				job: "Assassin",
				name: "Killing Focus",
				defId: "killing-focus",
			},
		];

		for (const { job, name, defId } of cases) {
			const manual = customResource({
				id: `${defId}-manual`,
				name,
				current: 7,
				max: 9,
				origin: "manual",
				sourceKey: jobPoolSourceKey(defId),
			});
			const migrated = customResource({
				id: `${defId}-migrated`,
				name,
				current: 5,
				max: 8,
				origin: "migrated",
			});
			const cleanupTrigger = customResource({
				id: `${defId}-cleanup-trigger`,
				name: "Oath Channel",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("oath-channel"),
			});
			const rows = [cleanupTrigger, manual, migrated];
			const result = reconcileJobPools(job, { level: 20, agility: 20 }, rows);

			expect(result).toEqual({
				additions: [],
				updates: [],
				removals: [cleanupTrigger.id],
			});
			expect(
				applyJobPoolReconcile(
					rows,
					result ?? { additions: [], updates: [], removals: [] },
				),
			).toEqual([manual, migrated]);
		}
	});

	it("still adopts a legacy same-name row for a supported pool", () => {
		const legacy = [
			customResource({
				id: "old",
				name: "Mantra Reservoir",
				current: 1,
				max: 20,
				recharge: "long-rest",
				origin: "migrated",
			}),
		];
		const result = reconcileJobPools("Herald", herald, legacy);
		expect(result?.additions).toEqual([]);
		expect(result?.updates).toHaveLength(1);
		expect(result?.updates[0]).toMatchObject({
			id: "old",
			sourceKey: jobPoolSourceKey("mantra-reservoir"),
			origin: "job-pool",
		});
	});

	it("returns null for slot casters and blank jobs", () => {
		expect(reconcileJobPools("Mage", { level: 5 }, [])).toBeNull();
		expect(reconcileJobPools("", { level: 5 }, [])).toBeNull();
		expect(reconcileJobPools(null, { level: 5 }, [])).toBeNull();
	});

	it("supported standalone pools recharge according to their canonical rest type", () => {
		const seeded = reconcileJobPools("Herald", herald, []);
		const resources = {
			...initializeCharacterResources(),
			custom_resources: applyJobPoolReconcile(
				[],
				seeded ?? {
					additions: [],
					updates: [],
					removals: [],
				},
			).map((resource) => ({ ...resource, current: 0 })),
		};
		const afterShort = applyResourceRest(resources, "short");
		expect(afterShort.custom_resources[0].current).toBe(0);

		const afterLong = applyResourceRest(afterShort, "long");
		expect(afterLong.custom_resources[0].current).toBe(20);
	});
});

describe("classifyEquipmentResources", () => {
	it("classifies ammo, consumables, and charged items into sections", () => {
		const rows = [
			equipmentRow({ id: "a", name: "Arrows (20)", quantity: 20 }),
			equipmentRow({ id: "w", name: "Longbow", item_type: "weapon" }),
			equipmentRow({
				id: "p",
				name: "Healing Injector",
				item_type: "consumable",
				quantity: 3,
			}),
			equipmentRow({
				id: "c",
				name: "Gate-Key Wand",
				item_type: "misc",
				charges_current: 2,
				charges_max: 7,
			}),
			equipmentRow({ id: "g", name: "Climbing Rig", item_type: "gear" }),
		];
		const entries = classifyEquipmentResources(rows);
		const byId = Object.fromEntries(entries.map((e) => [e.equipmentId, e]));

		expect(byId.a).toMatchObject({
			kind: "ammunition",
			current: 20,
			max: null,
			column: "quantity",
		});
		expect(byId.w).toBeUndefined(); // the bow itself is not a resource
		expect(byId.p).toMatchObject({
			kind: "consumable",
			current: 3,
			column: "quantity",
		});
		expect(byId.c).toMatchObject({
			kind: "charges",
			current: 2,
			max: 7,
			column: "charges_current",
		});
		expect(byId.g).toBeUndefined();
	});

	it("charges take precedence over ammo/consumable naming", () => {
		const entries = classifyEquipmentResources([
			equipmentRow({
				id: "x",
				name: "Plasma Cell Battery",
				charges_current: 4,
				charges_max: 10,
			}),
		]);
		expect(entries[0].kind).toBe("charges");
	});

	it("classifies potions by name even without a consumable item_type", () => {
		const entries = classifyEquipmentResources([
			equipmentRow({ id: "h", name: "Potion of Healing", quantity: 2 }),
		]);
		expect(entries[0]).toMatchObject({ kind: "consumable", current: 2 });
	});
});

describe("migrateLocalTrackedResources", () => {
	it("maps legacy rows to custom resources with origin 'migrated'", () => {
		const additions = migrateLocalTrackedResources(
			[
				{
					name: "Ki Points",
					category: "class-feature",
					current: 2,
					max: 5,
					recovery: "short-rest",
				},
				{
					name: "Arrows",
					category: "ammunition",
					current: 37,
					max: null,
					recovery: "manual",
				},
			],
			[],
		);
		expect(additions).toHaveLength(2);
		expect(additions[0]).toMatchObject({
			name: "Ki Points",
			current: 2,
			max: 5,
			recharge: "short-rest",
			origin: "migrated",
		});
		// Open-ended legacy rows keep their count as both current and max.
		expect(additions[1]).toMatchObject({
			current: 37,
			max: 37,
			recharge: "none",
		});
	});

	it("skips rows whose name already exists and invalid rows", () => {
		const additions = migrateLocalTrackedResources(
			[
				{ name: "Killing Focus", current: 1, max: 4 },
				{ name: "", current: 1, max: 1 },
				{ current: 3, max: 3 },
			],
			[customResource({ id: "k", name: "killing focus", max: 4 })],
		);
		expect(additions).toEqual([]);
	});
});

describe("pack quantities (DDB parity: Arrows (20) = 20 arrows)", () => {
	it("parses '(N)' pack suffixes, keeping the canonical name", () => {
		expect(parsePackQuantity("Arrows (20)")).toEqual({
			name: "Arrows (20)",
			quantity: 20,
		});
		expect(parsePackQuantity("Blowgun Needles (50)")).toEqual({
			name: "Blowgun Needles (50)",
			quantity: 50,
		});
		expect(parsePackQuantity("Longsword")).toEqual({
			name: "Longsword",
			quantity: 1,
		});
	});

	it("expands 'and' compounds and maps quivers onto the canonical arrows item", () => {
		expect(expandEquipmentGrant("Longbow and Quiver of 20 Arrows")).toEqual([
			{ name: "Longbow", quantity: 1 },
			{ name: "Arrows (20)", quantity: 20 },
		]);
	});

	it("leaves simple names untouched", () => {
		expect(expandEquipmentGrant("Explorer's Pack")).toEqual([
			{ name: "Explorer's Pack", quantity: 1 },
		]);
	});

	it("maps bare ammo counts onto the canonical ammo items", () => {
		expect(expandEquipmentGrant("Light Crossbow and 20 bolts")).toEqual([
			{ name: "Light Crossbow", quantity: 1 },
			{ name: "Crossbow Bolts (20)", quantity: 20 },
		]);
		expect(expandEquipmentGrant("20 arrows")).toEqual([
			{ name: "Arrows (20)", quantity: 20 },
		]);
	});

	it("expands word-number multiples into counted singular grants", () => {
		expect(expandEquipmentGrant("Two Daggers")).toEqual([
			{ name: "Dagger", quantity: 2 },
		]);
		expect(expandEquipmentGrant("Two Shortswords")).toEqual([
			{ name: "Shortsword", quantity: 2 },
		]);
	});

	it("never expands choice-of-any category placeholders", () => {
		expect(expandEquipmentGrant("Two Simple Melee Weapons")).toEqual([
			{ name: "Two Simple Melee Weapons", quantity: 1 },
		]);
		expect(expandEquipmentGrant("Any simple weapon")).toEqual([
			{ name: "Any simple weapon", quantity: 1 },
		]);
	});
});
