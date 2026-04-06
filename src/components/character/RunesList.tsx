import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	Flame,
	Scroll,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useFeatures } from "@/hooks/useFeatures";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { useAbsorbRune, useCharacterRuneKnowledge } from "@/hooks/useRunes";
import { resolveRuneAbsorption } from "@/lib/runeAutomation";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { DetailData } from "@/types/character";
import { getProficiencyBonus } from "@/types/core-rules";

const RUNE_TYPE_COLORS: Record<string, string> = {
	martial: "bg-red-500/20 text-red-400 border-red-500/30",
	caster: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	hybrid: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	utility: "bg-green-500/20 text-green-400 border-green-500/30",
	defensive: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	offensive: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const RUNE_TYPE_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	martial: Zap,
	caster: Scroll,
	hybrid: Sparkles,
	utility: BookOpen,
	defensive: Shield,
	offensive: Zap,
};

export function RunesList({
	characterId,
	campaignId,
	onSelectDetail,
}: {
	characterId: string;
	campaignId?: string;
	onSelectDetail?: (detail: DetailData) => void;
}) {
	const { data: runeKnowledge = [] } = useCharacterRuneKnowledge(characterId);
	const { data: character } = useCharacter(characterId);
	const { features = [] } = useFeatures(characterId);
	const absorbRune = useAbsorbRune();
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const ascendantTools = useAscendantTools();
	const { rollInCampaign } = ascendantTools;

	const unabsorbedRunes = runeKnowledge.filter(
		(rk) => (rk.mastery_level || 0) < 5,
	);
	const absorbedFeatures = features.filter((f) =>
		f.source?.startsWith("Rune:"),
	);

	const absorptionPreviews = useMemo(() => {
		if (!character) return {};
		const level = character.level ?? 1;
		const profBonus = getProficiencyBonus(level);
		const previews: Record<
			string,
			ReturnType<typeof resolveRuneAbsorption>
		> = {};
		for (const rk of unabsorbedRunes) {
			previews[rk.rune_id] = resolveRuneAbsorption(
				rk.rune.rune_type,
				rk.rune.uses_per_rest,
				character.job,
				level,
				profBonus,
			);
		}
		return previews;
	}, [character, unabsorbedRunes]);

	const handleAbsorb = async (runeId: string, runeName: string) => {
		const displayName = formatRegentVernacular(runeName);
		try {
			const result = await absorbRune.mutateAsync({ characterId, runeId });
			const successMessage = `${displayName} permanently learned. ${result.absorption.adaptationNote}`;

			if (campaignId) {
				rollInCampaign(campaignId, {
					dice_formula: "0",
					result: 0,
					rolls: [],
					roll_type: "ability",
					context: `Absorbs Rune: ${successMessage}`,
					character_id: characterId,
				});
			}

			recordRoll.mutate({
				dice_formula: "0",
				result: 0,
				rolls: [],
				roll_type: "ability",
				context: `Absorbs Rune: ${successMessage}`,
				campaign_id: campaignId ?? null,
				character_id: characterId,
			});

			toast({
				title: "Rune Absorbed!",
				description: successMessage,
			});

			await ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					"Rune Absorption",
					`Absorbed ${runeName}`,
					"SA",
				)
				.catch(console.error);
		} catch (error) {
			toast({
				title: "Absorption Failed",
				description:
					error instanceof Error ? error.message : "Could not absorb rune.",
				variant: "destructive",
			});
		}
	};

	return (
		<AscendantWindow title="RUNES" variant="resurge">
			<div className="space-y-4">
				{unabsorbedRunes.length > 0 && (
					<div>
						<h3 className="text-sm font-heading text-muted-foreground mb-2">
							AVAILABLE RUNES
						</h3>
						<div className="space-y-2">
							{unabsorbedRunes.map((rk) => {
								const Icon = RUNE_TYPE_ICONS[rk.rune.rune_type] || BookOpen;
								const displayName = formatRegentVernacular(rk.rune.name);
								const runeDescription =
									rk.rune.effect_description || rk.rune.description || "";
								return (
									<button
										key={rk.id}
										type="button"
										className="w-full text-left border border-primary/20 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
										onClick={() =>
											onSelectDetail?.({
												title: rk.rune.name,
												description: runeDescription,
												payload: { type: "Rune", icon: Icon },
											})
										}
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex items-start gap-2 flex-1">
												<Icon
													className={cn(
														"w-5 h-5 mt-0.5",
														RUNE_TYPE_COLORS[rk.rune.rune_type]?.split(
															" ",
														)[1] || "text-primary",
													)}
												/>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<span className="font-heading font-semibold text-sm">
															{displayName}
														</span>
														<Badge
															variant="outline"
															className={cn(
																"text-xs",
																RUNE_TYPE_COLORS[rk.rune.rune_type] || "",
															)}
														>
															{rk.rune.rune_type}
														</Badge>
														<Badge variant="secondary" className="text-xs">
															Lv.{rk.rune.rune_level}
														</Badge>
													</div>
													{runeDescription && (
														<div className="text-xs text-muted-foreground mt-1 line-clamp-3">
															<AutoLinkText text={runeDescription} />
														</div>
													)}
													{absorptionPreviews[rk.rune_id]?.isCrossType && (
														<div className="flex items-center gap-1.5 mt-1.5">
															<AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
															<span className="text-[10px] text-amber-400">
																{absorptionPreviews[rk.rune_id]?.adaptationNote}
															</span>
														</div>
													)}
													{absorptionPreviews[rk.rune_id] &&
														!absorptionPreviews[rk.rune_id]?.isCrossType && (
															<div className="flex items-center gap-1.5 mt-1.5">
																<span className="text-[10px] text-green-400">
																	{absorptionPreviews[rk.rune_id]?.usesMax ===
																	null
																		? "At-will"
																		: `${absorptionPreviews[rk.rune_id]?.usesMax} uses / ${absorptionPreviews[rk.rune_id]?.recharge}`}
																</span>
															</div>
														)}
												</div>
											</div>
											<Button
												size="sm"
												variant="default"
												onClick={(e) => {
													e.stopPropagation();
													handleAbsorb(rk.rune_id, rk.rune.name);
												}}
												disabled={absorbRune.isPending}
												className="font-resurge tracking-wider bg-resurge-violet hover:bg-resurge-violet/80 shadow-[0_0_10px_hsl(var(--resurge-violet)/0.3)]"
											>
												<Flame className="w-3 h-3 mr-1" />
												Absorb
											</Button>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				)}

				{absorbedFeatures.length > 0 && (
					<div>
						<h3 className="text-sm font-heading text-muted-foreground mb-2">
							ABSORBED ABILITIES
						</h3>
						<div className="space-y-2">
							{absorbedFeatures.map((feature) => (
								<div
									key={feature.id}
									className="border border-resurge-violet/20 rounded-lg p-3 bg-resurge-violet/5"
								>
									<div className="flex items-center justify-between">
										<button
											type="button"
											className="flex-1 text-left flex items-center gap-2 cursor-pointer hover:text-resurge-violet transition-colors focus-visible:outline-none focus-visible:text-resurge-violet"
											onClick={() =>
												onSelectDetail?.({
													title: feature.name,
													description: feature.description || "",
													payload: { type: "Absorbed Rune", icon: CheckCircle },
												})
											}
										>
											<CheckCircle className="w-4 h-4 text-resurge-violet" />
											<span className="font-heading font-semibold text-sm">
												{formatRegentVernacular(feature.name)}
											</span>
										</button>
										<div className="flex items-center gap-2">
											{feature.uses_max !== null &&
												feature.uses_max !== undefined && (
													<Badge variant="outline" className="text-xs">
														{feature.uses_current ?? feature.uses_max}/
														{feature.uses_max} uses
													</Badge>
												)}
											{feature.recharge && feature.recharge !== "none" && (
												<Badge variant="secondary" className="text-xs">
													{feature.recharge}
												</Badge>
											)}
											{!feature.uses_max && (
												<Badge
													variant="outline"
													className="text-xs text-green-400 border-green-400/30"
												>
													At-will
												</Badge>
											)}
										</div>
									</div>
									{feature.description && (
										<div className="text-xs text-muted-foreground mt-1">
											<AutoLinkText text={feature.description} />
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{unabsorbedRunes.length === 0 && absorbedFeatures.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						<BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No runes discovered yet.</p>
						<p className="text-xs mt-1">
							Runes drop from gates and encounters. Absorb them to permanently
							learn their abilities.
						</p>
					</div>
				)}
			</div>
		</AscendantWindow>
	);
}
