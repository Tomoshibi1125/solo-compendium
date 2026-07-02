/**
 * Starting-equipment coverage guards.
 *
 * 1. Drift guard — `weaponChoices` renders read-only on the compendium job page
 *    while the creation wizard grants gear from `startingEquipment` only. Every
 *    weapon the job page advertises must therefore be obtainable through some
 *    startingEquipment group, or the advertised pick silently becomes whatever
 *    the equipment default is (the pre-fold bug this file exists to prevent).
 *
 * 2. Resolvability — every startingEquipment option must expand into grants
 *    that resolve in the static compendium (compound "X and Y" options, ammo
 *    counts, word-number multiples), except the explicit choice-of-any
 *    category placeholders, which insert as named gear by design.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import {
	findStaticItemByName,
	normalizeItemLookupName,
} from "@/lib/characterCreation";
import { initializeProtocolData } from "@/lib/ProtocolDataManager";
import { expandEquipmentGrant } from "@/lib/unifiedResources";

beforeAll(async () => {
	await initializeProtocolData();
});

/** Category placeholders that legitimately never resolve to a single item. */
const PLACEHOLDER_ALLOWLIST = new Set(
	["Any simple weapon", "Two Simple Melee Weapons"].map(
		normalizeItemLookupName,
	),
);

const isPlaceholder = (option: string) =>
	PLACEHOLDER_ALLOWLIST.has(normalizeItemLookupName(option));

/** All names an equipment option can grant: itself plus its expanded parts. */
const grantableNames = (option: string): string[] => [
	normalizeItemLookupName(option),
	...expandEquipmentGrant(option).map((g) => normalizeItemLookupName(g.name)),
];

describe("starting-equipment coverage", () => {
	for (const job of jobs) {
		const startingEquipment = job.startingEquipment ?? [];
		const weaponChoices = job.weaponChoices ?? [];
		if (startingEquipment.length === 0) continue;

		const obtainable = new Set(
			startingEquipment.flat().flatMap(grantableNames),
		);

		if (weaponChoices.length > 0) {
			it(`${job.name}: every advertised weapon choice is obtainable via startingEquipment`, () => {
				const missing = weaponChoices
					.flat()
					.filter(
						(option) =>
							!grantableNames(option).some((name) => obtainable.has(name)),
					);
				expect(missing).toEqual([]);
			});
		}

		it(`${job.name}: every startingEquipment option resolves in the compendium`, () => {
			const unresolved = startingEquipment
				.flat()
				.filter((option) => !isPlaceholder(option))
				.filter((option) =>
					expandEquipmentGrant(option).some(
						(grant) =>
							!isPlaceholder(grant.name) && !findStaticItemByName(grant.name),
					),
				);
			expect(unresolved).toEqual([]);
		});
	}
});
