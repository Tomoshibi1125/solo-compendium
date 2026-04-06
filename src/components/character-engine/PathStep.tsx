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
	paths: Path[];
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
						<div className="p-5 rounded-lg bg-black/40 border border-primary/10 space-y-4">
							<h4 className="font-heading font-semibold text-lg text-primary">
								{formatRegentVernacular(
									selectedPathData.display_name || selectedPathData.name,
								)}
							</h4>
							<AscendantText className="block text-sm text-muted-foreground leading-relaxed italic">
								{formatRegentVernacular(selectedPathData.description)}
							</AscendantText>

							<div className="grid grid-cols-2 gap-4 py-3 border-t border-primary/5 mt-4">
								<div className="space-y-1">
									<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
										Unlock Level
									</Label>
									<div className="text-sm font-heading">
										{selectedPathData.path_level || 3}
									</div>
								</div>
								<div className="space-y-1 text-right">
									<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
										Integration Index
									</Label>
									<div className="text-[10px] uppercase tracking-widest text-primary/40">
										Authorized Protocol
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>
		</div>
	);
};
