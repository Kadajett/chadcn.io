import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the toolbar */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, orientation = 'horizontal', size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'gap-0',
      default: 'gap-0.5',
      lg: 'gap-1',
    };

    return (
      <TooltipPrimitive.Provider delayDuration={400}>
        <div
          ref={ref}
          role="toolbar"
          aria-orientation={orientation}
          className={cn(
            'flex items-center bg-panel border border-panel-border',
            orientation === 'vertical' ? 'flex-col py-1 px-0.5' : 'flex-row px-1 py-0.5',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipPrimitive.Provider>
    );
  }
);
Toolbar.displayName = 'Toolbar';

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the button is in active/pressed state */
  active?: boolean;
  /** Tooltip label */
  tooltip?: string;
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, tooltip, size = 'default', children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      default: 'w-6 h-6',
      lg: 'w-7 h-7',
    };

    const iconSizeClasses = {
      sm: '[&_svg]:w-3 [&_svg]:h-3',
      default: '[&_svg]:w-4 [&_svg]:h-4',
      lg: '[&_svg]:w-5 [&_svg]:h-5',
    };

    const button = (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={active}
        data-active={active}
        className={cn(
          'flex items-center justify-center rounded-button',
          'text-icon transition-colors duration-75',
          'hover:bg-control-hover hover:text-icon-active',
          'focus-visible:outline-1 focus-visible:outline-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
          active && 'bg-control-active text-icon-active',
          sizeClasses[size],
          iconSizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );

    if (tooltip) {
      return (
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="bottom"
              sideOffset={4}
              className={cn(
                'z-50 px-2 py-1 text-xs rounded-control',
                'bg-surface-overlay text-text border border-panel-border shadow-tooltip',
                'animate-fade-in'
              )}
            >
              {tooltip}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      );
    }

    return button;
  }
);
ToolbarButton.displayName = 'ToolbarButton';

const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-divider',
        orientation === 'vertical' ? 'w-px h-4 mx-1' : 'h-px w-4 my-1',
        className
      )}
      {...props}
    />
  );
});
ToolbarSeparator.displayName = 'ToolbarSeparator';

export interface ToolbarToggleGroupProps {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
}

const ToolbarToggleGroup = React.forwardRef<HTMLDivElement, ToolbarToggleGroupProps>(
  ({ type, value, defaultValue, onValueChange, disabled, className, size = 'default', children }, ref) => {
    const childrenWithSize = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { size } as { size: 'sm' | 'default' | 'lg' });
      }
      return child;
    });

    if (type === 'single') {
      return (
        <ToggleGroupPrimitive.Root
          ref={ref}
          type="single"
          value={value as string}
          defaultValue={defaultValue as string}
          onValueChange={onValueChange as (value: string) => void}
          disabled={disabled}
          className={cn('flex items-center gap-0', className)}
        >
          {childrenWithSize}
        </ToggleGroupPrimitive.Root>
      );
    }

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="multiple"
        value={value as string[]}
        defaultValue={defaultValue as string[]}
        onValueChange={onValueChange as (value: string[]) => void}
        disabled={disabled}
        className={cn('flex items-center gap-0', className)}
      >
        {childrenWithSize}
      </ToggleGroupPrimitive.Root>
    );
  }
);
ToolbarToggleGroup.displayName = 'ToolbarToggleGroup';

export interface ToolbarToggleItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  tooltip?: string;
  size?: 'sm' | 'default' | 'lg';
}

const ToolbarToggleItem = React.forwardRef<HTMLButtonElement, ToolbarToggleItemProps>(
  ({ className, tooltip, size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      default: 'w-6 h-6',
      lg: 'w-7 h-7',
    };

    const iconSizeClasses = {
      sm: '[&_svg]:w-3 [&_svg]:h-3',
      default: '[&_svg]:w-4 [&_svg]:h-4',
      lg: '[&_svg]:w-5 [&_svg]:h-5',
    };

    const item = (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-button',
          'text-icon transition-colors duration-75',
          'hover:bg-control-hover hover:text-icon-active',
          'focus-visible:outline-1 focus-visible:outline-accent',
          'data-[state=on]:bg-control-active data-[state=on]:text-icon-active',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          iconSizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );

    if (tooltip) {
      return (
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{item}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="bottom"
              sideOffset={4}
              className={cn(
                'z-50 px-2 py-1 text-xs rounded-control',
                'bg-surface-overlay text-text border border-panel-border shadow-tooltip',
                'animate-fade-in'
              )}
            >
              {tooltip}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      );
    }

    return item;
  }
);
ToolbarToggleItem.displayName = 'ToolbarToggleItem';

export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem };
