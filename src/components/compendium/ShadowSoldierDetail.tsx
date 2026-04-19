import { Eye, Heart, Shield, Skull, Sword, Target, Zap } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumShadowSoldier } from "@/types/compendium";

interface ShadowSoldierDetailProps {
	data: CompendiumShadowSoldier;
}

const getRoleIcon = (role?: string) => {
	switch (role?.toLowerCase()) {
		case "tank":
			return <Shield className="w-5 h-5" />;
		case "assassin":
			return <Target className="w-5 h-5" />;
		case "scout":
			return <Eye className="w-5 h-5" />;
		case "mage":
			return <Zap className="w-5 h-5" />;
		case "archer":
			return <Target className="w-5 h-5" />;
		default:
			return <Sword className="w-5 h-5" />;
	}
};

const getRankColor = (rank?: string) => {
	switch (rank) {
		case "A":
			return "text-gate-a border-gate-a/40 bg-gate-a/10";
		case "B":
			return "text-gate-b border-gate-b/40 bg-gate-b/10";
		case "C":
			return "text-gate-c border-gate-c/40 bg-gate-c/10";
		default:
			return "text-muted-foreground border-border bg-card";
	}
};

const getRarityStyle = (rarity?: string) => {
	switch (rarity) {
		case "very_rare":
			return "text-indigo-400 border-indigo-500/40 bg-indigo-500/10";
		case "rare":
			return "text-blue-400 border-blue-500/40 bg-blue-500/10";
		case "uncommon":
			return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
		default:
			return "text-muted-foreground border-border bg-card";
	}
};

function getAbilityMod(score: number): string {
	const mod = Math.floor((score - 10) / 2);
	return mod >= 0 ? `+${mod}` : `${mod}`;
}

export const ShadowSoldierDetail = ({ data }: ShadowSoldierDetailProps) => {
	const entry = data;
	const displayName = formatRegentVernacular(entry.display_name || entry.name);

	// Extract stat block fields from the resolved entity
	// These fields are spread onto the entity by the staticDataProvider but aren't
	// declared on CompendiumShadowSoldier, so we access them via a widened cast.
	const ext = entry as unknown as Record<string, unknown>;

	const hp = ext.hit_points_average as number | undefined;
	const ac = ext.armor_class as number | undefined;
	const speed = ext.speed_walk as number | undefined;
	const cr = ext.cr as string | undefined;

	const str = ext.str as number | undefined;
	const agi = ext.agi as number | undefined;
	const vit = ext.vit as number | undefined;
	const int = ext.int as number | undefined;
	const sense = ext.sense as number | undefined;
	const pre = ext.pre as number | undefined;

	const savingThrows = ext.saving_throws as Record<string, number> | undefined;
	const skills = ext.skills as Record<string, number> | undefined;
	const damageResistances = ext.damage_resistances as string[] | undefined;
	const damageImmunities = ext.damage_immunities as string[] | undefined;
	const conditionImmunities = ext.condition_immunities as string[] | undefined;
	const senses = ext.senses as Record<string, string> | undefined;
	const languages = ext.languages as string[] | undefined;
	const isBoss = ext.is_boss as boolean | undefined;

	const traits = ext.Anomaly_traits as
		| Array<{ name: string; description: string }>
		| undefined;
	const actions = ext.Anomaly_actions as
		| Array<{
				name: string;
				description: string;
				action_type?: string;
				attack_bonus?: number;
				damage?: string;
				damage_type?: string;
				recharge?: string;
				dc?: number;
				save?: string;
		  }>
		| undefined;

	const mechanics = ext.mechanics as Record<string, string> | undefined;
	const limitations = ext.limitations as Record<string, unknown> | undefined;

	const abilityScores = [
		{ label: "STR", value: str },
		{ label: "AGI", value: agi },
		{ label: "VIT", value: vit },
		{ label: "INT", value: int },
		{ label: "SEN", value: sense },
		{ label: "PRE", value: pre },
	].filter((a) => a.value != null);

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className="border-amethyst/30 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]"
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{entry.role && (
							<Badge
								variant="secondary"
								className="bg-amethyst/20 border-amethyst/40 text-amethyst"
							>
								{getRoleIcon(entry.role)}
								<span className="ml-1.5 capitalize">{entry.role}</span>
							</Badge>
						)}
						{entry.rank && (
							<Badge className={getRankColor(entry.rank)}>
								{entry.rank}-Rank
							</Badge>
						)}
						{entry.rarity && (
							<Badge variant="outline" className={getRarityStyle(entry.rarity)}>
								{formatRegentVernacular(entry.rarity.replace("_", " "))}
							</Badge>
						)}
						{isBoss && (
							<Badge
								variant="destructive"
								className="bg-red-500/20 border-red-500/40 text-red-400"
							>
								<Skull className="w-3 h-3 mr-1" /> Elite
							</Badge>
						)}
					</div>

					{entry.flavor && (
						<p className="text-sm italic text-amethyst/70 border-l-2 border-amethyst/30 pl-3 py-1 bg-amethyst/5">
							<AutoLinkText text={entry.flavor as string} />
						</p>
					)}

					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={entry.description || ""} />
					</p>
				</div>
			</AscendantWindow>

			{/* Core Stats Bar */}
			{(hp != null || ac != null || speed != null || cr != null) && (
				<div
					id="soldier-stats"
					className="grid grid-cols-2 md:grid-cols-4 gap-3"
				>
					{hp != null && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Heart className="w-5 h-5 mx-auto mb-1 text-red-400" />
							<div className="text-2xl font-bold font-heading text-red-400">
								{hp}
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Hit Points
							</div>
						</div>
					)}
					{ac != null && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Shield className="w-5 h-5 mx-auto mb-1 text-cyan" />
							<div className="text-2xl font-bold font-heading text-cyan">
								{ac}
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Armor Class
							</div>
						</div>
					)}
					{speed != null && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Zap className="w-5 h-5 mx-auto mb-1 text-amber-400" />
							<div className="text-2xl font-bold font-heading text-amber-400">
								{speed} ft.
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Speed
							</div>
						</div>
					)}
					{cr != null && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Skull className="w-5 h-5 mx-auto mb-1 text-solar-glow" />
							<div className="text-2xl font-bold font-heading text-solar-glow">
								CR {cr}
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Challenge
							</div>
						</div>
					)}
				</div>
			)}

			{/* Ability Scores */}
			{abilityScores.length > 0 && (
				<AscendantWindow id="soldier-abilities" title="ABILITY SCORES" compact>
					<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
						{abilityScores.map((ability) => (
							<div
								key={ability.label}
								className="text-center bg-void/60 border border-border rounded-lg p-3"
							>
								<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
									{ability.label}
								</div>
								<div className="text-xl font-bold font-heading">
									{ability.value}
								</div>
								<div className="text-xs text-cyan">
									{getAbilityMod(ability.value!)}
								</div>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Saving Throws & Skills */}
			{(savingThrows || skills) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{savingThrows && Object.keys(savingThrows).length > 0 && (
						<AscendantWindow title="SAVING THROWS" compact>
							<div className="flex flex-wrap gap-2">
								{Object.entries(savingThrows).map(([key, val]) => (
									<Badge
										key={key}
										variant="outline"
										className="border-cyan/30 text-cyan capitalize"
									>
										{key}: +{val}
									</Badge>
								))}
							</div>
						</AscendantWindow>
					)}
					{skills && Object.keys(skills).length > 0 && (
						<AscendantWindow title="SKILLS" compact>
							<div className="flex flex-wrap gap-2">
								{Object.entries(skills).map(([key, val]) => (
									<Badge
										key={key}
										variant="outline"
										className="border-amethyst/30 text-amethyst"
									>
										{key}: +{val}
									</Badge>
								))}
							</div>
						</AscendantWindow>
					)}
				</div>
			)}

			{/* Resistances, Immunities, Senses */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{damageResistances && damageResistances.length > 0 && (
					<AscendantWindow
						title="DAMAGE RESISTANCES"
						compact
						className="border-amber-500/20"
					>
						<div className="flex flex-wrap gap-1.5">
							{damageResistances.map((r) => (
								<Badge
									key={r}
									variant="secondary"
									className="text-amber-400 bg-amber-500/10 border-amber-500/20 text-xs"
								>
									{r}
								</Badge>
							))}
						</div>
					</AscendantWindow>
				)}
				{damageImmunities && damageImmunities.length > 0 && (
					<AscendantWindow
						title="DAMAGE IMMUNITIES"
						compact
						className="border-red-500/20"
					>
						<div className="flex flex-wrap gap-1.5">
							{damageImmunities.map((i) => (
								<Badge
									key={i}
									variant="secondary"
									className="text-red-400 bg-red-500/10 border-red-500/20 text-xs"
								>
									{i}
								</Badge>
							))}
						</div>
					</AscendantWindow>
				)}
				{conditionImmunities && conditionImmunities.length > 0 && (
					<AscendantWindow
						title="CONDITION IMMUNITIES"
						compact
						className="border-purple-500/20"
					>
						<div className="flex flex-wrap gap-1.5">
							{conditionImmunities.map((c) => (
								<Badge
									key={c}
									variant="secondary"
									className="text-purple-400 bg-purple-500/10 border-purple-500/20 text-xs"
								>
									{c}
								</Badge>
							))}
						</div>
					</AscendantWindow>
				)}
				{(senses || languages) && (
					<AscendantWindow title="SENSES & LANGUAGES" compact>
						<div className="space-y-2 text-sm">
							{senses && (
								<div>
									<span className="text-muted-foreground font-medium">
										Senses:{" "}
									</span>
									<span className="text-foreground">
										{typeof senses === "string"
											? senses
											: (senses as Record<string, string>).text ||
												JSON.stringify(senses)}
									</span>
								</div>
							)}
							{languages && languages.length > 0 && (
								<div>
									<span className="text-muted-foreground font-medium">
										Languages:{" "}
									</span>
									<span className="text-foreground">
										{languages.join(", ")}
									</span>
								</div>
							)}
						</div>
					</AscendantWindow>
				)}
			</div>

			{/* Traits */}
			{traits && traits.length > 0 && (
				<AscendantWindow
					id="soldier-traits"
					title="TRAITS"
					className="border-cyan/20 shadow-[0_0_15px_-5px_rgba(34,211,238,0.2)]"
				>
					<div className="space-y-4">
						{traits.map((trait) => (
							<div
								key={trait.name}
								className="p-4 bg-muted/10 border-l border-cyan/40 rounded-r-lg"
							>
								<h4 className="font-heading font-bold text-cyan text-sm mb-1">
									{trait.name}
								</h4>
								<p className="text-sm text-foreground leading-relaxed">
									<AutoLinkText text={trait.description} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Actions */}
			{actions && actions.length > 0 && (
				<AscendantWindow
					id="soldier-actions"
					title="ACTIONS"
					className="border-red-500/20 shadow-[0_0_15px_-5px_rgba(239,68,68,0.2)]"
				>
					<div className="space-y-4">
						{actions.map((action) => (
							<div
								key={action.name}
								className="p-4 bg-muted/10 border-l border-red-500/40 rounded-r-lg"
							>
								<div className="flex flex-wrap items-center gap-2 mb-2">
									<h4 className="font-heading font-bold text-red-400 text-sm">
										{action.name}
										{action.recharge && (
											<span className="text-amber-400 ml-1 text-xs">
												(Recharge {action.recharge})
											</span>
										)}
									</h4>
									{action.action_type && (
										<Badge
											variant="outline"
											className="text-[10px] capitalize border-muted"
										>
											{action.action_type}
										</Badge>
									)}
								</div>
								<p className="text-sm text-foreground leading-relaxed mb-2">
									<AutoLinkText text={action.description} />
								</p>
								{(action.attack_bonus != null ||
									action.damage ||
									action.dc) && (
									<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
										{action.attack_bonus != null && (
											<span className="text-cyan">
												<Sword className="w-3 h-3 inline mr-0.5" />+
												{action.attack_bonus} to hit
											</span>
										)}
										{action.damage && (
											<span className="text-red-400">
												{action.damage}
												{action.damage_type && ` ${action.damage_type}`}
											</span>
										)}
										{action.dc != null && (
											<span className="text-amber-400">
												DC {action.dc} {action.save || ""} save
											</span>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Mechanics & Limitations */}
			{(mechanics || limitations) && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{mechanics && Object.keys(mechanics).length > 0 && (
						<AscendantWindow title="MECHANICS" compact>
							<div className="space-y-2 text-sm">
								{Object.entries(mechanics).map(([key, val]) => (
									<div key={key}>
										<span className="text-muted-foreground capitalize">
											{key.replace(/_/g, " ")}:{" "}
										</span>
										<span className="text-foreground">{String(val)}</span>
									</div>
								))}
							</div>
						</AscendantWindow>
					)}
					{limitations && Object.keys(limitations).length > 0 && (
						<AscendantWindow
							title="LIMITATIONS"
							compact
							className="border-amber-500/20"
						>
							<div className="space-y-2 text-sm">
								{Object.entries(limitations).map(([key, val]) => (
									<div key={key}>
										<span className="text-muted-foreground capitalize">
											{key.replace(/_/g, " ")}:{" "}
										</span>
										<span className="text-foreground">
											{Array.isArray(val) ? val.join(", ") : String(val)}
										</span>
									</div>
								))}
							</div>
						</AscendantWindow>
					)}
				</div>
			)}

			{/* Lore */}
			{entry.lore && (
				<AscendantWindow
					id="soldier-lore"
					title="LORE"
					className="border-amethyst/20"
				>
					<div className="space-y-3 text-sm">
						{typeof entry.lore === "object" &&
							Object.entries(
								entry.lore as unknown as Record<string, unknown>,
							).map(([key, val]) => {
								if (!val) return null;
								if (Array.isArray(val)) {
									return (
										<div key={key}>
											<span className="text-amethyst font-medium capitalize">
												{key.replace(/_/g, " ")}:{" "}
											</span>
											<span className="text-foreground">{val.join(", ")}</span>
										</div>
									);
								}
								return (
									<div key={key}>
										<span className="text-amethyst font-medium capitalize">
											{key.replace(/_/g, " ")}:{" "}
										</span>
										<span className="text-foreground">{String(val)}</span>
									</div>
								);
							})}
						{typeof entry.lore === "string" && (
							<p className="text-foreground leading-relaxed">
								<AutoLinkText text={entry.lore} />
							</p>
						)}
					</div>
				</AscendantWindow>
			)}

			<Separator />

			{/* Tags */}
			{entry.tags && entry.tags.length > 0 && (
				<div id="soldier-tags" className="scroll-mt-4">
					<div className="flex flex-wrap gap-2">
						{entry.tags.map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="capitalize text-xs"
							>
								{formatRegentVernacular(tag.replace(/-/g, " "))}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Source */}
			{entry.source_book && (
				<div className="text-xs text-muted-foreground">
					Source: {formatRegentVernacular(entry.source_book)}
				</div>
			)}
		</div>
	);
};
