import * as React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-aligned items */
  left?: React.ReactNode;
  /** Center-aligned items */
  center?: React.ReactNode;
  /** Right-aligned items */
  right?: React.ReactNode;
}

const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  ({ className, left, center, right, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center h-5 px-2 bg-panel-header border-t border-panel-border',
          'text-2xs text-text-muted select-none',
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {left}
            </div>
            {center && (
              <div className="flex items-center gap-2 px-4">
                {center}
              </div>
            )}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              {right}
            </div>
          </>
        )}
      </div>
    );
  }
);
StatusBar.displayName = 'StatusBar';

export interface StatusBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Make the item clickable */
  clickable?: boolean;
}

const StatusBarItem = React.forwardRef<HTMLDivElement, StatusBarItemProps>(
  ({ className, icon, clickable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1 px-1 rounded-sm',
          'text-2xs text-text-muted',
          clickable && 'cursor-pointer hover:bg-control-hover hover:text-text',
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0 [&_svg]:w-3 [&_svg]:h-3">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
    );
  }
);
StatusBarItem.displayName = 'StatusBarItem';

export interface StatusBarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const StatusBarSeparator = React.forwardRef<HTMLDivElement, StatusBarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-px h-3 bg-divider mx-1', className)}
        {...props}
      />
    );
  }
);
StatusBarSeparator.displayName = 'StatusBarSeparator';

export interface StatusBarCoordinatesProps extends React.HTMLAttributes<HTMLDivElement> {
  x: number;
  y: number;
  /** Number of decimal places */
  precision?: number;
}

const StatusBarCoordinates = React.forwardRef<HTMLDivElement, StatusBarCoordinatesProps>(
  ({ className, x, y, precision = 0, ...props }, ref) => {
    const format = (n: number) => n.toFixed(precision);
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 font-mono text-2xs', className)}
        {...props}
      >
        <span className="text-text-muted">X:</span>
        <span className="text-text w-12 text-right">{format(x)}</span>
        <span className="text-text-muted ml-1">Y:</span>
        <span className="text-text w-12 text-right">{format(y)}</span>
      </div>
    );
  }
);
StatusBarCoordinates.displayName = 'StatusBarCoordinates';

export interface StatusBarZoomProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

const StatusBarZoom = React.forwardRef<HTMLDivElement, StatusBarZoomProps>(
  ({ className, value, onZoomIn, onZoomOut, onZoomReset, ...props }, ref) => {
    const percentage = Math.round(value * 100);
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-0.5', className)}
        {...props}
      >
        {onZoomOut && (
          <button
            type="button"
            onClick={onZoomOut}
            className="w-4 h-4 flex items-center justify-center rounded-sm hover:bg-control-hover text-text-muted hover:text-text"
          >
            <span className="text-xs leading-none">−</span>
          </button>
        )}
        <button
          type="button"
          onClick={onZoomReset}
          className={cn(
            'px-1 h-4 flex items-center justify-center rounded-sm font-mono text-2xs',
            onZoomReset ? 'hover:bg-control-hover cursor-pointer' : 'cursor-default'
          )}
        >
          {percentage}%
        </button>
        {onZoomIn && (
          <button
            type="button"
            onClick={onZoomIn}
            className="w-4 h-4 flex items-center justify-center rounded-sm hover:bg-control-hover text-text-muted hover:text-text"
          >
            <span className="text-xs leading-none">+</span>
          </button>
        )}
      </div>
    );
  }
);
StatusBarZoom.displayName = 'StatusBarZoom';

export interface StatusBarProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
}

const StatusBarProgress = React.forwardRef<HTMLDivElement, StatusBarProgressProps>(
  ({ className, value, max = 100, label, ...props }, ref) => {
    const percentage = Math.round((value / max) * 100);
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {label && <span className="text-2xs text-text-muted">{label}</span>}
        <div className="w-20 h-1.5 bg-input rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-2xs text-text-muted font-mono w-8">{percentage}%</span>
      </div>
    );
  }
);
StatusBarProgress.displayName = 'StatusBarProgress';

export {
  StatusBar,
  StatusBarItem,
  StatusBarSeparator,
  StatusBarCoordinates,
  StatusBarZoom,
  StatusBarProgress,
};
