import { useQuery } from "@tanstack/react-query";
import {
	FlaskConical,
	Gem,
	Loader2,
	Search,
	Shield,
	Swords,
} from "lucide-react";
import { useState } from "react";
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
import { useEquipment } from "@/hooks/useEquipment";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { buildItemProperties } from "@/lib/characterCreation";
import { getDefaultSigilSlotsBaseForEquipment } from "@/lib/sigilAutomation";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import { formatRegentVernacular } from "@/lib/vernacular";
import { AddCustomItemDialog } from "./AddCustomItemDialog";

function mapCompendiumEquipmentTypeToInventoryType(
	equipmentType: string | null | undefined,
): "weapon" | "armor" | "tool" | "gear" {
	const t = (equipmentType || "").toLowerCase();

	if (t.includes("melee") || t.includes("ranged") || t.includes("weapon")) {
		return "weapon";
	}

	if (t.includes("armor") || t === "shield") {
		return "armor";
	}

	if (t === "tools" || t === "tool") {
		return "tool";
	}

	return "gear";
}

function isEquipableCompendiumItemType(
	itemType: string | null | undefined,
): boolean {
	const t = (itemType || "").toLowerCase();
	return (
		t === "weapon" ||
		t === "armor" ||
		t === "shield" ||
		t === "gear" ||
		t === "tools" ||
		t === "tool"
	);
}

export function AddEquipmentDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [customItemOpen, setCustomItemOpen] = useState(false);
	const { addEquipment } = useEquipment(characterId);
	const { toast } = useToast();
	const ascendantTools = useAscendantTools();

	const { data: equipment = [], isLoading } = useQuery({
		queryKey: ["compendium-equipment", characterId, searchQuery],
		queryFn: async () => {
			const trimmedQuery = searchQuery.trim();
			const campaignId = await getCharacterCampaignId(characterId);
			const staticItems = await listCanonicalEntries(
				"equipment",
				trimmedQuery || undefined,
				{ campaignId },
			);
			return staticItems
				.filter((item) =>
					isEquipableCompendiumItemType(item.equipment_type || item.item_type),
				)
				.slice(0, 20)
				.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					equipment_type:
						item.equipment_type || item.item_type || ("gear" as const),
					properties: buildItemProperties(
						item as unknown as Parameters<typeof buildItemProperties>[0],
					),
					weight: item.weight ?? null,
					source_book: item.source_book ?? null,
					rarity: item.rarity ?? null,
					damage:
						typeof item.damage === "string" || typeof item.damage === "number"
							? String(item.damage)
							: ((item.properties as { weapon?: { damage?: string } })?.weapon
									?.damage ?? null),
					damage_type:
						item.damage_type ??
						(item.properties as { weapon?: { damageType?: string } })?.weapon
							?.damageType ??
						(item.properties as { weapon?: { damage_type?: string } })?.weapon
							?.damage_type ??
						null,
					armor_class:
						item.armor_class ??
						(item.properties as { armor?: { baseAC?: number } })?.armor
							?.baseAC ??
						null,
					requires_attunement: item.attunement ?? false,
					charges:
						typeof item.charges === "number" ? item.charges : null,
				}));
		},
		enabled: open,
	});

	const handleAdd = async (item: (typeof equipment)[0]) => {
		const displayName = formatRegentVernacular(item.name);
		const inventoryType = mapCompendiumEquipmentTypeToInventoryType(
			item.equipment_type,
		);
		try {
			await ascendantTools.trackCustomFeatureUsage(
				characterId,
				"Equipment",
				`Added ${item.name}`,
				"SA",
			);
			await addEquipment({
				character_id: characterId,
				name: item.name,
				item_type: inventoryType,
				description: item.description || null,
				properties: item.properties || [],
				weight: item.weight || null,
				quantity: 1,
				sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
					item_type: inventoryType,
					properties: item.properties || [],
					name: item.name,
					rarity: item.rarity ?? null,
				}),
				is_container:
					/backpack|pouch|sack|bag|chest|barrel|basket|bucket|case|flask|jug|pitcher|pot|vial|waterskin/i.test(
						item.name || "",
					),
				charges_current: item.charges ?? null,
				charges_max: item.charges ?? null,
			});

			toast({
				title: "Equipment added",
				description: `${displayName} has been added to your inventory.`,
			});

			ascendantTools
				.trackInventoryChange(characterId, item.name, "add")
				.catch(console.error);

			onOpenChange(false);
			setSearchQuery("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to add equipment.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Equipment</DialogTitle>
					<DialogDescription>
						Search and add equipment from the compendium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="flex items-center gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search equipment..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button variant="outline" onClick={() => setCustomItemOpen(true)}>
							Create Custom Item
						</Button>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : equipment.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No equipment found"
									: "Search for equipment to add"}
							</div>
						) : (
							equipment.map((item) => {
								const itemRarity = item.rarity;
								const itemAttunement = item.requires_attunement;
								const itemDamage = item.damage;
								const itemDamageType = item.damage_type;
								const itemArmorClass = item.armor_class;
								const eqType = (item.equipment_type || "gear").toLowerCase();
								const TypeIcon =
									eqType === "weapon"
										? Swords
										: eqType === "armor"
											? Shield
											: eqType === "consumable"
												? FlaskConical
												: Gem;
								const rarityColor =
									itemRarity === "legendary"
										? "text-amber-500"
										: itemRarity === "epic"
											? "text-purple-500"
											: itemRarity === "rare"
												? "text-blue-500"
												: itemRarity === "uncommon"
													? "text-green-500"
													: "text-muted-foreground";

								return (
									<div
										key={item.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<TypeIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(item.name)}
													</span>
													<Badge variant="secondary" className="text-xs">
														{formatRegentVernacular(
															item.equipment_type || "Equipment",
														)}
													</Badge>
													{itemRarity && (
														<span
															className={`text-[10px] font-medium capitalize ${rarityColor}`}
														>
															{itemRarity}
														</span>
													)}
													{itemAttunement && (
														<Badge
															variant="outline"
															className="text-[10px] px-1"
														>
															Attunement
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
													{itemDamage && (
														<span>
															Damage: {itemDamage} {itemDamageType || ""}
														</span>
													)}
													{itemArmorClass && <span>AC: {itemArmorClass}</span>}
													{item.weight != null && item.weight > 0 && (
														<span>{item.weight} lb.</span>
													)}
												</div>
												{item.description && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{formatRegentVernacular(item.description)}
													</p>
												)}
											</div>
											<Button size="sm" onClick={() => handleAdd(item)}>
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
			<AddCustomItemDialog
				open={customItemOpen}
				onOpenChange={setCustomItemOpen}
				characterId={characterId}
			/>
		</Dialog>
	);
}
