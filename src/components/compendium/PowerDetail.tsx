import { BookOpen, Clock, Target, Timer, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { setPendingResolution } from "@/lib/actionResolution";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

interface PowerData {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	power_level: number;
	school?: string;
	casting_time: string;
	range: string;
	duration: string;
	concentration: boolean;
	ritual: boolean;
	components?: string;
	higher_levels?: string;
	job_names?: string[];
	tags?: string[];
	source_book?: string;
	image_url?: string | null;
	image?: string | null;
	saving_throw?: {
		ability?: string;
		dc?: string;
		success?: string;
		failure?: string;
	} | null;
	attack?: {
		type?: string;
		modifier?: string;
		damage?: string;
	} | null;
	mechanics?: Record<string, unknown> | null;
}

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

		if (data.attack) {
			const bonusStr = data.attack.modifier || "0";
			const bonus =
				parseInt(bonusStr.replace(/[+-]/g, ""), 10) *
				(bonusStr.includes("-") ? -1 : 1);
			const attackRoll = `1d20${bonus >= 0 ? "+" : ""}${bonus}`;
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "attack",
				attack: { roll: attackRoll },
				damage: data.attack.damage ? { roll: data.attack.damage } : undefined,
			});
			navigate("/dice");
		} else if (data.saving_throw) {
			const dc = parseInt(data.saving_throw.dc || "10", 10);
			setPendingResolution({
				version: 1,
				id,
				name,
				source: { type: "power", entryId: data.id },
				kind: "save",
				save: { dc, ability: data.saving_throw.ability, roll: "1d20" },
			});
			navigate("/dice");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<SystemWindow
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

						{data.job_names && data.job_names.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<span className="text-sm text-muted-foreground">Jobs:</span>
								{data.job_names.map((job) => (
									<Badge key={job} variant="outline" className="text-xs">
										{formatRegentVernacular(job)}
									</Badge>
								))}
							</div>
						)}

						{(data.attack || data.saving_throw) && (
							<div className="pt-2">
								<Button onClick={handleRoll} className="gap-2">
									<Zap className="w-4 h-4" />
									Roll Power
								</Button>
							</div>
						)}
					</div>
				</div>
			</SystemWindow>

			{/* Casting Properties */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<SystemWindow title="CASTING TIME" compact>
					<div className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.casting_time || "1 action")}
						</span>
					</div>
				</SystemWindow>

				<SystemWindow title="RANGE" compact>
					<div className="flex items-center gap-2">
						<Target className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.range || "Self")}
						</span>
					</div>
				</SystemWindow>

				<SystemWindow title="DURATION" compact>
					<div className="flex items-center gap-2">
						<Timer className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.duration || "Instantaneous")}
						</span>
					</div>
				</SystemWindow>

				<SystemWindow title="COMPONENTS" compact>
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-primary" />
						<span className="font-heading">
							{formatRegentVernacular(data.components || "V, S")}
						</span>
					</div>
				</SystemWindow>
			</div>

			{/* Description */}
			<SystemWindow title="DESCRIPTION">
				<p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
					<AutoLinkText text={data.description} />
				</p>
			</SystemWindow>

			{/* At Higher Levels */}
			{data.higher_levels && (
				<SystemWindow title="AT HIGHER TIERS">
					<div className="flex items-start gap-3">
						<BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
						<p className="text-foreground leading-relaxed text-base">
							<AutoLinkText text={data.higher_levels} />
						</p>
					</div>
				</SystemWindow>
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
