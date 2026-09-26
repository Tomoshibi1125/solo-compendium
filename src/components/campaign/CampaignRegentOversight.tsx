import {
	AlertTriangle,
	Pencil,
	Plus,
	ScrollText,
	Trash2,
	User,
} from "lucide-react";
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
import { regents } from "@/data/compendium/regents";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import {
	getStoredRegentOfferCandidates,
	type RegentOffer,
	useRegentOffers,
} from "@/hooks/useRegentOffers";
import {
	useCampaignRegentUnlockGrants,
	useCampaignRegentUnlocks,
	useRemoveRegentUnlock,
} from "@/hooks/useRegentUnlocks";
import { resolveCanonicalRegentId } from "@/lib/regentIdentity";
import { REGENT_LABEL } from "@/lib/vernacular";

interface CampaignRegentOversightProps {
	campaignId: string;
}

const canonicalRegents = regents.flatMap((regent) => {
	const id = resolveCanonicalRegentId(regent.id);
	return id ? [{ ...regent, id }] : [];
});
const regentNameById = new Map(
	canonicalRegents.map((regent) => [regent.id, regent.title || regent.name]),
);

export function CampaignRegentOversight({
	campaignId,
}: CampaignRegentOversightProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedCharId, setSelectedCharId] = useState("");
	const [selectedQuestId, setSelectedQuestId] = useState("");
	const [candidateIds, setCandidateIds] = useState<[string, string, string]>([
		"",
		"",
		"",
	]);
	const [editingOffer, setEditingOffer] = useState<RegentOffer | null>(null);
	const [requestId, setRequestId] = useState("");

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
	const {
		campaignGrants,
		isLoading: loadingGrants,
		error: grantReadError,
	} = useCampaignRegentUnlockGrants(campaignId, sharedCharacters);
	const {
		createOfferAsync,
		configureOfferAsync,
		revokeOfferAsync,
		isCreating,
		isConfiguring,
		isRevoking,
	} = useRegentOffers(selectedCharId);
	const { removeUnlock, isRemoving } = useRemoveRegentUnlock();
	const regentQuests = useMemo(() => getRegentUnlockQuests(), []);

	const selectedUnlockIds = new Set(
		campaignUnlocks
			.filter((unlock) => unlock.character_id === selectedCharId)
			.flatMap((unlock) =>
				unlock.resolved_regent_id ? [unlock.resolved_regent_id] : [],
			),
	);
	const selectableRegents = canonicalRegents.filter(
		(regent) => !selectedUnlockIds.has(regent.id),
	);
	const distinctCandidates =
		candidateIds.every(Boolean) && new Set(candidateIds).size === 3;
	const busy = isCreating || isConfiguring;

	const resetDialog = () => {
		setEditingOffer(null);
		setSelectedCharId("");
		setSelectedQuestId("");
		setCandidateIds(["", "", ""]);
		setRequestId("");
	};

	const openCreate = () => {
		resetDialog();
		setRequestId(crypto.randomUUID());
		setDialogOpen(true);
	};

	const openEdit = (offer: RegentOffer) => {
		const stored = getStoredRegentOfferCandidates(offer);
		setEditingOffer(offer);
		setSelectedCharId(offer.character_id);
		setSelectedQuestId(offer.quest_id ?? "");
		setCandidateIds(
			stored && stored.length === 3
				? [stored[0], stored[1], stored[2]]
				: ["", "", ""],
		);
		setRequestId("");
		setDialogOpen(true);
	};

	const setCandidate = (index: 0 | 1 | 2, value: string) => {
		setCandidateIds((current) => {
			const next: [string, string, string] = [...current];
			next[index] = value;
			return next;
		});
	};

	const handleSubmit = async () => {
		if (!selectedCharId || !distinctCandidates) return;
		try {
			if (editingOffer) {
				await configureOfferAsync({
					grantId: editingOffer.id,
					candidateRegentIds: candidateIds,
				});
			} else {
				const quest = regentQuests.find(
					(candidate) => candidate.id === selectedQuestId,
				);
				if (!quest || !requestId) return;
				await createOfferAsync({
					questId: quest.id,
					questTitle: quest.title,
					candidateRegentIds: candidateIds,
					requestId,
				});
			}
			setDialogOpen(false);
			resetDialog();
		} catch {
			// Hooks own destructive toasts; dialog remains open for stable retry.
		}
	};

	const handleRevokeOffer = async (offer: RegentOffer) => {
		if (!confirm("Revoke this pending Regent offer?")) return;
		setSelectedCharId(offer.character_id);
		try {
			await revokeOfferAsync(offer.id);
		} catch {
			// Hook owns toast.
		}
	};

	const handleDeleteUnlock = (unlockId: string, characterId: string) => {
		if (confirm(`Remove this ${REGENT_LABEL} unlock?`)) {
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

	const readError =
		sharedCharacterError ?? campaignUnlockError ?? grantReadError;
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
				<div className="flex justify-between items-start gap-4 mb-6">
					<p className="text-sm text-muted-foreground max-w-2xl">
						Confirm a completed Regent quest, then offer exactly three distinct
						canonical Regents. The player may choose only one stored candidate;
						there is no level gate and a character can resolve at most two
						Regents.
					</p>
					<Button onClick={openCreate}>
						<Plus className="w-4 h-4 mr-2" />
						Create {REGENT_LABEL} Offer
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sharedCharacters.map((share) => {
						const character = share.characters;
						if (!character) return null;
						const characterUnlocks = campaignUnlocks.filter(
							(unlock) => unlock.character_id === character.id,
						);
						const characterOffers = campaignGrants.filter(
							(grant) => grant.character_id === character.id,
						) as RegentOffer[];

						return (
							<AscendantWindow
								key={character.id}
								title={character.name}
								variant="quest"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<User className="w-3 h-3" />
											Level {character.level} {character.job}
										</span>
										<Badge variant="outline">
											{characterUnlocks.length}/2 resolved
										</Badge>
									</div>

									{characterOffers.map((offer) => {
										const stored = getStoredRegentOfferCandidates(offer);
										return (
											<div
												key={offer.id}
												className="p-3 rounded border bg-muted/20 space-y-2"
											>
												<div className="flex items-center justify-between gap-2">
													<span className="text-xs font-semibold flex items-center gap-1">
														<ScrollText className="w-3 h-3" />
														{offer.quest_title}
													</span>
													<Badge variant="outline" className="text-[10px]">
														v{offer.offer_version ?? 1}
													</Badge>
												</div>
												{stored ? (
													<p className="text-[11px] text-muted-foreground">
														{stored
															.map((id) => regentNameById.get(id) ?? id)
															.join(" • ")}
													</p>
												) : (
													<p className="text-[11px] text-regent-gold">
														Legacy credit: candidate configuration required.
													</p>
												)}
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => openEdit(offer)}
													>
														<Pencil className="w-3 h-3 mr-1" />
														{stored ? "Edit" : "Configure"}
													</Button>
													<Button
														size="sm"
														variant="ghost"
														disabled={isRevoking}
														onClick={() => handleRevokeOffer(offer)}
													>
														<Trash2 className="w-3 h-3 mr-1 text-destructive" />
														Revoke
													</Button>
												</div>
											</div>
										);
									})}

									{characterUnlocks.map((unlock) => (
										<div
											key={unlock.id}
											className="flex items-center justify-between p-2 rounded bg-muted/30 border"
										>
											<div className="min-w-0">
												<p className="font-semibold text-sm">
													{unlock.regent?.name ?? "Unresolved legacy Regent"}
												</p>
												<p className="text-[11px] text-muted-foreground">
													via: {unlock.quest_name}
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Remove ${unlock.regent?.name ?? "Regent"} unlock`}
												onClick={() =>
													handleDeleteUnlock(unlock.id, character.id)
												}
												disabled={isRemoving}
											>
												<Trash2 className="w-3 h-3 text-destructive" />
											</Button>
										</div>
									))}
								</div>
							</AscendantWindow>
						);
					})}
				</div>
			</AscendantWindow>

			<Dialog
				open={dialogOpen}
				onOpenChange={(next) => {
					setDialogOpen(next);
					if (!next) resetDialog();
				}}
			>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editingOffer ? "Configure Regent Offer" : "Create Regent Offer"}
						</DialogTitle>
						<DialogDescription>
							Choose exactly three distinct canonical Regents. Pending offers
							may be edited; consumed offers are immutable.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Character</Label>
							<Select
								value={selectedCharId}
								onValueChange={setSelectedCharId}
								disabled={Boolean(editingOffer)}
							>
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

						{!editingOffer && (
							<div className="space-y-2">
								<Label>Completed Regent Quest</Label>
								<Select
									value={selectedQuestId}
									onValueChange={setSelectedQuestId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select completed quest" />
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
						)}

						{([0, 1, 2] as const).map((index) => (
							<div className="space-y-2" key={index}>
								<Label>Candidate {index + 1}</Label>
								<Select
									value={candidateIds[index]}
									onValueChange={(value) => setCandidate(index, value)}
									disabled={!selectedCharId}
								>
									<SelectTrigger>
										<SelectValue placeholder={`Choose Regent ${index + 1}`} />
									</SelectTrigger>
									<SelectContent>
										{selectableRegents.map((regent) => (
											<SelectItem
												key={regent.id}
												value={regent.id}
												disabled={candidateIds.some(
													(chosen, chosenIndex) =>
														chosenIndex !== index && chosen === regent.id,
												)}
											>
												{regent.title || regent.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={
								!selectedCharId ||
								(!editingOffer && !selectedQuestId) ||
								!distinctCandidates ||
								busy
							}
						>
							{busy
								? "Saving..."
								: editingOffer
									? "Save Offer"
									: "Create Offer"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
