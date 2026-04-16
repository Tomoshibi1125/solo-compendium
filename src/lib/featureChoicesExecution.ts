import type { FeatureModifier } from "@/hooks/useCharacterFeatures";
import type { AscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { supabase } from "@/integrations/supabase/client";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import type { Database, Json } from "@/integrations/supabase/types";
import type { AbilityScore } from "@/types/core-rules";

export function normalizeGrants(grants: Json): Array<Record<string, Json>> {
	if (!grants) return [];
	if (Array.isArray(grants)) return grants as Array<Record<string, Json>>;
	return [];
}

export function extractGrantedPowerNames(grants: Json): string[] {
	const normalized = normalizeGrants(grants);
	const names: string[] = [];
	for (const grant of normalized) {
		if (grant && typeof grant === "object" && !Array.isArray(grant)) {
			const g = grant as Record<string, Json>;
			if (g.type === "power" && typeof g.name === "string") {
				names.push(g.name);
			}
		}
	}
	return names;
}

function isAbilityScore(
	value: string | null | undefined | Json,
): value is AbilityScore {
	if (typeof value !== "string") return false;
	return (
		value === "STR" ||
		value === "AGI" ||
		value === "VIT" ||
		value === "INT" ||
		value === "SENSE" ||
		value === "PRE"
	);
}

export type ChoiceOptionExecutionPayload = {
	characterId: string;
	groupId: string;
	featureId: string;
	option: Database["public"]["Tables"]["compendium_feature_choice_options"]["Row"];
	levelChosen: number;
	choiceKey: string;
};

export async function executeFeatureChoiceGrants({
	payloads,
	ascendantTools,
}: {
	payloads: ChoiceOptionExecutionPayload[];
	ascendantTools?: AscendantTools;
}) {
	if (payloads.length === 0) return;
	const characterId = payloads[0].characterId;

	const { data: characterRow } = await supabase
		.from("characters")
		.select("skill_proficiencies, skill_expertise, tool_proficiencies")
		.eq("id", characterId)
		.maybeSingle();

	const charTyped = characterRow as CharacterExtended | null;
	const skillProficiencies = new Set<string>(
		Array.isArray(charTyped?.skill_proficiencies)
			? (charTyped?.skill_proficiencies as string[]) || []
			: [],
	);
	const skillExpertise = new Set<string>(
		Array.isArray(charTyped?.skill_expertise)
			? (charTyped?.skill_expertise as string[]) || []
			: [],
	);
	const toolProficiencies = new Set<string>(
		Array.isArray(charTyped?.tool_proficiencies)
			? (charTyped?.tool_proficiencies as string[]) || []
			: [],
	);

	const { data: existingFeatures } = await supabase
		.from("character_features")
		.select("name")
		.eq("character_id", characterId);
	const existingFeatureNames = new Set(
		(existingFeatures || []).map((row: { name: string }) => row.name),
	);

	const { data: existingPowers } = await supabase
		.from("character_powers")
		.select("name")
		.eq("character_id", characterId);
	const existingPowerNames = new Set(
		(existingPowers || []).map((row) => row.name),
	);

	const { data: existingEquipment } = await supabase
		.from("character_equipment")
		.select("name")
		.eq("character_id", characterId);
	const existingEquipmentNames = new Set(
		(existingEquipment || []).map((row: { name: string }) => row.name),
	);

	const { data: existingAbilities } = await supabase
		.from("character_abilities")
		.select("ability, score")
		.eq("character_id", characterId);
	const abilityScoreByKey = new Map<AbilityScore, number>();
	for (const row of (existingAbilities || []) as Array<{
		ability: AbilityScore;
		score: number;
	}>) {
		if (isAbilityScore(row.ability)) {
			abilityScoreByKey.set(row.ability, row.score);
		}
	}

	for (const payload of payloads) {
		const { groupId, option, levelChosen, choiceKey } = payload;
		if (!option) continue;

		if (ascendantTools) {
			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`Bound Option: ${option.name}`,
					option.description || "",
					"SA",
				)
				.catch(console.error);
		}

		await supabase.from("character_feature_choices").upsert(
			{
				character_id: characterId,
				feature_id: payload.featureId,
				group_id: groupId,
				option_id: option.id,
				level_chosen: levelChosen,
			},
			{ onConflict: "character_id,group_id" },
		);

		const grants = normalizeGrants(option.grants);
		for (const grant of grants) {
			if (grant.type === "feature" && typeof grant.name === "string") {
				if (existingFeatureNames.has(grant.name)) continue;
				await supabase.from("character_features").insert({
					character_id: characterId,
					name: grant.name,
					source: `Choice: ${choiceKey}`,
					level_acquired: levelChosen,
					description:
						typeof grant.description === "string" ? grant.description : null,
					action_type:
						typeof grant.action_type === "string" ? grant.action_type : null,
					is_active: true,
				});

				existingFeatureNames.add(grant.name);
			}

			if (grant.type === "feat" && typeof grant.name === "string") {
				if (existingFeatureNames.has(grant.name)) continue;
				const featName = grant.name;
				const { data: featRow } = await supabase
					.from("compendium_feats")
					.select("name, description, benefits")
					.eq("name", featName)
					.maybeSingle();

				const featDescription =
					typeof grant.description === "string"
						? grant.description
						: featRow?.description || null;

				const benefits = Array.isArray(featRow?.benefits)
					? (featRow?.benefits as string[])
					: [];
				const benefitsText =
					benefits.length > 0 ? benefits.map((b) => `- ${b}`).join("\n") : "";
				const fullDescription = featDescription
					? benefitsText
						? `${featDescription}\n\n${benefitsText}`
						: featDescription
					: benefitsText || null;

				const buildFeatModifiers = (
					benefitLines: string[],
				): FeatureModifier[] => {
					const mods: FeatureModifier[] = [];

					const push = (
						type: FeatureModifier["type"],
						value: number,
						target: string | null,
						source: string,
					) => {
						mods.push({ type, value, target: target ?? undefined, source });
					};

					for (const raw of benefitLines) {
						const text = String(raw || "").trim();
						if (!text) continue;
						const lower = text.toLowerCase();

						// Ability increases: "Increase STR or AGI by 1", "Increase any ability score by 2"
						const incAny = lower.match(
							/increase\s+(?:any\s+)?ability\s+score\s+by\s+(\d+)/i,
						);
						if (incAny?.[1]) {
							continue;
						}

						const incSpecific = lower.match(
							/increase\s+(str|strength|agi|dex|agility|vitality|vit|con|vitality|int|intelligence|sense|wis|sense|pre|presence|cha|presence)\s+by\s+(\d+)/i,
						);
						if (incSpecific?.[1] && incSpecific?.[2]) {
							const amount = parseInt(incSpecific[2], 10);
							const keyRaw = incSpecific[1];
							const toAbility: Record<string, AbilityScore> = {
								str: "STR",
								strength: "STR",
								agi: "AGI",
								dex: "AGI",
								agility: "AGI",
								vit: "VIT",
								con: "VIT",
								vitality: "VIT",
								int: "INT",
								intelligence: "INT",
								sense: "SENSE",
								wis: "SENSE",
								pre: "PRE",
								presence: "PRE",
								cha: "PRE",
							};
							const ability = toAbility[keyRaw];
							if (ability && Number.isFinite(amount) && amount !== 0) {
								push("ability", amount, ability, featName);
								continue;
							}
						}

						// Flat numeric bonuses
						const speed = lower.match(
							/speed\s+(?:increases|increase|bonus)\s+by\s+(\d+)\s*(?:ft|feet)?/i,
						);
						if (speed?.[1]) {
							push("speed", parseInt(speed[1], 10), null, featName);
							continue;
						}

						const ac = lower.match(/\+\s*(\d+)\s*(?:bonus\s+)?to\s+ac/i);
						if (ac?.[1]) {
							push("ac", parseInt(ac[1], 10), null, featName);
							continue;
						}

						const initiative = lower.match(
							/\+\s*(\d+)\s*(?:bonus\s+)?to\s+initiative/i,
						);
						if (initiative?.[1]) {
							push("initiative", parseInt(initiative[1], 10), null, featName);
							continue;
						}

						const hpFlat = lower.match(
							/(?:max\s+)?hp\s+maximum\s+increases\s+by\s+(\d+)/i,
						);
						if (hpFlat?.[1]) {
							push("hp-max", parseInt(hpFlat[1], 10), null, featName);
							continue;
						}

						const saveBonus = lower.match(
							/\+\s*(\d+)\s+to\s+([a-z]+)\s+saving\s+throws?/i,
						);
						if (saveBonus?.[1] && saveBonus?.[2]) {
							const amount = parseInt(saveBonus[1], 10);
							const key = saveBonus[2].trim();
							const toAbility: Record<string, AbilityScore> = {
								str: "STR",
								strength: "STR",
								agi: "AGI",
								dex: "AGI",
								agility: "AGI",
								vit: "VIT",
								con: "VIT",
								vitality: "VIT",
								int: "INT",
								intelligence: "INT",
								sense: "SENSE",
								wis: "SENSE",
								pre: "PRE",
								cha: "PRE",
								presence: "PRE",
							};
							const ability = toAbility[key];
							if (ability) {
								push("save", amount, ability, featName);
								continue;
							}
						}

						const skillBonus = lower.match(
							/\+\s*(\d+)\s+to\s+([a-z][a-z\s']+)/i,
						);
						if (skillBonus?.[1] && skillBonus?.[2]) {
							const amount = parseInt(skillBonus[1], 10);
							const rawSkill = skillBonus[2].trim();
							if (
								!rawSkill.includes("saving") &&
								rawSkill !== "ac" &&
								rawSkill !== "initiative"
							) {
								const canonical = rawSkill
									.split(/\s+/)
									.map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
									.join(" ")
									.replaceAll("'S", "'s");
								push("skill", amount, canonical, featName);
								continue;
							}
						}

						if (lower.includes("advantage on initiative")) {
							push("advantage", 0, "initiative", featName);
							continue;
						}

						const advSave = lower.match(
							/advantage\s+on\s+saves?\s+against\s+([a-z\s]+)/i,
						);
						if (advSave?.[1]) {
							const key = advSave[1].trim();
							if (key.length > 0) {
								push("advantage", 0, `save:${key}`, featName);
							}
						}
					}

					return mods;
				};

				const featModifiers = buildFeatModifiers(benefits);

				await supabase.from("character_features").insert({
					character_id: characterId,
					name: featName,
					source: `Feat (Choice: ${choiceKey})`,
					level_acquired: levelChosen,
					description: fullDescription,
					action_type: null,
					is_active: true,
					modifiers: featModifiers.length > 0 ? (featModifiers as Json) : null,
				});

				existingFeatureNames.add(featName);
			}

			if (grant.type === "ability_increase") {
				const ability = grant.ability ?? null;
				const amount = grant.amount ?? null;

				if (!isAbilityScore(ability)) continue;
				const numeric = typeof amount === "number" ? amount : Number(amount);
				if (!Number.isFinite(numeric) || numeric === 0) continue;

				const current = abilityScoreByKey.get(ability) ?? 10;
				const nextScore = Math.min(20, current + numeric);

				await supabase
					.from("character_abilities")
					.update({ score: nextScore })
					.eq("character_id", characterId)
					.eq("ability", ability);

				abilityScoreByKey.set(ability, nextScore);
			}

			if (grant.type === "tool_proficiency" && typeof grant.name === "string") {
				const toolName = grant.name;
				if (toolProficiencies.has(toolName)) continue;

				const next = [...toolProficiencies, toolName].sort();
				await supabase
					.from("characters")
					.update({ tool_proficiencies: next })
					.eq("id", characterId);
				toolProficiencies.add(toolName);
			}

			if (grant.type === "technique" && typeof grant.name === "string") {
				const techName = grant.name;
				const { data: techRow } = await supabase
					.from("compendium_techniques")
					.select("id")
					.eq("name", techName)
					.maybeSingle();
				const techId = techRow?.id;
				if (!techId) continue;

				await supabase.from("character_techniques").upsert(
					{
						character_id: characterId,
						technique_id: techId,
						source: `Choice: ${choiceKey}`,
					},
					{ onConflict: "character_id,technique_id" },
				);
			}

			if (
				grant.type === "skill_proficiency" &&
				typeof grant.name === "string"
			) {
				const skillName = grant.name;
				if (skillProficiencies.has(skillName)) continue;

				const next = [...skillProficiencies, skillName].sort();
				await supabase
					.from("characters")
					.update({ skill_proficiencies: next })
					.eq("id", characterId);
				skillProficiencies.add(skillName);
			}

			if (grant.type === "skill_expertise" && typeof grant.name === "string") {
				const skillName = grant.name;
				if (skillExpertise.has(skillName)) continue;

				const next = [...skillExpertise, skillName].sort();
				await supabase
					.from("characters")
					.update({ skill_expertise: next })
					.eq("id", characterId);
				skillExpertise.add(skillName);
			}

			if (grant.type === "power" && typeof grant.name === "string") {
				const powerName = grant.name;
				if (existingPowerNames.has(powerName)) continue;

				const { data: powerRow } = await supabase
					.from("compendium_powers")
					.select(
						"name, power_level, casting_time, range, duration, concentration, description, higher_levels",
					)
					.eq("name", powerName)
					.maybeSingle();

				if (!powerRow?.name) continue;

				await supabase.from("character_powers").insert({
					character_id: characterId,
					name: powerRow.name,
					power_level: powerRow.power_level ?? 0,
					source: `Choice: ${choiceKey}`,
					casting_time: powerRow.casting_time ?? null,
					range: powerRow.range ?? null,
					duration: powerRow.duration ?? null,
					concentration: powerRow.concentration ?? false,
					is_prepared: true,
					is_known: true,
					description: powerRow.description ?? null,
					higher_levels: powerRow.higher_levels ?? null,
				});

				existingPowerNames.add(powerName);
			}

			if (grant.type === "equipment" && typeof grant.name === "string") {
				const itemName = grant.name;
				if (existingEquipmentNames.has(itemName)) continue;

				const { data: equipRow } = await supabase
					.from("compendium_equipment")
					.select(
						"name, equipment_type, description, properties, weight, cost_credits, armor_class, damage, damage_type",
					)
					.eq("name", itemName)
					.maybeSingle();

				if (equipRow?.name) {
					await supabase.from("character_equipment").insert({
						character_id: characterId,
						name: equipRow.name,
						item_type: (equipRow.equipment_type as never) || "gear",
						quantity: 1,
						description: equipRow.description ?? null,
						properties: (equipRow.properties as never) ?? null,
						weight: (equipRow.weight as never) ?? null,
						value_credits: (equipRow.cost_credits as never) ?? null,
					});
					existingEquipmentNames.add(itemName);
					continue;
				}

				const { data: relicRow } = await supabase
					.from("compendium_relics")
					.select(
						"name, description, rarity, relic_tier, properties, value_credits, requires_attunement",
					)
					.eq("name", itemName)
					.maybeSingle();
				if (!relicRow?.name) continue;

				await supabase.from("character_equipment").insert({
					character_id: characterId,
					name: relicRow.name,
					item_type: "relic",
					rarity: relicRow.rarity as never,
					relic_tier: relicRow.relic_tier as never,
					requires_attunement: relicRow.requires_attunement ?? false,
					is_attuned: false,
					quantity: 1,
					description: relicRow.description ?? null,
					properties: (relicRow.properties as never) ?? null,
					value_credits: (relicRow.value_credits as never) ?? null,
				});

				existingEquipmentNames.add(itemName);
			}

			if (grant.type === "rune" && typeof grant.name === "string") {
				const { data: runeRow } = await supabase
					.from("compendium_runes")
					.select("id")
					.eq("name", grant.name)
					.maybeSingle();
				if (!runeRow?.id) continue;

				await supabase.from("character_rune_knowledge").upsert(
					{
						character_id: characterId,
						rune_id: runeRow.id,
						learned_from: "feature_choice",
						mastery_level: 1,
						can_teach: false,
					} as never,
					{ onConflict: "character_id,rune_id" },
				);
			}
		}
	}
}
