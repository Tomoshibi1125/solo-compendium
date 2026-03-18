import { Crown, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import type { Regent } from "@/lib/regentTypes";
import { formatRegentVernacular, REGENT_LABEL } from "@/lib/vernacular";

interface RegentDetailProps {
	data: Regent;
}

interface CombinedFeature {
	id?: string;
	name: string;
	description: string;
	level: number;
	is_signature: boolean;
	type?: string;
	recharge?: string;
}

export const RegentDetail = ({ data }: RegentDetailProps) => {
	const displayName = formatRegentVernacular(data.name);
	const displayTitle = formatRegentVernacular(data.title || data.name);
	const displayTheme = formatRegentVernacular(data.theme || "");

	const classFeatures: CombinedFeature[] = (data.class_features || []).map(
		(f) => ({
			id: `cf-${f.level}-${f.name}`,
			name: f.name,
			description: f.description,
			level: f.level,
			is_signature: f.level >= 11,
			type: f.type,
			recharge: f.frequency,
		}),
	);

	const abilities: CombinedFeature[] = (data.abilities || []).map((a) => ({
		id: `ability-${a.name}`,
		name: a.name,
		description: a.description,
		level: a.power_level || 0,
		is_signature: (a.power_level || 0) >= 11, // Level 11+ is signature/ascendant
		type: a.type,
		recharge: a.frequency,
	}));

	const dataFeatures: CombinedFeature[] = (data.features || []).map((f) => ({
		id: `feature-${f.name}`,
		name: f.name,
		description: f.description,
		level: f.power_level || 0,
		is_signature: (f.power_level || 0) >= 11,
	}));

	const allFeatures = [...classFeatures, ...abilities, ...dataFeatures]
		.filter(
			(feature, index, self) =>
				index === self.findIndex((t) => t.name === feature.name),
		)
		.sort((a, b) => a.level - b.level);

	const signatureFeatures = allFeatures.filter((f) => f.is_signature);
	const regularFeatures = allFeatures.filter((f) => !f.is_signature);

	return (
		<div className="space-y-6">
			{/* Header */}
			<SystemWindow
				title={displayName.toUpperCase()}
				className="border-amber-500/50 border-2"
			>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Crown className="w-8 h-8 text-amber-400" />
						<div>
							<h2 className="font-display text-2xl gradient-text-system">
								{displayTitle}
							</h2>
							<p className="text-muted-foreground">{displayTheme}</p>
						</div>
					</div>

					{data.description && (
						<p className="text-foreground">
							{formatRegentVernacular(data.description)}
						</p>
					)}

					<div className="flex flex-wrap gap-2">
						<Badge className="bg-amber-600 text-white border-amber-400">
							<Crown className="w-3 h-3 mr-1" /> DM VERIFIED ACCESS
						</Badge>
						{data.hit_dice && (
							<Badge variant="secondary">Hit Die: {data.hit_dice}</Badge>
						)}
						{data.primary_ability?.map((ability) => (
							<Badge key={ability} variant="outline">
								{formatRegentVernacular(ability)}
							</Badge>
						))}
					</div>
				</div>
			</SystemWindow>

			{/* Requirements & Ascension Logic */}
			{(data.requirements || data.regent_requirements) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<SystemWindow title="ASCENSION REQUIREMENTS">
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-amber-400 font-semibold">
								<Crown className="w-4 h-4" /> DM MANUAL VERIFICATION REQUIRED
							</div>

							<div className="space-y-2">
								<p className="text-sm uppercase tracking-wider text-muted-foreground font-display font-bold">
									Current Quest Objective
								</p>
								<p className="text-foreground border-l-2 border-amber-500/30 pl-4 py-1 italic">
									{formatRegentVernacular(
										data.requirements?.quest_completion ||
											data.regent_requirements?.quest_completion ||
											"Complete the designated Regent questline.",
									)}
								</p>
							</div>

							<div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground border-t border-white/5">
								{data.regent_requirements?.level && (
									<span>Min Level: {data.regent_requirements.level}</span>
								)}
								{data.regent_requirements?.abilities &&
									Object.entries(data.regent_requirements.abilities).map(
										([stat, val]) => (
											<span key={stat}>
												{stat.toUpperCase()}: {val}
											</span>
										),
									)}
							</div>
						</div>
					</SystemWindow>

					<SystemWindow
						title="QUEST PROGRESSION LOGIC"
						className="border-primary/30"
					>
						<div className="space-y-3 text-sm">
							<div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
								<p className="font-heading font-semibold text-primary mb-1">
									The 3-Choice Protocol
								</p>
								<p className="text-muted-foreground leading-relaxed">
									Upon initial quest completion, the System generates{" "}
									<span className="text-foreground font-bold italic">
										3 automated choices
									</span>{" "}
									based on your primary stats and combat history.
								</p>
							</div>

							<ul className="space-y-2 pl-1">
								<li className="flex gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
									<span>
										<strong className="text-foreground">Initial Choice:</strong>{" "}
										Select 1 of 3 initial options upon first DM verification.
									</span>
								</li>
								<li className="flex gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
									<span>
										<strong className="text-foreground">
											Sovereign Expansion:
										</strong>{" "}
										A second quest completion allows for a second choice (
										<strong className="text-amber-400">Max 2 Total</strong>).
									</span>
								</li>
								<li className="flex gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
									<span>
										<strong className="text-foreground">
											Gemini Protocol:
										</strong>{" "}
										Two active Regents trigger the Gemini Fusion protocol.
									</span>
								</li>
							</ul>
						</div>
					</SystemWindow>
				</div>
			)}

			{/* Signature Features */}
			{signatureFeatures.length > 0 && (
				<SystemWindow
					title="ASCENDANT ABILITIES (LVL 11-20)"
					className="border-amber-500/30"
				>
					<div className="space-y-4">
						{signatureFeatures.map((feature: CombinedFeature) => (
							<div
								key={feature.id || feature.name}
								className="border-l-2 border-amber-500/50 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<Flame className="w-4 h-4 text-amber-400" />
									<h4 className="font-heading font-semibold text-amber-400">
										{formatRegentVernacular(feature.name)}
									</h4>
									{feature.level > 0 && (
										<Badge
											variant="outline"
											className="text-xs border-amber-500/50 text-amber-500"
										>
											Level {feature.level}
										</Badge>
									)}
									{feature.type && (
										<Badge variant="secondary" className="text-xs">
											{feature.type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{formatRegentVernacular(feature.description)}
								</p>
							</div>
						))}
					</div>
				</SystemWindow>
			)}

			{/* Regular Features (Level 1-10) */}
			{regularFeatures.length > 0 && (
				<SystemWindow
					title={`${REGENT_LABEL.toUpperCase()} FEATURES (LVL 1-10)`}
				>
					<div className="space-y-4">
						{regularFeatures.map((feature: CombinedFeature) => (
							<div
								key={feature.id || feature.name}
								className="border-l-2 border-primary/30 pl-4"
							>
								<div className="flex items-center gap-2 mb-1">
									<h4 className="font-heading font-semibold">
										{formatRegentVernacular(feature.name)}
									</h4>
									{feature.level > 0 && (
										<Badge variant="outline" className="text-xs">
											Level {feature.level}
										</Badge>
									)}
									{feature.type && (
										<Badge variant="secondary" className="text-xs">
											{feature.type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{formatRegentVernacular(feature.description)}
								</p>
							</div>
						))}
					</div>
				</SystemWindow>
			)}

			{/* Mechanics & Special Traits */}
			{data.mechanics && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<SystemWindow
						title="STATISTICAL ATTRIBUTES"
						className="border-cyan-500/30"
					>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-2">
								{data.mechanics.stat_bonuses &&
									Object.entries(data.mechanics.stat_bonuses).map(
										([stat, val]) => (
											<div
												key={stat}
												className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10"
											>
												<span className="text-xs uppercase tracking-tighter text-muted-foreground">
													{stat}
												</span>
												<span className="text-amber-400 font-bold">+{val}</span>
											</div>
										),
									)}
							</div>

							{data.mechanics.restrictions &&
								data.mechanics.restrictions.length > 0 && (
									<div className="pt-2 border-t border-white/5">
										<p className="text-[10px] uppercase text-muted-foreground mb-2">
											Protocol Restrictions
										</p>
										<ul className="space-y-1">
											{data.mechanics.restrictions.map((res) => (
												<li
													key={res}
													className="text-xs text-red-400/80 flex gap-2 italic"
												>
													<div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
													{res}
												</li>
											))}
										</ul>
									</div>
								)}
						</div>
					</SystemWindow>

					<SystemWindow
						title="SYSTEM OVERRIDES"
						className="border-purple-500/30"
					>
						<div className="space-y-3">
							{data.mechanics.special_abilities?.map((ability) => (
								<div
									key={ability}
									className="flex gap-3 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0"
								>
									<div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
									<span className="text-foreground/90">
										{formatRegentVernacular(ability)}
									</span>
								</div>
							))}
						</div>
					</SystemWindow>
				</div>
			)}

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
