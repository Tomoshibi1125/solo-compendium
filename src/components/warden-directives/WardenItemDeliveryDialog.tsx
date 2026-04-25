import { useQuery } from "@tanstack/react-query";
import { Loader2, PackagePlus, Search } from "lucide-react";
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
import { useCampaignMembers } from "@/hooks/useCampaigns";
import {
	linkedEntryToDeliverableItem,
	useWardenItemDelivery,
	type WardenDeliverableItem,
	type WardenDeliveryMode,
} from "@/hooks/useWardenItemDelivery";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

interface WardenItemDeliveryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId: string;
	initialItem?: WardenDeliverableItem | null;
	initialCharacterId?: string | null;
	title?: string;
}

const ITEM_CONTEXT_TYPES = [
	"equipment",
	"items",
	"relics",
	"runes",
	"sigils",
	"artifacts",
	"tattoos",
] as const;

const ITEM_CONTEXT_TYPE_SET = new Set<string>(ITEM_CONTEXT_TYPES);

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
	const [selectedEntryId, setSelectedEntryId] = useState<string>("");
	const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
		initialCharacterId ? [initialCharacterId] : [],
	);
	const [selectedMemberId, setSelectedMemberId] =
		useState<string>("unassigned");
	const [quantity, setQuantity] = useState(1);
	const { data: members = [] } = useCampaignMembers(campaignId);
	const { deliverItem, isDelivering } = useWardenItemDelivery();

	useEffect(() => {
		if (!open) return;
		setSelectedCharacterIds(initialCharacterId ? [initialCharacterId] : []);
		setSelectedMemberId("unassigned");
		setSelectedEntryId("");
		setQuantity(1);
	}, [initialCharacterId, open]);

	const { data: context, isLoading } = useQuery({
		queryKey: ["warden-item-delivery-context", campaignId],
		queryFn: () =>
			loadWardenGenerationContext({
				campaignId,
				types: ITEM_CONTEXT_TYPES,
			}),
		enabled: open && !!campaignId,
		staleTime: 300_000,
	});

	const linkedItems = useMemo(
		() =>
			context?.allEntries.filter((entry) =>
				ITEM_CONTEXT_TYPE_SET.has(entry.type),
			) || [],
		[context?.allEntries],
	);

	const filteredItems = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return linkedItems.slice(0, 30);
		return linkedItems
			.filter((item) =>
				[
					item.name,
					item.description ?? "",
					item.type,
					item.rarity ?? "",
					...item.tags,
				]
					.join(" ")
					.toLowerCase()
					.includes(query),
			)
			.slice(0, 30);
	}, [linkedItems, search]);

	const selectedEntry = linkedItems.find((item) => item.id === selectedEntryId);
	const selectedItem = selectedEntry
		? linkedEntryToDeliverableItem(selectedEntry)
		: initialItem;
	const eligibleMembers = members.filter((member) => member.character_id);

	const toggleCharacter = (characterId: string) => {
		setSelectedCharacterIds((current) =>
			current.includes(characterId)
				? current.filter((id) => id !== characterId)
				: [...current, characterId],
		);
	};

	const handleDeliver = async () => {
		if (!selectedItem) return;
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
		!selectedItem ||
		isDelivering ||
		(mode === "direct" && selectedCharacterIds.length === 0);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PackagePlus className="w-5 h-5 text-primary" />
						{title}
					</DialogTitle>
					<DialogDescription>
						Send canonical rewards directly, assign them as loot, or place them
						in the Party Stash.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Delivery Mode</Label>
							<div className="grid grid-cols-3 gap-2">
								{(
									[
										["direct", "Direct Grant"],
										["loot", "Assigned Loot"],
										["stash", "Party Stash"],
									] as Array<[WardenDeliveryMode, string]>
								).map(([value, label]) => (
									<Button
										key={value}
										type="button"
										variant={mode === value ? "default" : "outline"}
										onClick={() => setMode(value)}
									>
										{label}
									</Button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Item</Label>
							{initialItem && !selectedEntry && (
								<div className="p-3 rounded border border-primary/20 bg-primary/5">
									<p className="font-heading font-semibold">
										{formatRegentVernacular(initialItem.name)}
									</p>
									<p className="text-xs text-muted-foreground">
										Using generated item. Select a canonical item below to
										replace it.
									</p>
								</div>
							)}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Search equipment, relics, runes, sigils..."
									className="pl-9"
								/>
							</div>
							<div className="max-h-64 overflow-y-auto space-y-2 rounded border border-border/60 p-2">
								{isLoading ? (
									<div className="flex items-center justify-center py-8 text-muted-foreground">
										<Loader2 className="w-5 h-5 animate-spin" />
									</div>
								) : filteredItems.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-8">
										No canonical items found.
									</p>
								) : (
									filteredItems.map((item) => (
										<ItemResultButton
											key={`${item.type}:${item.id}`}
											item={item}
											selected={selectedEntryId === item.id}
											onClick={() => setSelectedEntryId(item.id)}
										/>
									))
								)}
							</div>
						</div>
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

						{mode === "direct" && (
							<div className="space-y-2">
								<Label>Ascendants</Label>
								<div className="max-h-56 overflow-y-auto rounded border border-border/60 p-2 space-y-2">
									{eligibleMembers.length === 0 ? (
										<p className="text-xs text-muted-foreground text-center py-4">
											No linked Ascendants in this campaign.
										</p>
									) : (
										eligibleMembers.map((member) => {
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
														checked={selectedCharacterIds.includes(characterId)}
														onCheckedChange={() => toggleCharacter(characterId)}
													/>
													<span className="text-sm">
														{member.characters?.name || "Unnamed Ascendant"}
													</span>
												</Label>
											);
										})
									)}
								</div>
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
										<Badge variant="secondary">{selectedItem.rarity}</Badge>
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
	item,
	selected,
	onClick,
}: {
	item: WardenLinkedEntry;
	selected: boolean;
	onClick: () => void;
}) {
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
				<div className="min-w-0">
					<p className="text-sm font-heading font-semibold truncate">
						{formatRegentVernacular(item.name)}
					</p>
					<p className="text-[10px] text-muted-foreground line-clamp-1">
						{item.description
							? formatRegentVernacular(item.description)
							: item.type}
					</p>
				</div>
				<div className="flex flex-col items-end gap-1 shrink-0">
					<Badge variant="outline" className="text-[10px]">
						{item.type}
					</Badge>
					{item.rarity && (
						<span className="text-[10px] text-muted-foreground">
							{item.rarity}
						</span>
					)}
				</div>
			</div>
		</button>
	);
}
