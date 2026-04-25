import {
	Crown,
	ExternalLink,
	EyeOff,
	Loader2,
	PackagePlus,
	Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { WardenItemDeliveryDialog } from "@/components/warden-directives/WardenItemDeliveryDialog";
import {
	useCampaignSharedCharacters,
	useShareCharacter,
	useUnshareCharacter,
} from "@/hooks/useCampaignCharacters";
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import { useHasWardenAccess } from "@/hooks/useCampaigns";
import { useCharacters } from "@/hooks/useCharacters";
import { isSandboxNpcCharacter } from "@/lib/characterScope";
import {
	type LocalCharacterRow,
	readLocalNpcCharacters,
} from "@/lib/guestStore";
import { formatRegentVernacular } from "@/lib/vernacular";

interface CampaignCharactersProps {
	campaignId: string;
}

export function CampaignCharacters({ campaignId }: CampaignCharactersProps) {
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [selectedCharacter, setSelectedCharacter] = useState("");
	const [showWardenNpcs, setShowWardenNpcs] = useState(true);
	const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
	const [deliveryCharacterId, setDeliveryCharacterId] = useState<string | null>(
		null,
	);

	const { data: sharedCharacters = [], isLoading: loadingShared } =
		useCampaignSharedCharacters(campaignId);
	const { data: myCharacters = [] } = useCharacters();
	const { data: hasWardenAccess = false } = useHasWardenAccess(campaignId);
	const shareCharacter = useShareCharacter();
	const unshareCharacter = useUnshareCharacter();
	const sendMessage = useSendCampaignMessage();

	// Warden-only NPC roster (guest mode). Sandbox-injected NPCs live under
	// `solo-compendium.npc-characters.${campaignId}` with a `[SANDBOX_NPC]`
	// marker in their notes. Hidden from players entirely; rendered as a
	// separate Warden-only window below Shared Characters.
	const [wardenNpcs, setWardenNpcs] = useState<LocalCharacterRow[]>([]);
	useEffect(() => {
		if (!hasWardenAccess) {
			setWardenNpcs([]);
			return;
		}
		setWardenNpcs(readLocalNpcCharacters(campaignId));
		// Re-read on storage events so the list refreshes when the injector
		// completes asynchronously.
		const onStorage = (e: StorageEvent) => {
			if (
				e.key === `solo-compendium.npc-characters.${campaignId}` ||
				e.key === null
			) {
				setWardenNpcs(readLocalNpcCharacters(campaignId));
			}
		};
		window.addEventListener("storage", onStorage);
		// Additional poll for same-window writes (storage event only fires
		// across different tabs). Cheap — runs once per second for 10s.
		let ticks = 0;
		const poll = window.setInterval(() => {
			ticks++;
			setWardenNpcs(readLocalNpcCharacters(campaignId));
			if (ticks >= 10) window.clearInterval(poll);
		}, 1000);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.clearInterval(poll);
		};
	}, [campaignId, hasWardenAccess]);

	const filteredWardenNpcs = useMemo(
		() => wardenNpcs.filter((npc) => isSandboxNpcCharacter(npc)),
		[wardenNpcs],
	);

	const sharedCharacterIds = new Set(
		sharedCharacters.map((sc) => sc.character_id),
	);
	const availableCharacters = myCharacters.filter(
		(c) => !sharedCharacterIds.has(c.id),
	);

	const handleShare = async () => {
		if (!selectedCharacter) return;
		const char = availableCharacters.find((c) => c.id === selectedCharacter);
		await shareCharacter.mutateAsync({
			campaignId,
			characterId: selectedCharacter,
		});

		if (char) {
			// System broadcast when sharing
			await sendMessage.mutateAsync({
				campaignId,
				content: `**System**: ${char.name} has joined the campaign.`,
			});
		}

		setShareDialogOpen(false);
		setSelectedCharacter("");
	};

	const handleUnshare = async (characterId: string) => {
		if (confirm("Stop sharing this character with the campaign?")) {
			const char = sharedCharacters.find(
				(sc) => sc.character_id === characterId,
			)?.characters;
			await unshareCharacter.mutateAsync({ campaignId, characterId });

			if (char) {
				// System broadcast when unsharing
				await sendMessage.mutateAsync({
					campaignId,
					content: `**System**: ${char.name} has left the campaign.`,
				});
			}
		}
	};

	const openDeliveryDialog = (characterId: string) => {
		setDeliveryCharacterId(characterId);
		setDeliveryDialogOpen(true);
	};

	return (
		<>
			{/* Warden-only NPC roster. Rendered above Shared Characters so the
			    Warden sees module-imported NPCs prominently. Hidden from
			    players via the hasWardenAccess gate. */}
			{hasWardenAccess && filteredWardenNpcs.length > 0 && (
				<AscendantWindow
					title="WARDEN NPCS"
					className="mb-4 max-h-[360px] flex flex-col"
				>
					<div className="flex items-center justify-between mb-3 gap-3">
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden />
							<span>
								{filteredWardenNpcs.length} module-imported NPC
								{filteredWardenNpcs.length === 1 ? "" : "s"} — visible only to
								the Warden
							</span>
						</p>
						<span className="flex items-center gap-2 text-xs cursor-pointer">
							<Switch
								checked={showWardenNpcs}
								onCheckedChange={setShowWardenNpcs}
								aria-label="Toggle Warden NPC list"
							/>
							<span>Show roster</span>
						</span>
					</div>
					{showWardenNpcs && (
						<div
							className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2"
							data-testid="warden-npc-roster"
						>
							{filteredWardenNpcs.map((npc) => (
								<div
									key={npc.id}
									className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-md border border-border/50"
									data-testid="warden-npc-card"
								>
									<div className="min-w-0">
										<p className="font-heading text-sm truncate">{npc.name}</p>
										<p className="text-[10px] text-muted-foreground truncate">
											Lv {npc.level} · {formatRegentVernacular(npc.job ?? "")}
										</p>
									</div>
									<div className="flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground">
										<span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
											HP {npc.hp_max}
										</span>
										<span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
											AC {npc.armor_class}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</AscendantWindow>
			)}

			<AscendantWindow
				title="SHARED ASCENDANTS"
				className="h-[400px] flex flex-col"
			>
				<div className="flex justify-between items-center mb-4">
					<p className="text-sm text-muted-foreground">
						Characters visible to all campaign members
					</p>
					<Button
						size="sm"
						onClick={() => setShareDialogOpen(true)}
						disabled={availableCharacters.length === 0}
					>
						<Share2 className="w-4 h-4 mr-2" />
						Share Character
					</Button>
				</div>
				<div className="flex-1 overflow-y-auto space-y-2">
					{loadingShared ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
						</div>
					) : sharedCharacters.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No characters shared yet. Share one to get started!
						</p>
					) : (
						sharedCharacters.map((share) => (
							<div
								key={share.id}
								className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div>
										<p className="font-heading font-semibold">
											{share.characters?.name || "Unknown Character"}
										</p>
										{share.characters && (
											<p className="text-xs text-muted-foreground">
												Level {share.characters.level}{" "}
												{formatRegentVernacular(share.characters.job)}
											</p>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2">
									{hasWardenAccess && share.characters && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												if (share.characters)
													openDeliveryDialog(share.characters.id);
											}}
										>
											<PackagePlus className="w-3 h-3 mr-1" />
											Grant Item
										</Button>
									)}
									{share.characters && (
										<Link to={`/characters/${share.characters.id}`}>
											<Button variant="outline" size="sm">
												<ExternalLink className="w-3 h-3 mr-1" />
												View
											</Button>
										</Link>
									)}
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => handleUnshare(share.character_id)}
									>
										<EyeOff className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</AscendantWindow>

			<Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Share Ascendant</DialogTitle>
						<DialogDescription>
							Select an Ascendant to share with all campaign members. They'll be
							able to view the Ascendant's sheet.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Select
							value={selectedCharacter}
							onValueChange={setSelectedCharacter}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select an Ascendant" />
							</SelectTrigger>
							<SelectContent>
								{availableCharacters.map((char) => (
									<SelectItem key={char.id} value={char.id}>
										{char.name} - Level {char.level}{" "}
										{formatRegentVernacular(char.job ?? "")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShareDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleShare}
							disabled={!selectedCharacter || shareCharacter.isPending}
						>
							{shareCharacter.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Sharing...
								</>
							) : (
								<>
									<Share2 className="w-4 h-4 mr-2" />
									Share
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{hasWardenAccess && (
				<WardenItemDeliveryDialog
					open={deliveryDialogOpen}
					onOpenChange={setDeliveryDialogOpen}
					campaignId={campaignId}
					initialCharacterId={deliveryCharacterId}
					title="Grant or Assign Campaign Item"
				/>
			)}
		</>
	);
}
