import { GitBranch, Shield, Star, Swords, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { DetailMetaFooter } from "@/components/compendium/DetailMetaFooter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { formatActionType, formatRecharge } from "@/lib/labels";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumPath } from "@/types/compendium";

interface PathData extends CompendiumPath {}

interface PathMechanics {
	action_type?: string | null;
	cost?: string | null;
	recharge?: string | null;
	resource?: string | null;
	uses_formula?: string | null;
}

interface PathFeature extends PathMechanics {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	level: number;
	prerequisites?: string | null;
}

const formatRestRecharge = (recharge: "short-rest" | "long-rest") =>
	recharge === "long-rest" ? "Long Rest" : "Short Rest";

const sameMechanic = (
	left: string | null | undefined,
	right: string | null | undefined,
) =>
	Boolean(
		left && right && left.trim().toLowerCase() === right.trim().toLowerCase(),
	);

const MechanicDetails = ({ mechanics }: { mechanics: PathMechanics }) => {
	const {
		action_type: actionType,
		cost,
		recharge,
		resource,
		uses_formula: usesFormula,
	} = mechanics;
	if (!actionType && !cost && !resource && !usesFormula && !recharge)
		return null;

	return (
		<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
			{actionType && <span>Action: {formatActionType(actionType)}</span>}
			{cost && <span>Cost: {formatRegentVernacular(cost)}</span>}
			{resource && <span>Resource: {formatRegentVernacular(resource)}</span>}
			{usesFormula && <span>Uses: {formatRegentVernacular(usesFormula)}</span>}
			{recharge && <span>Cadence: {formatRecharge(recharge)}</span>}
		</div>
	);
};

export const PathDetail = ({ data }: { data: PathData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const pathLevel = data.level;
	const pathTier = data.path_tier ?? (data as { tier?: number }).tier;
	const [features, setFeatures] = useState<PathFeature[]>([]);
	const [jobName, setJobName] = useState<string | null>(null);

	useEffect(() => {
		let isCancelled = false;

		const loadPathData = async () => {
			const staticFeatures: PathFeature[] = (data.features || [])
				.slice()
				.sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
				.map((feature, idx) => ({
					id: `${data.id}-path-feat-${idx}`,
					name: feature.name,
					description: feature.description,
					level: feature.level,
					action_type: feature.actionType ?? null,
					recharge: feature.uses
						? formatRestRecharge(feature.uses.recharge)
						: null,
					resource: feature.resource ?? null,
					uses_formula:
						feature.uses?.formula ??
						(feature.tracking === "manual"
							? "Manual tracking (source cadence unspecified)"
							: null),
				}));

			if (!isCancelled) setFeatures(staticFeatures);

			const jobId = data.job_id;
			if (!jobName && jobId) {
				const canonicalJobs = await listCanonicalEntries("jobs");
				const jobIdKey = jobId.trim().toLowerCase();
				const match = canonicalJobs.find(
					(job) => job.id.trim().toLowerCase() === jobIdKey,
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
			(data.abilities || []).map((ability, idx): PathFeature => {
				const description = ability.description.toLowerCase();
				const recharge = ability.uses
					? formatRestRecharge(ability.uses.recharge)
					: description.includes("long rest")
						? "Long Rest"
						: description.includes("short rest")
							? "Short Rest"
							: null;
				const actionType = ability.actionType ?? null;
				const resource = ability.resource ?? null;
				const authoredCost = ability.cost?.trim() || null;
				const cost =
					authoredCost &&
					!sameMechanic(authoredCost, actionType) &&
					!sameMechanic(authoredCost, resource)
						? authoredCost
						: null;
				return {
					id: `${data.id}-ability-${idx}`,
					name: ability.name,
					display_name: ability.name,
					description: ability.description,
					level: ability.level ?? pathLevel,
					action_type: actionType,
					cost,
					recharge,
					resource,
					uses_formula:
						ability.uses?.formula ??
						(ability.tracking === "manual"
							? "Manual tracking (source cadence unspecified)"
							: null),
				};
			}),
		[data.abilities, data.id, pathLevel],
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
			<div className="flex items-start justify-between">
				<div>
					<h2 className="text-2xl font-bold font-heading flex items-center gap-2">
						{getTierIcon(pathTier)}
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
				<div className="flex flex-wrap items-center gap-2">
					{pathLevel > 0 && (
						<Badge variant="outline">Unlock Level {pathLevel}</Badge>
					)}
					{pathTier !== undefined && (
						<Badge className={getTierColor(pathTier)}>
							Path Tier {pathTier}
						</Badge>
					)}
					{data.pathType && (
						<Badge variant="secondary">
							{formatRegentVernacular(data.pathType)}
						</Badge>
					)}
				</div>
			</div>

			<Separator />

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
			</div>

			{/* Requirements */}
			{(pathLevel || data.prerequisites || data.requirements) && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">
						Requirements
					</h3>
					<div className="space-y-2 text-sm">
						{pathLevel > 0 && (
							<div className="flex items-center gap-2">
								<Swords className="w-4 h-4" />
								<span>Level {pathLevel}</span>
							</div>
						)}
						{data.requirements?.skills &&
							data.requirements.skills.length > 0 && (
								<div>
									<span className="text-muted-foreground">Skills: </span>
									{data.requirements.skills
										.map(formatRegentVernacular)
										.join(", ")}
								</div>
							)}
						{data.requirements?.abilities &&
							data.requirements.abilities.length > 0 && (
								<div>
									<span className="text-muted-foreground">Abilities: </span>
									{data.requirements.abilities
										.map(formatRegentVernacular)
										.join(", ")}
								</div>
							)}
						{data.requirements?.prerequisites &&
							data.requirements.prerequisites.length > 0 && (
								<div>
									<span className="text-muted-foreground">Other: </span>
									{data.requirements.prerequisites
										.map(formatRegentVernacular)
										.join(", ")}
								</div>
							)}
						{data.prerequisites &&
							!data.requirements?.skills?.length &&
							!data.requirements?.abilities?.length &&
							!data.requirements?.prerequisites?.length && (
								<div className="text-muted-foreground">
									Prerequisites: {formatRegentVernacular(data.prerequisites)}
								</div>
							)}
					</div>
				</div>
			)}

			<div>
				<h3 className="text-lg font-semibold mb-3 font-heading">
					Path Features
				</h3>
				{features.length === 0 ? (
					<div className="text-sm text-muted-foreground">
						No path features available yet.
					</div>
				) : (
					<div className="space-y-4">
						{features.map((feature) => (
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
								<MechanicDetails mechanics={feature} />
							</div>
						))}
					</div>
				)}
			</div>

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
								<MechanicDetails mechanics={ability} />
							</div>
						))}
					</div>
				</div>
			)}

			{data.stats && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">
						Path Bonuses
					</h3>
					<div className="p-4 bg-card border rounded-lg">
						<div className="flex gap-4 mb-2">
							<span className="text-sm text-muted-foreground">
								Primary:{" "}
								<span className="font-medium text-foreground">
									{formatRegentVernacular(data.stats.primaryAttribute)}
								</span>
							</span>
							{data.stats.secondaryAttribute && (
								<span className="text-sm text-muted-foreground">
									Secondary:{" "}
									<span className="font-medium text-foreground">
										{formatRegentVernacular(data.stats.secondaryAttribute)}
									</span>
								</span>
							)}
						</div>
						{data.stats.bonusStats &&
							Object.keys(data.stats.bonusStats).length > 0 && (
								<div className="text-sm mt-3">
									<span className="text-muted-foreground block mb-2">
										Bonus Stats:{" "}
									</span>
									<div className="flex flex-wrap gap-2">
										{Object.entries(data.stats.bonusStats).map(
											([stat, val]) => (
												<Badge key={stat} variant="outline">
													{formatRegentVernacular(stat)} +{val}
												</Badge>
											),
										)}
									</div>
								</div>
							)}
					</div>
				</div>
			)}

			{data.tags && data.tags.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3 font-heading">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{[...new Set(data.tags)].map((tag) => (
							<Badge key={tag} variant="secondary" className="capitalize">
								{formatRegentVernacular(tag.replace("-", " "))}
							</Badge>
						))}
					</div>
				</div>
			)}

			{data.source_book && (
				<div className="text-sm text-muted-foreground">
					Source: {formatRegentVernacular(data.source_book)}
				</div>
			)}
			<DetailMetaFooter
				extra={[
					{
						label: "Job",
						value: (data as { job_name?: string | null }).job_name,
					},
					{
						label: "Unlocks at Level",
						value: (data as { path_level?: number | null }).path_level,
					},
					{ label: "Tier", value: (data as { tier?: number | null }).tier },
				]}
			/>
		</div>
	);
};
