import { AlertTriangle, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONDITION_EFFECTS } from "@/lib/conditionEffects";
import { cn } from "@/lib/utils";

const ALL_CONDITIONS = Object.keys(CONDITION_EFFECTS);

const CONDITION_COLORS: Record<string, string> = {
	blinded: "bg-gray-600 text-white",
	charmed: "bg-pink-500 text-white",
	deafened: "bg-gray-500 text-white",
	frightened: "bg-yellow-600 text-white",
	grappled: "bg-orange-600 text-white",
	incapacitated: "bg-red-700 text-white",
	invisible: "bg-indigo-400 text-white",
	paralyzed: "bg-red-800 text-white",
	petrified: "bg-stone-600 text-white",
	poisoned: "bg-green-700 text-white",
	prone: "bg-amber-700 text-white",
	restrained: "bg-orange-800 text-white",
	stunned: "bg-yellow-800 text-white",
	unconscious: "bg-gray-800 text-white",
};

interface ConditionBadgeBarProps {
	conditions: string[];
	onAddCondition: (condition: string) => void;
	onRemoveCondition: (condition: string) => void;
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
		(c) => !conditions.map((x) => x.toLowerCase()).includes(c),
	);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 flex-wrap">
				{conditions.length === 0 && exhaustionLevel === 0 && (
					<span className="text-xs text-muted-foreground">
						No active conditions
					</span>
				)}
				<TooltipProvider>
					{conditions.map((condition) => {
						const key = condition.toLowerCase();
						const info = CONDITION_EFFECTS[key];
						const color = CONDITION_COLORS[key] ?? "bg-gray-500 text-white";

						return (
							<Tooltip key={condition}>
								<TooltipTrigger asChild>
									<Badge
										className={cn("gap-1 cursor-default select-none", color)}
									>
										<AlertTriangle className="h-3 w-3" />
										{info?.name ?? condition}
										<button
											onClick={() => onRemoveCondition(condition)}
											className="ml-0.5 hover:opacity-70"
											aria-label={`Remove ${condition}`}
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="max-w-xs text-left">
									<p className="font-semibold mb-1">
										{info?.name ?? condition}
									</p>
									<p className="text-xs">
										{info?.description ?? "Custom condition."}
									</p>
									{info?.mechanicalEffects.length ? (
										<ul className="mt-1 text-xs list-disc pl-3">
											{info.mechanicalEffects.map((e, i) => (
												<li key={i}>
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
								</TooltipContent>
							</Tooltip>
						);
					})}
					{exhaustionLevel > 0 && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge className="bg-orange-600 text-white gap-1 cursor-default select-none">
									<AlertTriangle className="h-3 w-3" />
									Exhaustion {exhaustionLevel}
									{onClearExhaustion && (
										<button
											onClick={onClearExhaustion}
											className="ml-0.5 hover:opacity-70"
											aria-label="Clear Exhaustion"
										>
											<X className="h-3 w-3" />
										</button>
									)}
								</Badge>
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-xs text-left">
								<p className="font-semibold mb-1">
									Exhaustion Level {exhaustionLevel}
								</p>
								<p className="text-xs mb-1">
									Some special abilities or environments can lead to exhaustion.
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
							</TooltipContent>
						</Tooltip>
					)}
				</TooltipProvider>

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
