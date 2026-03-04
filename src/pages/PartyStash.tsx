import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Coins, Package, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useCampaignGold } from "@/hooks/useCampaignGold";
import { useCampaignInventory } from "@/hooks/useCampaignInventory";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

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
			const { data } = await supabase
				.from("campaign_members")
				.select("character_id")
				.eq("campaign_id", campaignId)
				.eq("user_id", user.id)
				.maybeSingle();
			return data?.character_id || null;
		},
		enabled: !!campaignId && !!user?.id,
	});

	const { inventory, isLoading, addItem, removeItem, updateItem } =
		useCampaignInventory(campaignId, myCharacter || undefined);
	const {
		partyGold,
		isLoading: isGoldLoading,
		updateGold,
	} = useCampaignGold(campaignId);

	const [newItemName, setNewItemName] = useState("");
	const [newItemQuantity, setNewItemQuantity] = useState(1);

	// State for local gold edits before saving
	const [goldEdits, setGoldEdits] = useState(partyGold);
	const [isEditingGold, setIsEditingGold] = useState(false);

	// Sync local edits when remote data changes (if not currently editing)
	React.useEffect(() => {
		if (!isEditingGold) {
			setGoldEdits(partyGold);
		}
	}, [partyGold, isEditingGold]);

	if (!campaignId) {
		return (
			<Layout>
				<div className="container p-8 text-center max-w-2xl mx-auto">
					<SystemWindow title="PARTY STASH">
						<SystemHeading
							level={2}
							variant="gate"
							dimensional
							className="mb-4"
						>
							No Domain Selected
						</SystemHeading>
						<DataStreamText variant="system" speed="slow" className="mb-4">
							Select a domain from your Protocol Warden interface or Ascendant
							dashboard to access the shared dimensional stash.
						</DataStreamText>
						<Button onClick={() => navigate("/campaigns")}>
							Find Campaign
						</Button>
					</SystemWindow>
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

	const handleSaveGold = async () => {
		await updateGold(goldEdits);
		setIsEditingGold(false);
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
						<SystemHeading
							level={1}
							variant="sovereign"
							dimensional
							className="mb-1"
						>
							Dimensional Stash
						</SystemHeading>
						<DataStreamText variant="system" speed="fast">
							Manage shared wealth, artifacts, and dimensional inventory bounds.
						</DataStreamText>
					</div>
				</div>

				<SystemWindow title="ADD LOOT">
					<div className="flex items-end gap-4">
						<div className="flex-1 space-y-2">
							<Label>Item Name</Label>
							<Input
								placeholder="e.g. 500 Gold Pieces, Health Potion"
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
				</SystemWindow>

				<SystemWindow title="PARTY WEALTH" className="relative">
					{isGoldLoading ? (
						<SystemText className="block text-muted-foreground p-4">
							Counting coins...
						</SystemText>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-5 gap-4 bg-black/40 p-4 rounded-[2px] border border-primary/20 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
								{(["pp", "gp", "ep", "sp", "cp"] as const).map((coin) => (
									<div key={coin} className="flex flex-col items-center gap-2">
										<div
											className={`w-10 h-10 rounded-[2px] flex items-center justify-center font-system font-bold tracking-widest text-xs border bg-black/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]
                                            ${coin === "pp" ? "text-slate-300 border-slate-500 shadow-[0_0_8px_rgba(203,213,225,0.3)]" : ""}
                                            ${coin === "gp" ? "text-yellow-400 border-yellow-600 shadow-[0_0_8px_rgba(250,204,21,0.3)]" : ""}
                                            ${coin === "ep" ? "text-blue-300 border-blue-500 shadow-[0_0_8px_rgba(147,197,253,0.3)]" : ""}
                                            ${coin === "sp" ? "text-gray-300 border-gray-500 shadow-[0_0_8px_rgba(209,213,219,0.3)]" : ""}
                                            ${coin === "cp" ? "text-amber-500 border-amber-700 shadow-[0_0_8px_rgba(245,158,11,0.3)]" : ""}
                                        `}
										>
											{coin.toUpperCase()}
										</div>
										{isEditingGold ? (
											<Input
												type="number"
												value={goldEdits[coin]}
												onChange={(e) =>
													setGoldEdits((prev) => ({
														...prev,
														[coin]: parseInt(e.target.value, 10) || 0,
													}))
												}
												className="w-full text-center font-mono mt-2"
											/>
										) : (
											<span className="text-xl font-system font-bold drop-shadow-[0_0_5px_currentColor] mt-2 block w-full text-center">
												{partyGold[coin]}
											</span>
										)}
									</div>
								))}
							</div>

							<div className="flex justify-end gap-2">
								{isEditingGold ? (
									<>
										<Button
											variant="outline"
											onClick={() => {
												setGoldEdits(partyGold);
												setIsEditingGold(false);
											}}
										>
											Cancel
										</Button>
										<Button onClick={handleSaveGold}>Save Wealth</Button>
									</>
								) : (
									<Button
										variant="outline"
										onClick={() => setIsEditingGold(true)}
									>
										<Coins className="w-4 h-4 mr-2" /> Edit Coins
									</Button>
								)}
							</div>
						</div>
					)}
				</SystemWindow>

				<SystemWindow title="STASH INVENTORY">
					{isLoading ? (
						<SystemText className="block text-muted-foreground p-4">
							Loading stash...
						</SystemText>
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
										<span className="font-system font-bold text-lg tracking-widest uppercase drop-shadow-[0_0_5px_currentColor] text-primary/90">
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
				</SystemWindow>
			</div>
		</Layout>
	);
}
