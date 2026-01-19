// Type declarations for @dnd-kit modules
declare module '@dnd-kit/core' {
  export interface DragEndEvent {
    active: any;
    collisions: any;
    delta: {
      x: number;
      y: number;
    };
    over: any;
  }

  export interface DragStartEvent {
    active: any;
  }

  export interface DragOverlayEvent {
    active: any;
    droppableContainers: any[];
    droppableRects: any[];
  }

  export interface DndContextType {
    active: any;
    activator: any;
    activatorNode: any;
    activators: any[];
    over: any;
    rect: any;
    sensors: any[];
    sensorContext: any;
    willEnd: boolean;
  }

  export interface UseDndContextReturnValue {
    active: any;
    activator: any;
    activatorNode: any;
    activators: any[];
    over: any;
    rect: any;
    sensors: any[];
    sensorContext: any;
    willEnd: boolean;
    dragNode: any;
    dragOperation: any;
    draggableNodes: any[];
    droppableRects: any[];
    droppableContainers: any[];
    overId: string;
  }

  export function useDndContext(): UseDndContextReturnValue;
  export function DndContext(props: { 
    children: React.ReactNode; 
    sensors?: any[];
    collisionDetection?: any;
    onDragEnd?: (event: DragEndEvent) => void;
  }): JSX.Element;
  
  export function closestCenter(): any;
  export function KeyboardSensor(props: any): any;
  export function PointerSensor(props: any): any;
  export function useSensor(sensor: any, options?: any): any;
  export function useSensors(...sensors: any[]): any[];
}

declare module '@dnd-kit/sortable' {
  export interface SortableContextType {
    active: any;
    container: any;
    containerId: string;
    items: any[];
    over: any;
    rect: any;
    index: number;
    oldIndex: number;
    offset: number;
    pressNode: any;
    pressRect: any;
    transform: any;
  }

  export interface UseSortableReturnValue {
    active: any;
    attributes: any;
    listeners: any;
    isDragging: boolean;
    index: number;
    items: any[];
    over: any;
    overIndex: number;
    transform: any;
    setNodeRef: (node: HTMLElement | null) => void;
    setDroppableNodeRef: (node: HTMLElement | null) => void;
    transition?: any;
  }

  export function useSortable(args: any): UseSortableReturnValue;
  export function SortableContext(props: { 
    children: React.ReactNode; 
    value?: SortableContextType;
    items?: any[];
    strategy?: any;
  }): JSX.Element;
  export function arrayMove<T>(array: T[], from: number, to: number): T[];
  export function sortableKeyboardCoordinates(): any;
  export function verticalListSortingStrategy(): any;
}

declare module '@dnd-kit/utilities' {
  export interface CSS {
    Transform: string;
    Transition: string;
  }

  export const CSS: {
    Transform: {
      toString: (transform: { x: number; y: number; scaleX: number; scaleY: number }) => string;
    };
  };

  export function useDraggable(options: any): any;
  export function useDroppable(options: any): any;
}
