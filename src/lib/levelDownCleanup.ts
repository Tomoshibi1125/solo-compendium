import { supabase } from "@/integrations/supabase/client";
import {
	isLocalCharacterId,
	listLocalFeatures,
	listLocalPowers,
	listLocalSpells,
	listLocalTechniques,
	removeLocalFeature,
	removeLocalPower,
	removeLocalSpell,
	removeLocalTechnique,
} from "@/lib/guestStore";

export const parseLevelGrantSource = (
	source?: string | null,
): number | null => {
	const match = (source ?? "").match(/^Level\s+(\d+)\b/i);
	if (!match?.[1]) return null;
	const level = Number.parseInt(match[1], 10);
	return Number.isFinite(level) ? level : null;
};

export const wasGrantedAboveLevel = (
	source: string | null | undefined,
	targetLevel: number,
): boolean => {
	const level = parseLevelGrantSource(source);
	return typeof level === "number" && level > targetLevel;
};

export async function removeProgressionGrantsAboveLevel(
	characterId: string,
	currentLevel: number,
	targetLevel: number,
): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		for (const feature of listLocalFeatures(characterId)) {
			if ((feature.level_acquired ?? 1) > targetLevel) {
				removeLocalFeature(feature.id);
			}
		}
		for (const power of listLocalPowers(characterId)) {
			if (wasGrantedAboveLevel(power.source, targetLevel)) {
				removeLocalPower(power.id);
			}
		}
		for (const spell of listLocalSpells(characterId)) {
			if (wasGrantedAboveLevel(spell.source, targetLevel)) {
				removeLocalSpell(spell.id);
			}
		}
		for (const technique of listLocalTechniques(characterId)) {
			if (wasGrantedAboveLevel(technique.source, targetLevel)) {
				removeLocalTechnique(technique.id);
			}
		}
		return;
	}

	await supabase
		.from("character_features")
		.delete()
		.eq("character_id", characterId)
		.gt("level_acquired", targetLevel);

	await supabase
		.from("character_feature_choices")
		.delete()
		.eq("character_id", characterId)
		.gt("level_chosen", targetLevel);

	for (let lvl = targetLevel + 1; lvl <= currentLevel; lvl += 1) {
		const levelPattern = `Level ${lvl}%`;
		await supabase
			.from("character_powers")
			.delete()
			.eq("character_id", characterId)
			.like("source", levelPattern);
		await supabase
			.from("character_spells")
			.delete()
			.eq("character_id", characterId)
			.like("source", levelPattern);
		await supabase
			.from("character_techniques")
			.delete()
			.eq("character_id", characterId)
			.like("source", levelPattern);
	}
}
