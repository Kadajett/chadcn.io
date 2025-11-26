import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Size variant */
  size?: 'sm' | 'default';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: {
      root: 'h-3 w-6',
      thumb: 'h-2 w-2 data-[state=checked]:translate-x-3',
    },
    default: {
      root: 'h-4 w-7',
      thumb: 'h-3 w-3 data-[state=checked]:translate-x-3',
    },
  };

  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full',
        'border border-control-border bg-input',
        'transition-colors duration-75',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-accent data-[state=checked]:border-accent',
        sizeClasses[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-text shadow-control',
          'transition-transform duration-75',
          'data-[state=unchecked]:translate-x-0.5',
          sizeClasses[size].thumb
        )}
      />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = 'Switch';

export interface SwitchWithLabelProps extends SwitchProps {
  /** Label text */
  label: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchWithLabelProps
>(({ label, labelPosition = 'right', id, className, ...props }, ref) => {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        labelPosition === 'left' && 'flex-row-reverse justify-end',
        className
      )}
    >
      <Switch ref={ref} id={switchId} {...props} />
      <label
        htmlFor={switchId}
        className="text-xs text-text cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
});
SwitchWithLabel.displayName = 'SwitchWithLabel';

export { Switch, SwitchWithLabel };
