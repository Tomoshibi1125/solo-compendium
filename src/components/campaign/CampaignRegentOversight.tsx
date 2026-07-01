import { Plus, ScrollText, Trash2, User } from "lucide-react";
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
	type RegentUnlock,
	useCampaignRegentUnlockGrants,
	useCampaignRegentUnlocks,
	useRegentUnlockGrants,
	useRegentUnlocks,
} from "@/hooks/useRegentUnlocks";
import { REGENT_LABEL } from "@/lib/vernacular";

interface CampaignRegentOversightProps {
	campaignId: string;
}

export function CampaignRegentOversight({
	campaignId,
}: CampaignRegentOversightProps) {
	const [grantDialogOpen, setGrantDialogOpen] = useState(false);
	const [selectedCharId, setSelectedCharId] = useState<string>("");
	const [selectedQuestId, setSelectedQuestId] = useState<string>("");

	const { data: sharedCharacters = [], isLoading: loadingChars } =
		useCampaignSharedCharacters(campaignId);
	const { campaignUnlocks, isLoading: loadingUnlocks } =
		useCampaignRegentUnlocks(campaignId);
	const { campaignGrants } = useCampaignRegentUnlockGrants(campaignId);

	// The grant/remove mutations are keyed to the selected character.
	const { grantRegentUnlockAsync, isGranting } =
		useRegentUnlockGrants(selectedCharId);
	const { removeUnlock } = useRegentUnlocks(selectedCharId);

	const regentQuests = useMemo(() => getRegentUnlockQuests(), []);

	const handleGrant = async () => {
		if (!selectedCharId || !selectedQuestId) return;
		const quest = regentQuests.find((q) => q.id === selectedQuestId);
		if (!quest) return;

		await grantRegentUnlockAsync({
			questId: quest.id,
			questTitle: quest.title,
		});

		setGrantDialogOpen(false);
		setSelectedQuestId("");
	};

	const handleDelete = (unlockId: string, charId: string) => {
		if (
			confirm(`Are you sure you want to remove this ${REGENT_LABEL} unlock?`)
		) {
			setSelectedCharId(charId);
			setTimeout(() => removeUnlock(unlockId), 0);
		}
	};

	if (loadingChars || loadingUnlocks) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
						const char = share.characters;
						if (!char) return null;

						const charUnlocks = (campaignUnlocks as RegentUnlock[]).filter(
							(u) => u.character_id === char.id,
						);
						const pendingCredits = campaignGrants.filter(
							(g) => g.character_id === char.id,
						).length;

						return (
							<AscendantWindow key={char.id} title={char.name} variant="quest">
								<div className="space-y-3">
									<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
										<span className="flex items-center gap-1">
											<User className="w-3 h-3" />
											Level {char.level} {char.job}
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

									{charUnlocks.length === 0 ? (
										<p className="text-xs italic text-muted-foreground py-2">
											No {REGENT_LABEL}s unlocked.
										</p>
									) : (
										<div className="space-y-2">
											{charUnlocks.map((unlock) => {
												return (
													<div
														key={unlock.id}
														className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/50 group"
													>
														<div className="flex flex-col">
															<div className="flex items-center gap-2">
																<span className="font-semibold text-sm">
																	{unlock.regent?.name}
																</span>
															</div>
															<span className="text-[11px] text-muted-foreground">
																via: {unlock.quest_name}
															</span>
														</div>
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() => handleDelete(unlock.id, char.id)}
														>
															<Trash2 className="w-3 h-3 text-destructive" />
														</Button>
													</div>
												);
											})}
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
