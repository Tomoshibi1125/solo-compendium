import {
	AlertTriangle,
	CheckCircle,
	Crown,
	Lock,
	Scroll,
	Star,
	Unlock,
} from "lucide-react";
import { useState } from "react";
import { RegentCatchUpModal } from "@/components/character/RegentCatchUpModal";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { regents } from "@/data/compendium/regents";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	getStoredRegentOfferCandidates,
	useRegentOffers,
} from "@/hooks/useRegentOffers";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { resolveCanonicalRegentId } from "@/lib/regentIdentity";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

interface RegentUnlocksPanelProps {
	characterId: string;
	campaignId?: string;
}

const canonicalRegents = regents.flatMap((regent) => {
	const id = resolveCanonicalRegentId(regent.id);
	return id ? [{ ...regent, id }] : [];
});
const regentsById = new Map(
	canonicalRegents.map((regent) => [regent.id, regent]),
);

export function RegentUnlocksPanel({
	characterId,
	campaignId,
}: RegentUnlocksPanelProps) {
	const [open, setOpen] = useState(false);
	const [selectedRegentId, setSelectedRegentId] = useState("");
	const [catchUpFor, setCatchUpFor] = useState<{
		regentId: string;
		unlockId: string;
	} | null>(null);

	const { data: character } = useCharacter(characterId);
	const {
		unlocks = [],
		setPrimary,
		consumeGrantAsync,
		isConsuming,
		isSettingPrimary,
	} = useRegentUnlocks(characterId);
	const { offers, availableOffers } = useRegentOffers(characterId);
	const ascendantTools = useAscendantTools();

	const canonicalUnlocks = unlocks.filter(
		(unlock) => unlock.resolved_regent_id !== null,
	);
	const activeOffer = offers[0] ?? null;
	const storedCandidateIds = getStoredRegentOfferCandidates(activeOffer);
	const storedChoices = (storedCandidateIds ?? []).flatMap((id) => {
		const regent = regentsById.get(id);
		return regent ? [regent] : [];
	});
	const hasConfiguredOffer = storedChoices.length === 3;
	const hasJob = Boolean(character?.job);
	const hasPath = Boolean(character?.path);
	const canUnlockSovereign = hasJob && hasPath && canonicalUnlocks.length >= 2;

	const handleConsume = async () => {
		const canonicalId = resolveCanonicalRegentId(selectedRegentId);
		if (
			!canonicalId ||
			!activeOffer ||
			!storedCandidateIds?.includes(canonicalId)
		) {
			return;
		}
		const selectedRegent = regentsById.get(canonicalId);
		const regentName = selectedRegent
			? formatRegentVernacular(selectedRegent.title || selectedRegent.name)
			: REGENT_LABEL;

		try {
			const unlock = await consumeGrantAsync({
				grantId: activeOffer.id,
				regentId: canonicalId,
			});
			await ascendantTools
				.trackCustomFeatureUsage(
					characterId,
					`${REGENT_LABEL} Unlocked`,
					regentName,
					"SA",
				)
				.catch(console.error);
			setOpen(false);
			setSelectedRegentId("");
			if (unlock.resolved_regent_id) {
				setCatchUpFor({
					regentId: unlock.resolved_regent_id,
					unlockId: unlock.id,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const pendingCatchUp = unlocks.find(
		(unlock) =>
			unlock.resolved_regent_id !== null && unlock.caught_up_at_level === null,
	);
	const catchUpTarget =
		catchUpFor ??
		(pendingCatchUp?.resolved_regent_id
			? {
					regentId: pendingCatchUp.resolved_regent_id,
					unlockId: pendingCatchUp.id,
				}
			: null);

	return (
		<AscendantWindow
			title={`${REGENT_LABEL.toUpperCase()} UNLOCKS - DIVINE AUTHORITY`}
			variant="regent"
			className="border-regent-gold/30"
		>
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-regent-gold/20 flex items-center justify-center">
							<Crown className="h-5 w-5 text-regent-gold" />
						</div>
						<div>
							<p className="font-heading text-sm text-muted-foreground">
								{REGENT_LABEL_PLURAL} Resolved
							</p>
							<p className="font-display text-lg text-regent-gold">
								{canonicalUnlocks.length} / 2
							</p>
						</div>
					</div>
					{canUnlockSovereign && (
						<Badge className="bg-resurge-violet/20 text-resurge-violet border-resurge-violet/40 font-display">
							<Star className="h-3 w-3 mr-1" />
							Sovereign Ready
						</Badge>
					)}
				</div>

				{unlocks.length > 0 && (
					<>
						<Separator className="bg-regent-gold/20" />
						<div className="space-y-3">
							{unlocks.map((unlock) => {
								if (!unlock.regent || !unlock.resolved_regent_id) {
									return (
										<div
											key={unlock.id}
											className="p-4 rounded-lg border border-regent-gold/40 bg-regent-gold/5"
										>
											<div className="flex items-start gap-3">
												<AlertTriangle className="h-5 w-5 text-regent-gold shrink-0" />
												<div>
													<p className="font-semibold text-regent-gold">
														Unresolved legacy {REGENT_LABEL} unlock
													</p>
													<p className="text-xs text-muted-foreground">
														The preserved legacy identity is visible but is not
														counted toward Sovereign readiness until reconciled
														to a canonical Regent.
													</p>
												</div>
											</div>
										</div>
									);
								}

								return (
									<div
										key={unlock.id}
										className="p-4 rounded-lg border border-regent-gold/30 bg-regent-gold/5"
									>
										<div className="flex items-center justify-between gap-3">
											<div>
												<div className="flex items-center gap-2">
													<p className="font-heading font-semibold">
														{formatRegentVernacular(
															unlock.regent.title || unlock.regent.name,
														)}
													</p>
													{unlock.is_primary && (
														<Badge
															variant="outline"
															className="text-regent-gold"
														>
															Primary
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
													<Scroll className="h-3 w-3" />
													<span>
														Quest: {formatRegentVernacular(unlock.quest_name)}
													</span>
												</div>
											</div>
											{!unlock.is_primary && canonicalUnlocks.length > 1 && (
												<Button
													size="sm"
													variant="ghost"
													onClick={() => setPrimary(unlock.id)}
													disabled={isSettingPrimary}
												>
													<Star className="h-3 w-3 mr-1" />
													Set Primary
												</Button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}

				{unlocks.length === 0 && availableOffers === 0 && (
					<div className="text-center py-6">
						<Lock className="h-10 w-10 text-regent-gold/30 mx-auto mb-3" />
						<p className="text-sm text-muted-foreground">
							Complete a Regent quest and have your Warden issue an offer.
						</p>
					</div>
				)}

				{canonicalUnlocks.length < 2 && activeOffer && !hasConfiguredOffer && (
					<div className="flex items-start gap-3 p-4 rounded-lg border border-regent-gold/40 bg-regent-gold/5">
						<AlertTriangle className="h-5 w-5 text-regent-gold shrink-0" />
						<div>
							<p className="font-semibold text-regent-gold">
								Legacy offer needs Warden configuration
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								This older unlock credit is preserved, but R1 requires your
								Warden to store exactly three canonical Regent candidates before
								it can be used.
							</p>
						</div>
					</div>
				)}

				{canonicalUnlocks.length < 2 && activeOffer && hasConfiguredOffer && (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="w-full border-regent-gold/40 hover:bg-regent-gold/10 font-display tracking-wider"
							>
								<Unlock className="h-4 w-4 mr-2 text-regent-gold" />
								APPROACH THE THRONE
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-card border-regent-gold/40 max-w-lg">
							<DialogHeader>
								<DialogTitle className="font-display text-xl gradient-text-regent flex items-center gap-2">
									<Crown className="h-5 w-5" />
									Choose One Regent
								</DialogTitle>
								<p className="text-sm text-muted-foreground">
									Your Warden stored exactly three candidates for{" "}
									{formatRegentVernacular(activeOffer.quest_title)}. Offer
									version {activeOffer.offer_version} is authoritative.
								</p>
							</DialogHeader>
							<div className="space-y-3 pt-2">
								{storedChoices.map((regent) => (
									<button
										type="button"
										key={regent.id}
										className={`w-full text-left p-3 rounded-lg border transition-colors ${
											selectedRegentId === regent.id
												? "border-regent-gold bg-regent-gold/10"
												: "border-border bg-background/50 hover:border-regent-gold/50"
										}`}
										onClick={() => setSelectedRegentId(regent.id)}
									>
										<div className="flex items-center justify-between gap-3">
											<div>
												<p className="font-heading font-semibold text-sm">
													{formatRegentVernacular(regent.title || regent.name)}
												</p>
												<p className="text-xs text-muted-foreground">
													{regent.theme} Theme
												</p>
											</div>
											{selectedRegentId === regent.id && (
												<CheckCircle className="h-4 w-4 text-regent-gold" />
											)}
										</div>
									</button>
								))}
								<Button
									className="w-full bg-regent-gold hover:bg-regent-gold/80 text-background"
									onClick={handleConsume}
									disabled={!selectedRegentId || isConsuming}
								>
									<Crown className="h-4 w-4 mr-2" />
									{isConsuming
										? "ATTUNING..."
										: `ATTUNE ${REGENT_LABEL.toUpperCase()}`}
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}

				{canUnlockSovereign && (
					<div className="p-4 rounded-lg border border-resurge-violet/40 bg-resurge-violet/5">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-resurge-violet" />
							<span className="font-display text-sm text-resurge-violet tracking-wider">
								SOVEREIGN FUSION AVAILABLE
							</span>
						</div>
					</div>
				)}

				{catchUpTarget && (
					<RegentCatchUpModal
						characterId={characterId}
						regentId={catchUpTarget.regentId}
						unlockId={catchUpTarget.unlockId}
						campaignId={campaignId}
						open
						onComplete={() => setCatchUpFor(null)}
					/>
				)}
			</div>
		</AscendantWindow>
	);
}
