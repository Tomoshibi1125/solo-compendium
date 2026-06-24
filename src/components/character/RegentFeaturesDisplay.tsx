import { CheckCircle, Crown, Lock } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { getStaticRegents } from "@/lib/ProtocolDataManager";
import { cn } from "@/lib/utils";
import type { DetailData } from "@/types/character";

interface RegentFeaturesDisplayProps {
	characterId: string;
	characterLevel: number;
	regentId?: string;
	regentLevel?: number;
	className?: string;
	onSelectDetail?: (detail: DetailData) => void;
}

export function RegentFeaturesDisplay({
	characterLevel,
	regentId,
	// Gestalt: a Regent is a full class overlay; its level tracks the character's
	// level (not a fixed subclass tier). Default to characterLevel so features
	// unlock simultaneously even if a caller omits the prop.
	regentLevel,
	className,
	onSelectDetail,
}: RegentFeaturesDisplayProps) {
	const effectiveRegentLevel = regentLevel ?? characterLevel;
	const regentData = getStaticRegents().find((r) => r.id === regentId);

	if (!regentId) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="w-5 h-5" />
						Regent Features
					</CardTitle>
					<CardDescription>
						No regent unlocked. Complete quests and have your Warden unlock a
						regent for you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<p className="text-sm">
							Regent abilities are locked until unlocked by your Warden
						</p>
						<p className="text-xs mt-2">
							Complete the required quest to unlock regent features
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getRegentFeatures = () => {
		if (!regentData) return [];

		// The static regents (src/data/compendium/regents.ts) carry richer fields
		// (`abilities`, `features`) that the supabase-derived `CompendiumRegent`
		// type does not expose — cast for the additional surface so the UI can
		// render martial-themed regents (Radiant/Steel/Destruction/War).
		const extended = regentData as typeof regentData & {
			abilities?: Array<{
				name: string;
				description: string;
				type: "passive" | "active" | "action" | "bonus-action" | "reaction";
				frequency?: string;
				power_level?: number;
			}>;
			features?: Array<{
				name: string;
				description: string;
				power_level?: number;
			}>;
		};

		const classFeatureEntries =
			regentData.class_features
				?.filter((f) => f.level <= effectiveRegentLevel)
				.map((f) => ({
					name: f.name,
					description: f.description,
					type: f.type,
					frequency: f.frequency,
					level: f.level,
					power_level: undefined as number | undefined,
				})) ?? [];

		// Many non-spellcasting regents (radiant/steel/destruction/war/etc.) store
		// content in `abilities[]` (level-agnostic, gated by power_level instead)
		// and/or `features[]` (passive trait descriptions). Surface both so those
		// regents don't render as empty cards.
		const abilityEntries =
			extended.abilities?.map((a) => ({
				name: a.name,
				description: a.description,
				type: a.type,
				frequency: a.frequency,
				level: 0,
				power_level: a.power_level,
			})) ?? [];

		const featureEntries =
			extended.features?.map((f) => ({
				name: f.name,
				description: f.description,
				type: "passive" as const,
				frequency: undefined,
				level: 0,
				power_level: f.power_level,
			})) ?? [];

		const seen = new Set<string>();
		return [
			...classFeatureEntries,
			...abilityEntries,
			...featureEntries,
		].filter((entry) => {
			if (seen.has(entry.name)) return false;
			seen.add(entry.name);
			return true;
		});
	};

	const regentFeatures = getRegentFeatures();
	const additionalSpells = regentData?.spellcasting?.additional_spells ?? [];

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Crown className="w-5 h-5" />
					{regentData?.name} Features
				</CardTitle>
				<CardDescription>
					Gestalt overlay — Regent advances at your character level (
					{characterLevel})
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Regent Info */}
				<button
					type="button"
					className="w-full text-left p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
					onClick={() =>
						onSelectDetail?.({
							title: regentData?.name || "Regent",
							description: regentData?.description || "",
							payload: { rank: regentData?.rank, type: "Regent" },
						})
					}
				>
					<div className="flex items-center gap-2 mb-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span className="font-medium">{regentData?.name}</span>
						<Badge variant="secondary">{regentData?.rank}</Badge>
					</div>
					<ExpandableText className="text-sm text-muted-foreground" lines={2}>
						<AutoLinkText text={regentData?.description || ""} />
					</ExpandableText>
				</button>

				{/* Gestalt overlay summary — the full-class mechanics the Regent
				    grants on top of the base Job (not a subclass). */}
				{regentData && (
					<div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
						<h4 className="font-medium flex items-center gap-2">
							<Crown className="w-4 h-4 text-primary" />
							Gestalt Overlay
						</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
							{regentData.hit_dice && (
								<div>
									<span className="text-muted-foreground">
										Hit Die (additive):{" "}
									</span>
									<span className="font-mono">
										+{regentData.hit_dice}/level
									</span>
								</div>
							)}
							{regentData.saving_throws &&
								regentData.saving_throws.length > 0 && (
									<div>
										<span className="text-muted-foreground">Saves added: </span>
										<span>{regentData.saving_throws.join(", ")}</span>
									</div>
								)}
							{regentData.skill_proficiencies &&
								regentData.skill_proficiencies.length > 0 && (
									<div className="sm:col-span-2">
										<span className="text-muted-foreground">
											Skill proficiencies added:{" "}
										</span>
										<span>{regentData.skill_proficiencies.join(", ")}</span>
									</div>
								)}
							{regentData.spellcasting && (
								<div className="sm:col-span-2">
									<span className="text-muted-foreground">Spellcasting: </span>
									<span>
										merges with your Job's slots (combined caster level, PHB
										p.164)
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Regent Features */}
				<div className="space-y-4">
					<h4 className="font-medium">Regent Abilities</h4>
					<div className="space-y-3">
						{regentFeatures.map((feature) => (
							<button
								key={feature.name}
								type="button"
								className="w-full text-left p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
								onClick={() =>
									onSelectDetail?.({
										title: feature.name,
										description: feature.description || "",
										payload: {
											level: feature.level,
											frequency: feature.frequency,
											type: feature.type,
										},
									})
								}
							>
								<div className="flex items-center gap-2 mb-2">
									<span className="font-medium">{feature.name}</span>
									<Badge variant="outline" className="text-xs">
										{feature.type}
									</Badge>
									{feature.frequency && (
										<Badge variant="secondary" className="text-xs">
											{feature.frequency}
										</Badge>
									)}
									{feature.level > 0 && (
										<Badge variant="outline" className="text-xs">
											Lvl {feature.level}
										</Badge>
									)}
									{feature.power_level !== undefined && (
										<Badge variant="secondary" className="text-xs">
											PL {feature.power_level}
										</Badge>
									)}
								</div>
								<ExpandableText
									className="text-sm text-muted-foreground"
									lines={2}
								>
									<AutoLinkText text={feature.description || ""} />
								</ExpandableText>
							</button>
						))}
						{regentFeatures.length === 0 && (
							<p className="text-sm text-muted-foreground italic">
								No regent features at this level
							</p>
						)}
					</div>
				</div>

				{/* Spell Slots & Other info remains static but clear */}
				{regentData?.spellcasting && (
					<div className="space-y-4">
						<h4 className="font-medium">Regent Power Slots</h4>
						<div className="grid grid-cols-9 gap-2 text-center">
							{Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
								const sc = regentData.spellcasting;
								if (!sc) return null;
								const slotKey =
									`${level}${level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th"}` as keyof typeof sc.spell_slots;
								const slots =
									sc.spell_slots[slotKey]?.[effectiveRegentLevel - 1] || 0;
								return (
									<div key={level} className="p-2 border rounded">
										<div className="text-xs font-medium">Lvl {level}</div>
										<div className="text-sm font-bold">{slots}</div>
									</div>
								);
							})}
						</div>
						{additionalSpells.length > 0 && (
							<div className="space-y-2">
								<h5 className="text-sm font-medium">Regent-Granted Spells</h5>
								<div className="flex flex-wrap gap-2">
									{additionalSpells.map((spellName) => (
										<Badge
											key={spellName}
											variant="outline"
											className="text-xs"
										>
											{spellName}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				<div className="text-xs text-muted-foreground border-t pt-4">
					<p>
						<strong>Progression:</strong> Regent abilities advance with
						character level.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
