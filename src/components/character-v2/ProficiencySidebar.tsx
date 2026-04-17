import { Brain, Dice6, Eye, Search } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatModifier } from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

interface ProficiencySidebarProps {
	saves: Record<AbilityScore, number>;
	skills: Record<
		string,
		{
			modifier: number;
			proficient: boolean;
			expertise: boolean;
			ability: AbilityScore;
			passive: number;
		}
	>;
	allSkills: { name: string; ability: AbilityScore }[];
	savingThrowProficiences: AbilityScore[];
	onRollSave: (ability: AbilityScore) => void;
	onRollSkill: (skill: string) => void;
	senses?: {
		darkvision: number;
		blindsight: number;
		tremorsense: number;
		truesight: number;
	};
	defenses?: {
		resistances: string[];
		immunities: string[];
		vulnerabilities: string[];
		conditionImmunities: string[];
	};
}

export function ProficiencySidebar({
	saves,
	skills,
	allSkills,
	savingThrowProficiences,
	onRollSave,
	onRollSkill,
	senses,
	defenses,
}: ProficiencySidebarProps) {
	return (
		<TooltipProvider delayDuration={200}>
			<div className="flex flex-col gap-6 w-full max-w-[300px]">
				{/* Saving Throws Section */}
				<section className="space-y-3">
					<h3 className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-primary">
						SAVING_THROWS
					</h3>
					<div className="grid grid-cols-1 gap-1">
						{(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
							const mod = saves[ability];
							const isProficient = savingThrowProficiences.includes(ability);

							return (
								<Tooltip key={ability}>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={() => onRollSave(ability)}
											className="group flex items-center justify-between p-2 rounded-[2px] bg-black/40 border border-primary/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left w-full"
										>
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"w-2 h-2 rounded-full border border-primary/30",
														isProficient &&
															"bg-primary shadow-[0_0_8px_hsl(var(--primary))]",
													)}
												/>
												<span className="text-xs font-mono font-bold text-white/90 group-hover:text-primary transition-colors">
													{ability}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span
													className={cn(
														"text-sm font-display font-bold",
														mod >= 0 ? "text-primary" : "text-red-400",
													)}
												>
													{formatModifier(mod)}
												</span>
												<Dice6 className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
											</div>
										</button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="font-mono text-xs max-w-[200px]"
									>
										<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
											{ability} Save Calculation
										</div>
										<ul className="text-muted-foreground space-y-1 list-disc pl-4">
											<li>Base {ability} Modifier</li>
											{isProficient && <li>Proficiency Bonus</li>}
											<li>Active Equipment & Custom Effects</li>
										</ul>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</section>

				{/* Senses Section (Passive Scores) */}
				<section className="space-y-3">
					<h3 className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-primary">
						PASSIVE_SENSES
					</h3>
					<div className="grid grid-cols-1 gap-2">
						<div className="flex items-center justify-between p-2 bg-obsidian-charcoal/40 border border-primary/10 rounded-[2px]">
							<div className="flex items-center gap-2">
								<Eye className="w-3.5 h-3.5 text-primary/60" />
								<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
									Perception
								</span>
							</div>
							<span className="text-sm font-display font-bold text-white">
								{skills.Perception?.passive ?? 10}
							</span>
						</div>
						<div className="flex items-center justify-between p-2 bg-obsidian-charcoal/40 border border-primary/10 rounded-[2px]">
							<div className="flex items-center gap-2">
								<Search className="w-3.5 h-3.5 text-primary/60" />
								<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
									Investigation
								</span>
							</div>
							<span className="text-sm font-display font-bold text-white">
								{skills.Investigation?.passive ?? 10}
							</span>
						</div>
						<div className="flex items-center justify-between p-2 bg-obsidian-charcoal/40 border border-primary/10 rounded-[2px]">
							<div className="flex items-center gap-2">
								<Brain className="w-3.5 h-3.5 text-primary/60" />
								<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
									Insight
								</span>
							</div>
							<span className="text-sm font-display font-bold text-white">
								{skills.Insight?.passive ?? 10}
							</span>
						</div>
					</div>
				</section>

				{/* Advanced Senses Section */}
				{senses && Object.values(senses).some((v) => v > 0) && (
					<section className="space-y-3">
						<h3 className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-primary">
							SPECIAL_SENSES
						</h3>
						<div className="grid grid-cols-1 gap-1 px-2">
							{senses.darkvision > 0 && (
								<div className="flex justify-between text-xs font-mono">
									<span className="text-muted-foreground">Darkvision</span>
									<span className="text-white">{senses.darkvision} ft</span>
								</div>
							)}
							{senses.blindsight > 0 && (
								<div className="flex justify-between text-xs font-mono">
									<span className="text-muted-foreground">Blindsight</span>
									<span className="text-white">{senses.blindsight} ft</span>
								</div>
							)}
							{senses.tremorsense > 0 && (
								<div className="flex justify-between text-xs font-mono">
									<span className="text-muted-foreground">Tremorsense</span>
									<span className="text-white">{senses.tremorsense} ft</span>
								</div>
							)}
							{senses.truesight > 0 && (
								<div className="flex justify-between text-xs font-mono">
									<span className="text-muted-foreground">Truesight</span>
									<span className="text-white">{senses.truesight} ft</span>
								</div>
							)}
						</div>
					</section>
				)}

				{/* Defenses Section */}
				{defenses &&
					(defenses.resistances.length > 0 ||
						defenses.immunities.length > 0 ||
						defenses.vulnerabilities.length > 0 ||
						defenses.conditionImmunities.length > 0) && (
						<section className="space-y-3">
							<h3 className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-primary">
								DEFENSES
							</h3>
							<div className="space-y-3 px-2">
								{defenses.resistances.length > 0 && (
									<div className="space-y-1">
										<span className="text-[9px] font-mono text-primary/60 uppercase">
											Resistances
										</span>
										<div className="flex flex-wrap gap-1">
											{defenses.resistances.map((r) => (
												<span
													key={r}
													className="text-[10px] text-white/90 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-[2px]"
												>
													{r}
												</span>
											))}
										</div>
									</div>
								)}
								{defenses.immunities.length > 0 && (
									<div className="space-y-1">
										<span className="text-[9px] font-mono text-emerald-400/60 uppercase">
											Immunities
										</span>
										<div className="flex flex-wrap gap-1">
											{defenses.immunities.map((i) => (
												<span
													key={i}
													className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-[2px]"
												>
													{i}
												</span>
											))}
										</div>
									</div>
								)}
								{defenses.conditionImmunities.length > 0 && (
									<div className="space-y-1">
										<span className="text-[9px] font-mono text-blue-400/60 uppercase">
											Condition Immunities
										</span>
										<div className="flex flex-wrap gap-1">
											{defenses.conditionImmunities.map((c) => (
												<span
													key={c}
													className="text-[10px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded-[2px]"
												>
													{c}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</section>
					)}

				{/* Skills Section */}
				<section className="space-y-3 flex-1 overflow-visible">
					<h3 className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-primary">
						SKILLS
					</h3>
					<div className="flex flex-col gap-1">
						{allSkills.map((skill) => {
							const s = skills[skill.name];
							if (!s) return null;

							return (
								<Tooltip key={skill.name}>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={() => onRollSkill(skill.name)}
											className="group flex items-center justify-between px-2 py-1.5 rounded-[2px] bg-black/20 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all text-left w-full"
										>
											<div className="flex items-center gap-2 min-w-0">
												<div
													className={cn(
														"w-1.5 h-1.5 rounded-full border border-primary/20",
														s.expertise
															? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
															: s.proficient
																? "bg-primary/40"
																: "bg-transparent",
													)}
												/>
												<span className="text-xs font-heading font-medium truncate text-white/80 group-hover:text-white transition-colors">
													{skill.name}
												</span>
												<span className="text-[9px] font-mono text-primary/40 uppercase">
													{skill.ability.substring(0, 3)}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span
													className={cn(
														"text-xs font-display font-bold",
														s.modifier >= 0 ? "text-white/90" : "text-red-400",
													)}
												>
													{formatModifier(s.modifier)}
												</span>
											</div>
										</button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="font-mono text-xs max-w-[200px]"
									>
										<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
											{skill.name} Calculation
										</div>
										<ul className="text-muted-foreground space-y-1 list-disc pl-4">
											<li>Base {skill.ability} Modifier</li>
											{s.expertise ? (
												<li>Expertise (2x Proficiency)</li>
											) : s.proficient ? (
												<li>Proficiency Bonus</li>
											) : null}
											<li>Active Equipment & Custom Effects</li>
										</ul>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</section>
			</div>
		</TooltipProvider>
	);
}
