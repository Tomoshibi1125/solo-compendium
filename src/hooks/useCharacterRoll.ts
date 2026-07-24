import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { rollCheck } from "@/lib/rollEngine";

interface CharacterRollProps {
	characterId: string;
	characterName: string;
	proficiencyBonus: number;
}

/**
 * The live inline-roll path. `roll` takes an already-resolved modifier (the
 * caller passes the derived-stats value), so this hook never recomputes
 * ability/skill modifiers itself — that avoids a second, drift-prone modifier
 * stack. Convenience wrappers that recomputed modifiers here were removed for
 * that reason; if a call site needs them, derive from `useCharacterDerivedStats`
 * and pass the result to `roll`.
 */
export function useCharacterRoll({
	characterId,
	characterName,
	proficiencyBonus,
}: CharacterRollProps) {
	const { toast } = useToast();

	const recordRoll = useRecordRoll();
	const { rollInCampaign } = useCampaignDice();

	const roll = useCallback(
		(
			rollKey: string,
			modifier: number,
			kind: "ability" | "save" | "skill" | "attack",
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
						: kind === "attack"
							? "Attack Roll"
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
					character_name: characterName,
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

	return { roll };
}
