import {
	BookOpen,
	CheckCircle,
	Scroll,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompendiumRune } from "@/types/compendium";
import { setPendingResolution } from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

interface RuneDetailProps {
	data: CompendiumRune;
}

const RUNE_TYPE_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	martial: Zap,
	caster: Scroll,
	hybrid: Sparkles,
	utility: BookOpen,
	defensive: Shield,
	offensive: Zap,
};

const RUNE_TYPE_COLORS: Record<string, string> = {
	martial: "bg-red-500/20 text-red-400 border-red-500/30",
	caster: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	hybrid: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	utility: "bg-green-500/20 text-green-400 border-green-500/30",
	defensive: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	offensive: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export const RuneDetail = ({ data }: RuneDetailProps) => {
	const Icon = RUNE_TYPE_ICONS[data.rune_type] || Sparkles;
	const typeColor = RUNE_TYPE_COLORS[data.rune_type] || "";
	const displayName = formatRegentVernacular(
		data.display_name || data.name,
	);
	const navigate = useNavigate();

	const handleRoll = () => {
		const id = crypto.randomUUID();
		const name = displayName;

		if (data.rune_type === "offensive" || data.rune_type === "utility") {
			// Most runes use a standard DC or a modifier
			const dc = data.inscription_difficulty || 10;
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "rune", entryId: data.id },
				kind: "save",
				save: { dc, ability: "Intelligence", roll: "1d20" },
			});
			navigate("/dice");
		}
	};

	// Format requirements
	const requirements: string[] = [];
	if (data.requires_job && data.requires_job.length > 0)
		requirements.push(`Required Job: ${data.requires_job.join(", ")}`);

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className={typeColor ? `border-2 ${typeColor.split(" ")[2]}` : ""}
			>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Icon className="w-8 h-8 text-primary" />
						<div>
							<h2 className="font-display text-2xl gradient-text-ascendant">
								{displayName}
							</h2>
							<div className="flex items-center gap-2 mt-1">
								<Badge
									className={
										typeColor || "bg-primary/20 text-primary border-primary/30"
									}
								>
									{formatRegentVernacular(data.rune_type)}
								</Badge>
								<Badge variant="outline">
									{formatRegentVernacular(data.rarity || "Common")}
								</Badge>
								<Badge variant="outline">
									{formatRegentVernacular(data.rune_category || "Uncategorized")}
								</Badge>
							</div>
						</div>
					</div>

					<p className="text-foreground">
						<AutoLinkText text={data.description || ""} />
					</p>

					{data.lore && (
						<div className="border-l-2 border-primary/30 pl-4">
							<p className="text-muted-foreground italic">
								<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
							</p>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Effect Details */}
			<AscendantWindow title="EFFECT">
				<div className="space-y-3">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<CheckCircle className="w-4 h-4 text-green-400" />
							<h4 className="font-heading font-semibold">Effect Type</h4>
						</div>
						<Badge variant="outline">
							{formatRegentVernacular(data.effect_type || "passive")}
						</Badge>
					</div>

					{data.effect_description && (
						<div>
							<p className="text-foreground">
								<AutoLinkText text={data.effect_description || ""} />
							</p>
							<div className="mt-2">
								<Button size="sm" variant="outline" onClick={handleRoll}>
									<Zap className="w-4 h-4 mr-2" />
									Roll Rune Effect
								</Button>
							</div>
						</div>
					)}

					{data.activation_action && (
						<div>
							<h4 className="font-heading font-semibold text-sm mb-2">
								Activation
							</h4>
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div>
									<span className="text-muted-foreground">Action: </span>
									<Badge variant="outline" className="text-xs">
										{formatRegentVernacular(data.activation_action)}
									</Badge>
								</div>
								{data.activation_cost && (
									<div>
										<span className="text-muted-foreground">Cost: </span>
										<Badge variant="outline" className="text-xs">
											{data.activation_cost_amount}{" "}
											{formatRegentVernacular(data.activation_cost)}
										</Badge>
									</div>
								)}
								{data.uses_per_rest && (
									<div>
										<span className="text-muted-foreground">Uses: </span>
										<Badge variant="outline" className="text-xs">
											{formatRegentVernacular(data.uses_per_rest)}
										</Badge>
									</div>
								)}
								{data.recharge && data.recharge !== "none" && (
									<div>
										<span className="text-muted-foreground">Recharge: </span>
										<Badge variant="outline" className="text-xs">
											{formatRegentVernacular(data.recharge)}
										</Badge>
									</div>
								)}
							</div>
						</div>
					)}

					{data.range && (
						<div>
							<span className="text-muted-foreground">Range: </span>
							<span className="text-foreground">
								{formatRegentVernacular(data.range)}
							</span>
						</div>
					)}

					{data.duration && (
						<div>
							<span className="text-muted-foreground">Duration: </span>
							<span className="text-foreground">
								{formatRegentVernacular(data.duration)}
							</span>
							{data.concentration && (
								<Badge variant="secondary" className="ml-2 text-xs">
									Concentration
								</Badge>
							)}
						</div>
					)}

				</div>
			</AscendantWindow>

			{/* Passive Bonuses */}
			{data.passive_bonuses && Object.keys(data.passive_bonuses).length > 0 && (
				<AscendantWindow title="PASSIVE BONUSES">
					<div className="space-y-2">
						{Object.entries(data.passive_bonuses).map(([key, value]) => (
							<div key={key} className="flex items-center gap-2">
								<Badge variant="secondary" className="text-xs">
									{key
										.replace(/_/g, " ")
										.replace(/\b\w/g, (l) => l.toUpperCase())}
									: {String(value)}
								</Badge>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Inscription Details */}
			<AscendantWindow title="INSCRIPTION">
				<div className="space-y-2 text-sm">
					<div>
						<span className="text-muted-foreground">Can be inscribed on: </span>
						<div className="flex flex-wrap gap-2 mt-1">
							{data.can_inscribe_on?.map((type) => (
								<Badge key={type} variant="outline" className="text-xs">
									{formatRegentVernacular(type)}
								</Badge>
							))}
						</div>
					</div>
					<div>
						<span className="text-muted-foreground">
							Inscription Difficulty:{" "}
						</span>
						<Badge variant="outline">DC {data.inscription_difficulty}</Badge>
					</div>
				</div>
			</AscendantWindow>

			{/* Discovery Lore */}
			{data.discovery_lore && (
				<AscendantWindow title="DISCOVERY">
					<p className="text-muted-foreground italic">
						<AutoLinkText text={data.discovery_lore} />
					</p>
				</AscendantWindow>
			)}

			{/* Tags */}
			{data.tags && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{data.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
