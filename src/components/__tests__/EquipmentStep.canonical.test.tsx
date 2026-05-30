import { describe, expect, it } from "vitest";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

describe("EquipmentStep canonical surface", () => {
	it("canonical equipment entries expose damage / damage_type for weapons", async () => {
		const equipment = await listCanonicalEntries("equipment");
		const weapons = equipment.filter((entry) => {
			const itemType = (entry as { item_type?: unknown }).item_type;
			const weaponType = (entry as { weapon_type?: unknown }).weapon_type;
			return (
				(typeof itemType === "string" && itemType.toLowerCase() === "weapon") ||
				typeof weaponType === "string"
			);
		});
		expect(weapons.length).toBeGreaterThan(0);
		const withDamage = weapons.filter(
			(entry) => typeof (entry as { damage?: unknown }).damage === "string",
		);
		expect(withDamage.length).toBeGreaterThan(0);
	});

	it("canonical equipment entries expose armor_class for armor and shields", async () => {
		const equipment = await listCanonicalEntries("equipment");
		const armor = equipment.filter((entry) => {
			const itemType = (entry as { item_type?: unknown }).item_type;
			return typeof itemType === "string" && /^(armor|shield)$/i.test(itemType);
		});
		expect(armor.length).toBeGreaterThan(0);
		const withAc = armor.filter(
			(entry) =>
				(entry as { armor_class?: unknown }).armor_class !== undefined &&
				(entry as { armor_class?: unknown }).armor_class !== null,
		);
		expect(withAc.length).toBeGreaterThan(0);
	});

	it("canonical equipment entries expose a source_book for catalogued items", async () => {
		const equipment = await listCanonicalEntries("equipment");
		const withSourceBook = equipment.filter(
			(entry) =>
				typeof (entry as { source_book?: unknown }).source_book === "string",
		);
		// Most static equipment is RA-canon and should carry source_book.
		expect(withSourceBook.length).toBeGreaterThan(0);
	});

	it("does not copy-paste Ascendant-org terms as boilerplate across equipment", async () => {
		const equipment = await listCanonicalEntries("equipment");
		// Ascendant-org terms (Bureau / Association / Academy / Conference) are
		// acceptable as logical, item-specific lore (e.g. "distributed by Ascendant
		// Bureaus worldwide"). What is NOT acceptable is cookie-cutter boilerplate:
		// the former offender was a generation-guardrail directive
		// ("Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.")
		// copy-pasted into nearly every item's source_integrity block. Guard
		// against that boilerplate directive returning while allowing genuine lore.
		const boilerplate = equipment.filter((entry) =>
			/Preserve [^"]*?Ascendant (Bureau|Association|Academy|Conference)/i.test(
				JSON.stringify(entry),
			),
		);
		expect(boilerplate.map((e) => e.id ?? e.name)).toEqual([]);
	});
});
