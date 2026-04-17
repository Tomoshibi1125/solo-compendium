import {
	AlertTriangle,
	Brain,
	Heart,
	type LucideProps,
	Shield,
	Skull,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateCharacterStats } from "@/lib/characterCalculations";
import { calculateSkillModifier } from "@/lib/skills";
import { cn } from "@/lib/utils";
import {
	generateDashboard,
	getEncounterThresholds,
	type PartyMember,
} from "@/lib/vtt/partyDashboard";
import type { AbilityScore } from "@/types/core-rules";

interface DashboardCharacter {
	id: string;
	name?: string;
	job?: string;
	level?: number;
	hp_current?: number;
	hp_max?: number;
	hp_temp?: number;
	armor_class?: number;
	speed?: number;
	abilities?: Record<string, number>;
	saving_throw_proficiencies?: AbilityScore[];
	skill_proficiencies?: string[];
	skill_expertise?: string[];
	conditions?: string[];
	exhaustion_level?: number;
	rift_favor_current?: number;
	rift_favor_max?: number;
	death_saves?: {
		successes: number;
		failures: number;
		active: boolean;
	};
}

interface DashboardMemberData {
	role?: string;
	characters?: DashboardCharacter | DashboardCharacter[] | null;
}

interface PartyDashboardPanelProps {
	// Accept the raw members array from useCampaignMembers
	rawMembers: DashboardMemberData[];
}

export function PartyDashboardPanel({ rawMembers }: PartyDashboardPanelProps) {
	const dashboardData = useMemo(() => {
		const partyMembers: PartyMember[] = [];

		for (const m of rawMembers) {
			if (m.role !== "ascendant" || !m.characters) continue;

			// Handle potential array of characters or single object
			const charArr = Array.isArray(m.characters)
				? m.characters
				: [m.characters];

			for (const character of charArr) {
				const abilities = character.abilities || {
					STR: 10,
					AGI: 10,
					VIT: 10,
					INT: 10,
					SENSE: 10,
					PRE: 10,
				};

				const calculatedStats = calculateCharacterStats({
					level: character.level || 1,
					abilities,
					savingThrowProficiencies: character.saving_throw_proficiencies || [],
					skillProficiencies: character.skill_proficiencies || [],
					skillExpertise: character.skill_expertise || [],
					armorClass: character.armor_class,
					speed: character.speed,
				});

				// Calculate Passives
				const getPassive = (skillName: string) => {
					const mod = calculateSkillModifier(
						skillName,
						abilities,
						character.skill_proficiencies || [],
						character.skill_expertise || [],
						calculatedStats.proficiencyBonus,
					);
					return 10 + mod;
				};

				partyMembers.push({
					id: character.id,
					name: character.name || "Unknown",
					job: character.job || "Unknown",
					level: character.level || 1,
					hitPoints: {
						current: character.hp_current ?? 10,
						max: character.hp_max ?? 10,
						temp: character.hp_temp ?? 0,
					},
					armorClass: calculatedStats.armorClass,
					speed: calculatedStats.speed,
					passivePerception: getPassive("Perception"),
					passiveInsight: getPassive("Insight"),
					passiveInvestigation: getPassive("Investigation"),
					conditions: character.conditions || [],
					exhaustionLevel: character.exhaustion_level || 0,
					riftFavor: {
						current: character.rift_favor_current ?? 0,
						max: character.rift_favor_max ?? 3, // Assuming base 3
					},
					deathSaves: character.death_saves || {
						successes: 0,
						failures: 0,
						active: false,
					},
					calculatedStats,
				});
			}
		}

		return generateDashboard(partyMembers);
	}, [rawMembers]);

	if (dashboardData.members.length === 0) {
		return (
			<div className="flex items-center justify-center h-40 text-foreground/70 text-sm">
				No active characters in this campaign.
			</div>
		);
	}

	const { summary, urgencyOrder, alerts } = dashboardData;
	const thresholds = getEncounterThresholds(dashboardData.members);

	return (
		<div className="space-y-4">
			{/* ALERTS SECTION */}
			{alerts.length > 0 && (
				<div className="space-y-2">
					<h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-1">
						<AlertTriangle className="w-3 h-3 text-amber-500" /> Active Alerts
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{alerts.map((alert) => (
							<div
								key={`${alert.memberId}-${alert.message.replace(/\s+/g, "-")}`}
								className={cn(
									"px-3 py-2 rounded border flex items-start gap-2",
									alert.severity === "critical" &&
										"bg-red-500/10 border-red-500/50 text-red-400",
									alert.severity === "danger" &&
										"bg-orange-500/10 border-orange-500/50 text-orange-400",
									alert.severity === "warning" &&
										"bg-amber-500/10 border-amber-500/50 text-amber-400",
									alert.severity === "info" &&
										"bg-blue-500/10 border-blue-500/50 text-blue-400",
								)}
							>
								{alert.severity === "critical" ? (
									<Skull className="w-4 h-4 shrink-0 mt-0.5" />
								) : (
									<AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
								)}
								<div>
									<div className="text-xs font-bold">{alert.memberName}</div>
									<div className="text-[10px] opacity-90">{alert.message}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* OVERVIEW STATS */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
				<Card className="bg-obsidian-charcoal/80 border-primary/20 shadow-inner">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="p-2 bg-red-500/20 rounded-full text-red-400">
							<Heart className="w-4 h-4" />
						</div>
						<div>
							<div className="text-[10px] text-primary/60 font-mono uppercase tracking-wider">
								Party HP
							</div>
							<div className="text-sm font-bold text-white">
								{summary.totalHP.current} / {summary.totalHP.max}
							</div>
							<Progress
								value={summary.hpPercentage}
								className="h-1 mt-1 bg-red-950/50 [&>div]:bg-red-500"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-obsidian-charcoal/80 border-primary/20 shadow-inner">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="p-2 bg-blue-500/20 rounded-full text-blue-400">
							<Shield className="w-4 h-4" />
						</div>
						<div>
							<div className="text-[10px] text-primary/60 font-mono uppercase tracking-wider">
								Average AC
							</div>
							<div className="text-sm font-bold text-white">
								{summary.averageAC}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-obsidian-charcoal/80 border-primary/20 shadow-inner">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="p-2 bg-purple-500/20 rounded-full text-purple-400">
							<Eye className="w-4 h-4" />
						</div>
						<div>
							<div className="text-[10px] text-primary/60 font-mono uppercase tracking-wider">
								Max Perception
							</div>
							<div className="text-sm font-bold text-white">
								{summary.highestPassivePerception}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-obsidian-charcoal/80 border-primary/20 shadow-inner">
					<CardContent className="p-3 flex items-center gap-3">
						<div className="p-2 bg-amber-500/20 rounded-full text-amber-400">
							<Zap className="w-4 h-4" />
						</div>
						<div>
							<div className="text-[10px] text-primary/60 font-mono uppercase tracking-wider">
								Total Favor
							</div>
							<div className="text-sm font-bold text-white">
								{summary.totalRiftFavor.current} / {summary.totalRiftFavor.max}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* ENCOUNTER DIFFICULTY */}
			<Card className="bg-obsidian-charcoal/80 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.05)]">
				<CardContent className="p-3">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
						<span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
							<Sparkles className="w-3.5 h-3.5" /> XP Thresholds
						</span>
						<div className="flex gap-4 text-[10px] font-mono tracking-widest bg-black/40 px-3 py-1.5 rounded-md border border-primary/10">
							<span className="text-emerald-400">EASY: {thresholds.easy}</span>
							<span className="text-amber-400">MED: {thresholds.medium}</span>
							<span className="text-orange-400">HARD: {thresholds.hard}</span>
							<span className="text-red-400">DEADLY: {thresholds.deadly}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* URGENCY SORTED MEMBERS */}
			<div>
				<h3 className="text-[10px] font-bold text-primary/60 font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
					Party Status{" "}
					<span className="text-primary/40 text-[8px] font-sans tracking-normal">
						(Sorted by Urgency)
					</span>
				</h3>
				<ScrollArea className="h-[300px] rounded-md border border-primary/20 bg-black/40 p-2 shadow-inner">
					<div className="space-y-2">
						{urgencyOrder.map((member) => {
							const hpPct =
								member.hitPoints.max > 0
									? (member.hitPoints.current / member.hitPoints.max) * 100
									: 0;

							return (
								<div
									key={member.id}
									className="bg-obsidian-charcoal/80 rounded-md p-3 border border-primary/20 hover:border-primary/40 transition-colors"
								>
									<div className="flex items-center justify-between mb-2">
										<div>
											<div className="font-bold text-sm text-white flex items-center gap-2">
												{member.name}
												{member.deathSaves?.active && (
													<Badge
														variant="destructive"
														className="text-[9px] h-4 font-mono"
													>
														DEATH SAVES
													</Badge>
												)}
											</div>
											<div className="text-[10px] text-primary/60 font-mono tracking-wide uppercase">
												Lv {member.level} {member.job}
											</div>
										</div>
										<div className="flex gap-2">
											<div className="text-center px-2.5 py-1 bg-black/60 rounded border border-primary/10">
												<div className="text-[8px] text-primary/50 font-mono uppercase tracking-widest">
													AC
												</div>
												<div className="text-xs font-bold text-blue-400">
													{member.armorClass}
												</div>
											</div>
											<div className="text-center px-2.5 py-1 bg-black/60 rounded border border-primary/10">
												<div className="text-[8px] text-primary/50 font-mono uppercase tracking-widest">
													PP
												</div>
												<div className="text-xs font-bold text-purple-400">
													{member.passivePerception}
												</div>
											</div>
										</div>
									</div>

									{/* HP Bar */}
									<div className="flex items-center gap-2">
										<Heart
											className={cn(
												"w-3 h-3 shrink-0",
												hpPct <= 25
													? "text-red-500 animate-pulse"
													: hpPct <= 50
														? "text-amber-500"
														: "text-green-500",
											)}
										/>
										<div className="flex-1">
											<div className="flex justify-between text-[10px] mb-0.5">
												<span>
													{member.hitPoints.current} / {member.hitPoints.max} HP{" "}
													{member.hitPoints.temp > 0 && (
														<span className="text-blue-400">
															(+{member.hitPoints.temp})
														</span>
													)}
												</span>
												<span>{Math.round(hpPct)}%</span>
											</div>
											<Progress
												value={hpPct}
												className={cn(
													"h-1.5",
													hpPct <= 25
														? "bg-red-950 [&>div]:bg-red-500"
														: hpPct <= 50
															? "bg-amber-950 [&>div]:bg-amber-500"
															: "bg-green-950 [&>div]:bg-green-500",
												)}
											/>
										</div>
									</div>

									{/* Conditions & Status */}
									{(member.conditions.length > 0 ||
										member.exhaustionLevel > 0) && (
										<div className="flex flex-wrap gap-1 mt-2">
											{member.conditions.map((c) => (
												<Badge
													key={c}
													variant="outline"
													className="text-[9px] border-amber-500/50 text-amber-400 bg-amber-500/10"
												>
													{c}
												</Badge>
											))}
											{member.exhaustionLevel > 0 && (
												<Badge
													variant="outline"
													className="text-[9px] border-red-500/50 text-red-400 bg-red-500/10"
												>
													Exhaustion {member.exhaustionLevel}
												</Badge>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}

// Ensure lucide icon is mapped
function Eye(props: LucideProps) {
	return <Brain {...props} />;
}
