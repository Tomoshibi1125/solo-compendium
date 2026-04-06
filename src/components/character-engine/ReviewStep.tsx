import { Check, Loader2 } from "lucide-react";
import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { Job, StaticJob } from "@/types/character";
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

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
}) => {
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

							<section className="space-y-3">
								<h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-widest border-b border-primary/10 pb-1">
									Effective Core Nodes
								</h3>
								<div className="grid grid-cols-3 gap-3">
									{(Object.keys(ABILITY_NAMES) as AbilityScore[]).map(
										(ability) => {
											const modifier = Math.floor(
												(effectiveAbilities[ability] - 10) / 2,
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
								<div className="flex justify-between gap-4">
									<div className="flex-grow p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Pulse (HP)
										</span>
										<span className="text-xl font-heading text-primary">
											{hpMax} / {hpMax}
										</span>
									</div>
									<div className="flex-grow p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Deflection (AC)
										</span>
										<span className="text-xl font-heading text-primary">
											{baseAC}
										</span>
									</div>
									<div className="flex-grow p-3 rounded bg-black/40 border border-primary/10 text-center">
										<span className="block text-[9px] uppercase tracking-tighter text-muted-foreground">
											Expertise (PB)
										</span>
										<span className="text-xl font-heading text-primary">
											+2
										</span>
									</div>
								</div>
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
