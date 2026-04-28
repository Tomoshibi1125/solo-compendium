import { useQuery } from "@tanstack/react-query";
import { Loader2, ScrollText, Search } from "lucide-react";
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
import { useSpells } from "@/hooks/useSpells";
import type { CharacterExtended } from "@/integrations/supabase/supabaseExtended";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
	listCanonicalSpells,
	listLearnableSpells,
} from "@/lib/canonicalCompendium";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

export function AddSpellDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [showAll, setShowAll] = useState(false);
	const { addSpell } = useSpells(characterId);
	const { data: character } = useCharacter(characterId);
	const { toast } = useToast();

	const { data: regentNamesList = [] } = useQuery<string[]>({
		queryKey: [
			"add-spell-regent-names",
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

	const { data: spells = [], isLoading } = useQuery<CanonicalCastableEntry[]>({
		queryKey: [
			"compendium-spells",
			characterId,
			searchQuery,
			character?.job,
			character?.path,
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
				return listCanonicalSpells(search, { campaignId });
			}

			return listLearnableSpells({
				search,
				accessContext: { campaignId },
				jobName: character.job,
				pathName: character.path ?? null,
				regentNames: regentNamesList,
			});
		},
		enabled: open && !!character?.job,
	});

	const visibleSpells = useMemo(
		() =>
			[...spells].sort(
				(a, b) =>
					(a.power_level ?? 0) - (b.power_level ?? 0) ||
					a.name.localeCompare(b.name),
			),
		[spells],
	);

	const handleAdd = async (spell: CanonicalCastableEntry) => {
		const displayName = formatRegentVernacular(spell.name);
		try {
			await addSpell.mutateAsync({
				character_id: characterId,
				spell_id: spell.id,
				name: spell.name,
				spell_level: spell.power_level,
				source: "Compendium Spell",
				casting_time: spell.casting_time || null,
				range: spell.range || null,
				duration: spell.duration || null,
				concentration: spell.concentration || false,
				ritual: spell.ritual || false,
				description: spell.description || null,
				higher_levels: spell.higher_levels || null,
				is_prepared: false,
				is_known: true,
				counts_against_limit: true,
			});

			toast({
				title: "Spell added",
				description: `${displayName} has been added to your spells.`,
			});

			onOpenChange(false);
			setSearchQuery("");
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Failed to add spell.";
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
					<DialogTitle>Add Spell</DialogTitle>
					<DialogDescription>
						Search and add spells from the compendium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="flex items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search spells..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							<Switch
								id="add-spell-show-all"
								checked={showAll}
								onCheckedChange={setShowAll}
							/>
							<Label
								htmlFor="add-spell-show-all"
								className="text-xs cursor-pointer"
							>
								Show all
							</Label>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleSpells.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No spells found matching your search."
									: showAll
										? "No spells available."
										: "No lore-matched spells are available for this job."}
							</div>
						) : (
							visibleSpells.map((spell) => (
								<div
									key={spell.id}
									className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1 flex-wrap">
												<ScrollText className="w-4 h-4 text-primary" />
												<span className="font-heading font-semibold">
													{formatRegentVernacular(spell.name)}
												</span>
												<Badge variant="secondary" className="text-xs">
													{spell.power_level === 0
														? "Cantrip"
														: `Level ${spell.power_level}`}
												</Badge>
												{spell.ritual && (
													<Badge variant="outline" className="text-xs">
														Ritual
													</Badge>
												)}
												{spell.concentration && (
													<Badge variant="destructive" className="text-xs">
														Concentration
													</Badge>
												)}
											</div>
											{spell.description && (
												<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
													{formatRegentVernacular(spell.description)}
												</p>
											)}
										</div>
										<Button size="sm" onClick={() => handleAdd(spell)}>
											Add
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
