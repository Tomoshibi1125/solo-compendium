import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { SystemText } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { cn } from "@/lib/utils";
import type { StaticJob } from "@/types/character";

interface EquipmentStepProps {
	staticJobData: StaticJob;
	equipmentChoices: Record<number, string>;
	setEquipmentChoices: (
		choices: (prev: Record<number, string>) => Record<number, string>,
	) => void;
}

export const EquipmentStep: React.FC<EquipmentStepProps> = ({
	staticJobData,
	equipmentChoices,
	setEquipmentChoices,
}) => {
	if (
		!staticJobData?.startingEquipment ||
		staticJobData.startingEquipment.length === 0
	) {
		return (
			<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<SystemWindow title="MODEL EQUIPMENT: AUTOMATED PROVISIONING">
					<div className="text-center py-12 text-muted-foreground border border-dashed border-primary/10 rounded-lg">
						<p className="font-heading text-sm uppercase tracking-widest text-primary/40">
							No Manual Provisions Required
						</p>
						<p className="text-[10px] mt-2 italic">
							Standard equipment will be initialized automatically upon unit
							activation.
						</p>
					</div>
				</SystemWindow>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<SystemWindow title="MODEL EQUIPMENT: LOADOUT SELECTION">
				<div className="space-y-6">
					<SystemText className="block text-sm text-muted-foreground italic pl-3 border-l-2 border-primary/30">
						Select active equipment hardware for the current loadout. The first
						configuration in each array is staged as default.
					</SystemText>

					<div className="space-y-4">
						{staticJobData.startingEquipment.map(
							(group: string[], groupIndex: number) => {
								const chosen = equipmentChoices[groupIndex] ?? group[0];

								return (
									<div
										key={`eq-group-${group.join("-").replace(/\s/g, "")}`}
										className="p-4 rounded-lg border border-primary/10 bg-black/40 space-y-3"
									>
										{group.length === 1 ? (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-1.5 h-1.5 rounded-full bg-primary" />
													<span className="font-heading font-semibold text-sm text-primary/80">
														{group[0]}
													</span>
												</div>
												<Badge
													variant="secondary"
													className="text-[9px] uppercase tracking-tighter bg-primary/10 border-primary/20"
												>
													Standard Issue
												</Badge>
											</div>
										) : (
											<div className="space-y-3">
												<div className="flex justify-between items-center mb-1">
													<Label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">
														Package Selection Required
													</Label>
													<Badge
														variant="outline"
														className="text-[8px] uppercase tracking-tighter border-primary/20"
													>
														Select One
													</Badge>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
													{group.map((option) => (
														<button
															key={option}
															type="button"
															onClick={() =>
																setEquipmentChoices((prev) => ({
																	...prev,
																	[groupIndex]: option,
																}))
															}
															className={cn(
																"text-left p-3 rounded border transition-all flex items-center gap-3",
																chosen === option
																	? "border-primary/60 bg-primary/10 text-primary-foreground"
																	: "border-primary/5 bg-black/40 text-muted-foreground hover:border-primary/20 hover:bg-black/60",
															)}
														>
															<div
																className={cn(
																	"w-3 h-3 rounded-full border flex-shrink-0 transition-all",
																	chosen === option
																		? "border-primary bg-primary scale-110 shadow-[0_0_8px_rgba(var(--primary),0.5)]"
																		: "border-primary/20 bg-transparent",
																)}
															/>
															<span className="font-heading text-xs tracking-tight">
																{option}
															</span>
														</button>
													))}
												</div>
											</div>
										)}
									</div>
								);
							},
						)}
					</div>

					<div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mt-6">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-1 h-3 bg-primary" />
							<p className="text-[10px] font-heading font-semibold text-primary uppercase tracking-widest">
								Current Staged Loadout
							</p>
						</div>
						<ul className="space-y-2 pl-1">
							{staticJobData.startingEquipment.map(
								(group: string[], i: number) => {
									const chosen = equipmentChoices[i] ?? group[0];
									return (
										<li
											key={`summary-${group.join("|")}-${chosen.replace(/\s/g, "")}`}
											className="text-xs flex items-center gap-3 text-muted-foreground/80"
										>
											<Check className="w-3 h-3 text-primary/60 flex-shrink-0" />
											{chosen}
										</li>
									);
								},
							)}
						</ul>
					</div>
				</div>
			</SystemWindow>
		</div>
	);
};
