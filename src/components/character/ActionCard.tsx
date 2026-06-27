import {
	type LucideIcon,
	Shield,
	Star,
	Sword,
	Swords,
	Wand2,
	Zap,
} from "lucide-react";
import { memo } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRecordRoll } from "@/hooks/useRollHistory";
import {
	type ActionResolutionPayload,
	resolveAttack,
	resolveDamage,
	resolveEffect,
	resolveSave,
} from "@/lib/actionResolution";
import { formatModifier } from "@/lib/characterCalculations";
import {
	type DiceRoll,
	formatRollResult,
	tryRollDiceString,
} from "@/lib/diceRoller";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import { InlineRollButton } from "./InlineRollButton";

interface ActionCardProps {
	name: string;
	type?: string;
	description: string;
	attackBonus?: number;
	damage?: string;
	damageType?: string;
	range?: string;
	formulaAbility?: string;
	formulaAbilityModifier?: number;
	attackRoll?: string;
	uses?: { current: number; max: number };
	recharge?: string;
	onRoll?: (
		rollType: "attack" | "damage" | "check" | "save" | "effect",
	) => void;

	onUse?: () => void;
	characterId?: string;
	campaignId?: string;
	className?: string;
	payload?: ActionResolutionPayload;
	onSelect?: () => void;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
	action: Sword,
	"bonus-action": Zap,
	"bonus action": Zap,
	reaction: Shield,
	passive: Wand2,
	other: Star,
	special: Star,
	weapon: Sword,
	spell: Wand2,
	power: Wand2,
	technique: Swords,
};

const TYPE_LABELS: Record<string, string> = {
	action: "Action",
	"bonus-action": "Bonus Action",
	"bonus action": "Bonus Action",
	reaction: "Reaction",
	passive: "Passive",
	other: "Other",
	special: "Special",
	weapon: "Weapon",
	spell: "Spell",
	power: "Power",
	technique: "Technique",
};

function ActionCardComponent({
	name,
	type,
	description,
	attackBonus,
	damage,
	damageType,
	range,
	formulaAbility,
	formulaAbilityModifier,
	attackRoll,
	uses,
	recharge,
	onRoll,
	onUse,
	characterId,
	campaignId,
	className,
	payload,
	onSelect,
}: ActionCardProps) {
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const ascendantTools = useAscendantTools();

	const Icon = type ? TYPE_ICONS[type] || Star : Star;
	const displayName = formatRegentVernacular(name);
	const displayRange = range ? formatRegentVernacular(range) : undefined;
	const displayRecharge = recharge
		? formatRegentVernacular(recharge)
		: undefined;
	const displayDamage = damage ? formatRegentVernacular(damage) : undefined;
	const displayDamageType = damageType
		? formatRegentVernacular(damageType)
		: undefined;
	const displayAbilityFormula =
		formulaAbility && formulaAbilityModifier !== undefined
			? `${formulaAbility} ${formatModifier(formulaAbilityModifier)}`
			: undefined;
	const displayAttackRoll =
		payload?.attack?.roll ??
		attackRoll ??
		(attackBonus !== undefined
			? `1d20${attackBonus >= 0 ? "+" : ""}${attackBonus}`
			: undefined);

	const handleRoll = (
		rollType: "attack" | "damage" | "check" | "save" | "effect",
	) => {
		if (onRoll) {
			onRoll(rollType);
			return;
		}

		try {
			let rollData: DiceRoll | undefined;
			let message = "";
			let formula = "";

			if (payload) {
				try {
					if (rollType === "attack" && payload.attack) {
						const outcome = resolveAttack(payload, 10);
						if (outcome.kind === "attack") {
							const attackVal = outcome.attackTotal;
							const critPrefix = outcome.criticalHit ? "💥 CRITICAL HIT! " : "";
							message = `${critPrefix}${displayName} Attack: ${attackVal} (vs AC 10)`;
							if (outcome.damageTotal) {
								message += ` | Damage: ${outcome.damageTotal}${
									outcome.criticalHit ? " (dice doubled)" : ""
								}`;
							}
							formula = payload.attack.roll;
						}
					} else if (rollType === "save" && payload.save) {
						const outcome = resolveSave(payload);
						if (outcome.kind === "save") {
							message = `${displayName} Save DC ${payload.save.dc}: ${outcome.success ? "Success" : "Failure"}`;
							if (outcome.damageTotal) {
								message += ` | Damage: ${outcome.damageTotal}`;
							}
							formula = `DC ${payload.save.dc}`;
						}
					} else if (rollType === "damage" && payload.damage) {
						const outcome = resolveDamage(payload);
						if (outcome.kind === "damage") {
							message = `${displayName} Damage: ${outcome.damageTotal}`;
							formula = payload.damage.roll;
						}
					} else if (rollType === "effect" || payload.kind === "effect") {
						const outcome = resolveEffect(payload);
						if (outcome.kind === "effect") {
							message = `${displayName} Activated: ${outcome.name}${outcome.description ? ` - ${outcome.description}` : ""}`;
							formula = "effect";
						}
					}
				} catch {
					// A payload value (e.g. a descriptive damage string) wasn't a
					// rollable formula. Degrade to a static summary rather than
					// surfacing a hard "Roll failed".
					const staticVal =
						payload.attack?.roll ??
						payload.damage?.roll ??
						(payload.save ? `DC ${payload.save.dc}` : undefined) ??
						"resolved";
					message = `${displayName} ${rollType}: ${staticVal}`;
					formula = String(staticVal);
				}

				if (message) {
					toast({
						title: "Action Resolved",
						description: message,
					});

					const rollPayload = {
						dice_formula: formula || "0",
						result: 0,
						rolls: [],
						roll_type:
							rollType === "attack"
								? "attack"
								: rollType === "damage"
									? "damage"
									: "check",
						context: `${displayName} (${rollType})`,
						character_id: characterId || undefined,
						campaign_id: campaignId || undefined,
					};

					if (campaignId) {
						ascendantTools.rollInCampaign(campaignId, rollPayload);
					}
					recordRoll.mutate(rollPayload);
				}
				return;
			}

			if (rollType === "attack" && attackBonus !== undefined) {
				formula = `1d20${attackBonus >= 0 ? "+" : ""}${attackBonus}`;
				rollData = tryRollDiceString(formula) ?? undefined;
				message = rollData
					? `${displayName} Attack: ${formatRollResult(rollData)}`
					: `${displayName} Attack: ${formula}`;
			} else if (rollType === "damage" && damage) {
				formula = damage;
				rollData = tryRollDiceString(formula) ?? undefined;
				message = rollData
					? `${displayName} Damage: ${formatRollResult(rollData)}`
					: `${displayName} Damage: ${displayDamage || damage}`;
			}

			if (message) {
				toast({ title: "Dice Roll", description: message });
				if (rollData) {
					const rollPayload = {
						dice_formula: formula,
						result: rollData.result,
						rolls: rollData.rolls,
						roll_type: rollType === "attack" ? "attack" : "damage",
						context: `${displayName} ${rollType}`,
						character_id: characterId || undefined,
						campaign_id: campaignId || undefined,
					};
					if (campaignId) {
						ascendantTools.rollInCampaign(campaignId, rollPayload);
					}
					recordRoll.mutate(rollPayload);
				}
			}
		} catch (error) {
			console.error("Roll failed:", error, { action: name, rollType });
			toast({
				title: "Roll failed",
				description: `Could not roll "${displayName}".`,
				variant: "destructive",
			});
		}
	};

	return (
		<AscendantWindow
			title={displayName.toUpperCase()}
			className={cn("border-primary/30", className)}
			headerClassName={
				onSelect ? "cursor-pointer hover:bg-primary/5 transition-colors" : ""
			}
			onHeaderClick={onSelect}
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
					{uses && uses.current > 0 && onUse && (
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
					{displayAbilityFormula && (
						<Badge variant="outline" className="text-xs">
							{displayAbilityFormula}
						</Badge>
					)}
				</div>

				<div className="text-sm text-muted-foreground">
					<AutoLinkText text={description} />
				</div>

				{(displayAttackRoll || payload?.save || displayDamage) && (
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono bg-muted/30 rounded-md px-3 py-1.5">
						{displayAttackRoll && (
							<span className="flex items-center gap-1">
								<span className="text-primary/70">ATK</span>
								<span className="font-semibold text-foreground">
									{displayAttackRoll}
								</span>
							</span>
						)}
						{payload?.save && (
							<span className="flex items-center gap-1">
								<span className="text-primary/70">DC</span>
								<span className="font-semibold text-foreground">
									{payload.save.dc}
								</span>
								{payload.save.ability && (
									<span className="text-muted-foreground">
										{payload.save.ability}
									</span>
								)}
							</span>
						)}
						{displayDamage && (
							<span className="flex items-center gap-1">
								<span className="text-primary/70">DMG</span>
								<span className="font-semibold text-foreground">
									{displayDamage}
								</span>
								{displayDamageType && (
									<span className="text-muted-foreground">
										{displayDamageType}
									</span>
								)}
							</span>
						)}
					</div>
				)}

				<div className="flex gap-2 pt-2 border-t border-border/50 flex-wrap">
					{(payload?.attack || attackBonus !== undefined) && (
						<div className="flex-1">
							<InlineRollButton
								characterId={characterId || ""}
								characterName={displayName}
								rollType="ability"
								rollKey="attack"
								label={
									displayAttackRoll
										? `Attack: ${displayAttackRoll}`
										: `Attack: ${formatModifier(attackBonus || 0)}`
								}
								modifier={attackBonus}
								campaignId={campaignId}
								className="w-full"
							/>
						</div>
					)}
					{payload?.save && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleRoll("save")}
							className="flex-1 gap-2"
						>
							<Shield className="w-4 h-4" />
							Save DC {payload.save.dc}
						</Button>
					)}
					{(payload?.damage || damage) && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleRoll("damage")}
							className="flex-1 gap-2"
						>
							<Zap className="w-4 h-4" />
							Damage: {displayDamage || damage || "Roll"}
						</Button>
					)}
					{payload?.kind === "effect" && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleRoll("effect")}
							className="flex-1 gap-2 border-primary/40 hover:bg-primary/10"
						>
							<Zap className="w-4 h-4 text-primary" />
							Activate
						</Button>
					)}
					{!payload && attackBonus === undefined && !damage && campaignId && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleRoll("check")}
							className="flex-1 gap-2 border-primary/20 hover:bg-primary/10"
						>
							<Star className="w-4 h-4 text-primary" />
							Announce
						</Button>
					)}
				</div>
			</div>
		</AscendantWindow>
	);
}

export const ActionCard = memo(
	ActionCardComponent,
	(prevProps: ActionCardProps, nextProps: ActionCardProps) => {
		return (
			prevProps.name === nextProps.name &&
			prevProps.type === nextProps.type &&
			prevProps.attackBonus === nextProps.attackBonus &&
			prevProps.damage === nextProps.damage &&
			prevProps.damageType === nextProps.damageType &&
			prevProps.range === nextProps.range &&
			prevProps.formulaAbility === nextProps.formulaAbility &&
			prevProps.formulaAbilityModifier === nextProps.formulaAbilityModifier &&
			prevProps.attackRoll === nextProps.attackRoll &&
			prevProps.uses?.current === nextProps.uses?.current &&
			prevProps.uses?.max === nextProps.uses?.max &&
			prevProps.recharge === nextProps.recharge &&
			prevProps.characterId === nextProps.characterId &&
			prevProps.campaignId === nextProps.campaignId &&
			prevProps.onSelect === nextProps.onSelect &&
			JSON.stringify(prevProps.payload) === JSON.stringify(nextProps.payload)
		);
	},
);
