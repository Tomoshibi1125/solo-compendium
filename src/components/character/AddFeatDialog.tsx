import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Sparkles } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useCharacterChoiceTotals } from "@/hooks/useCharacterChoiceTotals";
import { useCharacter } from "@/hooks/useCharacters";
import { useCompendiumFeats, useFeatures } from "@/hooks/useFeatures";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import type { Json } from "@/integrations/supabase/types";
import {
	filterPublishedHomebrewRecords,
	type HomebrewRuntimeFeat,
	mapHomebrewFeatForRuntime,
} from "@/lib/homebrewRuntime";
import {
	type PrereqCharacterContext,
	parsePrerequisiteText,
	validatePrereq,
} from "@/lib/prerequisites";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";
import type { CompendiumFeat } from "@/types/compendium";
import type { AbilityScore } from "@/types/core-rules";

interface PrereqEvaluation {
	met: boolean;
	missing: string[];
}

const ABILITY_KEYS = [
	"strength",
	"agility",
	"vitality",
	"intelligence",
	"sense",
	"presence",
] as const;

type AbilityKey = (typeof ABILITY_KEYS)[number];

interface CharacterForPrereqs {
	level?: number | null;
	job?: string | null;
	strength?: number | null;
	agility?: number | null;
	vitality?: number | null;
	intelligence?: number | null;
	sense?: number | null;
	presence?: number | null;
}

function getAbilityScore(
	character: CharacterForPrereqs | null | undefined,
	key: AbilityKey,
): number | null {
	if (!character) return null;
	const value = character[key];
	return typeof value === "number" ? value : null;
}

function evaluateFeatPrereqs(
	feat: CompendiumFeat,
	character: CharacterForPrereqs | null | undefined,
): PrereqEvaluation {
	const prereqs = feat.prerequisites;
	if (!prereqs || typeof prereqs === "string" || Array.isArray(prereqs)) {
		// String / string[] prereqs are advisory prose — surface them as a missing
		// chip when a character is present so the user is aware, but don't block.
		const advisory =
			typeof prereqs === "string"
				? [prereqs]
				: Array.isArray(prereqs)
					? prereqs
					: [];
		if (!character || advisory.length === 0) {
			return { met: true, missing: [] };
		}
		// B3/P1.8: parse the prose prereq ("Strength 13 or higher",
		// "Proficiency with heavy armor") and actually check it against the
		// character via the shared validatePrereq helper. Still warn-but-allow
		// (DDB-style): unmet requirements are surfaced, not blocked.
		const ctx: PrereqCharacterContext = {
			level: character.level ?? 1,
			job: character.job ?? null,
			abilities: {
				STR: getAbilityScore(character, "strength") ?? 10,
				AGI: getAbilityScore(character, "agility") ?? 10,
				VIT: getAbilityScore(character, "vitality") ?? 10,
				INT: getAbilityScore(character, "intelligence") ?? 10,
				SENSE: getAbilityScore(character, "sense") ?? 10,
				PRE: getAbilityScore(character, "presence") ?? 10,
			} as Record<AbilityScore, number>,
		};
		const checkedMissing: string[] = [];
		for (const prose of advisory) {
			const spec = parsePrerequisiteText(prose);
			if (!spec) {
				checkedMissing.push(prose); // un-parseable → show as-is
				continue;
			}
			const result = validatePrereq(spec, ctx);
			if (!result.ok) checkedMissing.push(...result.missing);
		}
		return { met: checkedMissing.length === 0, missing: checkedMissing };
	}

	const missing: string[] = [];
	const characterLevel = character?.level ?? 0;
	const characterJob = (character?.job ?? "").trim().toLowerCase();

	for (const [rawKey, rawValue] of Object.entries(prereqs)) {
		const key = rawKey.trim().toLowerCase();
		if (key === "level") {
			const required = Number(rawValue);
			if (Number.isFinite(required) && characterLevel < required) {
				missing.push(`Level ${required}`);
			}
			continue;
		}
		if (key === "job" || key === "class") {
			const required = Array.isArray(rawValue)
				? rawValue.map((v) => String(v).toLowerCase())
				: [String(rawValue).toLowerCase()];
			if (!required.includes(characterJob)) {
				missing.push(
					`Job: ${required.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(" / ")}`,
				);
			}
			continue;
		}
		if (ABILITY_KEYS.includes(key as AbilityKey)) {
			const required = Number(rawValue);
			const actual = getAbilityScore(character, key as AbilityKey);
			if (Number.isFinite(required) && (actual ?? 0) < required) {
				missing.push(
					`${key.charAt(0).toUpperCase() + key.slice(1)} ${required}`,
				);
			}
			continue;
		}
		if (
			key === "ability_score" &&
			typeof rawValue === "object" &&
			rawValue !== null &&
			!Array.isArray(rawValue)
		) {
			for (const [ab, val] of Object.entries(
				rawValue as unknown as Record<string, unknown>,
			)) {
				const score = Number(val);
				const actual = getAbilityScore(character, ab as AbilityKey);
				if (Number.isFinite(score) && (actual ?? 0) < score) {
					missing.push(`${ab.charAt(0).toUpperCase() + ab.slice(1)} ${score}`);
				}
			}
		}
	}

	return { met: missing.length === 0, missing };
}

export function AddFeatDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { data: feats = [], isLoading } = useCompendiumFeats();
	const { addFeature, features = [] } = useFeatures(characterId);
	const { data: character } = useCharacter(characterId);
	const { data: choiceTotals } = useCharacterChoiceTotals(characterId);
	const { toast } = useToast();
	const { data: campaignId = null } = useQuery<string | null>({
		queryKey: ["add-feat-campaign-id", characterId],
		queryFn: () => getCharacterCampaignId(characterId),
		enabled: open && !!characterId,
	});
	const { data: publishedHomebrew = [], isLoading: homebrewLoading } =
		usePublishedHomebrew("feat", campaignId);
	const homebrewFeats = useMemo<HomebrewRuntimeFeat[]>(
		() =>
			filterPublishedHomebrewRecords(publishedHomebrew, "feat").map(
				mapHomebrewFeatForRuntime,
			),
		[publishedHomebrew],
	);
	const allFeats = useMemo(
		() => [...feats, ...(homebrewFeats as unknown as typeof feats)],
		[feats, homebrewFeats],
	);

	const knownFeatCount = useMemo(
		() =>
			features.filter((f) => (f.source ?? "").toLowerCase().includes("feat"))
				.length,
		[features],
	);

	const visibleFeats = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);
		const filtered = trimmedQuery
			? allFeats.filter((feat) => {
					const name = (feat.name || "").toLowerCase();
					const desc = (feat.description || "").toLowerCase();
					return name.includes(trimmedQuery) || desc.includes(trimmedQuery);
				})
			: allFeats;
		// Sort eligible feats first so the user sees actionable options up top.
		return filtered
			.slice()
			.sort((a, b) => {
				const aMet = evaluateFeatPrereqs(
					a as CompendiumFeat,
					character as CharacterForPrereqs | null,
				).met
					? 0
					: 1;
				const bMet = evaluateFeatPrereqs(
					b as CompendiumFeat,
					character as CharacterForPrereqs | null,
				).met
					? 0
					: 1;
				if (aMet !== bMet) return aMet - bMet;
				return a.name.localeCompare(b.name);
			})
			.slice(0, 100);
	}, [allFeats, searchQuery, character]);

	const handleAdd = async (feat: (typeof allFeats)[0]) => {
		const displayName = formatRegentVernacular(feat.name);
		const isHomebrewFeat = (feat as { _homebrew?: boolean })._homebrew;
		try {
			await addFeature({
				character_id: characterId,
				name: feat.name,
				description: feat.description,
				source: isHomebrewFeat ? "Homebrew Feat" : "feat",
				level_acquired: character?.level ?? 1,
				feat_id: isHomebrewFeat ? null : feat.id,
				homebrew_id: isHomebrewFeat
					? (feat as { homebrew_id?: string }).homebrew_id
					: null,
				modifiers: isHomebrewFeat
					? (((feat as { modifiers?: unknown }).modifiers ??
							null) as Json | null)
					: null,
			});

			toast({
				title: "Feat Added",
				description: `${displayName} has been added to your features.`,
			});

			onOpenChange(false);
			setSearchQuery("");
		} catch (error: unknown) {
			console.error("Add feat error:", error);
			const message =
				error instanceof Error ? error.message : "Failed to add feat.";
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 flex-wrap">
						<span>Add Feat</span>
						{choiceTotals && choiceTotals.feats > 0 && (
							<Badge variant="outline" className="text-xs">
								{knownFeatCount} / {choiceTotals.feats} feats
							</Badge>
						)}
					</DialogTitle>
					<DialogDescription>
						Search and add feats from the compendium to your character
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search feats..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading || homebrewLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleFeats.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No feats found matching your search."
									: "No feats available."}
							</div>
						) : (
							visibleFeats.map((feat) => {
								const evaluation = evaluateFeatPrereqs(
									feat as CompendiumFeat,
									character as CharacterForPrereqs | null,
								);
								return (
									<div
										key={feat.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<Sparkles className="w-4 h-4 text-primary" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(feat.name)}
													</span>
													{feat.source_book && (
														<Badge variant="outline" className="text-xs">
															{formatRegentVernacular(feat.source_book)}
														</Badge>
													)}
													{!evaluation.met &&
														evaluation.missing.map((req) => (
															<Badge
																key={req}
																variant="outline"
																className="text-xs text-gate-s border-gate-s/40"
															>
																Requires {req}
															</Badge>
														))}
												</div>
												{feat.description && (
													<p className="text-sm leading-relaxed text-muted-foreground mt-1">
														{formatRegentVernacular(feat.description)}
													</p>
												)}
											</div>
											<Button
												size="sm"
												onClick={() => handleAdd(feat)}
												disabled={!evaluation.met}
												title={
													evaluation.met
														? undefined
														: `Requires: ${evaluation.missing.join(", ")}`
												}
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
