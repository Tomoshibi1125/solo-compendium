import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { SystemText } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import { formatRegentVernacular } from "@/lib/vernacular";

type Background =
	Database["public"]["Tables"]["compendium_backgrounds"]["Row"] & {
		display_name?: string | null;
	};

interface BackgroundStepProps {
	selectedBackground: string;
	onBackgroundChange: (backgroundId: string) => void;
	allBackgrounds: (Background & { _homebrew?: boolean })[];
}

export const BackgroundStep: React.FC<BackgroundStepProps> = ({
	selectedBackground,
	onBackgroundChange,
	allBackgrounds,
}) => {
	const selectedBackgroundData = allBackgrounds.find(
		(b) => b.id === selectedBackground,
	);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<SystemWindow title="MODEL ORIGIN: BACKGROUND BINDING">
				<div className="space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] uppercase tracking-widest text-primary/60">
							Select Historical Imprint Pattern
						</Label>
						<Select
							value={selectedBackground}
							onValueChange={onBackgroundChange}
						>
							<SelectTrigger className="h-12 bg-black/40 border-primary/20 text-lg font-heading">
								<SelectValue placeholder="Choose a background protocol..." />
							</SelectTrigger>
							<SelectContent>
								{allBackgrounds.map((bg) => (
									<SelectItem key={bg.id} value={bg.id}>
										{formatRegentVernacular(bg.display_name || bg.name)}
										{bg._homebrew && (
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

					{selectedBackgroundData && (
						<div className="p-5 rounded-lg bg-black/40 border border-primary/10 space-y-4">
							<h4 className="font-heading font-semibold text-lg text-primary">
								{formatRegentVernacular(
									selectedBackgroundData.display_name ||
										selectedBackgroundData.name,
								)}
							</h4>
							<SystemText className="block text-sm text-muted-foreground leading-relaxed italic">
								{formatRegentVernacular(selectedBackgroundData.description)}
							</SystemText>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-primary/5">
								{selectedBackgroundData.skill_proficiencies &&
									selectedBackgroundData.skill_proficiencies.length > 0 && (
										<div className="space-y-1">
											<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
												Neural Patterns (Skills)
											</Label>
											<div className="flex flex-wrap gap-2 mt-1">
												{selectedBackgroundData.skill_proficiencies.map(
													(skill) => (
														<Badge
															key={`skill-${skill}`}
															variant="secondary"
															className="text-[10px] h-5 bg-primary/10 border-primary/20"
														>
															{formatRegentVernacular(skill)}
														</Badge>
													),
												)}
											</div>
										</div>
									)}

								{selectedBackgroundData.tool_proficiencies &&
									selectedBackgroundData.tool_proficiencies.length > 0 && (
										<div className="space-y-1">
											<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
												Functional Tools (Utility)
											</Label>
											<div className="flex flex-wrap gap-2 mt-1">
												{selectedBackgroundData.tool_proficiencies.map(
													(tool) => (
														<Badge
															key={`tool-${tool}`}
															variant="secondary"
															className="text-[10px] h-5 bg-primary/10 border-primary/20"
														>
															{formatRegentVernacular(tool)}
														</Badge>
													),
												)}
											</div>
										</div>
									)}

								{selectedBackgroundData.starting_equipment &&
									selectedBackgroundData.starting_equipment.length > 0 && (
										<div className="space-y-1 md:col-span-2">
											<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
												Starting Inventory Pack
											</Label>
											<div className="text-[11px] text-muted-foreground italic leading-tight mt-1 pl-2 border-l border-primary/20 py-1">
												{Array.isArray(
													selectedBackgroundData.starting_equipment,
												)
													? selectedBackgroundData.starting_equipment.join(", ")
													: selectedBackgroundData.starting_equipment}
											</div>
										</div>
									)}

								{selectedBackgroundData.feature_name && (
									<div className="space-y-1 md:col-span-2 p-3 bg-primary/5 rounded border border-primary/10">
										<Label className="text-[9px] uppercase tracking-tighter text-primary/80 font-bold">
											Origin Feature: {selectedBackgroundData.feature_name}
										</Label>
										<div className="text-[11px] text-muted-foreground mt-1">
											{selectedBackgroundData.feature_description}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</SystemWindow>
		</div>
	);
};
