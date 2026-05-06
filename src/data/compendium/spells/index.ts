import type { CompendiumSpell } from "@/types/compendium";
import { spells_a } from "./rank-a";
import { spells_b } from "./rank-b";
import { spells_c } from "./rank-c";
import { spells_d } from "./rank-d";
import { spells_s } from "./rank-s";
import { spells_supplemental } from "./supplemental";

function normalizeSpellMechanics(spell: CompendiumSpell): CompendiumSpell {
	const rest = { ...spell };
	delete rest.atHigherLevels;
	const mechanics =
		spell.mechanics && typeof spell.mechanics === "object"
			? (spell.mechanics as Record<string, unknown>)
			: null;
	if (!mechanics) return rest;

	const nextMechanics: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(mechanics)) {
		if (key === "attack" && spell.attack) continue;
		if (key === "saving_throw" && spell.saving_throw) continue;
		if (
			["duration", "range", "type", "action", "ability", "save", "dc"].includes(
				key,
			)
		)
			continue;
		if (
			key === "save_dc" &&
			typeof spell.saving_throw?.dc === "number" &&
			Number(value) === spell.saving_throw.dc
		)
			continue;
		nextMechanics[key] = value;
	}

	return {
		...rest,
		mechanics: nextMechanics,
	};
}

export const spells: CompendiumSpell[] = [
	...spells_d,
	...spells_c,
	...spells_b,
	...spells_a,
	...spells_s,
	...spells_supplemental,
].map(normalizeSpellMechanics);
