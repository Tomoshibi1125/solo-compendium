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

const RARITY_ORDER = {
	common: 0,
	uncommon: 1,
	rare: 2,
	very_rare: 3,
	epic: 3,
	legendary: 4,
};

const ABILITY_LABELS = {
	STR: "Strength",
	AGI: "Agility",
	VIT: "Vitality",
	INT: "Intelligence",
	SENSE: "Sense",
	PRE: "Presence",
};

function normalizeRaRulesLanguage(value) {
	if (typeof value === "string") {
		return value
			.replace(/\bDexterity\b/g, "Agility")
			.replace(/\bdexterity\b/g, "agility")
			.replace(/\bDex\b/g, "AGI")
			.replace(/\bdex\b/g, "AGI")
			.replace(/\bConstitution\b/g, "Vitality")
			.replace(/\bconstitution\b/g, "vitality")
			.replace(/\bWisdom\b/g, "Sense")
			.replace(/\bwisdom\b/g, "sense")
			.replace(/\bCharisma\b/g, "Presence")
			.replace(/\bcharisma\b/g, "presence");
	}
	if (Array.isArray(value)) return value.map(normalizeRaRulesLanguage);
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, itemValue]) => [
				key,
				normalizeRaRulesLanguage(itemValue),
			]),
		);
	}
	return value;
}

function getEffects(item) {
	return item.effects && typeof item.effects === "object" ? item.effects : {};
}

function getPassiveRules(item) {
	const rules = [];
	const passive = getEffects(item).passive;
	if (Array.isArray(passive)) {
		rules.push(
			...passive.filter((rule) => typeof rule === "string" && rule.trim()),
		);
	}
	for (const key of ["primary", "secondary"]) {
		const value = getEffects(item)[key];
		if (typeof value === "string" && value.trim()) rules.push(value);
	}
	if (Array.isArray(item.abilities)) {
		for (const ability of item.abilities) {
			if (!ability || typeof ability !== "object") continue;
			const type = String(ability.type ?? "").toLowerCase();
			const description = ability.description;
			if (
				(type === "passive" || type === "triggered") &&
				typeof description === "string" &&
				description.trim()
			) {
				rules.push(`${ability.name}: ${description}`);
			}
		}
	}
	return uniq(rules);
}

function getActiveRules(item) {
	const active = getEffects(item).active;
	const rules = Array.isArray(active)
		? active.filter((rule) => rule && typeof rule === "object")
		: [];
	if (Array.isArray(item.abilities)) {
		for (const ability of item.abilities) {
			if (!ability || typeof ability !== "object") continue;
			const type = String(ability.type ?? "").toLowerCase();
			if (!["active", "command"].includes(type)) continue;
			if (
				typeof ability.name !== "string" ||
				typeof ability.description !== "string"
			) {
				continue;
			}
			rules.push({
				name: ability.name,
				description: ability.description,
				action: ability.action ?? "action",
				frequency: ability.frequency ?? ability.usage ?? "as listed",
				dc: ability.dc ?? null,
			});
		}
	}
	return rules;
}

function getRarityBonus(rarity) {
	return RARITY_ORDER[rarity] ?? 0;
}

function getItemBonus(item, rarity) {
	if (typeof item.protocol_bonus === "number") return item.protocol_bonus;
	const order = getRarityBonus(rarity);
	if (order >= 4) return 3;
	if (order >= 3) return 2;
	if (order >= 2) return 1;
	return 0;
}

function damageDiceOnly(value) {
	if (typeof value !== "string") return null;
	return value.match(/\d+d\d+/i)?.[0] ?? null;
}

function extractFormulaFromText(text) {
	if (typeof text !== "string") return null;
	return (
		text.match(/\d+d\d+(?:\s*[+-]\s*\d+)?/i)?.[0] ??
		text.match(/\+\d+\s+AC/i)?.[0] ??
		text.match(/AC\s+\d+(?:\s*\+\s*AGI[^.;]*)?/i)?.[0] ??
		null
	);
}

function getPrimaryActive(item) {
	return getActiveRules(item)[0] ?? null;
}

function normalizeAction(action) {
	if (!action) return "passive";
	return String(action).toLowerCase().replace(/_/g, "-");
}

function weaponAbilityProfile(archetype, item) {
	const props = [
		...(Array.isArray(item.simple_properties) ? item.simple_properties : []),
		...getPassiveRules(item),
	].join(" ");
	const weaponType = String(item.weapon_type ?? "").toLowerCase();
	if (archetype.includes("finesse") || /finesse/i.test(props)) {
		return {
			attack: ["STR", "AGI"],
			damage: ["STR", "AGI"],
			formulaAbility: "STR or AGI",
		};
	}
	if (
		archetype.startsWith("firearm_") ||
		archetype.startsWith("ranged_") ||
		weaponType.includes("ranged")
	) {
		return { attack: ["AGI"], damage: ["AGI"], formulaAbility: "AGI" };
	}
	return { attack: ["STR"], damage: ["STR"], formulaAbility: "STR" };
}

function getSaveAbility(text, fallback = "AGI") {
	const haystack = String(text ?? "");
	for (const [key, label] of Object.entries(ABILITY_LABELS)) {
		if (new RegExp(`\\b${label}\\b`, "i").test(haystack)) return key;
		if (new RegExp(`\\b${key}\\b`, "i").test(haystack)) return key;
	}
	return fallback;
}

function buildActivation(item, archetype) {
	const active = getPrimaryActive(item);
	const action = normalizeAction(active?.action);
	if (active) {
		return {
			type: action,
			cost:
				action === "bonus-action"
					? "1 bonus action"
					: action === "reaction"
						? "1 reaction"
						: "1 action",
			frequency: active.frequency ?? "at-will",
			trigger:
				action === "reaction"
					? "A listed reaction trigger occurs."
					: "User activates the item.",
			consumes_item: archetype.startsWith("consumable_"),
		};
	}
	if (isWeaponArchetype(archetype)) {
		return {
			type: "action",
			cost: "1 action",
			frequency: "at-will",
			trigger: "User makes an Attack action with the item.",
			consumes_item: false,
		};
	}
	return {
		type: "passive",
		cost: "no action",
		frequency: "continuous",
		trigger: "Equipped, carried, worn, or used as described.",
		consumes_item: false,
	};
}

function buildTargeting(item, archetype) {
	if (isWeaponArchetype(archetype)) {
		return {
			target: "One creature or object",
			range: item.range ?? "Melee",
			area: null,
			line_of_effect: "standard weapon targeting",
		};
	}
	if (archetype === "consumable_grenade") {
		return {
			target: "Point within thrown range",
			range: item.range ?? "Thrown (30/90)",
			area: "radius listed in active rule",
			line_of_effect: "thrown object",
		};
	}
	if (isArmorArchetype(archetype)) {
		return {
			target: "Self",
			range: "worn or wielded",
			area: null,
			line_of_effect: "equipment slot",
		};
	}
	return {
		target: "Self, touched object, or listed utility target",
		range: item.range ?? "self",
		area: null,
		line_of_effect: "as item description permits",
	};
}

function buildResolution(item, archetype, abilityProfile) {
	const passiveRules = getPassiveRules(item);
	const activeRules = getActiveRules(item);
	const primaryActive = getPrimaryActive(item);
	if (isWeaponArchetype(archetype)) {
		const damageDice = damageDiceOnly(String(item.damage ?? ""));
		const damageType =
			item.damage_type ?? item.properties?.weapon?.damage_type ?? "physical";
		return {
			type: "weapon_attack",
			attack_roll: true,
			damage_roll: Boolean(damageDice),
			damage_type: damageType,
			damage_formula: damageDice
				? `${damageDice} + ${abilityProfile.formulaAbility} modifier`
				: "damage as listed by the item",
			on_hit: passiveRules,
			active_options: activeRules.map((rule) => ({
				name: rule.name,
				description: rule.description,
				dc: rule.dc ?? null,
			})),
		};
	}
	if (isArmorArchetype(archetype)) {
		return {
			type: "armor_class",
			armor_class: item.armor_class ?? null,
			armor_type: item.armor_type ?? null,
			stealth_disadvantage: item.stealth_disadvantage ?? false,
			strength_requirement: item.strength_requirement ?? null,
			equipped_effects: passiveRules,
		};
	}
	if (isConsumableArchetype(archetype)) {
		return {
			type: "consumable",
			consumes_item: true,
			use_rule: primaryActive?.description ?? passiveRules.join(" "),
			damage_type: item.damage_type ?? null,
			damage_formula:
				damageDiceOnly(String(item.damage ?? "")) ??
				extractFormulaFromText(primaryActive?.description) ??
				null,
			save: primaryActive?.dc
				? {
						dc: primaryActive.dc,
						ability: getSaveAbility(primaryActive.description),
					}
				: null,
		};
	}
	return {
		type: "equipment_utility",
		passive_effects: passiveRules,
		active_options: activeRules.map((rule) => ({
			name: rule.name,
			description: rule.description,
			dc: rule.dc ?? null,
		})),
		non_damage_resolution:
			passiveRules[0] ??
			primaryActive?.description ??
			"Resolve the item through the listed utility effect.",
	};
}

function buildAbilityModifiers(item, archetype, abilityProfile) {
	if (isWeaponArchetype(archetype)) {
		return {
			attack: abilityProfile.attack,
			damage: abilityProfile.damage,
			save_dc: [],
			armor_class: [],
			notes:
				"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
		};
	}
	if (isArmorArchetype(archetype)) {
		return {
			attack: [],
			damage: [],
			save_dc: [],
			armor_class:
				String(item.armor_class ?? "").includes("AGI") ||
				String(item.armor_class ?? "").includes("Agility")
					? ["AGI"]
					: [],
			requirements:
				typeof item.strength_requirement === "number" ? ["STR"] : [],
			notes:
				"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
		};
	}
	const activeText = getPrimaryActive(item)?.description ?? "";
	return {
		attack: [],
		damage: [],
		save_dc: /\bDC\s+\d+/i.test(activeText) ? [getSaveAbility(activeText)] : [],
		armor_class: [],
		notes:
			"Utility and consumable items only call for an ability when their explicit rule names one.",
	};
}

function buildFormulas(item, archetype, abilityProfile, rarity) {
	const primaryActive = getPrimaryActive(item);
	const itemBonus = getItemBonus(item, rarity);
	if (isWeaponArchetype(archetype)) {
		const damageDice =
			damageDiceOnly(String(item.damage ?? "")) ?? "weapon die";
		const bonusText = itemBonus > 0 ? ` + ${itemBonus}` : "";
		return {
			attack_roll: `d20 + ${abilityProfile.formulaAbility} modifier + proficiency bonus${bonusText}`,
			damage_roll: `${damageDice} + ${abilityProfile.formulaAbility} modifier${bonusText}`,
			save_dc: primaryActive?.dc ? `DC ${primaryActive.dc}` : null,
			recharge: primaryActive?.frequency ?? "at-will",
		};
	}
	if (isArmorArchetype(archetype)) {
		return {
			armor_class: item.armor_class ?? "as listed",
			shield_bonus: item.item_type === "shield" ? "+2 AC" : null,
			speed_penalty: item.strength_requirement
				? `Requires STR ${item.strength_requirement}`
				: null,
			recharge: "continuous",
		};
	}
	const extracted =
		extractFormulaFromText(primaryActive?.description) ??
		extractFormulaFromText(getPassiveRules(item).join(" ")) ??
		"explicit non-damage item effect";
	return {
		effect_formula: extracted,
		save_dc: primaryActive?.dc ? `DC ${primaryActive.dc}` : null,
		recharge: primaryActive?.frequency ?? "continuous",
	};
}

function buildIdentity(item, archetype, theme, rarity, key, file) {
	const seed = `${file}::${key}::${archetype}::${rarity}`;
	const signature = fnv1a(seed).toString(16).padStart(8, "0");
	const themeKey = theme?.key ?? "standard";
	return {
		archetype,
		rarity,
		role: isWeaponArchetype(archetype)
			? "offense"
			: isArmorArchetype(archetype)
				? "defense"
				: isConsumableArchetype(archetype)
					? "consumable"
					: "utility",
		theme: themeKey,
		signature,
		distinguishing_rule: `${item.name} keys ${themeKey} ${archetype.replace(/_/g, " ")} rules through signature ${signature}.`,
		canon_basis:
			item.source === "Rift Ascendant Canon" ||
			item.source === "Ascendant Compendium"
				? "RA canon"
				: rarity === "common"
					? "RA mundane baseline"
					: "RA enhanced catalog",
	};
}

function buildSourceIntegrity(item, rarity, archetype) {
	return {
		allows_5e_baseline:
			rarity === "common" && !isConsumableArchetype(archetype),
		ra_specific_mundane:
			rarity === "common" &&
			/\b(gate|hunter|bureau|mana|rift|lattice|ascendant|anomaly)\b/i.test(
				`${item.name} ${item.description}`,
			),
		canon_guardrails: [
			"Use RA ability names in formulas.",
			"Preserve gate, mana lattice, and anomaly terminology.",
			"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
		],
	};
}

function buildLimitations(item, archetype) {
	const active = getPrimaryActive(item);
	return {
		attunement_required: Boolean(item.requires_attunement ?? item.attunement),
		cursed: Boolean(item.cursed),
		charges: item.charges ?? null,
		recharge: active?.frequency ?? item.charges?.recharge ?? "as listed",
		equipment_state:
			isArmorArchetype(archetype) || isWeaponArchetype(archetype)
				? "must be equipped; attunement required when listed"
				: "must be carried, consumed, or deployed as the activation describes",
		restrictions: [
			item.strength_requirement
				? `Requires STR ${item.strength_requirement} to avoid armor penalties.`
				: null,
			item.system_awakening_required ? "Requires System Awakening." : null,
			item.ascendant_level_required
				? `Requires Ascendant level ${item.ascendant_level_required}.`
				: null,
		].filter(Boolean),
	};
}

function enrichRulesPayload(
	item,
	archetype,
	variant,
	theme,
	rarity,
	key,
	file,
) {
	const normalized = normalizeRaRulesLanguage(item);
	if (typeof normalized.armor_class === "string") {
		normalized.armor_class = normalizeRaRulesLanguage(normalized.armor_class);
	}
	const abilityProfile = weaponAbilityProfile(archetype, normalized);
	const activation = buildActivation(normalized, archetype);
	const targeting = buildTargeting(normalized, archetype);
	const resolution = buildResolution(normalized, archetype, abilityProfile);
	const abilityModifiers = buildAbilityModifiers(
		normalized,
		archetype,
		abilityProfile,
	);
	const formulas = buildFormulas(normalized, archetype, abilityProfile, rarity);
	const passiveRules = getPassiveRules(normalized);
	const activeRules = getActiveRules(normalized);
	const fingerprintSource = JSON.stringify({
		archetype,
		rarity,
		theme: theme?.key ?? "standard",
		resolution,
		formulas,
		passiveRules,
		activeRules,
	});
	const fingerprint = fnv1a(fingerprintSource).toString(16).padStart(8, "0");
	return {
		...normalized,
		activation,
		limitations: buildLimitations(normalized, archetype),
		mechanics: {
			...(normalized.mechanics && typeof normalized.mechanics === "object"
				? normalized.mechanics
				: {}),
			rules_payload_version: "ra-item-v1",
			identity: buildIdentity(normalized, archetype, theme, rarity, key, file),
			action_economy: activation,
			targeting,
			resolution,
			ability_modifiers: abilityModifiers,
			formulas,
			passive_rules: passiveRules,
			active_rules: activeRules.map((rule) => ({
				name: rule.name,
				description: rule.description,
				action: rule.action ?? null,
				frequency: rule.frequency ?? null,
				dc: rule.dc ?? null,
			})),
			source_integrity: buildSourceIntegrity(normalized, rarity, archetype),
			audit: {
				payload_complete: true,
				uniqueness_seed: key,
				fingerprint,
				variant_note: variant?.note ?? null,
			},
		},
	};
}

export function enrichItemPayload(rawItem, file) {
	const id = rawItem.id || rawItem.name?.toLowerCase().replace(/\s+/g, "-");
	const name = scrubText(rawItem.name || "Unnamed");
	const rarity = rawItem.rarity || "common";
	const archetype = classifyArchetype(name, rawItem.type);
	const variantKey = `${id}::${name}`;
	const variant = getVariant(archetype, variantKey) || {};
	const theme = detectTheme(name);
	return enrichRulesPayload(
		{ ...rawItem, id, name, rarity },
		archetype,
		variant,
		theme,
		rarity,
		variantKey,
		file,
	);
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
	const tags = Array.isArray(rawItem.tags)
		? scrubThemeTags(rawItem.tags)
		: ["equipment"];
	const themeTags = Array.isArray(rawItem.theme_tags)
		? scrubThemeTags(rawItem.theme_tags)
		: [];
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

	return enrichRulesPayload(
		merged,
		archetype,
		variant,
		theme,
		rarity,
		variantKey,
		file,
	);
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
		const rangeNum = parseInt(
			String(variant.range).match(/\d+/)?.[0] || "0",
			10,
		);
		if (rangeNum > 0) wpn.range = rangeNum;
	}
	merged.properties = { weapon: wpn };

	// Effects: variant note + theme rider + rarity unique passive + (rare+) active.
	const passives = [];
	if (variant.note) passives.push(variant.note);
	if (
		theme &&
		Array.isArray(theme.ridersWeapon) &&
		theme.ridersWeapon.length > 0
	) {
		const rider =
			theme.ridersWeapon[
				fnv1a(`${key}::weapon-rider`) % theme.ridersWeapon.length
			];
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

function computeWeaponType(archetype, _variant) {
	if (archetype.startsWith("firearm_")) return "martial ranged";
	if (archetype === "ranged_bow" || archetype === "ranged_crossbow")
		return "martial ranged";
	if (archetype === "ranged_thrown") return "simple ranged";
	if (archetype === "focus_wand") return "simple ranged";
	if (
		archetype === "melee_staff" ||
		archetype === "melee_gauntlet" ||
		archetype === "melee_sickle"
	)
		return "simple melee";
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
			merged.armor_class = `${baseAc} + AGI modifier`;
		} else if (merged.armor_type === "Medium") {
			merged.armor_class = `${baseAc} + AGI modifier (max 2)`;
		} else if (merged.armor_type === "Heavy") {
			merged.armor_class = `${baseAc}`;
			if (variant.stealthDisadv) merged.stealth_disadvantage = true;
			if (variant.strReq) merged.strength_requirement = variant.strReq;
		} else {
			merged.armor_class = `${baseAc} + AGI modifier`;
		}
	}
	merged.properties = {};

	const passives = [];
	// Always include AC line for character-sheet parser.
	if (archetype === "armor_shield") {
		passives.push(
			`Provides +${2 + (rarityArmorBonus(rarity) || 0)} AC while wielded.`,
		);
	} else if (merged.armor_type === "Heavy") {
		passives.push(
			`Provides AC ${merged.armor_class}. Stealth checks at disadvantage.`,
		);
	} else if (merged.armor_type === "Medium") {
		passives.push(
			`Provides AC ${merged.armor_class.replace(" + AGI modifier (max 2)", " + AGI (max +2)")}.`,
		);
	} else {
		passives.push(`Provides AC ${merged.armor_class}.`);
	}
	if (variant.note && !passives.includes(variant.note))
		passives.push(variant.note);

	if (
		theme &&
		Array.isArray(theme.ridersArmor) &&
		theme.ridersArmor.length > 0
	) {
		const rider =
			theme.ridersArmor[
				fnv1a(`${key}::armor-rider`) % theme.ridersArmor.length
			];
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
		const actName =
			variant.action || (archetype === "consumable_stim" ? "Inject" : "Drink");
		const actVerb = archetype === "consumable_stim" ? "Inject" : "Drink";
		const range = archetype === "consumable_stim" ? "5 ft." : "self";
		if (subtype === "healing") {
			const hp = consumableHpRange(rarity);
			passives.push(`On ${actVerb.toLowerCase()}, restore ${hp} hit points.`);
			actives.push({
				name: actName,
				description: `${archetype === "consumable_stim" ? "Bonus action. Restore" : "Action. Drink the potion. Restore"} ${hp} HP${archetype === "consumable_stim" ? ` to a willing creature within ${range}` : ""}.`,
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
			passives.push(
				variant.note || "Provides a temporary boost on consumption.",
			);
			actives.push({
				name: actName,
				description: `${archetype === "consumable_stim" ? "Bonus action" : "Action"}. ${variant.note || "Activate."}`,
				action: archetype === "consumable_stim" ? "bonus-action" : "action",
				frequency: "at-will",
			});
		}
	} else if (archetype === "consumable_grenade") {
		const sub = variant.subtype || "force";
		const dmg = variant.damage
			? variant.damage[rarity[0]] || variant.damage.c
			: null;
		const radius = variant.radius || 10;
		const dc = 10 + rarityScalingMod(rarity);
		merged.range = "Thrown (30/90)";
		merged.simple_properties = ["thrown", "consumable"];
		if (dmg) {
			merged.damage = dmg;
			merged.damage_type = variant.damageType;
			merged.properties = {
				weapon: { damage: dmg, damage_type: variant.damageType, range: 30 },
			};
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
		passives.push(
			variant.note || "Single-use scroll. Casts an inscribed spell.",
		);
		actives.push({
			name: "Read",
			description: "Action. Cast the inscribed spell. The scroll is consumed.",
			action: "action",
			frequency: "at-will",
		});
	} else if (archetype === "consumable_purifier") {
		passives.push(
			variant.note ||
				"Cures one of: poisoned, charmed, frightened, or weakened.",
		);
		actives.push({
			name: variant.action || "Apply",
			description: `Action. ${variant.note || "Cure one targeted condition."}`,
			action: "action",
			frequency: "at-will",
		});
	} else if (archetype === "consumable_signal") {
		passives.push(
			variant.note || "Burns for 1 minute. Bright light in a 60-ft. radius.",
		);
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
	if (
		theme &&
		Array.isArray(theme.ridersConsumable) &&
		theme.ridersConsumable.length > 0
	) {
		const rider =
			theme.ridersConsumable[
				fnv1a(`${key}::consumable-rider`) % theme.ridersConsumable.length
			];
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
	if (
		theme &&
		Array.isArray(theme.ridersArmor) &&
		theme.ridersArmor.length > 0
	) {
		// gear borrows from armor riders for thematic consistency
		const rider =
			theme.ridersArmor[fnv1a(`${key}::gear-rider`) % theme.ridersArmor.length];
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
