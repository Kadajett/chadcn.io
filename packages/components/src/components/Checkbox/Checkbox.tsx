import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Size variant */
  size?: 'sm' | 'default';
  /** Show indeterminate state */
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = 'default', indeterminate, checked, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
  };

  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={indeterminate ? 'indeterminate' : checked}
      className={cn(
        'peer shrink-0 rounded-button border border-control-border bg-input',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-text',
        'data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:text-accent-text',
        'transition-colors duration-75',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        {indeterminate || props.defaultChecked === undefined ? (
          checked === 'indeterminate' || indeterminate ? (
            <Minus size={iconSize} strokeWidth={3} />
          ) : (
            <Check size={iconSize} strokeWidth={3} />
          )
        ) : (
          <Check size={iconSize} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = 'Checkbox';

export interface CheckboxWithLabelProps extends CheckboxProps {
  /** Label text */
  label: string;
  /** Description text */
  description?: string;
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, description, id, className, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <Checkbox ref={ref} id={checkboxId} {...props} />
      <div className="grid gap-0.5 leading-none">
        <label
          htmlFor={checkboxId}
          className="text-xs text-text cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-2xs text-text-muted">{description}</p>
        )}
      </div>
    </div>
  );
});
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };
