import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import { formatRegentVernacular } from "@/lib/vernacular";

type Path = Database["public"]["Tables"]["compendium_job_paths"]["Row"] & {
	display_name?: string | null;
};

interface PathStepProps {
	selectedPath: string;
	onPathChange: (pathId: string) => void;
	paths: any[]; // Using any to accommodate the rich static data mixed with Path
}

export const PathStep: React.FC<PathStepProps> = ({
	selectedPath,
	onPathChange,
	paths,
}) => {
	const selectedPathData = paths.find((p) => p.id === selectedPath);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL EVOLUTION: PATH BRANCHING">
				<div className="space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] uppercase tracking-widest text-primary/60">
							Select Active Specialization Path
						</Label>
						<Select value={selectedPath} onValueChange={onPathChange}>
							<SelectTrigger className="h-12 bg-black/40 border-primary/20 text-lg font-heading">
								<SelectValue placeholder="Choose an evolution path..." />
							</SelectTrigger>
							<SelectContent>
								{paths.map((path) => (
									<SelectItem key={path.id} value={path.id}>
										{formatRegentVernacular(path.display_name || path.name)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedPathData && (
						<div className="p-5 rounded-lg bg-black/40 border border-primary/10 space-y-6">
							<div className="space-y-4">
								<h4 className="font-heading font-semibold text-lg text-primary">
									{formatRegentVernacular(
										selectedPathData.display_name || selectedPathData.name,
									)}
								</h4>
								<AscendantText className="block text-sm text-muted-foreground leading-relaxed italic">
									{formatRegentVernacular(selectedPathData.description)}
								</AscendantText>

								<div className="grid grid-cols-2 gap-4 py-3 border-y border-primary/5">
									<div className="space-y-1">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Unlock Level
										</Label>
										<div className="text-sm font-heading">
											{selectedPathData.path_level || selectedPathData.requirements?.level || 3}
										</div>
									</div>
									<div className="space-y-1 text-right">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Integration Index
										</Label>
										<div className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">
											Authorized Protocol
										</div>
									</div>
								</div>

								{/* Bonus Stats / Stat Priorities */}
								{selectedPathData.stats && (
									<div className="space-y-3 pt-2">
										<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
											<span className="h-[1px] flex-grow bg-primary/20"></span>
											Path Attributes
											<span className="h-[1px] flex-grow bg-primary/20"></span>
										</h4>
										<div className="grid grid-cols-2 gap-2 text-xs">
											<div>
												<span className="text-muted-foreground">Primary Node:</span>{" "}
												<span className="font-medium text-foreground">{selectedPathData.stats.primaryAttribute}</span>
											</div>
											{selectedPathData.stats.secondaryAttribute && (
												<div>
													<span className="text-muted-foreground">Secondary Node:</span>{" "}
													<span className="font-medium text-foreground">{selectedPathData.stats.secondaryAttribute}</span>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Path Features */}
								{selectedPathData.features && selectedPathData.features.length > 0 && (
									<div className="space-y-3 pt-4 border-t border-primary/10">
										<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
											<span className="h-[1px] flex-grow bg-primary/20"></span>
											Evolution Features
											<span className="h-[1px] flex-grow bg-primary/20"></span>
										</h4>
										<div className="space-y-4">
											{selectedPathData.features.sort((a: any, b: any) => a.level - b.level).map((f: any, i: number) => (
												<div key={i} className="text-xs space-y-1 p-3 rounded bg-black/40 border border-primary/10">
													<div className="flex justify-between items-center">
														<span className="font-semibold text-primary">{f.name}</span>
														<span className="text-[9px] uppercase text-muted-foreground bg-primary/5 px-2 py-0.5 rounded">Level {f.level}</span>
													</div>
													<AscendantText className="text-muted-foreground">{f.description}</AscendantText>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Path Abilities */}
								{selectedPathData.abilities && selectedPathData.abilities.length > 0 && (
									<div className="space-y-3 pt-4 border-t border-primary/10">
										<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
											<span className="h-[1px] flex-grow bg-primary/20"></span>
											Path Actives & Abilities
											<span className="h-[1px] flex-grow bg-primary/20"></span>
										</h4>
										<div className="space-y-4">
											{selectedPathData.abilities.map((a: any, i: number) => (
												<div key={i} className="text-xs space-y-1 p-3 rounded bg-black/40 border border-primary/10">
													<div className="flex justify-between items-center">
														<span className="font-semibold text-foreground">{a.name}</span>
														{a.cost && (
															<span className="text-[9px] uppercase text-muted-foreground bg-primary/5 px-2 py-0.5 rounded">{a.cost}</span>
														)}
													</div>
													<AscendantText className="text-muted-foreground block">{a.description}</AscendantText>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>
		</div>
	);
};
