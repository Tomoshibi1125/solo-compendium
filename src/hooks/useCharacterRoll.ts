import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { rollCheck } from "@/lib/rollEngine";
import { getAbilityModifier as getAbilityModifierFromScore } from "@/types/core-rules";

interface CharacterRollProps {
	characterId: string;
	characterName: string;
	abilities: Record<string, number>;
	proficiencyBonus: number;
	savingThrowProficiencies: string[];
	skillProficiencies: string[];
}

export function useCharacterRoll({
	characterId,
	characterName,
	abilities,
	proficiencyBonus,
	savingThrowProficiencies,
	skillProficiencies,
}: CharacterRollProps) {
	const { toast } = useToast();

	const recordRoll = useRecordRoll();
	const { rollInCampaign } = useCampaignDice();

	const getAbilityModifier = useCallback(
		(ability: string): number => {
			const normalized = ability.toUpperCase();
			const score = abilities[ability] ?? abilities[normalized] ?? 10;
			return getAbilityModifierFromScore(score);
		},
		[abilities],
	);

	const getSaveModifier = useCallback(
		(ability: string): number => {
			const baseMod = getAbilityModifier(ability);
			const normalized = ability.toUpperCase();
			const isProficient = savingThrowProficiencies.some(
				(entry) => entry.toUpperCase() === normalized,
			);
			return baseMod + (isProficient ? proficiencyBonus : 0);
		},
		[getAbilityModifier, savingThrowProficiencies, proficiencyBonus],
	);

	const getSkillModifier = useCallback(
		(skill: string): number => {
			// Map skills to their abilities
			const skillAbilityMap: Record<string, string> = {
				athletics: "STR",
				acrobatics: "AGI",
				sleight_of_hand: "AGI",
				"sleight of hand": "AGI",
				stealth: "AGI",
				arcana: "INT",
				history: "INT",
				investigation: "INT",
				nature: "INT",
				religion: "INT",
				insight: "SENSE",
				medicine: "SENSE",
				perception: "SENSE",
				survival: "SENSE",
				deception: "PRE",
				intimidation: "PRE",
				performance: "PRE",
				persuasion: "PRE",
			};

			const normalizedSkill = skill.toLowerCase().replaceAll("_", " ");
			const ability = skillAbilityMap[normalizedSkill] || "STR";
			const baseMod = getAbilityModifier(ability);
			const isProficient = skillProficiencies.some(
				(entry) => entry.toLowerCase().replaceAll("_", " ") === normalizedSkill,
			);
			return baseMod + (isProficient ? proficiencyBonus : 0);
		},
		[getAbilityModifier, skillProficiencies, proficiencyBonus],
	);

	const roll = useCallback(
		(
			rollKey: string,
			modifier: number,
			kind: "ability" | "save" | "skill",
			label?: string,
			campaignId?: string,
			advantage?: "advantage" | "disadvantage" | "normal",
		) => {
			if (!rollKey || typeof rollKey !== "string") {
				toast({
					title: "Roll failed",
					description: "Invalid roll target",
					variant: "destructive",
				});
				return null;
			}

			if (!Number.isFinite(modifier)) {
				toast({
					title: "Roll failed",
					description: "Modifier unavailable",
					variant: "destructive",
				});
				return null;
			}

			const result = rollCheck(modifier, advantage);
			const d20 = result.rolls[0] ?? 0;
			const total = result.total;

			// Determine if it's a critical success/failure
			const isCritical = result.isNatural20;
			const isFumble = result.isNatural1;

			// Create roll description
			const rollDescription = label || rollKey;
			const rollType =
				kind === "ability"
					? "Ability Check"
					: kind === "save"
						? "Saving Throw"
						: "Skill Check";

			// Record the roll
			recordRoll.mutate({
				character_id: characterId,
				campaign_id: campaignId || null,
				dice_formula: `1d20+${modifier}`,
				result: total,
				roll_type: kind,
				rolls: result.droppedRolls
					? [d20, ...(result.droppedRolls || [])]
					: [d20],
				context: rollDescription,
				modifiers: {
					base: modifier,
					proficiency: proficiencyBonus,
					advantage: advantage ?? "normal",
					dropped: result.droppedRolls ?? null,
				},
			});

			if (campaignId) {
				rollInCampaign(campaignId, {
					dice_formula: `1d20+${modifier}`,
					result: total,
					roll_type: kind,
					rolls: result.droppedRolls
						? [d20, ...(result.droppedRolls || [])]
						: [d20],
					context: rollDescription,
					modifiers: {
						base: modifier,
						proficiency: proficiencyBonus,
						advantage: advantage ?? "normal",
						dropped: result.droppedRolls ?? null,
					},
					character_id: characterId,
				});
			}

			// Show toast notification
			toast({
				title: `${characterName} - ${rollType}`,
				description: `${rollDescription}: ${d20} + ${modifier} = ${total}${isCritical ? " (Critical!)" : isFumble ? " (Fumble!)" : ""}`,
				duration: 3000,
			});

			return { d20, modifier, total, isCritical, isFumble };
		},
		[
			characterId,
			characterName,
			proficiencyBonus,
			recordRoll,
			rollInCampaign,
			toast,
		],
	);

	// Convenience methods for common rolls
	const rollAbilityCheck = useCallback(
		(ability: string, campaignId?: string) => {
			const modifier = getAbilityModifier(ability);
			return roll(ability, modifier, "ability", undefined, campaignId);
		},
		[roll, getAbilityModifier],
	);

	const rollSavingThrow = useCallback(
		(ability: string, campaignId?: string) => {
			const modifier = getSaveModifier(ability);
			return roll(`${ability} Save`, modifier, "save", undefined, campaignId);
		},
		[roll, getSaveModifier],
	);

	const rollSkillCheck = useCallback(
		(skill: string, campaignId?: string) => {
			const modifier = getSkillModifier(skill);
			return roll(skill, modifier, "skill", undefined, campaignId);
		},
		[roll, getSkillModifier],
	);

	return {
		roll,
		rollAbilityCheck,
		rollSavingThrow,
		rollSkillCheck,
		getAbilityModifier,
		getSaveModifier,
		getSkillModifier,
	};
}
