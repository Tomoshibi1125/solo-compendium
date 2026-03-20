import { AlertTriangle } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { formatRegentVernacular } from "@/lib/vernacular";

interface ConditionData {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	effects?: string[];
	condition_effects?: string[] | null;
	condition_duration?: string | null;
	condition_removal?: string[] | null;
	condition_save?: {
		type?: string;
		dc?: number;
		description?: string;
	} | null;
}

export const ConditionDetail = ({ data }: { data: ConditionData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const effects =
		(Array.isArray(data.condition_effects)
			? data.condition_effects
			: data.effects) || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<SystemWindow
				title={displayName.toUpperCase()}
				className="border-yellow-500/30"
			>
				<div className="flex items-start gap-3">
					<AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
					<p className="text-foreground">
						<AutoLinkText text={data.description} />
					</p>
				</div>
			</SystemWindow>

			{(data.condition_duration || data.condition_save) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data.condition_duration && (
						<SystemWindow title="DURATION" compact>
							<p className="text-sm text-muted-foreground">
								{formatRegentVernacular(data.condition_duration)}
							</p>
						</SystemWindow>
					)}
					{data.condition_save && (
						<SystemWindow title="SAVING THROW" compact>
							<p className="text-sm text-muted-foreground">
								{formatRegentVernacular(data.condition_save.type || "")}
								{typeof data.condition_save.dc === "number"
									? ` DC ${data.condition_save.dc}`
									: ""}
							</p>
							{data.condition_save.description && (
								<p className="text-xs text-muted-foreground mt-1">
									{formatRegentVernacular(data.condition_save.description)}
								</p>
							)}
						</SystemWindow>
					)}
				</div>
			)}

			{/* Effects */}
			{effects.length > 0 && (
				<SystemWindow title="EFFECTS">
					<ul className="space-y-3">
						{effects.map((effect, _i) => (
							<li
								key={effect}
								className="flex items-start gap-3 border-l-2 border-yellow-500/30 pl-4"
							>
								<span className="text-foreground">
									<AutoLinkText text={effect} />
								</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}

			{data.condition_removal && data.condition_removal.length > 0 && (
				<SystemWindow title="REMOVAL">
					<ul className="space-y-3">
						{data.condition_removal.map((step, _i) => (
							<li
								key={step}
								className="flex items-start gap-3 border-l-2 border-yellow-500/30 pl-4"
							>
								<span className="text-foreground">
									<AutoLinkText text={step} />
								</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}
		</div>
	);
};
