import { Crown, Layers, Sparkles } from "lucide-react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";
import { RegentFeaturesDisplay } from "./RegentFeaturesDisplay";
import { RegentUnlocksPanel } from "./RegentUnlocksPanel";

interface RegentStatusViewProps {
	characterId: string;
	characterLevel: number;
	job?: string | null;
	path?: string | null;
	campaignId?: string;
}

/**
 * Standalone "Regent Status" tool: an at-a-glance overview of a character's
 * regent archetype + sovereign-fusion readiness, composed from the existing
 * deep regent components (unlock management + the primary regent's domains &
 * powers). No new domain logic — it reuses {@link useRegentUnlocks},
 * {@link RegentUnlocksPanel} and {@link RegentFeaturesDisplay}.
 */
export function RegentStatusView({
	characterId,
	characterLevel,
	job,
	path,
	campaignId,
}: RegentStatusViewProps) {
	const { unlocks } = useRegentUnlocks(characterId);
	// The Regent overlay tracks the character's level (gestalt), so surface the
	// primary unlock's domains/powers; fall back to the first unlock.
	const primary = unlocks.find((u) => u.is_primary) ?? unlocks[0];
	const primaryRegent = primary?.regent;
	const canFuse = !!job && !!path && unlocks.length >= 2;

	return (
		<div className="space-y-6">
			<AscendantWindow
				title={`${REGENT_LABEL.toUpperCase()} OVERVIEW`}
				variant="regent"
				className="border-regent-gold/30"
			>
				<div className="space-y-5">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-regent-gold/15 text-regent-gold">
								<Crown className="h-6 w-6" />
							</div>
							<div className="space-y-1">
								<p className="ra-heading-3 text-regent-gold">
									{primaryRegent
										? formatRegentVernacular(
												primaryRegent.title || primaryRegent.name,
											)
										: `No ${REGENT_LABEL} Overlay`}
								</p>
								<p className="text-sm text-muted-foreground">
									{primaryRegent
										? `${formatRegentVernacular(primaryRegent.theme)} domain`
										: `Complete ${REGENT_LABEL} quests to awaken an overlay`}
								</p>
							</div>
						</div>
						<Badge
							variant="outline"
							className="border-regent-gold/40 text-regent-gold"
						>
							{unlocks.length} / 2 {REGENT_LABEL_PLURAL} unlocked
						</Badge>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div className="rounded-lg border border-primary/10 bg-black/30 p-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Archetype
							</p>
							<p className="mt-1 text-sm font-heading text-foreground">
								{formatRegentVernacular(job || "Unawakened")}
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-black/30 p-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Path
							</p>
							<p className="mt-1 text-sm font-heading text-foreground">
								{path ? formatRegentVernacular(path) : "Unset"}
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-black/30 p-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Sovereign Fusion
							</p>
							<p className="mt-1 flex items-center gap-1.5 text-sm font-heading">
								{canFuse ? (
									<>
										<Sparkles className="h-4 w-4 text-resurge-violet" />
										<span className="text-resurge-violet">Available</span>
									</>
								) : (
									<>
										<Layers className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">
											Needs Job + Path + 2 {REGENT_LABEL_PLURAL}
										</span>
									</>
								)}
							</p>
						</div>
					</div>
				</div>
			</AscendantWindow>

			{/* Unlock management + sovereign-ready badge (single source of truth). */}
			<RegentUnlocksPanel characterId={characterId} campaignId={campaignId} />

			{/* Primary regent's domains & powers, advancing at character level. */}
			<RegentFeaturesDisplay
				characterId={characterId}
				characterLevel={characterLevel}
				regentId={primaryRegent?.id ?? primary?.regent_id}
			/>
		</div>
	);
}
