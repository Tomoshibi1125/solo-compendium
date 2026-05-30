import type { CompendiumSpell } from "@/types/compendium";
import { spells_archetype } from "./archetype";
import { spells_d } from "./rank-d";
import { spells_supplemental } from "./supplemental";

function normalizeSpellMechanics(spell: CompendiumSpell): CompendiumSpell {
	const rest = { ...spell };
	delete rest.atHigherLevels;
	const mechanics =
		spell.mechanics && typeof spell.mechanics === "object"
			? (spell.mechanics as Record<string, unknown>)
			: null;
	if (!mechanics) return rest;

	// Promote any mechanics-only attack/saving_throw to the canonical top-level
	// fields (preserving data), then strip every mirrored key so the mechanics
	// block never duplicates top-level spell metadata.
	if (!rest.attack && mechanics.attack) {
		rest.attack = mechanics.attack as CompendiumSpell["attack"];
	}
	if (!rest.saving_throw && mechanics.saving_throw) {
		rest.saving_throw =
			mechanics.saving_throw as CompendiumSpell["saving_throw"];
	}
	const MIRRORED_KEYS = new Set([
		"attack",
		"saving_throw",
		"save_dc",
		"duration",
		"range",
		"type",
		"action",
		"ability",
		"save",
		"dc",
	]);
	const nextMechanics: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(mechanics)) {
		if (MIRRORED_KEYS.has(key)) continue;
		nextMechanics[key] = value;
	}

	return {
		...rest,
		mechanics: nextMechanics,
	};
}

export const spells: CompendiumSpell[] = [
	...spells_d,
	...spells_supplemental,
	...spells_archetype,
].map(normalizeSpellMechanics);
