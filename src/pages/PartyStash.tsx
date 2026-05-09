import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Coins, Package, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCampaignGold } from "@/hooks/useCampaignGold";
import { useCampaignInventory } from "@/hooks/useCampaignInventory";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { RA_CURRENCY_TYPES } from "@/lib/currency";

export default function PartyStash() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const campaignId = queryParams.get("campaignId");
	const { user } = useAuth();

	// Fetch the current user's character in this campaign to attribute the action to them
	const { data: myCharacter } = useQuery({
		queryKey: ["my_campaign_character", campaignId, user?.id],
		queryFn: async () => {
			if (!campaignId || !user?.id) return null;
			const { data: member } = await supabase
				.from("campaign_members")
				.select("id, character_id")
				.eq("campaign_id", campaignId)
				.eq("user_id", user.id)
				.maybeSingle();
			if (!member?.id) return null;
			const { data: linkedCharacters } = await supabase
				.from("campaign_member_characters")
				.select("character_id")
				.eq("campaign_member_id", member.id)
				.order("created_at", { ascending: true })
				.limit(1);
			return linkedCharacters?.[0]?.character_id || member.character_id || null;
		},
		enabled: !!campaignId && !!user?.id,
	});

	const { inventory, isLoading, addItem, removeItem, updateItem } =
		useCampaignInventory(campaignId, myCharacter || undefined);
	const {
		partyCredits,
		isLoading: isGoldLoading,
		updateCredits,
	} = useCampaignGold(campaignId);

	const [newItemName, setNewItemName] = useState("");
	const [newItemQuantity, setNewItemQuantity] = useState(1);

	// State for local Credit edits before saving
	const [creditEdits, setCreditEdits] = useState(partyCredits);
	const [isEditingCredits, setIsEditingCredits] = useState(false);

	// Sync local edits when remote data changes (if not currently editing)
	React.useEffect(() => {
		if (!isEditingCredits) {
			setCreditEdits(partyCredits);
		}
	}, [partyCredits, isEditingCredits]);

	if (!campaignId) {
		return (
			<Layout>
				<div className="container p-8 text-center max-w-2xl mx-auto">
					<AscendantWindow title="PARTY STASH">
						<RiftHeading level={2} variant="gate" dimensional className="mb-4">
							No Domain Selected
						</RiftHeading>
						<ManaFlowText variant="rift" speed="slow" className="mb-4">
							Select a domain from your Warden interface or Ascendant dashboard
							to access the shared dimensional stash.
						</ManaFlowText>
						<Button onClick={() => navigate("/campaigns")}>
							Find Campaign
						</Button>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	const handleAdd = async () => {
		if (!newItemName.trim()) return;
		await addItem({ name: newItemName, quantity: newItemQuantity });
		setNewItemName("");
		setNewItemQuantity(1);
	};

	const handleSaveCredits = async () => {
		await updateCredits(creditEdits);
		setIsEditingCredits(false);
	};

	return (
		<Layout>
			<div className="container py-8 max-w-4xl mx-auto space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" onClick={() => navigate(-1)}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>
					<div>
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="mb-1"
						>
							Dimensional Stash
						</RiftHeading>
						<ManaFlowText variant="rift" speed="fast">
							Manage shared wealth, artifacts, and dimensional inventory bounds.
						</ManaFlowText>
					</div>
				</div>

				<AscendantWindow title="ADD LOOT">
					<div className="flex items-end gap-4">
						<div className="flex-1 space-y-2">
							<Label>Item Name</Label>
							<Input
								placeholder="e.g. Bureau salvage voucher, Healing Ampoule"
								value={newItemName}
								onChange={(e) => setNewItemName(e.target.value)}
							/>
						</div>
						<div className="w-24 space-y-2">
							<Label>QTY</Label>
							<Input
								type="number"
								min={1}
								value={newItemQuantity}
								onChange={(e) =>
									setNewItemQuantity(parseInt(e.target.value, 10) || 1)
								}
							/>
						</div>
						<Button onClick={handleAdd}>
							<Plus className="w-4 h-4 mr-2" /> Add
						</Button>
					</div>
				</AscendantWindow>

				<AscendantWindow title="PARTY WEALTH" className="relative">
					{isGoldLoading ? (
						<AscendantText className="block text-muted-foreground p-4">
							Reconciling Credits...
						</AscendantText>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 p-4 rounded-[2px] border border-primary/20 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
								{RA_CURRENCY_TYPES.map((currency) => (
									<div
										key={currency.id}
										className="flex flex-col items-center gap-2"
									>
										<div
											className={`w-10 h-10 rounded-[2px] flex items-center justify-center font-heading font-bold tracking-widest text-xs border bg-black/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]
                                            ${currency.colorClass} ${currency.borderClass}
                                        `}
										>
											{currency.symbol}
										</div>
										<div className="text-center text-xs text-muted-foreground">
											{currency.shortLabel}
										</div>
										{isEditingCredits ? (
											<Input
												type="number"
												value={creditEdits[currency.id]}
												onChange={(e) =>
													setCreditEdits((prev) => ({
														...prev,
														[currency.id]: parseInt(e.target.value, 10) || 0,
													}))
												}
												className="w-full text-center font-mono mt-2"
											/>
										) : (
											<span className="text-xl font-heading font-bold drop-shadow-[0_0_5px_currentColor] mt-2 block w-full text-center">
												{partyCredits[currency.id]}
											</span>
										)}
									</div>
								))}
							</div>

							<div className="flex justify-end gap-2">
								{isEditingCredits ? (
									<>
										<Button
											variant="outline"
											onClick={() => {
												setCreditEdits(partyCredits);
												setIsEditingCredits(false);
											}}
										>
											Cancel
										</Button>
										<Button onClick={handleSaveCredits}>Save Wealth</Button>
									</>
								) : (
									<Button
										variant="outline"
										onClick={() => setIsEditingCredits(true)}
									>
										<Coins className="w-4 h-4 mr-2" /> Edit Credits
									</Button>
								)}
							</div>
						</div>
					)}
				</AscendantWindow>

				<AscendantWindow title="STASH INVENTORY">
					{isLoading ? (
						<AscendantText className="block text-muted-foreground p-4">
							Loading stash...
						</AscendantText>
					) : inventory.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
							<p>The party stash is empty.</p>
						</div>
					) : (
						<div className="space-y-2">
							{inventory.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between p-3 bg-black/60 border-l-2 border-y border-r border-primary/30 border-l-primary rounded-[2px] shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] hover:shadow-[0_0_10px_rgba(0,0,0,0.5),inset_0_0_8px_hsl(var(--primary)/0.2)] transition-all"
								>
									<div>
										<span className="font-heading font-bold text-lg tracking-widest uppercase drop-shadow-[0_0_5px_currentColor] text-primary/90">
											{item.name}
										</span>
									</div>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													updateItem({
														id: item.id,
														updates: {
															quantity: Math.max(0, item.quantity - 1),
														},
													})
												}
											>
												-
											</Button>
											<span className="w-8 text-center">{item.quantity}</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													updateItem({
														id: item.id,
														updates: { quantity: item.quantity + 1 },
													})
												}
											>
												+
											</Button>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												removeItem({ id: item.id, name: item.name })
											}
										>
											<Trash2 className="w-4 h-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</AscendantWindow>
			</div>
		</Layout>
	);
}
