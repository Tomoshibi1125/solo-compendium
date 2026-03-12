import { Heart, Shield, Swords, Wand2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { jobs as staticJobs } from "@/data/compendium/jobs";
import { supabase } from "@/integrations/supabase/client";
import {
	calculateTotalChoices,
	getChoiceGrantDetails,
} from "@/lib/choiceCalculations";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { formatMonarchVernacular } from "@/lib/vernacular";
import { DetailHeader } from "./DetailHeader";

interface JobData {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	flavor_text?: string;
	hit_die: number;
	primary_abilities: string[];
	secondary_abilities?: string[];
	saving_throw_proficiencies: string[];
	armor_proficiencies?: string[];
	weapon_proficiencies?: string[];
	tool_proficiencies?: string[];
	skill_choices?: string[];
	skill_choice_count: number;
	tags?: string[];
	source_book?: string;
	image_url?: string | null;
	// DDB-parity fields (from static data fallback)
	starting_equipment?: string[][] | null;
	hit_points_at_first_level?: string | null;
	hit_points_at_higher_levels?: string | null;
	regent_prerequisites?: string | null;
	spellcasting_ability?: string | null;
	spellcasting_focus?: string | null;
	class_features?: Array<{
		level: number;
		name: string;
		description: string;
	}> | null;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	} | null;
}

interface JobFeature {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	level: number;
	action_type?: string;
	is_path_feature: boolean;
}

interface JobPath {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	path_level: number;
}

export const JobDetail = ({ data }: { data: JobData }) => {
	const [features, setFeatures] = useState<JobFeature[]>([]);
	const [paths, setPaths] = useState<JobPath[]>([]);
	const [relatedPowers, setRelatedPowers] = useState<
		Array<{
			id: string;
			name: string;
			display_name?: string | null;
			power_level: number;
		}>
	>([]);

	// Calculate total choices including awakening features
	const totalChoices = useMemo(() => {
		const staticJob = staticJobs.find((job) => job.name === data.name);
		if (!staticJob)
			return {
				skills: data.skill_choice_count,
				feats: 0,
				spells: 0,
				powers: 0,
				techniques: 0,
				runes: 0,
				items: 0,
				tools: 0,
				languages: 0,
				expertise: 0,
			};

		// Create enhanced job data that includes both database fields and static awakening features/traits
		const enhancedJobData = {
			...data,
			class_features: data.class_features ?? undefined,
			awakeningFeatures: staticJob.awakeningFeatures || [],
			jobTraits: staticJob.jobTraits || [],
		};

		return calculateTotalChoices(enhancedJobData, null, [], 1);
	}, [data]);

	// Get choice grant details for UI display
	const _choiceGrantDetails = useMemo(() => {
		const staticJob = staticJobs.find((job) => job.name === data.name);
		if (!staticJob) return [];

		// Create enhanced job data that includes both database fields and static awakening features/traits
		const enhancedJobData = {
			...data,
			class_features: data.class_features ?? undefined,
			awakeningFeatures: staticJob.awakeningFeatures || [],
			jobTraits: staticJob.jobTraits || [],
		};

		return getChoiceGrantDetails(enhancedJobData, null, [], 1);
	}, [data]);

	const displayName = formatMonarchVernacular(data.display_name || data.name);

	useEffect(() => {
		const fetchRelatedData = async () => {
			const [featuresRes, pathsRes, powersRes] = await Promise.all([
				supabase
					.from("compendium_job_features")
					.select("*")
					.eq("job_id", data.id)
					.eq("is_path_feature", false)
					.order("level"),
				supabase
					.from("compendium_job_paths")
					.select("*")
					.eq("job_id", data.id)
					.order("name"),
				supabase
					.from("compendium_powers")
					.select("id, name, display_name, power_level, source_book")
					.contains("job_names", [data.name])
					.limit(10),
			]);

			const featureRows = (featuresRes.data || []) as Array<
				JobFeature & { source_name?: string | null }
			>;
			const pathRows = (pathsRes.data || []) as Array<
				JobPath & { source_book?: string | null }
			>;
			const powerRows = (powersRes.data || []) as Array<{
				id: string;
				name: string;
				display_name?: string | null;
				power_level: number;
				source_book?: string | null;
			}>;

			const [accessibleFeatures, accessiblePaths, accessiblePowers] =
				await Promise.all([
					filterRowsBySourcebookAccess(
						featureRows,
						(feature) => feature.source_name,
					),
					filterRowsBySourcebookAccess(pathRows, (path) => path.source_book),
					filterRowsBySourcebookAccess(powerRows, (power) => power.source_book),
				]);

			setFeatures(
				accessibleFeatures.map((feature) => ({
					...feature,
					action_type: feature.action_type ?? undefined,
					display_name: feature.display_name ?? undefined,
				})),
			);
			setPaths(accessiblePaths);
			setRelatedPowers(
				accessiblePowers.map((power) => ({
					id: power.id,
					name: power.name,
					display_name: power.display_name ?? null,
					power_level: power.power_level,
				})),
			);
		};

		fetchRelatedData();
	}, [data.id, data.name]);

	return (
		<div className="space-y-6">
			{/* Class Concept Art */}
			{data.image_url && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={data.image_url}
						alt={displayName}
						size="hero"
						aspectRatio="landscape"
						className="max-w-2xl w-full rounded-lg"
						fallbackIcon={
							<Swords className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			{/* Header */}
			<DetailHeader
				entryType="jobs"
				entryId={data.id}
				title={displayName}
				subtitle={
					data.source_book
						? `Source: ${formatMonarchVernacular(data.source_book)}`
						: undefined
				}
			/>
			<SystemWindow
				title={displayName.toUpperCase()}
				className="border-primary/50"
			>
				<div className="space-y-4">
					{data.flavor_text && (
						<p className="text-muted-foreground italic border-l-2 border-primary/30 pl-4">
							{formatMonarchVernacular(data.flavor_text)}
						</p>
					)}
					<p className="text-foreground">
						{formatMonarchVernacular(data.description)}
					</p>

					{data.tags && data.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{data.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{formatMonarchVernacular(tag)}
								</Badge>
							))}
						</div>
					)}
				</div>
			</SystemWindow>

			{/* Core Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<SystemWindow title="HIT DIE" compact>
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-400" />
						<span className="font-display text-2xl">d{data.hit_die}</span>
					</div>
				</SystemWindow>

				<SystemWindow title="PRIMARY ABILITIES" compact>
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-yellow-400" />
						<span className="font-heading">
							{data.primary_abilities
								?.map(formatMonarchVernacular)
								.join(", ") || "None"}
						</span>
					</div>
				</SystemWindow>

				<SystemWindow title="SAVING THROWS" compact>
					<div className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-blue-400" />
						<span className="font-heading">
							{data.saving_throw_proficiencies
								?.map(formatMonarchVernacular)
								.join(", ") || "None"}
						</span>
					</div>
				</SystemWindow>

				<SystemWindow title="SKILL CHOICES" compact>
					<div className="flex items-center gap-2">
						<Swords className="w-5 h-5 text-green-400" />
						<span className="font-heading">Choose {totalChoices.skills}</span>
						{totalChoices.skills > data.skill_choice_count && (
							<Badge variant="secondary" className="text-xs">
								+{totalChoices.skills - data.skill_choice_count} from features
							</Badge>
						)}
						{/* Show other choice types if available */}
						{(totalChoices.feats > 0 ||
							totalChoices.spells > 0 ||
							totalChoices.powers > 0 ||
							totalChoices.techniques > 0 ||
							totalChoices.runes > 0 ||
							totalChoices.items > 0 ||
							totalChoices.tools > 0 ||
							totalChoices.languages > 0) && (
							<Badge variant="outline" className="text-xs ml-2">
								+
								{Object.values(totalChoices).reduce(
									(sum, val, idx) =>
										idx === 0 ? val - data.skill_choice_count : sum + val,
									0,
								)}{" "}
								more choices
							</Badge>
						)}
					</div>
				</SystemWindow>
			</div>

			{/* Hit Points */}
			{(data.hit_points_at_first_level || data.hit_points_at_higher_levels) && (
				<SystemWindow title="HIT POINTS">
					<div className="space-y-2">
						{data.hit_points_at_first_level && (
							<div>
								<span className="text-sm text-muted-foreground">
									At 1st Level:{" "}
								</span>
								<span className="font-heading">
									{data.hit_points_at_first_level}
								</span>
							</div>
						)}
						{data.hit_points_at_higher_levels && (
							<div>
								<span className="text-sm text-muted-foreground">
									At Higher Levels:{" "}
								</span>
								<span className="font-heading">
									{data.hit_points_at_higher_levels}
								</span>
							</div>
						)}
					</div>
				</SystemWindow>
			)}

			{/* Proficiencies */}
			<SystemWindow title="PROFICIENCIES">
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<h4 className="font-heading text-sm text-muted-foreground mb-2">
							Armor
						</h4>
						<p className="font-heading">
							{data.armor_proficiencies
								? data.armor_proficiencies
										.map(formatMonarchVernacular)
										.join(", ")
								: "None"}
						</p>
					</div>
					<div>
						<h4 className="font-heading text-sm text-muted-foreground mb-2">
							Weapons
						</h4>
						<p className="font-heading">
							{data.weapon_proficiencies
								? data.weapon_proficiencies
										.map(formatMonarchVernacular)
										.join(", ")
								: "None"}
						</p>
					</div>
					<div>
						<h4 className="font-heading text-sm text-muted-foreground mb-2">
							Tools
						</h4>
						<p className="font-heading">
							{data.tool_proficiencies
								? data.tool_proficiencies
										.map(formatMonarchVernacular)
										.join(", ")
								: "None"}
						</p>
					</div>
				</div>
				{data.skill_choices && data.skill_choices.length > 0 && (
					<div className="mt-4">
						<h4 className="font-heading text-sm text-muted-foreground mb-2">
							Skill Options
						</h4>
						<p className="font-heading">
							{data.skill_choices.map(formatMonarchVernacular).join(", ")}
						</p>
					</div>
				)}
			</SystemWindow>

			{/* Starting Equipment */}
			{data.starting_equipment && data.starting_equipment.length > 0 && (
				<SystemWindow title="STARTING EQUIPMENT">
					<ul className="space-y-2">
						{data.starting_equipment.map((choice, i) => (
							<li
								key={JSON.stringify(choice)}
								className="flex items-start gap-2"
							>
								<span className="text-primary font-heading">
									({String.fromCharCode(97 + i)})
								</span>
								<span className="font-heading">{choice.join(" or ")}</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}

			{/* Spellcasting */}
			{data.spellcasting_ability && (
				<SystemWindow title="SPELLCASTING">
					<div className="space-y-2">
						<div>
							<span className="text-sm text-muted-foreground">
								Spellcasting Ability:{" "}
							</span>
							<span className="font-heading font-semibold">
								{formatMonarchVernacular(data.spellcasting_ability)}
							</span>
						</div>
						{data.spellcasting_focus && (
							<div>
								<span className="text-sm text-muted-foreground">
									Spellcasting Focus:{" "}
								</span>
								<span className="font-heading">
									{formatMonarchVernacular(data.spellcasting_focus)}
								</span>
							</div>
						)}
					</div>
				</SystemWindow>
			)}

			{/* Regent Prerequisites */}
			{data.regent_prerequisites && (
				<SystemWindow title="REGENT PREREQUISITES">
					<p className="font-heading">{data.regent_prerequisites}</p>
				</SystemWindow>
			)}

			{/* Paths */}
			{paths.length > 0 && (
				<SystemWindow title="PATHS">
					<div className="grid md:grid-cols-2 gap-4">
						{paths.map((path) => (
							<Link
								key={path.id}
								to={`/compendium/paths/${path.id}`}
								className="glass-card p-4 border border-border hover:border-primary/30 transition-colors"
							>
								<h4 className="font-heading text-lg font-semibold text-primary mb-2 hover:underline">
									{formatMonarchVernacular(path.display_name || path.name)}
								</h4>
								<p className="text-sm text-muted-foreground line-clamp-3">
									{formatMonarchVernacular(path.description)}
								</p>
								<p className="text-xs text-muted-foreground mt-2">
									Available at level {path.path_level}
								</p>
							</Link>
						))}
					</div>
				</SystemWindow>
			)}

			{/* Related Powers */}
			{relatedPowers.length > 0 && (
				<SystemWindow title="RELATED POWERS">
					<div className="grid md:grid-cols-2 gap-3">
						{relatedPowers.map((power) => (
							<Link
								key={power.id}
								to={`/compendium/powers/${power.id}`}
								className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors group"
							>
								<Wand2 className="w-5 h-5 text-primary flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<h4 className="font-heading font-semibold group-hover:text-primary transition-colors truncate">
										{formatMonarchVernacular(power.display_name || power.name)}
									</h4>
									<p className="text-xs text-muted-foreground">
										{power.power_level === 0
											? "Cantrip"
											: `Tier ${power.power_level}`}
									</p>
								</div>
							</Link>
						))}
					</div>
					<Link
						to={`/compendium?category=powers&search=${encodeURIComponent(data.name)}`}
						className="block mt-4 text-sm text-primary hover:underline text-center"
					>
						View all powers for {displayName} →
					</Link>
				</SystemWindow>
			)}

			{/* Spellcasting Table (for caster jobs with spell slot data) */}
			{data.spellcasting?.spellSlots &&
				Object.keys(data.spellcasting.spellSlots).length > 0 && (
					<SystemWindow title="SPELLCASTING TABLE">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 px-2 font-heading text-muted-foreground">
											Level
										</th>
										{data.spellcasting.cantripsKnown && (
											<th className="text-center py-2 px-2 font-heading text-muted-foreground">
												Cantrips
											</th>
										)}
										{data.spellcasting.spellsKnown && (
											<th className="text-center py-2 px-2 font-heading text-muted-foreground">
												Spells Known
											</th>
										)}
										{Object.keys(data.spellcasting.spellSlots)
											.sort((a, b) => Number(a) - Number(b))
											.map((slotLevel) => (
												<th
													key={slotLevel}
													className="text-center py-2 px-2 font-heading text-muted-foreground"
												>
													{slotLevel === "1"
														? "1st"
														: slotLevel === "2"
															? "2nd"
															: slotLevel === "3"
																? "3rd"
																: `${slotLevel}th`}
												</th>
											))}
									</tr>
								</thead>
								<tbody>
									{Array.from({ length: 20 }, (_, i) => i).map((levelIdx) => (
										<tr
											key={levelIdx}
											className="border-b border-border/50 hover:bg-muted/20"
										>
											<td className="py-1.5 px-2 font-heading font-semibold">
												{levelIdx + 1}
											</td>
											{data.spellcasting?.cantripsKnown && (
												<td className="text-center py-1.5 px-2 font-heading">
													{data.spellcasting?.cantripsKnown[levelIdx] ?? "—"}
												</td>
											)}
											{data.spellcasting?.spellsKnown && (
												<td className="text-center py-1.5 px-2 font-heading">
													{data.spellcasting?.spellsKnown[levelIdx] ?? "—"}
												</td>
											)}
											{Object.keys(data.spellcasting?.spellSlots ?? {})
												.sort((a, b) => Number(a) - Number(b))
												.map((slotLevel) => (
													<td
														key={slotLevel}
														className="text-center py-1.5 px-2 font-heading"
													>
														{data.spellcasting?.spellSlots?.[slotLevel][
															levelIdx
														] || "—"}
													</td>
												))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</SystemWindow>
				)}

			{/* Features by Level (DB features) */}
			{features.length > 0 && (
				<SystemWindow title="CLASS FEATURES">
					<div className="space-y-4">
						{features.map((feature) => (
							<div
								key={feature.id}
								className="border-l-2 border-primary/30 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<h4 className="font-heading font-semibold">
										{formatMonarchVernacular(
											feature.display_name || feature.name,
										)}
									</h4>
									<Badge variant="outline" className="text-xs">
										Level {feature.level}
									</Badge>
									{feature.action_type && (
										<Badge variant="secondary" className="text-xs">
											{feature.action_type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{formatMonarchVernacular(feature.description)}
								</p>
							</div>
						))}
					</div>
				</SystemWindow>
			)}

			{/* Static Class Features Fallback (level progression table from static data) */}
			{features.length === 0 &&
				data.class_features &&
				data.class_features.length > 0 && (
					<SystemWindow title="LEVEL PROGRESSION">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-2 px-3 font-heading text-muted-foreground w-16">
											Level
										</th>
										<th className="text-left py-2 px-3 font-heading text-muted-foreground w-48">
											Feature
										</th>
										<th className="text-left py-2 px-3 font-heading text-muted-foreground">
											Description
										</th>
									</tr>
								</thead>
								<tbody>
									{data.class_features.map((cf) => (
										<tr
											key={`cf-${cf.level}-${cf.name}`}
											className="border-b border-border/50 hover:bg-muted/20"
										>
											<td className="py-2 px-3 font-heading font-semibold text-primary">
												{cf.level}
											</td>
											<td className="py-2 px-3 font-heading font-semibold">
												{formatMonarchVernacular(cf.name)}
											</td>
											<td className="py-2 px-3 text-sm text-muted-foreground">
												{formatMonarchVernacular(cf.description)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</SystemWindow>
				)}
		</div>
	);
};
