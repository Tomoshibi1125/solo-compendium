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
import { backgrounds } from "@/data/compendium/backgrounds";
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

/**
 * Background equipment strings that are narrative trinkets by design: they
 * land in the inventory as plain gear rows via the flavor fallback in
 * addStartingEquipment. Anything NOT on this list must resolve to a real
 * compendium item — a new background with a typo'd or unauthored gear string
 * fails here instead of silently degrading to flavor.
 */
const BACKGROUND_FLAVOR_ALLOWLIST = new Set([
	"Reinforced uniform",
	"A token of someone you lost",
	"A makeshift weapon you kept",
	"A diploma or signet ring from the Academy",
	"A stylish pen",
	"A bespoke business suit",
	"Guild master seal or keycard",
	"A high-end comms earpiece",
	"A ledger of debts",
	"A bundle of glow sticks",
	"A specialized digital mapping device",
	"Dark tactical gear",
	"A portable mana-density meter",
	"A set of sensory-dampening earplugs",
	"A journal of mana fluctuations",
	"A strange glowing brand or tattoo",
	"A relic from the entity",
	"Vestments or imposing clothes",
	"A pouch of strange coins",
	"A piece of battered military armor",
	"Dog tags of your fallen squad",
	"A military-issue radio",
	"A set of precision engraving tools",
	"A heavy ring of master keys",
	"A lead-lined containment box",
	"A uniform of the Vault Guard",
	"A high-security ID badge",
	"A tactical headset",
	"A sharp suit or sleek armor",
	"A clipboard with raid plans",
	"A badge (real or fake)",
	"A notebook filled with crazed sketches",
	"A flask",
	"Mining pick",
	"A set of durable coveralls",
	"A ledger of current market prices for crystals",
	"A stack of official Association forms",
	"A tailored business suit",
	"An Association ID badge",
	"A set of dark clothes with hidden pockets",
	"A magnifying loupe",
	"A digital scale for cores",
	"A forged Ascendant License",
	"A set of dark, durable clothes",
	"A half-empty mana potion",
	"Tactical body armor",
	"A high-end earpiece",
	"A military ID",
	"A pair of dark sunglasses",
	"A pristine lab coat",
	"A datapad with sensitive research",
	"A set of protective goggles",
	"Several empty sample vials",
	"A badge to a high-tech lab",
	"A leather jacket with gang colors",
	"A customized motorcycle key",
	"A lighter",
	"A detective's badge",
	"A concealed holster",
	"A datapad with criminal records",
	"A pair of handcuffs",
	"Designer clothes",
	"A high-end sports car key (flavor)",
	"A gold-plated guild signet",
	"An expensive watch",
	"A hidden cult symbol",
	"Dark robes",
	"A strange, humming piece of a gate",
	"A book of prophecies",
	"A high-end floating drone camera",
	"Flashy, branded combat gear",
	"A selfie stick",
	"A microphone (can be a focus)",
	"Designer combat outfits",
	"A fan letter",
	"A compact mirror and makeup",
	"A pair of sunglasses",
	"A prop from your most famous movie",
	"A tailored suit or dress",
	"A contract with a major studio",
	"A bottle of expensive champagne",
	"A gold medal or championship ring",
	"High-end athletic wear",
	"A duffel bag",
	"A water bottle and protein supplements",
	"A jump rope",
	"A tailored Armani suit",
	"A platinum credit card",
	"A high-end smartwatch",
	"A briefcase of contracts",
	"A pen worth more than a car",
	"A heavily modified laptop",
	"A flash drive with encrypted blackmail",
	"A dark hoodie",
	"A portable makeup kit",
	"Fashionable, impractical clothes",
	"A business card for a PR firm",
	"A high-end gaming headset",
	"A mechanical keyboard (modified into a weapon or focus)",
	"A team jersey",
	"Energy drinks",
	"A mousepad",
]);

/** Rarities a background may hand out for free at creation. */
const BACKGROUND_GRANTABLE_RARITIES = new Set(["common", "uncommon"]);

describe("background equipment coverage", () => {
	for (const bg of backgrounds) {
		const equipment = bg.equipment ?? [];
		if (equipment.length === 0) continue;

		it(`${bg.name}: every equipment string resolves or is declared flavor`, () => {
			const unaccounted = equipment.filter(
				(str) =>
					!findStaticItemByName(str) && !BACKGROUND_FLAVOR_ALLOWLIST.has(str),
			);
			expect(unaccounted).toEqual([]);
		});

		it(`${bg.name}: resolved equipment stays at mundane rarity`, () => {
			const lootGrants = equipment
				.map((str) => ({ str, item: findStaticItemByName(str) }))
				.filter(
					({ item }) =>
						item &&
						!BACKGROUND_GRANTABLE_RARITIES.has(
							(item.rarity ?? "common").toLowerCase(),
						),
				)
				.map(({ str, item }) => `${str} -> ${item?.name} (${item?.rarity})`);
			expect(lootGrants).toEqual([]);
		});

		it(`${bg.name}: no stale flavor allowlist entries`, () => {
			const stale = equipment.filter(
				(str) =>
					BACKGROUND_FLAVOR_ALLOWLIST.has(str) && !!findStaticItemByName(str),
			);
			expect(stale).toEqual([]);
		});
	}
});
