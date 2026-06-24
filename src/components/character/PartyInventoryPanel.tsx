import { HandCoins, Minus, Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCampaignToolState } from "@/hooks/useToolState";

export interface PartyInventoryItem {
	id: string;
	name: string;
	quantity: number;
	notes?: string;
	addedByName?: string;
}

interface PartyInventoryState {
	items: PartyInventoryItem[];
}

interface PartyInventoryPanelProps {
	campaignId: string | null;
	characterName?: string;
	readOnly?: boolean;
	/** Move a party item into this character's personal inventory. */
	onClaim?: (item: PartyInventoryItem) => Promise<void> | void;
}

/**
 * D&D Beyond-style shared "Party Inventory" — a campaign-scoped loot pool that every
 * party member sees, persisted via the campaign tool-state pattern. Sits beside the
 * personal ("My Inventory") view on the character sheet's Inventory section.
 */
export function PartyInventoryPanel({
	campaignId,
	characterName,
	readOnly,
	onClaim,
}: PartyInventoryPanelProps) {
	const { state, setState, isLoading } =
		useCampaignToolState<PartyInventoryState>(campaignId, "party-inventory", {
			initialState: { items: [] },
		});
	const [name, setName] = useState("");
	const [qty, setQty] = useState("1");
	const [notes, setNotes] = useState("");

	if (!campaignId) {
		return (
			<AscendantWindow title="PARTY INVENTORY">
				<p className="text-sm text-muted-foreground p-2">
					Join a campaign to share a party inventory with your group.
				</p>
			</AscendantWindow>
		);
	}

	const items = state?.items ?? [];

	const addItem = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setState((prev) => ({
			items: [
				...(prev?.items ?? []),
				{
					id: crypto.randomUUID(),
					name: trimmed,
					quantity: Math.max(1, Number(qty) || 1),
					notes: notes.trim() || undefined,
					addedByName: characterName,
				},
			],
		}));
		setName("");
		setQty("1");
		setNotes("");
	};

	const removeItem = (id: string) =>
		setState((prev) => ({
			items: (prev?.items ?? []).filter((i) => i.id !== id),
		}));

	const adjustQty = (id: string, delta: number) =>
		setState((prev) => ({
			items: (prev?.items ?? []).map((i) =>
				i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
			),
		}));

	const claim = async (item: PartyInventoryItem) => {
		if (!onClaim) return;
		// Only remove from the shared pool once it lands in personal inventory.
		await onClaim(item);
		removeItem(item.id);
	};

	return (
		<AscendantWindow title="PARTY INVENTORY">
			<div className="space-y-3 p-1">
				{!readOnly && (
					<div className="flex flex-wrap items-center gap-2">
						<Input
							placeholder="Item name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="flex-1 min-w-[140px]"
							onKeyDown={(e) => e.key === "Enter" && addItem()}
						/>
						<Input
							type="number"
							min={1}
							value={qty}
							onChange={(e) => setQty(e.target.value)}
							className="w-16"
							aria-label="Quantity"
						/>
						<Input
							placeholder="Notes (optional)"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="flex-1 min-w-[140px]"
						/>
						<Button onClick={addItem} size="sm" className="gap-1">
							<Plus className="w-4 h-4" /> Add
						</Button>
					</div>
				)}

				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading party loot…</p>
				) : items.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No shared loot yet. Add party treasure above.
					</p>
				) : (
					<div className="space-y-2">
						{items.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-2 p-2 rounded-md border border-border bg-muted/30"
							>
								<Package className="w-4 h-4 text-primary/60 shrink-0" />
								<div className="flex-1 min-w-0">
									<div className="font-heading font-semibold text-sm">
										{item.name}
										<span className="text-muted-foreground">
											{" "}
											×{item.quantity}
										</span>
									</div>
									{item.notes && (
										<div className="text-xs text-muted-foreground">
											{item.notes}
										</div>
									)}
									{item.addedByName && (
										<div className="text-[10px] text-muted-foreground/70">
											added by {item.addedByName}
										</div>
									)}
								</div>
								{!readOnly && (
									<div className="flex items-center gap-1 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => adjustQty(item.id, -1)}
											aria-label={`Decrease ${item.name}`}
										>
											<Minus className="w-3.5 h-3.5" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => adjustQty(item.id, 1)}
											aria-label={`Increase ${item.name}`}
										>
											<Plus className="w-3.5 h-3.5" />
										</Button>
										{onClaim && (
											<Button
												size="sm"
												variant="outline"
												className="gap-1"
												onClick={() => claim(item)}
											>
												<HandCoins className="w-3.5 h-3.5" /> Claim
											</Button>
										)}
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7"
											onClick={() => removeItem(item.id)}
											aria-label={`Remove ${item.name}`}
										>
											<Trash2 className="w-3.5 h-3.5 text-destructive" />
										</Button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</AscendantWindow>
	);
}
