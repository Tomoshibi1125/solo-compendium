import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePowers } from "@/hooks/usePowers";
import { useStaticJobs } from "@/hooks/useStaticJobs";
import { supabase } from "@/integrations/supabase/client";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import {
	getCantripsKnownLimit,
	getSpellsKnownLimit,
} from "@/lib/characterCalculations";
import { getMaxPowerLevelForJobAtLevel } from "@/lib/characterCreation";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

export function AddPowerDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [levelTab, setLevelTab] = useState<string>("all");
	const {
		addPower,
		removePower,
		powers: characterPowers,
	} = usePowers(characterId);
	const { toast } = useToast();
	const { data: character } = useCharacter(characterId);
	const { data: characterCampaign } = useCampaignByCharacterId(characterId);
	const campaignId = characterCampaign?.id ?? null;
	const ascendantTools = useAscendantTools();
	const { data: staticJobs } = useStaticJobs();
	const jobObj = useMemo(
		() => staticJobs?.find((j) => j.name === character?.job),
		[staticJobs, character?.job],
	);

	const [replaceTarget, setReplaceTarget] = useState<null | {
		powerToLearn: { name: string; power_level: number };
		kind: "cantrip" | "known";
		limit: number;
	}>(null);

	const maxPowerLevel = character
		? getMaxPowerLevelForJobAtLevel(jobObj || character.job, character.level)
		: 0;

	const { data: powers = [], isLoading } = useQuery({
		queryKey: [
			"compendium-powers",
			characterId,
			campaignId,
			searchQuery,
			character?.job,
			character?.level,
		],
		queryFn: async () => {
			if (!character?.job) return [];

			const regentOverlayIds = Array.isArray(
				(character as CharacterExtended).regent_overlays,
			)
				? ((character as CharacterExtended).regent_overlays as string[])
				: Array.isArray((character as CharacterExtended).regent_overlays)
					? ((character as CharacterExtended).regent_overlays as string[])
					: [];
			let regentNames: string[] = [];
			if (regentOverlayIds.length > 0) {
				const canonicalResult = await supabase
					.from("compendium_regents")
					.select("name")
					.in("id", regentOverlayIds);

				let regentRows = canonicalResult.data as Array<{
					name?: string | null;
				}> | null;
				if (canonicalResult.error) {
					const fallbackResult = await supabase
						.from("compendium_regents")
						.select("name")
						.in("id", regentOverlayIds);
					if (fallbackResult.error) throw fallbackResult.error;
					regentRows = fallbackResult.data as Array<{
						name?: string | null;
					}> | null;
				}

				regentNames = (regentRows || [])
					.map((row) => row?.name)
					.filter(
						(name): name is string =>
							typeof name === "string" && name.length > 0,
					);
			}

			const orParts: string[] = [];
			const escapeValue = (value: string) => value.replaceAll('"', '\\"');

			if (character.job) {
				orParts.push(`job_names.cs.{"${escapeValue(character.job)}"}`);
			}
			if (character.path) {
				orParts.push(`path_names.cs.{"${escapeValue(character.path)}"}`);
			}
			for (const regentName of regentNames) {
				orParts.push(`regent_names.cs.{"${escapeValue(regentName)}"}`);
			}

			let query = supabase
				.from("compendium_powers")
				.select("*")
				.or(orParts.join(","))
				.lte("power_level", maxPowerLevel)
				.limit(200);

			const trimmedQuery = searchQuery.trim();
			if (trimmedQuery) {
				const canonicalQuery = normalizeRegentSearch(trimmedQuery);
				query = query.ilike("name", `%${canonicalQuery}%`);
			}

			const { data, error } = await query;

			// If Supabase returned results, use them
			if (!error && data && data.length > 0) {
				return filterRowsBySourcebookAccess(
					data,
					(power) => power.source_book,
					{ campaignId },
				);
			}

			// Static fallback: use spells.ts which has proper level (0-9) and classes[] fields
			const { spells } = await import("@/data/compendium/spells");
			const jobNameLower = (character?.job ?? "").toLowerCase();
			const filtered = spells
				.filter((spell) => {
					// Level gate
					if ((spell.level ?? 0) > maxPowerLevel) return false;
					// Job filter: match classes array if present, otherwise show all
					if (spell.classes && spell.classes.length > 0) {
						const matches = spell.classes.some(
							(c) => c.toLowerCase() === jobNameLower,
						);
						if (!matches) return false;
					}
					// Search filter
					if (trimmedQuery) {
						const q = trimmedQuery.toLowerCase();
						return (
							spell.name.toLowerCase().includes(q) ||
							(spell.description || "").toLowerCase().includes(q)
						);
					}
					return true;
				})
				.slice(0, 200);

			return filtered.map((spell) => ({
				id: spell.id,
				name: spell.name,
				description: spell.description ?? "",
				power_level: spell.level,
				school: spell.school ?? null,
				casting_time: spell.castingTime ?? null,
				range: typeof spell.range === "string" ? spell.range : null,
				duration: typeof spell.duration === "string" ? spell.duration : null,
				concentration: spell.concentration ?? false,
				higher_levels: spell.atHigherLevels ?? null,
				source_book: "System Ascendant Canon",
				source_name: null,
				source_kind: null,
				job_names: character?.job ? [character.job] : [],
				path_names: character?.path ? [character.path] : [],
				regent_names: [],
				created_at: new Date().toISOString(),
				display_name: spell.name,
				aliases: null,
				license_note: null,
				tags: [spell.school, spell.type].filter(Boolean) as string[],
				theme_tags: null,
			})) as unknown as NonNullable<typeof data>;
		},
		enabled: open && !!character?.job,
	});

	const sortedPowers = useMemo(() => {
		return [...powers].sort(
			(a, b) =>
				(a.power_level ?? 0) - (b.power_level ?? 0) ||
				a.name.localeCompare(b.name),
		);
	}, [powers]);

	const visiblePowers = useMemo(() => {
		if (levelTab === "all") return sortedPowers;
		const wanted = parseInt(levelTab, 10);
		if (Number.isNaN(wanted)) return sortedPowers;
		return sortedPowers.filter((p) => (p.power_level ?? 0) === wanted);
	}, [sortedPowers, levelTab]);

	const availableLevels = useMemo(() => {
		const set = new Set<number>();
		for (const p of sortedPowers) set.add(p.power_level ?? 0);
		return Array.from(set).sort((a, b) => a - b);
	}, [sortedPowers]);

	const knownNonCantripCount = useMemo(
		() => characterPowers.filter((p) => (p.power_level ?? 0) > 0).length,
		[characterPowers],
	);
	const knownCantripCount = useMemo(
		() => characterPowers.filter((p) => (p.power_level ?? 0) === 0).length,
		[characterPowers],
	);

	const replaceEligiblePowers = useMemo(() => {
		if (!replaceTarget) return [];
		const wantedLevel = replaceTarget.kind === "cantrip" ? 0 : 1;
		return characterPowers
			.filter((p) => {
				const level = p.power_level ?? 0;
				return wantedLevel === 0 ? level === 0 : level > 0;
			})
			.sort(
				(a, b) =>
					(a.power_level ?? 0) - (b.power_level ?? 0) ||
					a.name.localeCompare(b.name),
			);
	}, [characterPowers, replaceTarget]);

	const handleAdd = async (power: (typeof powers)[0]) => {
		const displayName = formatRegentVernacular(power.name);
		try {
			if (character?.job) {
				if (power.power_level === 0) {
					const cantripLimit = getCantripsKnownLimit(
						character.job,
						character.level,
					);
					if (cantripLimit !== null && knownCantripCount >= cantripLimit) {
						setReplaceTarget({
							powerToLearn: {
								name: power.name,
								power_level: power.power_level,
							},
							kind: "cantrip",
							limit: cantripLimit,
						});
						toast({
							title: "Cantrip Limit Reached",
							description: `You can only know ${cantripLimit} cantrips. Replace one to learn ${displayName}.`,
							variant: "destructive",
						});
						return;
					}
				} else {
					const knownLimit = getSpellsKnownLimit(
						character.job,
						character.level,
					);
					if (knownLimit !== null && knownNonCantripCount >= knownLimit) {
						setReplaceTarget({
							powerToLearn: {
								name: power.name,
								power_level: power.power_level,
							},
							kind: "known",
							limit: knownLimit,
						});
						toast({
							title: "Known Limit Reached",
							description: `You can only know ${knownLimit} powers at this level. Replace one to learn ${displayName}.`,
							variant: "destructive",
						});
						return;
					}
				}
			}

			await addPower({
				character_id: characterId,
				name: power.name,
				power_level: power.power_level,
				source: "Compendium",
				casting_time: power.casting_time || null,
				range: power.range || null,
				duration: power.duration || null,
				concentration: power.concentration || false,
				description: power.description || null,
				higher_levels: power.higher_levels || null,
				is_prepared: false,
				is_known: true,
			});

			toast({
				title: "Power added",
				description: `${displayName} has been added to your powers.`,
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`Learned: ${displayName}`,
					"Acquired Power",
					"SA",
				)
				.catch(console.error);

			onOpenChange(false);
			setSearchQuery("");
			setReplaceTarget(null);
		} catch {
			toast({
				title: "Error",
				description: "Failed to add power.",
				variant: "destructive",
			});
		}
	};

	const handleReplace = async (existingPowerId: string) => {
		if (!replaceTarget) return;

		const { powerToLearn } = replaceTarget;
		const displayName = formatRegentVernacular(powerToLearn.name);

		try {
			await removePower(existingPowerId);

			await addPower({
				character_id: characterId,
				name: powerToLearn.name,
				power_level: powerToLearn.power_level,
				source: "Compendium",
				casting_time: null,
				range: null,
				duration: null,
				concentration: false,
				description: null,
				higher_levels: null,
				is_prepared: false,
				is_known: true,
			});

			toast({
				title: "Power replaced",
				description: `${displayName} has been learned.`,
			});

			ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`Learned: ${displayName}`,
					"Replaced Power",
					"SA",
				)
				.catch(console.error);

			setReplaceTarget(null);
			onOpenChange(false);
			setSearchQuery("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to replace power.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Power</DialogTitle>
					<DialogDescription>
						Search and add powers from the compendium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					{replaceTarget && (
						<div className="p-3 rounded-lg border bg-muted/30">
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1">
									<div className="font-heading font-semibold">
										Replace a{" "}
										{replaceTarget.kind === "cantrip"
											? "Cantrip"
											: "Known Power"}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										Limit: {replaceTarget.limit}. Select one to replace with{" "}
										{formatRegentVernacular(replaceTarget.powerToLearn.name)}.
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setReplaceTarget(null)}
								>
									Cancel
								</Button>
							</div>

							<div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto">
								{replaceEligiblePowers.length === 0 ? (
									<div className="text-xs text-muted-foreground">
										No eligible powers to replace.
									</div>
								) : (
									replaceEligiblePowers.map((p) => (
										<button
											key={p.id}
											type="button"
											className="w-full text-left p-2 rounded-md border bg-background/40 hover:bg-background/70 transition-colors"
											onClick={() => handleReplace(p.id)}
										>
											<div className="flex items-center justify-between gap-2">
												<div className="text-sm font-heading font-semibold">
													{formatRegentVernacular(p.name)}
												</div>
												{(p.power_level ?? 0) > 0 ? (
													<Badge variant="secondary" className="text-xs">
														Level {p.power_level}
													</Badge>
												) : (
													<Badge variant="outline" className="text-xs">
														Cantrip
													</Badge>
												)}
											</div>
										</button>
									))
								)}
							</div>
						</div>
					)}

					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search powers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Tabs value={levelTab} onValueChange={setLevelTab}>
						<TabsList className="w-full justify-start overflow-x-auto">
							<TabsTrigger value="all">All</TabsTrigger>
							{availableLevels.map((lvl) => (
								<TabsTrigger key={lvl} value={String(lvl)}>
									{lvl === 0 ? "Cantrips" : `Lvl ${lvl}`}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent
							value={levelTab}
							className="mt-3 flex-1 overflow-y-auto space-y-2"
						>
							{isLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-6 h-6 animate-spin text-primary" />
								</div>
							) : visiblePowers.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									{maxPowerLevel === 0
										? "This job has no spellcasting progression. Powers cannot be added."
										: searchQuery
											? "No powers found matching your search."
											: "No powers available for this job at your current level."}
								</div>
							) : (
								visiblePowers.map((power) => (
									<div
										key={power.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<span className="font-heading font-semibold">
														{formatRegentVernacular(power.name)}
													</span>
													{(power.power_level ?? 0) > 0 ? (
														<Badge variant="secondary" className="text-xs">
															Level {power.power_level}
														</Badge>
													) : (
														<Badge variant="outline" className="text-xs">
															Cantrip
														</Badge>
													)}
													{power.school && (
														<Badge variant="outline" className="text-xs">
															{formatRegentVernacular(power.school)}
														</Badge>
													)}
													{power.concentration && (
														<Badge variant="destructive" className="text-xs">
															Concentration
														</Badge>
													)}
												</div>
												{power.description && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{formatRegentVernacular(power.description)}
													</p>
												)}
												<div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
													{power.casting_time && (
														<span>
															{formatRegentVernacular(power.casting_time)}
														</span>
													)}
													{power.range && (
														<span>{formatRegentVernacular(power.range)}</span>
													)}
												</div>
											</div>
											<Button size="sm" onClick={() => handleAdd(power)}>
												Add
											</Button>
										</div>
									</div>
								))
							)}
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}
