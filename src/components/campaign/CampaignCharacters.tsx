import {
	Crown,
	ExternalLink,
	Loader2,
	PackagePlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WardenItemDeliveryDialog } from "@/components/warden-directives/WardenItemDeliveryDialog";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import { useHasWardenAccess } from "@/hooks/useCampaigns";
import { useAuth } from "@/lib/auth/authContext";
import { isSandboxNpcCharacter } from "@/lib/characterScope";
import {
	getLocalUserId,
	type LocalCharacterRow,
	readLocalNpcCharacters,
} from "@/lib/guestStore";
import { formatRegentVernacular } from "@/lib/vernacular";

interface CampaignCharactersProps {
	campaignId: string;
}

export function CampaignCharacters({ campaignId }: CampaignCharactersProps) {
	const [showWardenNpcs, setShowWardenNpcs] = useState(true);
	const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
	const [deliveryCharacterId, setDeliveryCharacterId] = useState<string | null>(
		null,
	);

	const { data: rosterCharacters = [], isLoading: loadingRoster } =
		useCampaignSharedCharacters(campaignId);
	const { user } = useAuth();
	const { data: hasWardenAccess = false } = useHasWardenAccess(campaignId);
	const currentUserId = user?.id ?? getLocalUserId();

	// Warden-only NPC roster (guest mode). Sandbox-injected NPCs live under
	// `solo-compendium.npc-characters.${campaignId}` with a `[SANDBOX_NPC]`
	// marker in their notes. Hidden from players entirely; rendered as a
	// separate Warden-only window below Campaign Ascendants.
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

	const openDeliveryDialog = (characterId: string) => {
		setDeliveryCharacterId(characterId);
		setDeliveryDialogOpen(true);
	};

	return (
		<>
			{/* Warden-only NPC roster. Rendered above Campaign Ascendants so the
			    Warden sees module-imported NPCs prominently. Hidden from
			    players via the hasWardenAccess gate. */}
			{hasWardenAccess && filteredWardenNpcs.length > 0 && (
				<AscendantWindow
					title="WARDEN NPCS"
					className="mb-4 max-h-[360px] flex flex-col"
				>
					<div className="flex items-center justify-between mb-3 gap-3">
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Crown className="w-3.5 h-3.5 text-gate-s" aria-hidden />
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
										<p className="text-[11px] text-muted-foreground truncate">
											Lv {npc.level} · {formatRegentVernacular(npc.job ?? "")}
										</p>
									</div>
									<div className="flex items-center gap-1 shrink-0 text-[11px] text-muted-foreground">
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
				title="CAMPAIGN ASCENDANTS"
				className="h-[400px] flex flex-col"
			>
				<div className="flex justify-between items-center mb-4">
					<p className="text-sm text-muted-foreground">
						Characters linked to this campaign. Wardens can open sheets and grant items.
					</p>
				</div>
				<div className="flex-1 overflow-y-auto space-y-2">
					{loadingRoster ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
						</div>
					) : rosterCharacters.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No Ascendants linked yet. Members can attach a character from the
							Overview tab.
						</p>
					) : (
						rosterCharacters.map((entry) => {
							const isOwner =
								entry.owner_user_id === currentUserId ||
								entry.shared_by === currentUserId;
							const canViewSheet = hasWardenAccess || isOwner;
							return (
								<div
									key={entry.id}
									className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
								>
									<div className="flex items-center gap-3">
										<div>
											<p className="font-heading font-semibold">
												{entry.characters?.name || "Unknown Character"}
											</p>
											{entry.characters && (
												<p className="text-xs text-muted-foreground">
													Level {entry.characters.level}{" "}
													{formatRegentVernacular(entry.characters.job)}
												</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										{hasWardenAccess && entry.characters && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													if (entry.characters)
														openDeliveryDialog(entry.characters.id);
												}}
											>
												<PackagePlus className="w-3 h-3 mr-1" />
												Grant Item
											</Button>
										)}
										{canViewSheet && entry.characters && (
											<Link to={`/characters/${entry.characters.id}`}>
												<Button variant="outline" size="sm">
													<ExternalLink className="w-3 h-3 mr-1" />
													View
												</Button>
											</Link>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</AscendantWindow>

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
