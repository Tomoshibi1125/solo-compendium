import { Dice6 } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
}

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

export function AbilityScoreStrip({
	abilities,
	modifiers,
	savingThrowProficiencies,
	onRoll,
	isEditMode,
	draftScores,
	onScoreChange,
	onScoreCommit,
}: AbilityScoreStripProps) {
	return (
		<TooltipProvider delayDuration={100}>
			<div className="flex flex-col gap-2 w-full max-w-[120px]">
				{ABILITY_KEYS.map((ability) => {
					const score = abilities[ability];
					const modifier = modifiers[ability];
					const isProficient = savingThrowProficiencies.includes(ability);
					const baseModifier = Math.floor((score - 10) / 2);

					return (
						<Tooltip key={ability}>
							<TooltipTrigger asChild>
								<div className="group relative flex flex-col items-center bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 transition-all hover:border-primary/40 hover:bg-obsidian-charcoal/80">
									{/* Ability Label */}
									<span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest mb-1">
										{ability === "STR" && "STRENGTH"}
										{ability === "AGI" && "AGILITY"}
										{ability === "VIT" && "VITALITY"}
										{ability === "INT" && "INTELLECT"}
										{ability === "SENSE" && "SENSE"}
										{ability === "PRE" && "PRESENCE"}
										{!["STR", "AGI", "VIT", "INT", "SENSE", "PRE"].includes(
											ability,
										) && ability}
									</span>

									{/* Modifier Circle */}
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

									{/* SA Visual Flourish */}
									<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
								</div>
							</TooltipTrigger>
							<TooltipContent
								side="right"
								className="font-mono text-xs max-w-[200px]"
							>
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
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</TooltipProvider>
	);
}
