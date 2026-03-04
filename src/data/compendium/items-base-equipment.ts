// Base Equipment Catalog — Standard weapons, armor, shields, and adventuring gear
// These are the mundane items referenced by job startingEquipment arrays.
// Mechanical properties follow the equipmentModifiers.ts parser format so that
// equipping an item actually changes AC, damage, etc.

import type { Item } from "./items";

/** Helper: minimal Item with only the fields the engine needs. */
function baseItem(
	partial: Pick<Item, "id" | "name" | "description" | "weight" | "value"> & {
		item_type: Item["item_type"];
		armor_type?: string;
		armor_class?: string;
		stealth_disadvantage?: boolean;
		strength_requirement?: number;
		damage?: string;
		damage_type?: string;
		weapon_type?: string;
		simple_properties?: string[];
		range?: string;
		effects?: Item["effects"];
	},
): Item {
	const isWeapon = partial.item_type === "weapon";
	const isArmor =
		partial.item_type === "armor" || partial.item_type === "shield";

	const properties: Item["properties"] = {};
	if (isWeapon && partial.damage) {
		properties.weapon = {
			damage: partial.damage,
			damageType: partial.damage_type || "bludgeoning",
			range: partial.range
				? parseInt(partial.range, 10) || undefined
				: undefined,
			finesse: partial.simple_properties?.includes("finesse"),
		};
	}

	return {
		id: partial.id,
		name: partial.name,
		description: partial.description,
		item_type: partial.item_type,
		armor_type: partial.armor_type,
		armor_class: partial.armor_class,
		stealth_disadvantage: partial.stealth_disadvantage,
		strength_requirement: partial.strength_requirement,
		damage: partial.damage,
		damage_type: partial.damage_type,
		weapon_type: partial.weapon_type,
		simple_properties: partial.simple_properties,
		range: partial.range,
		rarity: "common",
		type: isWeapon ? "weapon" : isArmor ? "armor" : "wondrous",
		image: "",
		weight: partial.weight,
		value: partial.value,
		effects: partial.effects,
		properties,
	} as Item;
}

// ────────────────────────────── ARMOR ──────────────────────────────

const padded = baseItem({
	id: "base-armor-padded",
	name: "Padded Armor",
	description: "Quilted layers of mana-threaded cloth. Light but noisy.",
	item_type: "armor",
	armor_type: "Light",
	armor_class: "11 + Dex modifier",
	stealth_disadvantage: true,
	weight: 8,
	value: 5,
});

const leather = baseItem({
	id: "base-armor-leather",
	name: "Leather Armor",
	description: "Cured hunter-grade leather breastpiece and shoulder pads.",
	item_type: "armor",
	armor_type: "Light",
	armor_class: "11 + Dex modifier",
	weight: 10,
	value: 10,
});

const studdedLeather = baseItem({
	id: "base-armor-studded-leather",
	name: "Studded Leather Armor",
	description: "Tough leather reinforced with rivets of gate-forged steel.",
	item_type: "armor",
	armor_type: "Light",
	armor_class: "12 + Dex modifier",
	weight: 13,
	value: 45,
});

const hide = baseItem({
	id: "base-armor-hide",
	name: "Hide Armor",
	description: "Thick pelts from gate beasts stitched together for protection.",
	item_type: "armor",
	armor_type: "Medium",
	armor_class: "12 + Dex modifier (max 2)",
	weight: 12,
	value: 10,
});

const chainShirt = baseItem({
	id: "base-armor-chain-shirt",
	name: "Chain Shirt",
	description: "Interlocking rings of mana-tempered steel worn under clothing.",
	item_type: "armor",
	armor_type: "Medium",
	armor_class: "13 + Dex modifier (max 2)",
	weight: 20,
	value: 50,
});

const scaleMail = baseItem({
	id: "base-armor-scale-mail",
	name: "Scale Mail",
	description: "Overlapping metal scales, favored by Bureau field agents.",
	item_type: "armor",
	armor_type: "Medium",
	armor_class: "14 + Dex modifier (max 2)",
	stealth_disadvantage: true,
	weight: 45,
	value: 50,
});

const breastplate = baseItem({
	id: "base-armor-breastplate",
	name: "Breastplate",
	description: "Fitted metal chest plate with flexible leather underneath.",
	item_type: "armor",
	armor_type: "Medium",
	armor_class: "14 + Dex modifier (max 2)",
	weight: 20,
	value: 400,
});

const halfPlate = baseItem({
	id: "base-armor-half-plate",
	name: "Half Plate",
	description:
		"Shaped metal plates covering most of the body. Noisy but effective.",
	item_type: "armor",
	armor_type: "Medium",
	armor_class: "15 + Dex modifier (max 2)",
	stealth_disadvantage: true,
	weight: 40,
	value: 750,
});

const ringMail = baseItem({
	id: "base-armor-ring-mail",
	name: "Ring Mail",
	description: "Leather armor sewn with heavy rings for extra deflection.",
	item_type: "armor",
	armor_type: "Heavy",
	armor_class: "14",
	stealth_disadvantage: true,
	weight: 40,
	value: 30,
});

const chainMail = baseItem({
	id: "base-armor-chain-mail",
	name: "Chain Mail",
	description:
		"Full suit of interlocking steel rings. Standard Hunter Bureau field issue.",
	item_type: "armor",
	armor_type: "Heavy",
	armor_class: "16",
	stealth_disadvantage: true,
	strength_requirement: 13,
	weight: 55,
	value: 75,
});

const splint = baseItem({
	id: "base-armor-splint",
	name: "Splint Armor",
	description:
		"Vertical strips of metal riveted to leather. Heavy-duty gate armor.",
	item_type: "armor",
	armor_type: "Heavy",
	armor_class: "17",
	stealth_disadvantage: true,
	strength_requirement: 15,
	weight: 60,
	value: 200,
});

const plate = baseItem({
	id: "base-armor-plate",
	name: "Plate Armor",
	description:
		"Full articulated plate from head to toe. Top-tier Hunter Bureau deployment gear.",
	item_type: "armor",
	armor_type: "Heavy",
	armor_class: "18",
	stealth_disadvantage: true,
	strength_requirement: 15,
	weight: 65,
	value: 1500,
});

const shield = baseItem({
	id: "base-armor-shield",
	name: "Shield",
	description: "A wooden or metal shield strapped to the forearm. +2 AC.",
	item_type: "shield",
	armor_type: "Shield",
	armor_class: "+2",
	weight: 6,
	value: 10,
});

// ────────────────────────────── SIMPLE MELEE WEAPONS ──────────────────────────────

const club = baseItem({
	id: "base-weapon-club",
	name: "Club",
	description: "A heavy stick. Even awakened hunters sometimes start simple.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d4",
	damage_type: "bludgeoning",
	simple_properties: ["light"],
	weight: 2,
	value: 0.1,
});

const dagger = baseItem({
	id: "base-weapon-dagger",
	name: "Dagger",
	description:
		"A small blade favored by Assassins for its versatility and concealability.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d4",
	damage_type: "piercing",
	simple_properties: ["finesse", "light", "thrown"],
	range: "20/60",
	weight: 1,
	value: 2,
});

const greatclub = baseItem({
	id: "base-weapon-greatclub",
	name: "Greatclub",
	description:
		"A massive bludgeon. Berserkers wield these one-handed in Overload.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d8",
	damage_type: "bludgeoning",
	simple_properties: ["two-handed"],
	weight: 10,
	value: 0.2,
});

const handaxe = baseItem({
	id: "base-weapon-handaxe",
	name: "Handaxe",
	description: "A one-handed axe equally useful in melee or thrown.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d6",
	damage_type: "slashing",
	simple_properties: ["light", "thrown"],
	range: "20/60",
	weight: 2,
	value: 5,
});

const javelin = baseItem({
	id: "base-weapon-javelin",
	name: "Javelin",
	description:
		"A lightweight throwing spear. Bureau trainees drill with these daily.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["thrown"],
	range: "30/120",
	weight: 2,
	value: 0.5,
});

const lightHammer = baseItem({
	id: "base-weapon-light-hammer",
	name: "Light Hammer",
	description:
		"A small throwing hammer. Popular with Technomancers as a multitool.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d4",
	damage_type: "bludgeoning",
	simple_properties: ["light", "thrown"],
	range: "20/60",
	weight: 2,
	value: 2,
});

const mace = baseItem({
	id: "base-weapon-mace",
	name: "Mace",
	description: "A heavy flanged head on a stout handle. Herald standard-issue.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d6",
	damage_type: "bludgeoning",
	weight: 4,
	value: 5,
});

const quarterstaff = baseItem({
	id: "base-weapon-quarterstaff",
	name: "Quarterstaff",
	description:
		"A long wooden staff. Mages and Summoners channel mana through the grain.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d6",
	damage_type: "bludgeoning",
	simple_properties: ["versatile"],
	weight: 4,
	value: 0.2,
});

const sickle = baseItem({
	id: "base-weapon-sickle",
	name: "Sickle",
	description: "A curved blade on a short handle.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d4",
	damage_type: "slashing",
	simple_properties: ["light"],
	weight: 2,
	value: 1,
});

const spear = baseItem({
	id: "base-weapon-spear",
	name: "Spear",
	description:
		"The oldest weapon in the hunter arsenal. Still deadly in the right hands.",
	item_type: "weapon",
	weapon_type: "simple melee",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["thrown", "versatile"],
	range: "20/60",
	weight: 3,
	value: 1,
});

// ────────────────────────────── SIMPLE RANGED WEAPONS ──────────────────────────────

const lightCrossbow = baseItem({
	id: "base-weapon-light-crossbow",
	name: "Light Crossbow",
	description:
		"A compact crossbow. Effective ranged option for non-martial hunters.",
	item_type: "weapon",
	weapon_type: "simple ranged",
	damage: "1d8",
	damage_type: "piercing",
	simple_properties: ["ammunition", "loading", "two-handed"],
	range: "80/320",
	weight: 5,
	value: 25,
});

const dart = baseItem({
	id: "base-weapon-dart",
	name: "Dart",
	description:
		"A small thrown projectile. Strikers can hurl these with lethal precision.",
	item_type: "weapon",
	weapon_type: "simple ranged",
	damage: "1d4",
	damage_type: "piercing",
	simple_properties: ["finesse", "thrown"],
	range: "20/60",
	weight: 0.25,
	value: 0.05,
});

const shortbow = baseItem({
	id: "base-weapon-shortbow",
	name: "Shortbow",
	description: "A small bow suited for skirmishing at moderate range.",
	item_type: "weapon",
	weapon_type: "simple ranged",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["ammunition", "two-handed"],
	range: "80/320",
	weight: 2,
	value: 25,
});

const sling = baseItem({
	id: "base-weapon-sling",
	name: "Sling",
	description: "A leather strap for hurling stones at surprising velocity.",
	item_type: "weapon",
	weapon_type: "simple ranged",
	damage: "1d4",
	damage_type: "bludgeoning",
	simple_properties: ["ammunition"],
	range: "30/120",
	weight: 0,
	value: 0.1,
});

// ────────────────────────────── MARTIAL MELEE WEAPONS ──────────────────────────────

const battleaxe = baseItem({
	id: "base-weapon-battleaxe",
	name: "Battleaxe",
	description: "A broad-bladed axe. The weapon of choice for many Destroyers.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "slashing",
	simple_properties: ["versatile"],
	weight: 4,
	value: 10,
});

const flail = baseItem({
	id: "base-weapon-flail",
	name: "Flail",
	description: "A spiked ball on a chain. Unpredictable and devastating.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "bludgeoning",
	weight: 2,
	value: 10,
});

const glaive = baseItem({
	id: "base-weapon-glaive",
	name: "Glaive",
	description: "A single-edged blade on a long pole. Reach weapon.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d10",
	damage_type: "slashing",
	simple_properties: ["heavy", "reach", "two-handed"],
	weight: 6,
	value: 20,
});

const greataxe = baseItem({
	id: "base-weapon-greataxe",
	name: "Greataxe",
	description:
		"A massive axe wielded in both hands. Berserker signature weapon.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d12",
	damage_type: "slashing",
	simple_properties: ["heavy", "two-handed"],
	weight: 7,
	value: 30,
});

const greatsword = baseItem({
	id: "base-weapon-greatsword",
	name: "Greatsword",
	description:
		"A large two-handed blade. Destroyers and Holy Knights favor these.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "2d6",
	damage_type: "slashing",
	simple_properties: ["heavy", "two-handed"],
	weight: 6,
	value: 50,
});

const halberd = baseItem({
	id: "base-weapon-halberd",
	name: "Halberd",
	description:
		"An axe blade topped with a spike on a long shaft. Reach weapon.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d10",
	damage_type: "slashing",
	simple_properties: ["heavy", "reach", "two-handed"],
	weight: 6,
	value: 20,
});

const lance = baseItem({
	id: "base-weapon-lance",
	name: "Lance",
	description: "A long jousting weapon. Disadvantage at 5 ft unless mounted.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d12",
	damage_type: "piercing",
	simple_properties: ["reach", "special"],
	weight: 6,
	value: 10,
});

const longsword = baseItem({
	id: "base-weapon-longsword",
	name: "Longsword",
	description:
		"A versatile straight blade. The most common hunter weapon in circulation.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "slashing",
	simple_properties: ["versatile"],
	weight: 3,
	value: 15,
});

const maul = baseItem({
	id: "base-weapon-maul",
	name: "Maul",
	description:
		"A massive two-handed hammer. Cracks gate crystals like eggshells.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "2d6",
	damage_type: "bludgeoning",
	simple_properties: ["heavy", "two-handed"],
	weight: 10,
	value: 10,
});

const morningstar = baseItem({
	id: "base-weapon-morningstar",
	name: "Morningstar",
	description: "A spiked mace. Punches through armored gate creatures.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "piercing",
	weight: 4,
	value: 15,
});

const pike = baseItem({
	id: "base-weapon-pike",
	name: "Pike",
	description: "An extremely long spear. Reach weapon for formation combat.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d10",
	damage_type: "piercing",
	simple_properties: ["heavy", "reach", "two-handed"],
	weight: 18,
	value: 5,
});

const rapier = baseItem({
	id: "base-weapon-rapier",
	name: "Rapier",
	description: "A thin, sharp blade. Assassins and Idols favor its precision.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "piercing",
	simple_properties: ["finesse"],
	weight: 2,
	value: 25,
});

const scimitar = baseItem({
	id: "base-weapon-scimitar",
	name: "Scimitar",
	description:
		"A curved blade optimized for slashing motions. Light and quick.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d6",
	damage_type: "slashing",
	simple_properties: ["finesse", "light"],
	weight: 3,
	value: 25,
});

const shortsword = baseItem({
	id: "base-weapon-shortsword",
	name: "Shortsword",
	description:
		"A compact blade for close-quarters combat. Standard dual-wield option.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["finesse", "light"],
	weight: 2,
	value: 10,
});

const trident = baseItem({
	id: "base-weapon-trident",
	name: "Trident",
	description: "A three-pronged spear. Can be thrown or used in melee.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["thrown", "versatile"],
	range: "20/60",
	weight: 4,
	value: 5,
});

const warPick = baseItem({
	id: "base-weapon-war-pick",
	name: "War Pick",
	description: "A pointed hammer designed to punch through heavy armor.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "piercing",
	weight: 2,
	value: 5,
});

const warhammer = baseItem({
	id: "base-weapon-warhammer",
	name: "Warhammer",
	description:
		"A heavy one-handed hammer. Herald standard for those proficient.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d8",
	damage_type: "bludgeoning",
	simple_properties: ["versatile"],
	weight: 2,
	value: 15,
});

const whip = baseItem({
	id: "base-weapon-whip",
	name: "Whip",
	description: "A braided leather lash. Reach and finesse in one package.",
	item_type: "weapon",
	weapon_type: "martial melee",
	damage: "1d4",
	damage_type: "slashing",
	simple_properties: ["finesse", "reach"],
	weight: 3,
	value: 2,
});

// ────────────────────────────── MARTIAL RANGED WEAPONS ──────────────────────────────

const blowgun = baseItem({
	id: "base-weapon-blowgun",
	name: "Blowgun",
	description: "A tube for launching darts silently. Assassin specialty.",
	item_type: "weapon",
	weapon_type: "martial ranged",
	damage: "1",
	damage_type: "piercing",
	simple_properties: ["ammunition", "loading"],
	range: "25/100",
	weight: 1,
	value: 10,
});

const handCrossbow = baseItem({
	id: "base-weapon-hand-crossbow",
	name: "Hand Crossbow",
	description:
		"A one-handed crossbow. Compact enough to dual-wield or use with a shield.",
	item_type: "weapon",
	weapon_type: "martial ranged",
	damage: "1d6",
	damage_type: "piercing",
	simple_properties: ["ammunition", "light", "loading"],
	range: "30/120",
	weight: 3,
	value: 75,
});

const heavyCrossbow = baseItem({
	id: "base-weapon-heavy-crossbow",
	name: "Heavy Crossbow",
	description: "A powerful crossbow requiring both hands and time to reload.",
	item_type: "weapon",
	weapon_type: "martial ranged",
	damage: "1d10",
	damage_type: "piercing",
	simple_properties: ["ammunition", "heavy", "loading", "two-handed"],
	range: "100/400",
	weight: 18,
	value: 50,
});

const longbow = baseItem({
	id: "base-weapon-longbow",
	name: "Longbow",
	description: "A tall bow with exceptional range. Stalker weapon of choice.",
	item_type: "weapon",
	weapon_type: "martial ranged",
	damage: "1d8",
	damage_type: "piercing",
	simple_properties: ["ammunition", "heavy", "two-handed"],
	range: "150/600",
	weight: 2,
	value: 50,
});

// ────────────────────────────── AMMUNITION ──────────────────────────────

const arrows20 = baseItem({
	id: "base-ammo-arrows-20",
	name: "Arrows (20)",
	description: "A quiver of 20 standard arrows.",
	item_type: "misc",
	weight: 1,
	value: 1,
});

const bolts20 = baseItem({
	id: "base-ammo-bolts-20",
	name: "Crossbow Bolts (20)",
	description: "A case of 20 crossbow bolts.",
	item_type: "misc",
	weight: 1.5,
	value: 1,
});

const darts10 = baseItem({
	id: "base-ammo-darts-10",
	name: "Darts (10)",
	description: "A set of 10 throwing darts.",
	item_type: "misc",
	weight: 2.5,
	value: 0.5,
});

// ────────────────────────────── ADVENTURING GEAR / PACKS ──────────────────────────────

const explorersPack = baseItem({
	id: "base-gear-explorers-pack",
	name: "Explorer's Pack",
	description:
		"Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, 50 ft rope.",
	item_type: "misc",
	weight: 59,
	value: 10,
});

const dungeoneersPack = baseItem({
	id: "base-gear-dungeoneers-pack",
	name: "Dungeoneer's Pack",
	description:
		"Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, 50 ft rope.",
	item_type: "misc",
	weight: 61.5,
	value: 12,
});

const priestsPack = baseItem({
	id: "base-gear-priests-pack",
	name: "Priest's Pack",
	description:
		"Backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days rations, waterskin.",
	item_type: "misc",
	weight: 24,
	value: 19,
});

const scholarsPack = baseItem({
	id: "base-gear-scholars-pack",
	name: "Scholar's Pack",
	description:
		"Backpack, book of lore, ink, ink pen, 10 sheets of parchment, little bag of sand, small knife.",
	item_type: "misc",
	weight: 10,
	value: 40,
});

const burglarsPack = baseItem({
	id: "base-gear-burglars-pack",
	name: "Burglar's Pack",
	description:
		"Backpack, bag of 1000 ball bearings, 10 ft string, bell, 5 candles, crowbar, hammer, 10 pitons, hooded lantern, 2 flasks of oil, 5 days rations, tinderbox, waterskin.",
	item_type: "misc",
	weight: 44.5,
	value: 16,
});

const diplomatsPack = baseItem({
	id: "base-gear-diplomats-pack",
	name: "Diplomat's Pack",
	description:
		"Chest, 2 cases for maps/scrolls, fine clothes, ink, ink pen, lamp, 2 flasks of oil, 5 sheets of paper, vial of perfume, sealing wax, soap.",
	item_type: "misc",
	weight: 36,
	value: 39,
});

const entertainersPack = baseItem({
	id: "base-gear-entertainers-pack",
	name: "Entertainer's Pack",
	description:
		"Backpack, bedroll, 2 costumes, 5 candles, 5 days rations, waterskin, disguise kit.",
	item_type: "misc",
	weight: 38,
	value: 40,
});

// ────────────────────────────── FOCUS ITEMS ──────────────────────────────

const arcaneFocus = baseItem({
	id: "base-focus-arcane",
	name: "Arcane Focus",
	description: "A crystal orb, wand, or staff used to channel arcane mana.",
	item_type: "misc",
	weight: 1,
	value: 10,
});

const componentPouch = baseItem({
	id: "base-focus-component-pouch",
	name: "Component Pouch",
	description: "A small waterproof belt pouch containing spell components.",
	item_type: "misc",
	weight: 2,
	value: 25,
});

const primalFocus = baseItem({
	id: "base-focus-primal",
	name: "Primal Focus",
	description:
		"A totem, staff, or sprig of mistletoe used by Summoners to channel nature mana.",
	item_type: "misc",
	weight: 1,
	value: 5,
});

const systemFocus = baseItem({
	id: "base-focus-system",
	name: "System Focus",
	description:
		"A holy symbol or amulet that channels the System's healing protocols.",
	item_type: "misc",
	weight: 1,
	value: 5,
});

const grimoire = baseItem({
	id: "base-focus-grimoire",
	name: "Grimoire",
	description:
		"A spellbook containing a Mage's inscribed spells. Essential for prepared casting.",
	item_type: "misc",
	weight: 3,
	value: 50,
});

// ────────────────────────────── TOOLS ──────────────────────────────

const thievesTools = baseItem({
	id: "base-tool-thieves",
	name: "Thieves' Tools",
	description:
		"Lockpicks, a small file, pliers, and a small mirror on a handle.",
	item_type: "tool",
	weight: 1,
	value: 25,
});

const tinkerTools = baseItem({
	id: "base-tool-tinker",
	name: "Tinker's Tools",
	description:
		"A variety of hand tools for crafting and repairing mechanical devices.",
	item_type: "tool",
	weight: 10,
	value: 50,
});

const musicalInstrument = baseItem({
	id: "base-tool-instrument",
	name: "Musical Instrument",
	description: "A lute, drum, flute, or other instrument. Idol essential.",
	item_type: "tool",
	weight: 3,
	value: 25,
});

const highEndStreamingLaptop = baseItem({
	id: "base-tool-streaming-laptop",
	name: "High-End Streaming Laptop",
	description:
		"A modern high-performance laptop with camera, mic, and editing suite.",
	item_type: "tool",
	weight: 4,
	value: 1500,
	effects: { passive: ["+2 to Investigation", "+1 to History"] },
});

const ringLight = baseItem({
	id: "base-tool-ring-light",
	name: "Ring Light",
	description: "A portable LED ring light for clean, flattering illumination.",
	item_type: "tool",
	weight: 2,
	value: 60,
	effects: { passive: ["+2 to Performance", "+1 to Persuasion"] },
});

const portableCamera = baseItem({
	id: "base-tool-portable-camera",
	name: "Portable Camera",
	description:
		"A compact camera for documentation, interviews, and evidence gathering.",
	item_type: "tool",
	weight: 1,
	value: 400,
	effects: { passive: ["+2 to Investigation"] },
});

const portableWifiHotspot = baseItem({
	id: "base-tool-wifi-hotspot",
	name: "Portable Wi-Fi Hotspot",
	description:
		"A pocket hotspot that provides connectivity in the field when signals exist.",
	item_type: "tool",
	weight: 0.5,
	value: 120,
	effects: { passive: ["+2 to Investigation"] },
});

const burnerPhone = baseItem({
	id: "base-tool-burner-phone",
	name: "Burner Phone",
	description:
		"A disposable phone used for secure calls and avoiding traceability.",
	item_type: "tool",
	weight: 0.5,
	value: 50,
	effects: { passive: ["+2 to Deception"] },
});

const customBuiltLaptop = baseItem({
	id: "base-tool-custom-laptop",
	name: "Custom-Built Laptop",
	description:
		"A hardened laptop with encrypted drives and specialized tooling.",
	item_type: "tool",
	weight: 5,
	value: 2000,
	effects: { passive: ["+2 to Investigation", "+2 to Arcana"] },
});

const hackingTools = baseItem({
	id: "base-tool-hacking-tools",
	name: "Hacking Tools",
	description:
		"Adapters, cables, lockout keys, and diagnostic hardware for systems intrusion.",
	item_type: "tool",
	weight: 3,
	value: 250,
	effects: { passive: ["+2 to Investigation", "+1 to Sleight of Hand"] },
});

const usbDriveCollection = baseItem({
	id: "base-tool-usb-drives",
	name: "USB Drive Collection",
	description:
		"A set of drives containing cached logs, maps, and encrypted data dumps.",
	item_type: "misc",
	weight: 0.2,
	value: 25,
	effects: { passive: ["+1 to Investigation"] },
});

const smartphoneCamera = baseItem({
	id: "base-tool-smartphone-camera",
	name: "Smartphone (High-End Camera)",
	description: "A modern smartphone with a high-end camera and editing apps.",
	item_type: "tool",
	weight: 0.4,
	value: 900,
	effects: { passive: ["+1 to Performance", "+1 to Deception"] },
});

export const baseEquipment: Item[] = [
	// Armor
	padded,
	leather,
	studdedLeather,
	hide,
	chainShirt,
	scaleMail,
	breastplate,
	halfPlate,
	ringMail,
	chainMail,
	splint,
	plate,
	shield,
	// Simple Melee
	club,
	dagger,
	greatclub,
	handaxe,
	javelin,
	lightHammer,
	mace,
	quarterstaff,
	sickle,
	spear,
	// Simple Ranged
	lightCrossbow,
	dart,
	shortbow,
	sling,
	// Martial Melee
	battleaxe,
	flail,
	glaive,
	greataxe,
	greatsword,
	halberd,
	lance,
	longsword,
	maul,
	morningstar,
	pike,
	rapier,
	scimitar,
	shortsword,
	trident,
	warPick,
	warhammer,
	whip,
	// Martial Ranged
	blowgun,
	handCrossbow,
	heavyCrossbow,
	longbow,
	// Ammunition
	arrows20,
	bolts20,
	darts10,
	// Packs
	explorersPack,
	dungeoneersPack,
	priestsPack,
	scholarsPack,
	burglarsPack,
	diplomatsPack,
	entertainersPack,
	// Focus
	arcaneFocus,
	componentPouch,
	primalFocus,
	systemFocus,
	grimoire,
	// Tools
	thievesTools,
	tinkerTools,
	musicalInstrument,
	highEndStreamingLaptop,
	ringLight,
	portableCamera,
	portableWifiHotspot,
	burnerPhone,
	customBuiltLaptop,
	hackingTools,
	usbDriveCollection,
	smartphoneCamera,
];
