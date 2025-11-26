import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-control',
    'text-xs font-medium transition-colors duration-75',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        default: 'bg-control border border-control-border text-text hover:bg-control-hover',
        primary: 'bg-accent text-accent-text hover:bg-accent-hover',
        ghost: 'text-text hover:bg-control-hover',
        destructive: 'bg-state-error text-white hover:opacity-90',
        outline: 'border border-control-border bg-transparent text-text hover:bg-control-hover',
      },
      size: {
        sm: 'h-5 px-1.5 text-2xs [&_svg]:h-3 [&_svg]:w-3',
        default: 'h-6 px-2 text-xs [&_svg]:h-4 [&_svg]:w-4',
        lg: 'h-7 px-3 text-sm [&_svg]:h-4 [&_svg]:w-4',
        icon: 'h-6 w-6 [&_svg]:h-4 [&_svg]:w-4',
        'icon-sm': 'h-5 w-5 [&_svg]:h-3 [&_svg]:w-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
