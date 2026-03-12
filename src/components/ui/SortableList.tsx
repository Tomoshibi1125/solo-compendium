import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

interface SortableItemProps {
	id: string;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
}

function SortableItem({
	id,
	children,
	disabled,
	className,
}: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled });

	const style = {
		transform: CSS.Transform.toString(transform as never),
		transition: transition as never,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn("relative group", isDragging && "z-50", className)}
		>
			{!disabled && (
				<button
					type="button"
					{...(attributes as Record<string, unknown>)}
					{...(listeners as Record<string, unknown>)}
					className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
					aria-label="Drag to reorder"
				>
					<GripVertical className="w-4 h-4 text-muted-foreground" />
				</button>
			)}
			{children}
		</div>
	);
}

interface SortableListProps<T extends { id: string }> {
	items: T[];
	onReorder: (newOrder: T[]) => void;
	renderItem: (item: T, index: number) => React.ReactNode;
	disabled?: boolean;
	className?: string;
	itemClassName?: string;
}

export function SortableList<T extends { id: string }>({
	items,
	onReorder,
	renderItem,
	disabled = false,
	className,
	itemClassName,
}: SortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && String((active as { id: string }).id) !== String((over as { id: string }).id)) {
			const oldIndex = items.findIndex(
				(item) => item.id === String((active as { id: string }).id),
			);
			const newIndex = items.findIndex((item) => item.id === String((over as { id: string }).id));
			const newOrder = arrayMove(items, oldIndex, newIndex);
			onReorder(newOrder);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((item) => item.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className={className}>
					{items.map((item, index) => (
						<SortableItem
							key={item.id}
							id={item.id}
							disabled={disabled}
							className={itemClassName}
						>
							{renderItem(item, index)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
