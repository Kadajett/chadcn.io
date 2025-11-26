import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends ToastPrimitive.ToastProps {
  toast: ToastData;
  onDismiss?: (id: string) => void;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  info: <Info size={16} className="text-accent" />,
  success: <CheckCircle size={16} className="text-state-success" />,
  warning: <AlertTriangle size={16} className="text-state-warning" />,
  error: <AlertCircle size={16} className="text-state-error" />,
};

const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  ({ toast, onDismiss, className, ...props }, ref) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex items-start gap-3 p-3 rounded-panel',
          'bg-panel border border-panel-border shadow-dropdown',
          'data-[state=open]:animate-slide-up',
          'data-[state=closed]:animate-fade-out',
          'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
          'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
          'data-[swipe=end]:animate-swipe-out',
          className
        )}
        duration={toast.duration ?? 5000}
        {...props}
      >
        {toast.type && (
          <div className="flex-shrink-0 mt-0.5">{toastIcons[toast.type]}</div>
        )}

        <div className="flex-1 min-w-0">
          <ToastPrimitive.Title className="text-sm font-medium text-text">
            {toast.title}
          </ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className="mt-0.5 text-xs text-text-muted">
              {toast.description}
            </ToastPrimitive.Description>
          )}
          {toast.action && (
            <ToastPrimitive.Action
              altText={toast.action.label}
              onClick={toast.action.onClick}
              className={cn(
                'mt-2 px-2 py-1 text-xs rounded-button',
                'bg-control hover:bg-control-hover text-text',
                'transition-colors cursor-pointer'
              )}
            >
              {toast.action.label}
            </ToastPrimitive.Action>
          )}
        </div>

        <ToastPrimitive.Close
          onClick={() => onDismiss?.(toast.id)}
          className={cn(
            'flex-shrink-0 p-0.5 rounded-sm',
            'text-icon-muted hover:text-icon hover:bg-control-hover',
            'transition-colors'
          )}
        >
          <X size={14} />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
);
Toast.displayName = 'Toast';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastViewportProps extends Omit<ToastPrimitive.ToastViewportProps, 'position'> {
  position?: ToastPosition;
}

const ToastViewport = React.forwardRef<HTMLOListElement, ToastViewportProps>(
  ({ position = 'bottom-right', className, ...props }, ref) => {
    const positionClasses: Record<ToastPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    return (
      <ToastPrimitive.Viewport
        ref={ref}
        className={cn(
          'fixed z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-32px)]',
          'outline-none',
          positionClasses[position],
          className
        )}
        {...props}
      />
    );
  }
);
ToastViewport.displayName = 'ToastViewport';

// Toast Provider with state management
interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => {
        const next = [...prev, { ...toast, id }];
        // Remove oldest if over limit
        if (next.length > maxToasts) {
          return next.slice(-maxToasts);
        }
        return next;
      });
      return id;
    },
    [maxToasts]
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
        <ToastViewport position={position} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

// Convenience functions for common toast types
export const createToast = {
  info: (title: string, description?: string) => ({
    type: 'info' as const,
    title,
    description,
  }),
  success: (title: string, description?: string) => ({
    type: 'success' as const,
    title,
    description,
  }),
  warning: (title: string, description?: string) => ({
    type: 'warning' as const,
    title,
    description,
  }),
  error: (title: string, description?: string) => ({
    type: 'error' as const,
    title,
    description,
  }),
};

export { Toast, ToastViewport, ToastProvider };
