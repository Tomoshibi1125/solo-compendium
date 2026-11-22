import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import {
	companionScalingSummary,
	type ScaledCompanionCombatStats,
} from "@/lib/companionProgression";
import {
	type CompanionActionGroup,
	type CompanionActionSource,
	type MergedCompanionCombat,
	mergeCompanionCombat,
	type ScaledCompanionAction,
	type ScaledCompanionTrait,
} from "@/lib/companionScaling";
import { cn } from "@/lib/utils";

const GROUP_LABELS: Record<CompanionActionGroup, string> = {
	action: "Actions",
	bonus: "Bonus Actions",
	reaction: "Reactions",
	legendary: "Legendary Actions",
};
const GROUPS = Object.keys(GROUP_LABELS) as CompanionActionGroup[];

const SOURCE_LABELS: Record<CompanionActionSource, string> = {
	anomaly: "Anomaly",
	mount: "Mount",
	natural: "Natural weapon",
};

/** `once-per-day` → `Once per day`; `1/round` is unchanged. */
const formatUsage = (value: string) => {
	const spaced = value.replaceAll("-", " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const signed = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

/** Source labels only help when one creature mixes Anomaly and mount entries. */
function hasMixedSources(combat: MergedCompanionCombat): boolean {
	return (
		new Set([
			...combat.actions.map((entry) => entry.source),
			...combat.traits.map((entry) => entry.source),
		]).size > 1
	);
}

function ActionEntry({
	action,
	showSource,
	headingLevel,
}: {
	action: ScaledCompanionAction;
	showSource: boolean;
	headingLevel: "h4" | "h5";
}) {
	const Heading = headingLevel;
	const limits = [
		action.recharge ? `Recharge ${action.recharge}` : null,
		action.frequency ? formatUsage(action.frequency) : null,
	].filter((entry): entry is string => entry !== null);
	return (
		<li className="rounded border border-border/30 p-2">
			<Heading className="font-semibold">
				{action.name}
				{limits.length > 0 && (
					<span className="font-normal text-muted-foreground">
						{" "}
						({limits.join(", ")})
					</span>
				)}
				{showSource && (
					<span className="font-normal text-muted-foreground">
						{" "}
						· {SOURCE_LABELS[action.source]}
					</span>
				)}
			</Heading>
			{(action.attackBonus !== null ||
				action.saveDc !== null ||
				action.damage !== null) && (
				<p className="flex flex-wrap gap-x-3 font-mono">
					{action.attackBonus !== null && (
						<span>Attack {signed(action.attackBonus)}</span>
					)}
					{action.saveDc !== null && <span>Save DC {action.saveDc}</span>}
					{action.damage !== null && (
						<span>
							Damage {action.damage}
							{action.damageType ? ` ${action.damageType}` : ""}
						</span>
					)}
				</p>
			)}
			<p className="mt-1 text-muted-foreground">{action.description}</p>
		</li>
	);
}

function TraitEntry({
	trait,
	showSource,
	headingLevel,
}: {
	trait: ScaledCompanionTrait;
	showSource: boolean;
	headingLevel: "h4" | "h5";
}) {
	const Heading = headingLevel;
	return (
		<li className="rounded border border-border/30 p-2">
			<Heading className="font-semibold">
				{trait.name}
				{trait.frequency && (
					<span className="font-normal text-muted-foreground">
						{" "}
						({formatUsage(trait.frequency)})
					</span>
				)}
				{showSource && (
					<span className="font-normal text-muted-foreground">
						{" "}
						· {SOURCE_LABELS[trait.source]}
					</span>
				)}
			</Heading>
			<p className="mt-1 text-muted-foreground">{trait.description}</p>
		</li>
	);
}

/**
 * Traits and grouped actions of one scaled creature, in stat-block order.
 * Section headings use `headingLevel`; entries use the level below it.
 */
export function CompanionCombatSections({
	combat,
	headingLevel = "h4",
	className,
}: {
	combat: MergedCompanionCombat;
	headingLevel?: "h3" | "h4";
	className?: string;
}) {
	const Heading = headingLevel;
	const entryHeading = headingLevel === "h3" ? "h4" : "h5";
	const showSource = hasMixedSources(combat);
	if (combat.actions.length === 0 && combat.traits.length === 0) {
		return (
			<p className={cn("text-muted-foreground", className)}>
				No authored actions or traits for this creature.
			</p>
		);
	}
	return (
		<div className={cn("space-y-3", className)}>
			{combat.traits.length > 0 && (
				<section aria-label="Traits">
					<Heading className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
						Traits
					</Heading>
					<ul className="space-y-1.5">
						{combat.traits.map((trait) => (
							<TraitEntry
								key={`${trait.source}:${trait.name}`}
								trait={trait}
								showSource={showSource}
								headingLevel={entryHeading}
							/>
						))}
					</ul>
				</section>
			)}
			{GROUPS.map((group) => {
				const entries = combat.actions.filter(
					(action) => action.group === group,
				);
				if (entries.length === 0) return null;
				return (
					<section key={group} aria-label={GROUP_LABELS[group]}>
						<Heading className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
							{GROUP_LABELS[group]}
						</Heading>
						<ul className="space-y-1.5">
							{entries.map((action) => (
								<ActionEntry
									key={`${action.source}:${action.name}`}
									action={action}
									showSource={showSource}
									headingLevel={entryHeading}
								/>
							))}
						</ul>
					</section>
				);
			})}
		</div>
	);
}

/** Collapsible scaled stat block for compact companion and mount cards. */
export function CompanionCombatDetails({
	instance,
	scaling,
}: {
	instance: Pick<CompanionInstanceRecord, "source_collection" | "source_id">;
	scaling: ScaledCompanionCombatStats;
}) {
	const combat = mergeCompanionCombat(instance, scaling);
	return (
		<details
			className="mt-3 rounded border border-border/40 bg-background/20 p-2"
			data-testid="scaled-companion-combat"
		>
			<summary className="cursor-pointer text-xs font-semibold">
				Level {scaling.level} actions and traits
			</summary>
			<div className="mt-2 space-y-2 text-xs">
				<p className="text-muted-foreground">
					{companionScalingSummary(scaling)}
				</p>
				<CompanionCombatSections combat={combat} />
			</div>
		</details>
	);
}
