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
import { staticDataProvider } from "@/data/compendium/staticDataProvider";
import { useToast } from "@/hooks/use-toast";
import { useEquipment } from "@/hooks/useEquipment";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { supabase } from "@/integrations/supabase/client";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
} from "@/lib/sourcebookAccess";
import {
	formatMonarchVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";
import { AddCustomItemDialog } from "./AddCustomItemDialog";

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
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const ddbEnhancements = usePlayerToolsEnhancements();

	const { data: equipment = [], isLoading } = useQuery({
		queryKey: ["compendium-equipment", characterId, searchQuery],
		queryFn: async () => {
			// Try Supabase first
			let query = supabase.from("compendium_equipment").select("*").limit(20);

			const trimmedQuery = searchQuery.trim();
			if (trimmedQuery) {
				const canonicalQuery = normalizeRegentSearch(trimmedQuery);
				query = query.ilike("name", `%${canonicalQuery}%`);
			}

			const { data, error } = await query;

			// If Supabase has results, filter by sourcebook access
			if (!error && data && data.length > 0) {
				const campaignId = await getCharacterCampaignId(characterId);
				return filterRowsBySourcebookAccess(data, (item) => item.source_book, {
					campaignId,
				});
			}

			// Fall back to static compendium data
			const staticItems = await staticDataProvider.getItems(
				trimmedQuery || undefined,
			);
			return staticItems.slice(0, 20).map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				equipment_type: item.equipment_type || item.item_type || "gear",
				properties: (() => {
					if (Array.isArray(item.properties)) return item.properties;
					const props: string[] = [];

					const passiveEffects = (item.effects as Record<string, any>)?.passive;
					if (Array.isArray(passiveEffects)) {
						for (const line of passiveEffects) {
							if (typeof line === "string" && line.trim().length > 0) {
								props.push(line.trim());
							}
						}
					}

					const weapon = (item.properties as Record<string, any>)?.weapon;
					if (weapon) {
						if (
							typeof weapon.damage === "string" &&
							typeof weapon.damageType === "string"
						) {
							props.push(`${weapon.damage} ${weapon.damageType}`);
						}
						if (weapon.finesse === true) props.push("finesse");
					}

					const armor = (item.properties as Record<string, any>)?.armor;
					if (armor) {
						if (typeof armor.baseAC === "number")
							props.push(`AC ${armor.baseAC}`);
						if (typeof armor.type === "string") props.push(armor.type);
					}

					const magical = (item.properties as Record<string, any>)?.magical;
					if (
						magical?.bonus?.armorClass &&
						typeof magical.bonus.armorClass === "number"
					) {
						props.push(
							`${magical.bonus.armorClass >= 0 ? "+" : ""}${magical.bonus.armorClass} AC`,
						);
					}
					if (
						magical?.bonus?.attack &&
						typeof magical.bonus.attack === "number" &&
						magical.bonus.attack !== 0
					) {
						props.push(
							`${magical.bonus.attack >= 0 ? "+" : ""}${magical.bonus.attack} to attack`,
						);
					}
					if (
						magical?.bonus?.damage &&
						typeof magical.bonus.damage === "number" &&
						magical.bonus.damage !== 0
					) {
						props.push(
							`${magical.bonus.damage >= 0 ? "+" : ""}${magical.bonus.damage} to damage`,
						);
					}

					return props;
				})(),
				weight: item.weight ?? null,
				source_book: item.source_book ?? null,
				rarity: item.rarity ?? null,
				damage:
					typeof (item.properties as Record<string, any>)?.weapon?.damage ===
					"string"
						? (item.properties as Record<string, any>).weapon.damage
						: null,
				damage_type:
					typeof (item.properties as Record<string, any>)?.weapon
						?.damageType === "string"
						? (item.properties as Record<string, any>).weapon.damageType
						: null,
				armor_class:
					typeof (item.properties as Record<string, any>)?.armor?.baseAC ===
					"number"
						? (item.properties as Record<string, any>).armor.baseAC
						: null,
				attunement: item.attunement ?? false,
			}));
		},
		enabled: open,
	});

	const handleAdd = async (item: (typeof equipment)[0]) => {
		const displayName = formatMonarchVernacular(item.name);
		try {
			await addEquipment({
				character_id: characterId,
				name: item.name,
				item_type: item.equipment_type || "gear",
				description: item.description || null,
				properties: item.properties || [],
				weight: item.weight || null,
				quantity: 1,
				is_container:
					/backpack|pouch|sack|bag|chest|barrel|basket|bucket|case|flask|jug|pitcher|pot|vial|waterskin/i.test(
						item.name || "",
					),
			});

			toast({
				title: "Equipment added",
				description: `${displayName} has been added to your inventory.`,
			});

			ddbEnhancements
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
									(item as Record<string, any>).rarity === "legendary"
										? "text-amber-500"
										: (item as Record<string, any>).rarity === "epic"
											? "text-purple-500"
											: (item as Record<string, any>).rarity === "rare"
												? "text-blue-500"
												: (item as Record<string, any>).rarity === "uncommon"
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
														{formatMonarchVernacular(item.name)}
													</span>
													<Badge variant="secondary" className="text-xs">
														{formatMonarchVernacular(
															item.equipment_type || "Equipment",
														)}
													</Badge>
													{(item as Record<string, any>).rarity && (
														<span
															className={`text-[10px] font-medium capitalize ${rarityColor}`}
														>
															{(item as Record<string, any>).rarity}
														</span>
													)}
													{(item as Record<string, any>).attunement && (
														<Badge
															variant="outline"
															className="text-[10px] px-1"
														>
															Attunement
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1">
													{(item as Record<string, any>).damage && (
														<span>
															Damage: {(item as Record<string, any>).damage}{" "}
															{(item as Record<string, any>).damage_type || ""}
														</span>
													)}
													{(item as Record<string, any>).armor_class && (
														<span>
															AC: {(item as Record<string, any>).armor_class}
														</span>
													)}
													{item.weight != null && item.weight > 0 && (
														<span>{item.weight} lb.</span>
													)}
												</div>
												{item.description && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{formatMonarchVernacular(item.description)}
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
