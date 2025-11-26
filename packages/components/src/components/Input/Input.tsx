import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Size variant */
  variant?: 'default' | 'ghost';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-6 w-full rounded-control px-2 text-sm text-text',
          'placeholder:text-text-muted',
          'transition-colors duration-75',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' && [
            'bg-input border border-input-border',
            'hover:bg-input-hover',
            'focus:bg-input-focus focus:border-accent',
          ],
          variant === 'ghost' && [
            'bg-transparent border border-transparent',
            'hover:bg-input hover:border-input-border',
            'focus:bg-input focus:border-accent',
          ],
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
