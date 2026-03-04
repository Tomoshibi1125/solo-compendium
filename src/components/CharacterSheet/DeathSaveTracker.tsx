import { Heart, Shield, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { cn } from "@/lib/utils";

interface DeathSaveTrackerProps {
	successes: number;
	failures: number;
	isStable: boolean;
	isDead: boolean;
	hpCurrent: number;
	onRollDeathSave: () => void;
	onStabilize: () => void;
	lastRollResult?: { roll: number; message: string } | null;
}

export function DeathSaveTracker({
	successes,
	failures,
	isStable,
	isDead,
	hpCurrent,
	onRollDeathSave,
	onStabilize,
	lastRollResult,
	characterId,
}: DeathSaveTrackerProps & { characterId: string }) {
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	if (hpCurrent > 0) return null;

	const handleStabilize = () => {
		onStabilize();
		playerTools
			.trackConditionChange(characterId, "Stable", "add")
			.catch(console.error);
	};

	return (
		<div className="rounded-lg border border-red-300 bg-red-50/80 p-4 space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
					<Skull className="h-4 w-4" />
					Death Saving Throws
				</h3>
				{isDead && (
					<span className="text-xs font-bold text-red-600 uppercase tracking-wider">
						Dead
					</span>
				)}
				{isStable && !isDead && (
					<span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
						<Shield className="h-3 w-3" /> Stable
					</span>
				)}
			</div>

			<div className="flex items-center gap-6">
				{/* Successes */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-medium text-green-700">
									Successes
								</span>
								<div className="flex gap-1">
									{[0, 1, 2].map((i) => (
										<div
											key={`s-${i}`}
											className={cn(
												"h-4 w-4 rounded-full border-2 transition-colors",
												i < successes
													? "bg-green-500 border-green-600"
													: "bg-white border-gray-300",
											)}
										/>
									))}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>3 successes = stable</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Failures */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-medium text-red-700">
									Failures
								</span>
								<div className="flex gap-1">
									{[0, 1, 2].map((i) => (
										<div
											key={`f-${i}`}
											className={cn(
												"h-4 w-4 rounded-full border-2 transition-colors",
												i < failures
													? "bg-red-500 border-red-600"
													: "bg-white border-gray-300",
											)}
										/>
									))}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>3 failures = death</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Actions */}
			{!isDead && !isStable && (
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="destructive"
						onClick={onRollDeathSave}
						className="text-xs"
					>
						Roll Death Save
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={handleStabilize}
						className="text-xs"
					>
						<Heart className="h-3 w-3 mr-1" /> Stabilize (Medicine DC 10)
					</Button>
				</div>
			)}

			{/* Last roll result */}
			{lastRollResult && (
				<p className="text-xs text-gray-600 italic">{lastRollResult.message}</p>
			)}
		</div>
	);
}
