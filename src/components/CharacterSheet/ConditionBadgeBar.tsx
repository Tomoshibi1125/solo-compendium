import { AlertTriangle, Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoPopover } from "@/components/ui/InfoPopover";
import { CONDITION_EFFECTS } from "@/lib/conditionEffects";
import type { ConditionEntry } from "@/lib/conditionSystem";
import { cn } from "@/lib/utils";

const ALL_CONDITIONS = Object.keys(CONDITION_EFFECTS);

const CONDITION_COLORS: Record<string, string> = {
	blinded: "bg-gray-600 text-white",
	charmed: "bg-resurge-violet text-white",
	deafened: "bg-gray-500 text-white",
	frightened: "bg-gate-s text-white",
	grappled: "bg-gate-a text-white",
	incapacitated: "bg-red-700 text-white",
	invisible: "bg-hunter-blue text-white",
	paralyzed: "bg-red-800 text-white",
	petrified: "bg-stone-600 text-white",
	poisoned: "bg-green-700 text-white",
	prone: "bg-gate-s/25 text-white",
	restrained: "bg-gate-a/25 text-white",
	stunned: "bg-gate-s/25 text-white",
	unconscious: "bg-gray-800 text-white",
};

interface ConditionBadgeBarProps {
	conditions: ConditionEntry[];
	onAddCondition: (conditionName: string) => void;
	onRemoveCondition: (conditionId: string) => void;
	exhaustionLevel?: number;
	onClearExhaustion?: () => void;
}

export function ConditionBadgeBar({
	conditions,
	onAddCondition,
	onRemoveCondition,
	exhaustionLevel = 0,
	onClearExhaustion,
}: ConditionBadgeBarProps) {
	const [showPicker, setShowPicker] = useState(false);

	const available = ALL_CONDITIONS.filter(
		(c) => !conditions.map((x) => x.conditionName.toLowerCase()).includes(c),
	);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 flex-wrap">
				{conditions.length === 0 && exhaustionLevel === 0 && (
					<span className="text-xs text-muted-foreground">
						No active conditions
					</span>
				)}
				{conditions.map((condition) => {
					const key = condition.conditionName.toLowerCase();
					const info = CONDITION_EFFECTS[key];
					const color = CONDITION_COLORS[key] ?? "bg-gray-500 text-white";

					return (
						<Badge
							key={condition.id}
							className={cn("gap-1 select-none", color)}
						>
							{/* Name is tappable (touch) / hoverable (desktop) for effects. */}
							<InfoPopover
								side="bottom"
								ariaLabel={`${info?.name ?? condition.conditionName} effects`}
								triggerClassName="gap-1 text-inherit"
								className="max-w-xs text-left"
								content={
									<>
										<p className="font-semibold mb-1">
											{info?.name ?? condition.conditionName}
										</p>
										{condition.sourceName && (
											<p className="text-[10px] text-muted-foreground mb-1 italic">
												Source: {condition.sourceName}
											</p>
										)}
										{condition.remainingRounds !== null && (
											<p className="text-[10px] text-primary/60 mb-1">
												{condition.remainingRounds} rounds remaining
											</p>
										)}
										<p className="text-xs">
											{info?.description ?? "Custom condition."}
										</p>
										{info?.mechanicalEffects.length ? (
											<ul className="mt-1 text-xs list-disc pl-3">
												{info.mechanicalEffects.map((e, _i) => (
													<li key={JSON.stringify(e)}>
														{e.type === "disadvantage" &&
															`Disadvantage on ${e.target.replace(/_/g, " ")}`}
														{e.type === "advantage" &&
															`Advantage on ${e.target.replace(/_/g, " ")}`}
														{e.type === "auto_fail" &&
															`Auto-fail ${e.target.replace(/_/g, " ")}`}
														{e.type === "speed_zero" && "Speed becomes 0"}
														{e.type === "incapacitated" &&
															"Cannot take actions or reactions"}
													</li>
												))}
											</ul>
										) : null}
									</>
								}
							>
								<AlertTriangle className="h-3 w-3" />
								{info?.name ?? condition.conditionName}
							</InfoPopover>
							<button
								type="button"
								onClick={() => onRemoveCondition(condition.id)}
								className="ml-0.5 hover:opacity-70"
								aria-label={`Remove ${condition.conditionName}`}
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					);
				})}
				{exhaustionLevel > 0 && (
					<Badge className="bg-gate-a text-white gap-1 select-none">
						<InfoPopover
							side="bottom"
							ariaLabel={`Exhaustion level ${exhaustionLevel} effects`}
							triggerClassName="gap-1 text-inherit"
							className="max-w-xs text-left"
							content={
								<>
									<p className="font-semibold mb-1">
										Exhaustion Level {exhaustionLevel}
									</p>
									<p className="text-xs mb-1">
										Some special abilities or environments can lead to
										exhaustion.
									</p>
									<ul className="text-xs list-disc pl-3">
										{exhaustionLevel >= 1 && (
											<li>Disadvantage on ability checks</li>
										)}
										{exhaustionLevel >= 2 && <li>Speed halved</li>}
										{exhaustionLevel >= 3 && (
											<li>Disadvantage on attack rolls and saving throws</li>
										)}
										{exhaustionLevel >= 4 && <li>Hit point maximum halved</li>}
										{exhaustionLevel >= 5 && <li>Speed reduced to 0</li>}
										{exhaustionLevel >= 6 && <li>Death</li>}
									</ul>
								</>
							}
						>
							<AlertTriangle className="h-3 w-3" />
							Exhaustion {exhaustionLevel}
						</InfoPopover>
						{onClearExhaustion && (
							<button
								type="button"
								onClick={onClearExhaustion}
								className="ml-0.5 hover:opacity-70"
								aria-label="Clear Exhaustion"
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</Badge>
				)}

				<Button
					size="sm"
					variant="ghost"
					className="h-6 px-2 text-xs"
					onClick={() => setShowPicker(!showPicker)}
				>
					<Plus className="h-3 w-3 mr-1" /> Add
				</Button>
			</div>

			{showPicker && (
				<div className="flex flex-wrap gap-1 rounded-md border p-2 bg-background">
					{available.map((c) => (
						<Button
							key={c}
							size="sm"
							variant="outline"
							className="h-6 px-2 text-xs capitalize"
							onClick={() => {
								onAddCondition(c);
								setShowPicker(false);
							}}
						>
							{CONDITION_EFFECTS[c]?.name ?? c}
						</Button>
					))}
					{available.length === 0 && (
						<span className="text-xs text-muted-foreground">
							All conditions active
						</span>
					)}
				</div>
			)}
		</div>
	);
}
