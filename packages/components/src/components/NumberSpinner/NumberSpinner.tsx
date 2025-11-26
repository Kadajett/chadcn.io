import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NumberSpinnerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  /** Current value */
  value?: number;
  /** Default value for uncontrolled mode */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Number of decimal places */
  precision?: number;
  /** Unit suffix (e.g., "px", "%") */
  suffix?: string;
  /** Whether to show spinner buttons */
  showButtons?: boolean;
  /** Allow scrubbing (click and drag to change value) */
  scrub?: boolean;
  /** Scrub sensitivity multiplier */
  scrubSensitivity?: number;
}

const NumberSpinner = React.forwardRef<HTMLInputElement, NumberSpinnerProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision = 0,
      suffix,
      showButtons = true,
      scrub = true,
      scrubSensitivity = 1,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [inputValue, setInputValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    const [isScrubbing, setIsScrubbing] = React.useState(false);
    const scrubStartRef = React.useRef({ x: 0, value: 0 });

    const value = controlledValue ?? internalValue;

    const clamp = (val: number) => Math.min(max, Math.max(min, val));
    const round = (val: number) => Number(val.toFixed(precision));

    const updateValue = React.useCallback(
      (newValue: number) => {
        const clamped = clamp(round(newValue));
        setInternalValue(clamped);
        onChange?.(clamped);
      },
      [onChange, max, min, precision]
    );

    const increment = () => updateValue(value + step);
    const decrement = () => updateValue(value - step);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setInputValue(value.toString());
      e.target.select();
    };

    const handleBlur = () => {
      setIsFocused(false);
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        updateValue(parsed);
      }
      setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        setInputValue('');
        e.currentTarget.blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!scrub || disabled || isFocused) return;

      e.preventDefault();
      setIsScrubbing(true);
      scrubStartRef.current = { x: e.clientX, value };
      document.body.style.cursor = 'ew-resize';

      const handleMouseMove = (e: MouseEvent) => {
        const delta = (e.clientX - scrubStartRef.current.x) * scrubSensitivity;
        const newValue = scrubStartRef.current.value + delta * step * 0.1;
        updateValue(newValue);
      };

      const handleMouseUp = () => {
        setIsScrubbing(false);
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const displayValue = isFocused
      ? inputValue
      : `${round(value)}${suffix ? suffix : ''}`;

    return (
      <div
        className={cn(
          'flex items-center h-6 rounded-control overflow-hidden',
          'bg-input border border-input-border',
          'focus-within:border-accent',
          disabled && 'opacity-50 cursor-not-allowed',
          isScrubbing && 'cursor-ew-resize',
          className
        )}
      >
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          disabled={disabled}
          className={cn(
            'flex-1 h-full bg-transparent px-2 text-sm text-text text-right',
            'focus:outline-none',
            'min-w-0',
            scrub && !isFocused && 'cursor-ew-resize select-none'
          )}
          {...props}
        />
        {showButtons && (
          <div className="flex flex-col border-l border-input-border">
            <button
              type="button"
              tabIndex={-1}
              onClick={increment}
              disabled={disabled || value >= max}
              className={cn(
                'flex items-center justify-center w-4 h-3',
                'text-icon hover:bg-control-hover hover:text-icon-active',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={decrement}
              disabled={disabled || value <= min}
              className={cn(
                'flex items-center justify-center w-4 h-3',
                'text-icon hover:bg-control-hover hover:text-icon-active',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronDown size={10} />
            </button>
          </div>
        )}
      </div>
    );
  }
);
NumberSpinner.displayName = 'NumberSpinner';

export { NumberSpinner };
