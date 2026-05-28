/**
 * PathCompanionBonuses — surfaces the active companion-path bonuses for
 * a controller (Q7 of Round 3). Renders a compact badge strip suitable
 * for the CompanionSheet header or the TamedAnomaliesPanel row.
 */
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	formatControllerBonusesSummary,
	getControllerBonuses,
	type TamingCharacterContext,
} from "@/lib/taming";

interface PathCompanionBonusesProps {
	character: TamingCharacterContext | null | undefined;
	className?: string;
}

export function PathCompanionBonuses({
	character,
	className,
}: PathCompanionBonusesProps) {
	const bonuses = getControllerBonuses(character);
	const summary = formatControllerBonusesSummary(bonuses);
	if (!summary) return null;

	return (
		<div
			className={className}
			data-testid="path-companion-bonuses"
			data-active={summary}
		>
			<Badge
				variant="outline"
				className="gap-1 border-fuchsia-300/40 text-fuchsia-200 bg-fuchsia-300/10"
				title={[
					...bonuses.bonusActions.map((s) => `+ ${s}`),
					...bonuses.passiveBoosts.map((s) => `· ${s}`),
				].join("\n")}
			>
				<Sparkles className="w-3 h-3" />
				{summary}
			</Badge>
		</div>
	);
}
