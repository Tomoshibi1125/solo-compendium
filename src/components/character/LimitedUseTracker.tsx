import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useFeatures } from "@/hooks/useFeatures";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { useCharacterRuneInscriptions } from "@/hooks/useRunes";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface LimitedUseTrackerProps {
	characterId: string;
}

export function LimitedUseTracker({ characterId }: LimitedUseTrackerProps) {
	const queryClient = useQueryClient();
	const { features, updateFeature } = useFeatures(characterId);
	const { data: runeInscriptions = [] } =
		useCharacterRuneInscriptions(characterId);

	// D&D Beyond Parity Integration
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();
	const recordRoll = useRecordRoll();
	const { data: characterCampaign } = useCampaignByCharacterId(characterId);
	const campaignId = characterCampaign?.id ?? null;
	const { broadcastDiceRoll, isConnected: isCampaignConnected } =
		useRealtimeCollaboration(campaignId || "");

	// Custom mutation for updating rune usages up or down (bypassing useUseRune which only decrements)
	const updateRuneUses = useMutation({
		mutationFn: async ({
			id,
			usesCurrent,
		}: {
			id: string;
			usesCurrent: number;
		}) => {
			const { error } = await supabase
				.from("character_rune_inscriptions")
				.update({ uses_current: usesCurrent })
				.eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-inscriptions", characterId],
			});
			queryClient.invalidateQueries({ queryKey: ["equipment-runes"] });
		},
	});

	const limitedFeatures = features.filter((f) => f.uses_max !== null);
	const limitedRunes = runeInscriptions.filter(
		(r) => r.uses_max !== null && r.is_active,
	);

	const hasAnyUses = limitedFeatures.length > 0 || limitedRunes.length > 0;

	if (!hasAnyUses) return null;

	const handleFeatureToggle = (
		id: string,
		usesMax: number,
		currentUses: number | null,
		indexToToggle: number,
	) => {
		// indexToToggle is 0-based. If currentUses is e.g. 2, boxes 0 and 1 are empty (used),
		// and boxes 2,3 etc are filled (unused). Wait, DDB typical is: click box to check it off.
		// Let's do: boxes represent usages *spent*.
		// If a box is clicked, we calculate the new uses_current.
		// Or simpler: boxes represent usages *remaining*.
		// Let's adopt uses_current as number of boxes filled/available.
		const actualCurrent = currentUses ?? usesMax; // defaulting

		// If clicking on an empty box (i > actualCurrent - 1), it means we want to gain uses up to that box
		// If clicking on a filled box, we want to decrease uses down to that box
		let newUses = actualCurrent;

		// Convert 0-based index to 1-based number of uses
		const targetUses = indexToToggle + 1;

		if (actualCurrent === targetUses) {
			// Toggling the top-most active box turns it off
			newUses = targetUses - 1;
		} else {
			// Otherwise set uses exactly to this box
			newUses = targetUses;
		}

		updateFeature({ id, updates: { uses_current: newUses } });

		// DDB Parity: Broadcast usage
		const featureDetails = limitedFeatures.find((f) => f.id === id);
		if (featureDetails) {
			const isSpending = newUses < actualCurrent;
			const actionType = isSpending ? "spend" : "regain";
			playerTools
				.trackCustomFeatureUsage(
					characterId,
					featureDetails.name,
					actionType,
					"5e",
				)
				.catch(console.error);

			if (isSpending) {
				const scope = campaignId && isCampaignConnected ? "campaign" : "local";
				recordRoll.mutate({
					dice_formula: "Feature Tracker",
					result: 0,
					rolls: [],
					roll_type: "ability",
					context: `Uses ${featureDetails.name}`,
					modifiers: null,
					campaign_id: campaignId ?? null,
					character_id: characterId,
				});

				if (scope === "campaign") {
					broadcastDiceRoll("Feature Tracker", 0, {
						characterName: "Character", // Prop fallback
						rollType: "ability",
						context: `Uses ${featureDetails.name}`,
						rolls: [],
					});
				}
			}
		}
	};

	const handleRuneToggle = (
		id: string,
		usesMax: number,
		currentUses: number | null,
		indexToToggle: number,
	) => {
		const actualCurrent = currentUses ?? usesMax;
		const targetUses = indexToToggle + 1;

		let newUses = actualCurrent;
		if (actualCurrent === targetUses) {
			newUses = targetUses - 1;
		} else {
			newUses = targetUses;
		}

		updateRuneUses.mutate({ id, usesCurrent: newUses });

		// DDB Parity: Broadcast usage
		const runeDetails = limitedRunes.find((r) => r.id === id);
		if (runeDetails?.rune) {
			const isSpending = newUses < actualCurrent;
			const actionType = isSpending ? "spend" : "regain";
			playerTools
				.trackCustomFeatureUsage(
					characterId,
					runeDetails.rune.name,
					actionType,
					"SA",
				)
				.catch(console.error);

			if (isSpending) {
				const scope = campaignId && isCampaignConnected ? "campaign" : "local";
				recordRoll.mutate({
					dice_formula: "Rune Tracker",
					result: 0,
					rolls: [],
					roll_type: "ability",
					context: `Uses Rune: ${runeDetails.rune.name}`,
					modifiers: null,
					campaign_id: campaignId ?? null,
					character_id: characterId,
				});

				if (scope === "campaign") {
					broadcastDiceRoll("Rune Tracker", 0, {
						characterName: "Character", // Prop fallback
						rollType: "ability",
						context: `Uses Rune: ${runeDetails.rune.name}`,
						rolls: [],
					});
				}
			}
		}
	};

	return (
		<SystemWindow title="LIMITED USE" compact>
			<div className="space-y-4 pt-4">
				{limitedFeatures.map((feature) => (
					<div
						key={feature.id}
						className="flex flex-col gap-1.5 border-b border-white/5 pb-3"
					>
						<div className="flex justify-between items-end">
							<span className="text-sm font-semibold capitalize text-foreground">
								{feature.name}
							</span>
							{feature.recharge && (
								<span className="text-[10px] text-muted-foreground uppercase">
									{feature.recharge}
								</span>
							)}
						</div>
						<div className="flex flex-wrap gap-1.5 mt-1">
							{Array.from({ length: feature.uses_max! }).map((_, i) => (
								<button
									key={i}
									aria-label={`Toggle use ${i + 1} of ${feature.name}`}
									className={cn(
										"w-5 h-5 rounded border flex items-center justify-center transition-all",
										i < (feature.uses_current ?? feature.uses_max!)
											? "bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30" // Available
											: "bg-background border-white/10 text-transparent hover:border-white/30", // Used
									)}
									onClick={() =>
										handleFeatureToggle(
											feature.id,
											feature.uses_max!,
											feature.uses_current,
											i,
										)
									}
								>
									<div
										className={cn(
											"w-2.5 h-2.5 rounded-sm transition-transform",
											i < (feature.uses_current ?? feature.uses_max!)
												? "bg-cyan-400 scale-100"
												: "scale-0",
										)}
									/>
								</button>
							))}
						</div>
					</div>
				))}

				{limitedRunes.map((entry) => (
					<div
						key={entry.id}
						className="flex flex-col gap-1.5 border-b border-white/5 pb-3 last:border-0 last:pb-0"
					>
						<div className="flex justify-between items-end">
							<span className="text-sm font-semibold capitalize text-amethyst-purple">
								{entry.rune?.name} (Rune)
							</span>
						</div>
						<div className="flex flex-wrap gap-1.5 mt-1">
							{Array.from({ length: entry.uses_max! }).map((_, i) => (
								<button
									key={i}
									aria-label={`Toggle use ${i + 1} of ${entry.rune?.name}`}
									className={cn(
										"w-5 h-5 rounded border flex items-center justify-center transition-all",
										i < (entry.uses_current ?? entry.uses_max!)
											? "bg-amethyst-purple/20 border-amethyst-purple text-amethyst-purple hover:bg-amethyst-purple/30" // Available
											: "bg-background border-white/10 text-transparent hover:border-white/30", // Used
									)}
									onClick={() =>
										handleRuneToggle(
											entry.id,
											entry.uses_max!,
											entry.uses_current,
											i,
										)
									}
								>
									<div
										className={cn(
											"w-2.5 h-2.5 rounded-sm transition-transform",
											i < (entry.uses_current ?? entry.uses_max!)
												? "bg-amethyst-purple scale-100"
												: "scale-0",
										)}
									/>
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</SystemWindow>
	);
}
