import type React from "react";
import { useMemo } from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { Job, StaticJob } from "@/types/character";
import { EARTH_LANGUAGES } from "@/types/character";
import type { AbilityScore } from "@/types/core-rules";
import { ABILITY_NAMES } from "@/types/core-rules";

interface JobStepProps {
	selectedJob: string;
	onJobChange: (jobId: string) => void;
	allJobs: (Job & { _homebrew?: boolean })[];
	jobData?: Job & { _homebrew?: boolean };
	staticJobData?: StaticJob;
	jobASI: Record<AbilityScore, number>;
	selectedSkills: string[];
	onSkillsChange: (skills: string[]) => void;
	selectedLanguages: string[];
	onLanguagesChange: (languages: string[]) => void;
	totalSkillsAllowed: number;
}

export const JobStep: React.FC<JobStepProps> = ({
	selectedJob,
	onJobChange,
	allJobs,
	jobData,
	staticJobData,
	jobASI,
	selectedSkills,
	onSkillsChange,
	selectedLanguages,
	onLanguagesChange,
	totalSkillsAllowed,
}) => {
	const handleSkillToggle = (skill: string, checked: boolean) => {
		if (checked) {
			if (selectedSkills.length < totalSkillsAllowed) {
				onSkillsChange([...selectedSkills, skill]);
			}
		} else {
			onSkillsChange(selectedSkills.filter((s) => s !== skill));
		}
	};

	const groupedFeatures = useMemo(() => {
		if (!staticJobData?.classFeatures) return {};
		const groups: Record<number, typeof staticJobData.classFeatures> = {};
		staticJobData.classFeatures.forEach((f) => {
			if (!groups[f.level]) groups[f.level] = [];
			groups[f.level].push(f);
		});
		return groups;
	}, [staticJobData]);

	const asiDisplay = useMemo(() => {
		const parts = Object.entries(jobASI)
			.filter(([, v]) => typeof v === "number" && v !== 0)
			.map(([k, v]) => `${ABILITY_NAMES[k as AbilityScore]} ${v > 0 ? `+${v}` : v}`);
		return parts.length > 0 ? parts.join(", ") : "None";
	}, [jobASI]);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL SELECTION: JOB ALIGNMENT">
				<div className="space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] uppercase tracking-widest text-primary/60">
							Select Active Designation Protocol
						</Label>
						<Select
							value={selectedJob}
							onValueChange={onJobChange}
							data-testid="character-job"
						>
							<SelectTrigger className="h-12 bg-black/40 border-primary/20">
								<SelectValue placeholder="Choose a job protocol..." />
							</SelectTrigger>
							<SelectContent>
								{allJobs.map((job) => (
									<SelectItem key={job.id} value={job.id}>
										{formatRegentVernacular(job.display_name || job.name)}
										{job._homebrew && (
											<Badge
												variant="outline"
												className="ml-2 text-[8px] uppercase h-4"
											>
												Homebrew
											</Badge>
										)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{jobData && (
						<div className="mt-4 p-5 rounded-lg bg-black/40 border border-primary/10 space-y-6">
							<div className="space-y-4">
								<div className="flex justify-between items-start">
									<h4 className="font-heading font-semibold text-lg text-primary">
										{formatRegentVernacular(
											jobData.display_name || jobData.name,
										)}
									</h4>
									<Badge
										variant="outline"
										className="text-[10px] uppercase border-primary/40 text-primary/80"
									>
										Rank 1 Protocol
									</Badge>
								</div>

								<AscendantText className="block text-sm text-muted-foreground leading-relaxed italic">
									{formatRegentVernacular(jobData.description)}
								</AscendantText>

								{/* Primary Header Summary */}
								<div className="grid grid-cols-2 gap-4 py-3 border-y border-primary/5">
									<div className="space-y-1">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Hit Die Unit
										</Label>
										<div className="text-sm font-heading">
											D{jobData.hit_die}
										</div>
									</div>
									<div className="space-y-1">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Primary Node Affinity
										</Label>
										<div className="text-xs font-heading">
											{jobData.primary_abilities
												.map(formatRegentVernacular)
												.join(", ")}
										</div>
									</div>
								</div>

								{staticJobData && (
									<>
										{/* Proficiencies Panel */}
										<div className="space-y-3 pt-2">
											<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
												<span className="h-[1px] flex-grow bg-primary/20"></span>
												Proficiencies
												<span className="h-[1px] flex-grow bg-primary/20"></span>
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Armor</span>
													<span className="text-muted-foreground">{staticJobData.armorProficiencies?.join(", ") || staticJobData.armor_proficiencies?.join(", ") || "None"}</span>
												</div>
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Weapons</span>
													<span className="text-muted-foreground">{staticJobData.weaponProficiencies?.join(", ") || staticJobData.weapon_proficiencies?.join(", ") || "None"}</span>
												</div>
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Tools</span>
													<span className="text-muted-foreground">{staticJobData.toolProficiencies?.join(", ") || staticJobData.tool_proficiencies?.join(", ") || "None"}</span>
												</div>
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Saving Throws</span>
													<span className="text-muted-foreground">
														{staticJobData.savingThrows?.map(formatRegentVernacular).join(", ") || staticJobData.saving_throw_proficiencies?.map(formatRegentVernacular).join(", ") || "None"}
													</span>
												</div>
											</div>
										</div>

										{/* Integrated Race/Lineage Data */}
										<div className="space-y-3 pt-4 border-t border-primary/10">
											<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
												<span className="h-[1px] flex-grow bg-primary/20"></span>
												Lineage / Racial Attributes
												<span className="h-[1px] flex-grow bg-primary/20"></span>
											</h4>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-xs">
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Size</span>
													<span className="text-muted-foreground capitalize">{staticJobData.size || "Medium"}</span>
												</div>
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Mobility Index (Speed)</span>
													<span className="text-muted-foreground">{staticJobData.speed || 30} FT</span>
												</div>
												<div className="flex flex-col gap-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Senses</span>
													<span className="text-muted-foreground">{staticJobData.darkvision ? `Darkvision ${staticJobData.darkvision} FT` : "Normal"}</span>
												</div>
												<div className="flex flex-col gap-1 md:col-span-1">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Ability Score Increase</span>
													<span className="text-primary/90 font-medium">{asiDisplay}</span>
												</div>
												<div className="flex flex-col gap-1 md:col-span-2">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Linguistic Bindings</span>
													<span className="text-muted-foreground">{staticJobData.languages?.join(", ") || "None"}</span>
												</div>
											</div>
											
											{/* Racial Traits (Equivalent) */}
											{(staticJobData as any).racialTraits?.length > 0 && (
												<div className="mt-4 space-y-2">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">Innate Racial Traits</span>
													<div className="space-y-3">
														{(staticJobData as any).racialTraits.map((t: any, i: number) => (
															<div key={i} className="text-xs p-2 rounded bg-primary/5 border border-primary/10">
																<span className="font-semibold text-primary">{t.name}:</span> <span className="text-muted-foreground">{t.description}</span>
															</div>
														))}
													</div>
												</div>
											)}
										</div>

										{/* Immediate Level 1 Payload */}
										{((staticJobData.awakeningFeatures && staticJobData.awakeningFeatures.length > 0) || (staticJobData.jobTraits && staticJobData.jobTraits.length > 0)) && (
											<div className="space-y-3 pt-4 border-t border-primary/10">
												<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
													<span className="h-[1px] flex-grow bg-primary/20"></span>
													Immediate Level 1 Payload
													<span className="h-[1px] flex-grow bg-primary/20"></span>
												</h4>
												<div className="space-y-3">
													{staticJobData.awakeningFeatures?.filter(f => f.level === 1).map((f, i) => (
														<div key={`aw-${i}`} className="text-xs">
															<span className="font-semibold text-foreground">{f.name}:</span> <span className="text-muted-foreground block mt-1">{f.description}</span>
														</div>
													))}
													{staticJobData.jobTraits?.map((t, i) => (
														<div key={`jt-${i}`} className="text-xs">
															<span className="font-semibold text-foreground">{t.name}:</span> <span className="text-muted-foreground block mt-1">{t.description}</span>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Spellcasting Preview */}
										{staticJobData.spellcasting && (
											<div className="space-y-3 pt-4 border-t border-primary/10">
												<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
													<span className="h-[1px] flex-grow bg-primary/20"></span>
													Spellcasting Matrix
													<span className="h-[1px] flex-grow bg-primary/20"></span>
												</h4>
												<div className="text-xs text-muted-foreground">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px] block mb-1">Spellcasting Ability</span>
													<span className="text-primary/90 font-medium">{staticJobData.spellcasting.ability}</span>
												</div>
											</div>
										)}

										{/* Full Class Progression Scrollable List (1-20) */}
										{Object.keys(groupedFeatures).length > 0 && (
											<div className="space-y-3 pt-4 border-t border-primary/10">
												<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
													<span className="h-[1px] flex-grow bg-primary/20"></span>
													Full Class Progression (1-20)
													<span className="h-[1px] flex-grow bg-primary/20"></span>
												</h4>
												<ScrollArea className="h-72 border border-primary/20 rounded bg-black/40 p-0 pr-4">
													<div className="space-y-4 px-3 py-3">
														{Object.entries(groupedFeatures)
															.sort(([a], [b]) => Number(a) - Number(b))
															.map(([level, features]) => (
															<div key={level} className="space-y-2">
																<div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Level {level}</div>
																<div className="space-y-3 pl-2">
																	{features.map((f, i) => (
																		<div key={i} className="text-xs">
																			<span className="font-semibold text-foreground block mb-1">{f.name}</span>
																			<AscendantText className="text-muted-foreground">{f.description}</AscendantText>
																		</div>
																	))}
																</div>
															</div>
														))}
													</div>
												</ScrollArea>
											</div>
										)}
									</>
								)}
							</div>

							{/* Skill Imprint Protocol */}
							{jobData.skill_choices && jobData.skill_choices.length > 0 && (
								<div className="space-y-4 pt-4 border-t border-primary/10">
									<div className="flex justify-between items-center">
										<Label className="text-[10px] font-heading font-semibold text-primary uppercase tracking-wider">
											Skill Imprint Protocol
										</Label>
										<Badge
											variant="secondary"
											className="text-[9px] h-5 px-2 bg-primary/10"
										>
											{selectedSkills.length} / {totalSkillsAllowed} SELECTED
										</Badge>
									</div>

									<div className="grid grid-cols-2 gap-3">
										{jobData.skill_choices.map((skill) => (
											<div
												key={skill}
												className="flex items-center space-x-3 p-2 rounded border border-primary/5 bg-black/20 hover:border-primary/20 transition-colors"
											>
												<Checkbox
													id={`skill-${skill}`}
													checked={selectedSkills.includes(skill)}
													onCheckedChange={(checked) =>
														handleSkillToggle(skill, !!checked)
													}
													disabled={
														!selectedSkills.includes(skill) &&
														selectedSkills.length >= totalSkillsAllowed
													}
													className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
												/>
												<label
													htmlFor={`skill-${skill}`}
													className="text-xs font-heading cursor-pointer select-none text-foreground/80 hover:text-primary transition-colors"
												>
													{formatRegentVernacular(skill)}
												</label>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Additional Languages */}
							{staticJobData?.languages?.some((l) =>
								l.toLowerCase().includes("additional"),
							) && (
								<div className="space-y-4 pt-4 border-t border-primary/10">
									<div className="flex justify-between items-center">
										<Label className="text-[10px] font-heading font-semibold text-primary uppercase tracking-wider">
											Additional Linguistic Binding
										</Label>
										<Badge
											variant="secondary"
											className="text-[9px] h-5 px-2 bg-primary/10 uppercase"
										>
											Choice Required
										</Badge>
									</div>

									<div className="space-y-3">
										<AscendantText className="text-[10px] text-muted-foreground">
											Select an authorized Modern Earth language to append to
											your neural linguistic Lattice.
										</AscendantText>
										<Select
											value={selectedLanguages[0] || ""}
											onValueChange={(val) => onLanguagesChange([val])}
										>
											<SelectTrigger className="h-10 bg-black/40 border-primary/20 text-xs">
												<SelectValue placeholder="Select Modern Earth Language..." />
											</SelectTrigger>
											<SelectContent className="max-h-[300px]">
												{EARTH_LANGUAGES.filter(
													(l) => !staticJobData.languages?.includes(l),
												).map((lang) => (
													<SelectItem
														key={lang}
														value={lang}
														className="text-xs"
													>
														{lang}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</AscendantWindow>
		</div>
	);
};
