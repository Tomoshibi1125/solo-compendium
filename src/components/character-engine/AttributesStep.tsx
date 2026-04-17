import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

interface AttributesStepProps {
	abilityMethod: "standard" | "point-buy" | "manual";
	setAbilityMethod: (method: "standard" | "point-buy" | "manual") => void;
	abilities: Record<AbilityScore, number>;
	setAbilities: (abilities: Record<AbilityScore, number>) => void;
	effectiveAbilities: Record<AbilityScore, number>;
	rolledStats: { id: string; value: number }[];
	setRolledStats: (stats: { id: string; value: number }[]) => void;
	handleStandardArray: () => void;
	handleRollStats: () => void;
	pointBuyRemaining: number;
	pointBuyTotal: number;
	getPointBuyCost: (score: number) => number;
}

export const AttributesStep: React.FC<AttributesStepProps> = ({
	abilityMethod,
	setAbilityMethod,
	abilities,
	setAbilities,
	effectiveAbilities,
	rolledStats,
	setRolledStats,
	handleStandardArray,
	handleRollStats,
	pointBuyRemaining,
	pointBuyTotal,
	getPointBuyCost,
}) => {
	const { toast } = useToast();

	const handleAbilityChange = (ability: AbilityScore, rawValue: string) => {
		const raw = parseInt(rawValue, 10);
		const fallback = abilityMethod === "manual" ? 3 : 8;
		let value = Number.isNaN(raw) ? fallback : raw;

		if (abilityMethod === "point-buy") {
			value = Math.max(8, Math.min(15, value));
			const currentSpent = Object.values(abilities).reduce(
				(sum, s) => sum + getPointBuyCost(s),
				0,
			);
			const nextSpent =
				currentSpent -
				getPointBuyCost(abilities[ability]) +
				getPointBuyCost(value);

			if (nextSpent > pointBuyTotal) {
				toast({
					title: "Point-buy limit reached",
					description: `You only have ${pointBuyTotal} points to spend.`,
					variant: "destructive",
				});
				return;
			}
		}

		setAbilities({ ...abilities, [ability]: value });
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL CALIBRATION: ATTRIBUTE ALLOCATION">
				<div className="space-y-6">
					<div className="flex flex-wrap gap-2">
						<Button
							variant={abilityMethod === "standard" ? "default" : "outline"}
							onClick={() => {
								setAbilityMethod("standard");
								handleStandardArray();
							}}
							className="h-9 px-4 text-xs uppercase tracking-wider"
						>
							Standard Array
						</Button>
						<Button
							variant={abilityMethod === "point-buy" ? "default" : "outline"}
							onClick={() => setAbilityMethod("point-buy")}
							className="h-9 px-4 text-xs uppercase tracking-wider"
						>
							Point Buy ({pointBuyTotal})
						</Button>
						<Button
							variant={abilityMethod === "manual" ? "default" : "outline"}
							onClick={() => {
								setAbilityMethod("manual");
								setRolledStats([]);
							}}
							className="h-9 px-4 text-xs uppercase tracking-wider"
						>
							Manual / Rolled
						</Button>
					</div>

					{abilityMethod === "point-buy" && (
						<div
							className={cn(
								"p-3 rounded border text-sm font-heading flex justify-between items-center",
								pointBuyRemaining < 0
									? "bg-destructive/10 border-destructive/20 text-destructive"
									: "bg-primary/5 border-primary/10 text-primary/80",
							)}
						>
							<span className="uppercase tracking-widest text-[10px]">
								Neural Capacitance Remaining
							</span>
							<span className="text-lg font-bold">
								{pointBuyRemaining} / {pointBuyTotal}
							</span>
						</div>
					)}

					{abilityMethod === "manual" && (
						<div className="space-y-4 p-4 rounded bg-black/40 border border-primary/10">
							<div className="flex flex-wrap gap-4 items-center">
								<Button
									variant="outline"
									onClick={handleRollStats}
									className="h-8 text-[10px] uppercase"
								>
									Execute 4D6 Protocol (Drop Lowest)
								</Button>
								{rolledStats.length > 0 && (
									<div className="text-xs font-heading text-primary/60">
										Available Nodes:{" "}
										{rolledStats.map((s) => s.value).join(", ")}
									</div>
								)}
							</div>
							{rolledStats.length > 0 && (
								<div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
									{rolledStats.map((stat) => (
										<div key={stat.id} className="space-y-1">
											<Label className="text-[9px] uppercase opacity-50">
												Node {rolledStats.indexOf(stat) + 1}
											</Label>
											<Input
												type="number"
												value={stat.value}
												onChange={(e) => {
													const val = parseInt(e.target.value, 10) || 0;
													const idx = rolledStats.indexOf(stat);
													const newStats = [...rolledStats];
													newStats[idx] = { ...newStats[idx], value: val };
													setRolledStats(newStats);
												}}
												className="h-8 text-center text-xs bg-black/60"
											/>
										</div>
									))}
								</div>
							)}
							<AscendantText className="block text-[10px] text-muted-foreground italic">
								Allocate manual entries or roll to generate raw data packets.
								Then assign to primary attributes below.
							</AscendantText>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
							const modifier = Math.floor(
								(effectiveAbilities[ability] - 10) / 2,
							);

							return (
								<div
									key={ability}
									className="p-4 rounded-lg bg-black/40 border border-primary/5 hover:border-primary/20 transition-all space-y-3"
								>
									<div className="flex justify-between items-end">
										<Label className="text-xs uppercase font-bold tracking-widest text-primary/90">
											{ABILITY_NAMES[ability]}
										</Label>
										<div className="text-lg font-heading font-bold text-primary">
											{modifier >= 0 ? `+${modifier}` : modifier}
										</div>
									</div>

									{abilityMethod === "manual" && rolledStats.length > 0 && (
										<div className="flex flex-wrap gap-1 mb-2">
											{rolledStats.map((stat, index) => (
												<Button
													key={stat.id}
													variant="outline"
													size="sm"
													className="text-[9px] h-5 px-1.5 opacity-60 hover:opacity-100"
													onClick={() => {
														setAbilities({
															...abilities,
															[ability]: stat.value,
														});
														const newStats = rolledStats.filter(
															(_, i) => i !== index,
														);
														setRolledStats(newStats);
													}}
												>
													{stat.value}
												</Button>
											))}
										</div>
									)}

									<Input
										type="number"
										value={abilities[ability]}
										onChange={(e) =>
											handleAbilityChange(ability, e.target.value)
										}
										className="h-10 text-center font-heading text-lg bg-black/60 border-primary/10"
									/>

									<div className="text-[10px] text-foreground/70 uppercase flex justify-between font-medium">
										<span>Base: {abilities[ability]}</span>
										<span className="text-primary/70">
											Effective: {effectiveAbilities[ability]}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</AscendantWindow>
		</div>
	);
};
