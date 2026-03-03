import { Minus, Plus, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useSpellSlots, useUpdateSpellSlot } from "@/hooks/useSpellSlots";
import {
	getCasterType,
	getSpellcastingAbility,
} from "@/lib/characterCalculations";
import { logger } from "@/lib/logger";
import { getAbilityModifier, getProficiencyBonus } from "@/types/system-rules";

interface SpellSlotsDisplayProps {
	characterId: string;
	job: string | null;
	level: number;
	abilities?: Record<string, number>;
	className?: string;
}

export function SpellSlotsDisplay({
	characterId,
	job,
	level,
	abilities,
	className,
}: SpellSlotsDisplayProps) {
	const { data: slots = [], isLoading } = useSpellSlots(
		characterId,
		job,
		level,
	);
	const updateSlot = useUpdateSpellSlot();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	const casterType = getCasterType(job);
	const castingAbility = getSpellcastingAbility(job);
	const profBonus = getProficiencyBonus(level);
	const castingAbilityScore =
		castingAbility && abilities ? (abilities[castingAbility] ?? 10) : 10;
	const castingMod = getAbilityModifier(castingAbilityScore);
	const spellSaveDC = 8 + profBonus + castingMod;
	const spellAttackBonus = profBonus + castingMod;

	if (isLoading) {
		return (
			<SystemWindow title="POWER SLOTS" className={className}>
				<div className="text-sm text-muted-foreground">Loading...</div>
			</SystemWindow>
		);
	}

	if (slots.length === 0) {
		return null; // Don't show if no spell slots
	}

	const handleSlotChange = async (spellLevel: number, delta: number) => {
		const slot = slots.find((s) => s.level === spellLevel);
		if (!slot) return;

		const newCurrent = Math.max(0, Math.min(slot.max, slot.current + delta));

		try {
			await updateSlot.mutateAsync({
				characterId,
				spellLevel,
				current: newCurrent,
			});

			if (delta < 0) {
				playerTools
					.trackCustomFeatureUsage(
						characterId,
						`Tier ${spellLevel} Spell Slot`,
						"cast",
						"5e",
					)
					.catch(console.error);
			}
		} catch (error) {
			logger.error("Failed to update spell slot:", error);
		}
	};

	return (
		<SystemWindow title="POWER SLOTS" className={className}>
			<div className="space-y-3">
				{slots.map((slot) => (
					<div
						key={slot.level}
						className="flex items-center justify-between p-2 rounded border border-border bg-muted/20"
					>
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="font-arise">
								Tier {slot.level}
							</Badge>
							<span className="text-sm text-muted-foreground">
								{slot.current} / {slot.max}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSlotChange(slot.level, -1)}
								disabled={slot.current === 0}
								className="h-8 text-xs gap-1.5 border-primary/20 hover:bg-primary/10 hidden sm:flex"
							>
								<Zap className="w-3.5 h-3.5 text-primary" />
								Spend
							</Button>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => handleSlotChange(slot.level, -1)}
									disabled={slot.current === 0}
									aria-label={`Decrease tier ${slot.level} slots`}
									data-testid={`spell-slot-decrease-tier-${slot.level}`}
								>
									<Minus className="w-3 h-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => handleSlotChange(slot.level, 1)}
									disabled={slot.current >= slot.max}
									aria-label={`Increase tier ${slot.level} slots`}
									data-testid={`spell-slot-increase-tier-${slot.level}`}
								>
									<Plus className="w-3 h-3" />
								</Button>
							</div>
						</div>
					</div>
				))}
				{castingAbility && (
					<div className="grid grid-cols-3 gap-2 p-2 rounded border border-primary/20 bg-primary/5">
						<div className="text-center">
							<div className="text-[10px] text-muted-foreground uppercase">
								Ability
							</div>
							<div className="text-sm font-heading font-bold">
								{castingAbility}
							</div>
						</div>
						<div className="text-center">
							<div className="text-[10px] text-muted-foreground uppercase">
								Save DC
							</div>
							<div className="text-sm font-heading font-bold">
								{spellSaveDC}
							</div>
						</div>
						<div className="text-center">
							<div className="text-[10px] text-muted-foreground uppercase">
								Attack
							</div>
							<div className="text-sm font-heading font-bold">
								{spellAttackBonus >= 0 ? "+" : ""}
								{spellAttackBonus}
							</div>
						</div>
					</div>
				)}
				{slots.length > 0 && (
					<div className="text-xs text-muted-foreground pt-2 border-t border-border">
						{casterType === "pact"
							? "Pact slots recover on short rest."
							: "Slots recover on long rest. Some classes recover slots on short rest."}
					</div>
				)}
			</div>
		</SystemWindow>
	);
}
