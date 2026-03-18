// Type declarations for @dnd-kit modules
declare module "@dnd-kit/core" {
	export interface DragEndEvent {
		active: unknown;
		collisions: unknown;
		delta: {
			x: number;
			y: number;
		};
		over: unknown;
	}

	export interface DragStartEvent {
		active: unknown;
	}

	export interface DragOverlayEvent {
		active: unknown;
		droppableContainers: unknown[];
		droppableRects: unknown[];
	}

	export interface DndContextType {
		active: unknown;
		activator: unknown;
		activatorNode: unknown;
		activators: unknown[];
		over: unknown;
		rect: unknown;
		sensors: unknown[];
		sensorContext: unknown;
		willEnd: boolean;
	}

	export interface UseDndContextReturnValue {
		activator: unknown;
		activatorNode: unknown;
		activators: unknown[];
		over: unknown;
		rect: unknown;
		sensors: unknown[];
		sensorContext: unknown;
		willEnd: boolean;
		dragNode: unknown;
		dragOperation: unknown;
		draggableNodes: unknown[];
		droppableRects: unknown[];
		droppableContainers: unknown[];
		overId: string;
	}

	export function useDndContext(): UseDndContextReturnValue;
	export function DndContext(props: {
		children: React.ReactNode;
		sensors?: unknown[];
		collisionDetection?: unknown;
		onDragEnd?: (event: DragEndEvent) => void;
	}): JSX.Element;

	export function closestCenter(): unknown;
	export function KeyboardSensor(props: unknown): unknown;
	export function PointerSensor(props: unknown): unknown;
	export function useSensor(sensor: unknown, options?: unknown): unknown;
	export function useSensors(...sensors: unknown[]): unknown[];
}

declare module "@dnd-kit/sortable" {
	export interface SortableContextType {
		active: unknown;
		container: unknown;
		containerId: string;
		items: unknown[];
		over: unknown;
		rect: unknown;
		index: number;
		oldIndex: number;
		offset: number;
		pressNode: unknown;
		pressRect: unknown;
		transform: unknown;
	}

	export interface UseSortableReturnValue {
		active: unknown;
		attributes: unknown;
		listeners: unknown;
		isDragging: boolean;
		index: number;
		items: unknown[];
		over: unknown;
		overIndex: number;
		transform: unknown;
		setNodeRef: (node: HTMLElement | null) => void;
		setDroppableNodeRef: (node: HTMLElement | null) => void;
		transition?: unknown;
	}

	export function useSortable(args: unknown): UseSortableReturnValue;
	export function SortableContext(props: {
		children: React.ReactNode;
		value?: SortableContextType;
		items?: unknown[];
		strategy?: unknown;
	}): JSX.Element;
	export function arrayMove<T>(array: T[], from: number, to: number): T[];
	export function sortableKeyboardCoordinates(): unknown;
	export function verticalListSortingStrategy(): unknown;
}

declare module "@dnd-kit/utilities" {
	export interface CSS {
		Transform: string;
		Transition: string;
	}

	export const CSS: {
		Transform: {
			toString: (transform: {
				x: number;
				y: number;
				scaleX: number;
				scaleY: number;
			}) => string;
		};
	};

	export function useDraggable(options: unknown): unknown;
	export function useDroppable(options: unknown): unknown;
}
