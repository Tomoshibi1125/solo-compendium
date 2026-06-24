import { Dice6 } from "lucide-react";
import { InfoPopover } from "@/components/ui/InfoPopover";
import { getAbilityModifier } from "@/lib/5eRulesEngine";
import { formatModifier } from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

interface AbilityScoreStripProps {
	abilities: Record<AbilityScore, number>;
	modifiers: Record<AbilityScore, number>;
	savingThrowProficiencies: AbilityScore[];
	onRoll: (ability: AbilityScore) => void;
	isEditMode?: boolean;
	draftScores?: Record<AbilityScore, string>;
	onScoreChange?: (ability: AbilityScore, value: string) => void;
	onScoreCommit?: (ability: AbilityScore) => void;
	/**
	 * `rail` = narrow vertical column for the desktop sidebar (default, unchanged).
	 * `grid` = full-width responsive grid for the mobile Stats tab (DDB-style).
	 */
	variant?: "rail" | "grid";
}

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

const ABILITY_LABELS: Record<string, string> = {
	STR: "STRENGTH",
	AGI: "AGILITY",
	VIT: "VITALITY",
	INT: "INTELLECT",
	SENSE: "SENSE",
	PRE: "PRESENCE",
};

export function AbilityScoreStrip({
	abilities,
	modifiers,
	savingThrowProficiencies,
	onRoll,
	isEditMode,
	draftScores,
	onScoreChange,
	onScoreCommit,
	variant = "rail",
}: AbilityScoreStripProps) {
	return (
		<div
			className={cn(
				"w-full",
				variant === "grid"
					? "grid grid-cols-3 gap-2"
					: "flex flex-col gap-2 max-w-[120px]",
			)}
		>
			{ABILITY_KEYS.map((ability) => {
				const score = abilities[ability];
				const modifier = modifiers[ability];
				const isProficient = savingThrowProficiencies.includes(ability);
				const baseModifier = getAbilityModifier(score);
				const label = ABILITY_LABELS[ability] ?? ability;

				return (
					<div
						key={ability}
						className="group relative flex flex-col items-center bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 transition-all hover:border-primary/40 hover:bg-obsidian-charcoal/80"
					>
						{/* Ability label doubles as the calc info trigger (hover desktop,
						    tap touch) — the calc tooltip used to overflow the 120px rail. */}
						<InfoPopover
							side="top"
							ariaLabel={`${ability} calculation`}
							triggerClassName="text-[10px] font-mono text-primary/60 uppercase tracking-widest mb-1 hover:text-primary px-1 min-h-[20px]"
							className="font-mono text-xs"
							content={
								<div className="space-y-1">
									<div className="font-bold text-primary border-b border-primary/20 pb-1 mb-1">
										{ability} Calculation
									</div>
									<div className="flex justify-between gap-4 text-muted-foreground">
										<span>Base Score:</span>
										<span className="text-white">{score}</span>
									</div>
									<div className="flex justify-between gap-4 text-muted-foreground">
										<span>Formula:</span>
										<span className="text-white">floor(({score}-10)/2)</span>
									</div>
									{modifier !== baseModifier && (
										<div className="flex justify-between gap-4 text-muted-foreground">
											<span>Active Effects:</span>
											<span
												className={
													modifier > baseModifier
														? "text-green-400"
														: "text-red-400"
												}
											>
												{modifier > baseModifier ? "+" : ""}
												{modifier - baseModifier}
											</span>
										</div>
									)}
									<div className="flex justify-between gap-4 border-t border-primary/20 pt-1 mt-1 font-bold">
										<span>Final Modifier:</span>
										<span
											className={
												modifier >= 0 ? "text-primary" : "text-red-400"
											}
										>
											{modifier >= 0 ? "+" : ""}
											{modifier}
										</span>
									</div>
								</div>
							}
						>
							{label}
						</InfoPopover>

						{/* Modifier Circle (rolls) */}
						<button
							type="button"
							onClick={() => onRoll(ability)}
							className={cn(
								"w-12 h-10 flex items-center justify-center rounded-[2px] border bg-black/40 mb-1 transition-all group-hover:scale-105 group-hover:bg-primary/10",
								modifier >= 0
									? "border-primary/30 text-primary"
									: "border-red-500/30 text-red-400",
							)}
						>
							<div className="flex flex-col items-center">
								<span className="text-lg font-display font-bold leading-none">
									{formatModifier(modifier)}
								</span>
								<Dice6 className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
							</div>
						</button>

						{/* Base Score */}
						{isEditMode ? (
							<input
								type="number"
								aria-label={`${ability} score`}
								placeholder="Score"
								className="w-full h-6 text-center text-xs bg-black/40 border-primary/20 rounded-[2px] focus:border-primary/50 outline-none"
								value={draftScores?.[ability] ?? score}
								onChange={(e) => onScoreChange?.(ability, e.target.value)}
								onBlur={() => onScoreCommit?.(ability)}
							/>
						) : (
							<span className="text-xs font-mono font-bold text-white/80">
								{score}
							</span>
						)}

						{/* Proficiency Dot */}
						{isProficient && (
							<div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)] rounded-r-[1px]" />
						)}

						<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
					</div>
				);
			})}
		</div>
	);
}
