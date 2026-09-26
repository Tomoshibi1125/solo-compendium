import { Badge } from "@/components/ui/badge";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	mergeCompanionCombat,
	type ScaledCompanionCombatStats,
} from "@/lib/companionScaling";

export function CompanionCombatDetails({
	instance,
	scaling,
}: {
	instance: CompanionInstanceRecord;
	scaling: ScaledCompanionCombatStats;
}) {
	const combat = mergeCompanionCombat(instance, scaling);
	return (
		<details
			className="mt-3 rounded border border-border/40 bg-background/20 p-2"
			data-testid="scaled-companion-combat"
		>
			<summary className="cursor-pointer text-xs font-semibold">
				Level {scaling.level} combat abilities and attacks
			</summary>
			<div className="mt-2 space-y-2 text-xs">
				<p className="text-muted-foreground">
					HP, AC, attack bonus, save DC, and damage scale with the handler's
					level. Source attack numbers are superseded by the values below.
				</p>
				<div className="flex flex-wrap gap-1">
					<Badge variant="outline">Attack +{scaling.attackBonus}</Badge>
					<Badge variant="outline">Save DC {scaling.saveDc}</Badge>
					<Badge variant="outline">Base damage {scaling.damageDice}</Badge>
				</div>
				{combat.actions.map((action) => (
					<div
						key={`${action.owner}:${action.name}:${action.actionType}:${action.description}`}
						className="rounded border border-border/30 p-2"
					>
						<div className="font-semibold">
							{action.name}{" "}
							<span className="font-normal text-muted-foreground">
								· {action.owner === "anomaly" ? "Anomaly" : "Mount"}{" "}
								{action.actionType}
							</span>
						</div>
						<div className="flex flex-wrap gap-x-3">
							{action.attackBonus !== null && (
								<span>Attack +{action.attackBonus}</span>
							)}
							{action.saveDc !== null && <span>Save DC {action.saveDc}</span>}
							{action.damage && (
								<span>
									Damage {action.damage} {action.damageType ?? ""}
								</span>
							)}
							{action.recharge && <span>Recharge {action.recharge}</span>}
						</div>
						<p className="mt-1 text-muted-foreground">{action.description}</p>
					</div>
				))}
				{combat.traits.map((trait) => (
					<div
						key={`${trait.owner}:${trait.name}:${trait.description}`}
						className="rounded border border-border/30 p-2"
					>
						<strong>{trait.name}</strong>{" "}
						<span className="text-muted-foreground">
							· {trait.owner === "anomaly" ? "Anomaly" : "Mount"}
						</span>
						<p className="text-muted-foreground">{trait.description}</p>
					</div>
				))}
				{combat.actions.length === 0 && combat.traits.length === 0 && (
					<p className="text-muted-foreground">
						No authored combat actions or traits for this creature.
					</p>
				)}
			</div>
		</details>
	);
}
