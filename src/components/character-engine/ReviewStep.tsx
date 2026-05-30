import { Check, Loader2 } from "lucide-react";
import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAbilityModifier } from "@/lib/5eRulesEngine";
import type { RiftFavorOption } from "@/lib/riftFavor";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { Job, StaticJob } from "@/types/character";
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

interface ReviewResolvedStats {
	proficiencyBonus: number;
	riftFavorDie: number;
	riftFavorMax: number;
	initiative: number;
	armorClass: number;
	speed: number;
	passivePerception: number;
	carryingCapacity: number;
	spellSaveDC: number | null;
	spellAttackBonus: number | null;
	spellcastingAbility: AbilityScore | null;
	hitDieSize: number;
	savingThrows: {
		ability: AbilityScore;
		value: number;
		proficient: boolean;
	}[];
	trainedSkills: {
		id: string;
		name: string;
		ability: AbilityScore;
		value: number;
		expertise: boolean;
	}[];
}

interface ReviewStepProps {
	name: string;
	jobData?: Job;
	selectedPathName: string;
	selectedBackgroundName: string;
	effectiveAbilities: Record<AbilityScore, number>;
	hpMax: number;
	baseAC: number;
	loading: boolean;
	onCreate: () => void;
	jobASI: Record<AbilityScore, number>;
	selectedLanguages: string[];
	staticJobData: StaticJob | null;
	jobAwakeningAtCreation: { name: string; description?: string }[];
	jobTraitsAtCreation: { name: string; description?: string }[];
	resolvedStats?: ReviewResolvedStats;
	riftFavorOptions?: RiftFavorOption[];
	startingLoadout?: {
		name: string;
		type?: string | null;
		attackLine?: string;
		damageLine?: string;
		armorLine?: string;
		range?: string | null;
		properties?: string[];
	}[];
	alignment?: string;
	personalityTrait?: string;
	ideal?: string;
	bond?: string;
	flaw?: string;
	imprintSelections?: string[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
	name,
	jobData,
	selectedPathName,
	selectedBackgroundName,
	effectiveAbilities,
	hpMax,
	baseAC,
	loading,
	onCreate,
	jobASI,
	selectedLanguages,
	staticJobData,
	jobAwakeningAtCreation,
	jobTraitsAtCreation,
	resolvedStats,
	riftFavorOptions = [],
	startingLoadout = [],
	alignment,
	personalityTrait,
	ideal,
	bond,
	flaw,
	imprintSelections = [],
}) => {
	const imprintGroups = Object.entries(
		imprintSelections.reduce<Record<string, string[]>>((groups, selection) => {
			const separatorIndex = selection.indexOf(":");
			const label =
				separatorIndex >= 0 ? selection.slice(0, separatorIndex) : "Imprint";
			const value =
				separatorIndex >= 0
					? selection.slice(separatorIndex + 1).trim()
					: selection;
			const values = groups[label] ?? [];
			values.push(value);
			groups[label] = values;
			return groups;
		}, {}),
	).map(([label, values]) => ({ label, values }));
	const proficiencyBonus = resolvedStats?.proficiencyBonus ?? 2;
	const initiative =
		resolvedStats?.initiative ?? getAbilityModifier(effectiveAbilities.AGI);
	const speed = resolvedStats?.speed ?? staticJobData?.speed ?? 30;
	const riftFavorMax = resolvedStats?.riftFavorMax ?? 3;
	const riftFavorDie = resolvedStats?.riftFavorDie ?? 4;
	const hitDieSize =
		resolvedStats?.hitDieSize ??
		Number.parseInt(staticJobData?.hitDie?.replace("1d", "") ?? "8", 10);
	const spellcastingAbility = resolvedStats?.spellcastingAbility ?? null;
	const spellAttackBonus = resolvedStats?.spellAttackBonus ?? null;
	const spellSaveDC = resolvedStats?.spellSaveDC ?? null;
	const trainedSkills = resolvedStats?.trainedSkills ?? [];
	const savingThrows = resolvedStats?.savingThrows ?? [];
	const formatSigned = (value: number) =>
		value >= 0 ? `+${value}` : `${value}`;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
			<AscendantWindow title="FINAL AUTHORIZATION: ENTITY AWAKENING">
				<div className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<section className="space-y-3">
								<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
									Biological Identity
								</h3>
								<div className="grid grid-cols-2 gap-y-2 text-sm">
									<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
										Designation:
									</span>
									<span className="font-heading text-primary">
										{name || "UNNAMED"}
									</span>

									<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
										Protocol (Job):
									</span>
									<span>
										{jobData
											? formatRegentVernacular(
													jobData.display_name || jobData.name,
												)
											: "None"}
									</span>

									<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
										Specialization (Path):
									</span>
									<span
										className={
											selectedPathName === "None" ? "opacity-30 italic" : ""
										}
									>
										{selectedPathName}
									</span>

									<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
										Historical Imprint:
									</span>
									<span>{selectedBackgroundName}</span>
								</div>
							</section>

							{(alignment || personalityTrait || ideal || bond || flaw) && (
								<section className="space-y-3">
									<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
										Persona Matrix
									</h3>
									<div className="grid grid-cols-2 gap-y-2 text-sm">
										{alignment && (
											<>
												<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
													Protocol Alignment:
												</span>
												<span>{alignment}</span>
											</>
										)}
										{personalityTrait && (
											<>
												<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
													Personality Signal:
												</span>
												<span>{personalityTrait}</span>
											</>
										)}
										{ideal && (
											<>
												<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
													Core Drive:
												</span>
												<span>{ideal}</span>
											</>
										)}
										{bond && (
											<>
												<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
													Anchor / Bond:
												</span>
												<span>{bond}</span>
											</>
										)}
										{flaw && (
											<>
												<span className="text-muted-foreground uppercase tracking-tighter text-[10px]">
													Fault Line:
												</span>
												<span>{flaw}</span>
											</>
										)}
									</div>
								</section>
							)}

							<section className="space-y-3">
								<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
									Effective Core Nodes
								</h3>
								<div className="grid grid-cols-3 gap-3">
									{(Object.keys(ABILITY_NAMES) as AbilityScore[]).map(
										(ability) => {
											const modifier = getAbilityModifier(
												effectiveAbilities[ability],
											);
											return (
												<div
													key={ability}
													className="p-2 rounded bg-primary/5 border border-primary/10 flex flex-col items-center"
												>
													<span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
														{ability}
													</span>
													<span className="text-sm font-heading font-bold">
														{effectiveAbilities[ability]}
													</span>
													<span className="text-[10px] text-primary">
														{modifier >= 0 ? `+${modifier}` : modifier}
													</span>
												</div>
											);
										},
									)}
								</div>
							</section>
						</div>

						<div className="space-y-6">
							<section className="space-y-3">
								<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
									Combat Lattice Initialization
								</h3>
								<div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Pulse (HP)
										</span>
										<span className="text-xl font-heading text-primary">
											{hpMax} / {hpMax}
										</span>
										<span className="block text-[9px] text-muted-foreground">
											1d{hitDieSize}{" "}
											{formatSigned(getAbilityModifier(effectiveAbilities.VIT))}
										</span>
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Deflection (AC)
										</span>
										<span className="text-xl font-heading text-primary">
											{resolvedStats?.armorClass ?? baseAC}
										</span>
										<span className="block text-[9px] text-muted-foreground">
											10{" "}
											{formatSigned(getAbilityModifier(effectiveAbilities.AGI))}
										</span>
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Expertise (PB)
										</span>
										<span className="text-xl font-heading text-primary">
											{formatSigned(proficiencyBonus)}
										</span>
										<span className="block text-[9px] text-muted-foreground">
											Level 1 proficiency
										</span>
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Initiative
										</span>
										<span className="text-xl font-heading text-primary">
											{formatSigned(initiative)}
										</span>
										<span className="block text-[9px] text-muted-foreground">
											AGI modifier
										</span>
									</div>
								</div>
								<div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Speed
										</span>
										<span className="text-lg font-heading text-primary">
											{speed} FT
										</span>
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Rift Favor
										</span>
										<span className="text-lg font-heading text-primary">
											{riftFavorMax} / {riftFavorMax} d{riftFavorDie}
										</span>
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Spell Save DC
										</span>
										<span className="text-lg font-heading text-primary">
											{spellSaveDC ?? "—"}
										</span>
										{spellcastingAbility && (
											<span className="block text-[9px] text-muted-foreground">
												8 + PB + {spellcastingAbility}
											</span>
										)}
									</div>
									<div className="p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Spell Attack
										</span>
										<span className="text-lg font-heading text-primary">
											{spellAttackBonus === null
												? "—"
												: formatSigned(spellAttackBonus)}
										</span>
										{spellcastingAbility && (
											<span className="block text-[9px] text-muted-foreground">
												PB + {spellcastingAbility}
											</span>
										)}
									</div>
								</div>
								{savingThrows.length > 0 && (
									<div className="space-y-2">
										<span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Saving Throws
										</span>
										<div className="flex flex-wrap gap-1">
											{savingThrows.map((save) => (
												<Badge
													key={save.ability}
													variant={save.proficient ? "default" : "outline"}
													className="text-[9px]"
												>
													{save.ability} {formatSigned(save.value)}
												</Badge>
											))}
										</div>
									</div>
								)}
								{trainedSkills.length > 0 && (
									<div className="space-y-2">
										<span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Trained Skill Rolls
										</span>
										<div className="flex flex-wrap gap-1">
											{trainedSkills.map((skill) => (
												<Badge
													key={skill.id}
													variant={skill.expertise ? "default" : "secondary"}
													className="text-[9px]"
												>
													{formatRegentVernacular(skill.name)}{" "}
													{formatSigned(skill.value)}
													{skill.expertise ? " EXP" : ""}
												</Badge>
											))}
										</div>
									</div>
								)}
								{riftFavorOptions.length > 0 && (
									<div className="space-y-2">
										<span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Unlocked Rift Favor Options
										</span>
										<div className="flex flex-wrap gap-1">
											{riftFavorOptions.map((option) => (
												<Badge
													key={option.id}
													variant="outline"
													className="text-[9px]"
													title={option.rulesText}
												>
													{option.name} · Cost {option.cost}
												</Badge>
											))}
										</div>
									</div>
								)}
							</section>

							{staticJobData && (
								<section className="space-y-3">
									<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
										Awakening Loadout
									</h3>
									<div className="space-y-1 text-xs text-muted-foreground">
										{Object.keys(jobASI).length > 0 && (
											<div className="flex justify-between">
												<span className="uppercase tracking-tighter text-[9px]">
													Node ASI:
												</span>
												<span>
													{Object.entries(jobASI)
														.filter(([, v]) => typeof v === "number" && v !== 0)
														.map(([k, v]) => `${k} ${v > 0 ? `+${v}` : v}`)
														.join(", ")}
												</span>
											</div>
										)}
										<div className="flex justify-between">
											<span className="uppercase tracking-tighter text-[9px]">
												Mobility Index:
											</span>
											<span>{staticJobData.speed} FT</span>
										</div>
										<div className="flex justify-between">
											<span className="uppercase tracking-tighter text-[9px]">
												Linguistic Bindings:
											</span>
											<span className="truncate max-w-[120px] text-right">
												{[
													...(staticJobData.languages || []).filter(
														(l) => !l.toLowerCase().includes("additional"),
													),
													...selectedLanguages,
												].join(", ")}
											</span>
										</div>
										<div className="pt-2">
											<span className="uppercase tracking-tighter text-[9px] block mb-1">
												Inherent Protocol Features:
											</span>
											<div className="flex flex-wrap gap-1">
												{[
													...jobAwakeningAtCreation,
													...jobTraitsAtCreation,
												].map((f) => (
													<span
														key={f.name}
														className="px-1.5 py-0.5 rounded-sm bg-primary/5 border border-primary/10 text-[9px] uppercase"
													>
														{formatRegentVernacular(f.name)}
													</span>
												))}
											</div>
										</div>
										{startingLoadout.length > 0 && (
											<div className="pt-2 space-y-2">
												<span className="uppercase tracking-tighter text-[9px] block">
													Starting Loadout:
												</span>
												<div className="space-y-2">
													{startingLoadout.map((item) => (
														<div
															key={item.name}
															className="rounded bg-black/30 border border-primary/10 p-2 space-y-1"
														>
															<div className="flex items-center justify-between gap-2">
																<span className="font-heading text-primary/90">
																	{formatRegentVernacular(item.name)}
																</span>
																{item.type && (
																	<Badge
																		variant="outline"
																		className="text-[8px]"
																	>
																		{formatRegentVernacular(item.type)}
																	</Badge>
																)}
															</div>
															<div className="flex flex-wrap gap-1">
																{[
																	item.attackLine,
																	item.damageLine,
																	item.armorLine,
																	item.range ? `Range ${item.range}` : null,
																	...(item.properties ?? []).slice(0, 4),
																]
																	.filter((line): line is string =>
																		Boolean(line),
																	)
																	.map((line) => (
																		<Badge
																			key={`${item.name}-${line}`}
																			variant="secondary"
																			className="text-[8px]"
																		>
																			{formatRegentVernacular(line)}
																		</Badge>
																	))}
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</section>
							)}

							{imprintSelections.length > 0 && (
								<section className="space-y-3">
									<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
										Creation Imprints
									</h3>
									<div className="space-y-3">
										{imprintGroups.map((group) => (
											<div
												key={group.label}
												className="rounded bg-primary/5 border border-primary/10 p-2 space-y-2"
											>
												<div className="flex items-center justify-between gap-2">
													<span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
														{group.label}
													</span>
													<Badge variant="outline" className="text-[9px]">
														{group.values.length}
													</Badge>
												</div>
												<div className="flex flex-wrap gap-1">
													{group.values.map((value) => (
														<Badge
															key={`${group.label}:${value}`}
															variant="secondary"
															className="text-[9px] uppercase"
														>
															{formatRegentVernacular(value)}
														</Badge>
													))}
												</div>
											</div>
										))}
									</div>
								</section>
							)}
						</div>
					</div>

					<div className="pt-8 border-t border-primary/10 text-center space-y-4">
						<AscendantText className="block text-sm text-primary/60 italic max-w-lg mx-auto leading-relaxed">
							Warning: Affirming entity initialization is irreversible. Confirm
							node synchronization and functional protocols below.
						</AscendantText>
						<Button
							onClick={onCreate}
							disabled={loading}
							className="w-full md:w-auto md:px-12 h-14 text-lg gap-3 shadow-[0_4px_24px_rgba(var(--primary),0.2)]"
						>
							{loading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Neural Initialization in Progress...
								</>
							) : (
								<>
									<Check className="w-5 h-5 text-primary" />
									COMMENCE UNIT AWAKENING
								</>
							)}
						</Button>
					</div>
				</div>
			</AscendantWindow>
		</div>
	);
};
