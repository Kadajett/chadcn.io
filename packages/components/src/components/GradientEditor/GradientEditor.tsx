import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export type GradientType = 'linear' | 'radial';

export interface GradientValue {
  type: GradientType;
  angle: number; // degrees, for linear
  stops: GradientStop[];
}

export interface GradientEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current gradient value */
  value: GradientValue;
  /** Callback when gradient changes */
  onChange?: (value: GradientValue) => void;
  /** Callback when a stop is selected */
  onStopSelect?: (stop: GradientStop | null) => void;
  /** Currently selected stop ID */
  selectedStopId?: string;
  /** Show type selector */
  showTypeSelector?: boolean;
  /** Show angle control */
  showAngleControl?: boolean;
  /** Minimum stops allowed */
  minStops?: number;
  /** Maximum stops allowed */
  maxStops?: number;
}

const GradientEditor = React.forwardRef<HTMLDivElement, GradientEditorProps>(
  (
    {
      className,
      value,
      onChange,
      onStopSelect,
      selectedStopId,
      showTypeSelector = true,
      showAngleControl = true,
      minStops = 2,
      maxStops = 10,
      ...props
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [draggingId, setDraggingId] = React.useState<string | null>(null);

    // Generate CSS gradient string
    const gradientCSS = React.useMemo(() => {
      const sortedStops = [...value.stops].sort((a, b) => a.position - b.position);
      const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

      if (value.type === 'radial') {
        return `radial-gradient(circle, ${stopsStr})`;
      }
      return `linear-gradient(${value.angle}deg, ${stopsStr})`;
    }, [value]);

    const handleTrackClick = (e: React.MouseEvent) => {
      if (value.stops.length >= maxStops) return;
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);

      // Interpolate color at this position
      const sortedStops = [...value.stops].sort((a, b) => a.position - b.position);
      let color = '#808080';

      for (let i = 0; i < sortedStops.length - 1; i++) {
        if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
          // Simple color interpolation (just use the nearest stop color)
          const mid = (sortedStops[i].position + sortedStops[i + 1].position) / 2;
          color = position < mid ? sortedStops[i].color : sortedStops[i + 1].color;
          break;
        }
      }

      const newStop: GradientStop = {
        id: `stop-${Date.now()}`,
        color,
        position,
      };

      onChange?.({
        ...value,
        stops: [...value.stops, newStop],
      });

      onStopSelect?.(newStop);
    };

    const handleStopMouseDown = (e: React.MouseEvent, stop: GradientStop) => {
      e.stopPropagation();
      setDraggingId(stop.id);
      onStopSelect?.(stop);
    };

    React.useEffect(() => {
      if (!draggingId) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        let position = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        position = Math.max(0, Math.min(100, position));

        onChange?.({
          ...value,
          stops: value.stops.map((s) =>
            s.id === draggingId ? { ...s, position } : s
          ),
        });
      };

      const handleMouseUp = () => {
        setDraggingId(null);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [draggingId, value, onChange]);

    const handleRemoveStop = (stopId: string) => {
      if (value.stops.length <= minStops) return;

      onChange?.({
        ...value,
        stops: value.stops.filter((s) => s.id !== stopId),
      });

      if (selectedStopId === stopId) {
        onStopSelect?.(null);
      }
    };

    const handleStopColorChange = (stopId: string, color: string) => {
      onChange?.({
        ...value,
        stops: value.stops.map((s) =>
          s.id === stopId ? { ...s, color } : s
        ),
      });
    };

    const handleTypeChange = (type: GradientType) => {
      onChange?.({ ...value, type });
    };

    const handleAngleChange = (angle: number) => {
      onChange?.({ ...value, angle });
    };

    const selectedStop = value.stops.find((s) => s.id === selectedStopId);

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {/* Type and angle controls */}
        {(showTypeSelector || showAngleControl) && (
          <div className="flex items-center gap-2">
            {showTypeSelector && (
              <div className="flex items-center gap-1 bg-surface-sunken rounded-button p-0.5">
                <button
                  type="button"
                  onClick={() => handleTypeChange('linear')}
                  className={cn(
                    'px-2 py-0.5 text-2xs rounded-sm transition-colors',
                    value.type === 'linear'
                      ? 'bg-control text-text'
                      : 'text-text-muted hover:text-text'
                  )}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('radial')}
                  className={cn(
                    'px-2 py-0.5 text-2xs rounded-sm transition-colors',
                    value.type === 'radial'
                      ? 'bg-control text-text'
                      : 'text-text-muted hover:text-text'
                  )}
                >
                  Radial
                </button>
              </div>
            )}

            {showAngleControl && value.type === 'linear' && (
              <div className="flex items-center gap-1">
                <span className="text-2xs text-text-muted">Angle:</span>
                <input
                  type="number"
                  value={value.angle}
                  onChange={(e) => handleAngleChange(Number(e.target.value))}
                  min={0}
                  max={360}
                  className={cn(
                    'w-16 px-2 py-0.5 text-2xs text-center rounded-button',
                    'bg-control border border-control-border text-text',
                    'focus:outline-none focus:border-accent',
                    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  )}
                />
                <span className="text-2xs text-text-muted">°</span>
              </div>
            )}
          </div>
        )}

        {/* Gradient preview and stop editor */}
        <div className="space-y-1">
          {/* Gradient preview bar */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className={cn(
              'relative h-6 rounded-button cursor-crosshair',
              'border border-panel-border'
            )}
            style={{ background: gradientCSS }}
          >
            {/* Checkerboard pattern for transparency */}
            <div
              className="absolute inset-0 rounded-button -z-10"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
              }}
            />
          </div>

          {/* Stop handles */}
          <div className="relative h-4">
            {value.stops.map((stop) => {
              const isSelected = selectedStopId === stop.id;
              return (
                <div
                  key={stop.id}
                  onMouseDown={(e) => handleStopMouseDown(e, stop)}
                  className={cn(
                    'absolute top-0 w-3 h-4 -translate-x-1/2 cursor-grab',
                    draggingId === stop.id && 'cursor-grabbing'
                  )}
                  style={{ left: `${stop.position}%` }}
                >
                  {/* Stop indicator */}
                  <div
                    className={cn(
                      'w-3 h-3 rounded-sm border-2 shadow-sm',
                      isSelected ? 'border-accent' : 'border-white'
                    )}
                    style={{ backgroundColor: stop.color }}
                  />
                  {/* Arrow pointing up */}
                  <div
                    className={cn(
                      'absolute -top-1 left-1/2 -translate-x-1/2',
                      'w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px]',
                      'border-l-transparent border-r-transparent',
                      isSelected ? 'border-b-accent' : 'border-b-white'
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected stop controls */}
        {selectedStop && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1">
              <span className="text-2xs text-text-muted">Color:</span>
              <input
                type="color"
                value={selectedStop.color}
                onChange={(e) => handleStopColorChange(selectedStop.id, e.target.value)}
                className="w-6 h-6 rounded border border-control-border cursor-pointer"
              />
              <input
                type="text"
                value={selectedStop.color}
                onChange={(e) => handleStopColorChange(selectedStop.id, e.target.value)}
                className={cn(
                  'w-16 px-1 py-0.5 text-2xs rounded-button',
                  'bg-control border border-control-border text-text',
                  'focus:outline-none focus:border-accent'
                )}
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-2xs text-text-muted">Position:</span>
              <input
                type="number"
                value={selectedStop.position}
                onChange={(e) =>
                  onChange?.({
                    ...value,
                    stops: value.stops.map((s) =>
                      s.id === selectedStop.id
                        ? { ...s, position: Math.max(0, Math.min(100, Number(e.target.value))) }
                        : s
                    ),
                  })
                }
                min={0}
                max={100}
                className={cn(
                  'w-14 px-2 py-0.5 text-2xs text-center rounded-button',
                  'bg-control border border-control-border text-text',
                  'focus:outline-none focus:border-accent',
                  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                )}
              />
              <span className="text-2xs text-text-muted">%</span>
            </div>

            {value.stops.length > minStops && (
              <button
                type="button"
                onClick={() => handleRemoveStop(selectedStop.id)}
                className="p-1 text-icon-muted hover:text-state-error transition-colors"
                title="Remove stop"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);
GradientEditor.displayName = 'GradientEditor';

// Helper to create a default gradient
export const createDefaultGradient = (): GradientValue => ({
  type: 'linear',
  angle: 90,
  stops: [
    { id: 'stop-1', color: '#000000', position: 0 },
    { id: 'stop-2', color: '#ffffff', position: 100 },
  ],
});

// Helper to generate CSS from gradient value
export const gradientToCSS = (gradient: GradientValue): string => {
  const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

  if (gradient.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${stopsStr})`;
};

export { GradientEditor };
