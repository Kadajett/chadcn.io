import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Visual variant */
  variant?: 'default' | 'pills' | 'underline';
  /** Size variant */
  size?: 'sm' | 'default';
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-panel-header p-0.5 rounded-control gap-0.5',
    pills: 'gap-1',
    underline: 'gap-0 border-b border-divider',
  };

  const sizeClasses = {
    sm: 'h-6',
    default: 'h-7',
  };

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'flex items-center',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Visual variant (should match parent TabsList) */
  variant?: 'default' | 'pills' | 'underline';
  /** Size variant */
  size?: 'sm' | 'default';
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center whitespace-nowrap',
    'text-text-muted transition-colors duration-75',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
    'disabled:pointer-events-none disabled:opacity-50'
  );

  const variantClasses = {
    default: cn(
      'px-2 rounded-button',
      'hover:text-text hover:bg-control-hover',
      'data-[state=active]:bg-control data-[state=active]:text-text'
    ),
    pills: cn(
      'px-2 rounded-control',
      'hover:text-text hover:bg-control-hover',
      'data-[state=active]:bg-accent data-[state=active]:text-text-inverse'
    ),
    underline: cn(
      'px-3 border-b-2 border-transparent -mb-px',
      'hover:text-text hover:border-control-hover',
      'data-[state=active]:text-text data-[state=active]:border-accent'
    ),
  };

  const sizeClasses = {
    sm: 'h-5 text-2xs',
    default: 'h-6 text-xs',
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
