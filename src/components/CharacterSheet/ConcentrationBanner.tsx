import { Focus, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface ConcentrationBannerProps {
	isConcentrating: boolean;
	effectName?: string;
	remainingRounds?: number;
	onDrop: () => void;
}

export function ConcentrationBanner({
	isConcentrating,
	effectName,
	remainingRounds,
	onDrop,
}: ConcentrationBannerProps) {
	if (!isConcentrating || !effectName) return null;

	return (
		<div className="flex items-center justify-between rounded-lg border border-violet-300 bg-violet-50/80 px-4 py-2">
			<div className="flex items-center gap-2">
				<Focus className="h-4 w-4 text-violet-600 animate-pulse" />
				<span className="text-sm font-medium text-violet-800">
					Concentrating: <span className="font-semibold">{effectName}</span>
				</span>
				{remainingRounds !== undefined && remainingRounds > 0 && (
					<span className="text-xs text-violet-500">
						({remainingRounds} rounds)
					</span>
				)}
			</div>
			<Button
				size="sm"
				variant="ghost"
				onClick={onDrop}
				className="h-6 w-6 p-0 text-violet-500 hover:text-violet-700"
			>
				<X className="h-3.5 w-3.5" />
				<span className="sr-only">Drop concentration</span>
			</Button>
		</div>
	);
}
