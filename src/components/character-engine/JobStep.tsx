import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
									<div className="space-y-3 pt-1">
										<div className="text-[10px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
											<span className="h-[1px] flex-grow bg-primary/20"></span>
											Awakening Lattice (Core Package)
											<span className="h-[1px] flex-grow bg-primary/20"></span>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
											{Object.keys(jobASI).length > 0 && (
												<div className="text-xs text-muted-foreground flex justify-between">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">
														Node ASI:
													</span>
													<span className="text-primary/90">
														{Object.entries(jobASI)
															.filter(
																([, v]) => typeof v === "number" && v !== 0,
															)
															.map(
																([k, v]) =>
																	`${ABILITY_NAMES[k as AbilityScore]} ${v > 0 ? `+${v}` : v}`,
															)
															.join(", ") || "—"}
													</span>
												</div>
											)}

											{(staticJobData.languages?.length || 0) > 0 && (
												<div className="text-xs text-muted-foreground flex justify-between">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">
														Linguistic Bindings:
													</span>
													<span className="truncate max-w-[120px] text-right">
														{staticJobData.languages?.join(", ")}
													</span>
												</div>
											)}

											<div className="text-xs text-muted-foreground flex justify-between">
												<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">
													Mobility Index:
												</span>
												<span>{staticJobData.speed ?? 30} FT</span>
											</div>

											{staticJobData.darkvision && (
												<div className="text-xs text-muted-foreground flex justify-between">
													<span className="font-heading font-semibold text-foreground/80 uppercase tracking-tighter text-[9px]">
														Ocular Lattice:
													</span>
													<span>Darkvision {staticJobData.darkvision} FT</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>

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
