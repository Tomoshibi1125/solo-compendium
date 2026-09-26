import { useQuery } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CompanionScalingDialog } from "@/components/campaign/CompanionScalingDialog";
import { CompanionCombatDetails } from "@/components/character/CompanionCombatDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import { supabase } from "@/integrations/supabase/client";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	companionSourceName,
	companionSourceRank,
	isLevelScaledCompanion,
	scaleCompanionAtLevel,
} from "@/lib/companionScaling";

/** Warden controls for living companions owned by campaign characters, including mounts. */
export function CampaignCharacterCompanionsPanel({
	campaignId,
}: {
	campaignId: string;
}) {
	const { data: roster = [] } = useCampaignSharedCharacters(campaignId);
	const characterIds = useMemo(
		() => [...new Set(roster.map((entry) => entry.character_id))],
		[roster],
	);
	const {
		data: instances = [],
		error,
		isLoading,
	} = useQuery({
		queryKey: [
			"campaign-character-scaled-companions",
			campaignId,
			characterIds,
		],
		enabled: characterIds.length > 0,
		queryFn: async (): Promise<CompanionInstanceRecord[]> => {
			const { data, error: queryError } = await supabase
				.from("companion_instances" as never)
				.select("*")
				.in("owner_character_id", characterIds);
			if (queryError) throw queryError;
			return ((data ?? []) as unknown as CompanionInstanceRecord[]).filter(
				isLevelScaledCompanion,
			);
		},
	});
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = instances.find((entry) => entry.id === selectedId) ?? null;
	const byCharacter = new Map(
		roster.map((entry) => [entry.character_id, entry.characters]),
	);

	return (
		<section className="space-y-3">
			<h3 className="font-heading text-sm font-semibold">
				Character-owned anomaly companions and mounts
			</h3>
			<p className="text-xs text-muted-foreground">
				Every living creature uses its handler's character level. Approve
				per-creature coefficients when the rank defaults need adjustment.
			</p>
			{error && (
				<p className="text-xs text-destructive">
					{error instanceof Error
						? error.message
						: "Could not load character companions."}
				</p>
			)}
			{isLoading && (
				<p className="text-xs text-muted-foreground">
					Loading character companions…
				</p>
			)}
			{!isLoading && !error && instances.length === 0 && (
				<p className="text-xs text-muted-foreground">
					No character-owned anomaly companions or mounts are on this roster.
				</p>
			)}
			<div className="grid gap-3 sm:grid-cols-2">
				{instances.map((instance) => {
					const handler =
						byCharacter.get(
							instance.primary_handler_character_id ??
								instance.rider_character_id ??
								instance.owner_character_id ??
								"",
						) ?? byCharacter.get(instance.owner_character_id ?? "");
					const scaling = scaleCompanionAtLevel(
						handler?.level ?? 1,
						companionSourceRank(instance),
						instance.progression_profile,
					);
					return (
						<Card key={instance.id} className="p-3 border-border bg-black/40">
							<div className="flex items-start justify-between gap-2">
								<div>
									<div className="font-heading text-sm">
										{companionSourceName(instance)}
									</div>
									<div className="text-xs text-muted-foreground">
										{handler?.name ?? "Unassigned handler"} · Level{" "}
										{scaling.level}
									</div>
								</div>
								<Badge variant="outline" className="text-[10px] uppercase">
									{instance.identity_kind}
								</Badge>
							</div>
							<div className="mt-2 text-xs">
								HP {scaling.hpMax} · AC {scaling.baseAc} · Attack +
								{scaling.attackBonus} · DC {scaling.saveDc} ·{" "}
								{scaling.damageDice}
							</div>
							<CompanionCombatDetails instance={instance} scaling={scaling} />
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="mt-2 gap-1 text-xs"
								onClick={() => setSelectedId(instance.id)}
							>
								<Settings2 className="h-3.5 w-3.5" /> Approve scaling
							</Button>
						</Card>
					);
				})}
			</div>
			{selected && (
				<CompanionScalingDialog
					instance={selected}
					campaignId={campaignId}
					open={Boolean(selected)}
					onOpenChange={(open) => {
						if (!open) setSelectedId(null);
					}}
				/>
			)}
		</section>
	);
}
