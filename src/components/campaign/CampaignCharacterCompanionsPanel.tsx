import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CompanionCombatDetails } from "@/components/character/CompanionCombatDetails";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCampaignSharedCharacters } from "@/hooks/useCampaignCharacters";
import { supabase } from "@/integrations/supabase/client";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	companionScalingCharacterId,
	companionSourceName,
	isLevelScaledCompanion,
	scaleCompanionInstance,
} from "@/lib/companionScaling";

/** Read-only view of the scaled companions and mounts the party's characters own. */
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
	const byCharacter = new Map(
		roster.map((entry) => [entry.character_id, entry.characters]),
	);

	return (
		<section className="space-y-3">
			<h3 className="font-heading text-sm font-semibold">
				Party companions and mounts
			</h3>
			<p className="text-xs text-muted-foreground">
				Each companion belongs to its character and scales with that character's
				level.
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
					No character on this roster has a scaled companion or mount.
				</p>
			)}
			<div className="grid gap-3 sm:grid-cols-2">
				{instances.map((instance) => {
					const owner = byCharacter.get(
						companionScalingCharacterId(instance) ?? "",
					);
					const scaling = scaleCompanionInstance(instance, owner?.level);
					if (!scaling) return null;
					return (
						<Card key={instance.id} className="p-3 border-border bg-black/40">
							<div className="flex items-start justify-between gap-2">
								<div>
									<div className="font-heading text-sm">
										{companionSourceName(instance)}
									</div>
									<div className="text-xs text-muted-foreground">
										{owner?.name ?? "Unknown owner"} · Level {scaling.level}
									</div>
								</div>
								<Badge variant="outline" className="text-[10px] uppercase">
									{instance.identity_kind === "mount" ? "Mount" : "Companion"}
								</Badge>
							</div>
							<div className="mt-2 text-xs">
								HP {scaling.hpMax} ({scaling.hitDice}) · AC {scaling.baseAc} ·
								Attack +{scaling.attackBonus} · DC {scaling.saveDc}
							</div>
							<CompanionCombatDetails instance={instance} scaling={scaling} />
						</Card>
					);
				})}
			</div>
		</section>
	);
}
