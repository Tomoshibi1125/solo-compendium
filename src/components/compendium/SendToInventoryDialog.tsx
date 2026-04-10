import { User, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCampaignInventory } from "@/hooks/useCampaignInventory";
import { useEquipment } from "@/hooks/useEquipment";
import { useFeatures } from "@/hooks/useFeatures";
import { usePowers } from "@/hooks/usePowers";
import { useLearnRune } from "@/hooks/useRunes";
import type { CompendiumEntry } from "@/hooks/useStartupData";
import { useTechniques } from "@/hooks/useTechniques";
import type { Database } from "@/integrations/supabase/types";

interface SendToInventoryDialogProps {
	item: CompendiumEntry | null;
	isOpen: boolean;
	onClose: () => void;
	characters: Array<{ id: string; name: string }>;
	campaignId: string | null;
}

export function SendToInventoryDialog({
	item,
	isOpen,
	onClose,
	characters,
	campaignId,
}: SendToInventoryDialogProps) {
	const [targetType, setTargetType] = useState<"character" | "party">(
		"character",
	);
	const [targetId, setTargetId] = useState<string>("");
	const [isSending, setIsSending] = useState(false);
	const { toast } = useToast();

	// Hooks for various targets
	const { addEquipment } = useEquipment(
		targetType === "character" ? targetId : "",
	);
	const { addPower } = usePowers(targetType === "character" ? targetId : "");
	const { addTechnique } = useTechniques(
		targetType === "character" ? targetId : "",
	);
	const { addFeature } = useFeatures(
		targetType === "character" ? targetId : "",
	);
	const learnRune = useLearnRune();
	const { addItem: addToParty } = useCampaignInventory(campaignId);

	const handleSend = async () => {
		if (!item) return;
		if (targetType === "character" && !targetId) {
			toast({
				title: "Error",
				description: "Please select a character.",
				variant: "destructive",
			});
			return;
		}

		setIsSending(true);
		try {
			if (targetType === "character") {
				// Routing based on type
				switch (item.type) {
					case "spells":
					case "powers":
						await addPower({
							character_id: targetId,
							name: item.name,
							description: item.description,
							power_level: item.level || 0,
							source: item.source_book || "Compendium",
						});
						break;

					case "techniques":
						await addTechnique.mutateAsync(item.id);
						break;

					case "feats":
						await addFeature({
							character_id: targetId,
							name: item.name,
							description: item.description,
							source: "feat",
							level_acquired: 1,
						});
						break;

					case "runes":
						await learnRune.mutateAsync({
							characterId: targetId,
							runeId: item.id,
						});
						break;

					default:
						// Items, Sigils, Tattoos, Relics, etc go to equipment
						await addEquipment({
							character_id: targetId,
							name: item.name,
							description: item.description,
							item_type: item.type,
							rarity: item.rarity as
								| Database["public"]["Enums"]["rarity"]
								| null,
							weight: item.weight || 0,
							value_credits: item.value || 0,
							properties: Array.isArray(item.properties)
								? item.properties
								: null,
							requires_attunement: item.attunement || false,
						});
				}

				toast({
					title: "Added to Character",
					description: `${item.name} has been added to ${characters.find((c) => c.id === targetId)?.name}'s sheet.`,
				});
			} else {
				// Party Stash - Only for Items, Runes, Sigils, Tattoos
				const allowedPartyTypes = [
					"items",
					"equipment",
					"runes",
					"sigils",
					"tattoos",
					"relics",
					"artifacts",
				];

				if (!allowedPartyTypes.includes(item.type)) {
					toast({
						title: "Cannot Add to Stash",
						description: `${item.type} cannot be added to the party stash.`,
						variant: "destructive",
					});
					setIsSending(false);
					return;
				}

				await addToParty({
					name: item.name,
					description: item.description,
					item_type: item.type,
					quantity: 1,
				});
				toast({
					title: "Sent to Stash",
					description: `${item.name} has been added to the Party Stash.`,
				});
			}
			onClose();
		} catch (error: unknown) {
			console.error("Send error:", error);
			const message =
				error instanceof Error ? error.message : "Failed to send entry.";
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px] bg-background border-solar-glow/20">
				<DialogHeader>
					<DialogTitle className="text-solar-glow">
						Send to Inventory
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						Select where to send{" "}
						<span className="text-foreground font-medium">{item?.name}</span>.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<label htmlFor="destination-type" className="text-sm font-medium">
							Destination Type
						</label>
						<div id="destination-type" className="flex gap-2">
							<Button
								variant={targetType === "character" ? "default" : "outline"}
								className="flex-1 gap-2"
								onClick={() => setTargetType("character")}
							>
								<User className="h-4 w-4" />
								Character
							</Button>
							<Button
								variant={targetType === "party" ? "default" : "outline"}
								className="flex-1 gap-2"
								onClick={() => setTargetType("party")}
							>
								<Users className="h-4 w-4" />
								Party Stash
							</Button>
						</div>
					</div>

					{targetType === "character" && (
						<div className="space-y-2">
							<label htmlFor="character-select" className="text-sm font-medium">
								Select Character
							</label>
							<Select value={targetId} onValueChange={setTargetId}>
								<SelectTrigger id="character-select">
									<SelectValue placeholder="Select a character..." />
								</SelectTrigger>
								<SelectContent>
									{characters.map((char) => (
										<SelectItem key={char.id} value={char.id}>
											{char.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				<div className="flex justify-end gap-3 mt-4">
					<Button variant="ghost" onClick={onClose} disabled={isSending}>
						Cancel
					</Button>
					<Button
						onClick={handleSend}
						disabled={isSending || (targetType === "character" && !targetId)}
						className="bg-solar-glow text-black hover:bg-solar-glow/80"
					>
						{isSending ? "Sending..." : "Send Item"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
