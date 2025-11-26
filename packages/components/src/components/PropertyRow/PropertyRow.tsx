import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

export interface PropertyRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label text for the property */
  label: string;
  /** Optional ID to connect label with input */
  htmlFor?: string;
  /** Alignment of the label */
  labelAlign?: 'left' | 'right';
  /** Width of the label section */
  labelWidth?: 'auto' | 'sm' | 'md' | 'lg';
  /** Whether to show the label */
  showLabel?: boolean;
  /** Help text or tooltip */
  hint?: string;
}

const PropertyRow = React.forwardRef<HTMLDivElement, PropertyRowProps>(
  (
    {
      className,
      label,
      htmlFor,
      labelAlign = 'left',
      labelWidth = 'md',
      showLabel = true,
      hint,
      children,
      ...props
    },
    ref
  ) => {
    const labelWidthClasses = {
      auto: 'w-auto',
      sm: 'w-16',
      md: 'w-20',
      lg: 'w-28',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 min-h-6', className)}
        {...props}
      >
        {showLabel && (
          <LabelPrimitive.Root
            htmlFor={htmlFor}
            className={cn(
              'flex-shrink-0 text-text-label text-xs select-none truncate',
              labelAlign === 'right' && 'text-right',
              labelWidthClasses[labelWidth]
            )}
            title={hint || label}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <div className="flex-1 flex items-center gap-1 min-w-0">{children}</div>
      </div>
    );
  }
);
PropertyRow.displayName = 'PropertyRow';

export interface PropertyGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title for the property group */
  title?: string;
  /** Whether to show a divider above */
  divider?: boolean;
}

const PropertyGroup = React.forwardRef<HTMLDivElement, PropertyGroupProps>(
  ({ className, title, divider, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {divider && <div className="h-px bg-divider my-2" />}
        {title && (
          <div className="text-text-muted text-2xs uppercase tracking-wider font-medium mb-1.5">
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }
);
PropertyGroup.displayName = 'PropertyGroup';

const PropertyDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('h-px bg-divider my-2', className)} {...props} />
  );
});
PropertyDivider.displayName = 'PropertyDivider';

export { PropertyRow, PropertyGroup, PropertyDivider };
