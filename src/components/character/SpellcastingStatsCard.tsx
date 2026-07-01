import { Sparkles, Sword, Wand2 } from "lucide-react";
import { useMemo } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { useCharacter } from "@/hooks/useCharacters";
import { useCombatActions } from "@/hooks/useCombatActions";
import {
	formatModifier,
	getAbilityModifier,
	getProficiencyBonus,
	getSpellcastingAbility,
} from "@/lib/characterCalculations";
import { resolvePowerActionFormula } from "@/lib/powerActionFormulas";
import { cn } from "@/lib/utils";
import type { AbilityScore } from "@/types/core-rules";

export type SpellcastingStatsScope = "spells" | "powers" | "techniques";

interface SpellcastingStatsCardProps {
	characterId: string;
	scope: SpellcastingStatsScope;
	className?: string;
}

const SCOPE_META: Record<
	SpellcastingStatsScope,
	{ title: string; icon: typeof Wand2; resolution: string }
> = {
	spells: {
		title: "SPELLCASTING",
		icon: Sparkles,
		resolution: "Spell",
	},
	powers: {
		title: "POWER MATRIX",
		icon: Wand2,
		resolution: "Power",
	},
	techniques: {
		title: "TECHNIQUE PROTOCOL",
		icon: Sword,
		resolution: "Technique",
	},
};

export function SpellcastingStatsCard({
	characterId,
	scope,
	className,
}: SpellcastingStatsCardProps) {
	const { data: character } = useCharacter(characterId);
	const { actions } = useCombatActions(characterId);

	const stats = useMemo(() => {
		if (!character) return null;
		const profBonus = getProficiencyBonus(character.level || 1);

		if (scope === "techniques") {
			const strScore = character.abilities?.STR ?? 10;
			const agiScore = character.abilities?.AGI ?? 10;
			const strMod = getAbilityModifier(strScore);
			const agiMod = getAbilityModifier(agiScore);
			const ability: AbilityScore = agiMod > strMod ? "AGI" : "STR";
			const abilityModifier = Math.max(strMod, agiMod);
			return {
				ability,
				abilityModifier,
				attackBonus: abilityModifier + profBonus,
				saveDC: 8 + abilityModifier + profBonus,
			};
		}

		const formula = resolvePowerActionFormula({
			job: character.job,
			abilities: character.abilities ?? {
				STR: 10,
				AGI: 10,
				VIT: 10,
				INT: 10,
				SENSE: 10,
				PRE: 10,
			},
			proficiencyBonus: profBonus,
			abilityOverride:
				scope === "spells"
					? (getSpellcastingAbility(character.job) as AbilityScore | null)
					: null,
		});
		return {
			ability: formula.ability,
			abilityModifier: formula.abilityModifier,
			attackBonus: formula.attackBonus,
			saveDC: formula.saveDC,
		};
	}, [character, scope]);

	const hasContent = useMemo(() => {
		if (scope === "spells") {
			return actions.some((a) => a.type === "spell");
		}
		if (scope === "powers") {
			return actions.some((a) => a.type === "power" || a.type === "spell");
		}
		return actions.some((a) => a.type === "technique");
	}, [actions, scope]);

	if (!character || !stats || !hasContent) return null;

	const meta = SCOPE_META[scope];
	const Icon = meta.icon;

	return (
		<AscendantWindow
			title={meta.title}
			compact
			className={cn("border-primary/20", className)}
		>
			<div className="flex items-stretch gap-2">
				<div className="flex items-center gap-2 px-2 border-r border-primary/10">
					<Icon className="w-4 h-4 text-primary" />
					<Badge variant="outline" className="text-[11px] uppercase">
						{meta.resolution}
					</Badge>
				</div>
				<div className="grid grid-cols-3 flex-1 gap-2">
					<div className="text-center">
						<div className="text-[11px] text-muted-foreground uppercase tracking-wider">
							Ability
						</div>
						<div
							className="text-base font-heading font-bold text-primary"
							data-testid={`spellcasting-ability-${scope}`}
						>
							{stats.ability}
						</div>
						<div className="text-[11px] text-muted-foreground">
							{formatModifier(stats.abilityModifier)}
						</div>
					</div>
					<div className="text-center">
						<div className="text-[11px] text-muted-foreground uppercase tracking-wider">
							Save DC
						</div>
						<div
							className="text-base font-heading font-bold text-foreground"
							data-testid={`spellcasting-save-dc-${scope}`}
						>
							{stats.saveDC}
						</div>
						<div className="text-[11px] text-muted-foreground">
							8 + PB + mod
						</div>
					</div>
					<div className="text-center">
						<div className="text-[11px] text-muted-foreground uppercase tracking-wider">
							Attack
						</div>
						<div
							className="text-base font-heading font-bold text-foreground"
							data-testid={`spellcasting-attack-${scope}`}
						>
							{formatModifier(stats.attackBonus)}
						</div>
						<div className="text-[11px] text-muted-foreground">PB + mod</div>
					</div>
				</div>
			</div>
		</AscendantWindow>
	);
}
