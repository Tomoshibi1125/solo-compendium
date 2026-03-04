import { Dice1 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useAuth } from "@/lib/auth/authContext";
import type { AdvantageState } from "@/lib/rollAdvantage";

interface InlineRollButtonProps {
	characterId: string;
	characterName: string;
	rollType: "ability" | "save" | "skill";
	rollKey: string;
	label: string;
	modifier?: number;
	campaignId?: string;
	advantageState?: AdvantageState;
	disabled?: boolean;
	size?: "sm" | "lg" | "default" | "icon";
	variant?: "default" | "outline" | "ghost";
}

export function InlineRollButton({
	characterId,
	characterName,
	rollType,
	rollKey,
	label,
	modifier,
	campaignId,
	advantageState,
	disabled = false,
	size = "sm",
	variant = "outline",
}: InlineRollButtonProps) {
	const { user } = useAuth();
	const { useCharacterSheetEnhancements, usePlayerToolsEnhancements } =
		useGlobalDDBeyondIntegration();
	const { roll } = useCharacterSheetEnhancements(characterId);
	const { rollInCampaign } = usePlayerToolsEnhancements();

	const handleRoll = async () => {
		try {
			const resolvedModifier = Number.isFinite(modifier)
				? (modifier as number)
				: 0;
			const resolvedAdvantage: AdvantageState = advantageState ?? "normal";
			let result;

			if (campaignId) {
				// Send roll to campaign using the DDB parity hook
				result = await rollInCampaign(campaignId, {
					dice_formula: `1d20${resolvedModifier >= 0 ? `+${resolvedModifier}` : `${resolvedModifier}`}`,
					roll_type: rollType,
					context: label,
					modifiers: {
						base: resolvedModifier,
						advantage: resolvedAdvantage,
					},
					character_id: characterId,
				});
			} else {
				// Perform local roll using the DDB parity hook
				result = await roll(
					rollKey,
					resolvedModifier,
					rollType,
					label,
					campaignId,
					resolvedAdvantage,
				);
			}

			// The roll result will be displayed via toast from the hooks
			return result;
		} catch (error) {
			console.error("Roll error:", error);
		}
	};

	const getRollIcon = () => {
		return <Dice1 className="h-3 w-3" />;
	};

	const getModifierDisplay = () => {
		if (modifier === undefined || modifier === 0) return "";
		return modifier >= 0 ? `+${modifier}` : `${modifier}`;
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleRoll}
			disabled={disabled || !user}
			className="inline-flex items-center gap-1 hover:bg-primary/10 transition-colors"
		>
			{getRollIcon()}
			<span>{label}</span>
			{getModifierDisplay() && (
				<Badge variant="secondary" className="text-xs">
					{getModifierDisplay()}
				</Badge>
			)}
		</Button>
	);
}

// Convenience components for common roll types
export function AbilityRollButton(
	props: Omit<InlineRollButtonProps, "rollType">,
) {
	return <InlineRollButton {...props} rollType="ability" />;
}

export function SaveRollButton(props: Omit<InlineRollButtonProps, "rollType">) {
	return <InlineRollButton {...props} rollType="save" />;
}

export function SkillRollButton(
	props: Omit<InlineRollButtonProps, "rollType">,
) {
	return <InlineRollButton {...props} rollType="skill" />;
}
