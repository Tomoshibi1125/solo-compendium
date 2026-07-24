import { Dice1 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCharacterSheetEnhancements } from "@/hooks/useGlobalDDBeyondIntegration";
import { useAuth } from "@/lib/auth/authContext";
import { isLocalCharacterId } from "@/lib/guestStore";
import type { AdvantageState } from "@/lib/rollAdvantage";
import { cn } from "@/lib/utils";

interface InlineRollButtonProps {
	characterId: string;
	characterName: string;
	rollType: "ability" | "save" | "skill" | "attack";
	rollKey: string;
	label: string;
	modifier?: number;
	campaignId?: string;
	advantageState?: AdvantageState;
	disabled?: boolean;
	size?: "sm" | "lg" | "default" | "icon";
	variant?: "default" | "outline" | "ghost";
	className?: string;
	/** Fires after the roll executes — resource hooks (e.g. ammo spend). */
	onRolled?: () => void;
}

export function InlineRollButton({
	characterId,
	rollType,
	rollKey,
	label,
	modifier,
	campaignId,
	advantageState,
	disabled = false,
	size = "sm",
	variant = "outline",
	className,
	onRolled,
}: InlineRollButtonProps) {
	const { user } = useAuth();
	const { roll } = useCharacterSheetEnhancements(characterId);

	const handleRoll = async () => {
		try {
			const resolvedModifier = Number.isFinite(modifier)
				? (modifier as number)
				: 0;
			const resolvedAdvantage: AdvantageState = advantageState ?? "normal";

			// Perform roll using the DDB parity hook, which handles campaign broadcasting internally
			const result = await roll(
				rollKey,
				resolvedModifier,
				rollType,
				label,
				campaignId,
				resolvedAdvantage,
			);

			// The roll result will be displayed via toast from the hooks
			onRolled?.();
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

	// Guest-local characters roll entirely against the local store (rollCheck +
	// local roll history), so they don't need an authenticated user. The auth
	// gate only applies to cloud characters — e.g. a read-only share-link view.
	const canRoll = !!user || isLocalCharacterId(characterId);

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleRoll}
			disabled={disabled || !canRoll}
			className={cn(
				"inline-flex items-center gap-1 hover:bg-primary/10 transition-colors",
				className,
			)}
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
