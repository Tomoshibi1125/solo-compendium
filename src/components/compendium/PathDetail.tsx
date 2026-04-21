import { GitBranch, Shield, Star, Swords, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumPath } from "@/types/compendium";

interface PathData extends CompendiumPath {}

interface PathFeature {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	level: number;
	action_type?: string | null;
	recharge?: string | null;
	uses_formula?: string | null;
	prerequisites?: string | null;
}

export const PathDetail = ({ data }: { data: PathData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const pathLevel = data.level;
	const [features, setFeatures] = useState<PathFeature[]>([]);
	const [jobName, setJobName] = useState<string | null>(null);

	useEffect(() => {
		let isCancelled = false;

		const loadPathData = async () => {
			// Features come directly from the canonical static path.
			const staticFeatures: PathFeature[] = (data.features || [])
				.slice()
				.sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
				.map((feature, idx) => ({
					id: `${data.id}-path-feat-${idx}`,
					name: feature.name,
					description: feature.description,
					level: feature.level,
				}));

			if (!isCancelled) setFeatures(staticFeatures);

			const jobId = data.job_id;
			if (!jobName && jobId) {
				const canonicalJobs = await listCanonicalEntries("jobs");
				const jobIdKey = jobId.trim().toLowerCase();
				const match = canonicalJobs.find(
					(j) => j.id.trim().toLowerCase() === jobIdKey,
				);
				if (!isCancelled) {
					setJobName(match?.display_name || match?.name || null);
				}
			}
		};

		loadPathData();

		return () => {
			isCancelled = true;
		};
	}, [data.id, data.job_id, data.features, jobName]);

	const abilityFeatures = useMemo(
		() =>
			features.filter(
				(feature) =>
					feature.action_type || feature.recharge || feature.uses_formula,
			),
		[features],
	);
	const abilityIds = useMemo(
		() => new Set(abilityFeatures.map((feature) => feature.id)),
		[abilityFeatures],
	);
	const coreFeatures = useMemo(
		() => features.filter((feature) => !abilityIds.has(feature.id)),
		[features, abilityIds],
	);

	const getTierIcon = (tier?: number) => {
		switch (tier) {
			case 1:
				return <Star className="w-5 h-5 text-rare" />;
			case 2:
				return <Zap className="w-5 h-5 text-very-rare" />;
			case 3:
				return <Shield className="w-5 h-5 text-legendary" />;
			default:
				return <GitBranch className="w-5 h-5" />;
		}
	};

	const getTierColor = (tier?: number) => {
		switch (tier) {
			case 1:
				return "text-rare border-rare/40 bg-rare/10";
			case 2:
				return "text-very-rare border-very-rare/40 bg-very-rare/10";
			case 3:
				return "text-legendary border-legendary/40 bg-legendary/10";
			default:
				return "text-muted-foreground border-border";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h2 className="text-2xl font-bold font-heading flex items-center gap-2">
						{getTierIcon(data.level)}
						{displayName}
					</h2>
					{jobName && (
						<p className="text-muted-foreground mt-1">
							Subclass of{" "}
							<span className="font-semibold">
								{formatRegentVernacular(jobName)}
							</span>
						</p>
					)}
				</div>
				{data.level && (
					<Badge className={getTierColor(data.level)}>Tier {data.level}</Badge>
				)}
			</div>

			<Separator />

			{/* Description */}
			<div>
				<h3 className="text-lg font-semibold mb-3 font-heading">Overview</h3>
				{data.flavor && (
					<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
						<AutoLinkText text={data.flavor} />
					</p>
				)}
				<p className="text-muted-foreground leading-relaxed">
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
									typeof data.lore === "string"
										? data.lore
										: data.lore?.history || ""
								}
							/>
						</p>
					</div>
				)}
				{data.mechanics && Object.keys(data.mechanics).length > 0 && (
					<div className="mt-6 pt-4 border-t border-cyan/10">
						<h4 className="text-cyan font-bold text-[10px] uppercase tracking-wider mb-2">
							Path Mechanics
						</h4>
						<pre className="whitespace-pre-wrap font-mono bg-void/50 p-3 rounded text-xs text-muted-foreground overflow-hidden">
							{JSON.stringify(data.mechanics, null, 2)}
						</pre>
					</div>
				)}
			</div>

			{/* Requirements */}
			{(pathLevel || data.prerequisites) && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">
						Requirements
					</h3>
					<div className="space-y-2">
						{pathLevel && (
							<div className="flex items-center gap-2">
								<Swords className="w-4 h-4" />
								<span>Level {pathLevel}</span>
							</div>
						)}
						{data.prerequisites && (
							<div className="text-sm text-muted-foreground">
								Prerequisites: {formatRegentVernacular(data.prerequisites)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Features */}
			<div>
				<h3 className="text-lg font-semibold mb-3 font-heading">
					Path Features
				</h3>
				{coreFeatures.length === 0 ? (
					<div className="text-sm text-muted-foreground">
						No path features available yet.
					</div>
				) : (
					<div className="space-y-4">
						{coreFeatures.map((feature) => (
							<div key={feature.id} className="p-4 bg-card border rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-sm font-medium text-primary">
										Level {feature.level}
									</span>
									<span className="font-semibold">
										{formatRegentVernacular(
											feature.display_name || feature.name,
										)}
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									<AutoLinkText text={feature.description} />
								</p>
								{(feature.action_type ||
									feature.recharge ||
									feature.uses_formula) && (
									<div className="flex gap-4 text-xs text-muted-foreground mt-2">
										{feature.action_type && (
											<span>
												Action: {formatRegentVernacular(feature.action_type)}
											</span>
										)}
										{feature.recharge && (
											<span>
												Recharge: {formatRegentVernacular(feature.recharge)}
											</span>
										)}
										{feature.uses_formula && (
											<span>
												Uses: {formatRegentVernacular(feature.uses_formula)}
											</span>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Abilities */}
			{abilityFeatures.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">
						Signature Abilities
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{abilityFeatures.map((ability) => (
							<div key={ability.id} className="p-4 bg-card border rounded-lg">
								<h4 className="font-semibold mb-2">
									{formatRegentVernacular(ability.display_name || ability.name)}
								</h4>
								<p className="text-sm text-muted-foreground mb-3">
									<AutoLinkText text={ability.description} />
								</p>
								<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
									{ability.action_type && (
										<span>
											Action: {formatRegentVernacular(ability.action_type)}
										</span>
									)}
									{ability.recharge && (
										<span>
											Recharge: {formatRegentVernacular(ability.recharge)}
										</span>
									)}
									{ability.uses_formula && (
										<span>
											Uses: {formatRegentVernacular(ability.uses_formula)}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Tags */}
			{data.tags && data.tags.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{data.tags.map((tag, _index) => (
							<Badge key={tag} variant="secondary" className="capitalize">
								{formatRegentVernacular(tag.replace("-", " "))}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Source */}
			{data.source_book && (
				<div className="text-sm text-muted-foreground">
					Source: {formatRegentVernacular(data.source_book)}
				</div>
			)}
		</div>
	);
};
