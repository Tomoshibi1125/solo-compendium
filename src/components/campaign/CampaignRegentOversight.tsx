import { AlertTriangle, Plus, ScrollText, Trash2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getRegentUnlockQuests } from "@/data/compendium/quest-contracts";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import {
	useCampaignRegentUnlockGrants,
	useCampaignRegentUnlocks,
	useRegentUnlockGrants,
	useRemoveRegentUnlock,
} from "@/hooks/useRegentUnlocks";
import { REGENT_LABEL } from "@/lib/vernacular";

interface CampaignRegentOversightProps {
	campaignId: string;
}

export function CampaignRegentOversight({
	campaignId,
}: CampaignRegentOversightProps) {
	const [grantDialogOpen, setGrantDialogOpen] = useState(false);
	const [selectedCharId, setSelectedCharId] = useState("");
	const [selectedQuestId, setSelectedQuestId] = useState("");

	const {
		data: sharedCharacters = [],
		isLoading: loadingChars,
		error: sharedCharacterError,
	} = useCampaignSharedCharacters(campaignId);
	const {
		campaignUnlocks,
		isLoading: loadingUnlocks,
		error: campaignUnlockError,
	} = useCampaignRegentUnlocks(campaignId, sharedCharacters);
	const unlockError = sharedCharacterError ?? campaignUnlockError;
	const {
		campaignGrants,
		isLoading: loadingGrants,
		error: grantReadError,
	} = useCampaignRegentUnlockGrants(campaignId, sharedCharacters);
	const { grantRegentUnlockAsync, isGranting } =
		useRegentUnlockGrants(selectedCharId);
	const { removeUnlock, isRemoving } = useRemoveRegentUnlock();
	const regentQuests = useMemo(() => getRegentUnlockQuests(), []);

	const handleGrant = async () => {
		if (!selectedCharId || !selectedQuestId) return;
		const quest = regentQuests.find(
			(candidate) => candidate.id === selectedQuestId,
		);
		if (!quest) return;

		try {
			await grantRegentUnlockAsync({
				questId: quest.id,
				questTitle: quest.title,
			});
			setGrantDialogOpen(false);
			setSelectedQuestId("");
		} catch {
			// The hook owns the destructive toast and keeps the dialog open for retry.
		}
	};

	const handleDelete = (unlockId: string, characterId: string) => {
		if (
			confirm(`Are you sure you want to remove this ${REGENT_LABEL} unlock?`)
		) {
			removeUnlock({ unlockId, characterId });
		}
	};

	if (loadingChars || loadingUnlocks || loadingGrants) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	const readError = unlockError ?? grantReadError;
	if (readError) {
		return (
			<div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
				<AlertTriangle className="h-5 w-5 shrink-0" />
				<span>
					{readError instanceof Error
						? readError.message
						: `Could not load ${REGENT_LABEL} oversight.`}
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<AscendantWindow title={`${REGENT_LABEL.toUpperCase()} OVERSIGHT`}>
				<div className="flex justify-between items-center mb-6">
					<p className="text-sm text-muted-foreground">
						Award a {REGENT_LABEL} unlock by confirming a character completed a
						regent-tagged quest. The player then chooses which {REGENT_LABEL}
						from three stat-ranked candidates.
					</p>
					<Button onClick={() => setGrantDialogOpen(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Grant {REGENT_LABEL} Unlock
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sharedCharacters.map((share) => {
						const character = share.characters;
						if (!character) return null;

						const characterUnlocks = campaignUnlocks.filter(
							(unlock) => unlock.character_id === character.id,
						);
						const pendingCredits = campaignGrants.filter(
							(grant) => grant.character_id === character.id,
						).length;

						return (
							<AscendantWindow
								key={character.id}
								title={character.name}
								variant="quest"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
										<span className="flex items-center gap-1">
											<User className="w-3 h-3" />
											Level {character.level} {character.job}
										</span>
										{pendingCredits > 0 && (
											<Badge
												variant="outline"
												className="text-[10px] gap-1 border-primary/40 text-primary"
											>
												<ScrollText className="w-3 h-3" />
												{pendingCredits} unspent
											</Badge>
										)}
									</div>

									{characterUnlocks.length === 0 ? (
										<p className="text-xs italic text-muted-foreground py-2">
											No {REGENT_LABEL}s unlocked.
										</p>
									) : (
										<div className="space-y-2">
											{characterUnlocks.map((unlock) => (
												<div
													key={unlock.id}
													className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/50 group"
												>
													<div className="flex flex-col min-w-0">
														<span className="font-semibold text-sm">
															{unlock.regent?.name ??
																"Unresolved legacy Regent"}
														</span>
														<span className="text-[11px] text-muted-foreground">
															via: {unlock.quest_name}
														</span>
														{!unlock.regent && (
															<span className="text-[10px] text-regent-gold">
																Awaiting Task 19 identity reconciliation
															</span>
														)}
													</div>
													<Button
														variant="ghost"
														size="icon"
														aria-label="Delete"
														className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() =>
															handleDelete(unlock.id, character.id)
														}
														disabled={isRemoving}
													>
														<Trash2 className="w-3 h-3 text-destructive" />
													</Button>
												</div>
											))}
										</div>
									)}
								</div>
							</AscendantWindow>
						);
					})}
				</div>
			</AscendantWindow>

			<Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Grant {REGENT_LABEL} Unlock</DialogTitle>
						<DialogDescription>
							Confirm a character has completed a regent-tagged quest. This
							awards one unlock opportunity — the player picks which{" "}
							{REGENT_LABEL} to attune.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Character</Label>
							<Select value={selectedCharId} onValueChange={setSelectedCharId}>
								<SelectTrigger>
									<SelectValue placeholder="Select character" />
								</SelectTrigger>
								<SelectContent>
									{sharedCharacters.map((share) => (
										<SelectItem
											key={share.character_id}
											value={share.character_id}
										>
											{share.characters?.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Completed Regent Quest</Label>
							<Select
								value={selectedQuestId}
								onValueChange={setSelectedQuestId}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select the completed quest" />
								</SelectTrigger>
								<SelectContent>
									{regentQuests.map((quest) => (
										<SelectItem key={quest.id} value={quest.id}>
											[{quest.rank}] {quest.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleGrant}
							disabled={!selectedCharId || !selectedQuestId || isGranting}
						>
							{isGranting ? "Granting..." : "Grant Unlock"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
