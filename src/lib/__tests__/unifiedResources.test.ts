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
		// The un-mapped row reproduces the old bug — pinned as distinct.
		expect(reconcileJobPools("Revenant", row, [])?.additions[0]?.max).toBe(2);
	});

	it("passes through rows that already use full-name fields", () => {
		const shape = characterRowToJobPoolShape({ level: 3, intelligence: 18 });
		expect(shape.intelligence).toBe(18);
	});
});

describe("reconcileJobPools", () => {
	const assassin = { level: 5, agility: 18 }; // AGI mod +4

	it("seeds a missing pool at full, tagged with origin and sourceKey", () => {
		const result = reconcileJobPools("Assassin", assassin, []);
		expect(result).not.toBeNull();
		expect(result?.additions).toHaveLength(1);
		const pool = result?.additions[0];
		expect(pool?.name).toBe("Killing Focus");
		expect(pool?.max).toBe(4);
		expect(pool?.current).toBe(4);
		expect(pool?.recharge).toBe("short-rest");
		expect(pool?.origin).toBe("job-pool");
		expect(pool?.sourceKey).toBe(jobPoolSourceKey("killing-focus"));
	});

	it("returns null when the pool already matches (idempotent)", () => {
		const seeded = reconcileJobPools("Assassin", assassin, []);
		const pools = applyJobPoolReconcile(
			[],
			seeded ?? { additions: [], updates: [] },
		);
		expect(reconcileJobPools("Assassin", assassin, pools)).toBeNull();
	});

	it("re-derives max on level/ability change and clamps current", () => {
		const pools = [
			customResource({
				id: "p1",
				name: "Impulse Points",
				current: 3,
				max: 3,
				recharge: "short-rest",
				origin: "job-pool",
				sourceKey: jobPoolSourceKey("impulse-points"),
			}),
		];
		// Striker pool max = level; leveling 3 → 7 raises max, keeps current.
		const up = reconcileJobPools("Striker", { level: 7 }, pools);
		expect(up?.updates).toEqual([{ id: "p1", max: 7, current: 3 }]);

		// Leveling down clamps current to the new max.
		const down = reconcileJobPools("Striker", { level: 2 }, pools);
		expect(down?.updates).toEqual([{ id: "p1", max: 2, current: 2 }]);
	});

	it("adopts a legacy same-name row instead of duplicating", () => {
		const legacy = [
			customResource({
				id: "old",
				name: "Killing Focus",
				current: 1,
				max: 4,
				recharge: "short-rest",
				origin: "migrated",
			}),
		];
		const result = reconcileJobPools("Assassin", assassin, legacy);
		expect(result?.additions).toEqual([]);
		expect(result?.updates).toHaveLength(1);
		expect(result?.updates[0]).toMatchObject({
			id: "old",
			sourceKey: jobPoolSourceKey("killing-focus"),
			origin: "job-pool",
		});
	});

	it("returns null for jobs without pools (slot casters) and blank jobs", () => {
		expect(reconcileJobPools("Mage", { level: 5 }, [])).toBeNull();
		expect(reconcileJobPools("", { level: 5 }, [])).toBeNull();
		expect(reconcileJobPools(null, { level: 5 }, [])).toBeNull();
	});

	it("seeded pools recharge through applyResourceRest", () => {
		const seeded = reconcileJobPools("Striker", { level: 4 }, []);
		const resources = {
			...initializeCharacterResources(),
			custom_resources: applyJobPoolReconcile(
				[],
				seeded ?? {
					additions: [],
					updates: [],
				},
			).map((r) => ({ ...r, current: 0 })), // fully spent
		};
		const afterShort = applyResourceRest(resources, "short");
		expect(afterShort.custom_resources[0].current).toBe(4); // short-rest pool
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
