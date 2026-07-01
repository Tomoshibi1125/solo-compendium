import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { useCharacterGuildBenefits } from "@/hooks/useCharacterGuildBenefits";
import { describeAggregatedGuildEffects } from "@/lib/guildBase";

/**
 * "Guild Benefits" group on the character sheet — the real, applied effects a
 * character gains from their guild's built Base (e.g. a tier-3 War Room's
 * +3 Initiative, Vanguard Tactics' +1 Attack). These are already baked into the
 * computed stats via the custom-modifier pipeline; this card makes the SOURCE
 * legible. Guild-management capabilities (member cap, Forge recipes) live on the
 * guild page, not here, so only personal sheet effects + narrative perks show.
 */
export function GuildBenefitsDisplay({ characterId }: { characterId: string }) {
	const benefits = useCharacterGuildBenefits(characterId);
	const effectLabels = describeAggregatedGuildEffects({
		memberCapBonus: 0,
		craftingOptions: [],
		effects: benefits.effects,
		benefits: [],
	});

	if (effectLabels.length === 0 && benefits.benefits.length === 0) return null;

	return (
		<AscendantWindow title="GUILD BENEFITS">
			<div className="space-y-2">
				{effectLabels.length > 0 && (
					<>
						<div className="flex flex-wrap gap-2">
							{effectLabels.map((label) => (
								<Badge key={label} variant="outline" className="text-xs">
									{label}
								</Badge>
							))}
						</div>
						<p className="text-[11px] text-muted-foreground">
							Applied to your sheet while you fly your guild's banner.
						</p>
					</>
				)}
				{benefits.benefits.map((benefit) => (
					<p key={benefit} className="text-xs text-muted-foreground">
						• {benefit}
					</p>
				))}
			</div>
		</AscendantWindow>
	);
}
