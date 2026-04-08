import { Coins } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumBackground } from "@/types/compendium";

interface BackgroundData extends CompendiumBackground {}

export const BackgroundDetail = ({ data }: { data: BackgroundData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<p className="text-foreground">
						<AutoLinkText text={data.description || ""} />
					</p>
					{data.tags && data.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{data.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{formatRegentVernacular(tag)}
								</Badge>
							))}
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Proficiencies & Starting */}
			<div className="grid md:grid-cols-2 gap-4">
				<AscendantWindow title="PROFICIENCIES">
					<div className="space-y-3">
						<div>
							<h4 className="font-heading text-sm text-muted-foreground mb-1">
								Skills
							</h4>
							<div className="flex flex-wrap gap-2">
								{data.skill_proficiencies?.map((skill) => (
									<Badge key={skill} variant="outline">
										{formatRegentVernacular(skill)}
									</Badge>
								)) || <span className="text-muted-foreground">None</span>}
							</div>
						</div>
						{data.tool_proficiencies && data.tool_proficiencies.length > 0 && (
							<div>
								<h4 className="font-heading text-sm text-muted-foreground mb-1">
									Tools
								</h4>
								<div className="flex flex-wrap gap-2">
									{data.tool_proficiencies.map((tool) => (
										<Badge key={tool} variant="outline">
											{formatRegentVernacular(tool)}
										</Badge>
									))}
								</div>
							</div>
						)}
						{data.language_count && data.language_count > 0 && (
							<div>
								<h4 className="font-heading text-sm text-muted-foreground mb-1">
									Languages
								</h4>
								<span className="text-foreground">
									Choose {data.language_count}
								</span>
							</div>
						)}
					</div>
				</AscendantWindow>

				<AscendantWindow title="STARTING EQUIPMENT">
					<div className="space-y-3">
						{data.starting_equipment && (
							<p className="text-foreground">
								<AutoLinkText text={data.starting_equipment} />
							</p>
						)}
						{data.starting_credits && (
							<div className="flex items-center gap-2 mt-2">
								<Coins className="w-5 h-5 text-yellow-400" />
								<span className="font-heading">
									{data.starting_credits} credits
								</span>
							</div>
						)}
					</div>
				</AscendantWindow>
			</div>

			{/* Features */}
			{data.features && data.features.length > 0 && (
				<div className="space-y-4">
					{data.features.map((feature) => (
						<AscendantWindow
							key={feature.name}
							title={`FEATURE: ${formatRegentVernacular(feature.name).toUpperCase()}`}
							className="border-primary/50"
						>
							<p className="text-foreground">
								<AutoLinkText text={feature.description} />
							</p>
						</AscendantWindow>
					))}
				</div>
			)}

			{/* Characteristics */}
			<div className="grid md:grid-cols-2 gap-4">
				{data.personality_traits && data.personality_traits.length > 0 && (
					<AscendantWindow title="PERSONALITY TRAITS">
						<ul className="space-y-2">
							{data.personality_traits.map((trait, i) => (
								<li key={trait} className="flex items-start gap-2">
									<span className="text-primary font-bold">{i + 1}.</span>
									<span className="text-muted-foreground">
										<AutoLinkText text={trait} />
									</span>
								</li>
							))}
						</ul>
					</AscendantWindow>
				)}

				{data.ideals && data.ideals.length > 0 && (
					<AscendantWindow title="IDEALS">
						<ul className="space-y-2">
							{data.ideals.map((ideal, i) => (
								<li key={ideal} className="flex items-start gap-2">
									<span className="text-primary font-bold">{i + 1}.</span>
									<span className="text-muted-foreground">
										<AutoLinkText text={ideal} />
									</span>
								</li>
							))}
						</ul>
					</AscendantWindow>
				)}

				{data.bonds && data.bonds.length > 0 && (
					<AscendantWindow title="BONDS">
						<ul className="space-y-2">
							{data.bonds.map((bond, i) => (
								<li key={bond} className="flex items-start gap-2">
									<span className="text-primary font-bold">{i + 1}.</span>
									<span className="text-muted-foreground">
										<AutoLinkText text={bond} />
									</span>
								</li>
							))}
						</ul>
					</AscendantWindow>
				)}

				{data.flaws && data.flaws.length > 0 && (
					<AscendantWindow title="FLAWS">
						<ul className="space-y-2">
							{data.flaws.map((flaw, i) => (
								<li key={flaw} className="flex items-start gap-2">
									<span className="text-red-400 font-bold">{i + 1}.</span>
									<span className="text-muted-foreground">
										<AutoLinkText text={flaw} />
									</span>
								</li>
							))}
						</ul>
					</AscendantWindow>
				)}
			</div>

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
