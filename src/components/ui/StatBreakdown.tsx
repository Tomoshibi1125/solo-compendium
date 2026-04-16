import type React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatModifier } from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";

export interface ModifierSource {
	source: string;
	value: number;
}

interface StatBreakdownProps {
	label: string;
	total: number;
	breakdown: ModifierSource[];
	children: React.ReactNode;
}

export function StatBreakdown({
	label,
	total,
	breakdown,
	children,
}: StatBreakdownProps) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="outline-none focus:ring-2 focus:ring-primary/50 group block w-full text-left"
					>
						{children}
					</button>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					className="bg-obsidian-charcoal border border-primary/20 p-3 min-w-[200px]"
					sideOffset={8}
				>
					<div className="flex flex-col gap-2">
						<h4 className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest border-b border-primary/20 pb-1 mb-1">
							{label} Breakdown
						</h4>
						<div className="flex flex-col gap-1">
							{breakdown.map((item) => (
								<div
									key={`${item.source}-${item.value}`}
									className="flex justify-between items-center"
								>
									<span className="text-xs font-mono text-muted-foreground">
										{item.source}
									</span>
									<span
										className={cn(
											"text-xs font-mono text-white",
											item.value > 0
												? "text-emerald-400"
												: item.value < 0
													? "text-red-400"
													: "",
										)}
									>
										{item.value >= 0 ? "+" : ""}
										{item.value}
									</span>
								</div>
							))}
						</div>
						<div className="flex justify-between items-center border-t border-primary/20 pt-2 mt-1">
							<span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
								Total
							</span>
							<span className="text-sm font-display font-bold text-primary">
								{formatModifier(total)}
							</span>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
