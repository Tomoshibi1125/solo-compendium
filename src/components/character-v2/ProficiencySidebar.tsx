import { Brain, Dice6, Eye, Search } from "lucide-react";
import { formatModifier } from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { ABILITY_NAMES, type AbilityScore } from "@/types/system-rules";

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
}

export function ProficiencySidebar({
	saves,
	skills,
	allSkills,
	savingThrowProficiences,
	onRollSave,
	onRollSkill,
}: ProficiencySidebarProps) {
	return (
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
							<button
								key={ability}
								type="button"
								onClick={() => onRollSave(ability)}
								className="group flex items-center justify-between p-2 rounded-[2px] bg-black/40 border border-primary/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
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
							<button
								key={skill.name}
								type="button"
								onClick={() => onRollSkill(skill.name)}
								className="group flex items-center justify-between px-2 py-1.5 rounded-[2px] bg-black/20 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all text-left"
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
						);
					})}
				</div>
			</section>
		</div>
	);
}
