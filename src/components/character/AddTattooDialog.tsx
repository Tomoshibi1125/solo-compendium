import { useQuery } from "@tanstack/react-query";
import { HeartPulse, Loader2, Search, Sparkles } from "lucide-react";
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
import { type CharacterTattooInsert, useTattoos } from "@/hooks/useTattoos";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { formatRaCurrencyValue } from "@/lib/currency";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumTattoo } from "@/types/compendium";
import { AddDialogDetailPanel } from "./AddDialogDetailPanel";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const requiresTattooAttunement = (tattoo: CompendiumTattoo) => {
	if (isRecord(tattoo.limitations)) {
		const requires = tattoo.limitations.requires_attunement;
		if (typeof requires === "boolean") return requires;
	}
	return !!tattoo.attunement;
};

const getPrimaryTattooText = (tattoo: CompendiumTattoo) => {
	if (isRecord(tattoo.effects)) {
		const primary = tattoo.effects.primary ?? tattoo.effects.primaryEffect;
		if (typeof primary === "string") return primary;
		if (Array.isArray(tattoo.effects.passive)) {
			const firstPassive = tattoo.effects.passive.find(
				(value): value is string => typeof value === "string",
			);
			if (firstPassive) return firstPassive;
		}
	}
	return tattoo.description ?? "";
};

export function AddTattooDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { tattoos: ownedTattoos, addTattoo } = useTattoos(characterId);
	const { toast } = useToast();
	const { data: campaignId = null } = useQuery<string | null>({
		queryKey: ["add-tattoo-campaign-id", characterId],
		queryFn: () => getCharacterCampaignId(characterId),
		enabled: open && !!characterId,
	});
	const { data: tattoos = [], isLoading } = useQuery({
		queryKey: ["compendium-tattoos", characterId, searchQuery, campaignId],
		queryFn: async () => {
			const entries = await listCanonicalEntries(
				"tattoos",
				searchQuery.trim() || undefined,
				{ campaignId },
			);
			return entries as unknown as CompendiumTattoo[];
		},
		enabled: open,
	});

	const ownedTattooIds = useMemo(
		() =>
			new Set(ownedTattoos.map((tattoo) => tattoo.tattoo_id).filter(Boolean)),
		[ownedTattoos],
	);
	const visibleTattoos = useMemo(
		() =>
			tattoos.filter((tattoo) => !ownedTattooIds.has(tattoo.id)).slice(0, 40),
		[ownedTattooIds, tattoos],
	);

	const handleAdd = async (tattoo: CompendiumTattoo) => {
		const requiresAttunement = requiresTattooAttunement(tattoo);
		const displayName = formatRegentVernacular(
			tattoo.display_name || tattoo.name,
		);
		try {
			const tattooInsert: CharacterTattooInsert = {
				character_id: characterId,
				tattoo_id: tattoo.id,
				name: tattoo.display_name || tattoo.name,
				body_part: tattoo.body_part ?? null,
				is_active: true,
				is_attuned: false,
				requires_attunement: requiresAttunement,
				source: tattoo.source_book ?? tattoo.source ?? null,
				custom_effects: null,
				notes: null,
			};
			await addTattoo(tattooInsert);
			toast({
				title: "Tattoo added",
				description: requiresAttunement
					? `${displayName} has been added. Attune to activate its effects.`
					: `${displayName} has been added and is active.`,
			});
			onOpenChange(false);
			setSearchQuery("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to add tattoo.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Tattoo</DialogTitle>
					<DialogDescription>
						Search and add a canonical tattoo to this ascendant.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search tattoos..."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleTattoos.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No unowned tattoos found."
									: "No unowned tattoos available."}
							</div>
						) : (
							visibleTattoos.map((tattoo) => {
								const requiresAttunement = requiresTattooAttunement(tattoo);
								const primaryText = getPrimaryTattooText(tattoo);
								return (
									<div
										key={tattoo.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<HeartPulse className="w-4 h-4 text-primary" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(
															tattoo.display_name || tattoo.name,
														)}
													</span>
													{tattoo.rarity && (
														<Badge
															variant="secondary"
															className="text-xs capitalize"
														>
															{tattoo.rarity}
														</Badge>
													)}
													<Badge variant="outline" className="text-xs">
														{tattoo.body_part || "Tattoo"}
													</Badge>
													{tattoo.price != null && (
														<Badge
															variant="outline"
															className="text-xs text-gate-s border-gate-s/40"
														>
															{formatRaCurrencyValue(tattoo.price)}
														</Badge>
													)}
													{requiresAttunement && (
														<Badge
															variant="outline"
															className="text-xs border-primary/40 text-primary"
														>
															Attunement
														</Badge>
													)}
												</div>
												{primaryText && (
													<p className="text-sm leading-relaxed text-muted-foreground">
														{formatRegentVernacular(primaryText)}
													</p>
												)}
												<AddDialogDetailPanel
													stats={[
														{ label: "Placement", value: tattoo.body_part },
														{ label: "Ink Type", value: tattoo.ink_type },
														{ label: "Rarity", value: tattoo.rarity },
														{
															label: "Attunement",
															value: requiresAttunement ? "Required" : null,
														},
														{
															label: "Resonance",
															value: tattoo.resonance_effect,
														},
													]}
													properties={
														Array.isArray(tattoo.active_veins)
															? tattoo.active_veins
															: []
													}
													description={tattoo.description}
													effects={tattoo.effects}
													limitations={tattoo.limitations}
													flavor={
														typeof tattoo.flavor === "string"
															? tattoo.flavor
															: null
													}
													lore={tattoo.lore ?? null}
													discoveryLore={tattoo.discovery_lore}
													tags={tattoo.tags}
													sourceBook={tattoo.source_book ?? tattoo.source}
													extra={[
														{ label: "Mechanics", value: tattoo.mechanics },
													]}
												/>
											</div>
											<Button size="sm" onClick={() => handleAdd(tattoo)}>
												<Sparkles className="w-3.5 h-3.5 mr-1" />
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
