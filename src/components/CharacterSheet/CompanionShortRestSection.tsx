/**
 * Companion Hit Dice in the Short Rest dialog (RA-10). A companion spends its
 * Hit Dice on its character's Short Rest the same way the character does. Each
 * die heals one roll of its Hit Die with no VIT, because its maximum HP has
 * none either.
 */
import { Dices, Heart, PawPrint } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	type CompanionHitDiceSpend,
	type CompanionShortRestTarget,
	useCompanionShortRestTargets,
} from "@/hooks/useCompanionRest";
import { useHitDiceSpending } from "@/hooks/useHitDiceSpending";
import { cn } from "@/lib/utils";

/** VIT 10 has a +0 modifier, so a companion's die heals the roll alone. */
const NO_VIT_SCORE = 10;

function CompanionHitDiceRow({
	target,
	onChange,
}: {
	target: CompanionShortRestTarget;
	onChange: (spend: CompanionHitDiceSpend) => void;
}) {
	const {
		hitDiceAvailable: remaining,
		totalHPRecovered,
		rolls,
		spendHitDie,
	} = useHitDiceSpending(
		target.hitDiceAvailable,
		target.hitDiceMax,
		target.hitDie,
		NO_VIT_SCORE,
		target.hpCurrent,
		target.hpMax,
	);

	useEffect(() => {
		onChange({
			instanceId: target.instanceId,
			diceSpent: rolls.length,
			hpRecovered: totalHPRecovered,
		});
	}, [onChange, rolls.length, target.instanceId, totalHPRecovered]);

	const hpAfter = Math.min(target.hpCurrent + totalHPRecovered, target.hpMax);
	const atFullHp = hpAfter >= target.hpMax;

	return (
		<div
			className="rounded-md border p-3 space-y-2"
			data-testid={`companion-short-rest-${target.instanceId}`}
		>
			<div className="flex items-center justify-between text-sm">
				<span className="font-medium">{target.name}</span>
				<span className="font-mono text-xs">
					{remaining} / {target.hitDiceMax} (d{target.hitDie})
				</span>
			</div>
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">HP</span>
				<span className="font-mono">
					{hpAfter} / {target.hpMax}
					{totalHPRecovered > 0 && (
						<span className="text-success ml-1">(+{totalHPRecovered})</span>
					)}
				</span>
			</div>
			<Button
				type="button"
				size="sm"
				variant="outline"
				className="w-full gap-2"
				onClick={() => spendHitDie()}
				disabled={remaining <= 0 || atFullHp}
				aria-label={`Spend a Hit Die for ${target.name}`}
			>
				<Dices className="h-4 w-4" />
				{atFullHp
					? "HP Full"
					: remaining <= 0
						? "No Hit Dice Left"
						: `Spend 1d${target.hitDie}`}
			</Button>
			{rolls.length > 0 && (
				<ul className="space-y-0.5 text-xs">
					{rolls.map((roll) => (
						<li
							key={`${roll.hitDiceRemaining}-${roll.roll}`}
							className="flex items-center justify-between"
						>
							<span className="text-muted-foreground">
								d{target.hitDie} = {roll.roll}
							</span>
							<span className="font-mono">
								<Heart
									aria-hidden="true"
									className={cn(
										"inline h-3 w-3 mr-1",
										roll.hpRecovered > 0 ? "text-success" : "text-gray-400",
									)}
								/>
								+{roll.hpRecovered} HP
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export function CompanionShortRestSection({
	characterId,
	characterLevel,
	onSpendsChange,
}: {
	characterId: string;
	characterLevel: number;
	/** The dice each companion spent this rest, applied when the rest finishes. */
	onSpendsChange: (spends: CompanionHitDiceSpend[]) => void;
}) {
	const headingId = useId();
	const targets = useCompanionShortRestTargets(characterId, characterLevel);
	const [spends, setSpends] = useState<Record<string, CompanionHitDiceSpend>>(
		{},
	);

	const handleRowChange = useCallback((spend: CompanionHitDiceSpend) => {
		setSpends((previous) => {
			const current = previous[spend.instanceId];
			if (
				current?.diceSpent === spend.diceSpent &&
				current.hpRecovered === spend.hpRecovered
			) {
				return previous;
			}
			return { ...previous, [spend.instanceId]: spend };
		});
	}, []);

	useEffect(() => {
		onSpendsChange(
			Object.values(spends).filter((spend) => spend.diceSpent > 0),
		);
	}, [onSpendsChange, spends]);

	if (targets.length === 0) return null;

	return (
		<section aria-labelledby={headingId} className="space-y-2 border-t pt-3">
			<h3
				id={headingId}
				className="flex items-center gap-2 text-sm font-semibold"
			>
				<PawPrint aria-hidden="true" className="h-4 w-4" /> Companions
			</h3>
			<p className="text-xs text-muted-foreground">
				Each die heals one roll of the companion&apos;s Hit Die, with no VIT.
			</p>
			<div className="max-h-60 overflow-y-auto space-y-2">
				{targets.map((target) => (
					<CompanionHitDiceRow
						key={target.instanceId}
						target={target}
						onChange={handleRowChange}
					/>
				))}
			</div>
		</section>
	);
}
