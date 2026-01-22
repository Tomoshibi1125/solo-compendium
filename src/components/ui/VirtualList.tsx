import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  className?: string;
  containerClassName?: string;
  overscan?: number;
  horizontal?: boolean;
}

/**
 * Virtual scrolling list component for performance with large datasets
 * Only renders visible items, dramatically improving performance
 */
export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 200,
  className,
  containerClassName,
  overscan = 5,
  horizontal = false,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    horizontal,
  });

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', containerClassName)}
      style={{
        height: horizontal ? 'auto' : '100%',
        width: horizontal ? '100%' : 'auto',
      }}
    >
      <div
        className={cn(horizontal ? 'flex' : '', className)}
        style={{
          height: horizontal ? 'auto' : `${virtualizer.getTotalSize()}px`,
          width: horizontal ? `${virtualizer.getTotalSize()}px` : '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: horizontal ? 0 : virtualItem.start,
              left: horizontal ? virtualItem.start : 0,
              width: horizontal ? `${virtualItem.size}px` : '100%',
              height: horizontal ? '100%' : `${virtualItem.size}px`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Virtual grid component for grid layouts
 */
interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: number;
  estimateSize?: number;
  className?: string;
  containerClassName?: string;
  gap?: number;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columns = 3,
  estimateSize = 200,
  className,
  containerClassName,
  gap = 16,
  overscan = 5,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', containerClassName)}
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div
              className={cn('grid', className)}
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
                padding: `${gap / 2}px`,
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const itemIndex = virtualRow.index * columns + colIndex;
                if (itemIndex >= items.length) return null;
                return (
                  <div key={colIndex}>
                    {renderItem(items[itemIndex], itemIndex)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

