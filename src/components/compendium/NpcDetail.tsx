import {
	Handshake,
	Heart,
	Lock,
	MapPin,
	ScrollText,
	Shield,
	Sparkles,
	Star,
	Swords,
	TrendingUp,
	Users,
} from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { DetailMetaFooter } from "@/components/compendium/DetailMetaFooter";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumNPC, CompendiumNpcLeveling } from "@/types/compendium";

interface NpcDetailProps {
	data: CompendiumNPC;
}

// Narrow the wide-bag `leveling` field (CompendiumNpcLeveling | Json | null)
// to the structured shape when it carries a progression track.
function getLeveling(data: CompendiumNPC): CompendiumNpcLeveling | null {
	const lv = data.leveling;
	if (lv && typeof lv === "object" && "maxLevel" in lv) {
		return lv as CompendiumNpcLeveling;
	}
	return null;
}

export const NpcDetail = ({ data }: NpcDetailProps) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const title = data.title ? formatRegentVernacular(data.title) : null;
	const hp = data.hp ?? data.hit_points ?? data.hit_points_average ?? null;
	const ac =
		typeof data.armor_class === "number" ? data.armor_class : (data.ac ?? null);
	const level = data.level ?? null;
	const recruitable = data.is_recruitable ?? false;
	const keyAbilities = data.key_abilities ?? [];
	const leveling = getLeveling(data);
	const levelAbilityRows = leveling
		? Object.entries(leveling.levelAbilities ?? {})
				.map(([lvl, ability]) => ({ level: Number(lvl), ability }))
				.sort((a, b) => a.level - b.level)
		: [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow
				title={displayName.toUpperCase()}
				className="border-cyan/30 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]"
			>
				<div className="space-y-4">
					{title && (
						<p className="text-sm uppercase tracking-wider text-cyan/80">
							{title}
						</p>
					)}
					<div className="flex flex-wrap items-center gap-2">
						{data.faction && (
							<Badge
								variant="secondary"
								className="bg-cyan/20 border-cyan/40 text-cyan"
							>
								<Users className="w-3.5 h-3.5 mr-1" />
								{formatRegentVernacular(data.faction)}
							</Badge>
						)}
						{data.job && (
							<Badge
								variant="outline"
								className="border-amethyst/40 text-amethyst"
							>
								<Swords className="w-3 h-3 mr-1" />
								{formatRegentVernacular(data.job)}
							</Badge>
						)}
						{level != null && (
							<Badge variant="outline" className="border-gate-s/40 text-gate-s">
								<Star className="w-3 h-3 mr-1" />
								Level {level}
							</Badge>
						)}
						<Badge
							variant="outline"
							className={
								recruitable
									? "border-system-green/40 text-system-green bg-system-green/10"
									: "border-red-500/40 text-red-400 bg-red-500/10"
							}
						>
							{recruitable ? (
								<Handshake className="w-3 h-3 mr-1" />
							) : (
								<Lock className="w-3 h-3 mr-1" />
							)}
							{recruitable ? "Recruitable" : "Story NPC"}
						</Badge>
					</div>

					{data.description && (
						<p className="text-foreground leading-relaxed">
							<AutoLinkText text={data.description} />
						</p>
					)}
				</div>
			</AscendantWindow>

			{/* Core Stats */}
			{(hp != null || ac != null || level != null || data.job) && (
				<div id="npc-stats" className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
					{level != null && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Star className="w-5 h-5 mx-auto mb-1 text-gate-s" />
							<div className="text-2xl font-bold font-heading text-gate-s">
								{level}
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Level
							</div>
						</div>
					)}
					{data.job && (
						<div className="bg-card border rounded-lg p-4 text-center">
							<Swords className="w-5 h-5 mx-auto mb-1 text-amethyst" />
							<div className="text-lg font-bold font-heading text-amethyst leading-tight pt-1">
								{formatRegentVernacular(data.job)}
							</div>
							<div className="text-[10px] text-muted-foreground uppercase tracking-wider">
								Class
							</div>
						</div>
					)}
				</div>
			)}

			{/* Key Abilities */}
			{keyAbilities.length > 0 && (
				<AscendantWindow
					id="npc-abilities"
					title="KEY ABILITIES"
					className="border-amethyst/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.2)]"
				>
					<div className="flex flex-wrap gap-2">
						{keyAbilities.map((ability) => (
							<Badge
								key={ability}
								variant="secondary"
								className="bg-amethyst/10 border-amethyst/30 text-amethyst"
							>
								<Sparkles className="w-3 h-3 mr-1" />
								{ability}
							</Badge>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Recruitment */}
			<AscendantWindow
				id="npc-recruitment"
				title="RECRUITMENT"
				className={recruitable ? "border-system-green/20" : "border-red-500/20"}
			>
				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2">
						{recruitable ? (
							<Handshake className="w-4 h-4 text-system-green" />
						) : (
							<Lock className="w-4 h-4 text-red-400" />
						)}
						<span
							className={recruitable ? "text-system-green" : "text-red-400"}
						>
							{recruitable
								? "Can be recruited as a companion."
								: "Cannot be recruited to a party or guild."}
						</span>
					</div>
					{data.recruit_condition && (
						<div>
							<span className="text-muted-foreground font-medium">
								Condition:{" "}
							</span>
							<span className="text-foreground">
								<AutoLinkText text={data.recruit_condition} />
							</span>
						</div>
					)}
					{data.guild_affiliation && (
						<div>
							<span className="text-muted-foreground font-medium">
								Guild Affiliation:{" "}
							</span>
							<span className="text-foreground">{data.guild_affiliation}</span>
						</div>
					)}
					{data.npc_location && (
						<div className="flex items-start gap-1.5">
							<MapPin className="w-4 h-4 text-cyan mt-0.5 shrink-0" />
							<span className="text-foreground">{data.npc_location}</span>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Progression / Leveling */}
			{leveling && (
				<AscendantWindow
					id="npc-progression"
					title="PROGRESSION"
					className="border-gate-s/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]"
				>
					<div className="space-y-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							<div className="bg-void/60 border border-border rounded-lg p-3 text-center">
								<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
									Max Level
								</div>
								<div className="text-xl font-bold font-heading text-gate-s">
									{leveling.maxLevel}
								</div>
							</div>
							<div className="bg-void/60 border border-border rounded-lg p-3 text-center">
								<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
									HP / Level
								</div>
								<div className="text-xl font-bold font-heading text-red-400">
									+{leveling.hpPerLevel}
								</div>
							</div>
							<div className="bg-void/60 border border-border rounded-lg p-3 text-center">
								<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
									XP To Next
								</div>
								<div className="text-xl font-bold font-heading text-cyan">
									{leveling.xpToNextLevel}
								</div>
							</div>
							<div className="bg-void/60 border border-border rounded-lg p-3 text-center">
								<div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
									Auto-Level
								</div>
								<div className="text-xl font-bold font-heading text-amethyst">
									{leveling.autoLevel ? "Yes" : "No"}
								</div>
							</div>
						</div>

						{levelAbilityRows.length > 0 && (
							<div className="space-y-2">
								<div className="flex items-center gap-1.5 text-xs font-bold text-gate-s uppercase tracking-wider">
									<TrendingUp className="w-3.5 h-3.5" />
									Level-Up Abilities
								</div>
								<div className="space-y-1.5">
									{levelAbilityRows.map((row) => (
										<div
											key={row.level}
											className="flex items-center gap-3 bg-muted/10 border-l border-gate-s/40 rounded-r px-3 py-2"
										>
											<Badge
												variant="outline"
												className="border-gate-s/40 text-gate-s shrink-0"
											>
												Lv {row.level}
											</Badge>
											<span className="text-sm text-foreground">
												{row.ability}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Profile / Lore */}
			{(data.personality || data.motivation || data.backstory) && (
				<AscendantWindow
					id="npc-profile"
					title="PROFILE"
					className="border-cyan/20"
				>
					<div className="space-y-3 text-sm">
						{data.personality && (
							<div>
								<span className="text-cyan font-medium">Personality: </span>
								<span className="text-foreground">{data.personality}</span>
							</div>
						)}
						{data.motivation && (
							<div>
								<span className="text-cyan font-medium">Motivation: </span>
								<span className="text-foreground">{data.motivation}</span>
							</div>
						)}
						{data.backstory && (
							<div>
								<span className="text-cyan font-medium">Backstory: </span>
								<span className="text-foreground leading-relaxed">
									<AutoLinkText text={data.backstory} />
								</span>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Quest Hook */}
			{data.quest_hook && (
				<AscendantWindow
					title="QUEST HOOK"
					className="border-solar-glow/20 shadow-[0_0_15px_-5px_rgba(250,204,21,0.2)]"
				>
					<p className="flex items-start gap-2 text-sm italic text-foreground leading-relaxed">
						<ScrollText className="w-4 h-4 text-solar-glow mt-0.5 shrink-0" />
						<span>
							<AutoLinkText text={data.quest_hook} />
						</span>
					</p>
				</AscendantWindow>
			)}

			<Separator />

			{/* Tags */}
			{data.tags && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{[...new Set(data.tags)].map((tag) => (
						<Badge key={tag} variant="secondary" className="text-xs">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}

			{/* Source */}
			{data.source_book && (
				<div className="text-xs text-muted-foreground">
					Source: {formatRegentVernacular(data.source_book)}
				</div>
			)}
			<DetailMetaFooter
				extra={[
					{ label: "Faction", value: data.faction },
					{ label: "Class", value: data.job },
					{ label: "Location", value: data.npc_location },
				]}
			/>
		</div>
	);
};
