import { useQuery } from "@tanstack/react-query";
import {
	BookOpen,
	Loader2,
	Scroll,
	Search,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	useCharacterRuneKnowledge,
	useCompendiumRunes,
	useLearnRune,
} from "@/hooks/useRunes";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import {
	type CanonicalCastableEntry,
	isCanonicalPowerLearnable,
	isCanonicalSpellLearnable,
	isCanonicalTechniqueLearnable,
	listCanonicalEntries,
} from "@/lib/canonicalCompendium";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

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

export function AddRuneDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [showOnlyNative, setShowOnlyNative] = useState(false);
	const { data: runes = [], isLoading } = useCompendiumRunes(characterId);
	const { data: character } = useCharacter(characterId);
	const { data: runeKnowledge = [] } = useCharacterRuneKnowledge(characterId);
	const learnRune = useLearnRune();
	const { toast } = useToast();
	const ascendantTools = useAscendantTools();

	const knownRuneCount = runeKnowledge.length;
	const absorbedRuneCount = runeKnowledge.filter(
		(entry) => (entry.mastery_level ?? 0) >= 5,
	).length;

	const { data: campaignId = null } = useQuery<string | null>({
		queryKey: ["add-rune-campaign-id", characterId],
		queryFn: () => getCharacterCampaignId(characterId),
		enabled: open && !!characterId,
	});

	const { data: regentNamesList = [] } = useQuery<string[]>({
		queryKey: [
			"add-rune-regent-names",
			characterId,
			(character as CharacterExtended | undefined)?.regent_overlays,
		],
		queryFn: async () => {
			const overlayIds = Array.isArray(
				(character as CharacterExtended).regent_overlays,
			)
				? ((character as CharacterExtended).regent_overlays as string[])
				: [];
			if (overlayIds.length === 0) return [];
			const regents = await listCanonicalEntries("regents");
			const overlaySet = new Set(overlayIds);
			return regents
				.filter((r) => overlaySet.has(r.id))
				.map((r) => r.name)
				.filter(
					(name): name is string => typeof name === "string" && name.length > 0,
				);
		},
		enabled: open && !!character,
	});

	// Build lookup maps for spells / powers / techniques so we can check
	// learnability of the ability each rune teaches against the character's
	// native access set. Runes are usable cross-class (with degraded recharge),
	// so we annotate rather than filter — D&D Beyond style "Known vs Available".
	const { data: abilityIndex } = useQuery({
		queryKey: ["add-rune-ability-index", campaignId],
		queryFn: async () => {
			const [spells, powers, techniques] = await Promise.all([
				listCanonicalEntries("spells", undefined, { campaignId }),
				listCanonicalEntries("powers", undefined, { campaignId }),
				listCanonicalEntries("techniques", undefined, { campaignId }),
			]);
			return {
				spellById: new Map(
					spells.map((s) => [s.id, s as CanonicalCastableEntry]),
				),
				powerById: new Map(
					powers.map((p) => [p.id, p as CanonicalCastableEntry]),
				),
				techniqueById: new Map(techniques.map((t) => [t.id, t])),
			};
		},
		enabled: open,
	});

	const characterLevel = character?.level ?? 1;
	const characterJob = character?.job ?? null;
	const characterPath = character?.path ?? null;

	const runeAccessByRuneId = useMemo(() => {
		const map = new Map<string, "native" | "cross-class" | "unknown">();
		if (!abilityIndex) return map;
		for (const rune of runes) {
			// `teaches` lives on the canonical rune shape but isn't always typed on
			// the supabase row type — read defensively.
			const teaches = (
				rune as {
					teaches?: { kind?: string | null; ref?: string | null };
				}
			).teaches;
			if (!teaches?.ref || !teaches?.kind) {
				map.set(rune.id, "unknown");
				continue;
			}
			const ref = teaches.ref;
			const options = {
				jobName: characterJob,
				pathName: characterPath,
				characterLevel,
				regentNames: regentNamesList,
				accessContext: { campaignId },
			} as const;
			let native = false;
			if (teaches.kind === "spell") {
				const entry = abilityIndex.spellById.get(ref);
				if (entry) native = isCanonicalSpellLearnable(entry, options);
			} else if (teaches.kind === "power") {
				const entry = abilityIndex.powerById.get(ref);
				if (entry) native = isCanonicalPowerLearnable(entry, options);
			} else if (teaches.kind === "technique") {
				const entry = abilityIndex.techniqueById.get(ref);
				if (entry) native = isCanonicalTechniqueLearnable(entry, options);
			}
			map.set(rune.id, native ? "native" : "cross-class");
		}
		return map;
	}, [
		runes,
		abilityIndex,
		characterJob,
		characterPath,
		characterLevel,
		regentNamesList,
		campaignId,
	]);

	const visibleRunes = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);
		const matches = runes.filter((rune) => {
			if (showOnlyNative && runeAccessByRuneId.get(rune.id) !== "native") {
				return false;
			}
			if (!trimmedQuery) return true;
			const name = (rune.name || "").toLowerCase();
			return name.includes(trimmedQuery);
		});
		// Native runes float to the top, then by rune_level, then alpha.
		const sorted = matches.slice().sort((a, b) => {
			const aAccess = runeAccessByRuneId.get(a.id);
			const bAccess = runeAccessByRuneId.get(b.id);
			const aNative = aAccess === "native" ? 0 : 1;
			const bNative = bAccess === "native" ? 0 : 1;
			if (aNative !== bNative) return aNative - bNative;
			const aLvl = a.rune_level ?? 0;
			const bLvl = b.rune_level ?? 0;
			if (aLvl !== bLvl) return aLvl - bLvl;
			return a.name.localeCompare(b.name);
		});
		return sorted.slice(0, 100);
	}, [runes, runeAccessByRuneId, searchQuery, showOnlyNative]);

	const totalNativeCount = useMemo(() => {
		let count = 0;
		for (const access of runeAccessByRuneId.values()) {
			if (access === "native") count += 1;
		}
		return count;
	}, [runeAccessByRuneId]);

	const handleAdd = async (rune: (typeof runes)[0]) => {
		const displayName = formatRegentVernacular(rune.name);
		try {
			await learnRune.mutateAsync({
				characterId,
				runeId: rune.id,
				isMastered: false,
			});

			toast({
				title: "Rune Discovered",
				description: `${displayName} has been added to your rune knowledge. You can now absorb it.`,
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`Discovered Rune: ${displayName}`,
					"Acquired",
					"SA",
				)
				.catch(console.error);

			onOpenChange(false);
			setSearchQuery("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to add rune.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 flex-wrap">
						<span>Discover Rune</span>
						{characterJob && abilityIndex && (
							<Badge variant="outline" className="text-xs">
								{totalNativeCount} native of {runes.length} total
							</Badge>
						)}
						<Badge variant="secondary" className="text-xs">
							{absorbedRuneCount} absorbed / {knownRuneCount} discovered
						</Badge>
					</DialogTitle>
					<DialogDescription>
						Search and discover runes from the compendium. Native runes match
						your job/path/regent access; cross-class runes work too but at
						higher cost per the Cross-Class Adaptation rule.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="flex items-center gap-3 flex-wrap">
						<div className="relative flex-1 min-w-[200px]">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search runes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						{characterJob && (
							<div className="flex items-center gap-2">
								<Switch
									id="rune-native-only"
									checked={showOnlyNative}
									onCheckedChange={setShowOnlyNative}
								/>
								<Label htmlFor="rune-native-only" className="text-sm">
									Native only
								</Label>
							</div>
						)}
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleRunes.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No runes found matching your search."
									: showOnlyNative
										? "No native runes available. Try unchecking 'Native only'."
										: "No runes available."}
							</div>
						) : (
							visibleRunes.map((rune) => {
								const TypeIcon = RUNE_TYPE_ICONS[rune.rune_type] || BookOpen;
								const access = runeAccessByRuneId.get(rune.id);
								return (
									<div
										key={rune.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<TypeIcon className="w-4 h-4 text-primary" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(rune.name)}
													</span>
													{characterJob && access === "native" && (
														<Badge
															variant="default"
															className="text-xs bg-green-600/20 text-green-700 border-green-600/30"
														>
															Native
														</Badge>
													)}
													{characterJob && access === "cross-class" && (
														<Badge
															variant="outline"
															className="text-xs text-gate-s border-gate-s/40"
														>
															Cross-class
														</Badge>
													)}
													<Badge
														variant="outline"
														className="text-xs capitalize"
													>
														{rune.rune_type}
													</Badge>
													<Badge variant="secondary" className="text-xs">
														Level {rune.rune_level}
													</Badge>
													<Badge variant="outline" className="text-xs">
														{rune.rarity}
													</Badge>
													{(rune as { source_book?: string | null })
														.source_book && (
														<Badge
															variant="secondary"
															className="text-[11px] uppercase bg-primary/10 text-primary/80 border-primary/20"
														>
															{formatRegentVernacular(
																(rune as { source_book?: string | null })
																	.source_book as string,
															)}
														</Badge>
													)}
												</div>
												{rune.description && (
													<p className="text-sm leading-relaxed text-muted-foreground mt-1">
														{formatRegentVernacular(rune.description)}
													</p>
												)}
											</div>
											<Button
												size="sm"
												onClick={() => handleAdd(rune)}
												disabled={learnRune.isPending}
											>
												Add
											</Button>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
