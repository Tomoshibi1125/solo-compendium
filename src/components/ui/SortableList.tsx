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

interface DndTransform {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
}

function hasId(obj: unknown): obj is { id: string | number } {
	return obj !== null && typeof obj === "object" && "id" in obj;
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

	const dndTransform = transform as DndTransform | null;

	const style: React.CSSProperties = {
		transform: dndTransform ? CSS.Transform.toString(dndTransform) : undefined,
		transition: typeof transition === "string" ? transition : undefined,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn("relative group", isDragging && "z-50", className)}
		>
			{!disabled && !!attributes && !!listeners && (
				<button
					type="button"
					{...attributes}
					{...listeners}
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

		if (hasId(over) && hasId(active) && active.id !== over.id) {
			const activeId = String(active.id);
			const overId = String(over.id);
			const oldIndex = items.findIndex((item) => item.id === activeId);
			const newIndex = items.findIndex((item) => item.id === overId);
			if (oldIndex !== -1 && newIndex !== -1) {
				const newOrder = arrayMove(items, oldIndex, newIndex);
				onReorder(newOrder);
			}
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
