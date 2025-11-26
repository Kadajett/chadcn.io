import * as React from 'react';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Layer {
  id: string;
  name: string;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  blendMode?: string;
  thumbnail?: string;
  children?: Layer[];
}

export interface LayerStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layer data */
  layers: Layer[];
  /** Currently selected layer IDs */
  selected?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (ids: string[]) => void;
  /** Callback when layer visibility changes */
  onVisibilityChange?: (id: string, visible: boolean) => void;
  /** Callback when layer lock changes */
  onLockChange?: (id: string, locked: boolean) => void;
  /** Callback when layer opacity changes */
  onOpacityChange?: (id: string, opacity: number) => void;
  /** Callback when layer name changes */
  onNameChange?: (id: string, name: string) => void;
  /** Callback when layers are reordered */
  onReorder?: (layers: Layer[]) => void;
  /** Show thumbnails */
  showThumbnails?: boolean;
  /** Thumbnail size */
  thumbnailSize?: 'sm' | 'default' | 'lg';
  /** Allow multi-select */
  multiSelect?: boolean;
}

const LayerStack = React.forwardRef<HTMLDivElement, LayerStackProps>(
  (
    {
      className,
      layers,
      selected = [],
      onSelectionChange,
      onVisibilityChange,
      onLockChange,
      onOpacityChange,
      onNameChange,
      onReorder,
      showThumbnails = true,
      thumbnailSize = 'default',
      multiSelect = true,
      ...props
    },
    ref
  ) => {
    const handleSelect = (id: string, e: React.MouseEvent) => {
      if (!onSelectionChange) return;

      if (multiSelect && (e.ctrlKey || e.metaKey)) {
        const newSelected = selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id];
        onSelectionChange(newSelected);
      } else {
        onSelectionChange([id]);
      }
    };

    const thumbnailSizes = {
      sm: 'w-6 h-6',
      default: 'w-8 h-8',
      lg: 'w-10 h-10',
    };

    const renderLayer = (layer: Layer, depth: number = 0): React.ReactNode => {
      const isSelected = selected.includes(layer.id);
      const isVisible = layer.visible !== false;
      const isLocked = layer.locked === true;

      return (
        <div key={layer.id}>
          <div
            role="option"
            aria-selected={isSelected}
            onClick={(e) => handleSelect(layer.id, e)}
            className={cn(
              'flex items-center gap-1.5 h-auto min-h-8 px-1 py-1 cursor-pointer',
              'transition-colors duration-75',
              isSelected
                ? 'bg-selection text-selection-text hover:brightness-110'
                : 'hover:bg-control-hover',
              !isVisible && 'opacity-50'
            )}
            style={{ paddingLeft: depth * 16 + 4 }}
          >
            {/* Visibility toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onVisibilityChange?.(layer.id, !isVisible);
              }}
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded-sm',
                'transition-colors duration-75',
                isSelected
                  ? 'hover:bg-white/20'
                  : 'text-icon-muted hover:text-icon hover:bg-control-hover'
              )}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

            {/* Lock toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLockChange?.(layer.id, !isLocked);
              }}
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded-sm',
                'transition-colors duration-75',
                isSelected
                  ? 'hover:bg-white/20'
                  : 'text-icon-muted hover:text-icon hover:bg-control-hover',
                isLocked && 'text-accent'
              )}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>

            {/* Thumbnail */}
            {showThumbnails && (
              <div
                className={cn(
                  'flex-shrink-0 rounded-sm border border-control-border bg-surface-sunken overflow-hidden',
                  thumbnailSizes[thumbnailSize]
                )}
              >
                {layer.thumbnail ? (
                  <img
                    src={layer.thumbnail}
                    alt={layer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-control" />
                )}
              </div>
            )}

            {/* Layer name */}
            <span className="flex-1 text-xs truncate min-w-0">{layer.name}</span>

            {/* Opacity indicator */}
            {layer.opacity !== undefined && layer.opacity < 100 && (
              <span className={cn(
                'text-2xs font-mono',
                isSelected ? 'opacity-70' : 'text-text-muted'
              )}>
                {layer.opacity}%
              </span>
            )}
          </div>

          {/* Child layers */}
          {layer.children?.map((child) => renderLayer(child, depth + 1))}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="listbox"
        aria-multiselectable={multiSelect}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {layers.map((layer) => renderLayer(layer))}
      </div>
    );
  }
);
LayerStack.displayName = 'LayerStack';

export interface LayerStackHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current blend mode */
  blendMode?: string;
  /** Available blend modes */
  blendModes?: string[];
  /** Callback when blend mode changes */
  onBlendModeChange?: (mode: string) => void;
  /** Current opacity */
  opacity?: number;
  /** Callback when opacity changes */
  onOpacityChange?: (opacity: number) => void;
}

const LayerStackHeader = React.forwardRef<HTMLDivElement, LayerStackHeaderProps>(
  (
    {
      className,
      blendMode = 'Normal',
      blendModes = ['Normal', 'Multiply', 'Screen', 'Overlay', 'Soft Light', 'Hard Light', 'Difference'],
      onBlendModeChange,
      opacity = 100,
      onOpacityChange,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 px-2 py-1 border-b border-panel-border',
          className
        )}
        {...props}
      >
        {/* Blend mode selector */}
        <select
          value={blendMode}
          onChange={(e) => onBlendModeChange?.(e.target.value)}
          className={cn(
            'flex-1 h-5 px-1 rounded-control text-2xs',
            'bg-input border border-input-border text-text',
            'focus:outline-none focus:border-accent'
          )}
        >
          {blendModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        {/* Opacity */}
        <div className="flex items-center gap-1">
          <span className="text-2xs text-text-muted">Opacity:</span>
          <input
            type="number"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => onOpacityChange?.(Number(e.target.value))}
            className={cn(
              'w-10 h-5 px-1 rounded-control text-2xs text-right',
              'bg-input border border-input-border text-text',
              'focus:outline-none focus:border-accent'
            )}
          />
          <span className="text-2xs text-text-muted">%</span>
        </div>
      </div>
    );
  }
);
LayerStackHeader.displayName = 'LayerStackHeader';

export { LayerStack, LayerStackHeader };
