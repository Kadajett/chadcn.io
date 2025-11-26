import * as React from 'react';
import { X, Pause, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ProgressStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'cancelled';

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100), undefined for indeterminate */
  value?: number;
  /** Current status */
  status?: ProgressStatus;
  /** Label text */
  label?: string;
  /** Status/description text */
  statusText?: string;
  /** Show percentage */
  showPercentage?: boolean;
  /** Show cancel button */
  showCancel?: boolean;
  /** Show pause/resume button */
  showPauseResume?: boolean;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Callback when pause/resume is clicked */
  onPauseResume?: () => void;
  /** Estimated time remaining in seconds */
  estimatedTime?: number;
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
  /** Variant */
  variant?: 'default' | 'minimal' | 'detailed';
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  (
    {
      className,
      value,
      status = 'idle',
      label,
      statusText,
      showPercentage = true,
      showCancel = false,
      showPauseResume = false,
      onCancel,
      onPauseResume,
      estimatedTime,
      size = 'default',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const isIndeterminate = value === undefined;
    const normalizedValue = value !== undefined ? Math.max(0, Math.min(100, value)) : 0;

    const heightClasses = {
      sm: 'h-1',
      default: 'h-1.5',
      lg: 'h-2',
    };

    const statusColors: Record<ProgressStatus, string> = {
      idle: 'bg-control-border',
      running: 'bg-accent',
      paused: 'bg-state-warning',
      completed: 'bg-state-success',
      error: 'bg-state-error',
      cancelled: 'bg-control-border',
    };

    const statusIcons: Partial<Record<ProgressStatus, React.ReactNode>> = {
      completed: <CheckCircle size={14} className="text-state-success" />,
      error: <AlertCircle size={14} className="text-state-error" />,
    };

    if (variant === 'minimal') {
      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <div className={cn('w-full rounded-full bg-surface-sunken overflow-hidden', heightClasses[size])}>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                statusColors[status],
                isIndeterminate && 'animate-indeterminate'
              )}
              style={{
                width: isIndeterminate ? '30%' : `${normalizedValue}%`,
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full space-y-1', className)} {...props}>
        {/* Header row */}
        {(label || showPercentage || showCancel || showPauseResume) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {statusIcons[status]}
              {label && (
                <span className="text-xs text-text truncate">{label}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {showPercentage && !isIndeterminate && status === 'running' && (
                <span className="text-2xs text-text-muted tabular-nums">
                  {Math.round(normalizedValue)}%
                </span>
              )}

              {estimatedTime !== undefined && status === 'running' && (
                <span className="text-2xs text-text-muted">
                  ~{formatTime(estimatedTime)}
                </span>
              )}

              {showPauseResume && (status === 'running' || status === 'paused') && (
                <button
                  type="button"
                  onClick={onPauseResume}
                  className="p-0.5 text-icon-muted hover:text-icon transition-colors"
                  title={status === 'paused' ? 'Resume' : 'Pause'}
                >
                  {status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
                </button>
              )}

              {showCancel && (status === 'running' || status === 'paused') && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-0.5 text-icon-muted hover:text-state-error transition-colors"
                  title="Cancel"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className={cn('w-full rounded-full bg-surface-sunken overflow-hidden', heightClasses[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              statusColors[status],
              isIndeterminate && status === 'running' && 'animate-indeterminate'
            )}
            style={{
              width: isIndeterminate ? '30%' : `${normalizedValue}%`,
            }}
          />
        </div>

        {/* Status text */}
        {statusText && variant === 'detailed' && (
          <div className="text-2xs text-text-muted truncate">{statusText}</div>
        )}
      </div>
    );
  }
);
ProgressIndicator.displayName = 'ProgressIndicator';

// Multi-progress for batch operations
export interface BatchProgressItem {
  id: string;
  label: string;
  value?: number;
  status: ProgressStatus;
}

export interface BatchProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BatchProgressItem[];
  /** Show overall progress */
  showOverall?: boolean;
  /** Maximum visible items before scrolling */
  maxVisible?: number;
}

const BatchProgress = React.forwardRef<HTMLDivElement, BatchProgressProps>(
  ({ className, items, showOverall = true, maxVisible = 5, ...props }, ref) => {
    const completedCount = items.filter((i) => i.status === 'completed').length;
    const overallProgress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {showOverall && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text">Overall Progress</span>
              <span className="text-text-muted">
                {completedCount}/{items.length}
              </span>
            </div>
            <ProgressIndicator
              value={overallProgress}
              status={completedCount === items.length ? 'completed' : 'running'}
              variant="minimal"
            />
          </div>
        )}

        <div
          className="space-y-1.5 overflow-y-auto"
          style={{ maxHeight: maxVisible * 24 }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <ProgressIndicator
                  label={item.label}
                  value={item.value}
                  status={item.status}
                  size="sm"
                  showPercentage={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
BatchProgress.displayName = 'BatchProgress';

export { ProgressIndicator, BatchProgress };
