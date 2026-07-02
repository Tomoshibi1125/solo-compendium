import { useQuery } from "@tanstack/react-query";
import {
	ExternalLink,
	Loader2,
	PackagePlus,
	PlusCircle,
	Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WardenInlineHomebrewItemForm } from "@/components/warden-directives/WardenInlineHomebrewItemForm";
import { useToast } from "@/hooks/use-toast";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { useFeatures } from "@/hooks/useFeatures";
import {
	usePublishedHomebrew,
	useSaveHomebrewContent,
	useSetHomebrewStatus,
} from "@/hooks/useHomebrewContent";
import { usePowers } from "@/hooks/usePowers";
import { useLearnRune } from "@/hooks/useRunes";
import { useSpells } from "@/hooks/useSpells";
import { useTechniques } from "@/hooks/useTechniques";
import {
	homebrewRuntimeItemToDeliverableItem,
	linkedEntryToDeliverableItem,
	useWardenItemDelivery,
	type WardenDeliverableItem,
	type WardenDeliveryMode,
} from "@/hooks/useWardenItemDelivery";
import { mapHomebrewItemForRuntime } from "@/lib/homebrewRuntime";
import { formatRarityLabel } from "@/lib/labels";
import { formatRegentVernacular } from "@/lib/vernacular";
import { loadWardenGenerationContext } from "@/lib/wardenGenerationContext";
import {
	buildHomebrewDeliverableItem,
	buildHomebrewItemData,
	createDefaultHomebrewItemForm,
	type HomebrewItemFormState,
	parseHomebrewTags,
} from "@/lib/wardenItemHomebrew";

interface WardenItemDeliveryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId: string;
	initialItem?: WardenDeliverableItem | null;
	initialCharacterId?: string | null;
	title?: string;
}

const ALL_COMPENDIUM_TYPES = [
	"equipment",
	"items",
	"relics",
	"runes",
	"sigils",
	"artifacts",
	"tattoos",
	"spells",
	"powers",
	"feats",
	"techniques",
	"backgrounds",
] as const;

const ALL_COMPENDIUM_TYPE_SET = new Set<string>(ALL_COMPENDIUM_TYPES);

// Types that require special routing (not character_equipment)
const ABILITY_TYPE_SET = new Set([
	"spells",
	"powers",
	"feats",
	"techniques",
	"backgrounds",
]);
const RUNE_TYPE_SET = new Set(["runes"]);

const TYPE_FILTER_GROUPS = [
	{ id: "all", label: "All", types: null as Set<string> | null },
	{
		id: "items",
		label: "Items",
		types: new Set([
			"equipment",
			"items",
			"relics",
			"sigils",
			"artifacts",
			"tattoos",
		]),
	},
	{ id: "spells", label: "Spells", types: new Set(["spells"]) },
	{ id: "powers", label: "Powers", types: new Set(["powers"]) },
	{ id: "feats", label: "Feats", types: new Set(["feats", "backgrounds"]) },
	{ id: "techniques", label: "Techniques", types: new Set(["techniques"]) },
	{ id: "runes", label: "Runes", types: new Set(["runes"]) },
];

type CatalogEntry = {
	key: string;
	item: WardenDeliverableItem;
	sourceLabel: string;
};

type DeliveryPanel = "catalog" | "homebrew";

export function WardenItemDeliveryDialog({
	open,
	onOpenChange,
	campaignId,
	initialItem,
	initialCharacterId,
	title = "Deliver Item",
}: WardenItemDeliveryDialogProps) {
	const [mode, setMode] = useState<WardenDeliveryMode>("direct");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [activePanel, setActivePanel] = useState<DeliveryPanel>("catalog");
	const [selectedCatalogKey, setSelectedCatalogKey] = useState<string>("");
	const [createdItem, setCreatedItem] = useState<WardenDeliverableItem | null>(
		null,
	);
	const [homebrewForm, setHomebrewForm] = useState<HomebrewItemFormState>(
		createDefaultHomebrewItemForm,
	);
	const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
		initialCharacterId ? [initialCharacterId] : [],
	);
	const [selectedMemberId, setSelectedMemberId] =
		useState<string>("unassigned");
	const [quantity, setQuantity] = useState(1);
	const { toast } = useToast();
	const { data: members = [] } = useCampaignMembers(campaignId);
	const { deliverItem, isDelivering } = useWardenItemDelivery();
	const saveHomebrew = useSaveHomebrewContent();
	const setHomebrewStatus = useSetHomebrewStatus();
	const { data: publishedHomebrew = [], isLoading: isHomebrewLoading } =
		usePublishedHomebrew("item", campaignId);

	// Hooks for ability-type delivery — bound to first selected character
	const primaryCharId = selectedCharacterIds[0] ?? "";
	const { addSpell } = useSpells(primaryCharId);
	const { addPower } = usePowers(primaryCharId);
	const { addTechnique } = useTechniques(primaryCharId);
	const { addFeature } = useFeatures(primaryCharId);
	const learnRune = useLearnRune();

	useEffect(() => {
		if (!open) return;
		setSelectedCharacterIds(initialCharacterId ? [initialCharacterId] : []);
		setSelectedMemberId("unassigned");
		setSelectedCatalogKey("");
		setCreatedItem(null);
		setQuantity(1);
		setActivePanel("catalog");
		setTypeFilter("all");
		setSearch("");
		setHomebrewForm(createDefaultHomebrewItemForm());
	}, [initialCharacterId, open]);

	const { data: context, isLoading: isContextLoading } = useQuery({
		queryKey: ["warden-item-delivery-context-v2", campaignId],
		queryFn: () =>
			loadWardenGenerationContext({
				campaignId,
				types: ALL_COMPENDIUM_TYPES,
			}),
		enabled: open && !!campaignId,
		staleTime: 300_000,
	});

	const linkedItems = useMemo(
		() =>
			context?.allEntries.filter((entry) =>
				ALL_COMPENDIUM_TYPE_SET.has(entry.type),
			) || [],
		[context?.allEntries],
	);

	const catalogItems = useMemo<CatalogEntry[]>(() => {
		const canonical = linkedItems.map((entry) => ({
			key: `canonical:${entry.type}:${entry.id}`,
			item: linkedEntryToDeliverableItem(entry),
			sourceLabel: entry.type,
		}));
		const homebrew = publishedHomebrew
			.filter((record) => record.content_type === "item")
			.map((record) => {
				const runtimeItem = mapHomebrewItemForRuntime(record);
				return {
					key: `homebrew:${record.id}`,
					item: homebrewRuntimeItemToDeliverableItem(runtimeItem),
					sourceLabel: "homebrew",
				};
			});
		return [...canonical, ...homebrew];
	}, [linkedItems, publishedHomebrew]);

	const filteredItems = useMemo(() => {
		// Apply type-group filter first
		const group = TYPE_FILTER_GROUPS.find((g) => g.id === typeFilter);
		const typeSet = group?.types ?? null;
		const typeFiltered = typeSet
			? catalogItems.filter(({ item }) => typeSet.has(item.type ?? ""))
			: catalogItems;

		// Then apply text search
		const query = search.trim().toLowerCase();
		const candidates = query
			? typeFiltered.filter(({ item, sourceLabel }) =>
					[
						item.name,
						item.description ?? "",
						item.type ?? "",
						item.rarity ?? "",
						item.sourceBook ?? "",
						sourceLabel,
						...(item.tags ?? []),
						...(item.properties ?? []),
					]
						.join(" ")
						.toLowerCase()
						.includes(query),
				)
			: typeFiltered;
		return candidates.slice(0, 50);
	}, [catalogItems, search, typeFilter]);

	const selectedCatalogItem = catalogItems.find(
		(entry) => entry.key === selectedCatalogKey,
	);
	const selectedItem = createdItem ?? selectedCatalogItem?.item ?? initialItem;
	const eligibleMembers = members.filter((member) => member.character_id);
	const eligibleCharacterIds = new Set(
		eligibleMembers
			.map((member) => member.character_id)
			.filter((characterId): characterId is string => Boolean(characterId)),
	);
	const selectedSharedCharacterIds = selectedCharacterIds.filter(
		(characterId) => !eligibleCharacterIds.has(characterId),
	);
	const isSavingHomebrew =
		saveHomebrew.isPending || setHomebrewStatus.isPending;
	const isLoading = isContextLoading || isHomebrewLoading;

	// Derive whether selected item requires special (non-equipment) routing
	const selectedItemType = selectedItem?.type ?? "";
	const isAbilityType = ABILITY_TYPE_SET.has(selectedItemType);
	const isRuneType = RUNE_TYPE_SET.has(selectedItemType);
	const isNonPhysicalType = isAbilityType || isRuneType;

	const updateHomebrewForm = <K extends keyof HomebrewItemFormState>(
		key: K,
		value: HomebrewItemFormState[K],
	) => {
		setHomebrewForm((current) => ({ ...current, [key]: value }));
	};

	const toggleCharacter = (characterId: string) => {
		setSelectedCharacterIds((current) =>
			current.includes(characterId)
				? current.filter((id) => id !== characterId)
				: [...current, characterId],
		);
	};

	const handleUseHomebrewItem = async (saveToLibrary: boolean) => {
		if (!homebrewForm.name.trim()) {
			toast({
				title: "Name required",
				description: "Name the homebrew item before selecting it.",
				variant: "destructive",
			});
			return;
		}

		let nextItem = buildHomebrewDeliverableItem(homebrewForm);
		if (saveToLibrary) {
			const result = await saveHomebrew.mutateAsync({
				contentType: "item",
				name: homebrewForm.name,
				description: homebrewForm.description,
				tags: parseHomebrewTags(homebrewForm.tagsText),
				sourceBook: homebrewForm.sourceBook,
				visibilityScope: "campaign",
				campaignId,
				data: buildHomebrewItemData(homebrewForm),
			});

			if (result.record) {
				const statusResult = await setHomebrewStatus.mutateAsync({
					id: result.record.id,
					status: "published",
					visibilityScope: "campaign",
					campaignId,
				});
				const publishedRecord = statusResult.record ?? result.record;
				nextItem = homebrewRuntimeItemToDeliverableItem(
					mapHomebrewItemForRuntime(publishedRecord),
				);
			}
		}

		setCreatedItem(nextItem);
		setSelectedCatalogKey("");
		setActivePanel("catalog");
	};

	const handleOpenHomebrewCreator = () => {
		const target = `/homebrew?campaignId=${encodeURIComponent(campaignId)}`;
		window.open(target, "_blank", "noopener,noreferrer");
	};

	const handleDeliver = async () => {
		if (!selectedItem) return;

		// Ability / rune types: route to the correct character table
		if (isNonPhysicalType) {
			const charId = selectedCharacterIds[0];
			if (!charId) return;
			try {
				switch (selectedItemType) {
					case "spells":
						await addSpell.mutateAsync({
							character_id: charId,
							spell_id: selectedItem.id ?? undefined,
							name: selectedItem.name,
							description: selectedItem.description ?? "",
							spell_level: 0,
							source: selectedItem.sourceBook ?? "Compendium",
							is_prepared: false,
							is_known: true,
							counts_against_limit: true,
						});
						break;
					case "powers":
						await addPower({
							character_id: charId,
							power_id: selectedItem.id ?? undefined,
							name: selectedItem.name,
							description: selectedItem.description ?? "",
							power_level: 0,
							source: selectedItem.sourceBook ?? "Compendium",
							is_prepared: false,
							is_known: true,
						});
						break;
					case "techniques":
						if (selectedItem.id)
							await addTechnique.mutateAsync(selectedItem.id);
						break;
					case "feats":
					case "backgrounds":
						await addFeature({
							character_id: charId,
							name: selectedItem.name,
							description: selectedItem.description ?? "",
							source:
								selectedItemType === "backgrounds" ? "background" : "feat",
							level_acquired: 1,
						});
						break;
					case "runes":
						if (selectedItem.id) {
							await learnRune.mutateAsync({
								characterId: charId,
								runeId: selectedItem.id,
							});
						}
						break;
				}
				toast({
					title: "Delivered",
					description: `${selectedItem.name} was sent to the selected Ascendant.`,
				});
				onOpenChange(false);
			} catch (err: unknown) {
				toast({
					title: "Delivery failed",
					description: err instanceof Error ? err.message : "Unknown error",
					variant: "destructive",
				});
			}
			return;
		}

		// Physical item path (existing)
		await deliverItem({
			campaignId,
			mode,
			item: selectedItem,
			characterIds: selectedCharacterIds,
			memberId: selectedMemberId === "unassigned" ? null : selectedMemberId,
			quantity,
		});
		onOpenChange(false);
	};

	const disabled =
		!selectedItem || isDelivering || selectedCharacterIds.length === 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PackagePlus className="w-5 h-5 text-primary" />
						{title}
					</DialogTitle>
					<DialogDescription>
						Send spells, powers, feats, techniques, items, relics, or homebrew
						directly to an Ascendant's character sheet, assigned loot, or the
						Party Stash.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
					<div className="space-y-4 min-w-0">
						<div className="space-y-2">
							<Label>Delivery Mode</Label>
							<div className="grid grid-cols-3 gap-2">
								{(
									[
										["direct", "Direct Grant"],
										["loot", "Assigned Loot"],
										["stash", "Party Stash"],
									] as Array<[WardenDeliveryMode, string]>
								).map(([value, label]) => {
									// Loot and Stash modes only make sense for physical items
									if (isNonPhysicalType && value !== "direct") return null;
									return (
										<Button
											key={value}
											type="button"
											variant={mode === value ? "default" : "outline"}
											onClick={() => setMode(value)}
										>
											{label}
										</Button>
									);
								})}
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<Label>Item Source</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleOpenHomebrewCreator}
								>
									<ExternalLink className="w-4 h-4 mr-2" />
									Open Homebrew Creator
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button
									type="button"
									variant={activePanel === "catalog" ? "default" : "outline"}
									onClick={() => setActivePanel("catalog")}
								>
									<Search className="w-4 h-4 mr-2" />
									Catalog
								</Button>
								<Button
									type="button"
									variant={activePanel === "homebrew" ? "default" : "outline"}
									onClick={() => setActivePanel("homebrew")}
								>
									<PlusCircle className="w-4 h-4 mr-2" />
									Inline Homebrew
								</Button>
							</div>
						</div>

						{activePanel === "catalog" ? (
							<div className="space-y-2">
								{initialItem && !selectedCatalogItem && !createdItem && (
									<div className="p-3 rounded border border-primary/20 bg-primary/5">
										<p className="font-heading font-semibold">
											{formatRegentVernacular(initialItem.name)}
										</p>
										<p className="text-xs text-muted-foreground">
											Using generated item. Select a catalog item below to
											replace it.
										</p>
									</div>
								)}
								{createdItem && (
									<div className="p-3 rounded border border-gate-s/30 bg-gate-s/5">
										<p className="font-heading font-semibold">
											{formatRegentVernacular(createdItem.name)}
										</p>
										<p className="text-xs text-muted-foreground">
											Inline homebrew item selected for delivery.
										</p>
									</div>
								)}
								{/* Type filter pills */}
								<div className="flex flex-wrap gap-1">
									{TYPE_FILTER_GROUPS.map((group) => (
										<Button
											key={group.id}
											type="button"
											size="sm"
											variant={typeFilter === group.id ? "default" : "outline"}
											className="h-7 text-xs px-2"
											onClick={() => setTypeFilter(group.id)}
										>
											{group.label}
										</Button>
									))}
								</div>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										value={search}
										onChange={(event) => setSearch(event.target.value)}
										placeholder="Search spells, powers, feats, items, relics, runes, homebrew..."
										className="pl-9"
									/>
								</div>
								<div className="max-h-72 overflow-y-auto space-y-2 rounded border border-border/60 p-2">
									{isLoading ? (
										<div className="flex items-center justify-center py-8 text-muted-foreground">
											<Loader2 className="w-5 h-5 animate-spin" />
										</div>
									) : filteredItems.length === 0 ? (
										<p className="text-sm text-muted-foreground text-center py-8">
											No canonical or published campaign homebrew items found.
										</p>
									) : (
										filteredItems.map((entry) => (
											<ItemResultButton
												key={entry.key}
												entry={entry}
												selected={selectedCatalogKey === entry.key}
												onClick={() => {
													setSelectedCatalogKey(entry.key);
													setCreatedItem(null);
												}}
											/>
										))
									)}
								</div>
							</div>
						) : (
							<WardenInlineHomebrewItemForm
								form={homebrewForm}
								onChange={updateHomebrewForm}
								onUse={() => handleUseHomebrewItem(false)}
								onSaveAndUse={() => handleUseHomebrewItem(true)}
								isSaving={isSavingHomebrew}
							/>
						)}
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="delivery-quantity">Quantity</Label>
							<Input
								id="delivery-quantity"
								type="number"
								min={1}
								value={quantity}
								onChange={(event) =>
									setQuantity(
										Math.max(1, Number.parseInt(event.target.value, 10) || 1),
									)
								}
							/>
						</div>

						{/* Character selection — single dropdown for ability/rune types, checkboxes for items */}
						{(mode === "direct" || isNonPhysicalType) && (
							<div className="space-y-2">
								<Label>Ascendant{isNonPhysicalType ? "" : "s"}</Label>
								{isNonPhysicalType ? (
									// Single-select for spells/powers/feats/techniques/runes
									<Select
										value={selectedCharacterIds[0] ?? ""}
										onValueChange={(v) => setSelectedCharacterIds(v ? [v] : [])}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select an Ascendant" />
										</SelectTrigger>
										<SelectContent>
											{eligibleMembers.map((member) => (
												<SelectItem
													key={member.id}
													value={member.character_id ?? ""}
												>
													{member.characters?.name || "Unnamed Ascendant"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								) : (
									<div className="max-h-56 overflow-y-auto rounded border border-border/60 p-2 space-y-2">
										{eligibleMembers.length === 0 &&
										selectedSharedCharacterIds.length === 0 ? (
											<p className="text-xs text-muted-foreground text-center py-4">
												No linked Ascendants in this campaign.
											</p>
										) : (
											<>
												{eligibleMembers.map((member) => {
													const characterId = member.character_id || "";
													const checkboxId = `delivery-character-${characterId}`;
													return (
														<Label
															key={member.id}
															htmlFor={checkboxId}
															className="flex items-center gap-2 rounded p-2 hover:bg-muted/30"
														>
															<Checkbox
																id={checkboxId}
																checked={selectedCharacterIds.includes(
																	characterId,
																)}
																onCheckedChange={() =>
																	toggleCharacter(characterId)
																}
															/>
															<span className="text-sm">
																{member.characters?.name || "Unnamed Ascendant"}
															</span>
														</Label>
													);
												})}
												{selectedSharedCharacterIds.map((characterId) => {
													const checkboxId = `delivery-shared-character-${characterId}`;
													return (
														<Label
															key={characterId}
															htmlFor={checkboxId}
															className="flex items-center gap-2 rounded p-2 hover:bg-muted/30"
														>
															<Checkbox
																id={checkboxId}
																checked={selectedCharacterIds.includes(
																	characterId,
																)}
																onCheckedChange={() =>
																	toggleCharacter(characterId)
																}
															/>
															<span className="text-sm">
																Selected shared Ascendant
															</span>
														</Label>
													);
												})}
											</>
										)}
									</div>
								)}
							</div>
						)}

						{mode === "loot" && (
							<div className="space-y-2">
								<Label>Assign To</Label>
								<Select
									value={selectedMemberId}
									onValueChange={setSelectedMemberId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Campaign ledger / unassigned" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="unassigned">
											Campaign ledger / unassigned
										</SelectItem>
										{eligibleMembers.map((member) => (
											<SelectItem key={member.id} value={member.id}>
												{member.characters?.name || "Unnamed Ascendant"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{selectedItem && (
							<div className="rounded border border-primary/20 bg-primary/5 p-3 space-y-2">
								<p className="font-heading font-semibold">
									{formatRegentVernacular(selectedItem.name)}
								</p>
								<div className="flex flex-wrap gap-1">
									{selectedItem.type && (
										<Badge variant="outline">{selectedItem.type}</Badge>
									)}
									{selectedItem.rarity && (
										<Badge variant="secondary">
											{formatRarityLabel(selectedItem.rarity)}
										</Badge>
									)}
								</div>
								{selectedItem.description && (
									<p className="text-xs text-muted-foreground line-clamp-4">
										{formatRegentVernacular(selectedItem.description)}
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="button" onClick={handleDeliver} disabled={disabled}>
						{isDelivering ? "Delivering..." : "Deliver"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ItemResultButton({
	entry,
	selected,
	onClick,
}: {
	entry: CatalogEntry;
	selected: boolean;
	onClick: () => void;
}) {
	const { item, sourceLabel } = entry;
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full text-left p-2 rounded border transition-colors ${
				selected
					? "border-primary bg-primary/10"
					: "border-border/60 hover:border-primary/40 hover:bg-muted/30"
			}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 space-y-1">
					<p className="text-sm font-heading font-semibold truncate">
						{formatRegentVernacular(item.name)}
					</p>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
						{item.damage && (
							<span>
								Damage: {item.damage} {item.damageType || ""}
							</span>
						)}
						{item.armorClass && <span>AC: {item.armorClass}</span>}
						{item.chargesMax != null && <span>Charges: {item.chargesMax}</span>}
						{item.weight != null && <span>{item.weight} lb.</span>}
					</div>
					<p className="text-[11px] text-muted-foreground line-clamp-1">
						{item.description
							? formatRegentVernacular(item.description)
							: item.sourceBook || sourceLabel}
					</p>
				</div>
				<div className="flex flex-col items-end gap-1 shrink-0">
					<Badge variant="outline" className="text-[11px]">
						{item.type || sourceLabel}
					</Badge>
					{item.sourceKind === "homebrew" && (
						<Badge variant="secondary" className="text-[11px]">
							Homebrew
						</Badge>
					)}
					{item.rarity && (
						<span className="text-[11px] text-muted-foreground">
							{formatRarityLabel(item.rarity)}
						</span>
					)}
				</div>
			</div>
		</button>
	);
}
