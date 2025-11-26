import * as React from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

export type PaneDirection = 'horizontal' | 'vertical';

export interface PaneConfig {
  id: string;
  /** Initial size as percentage or pixels */
  defaultSize?: number;
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;
  /** Whether this pane can be collapsed */
  collapsible?: boolean;
  /** Collapsed state */
  collapsed?: boolean;
}

export interface ResizablePanesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the split */
  direction?: PaneDirection;
  /** Pane configurations */
  panes: PaneConfig[];
  /** Children (must match number of panes) */
  children: React.ReactNode[];
  /** Callback when sizes change */
  onResize?: (sizes: number[]) => void;
  /** Callback when a pane is collapsed/expanded */
  onCollapse?: (paneId: string, collapsed: boolean) => void;
  /** Size of the divider handle */
  handleSize?: number;
  /** Show grip indicator on handles */
  showGrip?: boolean;
}

const ResizablePanes = React.forwardRef<HTMLDivElement, ResizablePanesProps>(
  (
    {
      className,
      direction = 'horizontal',
      panes,
      children,
      onResize,
      onCollapse,
      handleSize = 4,
      showGrip = true,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [sizes, setSizes] = React.useState<number[]>(() =>
      panes.map((p) => p.defaultSize ?? 100 / panes.length)
    );
    const [dragging, setDragging] = React.useState<number | null>(null);

    const isHorizontal = direction === 'horizontal';

    // Get container size
    const getContainerSize = React.useCallback(() => {
      if (!containerRef.current) return 0;
      return isHorizontal
        ? containerRef.current.offsetWidth
        : containerRef.current.offsetHeight;
    }, [isHorizontal]);

    // Convert percentage to pixels
    const toPixels = React.useCallback(
      (percentage: number) => (percentage / 100) * getContainerSize(),
      [getContainerSize]
    );

    // Convert pixels to percentage
    const toPercentage = React.useCallback(
      (pixels: number) => (pixels / getContainerSize()) * 100,
      [getContainerSize]
    );

    // Handle divider drag
    const handleMouseDown = React.useCallback((index: number) => {
      setDragging(index);
    }, []);

    React.useEffect(() => {
      if (dragging === null) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top;
        const containerSize = getContainerSize();

        // Calculate size before this divider
        let sizeBeforeDivider = 0;
        for (let i = 0; i < dragging; i++) {
          sizeBeforeDivider += toPixels(sizes[i]);
        }

        // New size for the pane before the divider
        let newSizePx = position - sizeBeforeDivider - (handleSize * dragging);

        // Apply constraints
        const pane = panes[dragging];
        const nextPane = panes[dragging + 1];

        if (pane.minSize !== undefined) {
          newSizePx = Math.max(newSizePx, pane.minSize);
        }
        if (pane.maxSize !== undefined) {
          newSizePx = Math.min(newSizePx, pane.maxSize);
        }

        // Calculate remaining size for next pane
        const currentSizePx = toPixels(sizes[dragging]);
        const nextSizePx = toPixels(sizes[dragging + 1]);
        const delta = newSizePx - currentSizePx;
        let newNextSizePx = nextSizePx - delta;

        // Apply constraints to next pane
        if (nextPane.minSize !== undefined && newNextSizePx < nextPane.minSize) {
          newNextSizePx = nextPane.minSize;
          newSizePx = currentSizePx + nextSizePx - newNextSizePx;
        }
        if (nextPane.maxSize !== undefined && newNextSizePx > nextPane.maxSize) {
          newNextSizePx = nextPane.maxSize;
          newSizePx = currentSizePx + nextSizePx - newNextSizePx;
        }

        const newSizes = [...sizes];
        newSizes[dragging] = toPercentage(newSizePx);
        newSizes[dragging + 1] = toPercentage(newNextSizePx);

        setSizes(newSizes);
        onResize?.(newSizes);
      };

      const handleMouseUp = () => {
        setDragging(null);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [dragging, sizes, panes, isHorizontal, getContainerSize, toPixels, toPercentage, handleSize, onResize]);

    // Handle double-click to collapse/expand
    const handleDoubleClick = (index: number) => {
      const pane = panes[index];
      if (!pane.collapsible) return;

      onCollapse?.(pane.id, !pane.collapsed);
    };

    const childArray = React.Children.toArray(children);

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'flex overflow-hidden w-full h-full',
          isHorizontal ? 'flex-row' : 'flex-col',
          dragging !== null && 'select-none',
          className
        )}
        {...props}
      >
        {panes.map((pane, index) => {
          const isCollapsed = pane.collapsed;
          const size = isCollapsed ? 0 : sizes[index];

          return (
            <React.Fragment key={pane.id}>
              {/* Pane content */}
              <div
                className={cn(
                  'overflow-hidden',
                  isHorizontal ? 'h-full' : 'w-full',
                  isCollapsed && 'hidden'
                )}
                style={{
                  [isHorizontal ? 'width' : 'height']: `${size}%`,
                  flexShrink: 0,
                }}
              >
                {childArray[index]}
              </div>

              {/* Divider handle (not after last pane) */}
              {index < panes.length - 1 && (
                <div
                  onMouseDown={() => handleMouseDown(index)}
                  onDoubleClick={() => handleDoubleClick(index)}
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center',
                    'bg-panel-border hover:bg-accent/50 transition-colors',
                    isHorizontal
                      ? 'cursor-col-resize w-1 hover:w-1.5'
                      : 'cursor-row-resize h-1 hover:h-1.5',
                    dragging === index && 'bg-accent'
                  )}
                  style={{
                    [isHorizontal ? 'width' : 'height']: handleSize,
                  }}
                >
                  {showGrip && (
                    <div className="text-icon-muted opacity-0 hover:opacity-100 transition-opacity">
                      {isHorizontal ? (
                        <GripVertical size={10} />
                      ) : (
                        <GripHorizontal size={10} />
                      )}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
ResizablePanes.displayName = 'ResizablePanes';

// Simple two-pane split
export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: PaneDirection;
  /** Default size of the first pane (percentage) */
  defaultFirstSize?: number;
  /** Minimum size of first pane in pixels */
  minFirstSize?: number;
  /** Maximum size of first pane in pixels */
  maxFirstSize?: number;
  /** Minimum size of second pane in pixels */
  minSecondSize?: number;
  /** First pane content */
  first: React.ReactNode;
  /** Second pane content */
  second: React.ReactNode;
  /** Callback when sizes change */
  onResize?: (firstSize: number, secondSize: number) => void;
}

const SplitPane = React.forwardRef<HTMLDivElement, SplitPaneProps>(
  (
    {
      direction = 'horizontal',
      defaultFirstSize = 50,
      minFirstSize,
      maxFirstSize,
      minSecondSize,
      first,
      second,
      onResize,
      ...props
    },
    ref
  ) => {
    const panes: PaneConfig[] = [
      {
        id: 'first',
        defaultSize: defaultFirstSize,
        minSize: minFirstSize,
        maxSize: maxFirstSize,
      },
      {
        id: 'second',
        defaultSize: 100 - defaultFirstSize,
        minSize: minSecondSize,
      },
    ];

    return (
      <ResizablePanes
        ref={ref}
        direction={direction}
        panes={panes}
        onResize={(sizes) => onResize?.(sizes[0], sizes[1])}
        {...props}
      >
        {first}
        {second}
      </ResizablePanes>
    );
  }
);
SplitPane.displayName = 'SplitPane';

export { ResizablePanes, SplitPane };
