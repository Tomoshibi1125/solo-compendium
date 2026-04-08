import { BookOpen, Clock, Target, Timer, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setPendingResolution } from "@/lib/actionResolution";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumPower } from "@/types/compendium";

interface PowerData extends CompendiumPower {}

const tierColors: Record<number, string> = {
	0: "text-gray-400 border-gray-500/30",
	1: "text-green-400 border-green-500/30",
	2: "text-green-400 border-green-500/30",
	3: "text-blue-400 border-blue-500/30",
	4: "text-blue-400 border-blue-500/30",
	5: "text-purple-400 border-purple-500/30",
	6: "text-purple-400 border-purple-500/30",
	7: "text-orange-400 border-orange-500/30",
	8: "text-orange-400 border-orange-500/30",
	9: "text-red-400 border-red-500/30",
};

export const PowerDetail = ({ data }: { data: PowerData }) => {
	const navigate = useNavigate();
	const tierLabel =
		data.power_level === 0 ? "Cantrip" : `Tier ${data.power_level}`;
	const tierColor = tierColors[data.power_level] || "text-foreground";
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;

	const handleRoll = () => {
		const id = crypto.randomUUID();
		const name = displayName;

		if (data.has_attack_roll) {
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "attack",
				attack: { roll: "1d20+5" }, // Defaulting to +5 for mechanical consistency if not specified
				damage: data.damage_roll ? { roll: data.damage_roll, type: data.damage_type } : undefined,
			});
			navigate("/dice");
		} else if (data.has_save) {
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "save",
				save: { dc: 15, ability: data.save_ability, roll: "1d20" }, // Defaulting to DC 15
				damage: data.damage_roll ? { roll: data.damage_roll, type: data.damage_type } : undefined,
			});
			navigate("/dice");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className={cn("border-2", tierColor)}
			>
				<div className="flex flex-col md:flex-row gap-6">
					{imageSrc && (
						<div className="w-full md:w-1/3 max-w-[300px] flex-shrink-0">
							<CompendiumImage
								src={imageSrc}
								alt={displayName}
								size="large"
								aspectRatio="square"
								className="rounded-md border border-primary/20"
								fallbackIcon={
									<BookOpen className="w-16 h-16 text-muted-foreground" />
								}
							/>
						</div>
					)}
					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<Badge className={tierColor}>{tierLabel}</Badge>
							{data.school && (
								<Badge variant="secondary">
									{formatRegentVernacular(data.school)}
								</Badge>
							)}
							{data.concentration && (
								<Badge variant="destructive">Concentration</Badge>
							)}
							{data.ritual && <Badge variant="outline">Ritual</Badge>}
						</div>

						{data.tags && data.tags.filter(t => t.startsWith("job:")).length > 0 && (
							<div className="flex flex-wrap gap-2">
								<span className="text-sm text-muted-foreground">Jobs:</span>
								{data.tags.filter(t => t.startsWith("job:")).map((job) => (
									<Badge key={job} variant="outline" className="text-xs">
										{formatRegentVernacular(job.replace("job:", ""))}
									</Badge>
								))}
							</div>
						)}

						{(data.has_attack_roll || data.has_save) && (
							<div className="pt-2">
								<Button onClick={handleRoll} className="gap-2">
									<Zap className="w-4 h-4" />
									Roll Power
								</Button>
							</div>
						)}
					</div>
				</div>
			</AscendantWindow>

			{/* Casting Properties */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<AscendantWindow title="CASTING TIME" compact>
					<div className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.casting_time || "1 action")}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="RANGE" compact>
					<div className="flex items-center gap-2">
						<Target className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.range || "Self")}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="DURATION" compact>
					<div className="flex items-center gap-2">
						<Timer className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.duration || "Instantaneous")}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="TAGS" compact>
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{data.tags?.filter(t => !t.startsWith("job:")).join(", ") || "None"}
						</span>
					</div>
				</AscendantWindow>
			</div>

			{/* Description */}
			<AscendantWindow title="DESCRIPTION">
				{data.flavor && (
					<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
						<AutoLinkText text={data.flavor} />
					</p>
				)}
				<p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
					<AutoLinkText text={data.description || ""} />
				</p>
				{data.lore && (
					<div className="mt-6 pt-4 border-t border-cyan/10">
						<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
							Historical Record
						</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							<AutoLinkText
								text={
									typeof data.lore === "string" ? data.lore : data.lore?.history || ""
								}
							/>
						</p>
					</div>
				)}
			</AscendantWindow>

			{/* Mechanics Raw Output if exists */}
			{data.mechanics && Object.keys(data.mechanics).length > 0 && (
				<AscendantWindow title="SYSTEM DIAGNOSTICS">
					<pre className="whitespace-pre-wrap font-mono bg-void/50 p-3 rounded text-xs text-muted-foreground overflow-hidden">
						{JSON.stringify(data.mechanics, null, 2)}
					</pre>
				</AscendantWindow>
			)}

			{/* At Higher Levels */}
			{data.higher_levels && (
				<AscendantWindow title="AT HIGHER TIERS">
					<div className="flex items-start gap-3">
						<BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
						<p className="text-foreground leading-relaxed text-base">
							<AutoLinkText text={data.higher_levels} />
						</p>
					</div>
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
