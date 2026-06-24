import { Gem, X } from "lucide-react";
import { InfoPopover } from "@/components/ui/InfoPopover";
import { MAX_ATTUNEMENT_SLOTS } from "@/hooks/useAttunement";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
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

// Stable per-slot keys (fixed-length positional list) — avoids array-index keys.
const SLOT_INDICES = Array.from({ length: MAX_ATTUNEMENT_SLOTS }, (_, i) => i);

export function AttunementSlots({
	attunedItems,
	slotsRemaining,
	onUnattune,
	characterId,
}: AttunementSlotsProps) {
	const ascendantTools = useAscendantTools();

	const handleUnattune = (item: AttunedItem) => {
		onUnattune(item.id);
		ascendantTools
			.trackInventoryChange(characterId, item.name, "unequip")
			.catch(console.error);
	};
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Gem className="h-4 w-4 text-cyan-500" />
				<span className="text-sm font-medium">Attunement</span>
				<span className="text-xs text-muted-foreground">
					{attunedItems.length}/{MAX_ATTUNEMENT_SLOTS} · {slotsRemaining} free
				</span>
			</div>

			<div className="flex gap-2">
				{SLOT_INDICES.map((slotIndex) => {
					const item = attunedItems[slotIndex];
					return (
						<div
							key={`slot-${slotIndex}`}
							className={cn(
								"h-10 flex-1 min-w-0 rounded-md border-2 border-dashed flex items-center justify-center text-xs transition-colors",
								item
									? "border-cyan-400 bg-cyan-50 text-cyan-800 font-medium"
									: "border-gray-300 bg-gray-50 text-gray-400",
							)}
						>
							{item ? (
								<div className="flex items-center gap-1 px-2 min-w-0">
									<Gem className="h-3 w-3 flex-shrink-0 text-cyan-500" />
									{/* Name is tappable to read the full item name on touch. */}
									<InfoPopover
										side="bottom"
										ariaLabel={`${item.name} details`}
										triggerClassName="truncate text-inherit min-w-0"
										content={`${item.name} — tap × to unattune`}
									>
										<span className="truncate">{item.name}</span>
									</InfoPopover>
									<button
										type="button"
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
					);
				})}
			</div>
		</div>
	);
}
