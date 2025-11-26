import * as React from 'react';
import { Plus, X, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Swatch {
  id: string;
  color: string;
  name?: string;
}

export interface SwatchGroup {
  id: string;
  name: string;
  swatches: Swatch[];
}

export interface SwatchPaletteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Flat list of swatches */
  swatches?: Swatch[];
  /** Grouped swatches */
  groups?: SwatchGroup[];
  /** Currently selected swatch ID */
  selectedId?: string;
  /** Callback when a swatch is selected */
  onSwatchSelect?: (swatch: Swatch) => void;
  /** Callback when add button is clicked */
  onAdd?: () => void;
  /** Callback when a swatch is removed */
  onRemove?: (swatch: Swatch) => void;
  /** Callback when a swatch is double-clicked (for editing) */
  onEdit?: (swatch: Swatch) => void;
  /** Size of swatches */
  size?: 'sm' | 'default' | 'lg';
  /** Allow adding swatches */
  allowAdd?: boolean;
  /** Allow removing swatches */
  allowRemove?: boolean;
  /** Number of columns */
  columns?: number;
  /** Show swatch names on hover */
  showNames?: boolean;
}

const SwatchPalette = React.forwardRef<HTMLDivElement, SwatchPaletteProps>(
  (
    {
      className,
      swatches,
      groups,
      selectedId,
      onSwatchSelect,
      onAdd,
      onRemove,
      onEdit,
      size = 'default',
      allowAdd = false,
      allowRemove = false,
      columns = 8,
      showNames = true,
      ...props
    },
    ref
  ) => {
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);
    const [contextMenuId, setContextMenuId] = React.useState<string | null>(null);

    const sizeClasses = {
      sm: 'w-4 h-4',
      default: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    const renderSwatch = (swatch: Swatch) => {
      const isSelected = selectedId === swatch.id;
      const isHovered = hoveredId === swatch.id;

      return (
        <div
          key={swatch.id}
          className="relative group"
          onMouseEnter={() => setHoveredId(swatch.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <button
            type="button"
            onClick={() => onSwatchSelect?.(swatch)}
            onDoubleClick={() => onEdit?.(swatch)}
            onContextMenu={(e) => {
              if (allowRemove) {
                e.preventDefault();
                setContextMenuId(swatch.id);
              }
            }}
            className={cn(
              sizeClasses[size],
              'rounded-sm border transition-all duration-75',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
              isSelected
                ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface'
                : 'border-panel-border hover:border-accent/50'
            )}
            style={{ backgroundColor: swatch.color }}
            title={swatch.name || swatch.color}
          />

          {/* Remove button */}
          {allowRemove && isHovered && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(swatch);
              }}
              className={cn(
                'absolute -top-1 -right-1 w-3 h-3 rounded-full',
                'bg-state-error text-white',
                'flex items-center justify-center',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
            >
              <X size={8} />
            </button>
          )}

          {/* Name tooltip */}
          {showNames && swatch.name && isHovered && (
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 -bottom-6 z-10',
                'px-1.5 py-0.5 rounded bg-surface-overlay text-2xs text-text',
                'whitespace-nowrap pointer-events-none'
              )}
            >
              {swatch.name}
            </div>
          )}
        </div>
      );
    };

    const renderAddButton = () => (
      <button
        type="button"
        onClick={onAdd}
        className={cn(
          sizeClasses[size],
          'rounded-sm border border-dashed border-panel-border',
          'flex items-center justify-center',
          'text-icon-muted hover:text-icon hover:border-accent/50',
          'transition-colors duration-75',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
        )}
      >
        <Plus size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} />
      </button>
    );

    // Normalize to groups
    const normalizedGroups = React.useMemo(() => {
      if (groups) return groups;
      if (swatches) return [{ id: 'default', name: '', swatches }];
      return [];
    }, [groups, swatches]);

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {normalizedGroups.map((group) => (
          <div key={group.id}>
            {group.name && (
              <div className="text-2xs text-text-muted font-medium mb-1">
                {group.name}
              </div>
            )}
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {group.swatches.map(renderSwatch)}
              {allowAdd && group.id === normalizedGroups[normalizedGroups.length - 1]?.id && renderAddButton()}
            </div>
          </div>
        ))}

        {normalizedGroups.length === 0 && allowAdd && (
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {renderAddButton()}
          </div>
        )}
      </div>
    );
  }
);
SwatchPalette.displayName = 'SwatchPalette';

// Preset color palettes
export const presetPalettes = {
  basic: [
    { id: 'black', color: '#000000', name: 'Black' },
    { id: 'white', color: '#ffffff', name: 'White' },
    { id: 'red', color: '#ff0000', name: 'Red' },
    { id: 'green', color: '#00ff00', name: 'Green' },
    { id: 'blue', color: '#0000ff', name: 'Blue' },
    { id: 'yellow', color: '#ffff00', name: 'Yellow' },
    { id: 'cyan', color: '#00ffff', name: 'Cyan' },
    { id: 'magenta', color: '#ff00ff', name: 'Magenta' },
  ],
  grays: [
    { id: 'gray-0', color: '#000000', name: 'Black' },
    { id: 'gray-1', color: '#1a1a1a', name: 'Gray 10' },
    { id: 'gray-2', color: '#333333', name: 'Gray 20' },
    { id: 'gray-3', color: '#4d4d4d', name: 'Gray 30' },
    { id: 'gray-4', color: '#666666', name: 'Gray 40' },
    { id: 'gray-5', color: '#808080', name: 'Gray 50' },
    { id: 'gray-6', color: '#999999', name: 'Gray 60' },
    { id: 'gray-7', color: '#b3b3b3', name: 'Gray 70' },
    { id: 'gray-8', color: '#cccccc', name: 'Gray 80' },
    { id: 'gray-9', color: '#e6e6e6', name: 'Gray 90' },
    { id: 'gray-10', color: '#ffffff', name: 'White' },
  ],
  skin: [
    { id: 'skin-1', color: '#8d5524', name: 'Dark' },
    { id: 'skin-2', color: '#c68642', name: 'Medium Dark' },
    { id: 'skin-3', color: '#e0ac69', name: 'Medium' },
    { id: 'skin-4', color: '#f1c27d', name: 'Medium Light' },
    { id: 'skin-5', color: '#ffdbac', name: 'Light' },
    { id: 'skin-6', color: '#ffe0bd', name: 'Very Light' },
  ],
};

export { SwatchPalette };
