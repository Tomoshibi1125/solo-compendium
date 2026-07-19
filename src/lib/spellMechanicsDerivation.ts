/**
 * Derive a structured combat-resolution block (attack / saving throw / healing)
 * from a castable's AUTHORED prose when its structured fields were left empty.
 *
 * Rift Ascendant spell descriptions are authored with explicit rules text, e.g.
 *   - "make a ranged spell attack using Sense to deal 1d10 cold damage"
 *   - "must succeed on a DC 14 Presence saving throw"
 *   - "the target regains 1d8 + your spellcasting modifier hit points"
 *
 * Many supplemental entries never had those rules promoted into structured
 * `attack` / `saving_throw` / `healing` fields, so the provider used to inject a
 * generic placeholder (a bogus `agility` save or a "no damage formula" utility
 * block). This module parses the real authored text instead, so the UI can
 * surface accurate mechanics and make the ability rollable.
 *
 * Pure and deterministic: no side effects, no randomness.
 */

import { DAMAGE_TYPES } from "@/lib/damageApplication";

const RA_ABILITIES = [
	"Strength",
	"Agility",
	"Vitality",
	"Intelligence",
	"Sense",
	"Presence",
] as const;

const abilityGroup = RA_ABILITIES.join("|");
const damageTypeGroup = DAMAGE_TYPES.join("|");

// "1d10 cold damage", "3d8 radiant damage", "2d6 + your modifier fire damage"
const DICE_DAMAGE_RE = new RegExp(
	`(\\d+d\\d+)(?:\\s*\\+\\s*[^.,;:]*?)?\\s+(${damageTypeGroup})\\s+damage`,
	"i",
);
// "DC 14 Presence saving throw", "DC 13 Vitality save"
const SAVE_RE = new RegExp(
	`DC\\s+(\\d+)\\s+(${abilityGroup})\\s+(?:saving\\s+throw|save)`,
	"i",
);
// "make a ranged spell attack", "a melee spell attack"
const SPELL_ATTACK_RE = /\b(ranged|melee)\s+spell\s+attack\b/i;
// "spell attack using Sense", "spell attack roll using your Presence"
const ATTACK_ABILITY_RE = new RegExp(
	`spell\\s+attack[^.]*?\\busing\\s+(?:your\\s+)?(${abilityGroup})`,
	"i",
);
// "regains 1d8 ... hit points", "heals 2d8 hit points", "4d6 temporary hit points"
const HEALING_RE =
	/\b(?:regains?|heals?|restores?|gains?)\b[^.]*?(\d+d\d+)[^.]*?(?:hit points|\bhp\b|temporary hit points|temp hp)/i;

export interface DerivableSpell {
	description?: string | null;
	effect?: string | null;
	type?: string | null;
	effects?: { primary?: string | null } | null;
}

export interface DerivedSpellAttack {
	type?: string;
	mode?: string;
	resolution?: string;
	modifier?: string;
	damage?: string;
	damage_type?: string;
}

export interface DerivedResolution {
	attack?: DerivedSpellAttack;
	saving_throw?: { ability: string; dc: number };
	healing?: { dice: string };
	damage_profile?: string;
}

const capitalize = (value: string): string =>
	value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/**
 * Parse a castable's authored text into structured resolution blocks.
 * Returns an empty object for genuinely non-mechanical (pure utility) entries.
 */
export function deriveSpellResolution(
	spell: DerivableSpell,
): DerivedResolution {
	const text = [spell.description, spell.effect, spell.effects?.primary]
		.filter((value): value is string => typeof value === "string")
		.join("\n");
	const result: DerivedResolution = {};
	if (!text) return result;

	const damageMatch = DICE_DAMAGE_RE.exec(text);
	const dice = damageMatch?.[1];
	const damageType = damageMatch?.[2]?.toLowerCase();

	const saveMatch = SAVE_RE.exec(text);
	const healMatch = HEALING_RE.exec(text);
	const attackMatch = SPELL_ATTACK_RE.exec(text);
	const abilityMatch = ATTACK_ABILITY_RE.exec(text);

	if (dice && damageType) {
		result.damage_profile = `${dice} ${damageType}`;
	}

	// An explicit "ranged/melee spell attack" with a damage roll -> attack block.
	if (attackMatch && dice) {
		const attack: DerivedSpellAttack = {
			type: damageType,
			mode: attackMatch[1].toLowerCase(),
			resolution: "spell_attack",
			damage: dice,
			damage_type: damageType,
		};
		if (abilityMatch) attack.modifier = capitalize(abilityMatch[1]);
		result.attack = attack;
	}

	if (saveMatch) {
		result.saving_throw = {
			ability: capitalize(saveMatch[2]),
			dc: Number.parseInt(saveMatch[1], 10),
		};
	}

	// Healing only when this is not an attack-roll spell (avoids "gains" false
	// positives on offensive spells). A save-gated heal is rare but allowed.
	if (healMatch && !result.attack) {
		result.healing = { dice: healMatch[1] };
	}

	return result;
}
