import { Heart, Shield, Swords, Wand2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumJob } from "@/types/compendium";
import { DetailHeader } from "./DetailHeader";

interface JobData extends CompendiumJob {}

export interface JobFeature {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string;
	level: number;
	action_type?: string;
	is_path_feature: boolean;
}

export interface JobPath {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string;
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

	const displayName = formatRegentVernacular(data.display_name || data.name);

	useEffect(() => {
		const fetchRelatedData = async () => {
			// Canonical static job class_features
			const staticFeatures = (data.class_features || []).map(
				(feature, idx) => ({
					id: `${data.id}-feat-${idx}`,
					name: feature.name,
					description: feature.description,
					level: feature.level,
					is_path_feature: false,
					action_type: undefined,
				}),
			);

			// Canonical static paths linked to this job by jobId/job_id/jobName.
			const allPaths = await listCanonicalEntries("paths");
			const jobKey = (data.name || "").trim().toLowerCase();
			const jobIdKey = (data.id || "").trim().toLowerCase();
			const matchedPaths = allPaths
				.filter((p) => {
					const linkedJobName =
						(p as { jobName?: string | null }).jobName ?? p.job_name ?? null;
					const linkedJobId =
						(p as { jobId?: string | null }).jobId ??
						(p as { job_id?: string | null }).job_id ??
						null;
					return (
						(typeof linkedJobName === "string" &&
							linkedJobName.trim().toLowerCase() === jobKey) ||
						(typeof linkedJobId === "string" &&
							linkedJobId.trim().toLowerCase() === jobIdKey)
					);
				})
				.map((p) => ({
					id: p.id,
					name: p.name,
					display_name: p.display_name ?? null,
					description: p.description ?? "",
					path_level: p.path_level ?? p.level ?? 3,
				}));

			// Canonical static powers/spells tagged with this job name.
			const powers = await listCanonicalEntries("powers");
			const matchedPowers = powers
				.filter((power) => {
					const tags = (power.tags || []).map((t) => t.toLowerCase());
					return tags.includes(jobKey);
				})
				.slice(0, 10)
				.map((power) => ({
					id: power.id,
					name: power.name,
					display_name: power.display_name ?? null,
					power_level: power.power_level ?? power.level ?? 0,
				}));

			setFeatures(staticFeatures);
			setPaths(matchedPaths);
			setRelatedPowers(matchedPowers);
		};

		fetchRelatedData();
	}, [data.id, data.name, data.class_features]);

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
						? `Source: ${formatRegentVernacular(data.source_book)}`
						: undefined
				}
			/>
			<AscendantWindow
				title={displayName.toUpperCase()}
				className="border-primary/50"
			>
				<div className="space-y-4">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
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
								Base Concept Mechanics
							</h4>
							<pre className="whitespace-pre-wrap font-mono bg-void/50 p-3 rounded text-xs text-muted-foreground overflow-hidden">
								{JSON.stringify(data.mechanics, null, 2)}
							</pre>
						</div>
					)}

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

			{/* Core Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<AscendantWindow title="HIT DIE" compact>
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-400" />
						<span className="font-display text-2xl">
							{data.hit_dice || "d10"}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="PRIMARY ABILITIES" compact>
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-yellow-400" />
						<span className="font-heading">
							{data.primary_abilities?.map(formatRegentVernacular).join(", ") ||
								"None"}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="SAVING THROWS" compact>
					<div className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-blue-400" />
						<span className="font-heading">
							{data.saving_throws?.map(formatRegentVernacular).join(", ") ||
								"None"}
						</span>
					</div>
				</AscendantWindow>

				<AscendantWindow title="SKILL CHOICES" compact>
					<div className="flex items-center gap-2">
						<Swords className="w-5 h-5 text-green-400" />
						<span className="font-heading">
							Choose {data.skill_choices?.length || 2}
						</span>
					</div>
				</AscendantWindow>
			</div>

			{/* Hit Points */}
			{(data.hp_at_level_1 || data.hp_at_higher_levels) && (
				<AscendantWindow title="HIT POINTS">
					<div className="space-y-2">
						{data.hp_at_level_1 && (
							<div>
								<span className="text-sm text-muted-foreground">
									At 1st Level:{" "}
								</span>
								<span className="font-heading">{data.hp_at_level_1}</span>
							</div>
						)}
						{data.hp_at_higher_levels && (
							<div>
								<span className="text-sm text-muted-foreground">
									At Higher Levels:{" "}
								</span>
								<span className="font-heading">{data.hp_at_higher_levels}</span>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Proficiencies */}
			<AscendantWindow title="PROFICIENCIES">
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<h4 className="font-heading text-sm text-muted-foreground mb-2">
							Armor
						</h4>
						<p className="font-heading">
							{data.armor_proficiencies
								? data.armor_proficiencies
										.map(formatRegentVernacular)
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
										.map(formatRegentVernacular)
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
								? data.tool_proficiencies.map(formatRegentVernacular).join(", ")
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
							{data.skill_choices.map(formatRegentVernacular).join(", ")}
						</p>
					</div>
				)}
			</AscendantWindow>

			{/* Starting Equipment */}
			{data.starting_equipment && data.starting_equipment.length > 0 && (
				<AscendantWindow title="STARTING EQUIPMENT">
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
				</AscendantWindow>
			)}

			{/* Spellcasting */}
			{data.spellcasting && (
				<AscendantWindow title="SPELLCASTING">
					<div className="space-y-2">
						<div>
							<span className="text-sm text-muted-foreground">
								Spellcasting Ability:{" "}
							</span>
							<span className="font-heading font-semibold">
								{formatRegentVernacular(data.spellcasting.ability)}
							</span>
						</div>
						{data.spellcasting.focus && (
							<div>
								<span className="text-sm text-muted-foreground">
									Spellcasting Focus:{" "}
								</span>
								<span className="font-heading">
									{formatRegentVernacular(data.spellcasting.focus)}
								</span>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Racial Traits (Awakening lineage — the "race" half of the Job). */}
			{data.racial_traits && data.racial_traits.length > 0 && (
				<AscendantWindow title="INNATE RACIAL TRAITS">
					<div className="space-y-3">
						{data.racial_traits.map((t) => (
							<div
								key={t.name}
								className="p-3 rounded bg-primary/5 border border-primary/10"
							>
								<div className="flex items-baseline justify-between gap-2 mb-1">
									<h4 className="font-heading font-semibold text-primary">
										{formatRegentVernacular(t.name)}
									</h4>
									{t.type && (
										<span className="text-[10px] uppercase tracking-wider text-muted-foreground">
											{t.type}
										</span>
									)}
								</div>
								<p className="text-sm text-foreground/80">
									<AutoLinkText text={t.description} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Natural Weapons */}
			{data.natural_weapons && data.natural_weapons.length > 0 && (
				<AscendantWindow title="NATURAL WEAPONS">
					<div className="space-y-2">
						{data.natural_weapons.map((nw) => (
							<div
								key={nw.name}
								className="p-3 rounded border border-border flex flex-col gap-1"
							>
								<div className="flex items-baseline justify-between">
									<h4 className="font-heading font-semibold">
										{formatRegentVernacular(nw.name)}
									</h4>
									<span className="font-display text-sm text-amber-400">
										{nw.damage} {nw.damage_type}
									</span>
								</div>
								{nw.description && (
									<p className="text-xs text-muted-foreground">
										{nw.description}
									</p>
								)}
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Natural Armor */}
			{data.natural_armor && (
				<AscendantWindow title="NATURAL ARMOR">
					<div className="space-y-1">
						<p className="font-heading">
							Base AC: {data.natural_armor.baseAC}
							{data.natural_armor.abilityMod &&
								` + ${data.natural_armor.abilityMod} mod`}
							{data.natural_armor.addDex && " + Dex mod"}
						</p>
						{data.natural_armor.description && (
							<p className="text-sm text-muted-foreground">
								{data.natural_armor.description}
							</p>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Resonance Breath */}
			{data.resonance_breath && (
				<AscendantWindow title="RESONANCE BREATH">
					<div className="p-3 rounded border border-border">
						<div className="flex items-baseline justify-between mb-1">
							<h4 className="font-heading font-semibold text-primary">
								{data.resonance_breath.name}
							</h4>
							<span className="font-display text-sm text-amber-400">
								{data.resonance_breath.damage_die}{" "}
								{data.resonance_breath.damage_type}
							</span>
						</div>
						<p className="text-sm text-foreground/80">
							{data.resonance_breath.size}-ft {data.resonance_breath.shape}.{" "}
							{data.resonance_breath.save} save for half. Recharges on a{" "}
							{data.resonance_breath.rechargeRest}.
						</p>
					</div>
				</AscendantWindow>
			)}

			{/* Innate Channeling */}
			{data.innate_channeling && data.innate_channeling.spells.length > 0 && (
				<AscendantWindow title="INNATE CHANNELING">
					<p className="text-sm text-muted-foreground mb-3">
						Spellcasting ability:{" "}
						<span className="font-heading text-foreground">
							{formatRegentVernacular(data.innate_channeling.ability)}
						</span>
					</p>
					<div className="space-y-2">
						{data.innate_channeling.spells.map((sp) => (
							<div key={sp.name} className="p-3 rounded border border-border">
								<div className="flex items-baseline justify-between mb-1">
									<h4 className="font-heading font-semibold">
										{formatRegentVernacular(sp.name)}
									</h4>
									<span className="text-xs text-muted-foreground">
										{sp.uses === "at-will"
											? "At will"
											: sp.uses
												? `${sp.uses.value}/${sp.uses.per}`
												: ""}
										{" · unlock lvl "}
										{sp.unlockLevel}
									</span>
								</div>
								{sp.description && (
									<p className="text-xs text-muted-foreground">
										{sp.description}
									</p>
								)}
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Bonus HP per level */}
			{typeof data.bonus_hp_per_level === "number" &&
				data.bonus_hp_per_level > 0 && (
					<AscendantWindow title="REINFORCED CONSTITUTION">
						<p className="font-heading">
							+{data.bonus_hp_per_level} HP per character level (racial).
						</p>
					</AscendantWindow>
				)}

			{/* Regent Prerequisites */}
			{data.regent_requirements && (
				<AscendantWindow title="REGENT PREREQUISITES">
					<p className="font-heading italic">
						{data.regent_requirements.quest_completion ||
							"Designated Regent Quest required."}
					</p>
				</AscendantWindow>
			)}

			{/* Paths */}
			{paths.length > 0 && (
				<div id="paths-section">
					<AscendantWindow title="PATHS">
						<div className="grid md:grid-cols-2 gap-4">
							{paths.map((path) => (
								<Link
									key={path.id}
									to={`/compendium/paths/${path.id}`}
									className="glass-card p-4 border border-border hover:border-primary/30 transition-colors"
								>
									<h4 className="font-heading text-lg font-semibold text-primary mb-2 hover:underline">
										{formatRegentVernacular(path.display_name || path.name)}
									</h4>
									<p className="text-sm text-muted-foreground line-clamp-3">
										{formatRegentVernacular(path.description)}
									</p>
									<p className="text-xs text-muted-foreground mt-2">
										Available at level {path.path_level}
									</p>
								</Link>
							))}
						</div>
					</AscendantWindow>
				</div>
			)}

			{/* Related Powers */}
			{relatedPowers.length > 0 && (
				<AscendantWindow title="RELATED POWERS">
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
										{formatRegentVernacular(power.display_name || power.name)}
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
				</AscendantWindow>
			)}

			{/* Spellcasting Table (for caster jobs with spell slot data) */}
			{data.spellcasting?.spellSlots &&
				Object.keys(data.spellcasting.spellSlots).length > 0 && (
					<AscendantWindow title="SPELLCASTING TABLE">
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
					</AscendantWindow>
				)}

			{/* Features by Level (DB features) */}
			{features.length > 0 && (
				<AscendantWindow title="CLASS FEATURES">
					<div className="space-y-4">
						{features.map((feature) => (
							<div
								key={feature.id}
								className="border-l-2 border-primary/30 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<h4 className="font-heading font-semibold">
										{feature.name.toLowerCase() === "path feature" ? (
											<a
												href="#paths-section"
												className="text-primary hover:underline"
											>
												{formatRegentVernacular(
													feature.display_name || feature.name,
												)}{" "}
												<span className="text-xs font-normal text-muted-foreground">
													(See Paths)
												</span>
											</a>
										) : (
											formatRegentVernacular(
												feature.display_name || feature.name,
											)
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
									<AutoLinkText text={feature.description || ""} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Static Class Features Fallback (level progression table from static data) */}
			{features.length === 0 &&
				data.class_features &&
				data.class_features.length > 0 && (
					<AscendantWindow title="LEVEL PROGRESSION">
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
												{cf.name.toLowerCase() === "path feature" ? (
													<a
														href="#paths-section"
														className="text-primary hover:underline"
													>
														{formatRegentVernacular(cf.name)}{" "}
														<span className="text-xs font-normal text-muted-foreground">
															(See Paths)
														</span>
													</a>
												) : (
													formatRegentVernacular(cf.name)
												)}
											</td>
											<td className="py-2 px-3 text-sm text-muted-foreground">
												<AutoLinkText text={cf.description || ""} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</AscendantWindow>
				)}
		</div>
	);
};
