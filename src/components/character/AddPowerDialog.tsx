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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePowers } from "@/hooks/usePowers";
import {
	isRuneGranted,
	useRuneGrantedAbilities,
} from "@/hooks/useRuneGrantedAbilities";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
	listCanonicalPowers,
	listLearnablePowers,
} from "@/lib/canonicalCompendium";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
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
	const [showAll, setShowAll] = useState(false);
	const { addPower } = usePowers(characterId);
	const { toast } = useToast();
	const { data: character } = useCharacter(characterId);
	const ascendantTools = useAscendantTools();
	const { grantedAbilityNames } = useRuneGrantedAbilities(characterId);

	const { data: regentNamesList = [] } = useQuery<string[]>({
		queryKey: [
			"add-power-regent-names",
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

	const { data: powers = [], isLoading } = useQuery<CanonicalCastableEntry[]>({
		queryKey: [
			"compendium-powers",
			characterId,
			searchQuery,
			character?.job,
			character?.level,
			showAll,
		],
		queryFn: async () => {
			if (!character?.job) return [];

			const campaignId = await getCharacterCampaignId(characterId);
			const trimmedQuery = searchQuery.trim();
			const search = trimmedQuery
				? normalizeRegentSearch(trimmedQuery).toLowerCase()
				: undefined;

			if (showAll) {
				return listCanonicalPowers(search, { campaignId });
			}

			return listLearnablePowers({
				search,
				accessContext: { campaignId },
				jobName: character.job,
				pathName: character.path ?? null,
				regentNames: regentNamesList,
			});
		},
		enabled: open && !!character?.job,
	});

	// Compute access sources (Job / Path / Regent / Rune) for each entry shown.
	const accessByEntryId = useMemo(() => {
		const job = (character?.job ?? "").trim().toLowerCase();
		const path = (character?.path ?? "").trim().toLowerCase();
		const regents = new Set(
			regentNamesList.map((n) => n.trim().toLowerCase()).filter(Boolean),
		);
		const result = new Map<string, string[]>();
		for (const entry of powers) {
			const sources: string[] = [];
			const tagSet = new Set(
				entry.tags
					.map((t) => t.trim().toLowerCase())
					.filter((t) => t.length > 0),
			);
			if (job && tagSet.has(job)) sources.push("Job");
			if (path && tagSet.has(path)) sources.push("Path");
			for (const regent of regents) {
				if (tagSet.has(regent)) {
					sources.push("Regent");
					break;
				}
			}
			if (isRuneGranted(entry.name, grantedAbilityNames)) {
				sources.push("Rune");
			}
			result.set(entry.id, sources);
		}
		return result;
	}, [
		powers,
		character?.job,
		character?.path,
		regentNamesList,
		grantedAbilityNames,
	]);

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

	const handleAdd = async (power: (typeof powers)[0]) => {
		const displayName = formatRegentVernacular(power.name);
		const source = "Compendium Power";
		try {
			await addPower({
				character_id: characterId,
				name: power.name,
				power_level: power.power_level,
				source,
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
		} catch {
			toast({
				title: "Error",
				description: "Failed to add power.",
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
					<div className="flex items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search powers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							<Switch
								id="add-power-show-all"
								checked={showAll}
								onCheckedChange={setShowAll}
							/>
							<Label
								htmlFor="add-power-show-all"
								className="text-xs cursor-pointer"
							>
								Show all
							</Label>
						</div>
					</div>

					<Tabs value={levelTab} onValueChange={setLevelTab}>
						<TabsList className="w-full justify-start overflow-x-auto">
							<TabsTrigger value="all">All</TabsTrigger>
							{availableLevels.map((lvl) => (
								<TabsTrigger key={lvl} value={String(lvl)}>
									{`Lvl ${lvl}`}
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
									{searchQuery
										? "No powers found matching your search."
										: "No lore-matched powers available for this job."}
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
															Level 0
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
													{(accessByEntryId.get(power.id) ?? []).map((src) => (
														<Badge
															key={src}
															variant={src === "Rune" ? "default" : "outline"}
															className="text-[10px] uppercase tracking-wider"
														>
															{src}
														</Badge>
													))}
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
