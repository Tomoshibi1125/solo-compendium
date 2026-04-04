/**
 * Equipment modifier parsing and application
 */

interface EquipmentModifiers {
	ac?: number;
	attack?: number;
	damage?: number;
	str?: number;
	agi?: number;
	vit?: number;
	int?: number;
	sense?: number;
	pre?: number;
	speed?: number;
	savingThrows?: Record<string, number>;
	skills?: Record<string, number>;
}

function getAbilityModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

function getDexCapFromArmorType(armorType: string | undefined): number | null {
	const t = (armorType || "").trim().toLowerCase();
	if (t === "light") return null;
	if (t === "medium") return 2;
	if (t === "heavy") return 0;
	return null;
}

function isArmorItem(properties: string[]): boolean {
	return properties.some((p) => {
		const lower = p.toLowerCase();
		return (
			lower === "light" ||
			lower === "medium" ||
			lower === "heavy" ||
			lower === "shield"
		);
	});
}

function parseArmorBaseAc(properties: string[]): number | null {
	for (const prop of properties) {
		const lowerProp = prop.toLowerCase();
		const acMatch = lowerProp.match(/(?:ac\s+(\d+))/i);
		if (acMatch?.[1]) {
			const n = parseInt(acMatch[1], 10);
			if (!Number.isNaN(n) && n > 0) return n;
		}
	}
	return null;
}

/**
 * Parse equipment properties into modifiers
 */
export function parseModifiers(properties: string[]): EquipmentModifiers {
	const modifiers: EquipmentModifiers = {};

	if (!properties || properties.length === 0) return modifiers;

	properties.forEach((prop) => {
		const lowerProp = prop.toLowerCase();

		// AC modifiers: "AC 15", "+2 AC", "AC +2"
		const acMatch = lowerProp.match(
			/(?:ac\s+(\d+)|(\+?\d+)\s+ac|ac\s+(\+?\d+))/i,
		);
		if (acMatch) {
			const value = parseInt(acMatch[1] || acMatch[2] || acMatch[3] || "0", 10);
			if (lowerProp.includes("ac") && !lowerProp.includes("+")) {
				modifiers.ac = value; // Set AC (e.g., "AC 15")
			} else {
				modifiers.ac = (modifiers.ac || 0) + value; // Add to AC
			}
		}

		// Attack modifiers: "+1 to attack", "+2 attack bonus"
		const attackMatch = lowerProp.match(
			/(\+?\d+)\s+to\s+attack|(\+?\d+)\s+attack/i,
		);
		if (attackMatch) {
			const value = parseInt(attackMatch[1] || attackMatch[2] || "0", 10);
			modifiers.attack = (modifiers.attack || 0) + value;
		}

		// Damage modifiers: "+1 to damage", "+2 damage"
		const damageMatch = lowerProp.match(
			/(\+?\d+)\s+to\s+damage|(\+?\d+)\s+damage/i,
		);
		if (damageMatch) {
			const value = parseInt(damageMatch[1] || damageMatch[2] || "0", 10);
			modifiers.damage = (modifiers.damage || 0) + value;
		}

		// Ability score modifiers: "+2 Strength", "+1 to STR"
		const abilityMap: Record<
			string,
			"str" | "agi" | "vit" | "int" | "sense" | "pre"
		> = {
			strength: "str",
			str: "str",
			agility: "agi",
			dex: "agi",
			agi: "agi",
			vitality: "vit",
			con: "vit",
			vit: "vit",
			intelligence: "int",
			int: "int",
			sense: "sense",
			wis: "sense",
			presence: "pre",
			cha: "pre",
			pre: "pre",
		};

		for (const [key, ability] of Object.entries(abilityMap)) {
			const abilityMatch = lowerProp.match(
				new RegExp(`(\\+?\\d+)\\s+(?:to\\s+)?${key}`, "i"),
			);
			if (abilityMatch) {
				const value = parseInt(abilityMatch[1] || "0", 10);
				modifiers[ability] =
					((modifiers[ability] as number | undefined) || 0) + value;
			}
		}

		// Speed modifiers: "+10 speed", "+5 ft speed"
		const speedMatch = lowerProp.match(/(\+?\d+)\s*(?:ft\s*)?speed/i);
		if (speedMatch) {
			const value = parseInt(speedMatch[1] || "0", 10);
			modifiers.speed = (modifiers.speed || 0) + value;
		}

		// Saving throw modifiers: "+1 to saving throws", "+2 to all saves"
		const saveMatch = lowerProp.match(
			/(\+?\d+)\s+to\s+(?:all\s+)?(?:saving\s+)?throws?/i,
		);
		if (saveMatch) {
			const value = parseInt(saveMatch[1] || "0", 10);
			if (!modifiers.savingThrows) modifiers.savingThrows = {};
			// Apply to all saves if "all saves" mentioned
			if (lowerProp.includes("all")) {
				["STR", "AGI", "VIT", "INT", "SENSE", "PRE"].forEach((ability) => {
					if (!modifiers.savingThrows) modifiers.savingThrows = {};
					modifiers.savingThrows[ability] =
						(modifiers.savingThrows[ability] || 0) + value;
				});
			}
		}

		// Per-save modifiers: "+1 to STR saves", "+2 to agility saving throws"
		const saveAliases: Array<[string, string]> = [
			["strength", "STR"],
			["str", "STR"],
			["agility", "AGI"],
			["dex", "AGI"],
			["agility", "AGI"],
			["agi", "AGI"],
			["vitality", "VIT"],
			["con", "VIT"],
			["vitality", "VIT"],
			["vit", "VIT"],
			["intelligence", "INT"],
			["int", "INT"],
			["sense", "SENSE"],
			["wis", "SENSE"],
			["sense", "SENSE"],
			["presence", "PRE"],
			["cha", "PRE"],
			["presence", "PRE"],
			["pre", "PRE"],
		];
		for (const [alias, key] of saveAliases) {
			const re = new RegExp(
				`(\\+?\\d+)\\s+to\\s+${alias}\\s+(?:saving\\s+)?throws?`,
				"i",
			);
			const m = lowerProp.match(re);
			if (m?.[1]) {
				const value = parseInt(m[1] || "0", 10);
				if (!modifiers.savingThrows) modifiers.savingThrows = {};
				modifiers.savingThrows[key] =
					(modifiers.savingThrows[key] || 0) + value;
			}
		}

		// Skill modifiers: "+2 to Stealth", "+1 to all skills"
		const skillMatch = lowerProp.match(/(\+?\d+)\s+to\s+(?:all\s+)?skills?/i);
		if (skillMatch) {
			const value = parseInt(skillMatch[1] || "0", 10);
			if (!modifiers.skills) modifiers.skills = {};
			if (lowerProp.includes("all")) {
				// Expand "*" into all 18 System Ascendant skills
				const ALL_SKILLS = [
					"Athletics",
					"Acrobatics",
					"Sleight Of Hand",
					"Stealth",
					"Arcana",
					"History",
					"Investigation",
					"Nature",
					"Religion",
					"Animal Handling",
					"Insight",
					"Medicine",
					"Perception",
					"Survival",
					"Deception",
					"Intimidation",
					"Performance",
					"Persuasion",
				];
				for (const skill of ALL_SKILLS) {
					modifiers.skills[skill] = (modifiers.skills[skill] || 0) + value;
				}
				modifiers.skills["*"] = (modifiers.skills["*"] || 0) + value;
			}
		}

		// Per-skill modifiers: "+2 to Investigation", "+1 to Sleight of Hand", "+2 in Investigation"
		// We store exact canonical skill name keys (title-cased) and consume them in CharacterSheet.
		const specificSkillMatch = lowerProp.match(
			/(\+?\d+)\s+(?:to|in)\s+([a-z][a-z\s']+)/i,
		);
		if (specificSkillMatch?.[1] && specificSkillMatch?.[2]) {
			const value = parseInt(specificSkillMatch[1] || "0", 10);
			const raw = specificSkillMatch[2].trim();

			// Guard: ignore cases we already handled above
			if (
				!raw.includes("saving") &&
				raw !== "attack" &&
				raw !== "damage" &&
				raw !== "skills" &&
				raw !== "skill"
			) {
				const canonical = raw
					.split(/\s+/)
					.map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
					.join(" ")
					.replaceAll("'S", "'s");

				if (!modifiers.skills) modifiers.skills = {};
				modifiers.skills[canonical] =
					(modifiers.skills[canonical] || 0) + value;
			}
		}
	});

	return modifiers;
}

/**
 * Combine multiple modifier objects
 */
function combineModifiers(
	...modifierSets: EquipmentModifiers[]
): EquipmentModifiers {
	const combined: EquipmentModifiers = {};

	modifierSets.forEach((mods) => {
		Object.entries(mods).forEach(([key, value]) => {
			if (key === "savingThrows" || key === "skills") {
				if (!combined[key]) combined[key] = {};
				Object.entries(value as Record<string, number>).forEach(
					([subKey, subValue]) => {
						(combined[key] as Record<string, number>)[subKey] =
							((combined[key] as Record<string, number>)[subKey] || 0) +
							subValue;
					},
				);
			} else if (typeof value === "number") {
				(
					combined as Record<
						string,
						number | Record<string, number> | undefined
					>
				)[key] =
					((combined as Record<string, number | undefined>)[key] || 0) + value;
			}
		});
	});

	return combined;
}

/**
 * Apply equipment modifiers to base stats
 */
export function applyEquipmentModifiers(
	baseAC: number,
	baseSpeed: number,
	baseAbilities: Record<string, number>,
	equipment: Array<{
		properties?: string[];
		is_equipped: boolean;
		is_attuned: boolean;
		requires_attunement: boolean;
	}>,
): {
	armorClass: number;
	speed: number;
	abilityModifiers: Record<string, number>;
	attackBonus: number;
	damageBonus: number;
	savingThrowBonuses: Record<string, number>;
	skillBonuses: Record<string, number>;
} {
	const equipped = equipment.filter(
		(e) => e.is_equipped && (!e.requires_attunement || e.is_attuned),
	);

	const allModifiers = combineModifiers(
		...equipped.map((e) => parseModifiers(e.properties || [])),
	);

	const dexMod = getAbilityModifier(baseAbilities.AGI ?? 10);
	const equippedArmor = equipped
		.map((e) => e.properties || [])
		.filter(
			(props) =>
				isArmorItem(props) && !props.some((p) => p.toLowerCase() === "shield"),
		);
	const equippedShield = equipped
		.map((e) => e.properties || [])
		.find((props) => props.some((p) => p.toLowerCase() === "shield"));

	let armorClass = baseAC;

	// If armor is equipped, compute 5e AC from its base + Dex (with cap by armor type).
	// Keep unarmored baseline (10 + Dex) when no armor is equipped.
	if (equippedArmor.length > 0) {
		// If multiple armor items are equipped, take the highest resulting AC.
		let best = Number.NEGATIVE_INFINITY;
		for (const props of equippedArmor) {
			const baseArmorAc = parseArmorBaseAc(props);
			if (baseArmorAc === null) continue;

			const armorType = props.find((p) => {
				const t = p.toLowerCase();
				return t === "light" || t === "medium" || t === "heavy";
			});
			const dexCap = getDexCapFromArmorType(armorType);
			const appliedDex = dexCap === null ? dexMod : Math.min(dexMod, dexCap);
			best = Math.max(best, baseArmorAc + appliedDex);
		}

		// If we couldn't parse any equipped armor into a base AC, fall back to legacy behavior.
		if (best !== Number.NEGATIVE_INFINITY) {
			armorClass = best;
		}
	}

	// Shields are additive (+2 AC via properties parsing). If the shield wasn't represented
	// by a parsed AC modifier for any reason, this still works via allModifiers.ac.
	if (equippedShield) {
		// Nothing needed here; shield AC is handled below via the legacy modifier path.
	}

	// Apply remaining AC modifiers (e.g., shield +2, magic +1 AC, etc.).
	// If parseModifiers found a flat AC setting (e.g. "AC 15"), treat it as a base override
	// ONLY when no armor was equipped (keeps 5e armor logic authoritative when armor is present).
	if (allModifiers.ac !== undefined) {
		if (equippedArmor.length === 0 && allModifiers.ac > 10) {
			armorClass = allModifiers.ac;
		} else if (allModifiers.ac <= 10) {
			armorClass = armorClass + (allModifiers.ac || 0);
		}
	}

	// Apply speed modifier
	const speed = baseSpeed + (allModifiers.speed || 0);

	// Apply ability modifiers
	const abilityModifiers: Record<string, number> = {};
	["str", "agi", "vit", "int", "sense", "pre"].forEach((ability) => {
		abilityModifiers[ability] =
			(allModifiers[ability as keyof EquipmentModifiers] as
				| number
				| undefined) || 0;
	});

	return {
		armorClass: Math.max(armorClass, 0),
		speed: Math.max(speed, 0),
		abilityModifiers,
		attackBonus: allModifiers.attack || 0,
		damageBonus: allModifiers.damage || 0,
		savingThrowBonuses: allModifiers.savingThrows || {},
		skillBonuses: allModifiers.skills || {},
	};
}
