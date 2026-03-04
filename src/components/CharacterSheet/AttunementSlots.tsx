import { Gem, X } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAX_ATTUNEMENT_SLOTS } from "@/hooks/useAttunement";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { cn } from "@/lib/utils";

interface AttunedItem {
	id: string;
	name: string;
	requiresAttunement: boolean;
	isAttuned: boolean;
}

interface AttunementSlotsProps {
	attunedItems: AttunedItem[];
	slotsRemaining: number;
	onUnattune: (itemId: string) => void;
	characterId: string;
}

export function AttunementSlots({
	attunedItems,
	slotsRemaining,
	onUnattune,
	characterId,
}: AttunementSlotsProps) {
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	const handleUnattune = (item: AttunedItem) => {
		onUnattune(item.id);
		playerTools
			.trackInventoryChange(characterId, item.name, "unequip")
			.catch(console.error);
	};
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Gem className="h-4 w-4 text-cyan-500" />
				<span className="text-sm font-medium">Attunement</span>
				<span className="text-xs text-muted-foreground">
					{attunedItems.length}/{MAX_ATTUNEMENT_SLOTS}
				</span>
			</div>

			<div className="flex gap-2">
				{Array.from({ length: MAX_ATTUNEMENT_SLOTS }).map((_, i) => {
					const item = attunedItems[i];
					return (
						<TooltipProvider key={i}>
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={cn(
											"h-10 flex-1 rounded-md border-2 border-dashed flex items-center justify-center text-xs transition-colors",
											item
												? "border-cyan-400 bg-cyan-50 text-cyan-800 font-medium"
												: "border-gray-300 bg-gray-50 text-gray-400",
										)}
									>
										{item ? (
											<div className="flex items-center gap-1 px-2 truncate">
												<Gem className="h-3 w-3 flex-shrink-0 text-cyan-500" />
												<span className="truncate">{item.name}</span>
												<button
													onClick={() => handleUnattune(item)}
													className="flex-shrink-0 hover:text-red-500 transition-colors"
													aria-label={`Unattune ${item.name}`}
												>
													<X className="h-3 w-3" />
												</button>
											</div>
										) : (
											"Empty"
										)}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									{item
										? `${item.name} — click × to unattune`
										: `Empty attunement slot (${slotsRemaining} remaining)`}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				})}
			</div>
		</div>
	);
}
