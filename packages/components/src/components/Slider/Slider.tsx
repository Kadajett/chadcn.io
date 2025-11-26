import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange'> {
  /** Current value */
  value?: number;
  /** Default value for uncontrolled mode */
  defaultValue?: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Show value label */
  showValue?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** Size variant */
  size?: 'sm' | 'default';
  /** Fill style variant */
  variant?: 'default' | 'gradient';
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onValueChange,
      showValue = false,
      formatValue = (v) => v.toString(),
      size = 'default',
      variant = 'default',
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState([defaultValue]);
    const currentValue = value !== undefined ? [value] : internalValue;

    const handleValueChange = (values: number[]) => {
      setInternalValue(values);
      onValueChange?.(values[0]);
    };

    const sizeClasses = {
      sm: {
        root: 'h-4',
        track: 'h-1',
        thumb: 'h-3 w-3',
      },
      default: {
        root: 'h-5',
        track: 'h-1.5',
        thumb: 'h-3.5 w-3.5',
      },
    };

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          className={cn(
            'relative flex w-full touch-none select-none items-center',
            sizeClasses[size].root,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        >
          <SliderPrimitive.Track
            className={cn(
              'relative w-full grow overflow-hidden rounded-full bg-input',
              sizeClasses[size].track
            )}
          >
            <SliderPrimitive.Range
              className={cn(
                'absolute h-full',
                variant === 'default' && 'bg-accent',
                variant === 'gradient' && 'bg-gradient-to-r from-accent-muted to-accent'
              )}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              'block rounded-full bg-text border border-control-border',
              'ring-offset-surface transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              'disabled:pointer-events-none',
              'shadow-control',
              sizeClasses[size].thumb
            )}
          />
        </SliderPrimitive.Root>
        {showValue && (
          <span className="text-xs text-text-muted w-8 text-right tabular-nums">
            {formatValue(currentValue[0])}
          </span>
        )}
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export interface SliderWithInputProps extends Omit<SliderProps, 'showValue'> {
  /** Input width */
  inputWidth?: string;
  /** Suffix for the input (e.g., "px", "%") */
  suffix?: string;
}

const SliderWithInput = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderWithInputProps
>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      inputWidth = 'w-12',
      suffix,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [inputText, setInputText] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);

    const currentValue = value ?? internalValue;

    const updateValue = (newValue: number) => {
      const clamped = Math.min(max, Math.max(min, newValue));
      setInternalValue(clamped);
      onValueChange?.(clamped);
    };

    const handleSliderChange = (values: number[]) => {
      updateValue(values[0]);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true);
      setInputText(currentValue.toString());
      e.target.select();
    };

    const handleInputBlur = () => {
      setIsEditing(false);
      const parsed = parseFloat(inputText);
      if (!isNaN(parsed)) {
        updateValue(parsed);
      }
      setInputText('');
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        setInputText('');
        e.currentTarget.blur();
      }
    };

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={[currentValue]}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className={cn(
            'relative flex flex-1 touch-none select-none items-center h-5',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative w-full grow overflow-hidden rounded-full bg-input h-1.5">
            <SliderPrimitive.Range className="absolute h-full bg-accent" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              'block h-3.5 w-3.5 rounded-full bg-text border border-control-border',
              'ring-offset-surface transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              'disabled:pointer-events-none shadow-control'
            )}
          />
        </SliderPrimitive.Root>
        <div
          className={cn(
            'flex items-center h-6 rounded-control overflow-hidden',
            'bg-input border border-input-border',
            'focus-within:border-accent',
            inputWidth
          )}
        >
          <input
            type="text"
            inputMode="numeric"
            value={isEditing ? inputText : currentValue}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            className="flex-1 h-full bg-transparent px-1 text-xs text-text text-right focus:outline-none min-w-0"
          />
          {suffix && (
            <span className="text-2xs text-text-muted pr-1">{suffix}</span>
          )}
        </div>
      </div>
    );
  }
);
SliderWithInput.displayName = 'SliderWithInput';

export { Slider, SliderWithInput };
