import { Plus, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import {
	type RegentUnlock,
	useAvailableRegents,
	useCampaignRegentUnlocks,
	useRegentUnlocks,
} from "@/hooks/useRegentUnlocks";
import { REGENT_LABEL } from "@/lib/vernacular";

interface CampaignRegentOversightProps {
	campaignId: string;
}

export function CampaignRegentOversight({
	campaignId,
}: CampaignRegentOversightProps) {
	const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
	const [selectedCharId, setSelectedCharId] = useState<string>("");
	const [selectedRegentId, setSelectedRegentId] = useState<string>("");
	const [questName, setQuestName] = useState("");
	const [dmNotes, setDmNotes] = useState("");

	const { data: sharedCharacters = [], isLoading: loadingChars } =
		useCampaignSharedCharacters(campaignId);
	const { campaignUnlocks, isLoading: loadingUnlocks } =
		useCampaignRegentUnlocks(campaignId);

	// This hook is needed for the unlock mutation, but it requires a characterId.
	// We'll use a placeholder or conditionally call it, but since we need to mutate,
	// we'll use it for the specific character when the dialog is open.
	const { unlockRegent, isUnlocking, removeUnlock } =
		useRegentUnlocks(selectedCharId);
	const { availableRegents } = useAvailableRegents(selectedCharId);

	const handleUnlock = async () => {
		if (!selectedCharId || !selectedRegentId || !questName) return;

		await unlockRegent({
			regentId: selectedRegentId,
			questName,
			dmNotes,
		});

		setUnlockDialogOpen(false);
		setQuestName("");
		setDmNotes("");
		setSelectedRegentId("");
	};

	const handleDelete = async (unlockId: string, charId: string) => {
		if (
			confirm(`Are you sure you want to remove this ${REGENT_LABEL} unlock?`)
		) {
			// Note: useRegentUnlocks(charId).removeUnlock will work because charId is passed
			// but we need the hook instance for that charId.
			// For simplicity in this Protocol Warden (PW) view, we can just use the mutation from the hook
			// if selectedCharId matches, OR we could make a global mutation hook.
			// For now, let's assume the Protocol Warden (PW) selects the character first.
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
			<SystemWindow title={`${REGENT_LABEL.toUpperCase()} OVERSIGHT`}>
				<div className="flex justify-between items-center mb-6">
					<p className="text-sm text-muted-foreground">
						Manage {REGENT_LABEL} unlocks for all characters in this campaign.
					</p>
					<Button onClick={() => setUnlockDialogOpen(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Unlock {REGENT_LABEL}
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sharedCharacters.map((share) => {
						const char = share.characters;
						if (!char) return null;

						const charUnlocks = (campaignUnlocks as RegentUnlock[]).filter(
							(u) => u.character_id === char.id,
						);

						return (
							<SystemWindow key={char.id} title={char.name} variant="quest">
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
										<User className="w-3 h-3" />
										Level {char.level} {char.job}
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
															<span className="text-[10px] text-muted-foreground">
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
							</SystemWindow>
						);
					})}
				</div>
			</SystemWindow>

			<Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Unlock {REGENT_LABEL}</DialogTitle>
						<DialogDescription>
							Grant a new {REGENT_LABEL} to a character based on campaign
							achievements.
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
							<Label>{REGENT_LABEL}</Label>
							<Select
								value={selectedRegentId}
								onValueChange={setSelectedRegentId}
								disabled={!selectedCharId}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											selectedCharId
												? "Select regent"
												: "Select character first"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{availableRegents.map((regent) => (
										<SelectItem key={regent.id} value={regent.id}>
											{regent.name} - {regent.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Quest/Achievement Name</Label>
							<Input
								placeholder="e.g. Trial of the Silver Flame"
								value={questName}
								onChange={(e) => setQuestName(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label>PW Notes (Optional)</Label>
							<Input
								placeholder="Internal notes about this unlock..."
								value={dmNotes}
								onChange={(e) => setDmNotes(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setUnlockDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleUnlock}
							disabled={
								!selectedCharId ||
								!selectedRegentId ||
								!questName ||
								isUnlocking
							}
						>
							{isUnlocking ? "Unlocking..." : "Confirm Unlock"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
