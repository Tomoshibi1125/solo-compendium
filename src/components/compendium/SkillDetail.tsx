import { BookOpen, Zap } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumSkill } from "@/types/compendium";

interface SkillData extends CompendiumSkill {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	ability: string;
	examples?: string[];
	source_book?: string | null;
}

const abilityColors: Record<string, string> = {
	STR: "text-red-400 border-red-500/30",
	AGI: "text-green-400 border-green-500/30",
	VIT: "text-orange-400 border-orange-500/30",
	INT: "text-blue-400 border-blue-500/30",
	SENSE: "text-purple-400 border-purple-500/30",
	PRE: "text-pink-400 border-pink-500/30",
};

export const SkillDetail = ({ data }: { data: SkillData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className={abilityColors[data.ability]}
			>
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5" />
						<Badge variant="secondary" className={abilityColors[data.ability]}>
							{data.ability}
						</Badge>
					</div>
					<p className="text-foreground">
						<AutoLinkText text={data.description || ""} />
					</p>
				</div>
			</AscendantWindow>

			{/* Linked Ability */}
			<AscendantWindow title="LINKED ABILITY" compact>
				<div className="flex items-center gap-3">
					<div
						className={`font-display text-3xl ${abilityColors[data.ability]}`}
					>
						{data.ability}
					</div>
					<div className="text-muted-foreground">
						Add your {data.ability} modifier to checks using this skill
					</div>
				</div>
			</AscendantWindow>

			{/* Benefits (Structured) */}
			{data.benefits && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{Object.entries(data.benefits).map(([rank, items]) => (
						<AscendantWindow key={rank} title={rank.toUpperCase()}>
							<ul className="space-y-1 text-sm list-inside list-disc text-muted-foreground">
								{items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</AscendantWindow>
					))}
				</div>
			)}

			{/* Examples (Legacy Fallback) */}
			{(!data.benefits || Object.keys(data.benefits).length === 0) &&
				data.examples &&
				data.examples.length > 0 && (
					<AscendantWindow title="EXAMPLE USES">
						<ul className="space-y-3">
							{data.examples.map((example) => (
								<li key={example} className="flex items-start gap-3">
									<BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
									<span className="text-foreground">
										<AutoLinkText text={example} />
									</span>
								</li>
							))}
						</ul>
					</AscendantWindow>
				)}

			{data.source_book && (
				<div className="flex justify-end">
					<Badge variant="outline">
						{formatRegentVernacular(data.source_book)}
					</Badge>
				</div>
			)}
		</div>
	);
};
