import { AlertTriangle } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumCondition } from "@/types/compendium";

export interface ConditionData extends CompendiumCondition {}

export const ConditionDetail = ({ data }: { data: ConditionData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const effects = (Array.isArray(data.condition_effects) ? data.condition_effects : data.effects) || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()} className="border-yellow-500/30">
				<div className="flex items-start gap-3">
					<AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>
				</div>
			</AscendantWindow>

			{(data.condition_duration || data.condition_save) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data.condition_duration && (
						<AscendantWindow title="DURATION" compact>
							<p className="text-sm text-muted-foreground">{formatRegentVernacular(data.condition_duration)}</p>
						</AscendantWindow>
					)}
					{data.condition_save && (
						<AscendantWindow title="SAVING THROW" compact>
							<p className="text-sm text-muted-foreground">
								{formatRegentVernacular(data.condition_save.type || "")}
								{typeof data.condition_save.dc === "number" ? ` DC ${data.condition_save.dc}` : ""}
							</p>
							{data.condition_save.description && (
								<p className="text-xs text-muted-foreground mt-1">
									{formatRegentVernacular(data.condition_save.description)}
								</p>
							)}
						</AscendantWindow>
					)}
				</div>
			)}

			{/* Effects */}
			{effects.length > 0 && (
				<AscendantWindow title="EFFECTS">
					<ul className="space-y-3">
						{effects.map((effect) => (
							<li key={effect} className="flex items-start gap-3 border-l-2 border-yellow-500/30 pl-4">
								<span className="text-foreground">
									<AutoLinkText text={effect} />
								</span>
							</li>
						))}
					</ul>
				</AscendantWindow>
			)}

			{/* Stages */}
			{data.stages && data.stages.length > 0 && (
				<AscendantWindow title="STAGES">
					<ul className="space-y-4">
						{data.stages.map((stage) => (
							<li key={stage.level} className="space-y-1">
								<h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Stage {stage.level}</h4>
								<p className="text-sm text-muted-foreground pl-4 border-l border-yellow-500/20">
									<AutoLinkText text={stage.effect} />
								</p>
							</li>
						))}
					</ul>
				</AscendantWindow>
			)}

			{/* Removal / Cure */}
			{(data.condition_removal || data.cure_lore) && (
				<AscendantWindow title="RESOLUTION">
					<div className="space-y-4">
						{data.condition_removal && data.condition_removal.length > 0 && (
							<ul className="space-y-3">
								{data.condition_removal.map((step) => (
									<li key={step} className="flex items-start gap-3 border-l-2 border-emerald-500/30 pl-4">
										<span className="text-foreground">
											<AutoLinkText text={step} />
										</span>
									</li>
								))}
							</ul>
						)}
						{data.cure_lore && (
							<div className="pt-2 border-t border-yellow-500/10">
								<h4 className="text-[10px] font-bold text-amethyst uppercase tracking-tighter mb-1">Cure Methodology</h4>
								<p className="text-xs text-muted-foreground italic">
									<AutoLinkText text={data.cure_lore} />
								</p>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Lore */}
			{data.lore && (
				<div className="mt-4 px-2">
					<p className="text-xs text-muted-foreground italic opacity-60">
						<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
					</p>
				</div>
			)}
		</div>
	);
};
