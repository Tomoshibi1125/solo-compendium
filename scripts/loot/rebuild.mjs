// Rebuild engine: turn an item record into a fully-themed, mechanically-varied
// Item via the (archetype × variant × theme × rarity) stack.

import {
	assignImage,
	classifyArchetype,
	fnv1a,
	generateDescription,
	generateDiscoveryLore,
	generateFlavor,
	generateLore,
	scrubText,
	scrubThemeTags,
} from "./lib.mjs";
import {
	consumableHpRange,
	consumableManaRange,
	detectTheme,
	getVariant,
	pickUniqueActive,
	pickUniquePassive,
} from "./variation.mjs";

// ----- helper -----
function uniq(arr) {
	const seen = new Set();
	const out = [];
	for (const v of arr) {
		const k = typeof v === "string" ? v : JSON.stringify(v);
		if (!seen.has(k)) {
			seen.add(k);
			out.push(v);
		}
	}
	return out;
}

function isWeaponArchetype(a) {
	return (
		a.startsWith("firearm_") ||
		a.startsWith("melee_") ||
		a.startsWith("ranged_") ||
		a === "focus_wand"
	);
}

function isArmorArchetype(a) {
	return a.startsWith("armor_");
}

function isConsumableArchetype(a) {
	return a.startsWith("consumable_");
}

// ----- main rebuild -----
export function rebuildItem(rawItem, file) {
	const id = rawItem.id || rawItem.name?.toLowerCase().replace(/\s+/g, "-");
	// Scrub the name through TERMINOLOGY_FIXES so legacy fantasy-isms in item
	// names ("Dragon-Scale", "Demon King", etc.) are normalized to RA-canonical.
	const name = scrubText(rawItem.name || "Unnamed");
	const rarity = rawItem.rarity || "common";
	const archetype = classifyArchetype(name, rawItem.type);
	const variantKey = `${id}::${name}`;
	const variant = getVariant(archetype, variantKey) || {};
	const theme = detectTheme(name);

	// Preserve weight/value/source, regenerate everything else.
	const weight = typeof rawItem.weight === "number" ? rawItem.weight : 1;
	const value = typeof rawItem.value === "number" ? rawItem.value : 10;
	const source = rawItem.source || "Rift Ascendant Canon";

	// Lore + flavor + discovery (all themed pool, deterministic by id+name).
	const lore = generateLore(name, id);
	const flavor = generateFlavor(archetype, name, id);
	const discovery = generateDiscoveryLore(name, id);
	const description = scrubText(generateDescription(archetype, name, id));

	const merged = {
		id,
		name,
		description,
		rarity,
		image: assignImage(file, id, name),
		weight,
		value,
		source,
		lore,
		flavor,
		discovery_lore: discovery,
	};

	// ----- weapon / armor / consumable / gear branches -----
	if (isWeaponArchetype(archetype)) {
		mergeWeapon(merged, archetype, variant, theme, rarity, variantKey);
	} else if (isArmorArchetype(archetype)) {
		mergeArmor(merged, archetype, variant, theme, rarity, variantKey);
	} else if (isConsumableArchetype(archetype)) {
		mergeConsumable(merged, archetype, variant, theme, rarity, variantKey);
	} else {
		// Gear / focus_caster / focus_tome
		mergeGear(merged, archetype, variant, theme, rarity, variantKey);
	}

	// ----- tags + attunement -----
	const tags = Array.isArray(rawItem.tags) ? scrubThemeTags(rawItem.tags) : ["equipment"];
	const themeTags = Array.isArray(rawItem.theme_tags) ? scrubThemeTags(rawItem.theme_tags) : [];
	merged.tags = uniq([...tags, archetype.split("_")[0]]);
	merged.theme_tags = themeTags;

	// Attunement: rare+ default true unless explicit false.
	if (rarity === "rare" || rarity === "epic" || rarity === "legendary") {
		merged.requires_attunement = true;
	}
	// Cursed theme implies attunement + cursed flag.
	if (theme?.cursed) {
		merged.requires_attunement = true;
		merged.cursed = true;
	}

	return merged;
}

// =============================================================
// Weapon branch
// =============================================================

function mergeWeapon(merged, archetype, variant, theme, rarity, key) {
	merged.type = "weapon";
	merged.item_type = "weapon";

	// Damage: variant baseline; theme overrides damage type.
	const damage = variant.damage || "1d6";
	const damageType = theme?.damageType || variant.damageType || "slashing";
	merged.weapon_type = computeWeaponType(archetype, variant);
	merged.damage = damage;
	merged.damage_type = damageType;
	if (variant.props) merged.simple_properties = variant.props;
	if (variant.range) merged.range = variant.range;

	// Structured weapon stamp (used by EquipmentDetail / actions).
	const wpn = { damage, damage_type: damageType };
	if (variant.props?.includes("finesse")) wpn.finesse = true;
	if (variant.props?.includes("versatile (1d10)")) wpn.versatile = "1d10";
	if (variant.props?.includes("versatile (1d8)")) wpn.versatile = "1d8";
	if (variant.props?.includes("versatile (1d12)")) wpn.versatile = "1d12";
	if (variant.range) {
		const rangeNum = parseInt(String(variant.range).match(/\d+/)?.[0] || "0", 10);
		if (rangeNum > 0) wpn.range = rangeNum;
	}
	merged.properties = { weapon: wpn };

	// Effects: variant note + theme rider + rarity unique passive + (rare+) active.
	const passives = [];
	if (variant.note) passives.push(variant.note);
	if (theme && Array.isArray(theme.ridersWeapon) && theme.ridersWeapon.length > 0) {
		const rider = theme.ridersWeapon[fnv1a(`${key}::weapon-rider`) % theme.ridersWeapon.length];
		passives.push(rider);
	}
	if (rarity !== "common") {
		const unique = pickUniquePassive(rarity, key);
		if (unique) passives.push(unique);
	}

	const effects = { passive: uniq(passives.filter(Boolean)) };
	if (rarity === "rare" || rarity === "epic" || rarity === "legendary") {
		const active = pickUniqueActive(rarity, key);
		if (active) effects.active = [active];
	}
	merged.effects = effects;
}

function computeWeaponType(archetype, variant) {
	if (archetype.startsWith("firearm_")) return "martial ranged";
	if (archetype === "ranged_bow" || archetype === "ranged_crossbow") return "martial ranged";
	if (archetype === "ranged_thrown") return "simple ranged";
	if (archetype === "focus_wand") return "simple ranged";
	if (archetype === "melee_staff" || archetype === "melee_gauntlet" || archetype === "melee_sickle") return "simple melee";
	return "martial melee";
}

// =============================================================
// Armor branch
// =============================================================

function mergeArmor(merged, archetype, variant, theme, rarity, key) {
	merged.type = "armor";
	merged.item_type = archetype === "armor_shield" ? "shield" : "armor";

	if (archetype === "armor_shield") {
		merged.armor_type = "Shield";
		merged.armor_class = "+2";
	} else {
		const baseAc = (variant.ac ?? 11) + (rarityArmorBonus(rarity) || 0);
		merged.armor_type = variant.type || "Light";
		if (merged.armor_type === "Light") {
			merged.armor_class = `${baseAc} + Dex modifier`;
		} else if (merged.armor_type === "Medium") {
			merged.armor_class = `${baseAc} + Dex modifier (max 2)`;
		} else if (merged.armor_type === "Heavy") {
			merged.armor_class = `${baseAc}`;
			if (variant.stealthDisadv) merged.stealth_disadvantage = true;
			if (variant.strReq) merged.strength_requirement = variant.strReq;
		} else {
			merged.armor_class = `${baseAc} + Dex modifier`;
		}
	}
	merged.properties = {};

	const passives = [];
	// Always include AC line for character-sheet parser.
	if (archetype === "armor_shield") {
		passives.push(`Provides +${2 + (rarityArmorBonus(rarity) || 0)} AC while wielded.`);
	} else if (merged.armor_type === "Heavy") {
		passives.push(`Provides AC ${merged.armor_class}. Stealth checks at disadvantage.`);
	} else if (merged.armor_type === "Medium") {
		passives.push(`Provides AC ${merged.armor_class.replace(" + Dex modifier (max 2)", " + AGI (max +2)")}.`);
	} else {
		passives.push(`Provides AC ${merged.armor_class.replace(" + Dex modifier", " + AGI modifier")}.`);
	}
	if (variant.note && !passives.includes(variant.note)) passives.push(variant.note);

	if (theme && Array.isArray(theme.ridersArmor) && theme.ridersArmor.length > 0) {
		const rider = theme.ridersArmor[fnv1a(`${key}::armor-rider`) % theme.ridersArmor.length];
		passives.push(rider);
	}
	if (rarity !== "common") {
		const unique = pickUniquePassive(rarity, key);
		if (unique) passives.push(unique);
	}

	merged.effects = { passive: uniq(passives.filter(Boolean)) };
	if (rarity === "rare" || rarity === "epic" || rarity === "legendary") {
		const active = pickUniqueActive(rarity, key);
		if (active) merged.effects.active = [active];
	}
}

function rarityArmorBonus(rarity) {
	switch (rarity) {
		case "common":
			return 0;
		case "uncommon":
			return 0; // base AC stays; rarity bonus comes from unique passive
		case "rare":
			return 1;
		case "epic":
			return 2;
		case "legendary":
			return 3;
		default:
			return 0;
	}
}

// =============================================================
// Consumable branch
// =============================================================

function mergeConsumable(merged, archetype, variant, theme, rarity, key) {
	merged.type = "consumable";
	merged.item_type = "consumable";
	merged.properties = {};

	const passives = [];
	const actives = [];

	if (archetype === "consumable_potion" || archetype === "consumable_stim") {
		// Theme override takes priority over variant pick (so 'Mana X' is always mana, etc.).
		const subtype = theme?.consumableSubtype || variant.subtype || "healing";
		const actName = variant.action || (archetype === "consumable_stim" ? "Inject" : "Drink");
		const actVerb = archetype === "consumable_stim" ? "Inject" : "Drink";
		const range = archetype === "consumable_stim" ? "5 ft." : "self";
		if (subtype === "healing") {
			const hp = consumableHpRange(rarity);
			passives.push(`On ${actVerb.toLowerCase()}, restore ${hp} hit points.`);
			actives.push({
				name: actName,
				description: `${archetype === "consumable_stim" ? "Bonus action. Restore" : "Action. Drink the potion. Restore"} ${hp} HP${archetype === "consumable_stim" ? " to a willing creature within " + range : ""}.`,
				action: archetype === "consumable_stim" ? "bonus-action" : "action",
				frequency: "at-will",
			});
		} else if (subtype === "mana") {
			const mana = consumableManaRange(rarity);
			passives.push(`On ${actVerb.toLowerCase()}, restore ${mana} mana.`);
			actives.push({
				name: actName,
				description: `${archetype === "consumable_stim" ? "Bonus action" : "Action"}. Restore ${mana} mana.`,
				action: archetype === "consumable_stim" ? "bonus-action" : "action",
				frequency: "at-will",
			});
		} else {
			passives.push(variant.note || "Provides a temporary boost on consumption.");
			actives.push({
				name: actName,
				description: `${archetype === "consumable_stim" ? "Bonus action" : "Action"}. ${variant.note || "Activate."}`,
				action: archetype === "consumable_stim" ? "bonus-action" : "action",
				frequency: "at-will",
			});
		}
	} else if (archetype === "consumable_grenade") {
		const sub = variant.subtype || "force";
		const dmg = variant.damage ? variant.damage[rarity[0]] || variant.damage.c : null;
		const radius = variant.radius || 10;
		const dc = 10 + rarityScalingMod(rarity);
		merged.range = "Thrown (30/90)";
		merged.simple_properties = ["thrown", "consumable"];
		if (dmg) {
			merged.damage = dmg;
			merged.damage_type = variant.damageType;
			merged.properties = { weapon: { damage: dmg, damage_type: variant.damageType, range: 30 } };
		}
		const desc = dmg
			? `Action. Throw to a point within 30 ft. All creatures within ${radius} ft. make a DC ${dc} Agility save, taking ${dmg} ${variant.damageType} damage on a fail (half on success).`
			: `Action. Throw to a point within 30 ft. ${variant.note}`;
		actives.push({
			name: "Throw",
			description: desc,
			action: "action",
			frequency: "at-will",
			dc,
		});
		passives.push(variant.note || `${sub} grenade. Detonates in ${radius} ft.`);
	} else if (archetype === "consumable_scroll") {
		passives.push(variant.note || "Single-use scroll. Casts an inscribed spell.");
		actives.push({
			name: "Read",
			description: "Action. Cast the inscribed spell. The scroll is consumed.",
			action: "action",
			frequency: "at-will",
		});
	} else if (archetype === "consumable_purifier") {
		passives.push(variant.note || "Cures one of: poisoned, charmed, frightened, or weakened.");
		actives.push({
			name: variant.action || "Apply",
			description: `Action. ${variant.note || "Cure one targeted condition."}`,
			action: "action",
			frequency: "at-will",
		});
	} else if (archetype === "consumable_signal") {
		passives.push(variant.note || "Burns for 1 minute. Bright light in a 60-ft. radius.");
		actives.push({
			name: "Activate",
			description: `Action. ${variant.note || "Burn for 1 minute. Bright light in 60 ft."}`,
			action: "action",
			frequency: "at-will",
		});
	} else {
		passives.push(variant.note || "Standard field consumable.");
	}

	// Theme consumable rider — only add when it provides genuinely new info
	// (skip if the rider's primary effect already matches the subtype we just generated).
	if (theme && Array.isArray(theme.ridersConsumable) && theme.ridersConsumable.length > 0) {
		const rider = theme.ridersConsumable[fnv1a(`${key}::consumable-rider`) % theme.ridersConsumable.length];
		const subtype = theme?.consumableSubtype || variant.subtype || "";
		const riderRedundant =
			(subtype === "mana" && /restores mana/i.test(rider)) ||
			(subtype === "healing" && /^restores hp\b/i.test(rider));
		if (!riderRedundant) passives.push(rider);
	}

	merged.effects = { passive: uniq(passives.filter(Boolean)) };
	if (actives.length > 0) merged.effects.active = actives;
}

function rarityScalingMod(rarity) {
	switch (rarity) {
		case "common":
			return 3;
		case "uncommon":
			return 4;
		case "rare":
			return 5;
		case "epic":
			return 6;
		case "legendary":
			return 8;
		default:
			return 3;
	}
}

// =============================================================
// Gear / focus branch
// =============================================================

function mergeGear(merged, archetype, variant, theme, rarity, key) {
	merged.item_type = variant.item_type || "tool";
	merged.type = variant.type || gearTypeFor(archetype);
	merged.properties = {};

	const passives = [];
	if (variant.note) passives.push(variant.note);
	if (theme && Array.isArray(theme.ridersArmor) && theme.ridersArmor.length > 0) {
		// gear borrows from armor riders for thematic consistency
		const rider = theme.ridersArmor[fnv1a(`${key}::gear-rider`) % theme.ridersArmor.length];
		passives.push(rider);
	}
	if (rarity !== "common") {
		const unique = pickUniquePassive(rarity, key);
		if (unique) passives.push(unique);
	}

	merged.effects = { passive: uniq(passives.filter(Boolean)) };
	if (rarity === "rare" || rarity === "epic" || rarity === "legendary") {
		const active = pickUniqueActive(rarity, key);
		if (active) merged.effects.active = [active];
	}
}

function gearTypeFor(archetype) {
	switch (archetype) {
		case "gear_amulet":
			return "amulet";
		case "gear_ring":
			return "ring";
		case "focus_caster":
			return "focus";
		case "focus_tome":
			return "scroll";
		case "gear_credential":
		case "gear_attire":
		case "gear_misc":
			return "wondrous";
		default:
			return "wondrous";
	}
}
