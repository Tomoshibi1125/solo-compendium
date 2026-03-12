import { Shield, Star, Sword, Wand2, Zap } from "lucide-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { formatModifier } from "@/lib/characterCalculations";
import { type DiceRoll, formatRollResult, rollDiceString } from "@/lib/diceRoller";
import { cn } from "@/lib/utils";
import { formatMonarchVernacular } from "@/lib/vernacular";

interface ActionCardProps {
	name: string;
	type?: string;
	description: string;
	attackBonus?: number;
	damage?: string;
	range?: string;
	uses?: { current: number; max: number };
	recharge?: string;
	onRoll?: (rollType: "attack" | "damage" | "check") => void;
	inscriptionId?: string;
	onUse?: () => void;
	characterId?: string;
	campaignId?: string;
	className?: string;
}

const TYPE_ICONS: Record<string, unknown> = {
	action: Sword,
	"bonus-action": Zap,
	"bonus action": Zap,
	reaction: Shield,
	passive: Wand2,
	other: Star,
	special: Star,
};

const TYPE_LABELS: Record<string, string> = {
	action: "Action",
	"bonus-action": "Bonus Action",
	"bonus action": "Bonus Action",
	reaction: "Reaction",
	passive: "Passive",
	other: "Other",
	special: "Special",
};

function ActionCardComponent({
	name,
	type,
	description,
	attackBonus,
	damage,
	range,
	uses,
	recharge,
	onRoll,
	inscriptionId,
	onUse,
	characterId,
	campaignId,
	className,
}: ActionCardProps) {
	const navigate = useNavigate();
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const { usePlayerToolsEnhancements, useCharacterSheetEnhancements } =
		useGlobalDDBeyondIntegration();
	const { rollInCampaign } = usePlayerToolsEnhancements();
	const { _quickRoll } = useCharacterSheetEnhancements(characterId || "");

	const Icon = (type ? TYPE_ICONS[type] || Star : Star) as React.ComponentType<{ className?: string }>;
	const displayName = formatMonarchVernacular(name);
	const displayDescription = formatMonarchVernacular(description);
	const displayRange = range ? formatMonarchVernacular(range) : undefined;
	const displayRecharge = recharge
		? formatMonarchVernacular(recharge)
		: undefined;
	const displayDamage = damage ? formatMonarchVernacular(damage) : undefined;

	const formatFormula = (base: string, modifier?: number) => {
		if (!modifier) return base;
		return `${base}${modifier >= 0 ? "+" : ""}${modifier}`;
	};

	const handleRoll = (rollType: "attack" | "damage" | "check") => {
		if (onRoll) {
			onRoll(rollType);
			return;
		}

		try {
			let roll: DiceRoll | undefined;
			let message = "";
			let formula = "";

			if (rollType === "attack" && attackBonus !== undefined) {
				formula = formatFormula("1d20", attackBonus);
				roll = rollDiceString(formula);
				message = `${displayName} Attack: ${formatRollResult(roll)}`;
				if (roll.result === 20 + attackBonus) {
					message += " CRITICAL HIT!";
				} else if (roll.result === 1 + attackBonus) {
					message += " CRITICAL MISS!";
				}
			} else if (rollType === "damage" && damage) {
				// Parse damage string (e.g., "1d8+3" or "2d6")
				const sanitizedDamage = damage.replace(/\s+/g, "");
				const damageMatch = sanitizedDamage.match(/(\d+)d(\d+)([+-]\d+)?/);
				if (damageMatch) {
					formula = `${damageMatch[1]}d${damageMatch[2]}${damageMatch[3] || ""}`;
					roll = rollDiceString(formula);
					message = `${displayName} Damage: ${formatRollResult(roll)}`;
				} else {
					toast({
						title: "Invalid damage",
						description: "Could not parse damage string.",
						variant: "destructive",
					});
					return;
				}
			} else {
				// Navigate to dice roller for other cases
				const params = new URLSearchParams();
				if (rollType === "attack" && attackBonus !== undefined) {
					params.set("dice", "1d20");
					params.set("modifier", attackBonus.toString());
				}
				navigate(`/dice?${params.toString()}`);
				return;
			}

			toast({
				title: "Dice Roll",
				description: message,
			});

			if (roll && formula) {
				if (campaignId) {
					rollInCampaign(campaignId, {
						dice_formula: formula,
						result: roll.result,
						rolls: roll.rolls,
						roll_type: rollType === "attack" ? "attack" : "damage",
						context:
							rollType === "attack"
								? `${displayName} Attack`
								: `${displayName} Damage`,
						modifiers: roll.modifier ? { modifier: roll.modifier } : undefined,
						character_id: characterId,
					});
				}

				recordRoll.mutate({
					dice_formula: formula,
					result: roll.result,
					rolls: roll.rolls,
					roll_type: rollType === "attack" ? "attack" : "damage",
					context:
						rollType === "attack"
							? `${displayName} Attack`
							: `${displayName} Damage`,
					modifiers: roll.modifier ? { modifier: roll.modifier } : undefined,
					campaign_id: campaignId ?? null,
					character_id: characterId ?? null,
				});
			}
		} catch {
			toast({
				title: "Roll failed",
				description: "Could not execute roll.",
				variant: "destructive",
			});
		}
	};

	return (
		<SystemWindow
			title={displayName.toUpperCase()}
			className={cn("border-primary/30", className)}
		>
			<div className="space-y-3">
				<div className="flex items-center gap-2 flex-wrap">
					<Icon className="w-4 h-4 text-primary" />
					{type && (
						<Badge variant="secondary" className="text-xs">
							{TYPE_LABELS[type] || "Action"}
						</Badge>
					)}
					{displayRange && (
						<Badge variant="outline" className="text-xs">
							{displayRange}
						</Badge>
					)}
					{uses && (
						<Badge
							variant={uses.current > 0 ? "default" : "destructive"}
							className="text-xs"
						>
							Uses: {uses.current}/{uses.max}
						</Badge>
					)}
					{inscriptionId && uses && uses.current > 0 && onUse && (
						<Button
							variant="outline"
							size="sm"
							onClick={onUse}
							className="h-6 text-xs"
						>
							Use
						</Button>
					)}
					{displayRecharge && (
						<Badge variant="outline" className="text-xs">
							Recharge: {displayRecharge}
						</Badge>
					)}
				</div>

				<p className="text-sm text-muted-foreground">{displayDescription}</p>

				{(attackBonus !== undefined || damage || campaignId) && (
					<div className="flex gap-2 pt-2 border-t border-border/50 flex-wrap">
						{attackBonus !== undefined && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleRoll("attack")}
								className="flex-1 gap-2"
								aria-label={`Roll attack for ${displayName}`}
							>
								<Sword className="w-4 h-4" />
								Attack: {formatModifier(attackBonus)}
							</Button>
						)}
						{damage && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleRoll("damage")}
								className="flex-1 gap-2"
								aria-label={`Roll damage for ${displayName}`}
							>
								<Zap className="w-4 h-4" />
								Damage: {displayDamage || damage}
							</Button>
						)}
						{attackBonus === undefined && !damage && campaignId && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									toast({
										title: "Action Announced",
										description: `${displayName} announced to campaign log.`,
									});
									if (campaignId) {
										rollInCampaign(campaignId, {
											dice_formula: "none",
											result: 0,
											rolls: [],
											roll_type: "feature",
											context: `Uses Action: ${displayName}`,
											modifiers: undefined,
											character_id: characterId,
										});
									}
									recordRoll.mutate({
										dice_formula: "none",
										result: 0,
										rolls: [],
										roll_type: "feature",
										context: `Uses Action: ${displayName}`,
										modifiers: undefined,
										campaign_id: campaignId ?? null,
										character_id: characterId ?? null,
									});
								}}
								className="flex-1 gap-2 border-primary/20 hover:bg-primary/10"
								aria-label={`Announce ${displayName}`}
							>
								<Zap className="w-4 h-4 text-primary" />
								Announce
							</Button>
						)}
					</div>
				)}
			</div>
		</SystemWindow>
	);
}

export const ActionCard = memo(
	ActionCardComponent,
	(prevProps: ActionCardProps, nextProps: ActionCardProps) => {
		// Custom comparison - only re-render if props actually change
		return (
			prevProps.name === nextProps.name &&
			prevProps.type === nextProps.type &&
			prevProps.attackBonus === nextProps.attackBonus &&
			prevProps.damage === nextProps.damage &&
			prevProps.range === nextProps.range &&
			prevProps.uses?.current === nextProps.uses?.current &&
			prevProps.uses?.max === nextProps.uses?.max &&
			prevProps.recharge === nextProps.recharge &&
			prevProps.inscriptionId === nextProps.inscriptionId &&
			prevProps.characterId === nextProps.characterId &&
			prevProps.campaignId === nextProps.campaignId
		);
	},
);
