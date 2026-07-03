import { useVirtualizer } from "@tanstack/react-virtual";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

type VirtualizedListProps<T> = {
	items: T[];
	renderItem: (item: T, index: number) => ReactNode;
	getItemKey: (item: T, index: number) => string | number;
	/** Rough row height in px; rows self-measure after mount. */
	estimateSize?: number;
	/** Gap between rows in px (replaces space-y utilities). */
	gap?: number;
	className?: string;
};

/**
 * Windowed vertical list for long result sets (add-dialogs, pickers).
 * Only the visible rows exist in the DOM; rows self-measure, so variable
 * heights (descriptions, badge wrapping) work without configuration.
 * The component owns its scroll container — give it a height via className
 * (e.g. flex-1 min-h-0).
 */
export function VirtualizedList<T>({
	items,
	renderItem,
	getItemKey,
	estimateSize = 96,
	gap = 8,
	className,
}: VirtualizedListProps<T>) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: () => estimateSize,
		gap,
		overscan: 6,
		getItemKey: (index) => getItemKey(items[index], index),
	});

	return (
		<div ref={scrollRef} className={cn("overflow-y-auto", className)}>
			<div
				className="relative w-full"
				style={{ height: virtualizer.getTotalSize() }}
			>
				{virtualizer.getVirtualItems().map((virtualRow) => (
					<div
						key={virtualRow.key}
						ref={virtualizer.measureElement}
						data-index={virtualRow.index}
						className="absolute inset-x-0 top-0"
						style={{ transform: `translateY(${virtualRow.start}px)` }}
					>
						{renderItem(items[virtualRow.index], virtualRow.index)}
					</div>
				))}
			</div>
		</div>
	);
}
