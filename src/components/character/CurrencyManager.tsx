import { ArrowUpNarrowWide, Coins, Edit2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEquipment } from "@/hooks/useEquipment";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	buildRaCurrencyItemDescription,
	normalizeWallet,
	RA_CURRENCY_TYPES,
	type RaCurrencyId,
	type RaWallet,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencyManager({ characterId }: { characterId: string }) {
	const { equipment, updateEquipment, addEquipment } =
		useEquipment(characterId);
	const { toast } = useToast();
	const ascendantTools = useAscendantTools();
	const [editing, setEditing] = useState<string | null>(null);
	const [editValue, setEditValue] = useState("");

	// Get currency items
	const currencyItems = equipment.filter((e) => e.item_type === "currency");

	// Get or create currency for each type
	const getCurrency = (type: RaCurrencyId) => {
		const currencyType = RA_CURRENCY_TYPES.find(
			(currency) => currency.id === type,
		);
		if (!currencyType) return null;
		const aliases = [
			currencyType.id,
			currencyType.name.toLowerCase(),
			currencyType.singularName.toLowerCase(),
			currencyType.legacyId,
		];
		return (
			currencyItems.find((c) =>
				aliases.some((alias) => c.name.toLowerCase().includes(alias)),
			) || null
		);
	};

	const handleAddCurrency = async (type: RaCurrencyId, amount: number) => {
		const existing = getCurrency(type);
		const currencyType = RA_CURRENCY_TYPES.find((t) => t.id === type);
		if (!currencyType) return;

		try {
			if (existing) {
				const currentQuantity = existing.quantity || 0;
				await updateEquipment({
					id: existing.id,
					updates: { quantity: currentQuantity + amount },
				});
				toast({
					title: "Currency updated",
					description: `Added ${amount} ${currencyType.symbol}`,
				});
			} else {
				await addEquipment({
					character_id: characterId,
					name: currencyType.name,
					item_type: "currency",
					quantity: amount,
					weight: 0.02, // 50 credit notes per pound
					description: buildRaCurrencyItemDescription(currencyType.id),
				});
				toast({
					title: "Currency added",
					description: `Added ${amount} ${currencyType.symbol}`,
				});
			}

			ascendantTools
				.trackInventoryChange(
					characterId,
					currencyType.name,
					amount > 0 ? "add" : "remove",
				)
				.catch(console.error);
		} catch {
			toast({
				title: "Error",
				description: "Failed to update currency.",
				variant: "destructive",
			});
		}
	};

	// P1.10: Consolidate Credits — cascade overflow upward (10 Mana → 1
	// Crystal, 10 Crystal → 1 Gate, 10 Gate → 1 Core) preserving total
	// value. RA exceeds DDB here (DDB has long-requested this).
	const handleConsolidate = async () => {
		const wallet: RaWallet = {
			core: getCurrency("core")?.quantity || 0,
			gate: getCurrency("gate")?.quantity || 0,
			crystal: getCurrency("crystal")?.quantity || 0,
			mana: getCurrency("mana")?.quantity || 0,
		};
		const normalized = normalizeWallet(wallet);

		// Nothing to do if already consolidated.
		const unchanged = (["core", "gate", "crystal", "mana"] as const).every(
			(k) => normalized[k] === wallet[k],
		);
		if (unchanged) {
			toast({
				title: "Already consolidated",
				description: "Your Credits are already in their highest denominations.",
			});
			return;
		}

		try {
			for (const type of RA_CURRENCY_TYPES) {
				const target = normalized[type.id];
				const existing = getCurrency(type.id);
				if (existing) {
					if ((existing.quantity || 0) !== target) {
						await updateEquipment({
							id: existing.id,
							updates: { quantity: target },
						});
					}
				} else if (target > 0) {
					await addEquipment({
						character_id: characterId,
						name: type.name,
						item_type: "currency",
						quantity: target,
						weight: 0.02,
						description: buildRaCurrencyItemDescription(type.id),
					});
				}
			}
			toast({
				title: "Credits consolidated",
				description: "Overflow cascaded into higher denominations.",
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to consolidate Credits.",
				variant: "destructive",
			});
		}
	};

	const handleSetCurrency = async (type: RaCurrencyId, amount: number) => {
		const existing = getCurrency(type);
		const currencyType = RA_CURRENCY_TYPES.find((t) => t.id === type);
		if (!currencyType) return;

		try {
			if (existing) {
				await updateEquipment({
					id: existing.id,
					updates: { quantity: amount },
				});
			} else {
				await addEquipment({
					character_id: characterId,
					name: currencyType.name,
					item_type: "currency",
					quantity: amount,
					weight: 0.02,
					description: buildRaCurrencyItemDescription(currencyType.id),
				});
			}

			ascendantTools
				.trackInventoryChange(
					characterId,
					currencyType.name,
					existing && (existing.quantity || 0) > amount ? "remove" : "add",
				)
				.catch(console.error);

			setEditing(null);
			toast({
				title: "Currency updated",
				description: `Set to ${amount} ${currencyType.symbol}`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to update currency.",
				variant: "destructive",
			});
		}
	};

	return (
		<AscendantWindow title="RIFT REWARDS">
			<div className="space-y-3">
				<div className="flex items-start justify-between gap-2 mb-4">
					<p className="text-xs text-muted-foreground">
						Track Bureau-issued Credits earned from contracts, salvage exchange,
						and campaign rewards.
					</p>
					<Button
						size="sm"
						variant="outline"
						className="shrink-0 gap-1.5"
						onClick={handleConsolidate}
						title="Cascade overflow into higher denominations (10 Mana → 1 Crystal, etc.)"
					>
						<ArrowUpNarrowWide className="w-3.5 h-3.5" />
						Consolidate
					</Button>
				</div>
				{RA_CURRENCY_TYPES.map((type) => {
					const currency = getCurrency(type.id);
					const quantity = currency?.quantity || 0;
					const isEditing = editing === type.id;

					return (
						<div
							key={type.id}
							className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<Coins className={cn("w-5 h-5", type.colorClass)} />
								<div>
									<div className="font-heading font-semibold">{type.name}</div>
									<div className="text-xs text-muted-foreground">
										{type.symbol} · {type.description}
									</div>
								</div>
							</div>

							{isEditing ? (
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={editValue}
										onChange={(e) => setEditValue(e.target.value)}
										className="w-20 h-8"
										min="0"
										autoFocus
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleSetCurrency(
													type.id,
													parseInt(editValue, 10) || 0,
												);
											} else if (e.key === "Escape") {
												setEditing(null);
											}
										}}
									/>
									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											handleSetCurrency(type.id, parseInt(editValue, 10) || 0)
										}
									>
										Save
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => setEditing(null)}
									>
										Cancel
									</Button>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<div className="text-right">
										<div className="font-display text-lg font-bold">
											{quantity}
										</div>
										<div className="text-xs text-muted-foreground">
											{(quantity * 0.02).toFixed(1)} lbs
										</div>
									</div>
									<div className="flex items-center gap-1">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => handleAddCurrency(type.id, -1)}
											disabled={quantity === 0}
										>
											<Minus className="w-3 h-3" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => handleAddCurrency(type.id, 1)}
										>
											<Plus className="w-3 h-3" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => {
												setEditing(type.id);
												setEditValue(quantity.toString());
											}}
										>
											<Edit2 className="w-3 h-3" />
										</Button>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</AscendantWindow>
	);
}
