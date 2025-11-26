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
  /** Sensitivity multiplier for drag (higher = faster value change) */
  dragSensitivity?: number;
}

const SliderWithInput = React.forwardRef<
  HTMLDivElement,
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
      inputWidth = 'w-16',
      suffix,
      disabled,
      dragSensitivity = 1,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [inputText, setInputText] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartRef = React.useRef<{ x: number; value: number } | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const hasMovedRef = React.useRef(false);

    const currentValue = value ?? internalValue;

    const updateValue = (newValue: number) => {
      const stepped = Math.round(newValue / step) * step;
      const clamped = Math.min(max, Math.max(min, stepped));
      setInternalValue(clamped);
      onValueChange?.(clamped);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isDragging) {
        e.target.blur();
        return;
      }
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
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateValue(currentValue + step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateValue(currentValue - step);
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled || isEditing) return;
      e.preventDefault();
      dragStartRef.current = { x: e.clientX, value: currentValue };
      hasMovedRef.current = false;
    };

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragStartRef.current) return;
        const delta = e.clientX - dragStartRef.current.x;
        const dragThreshold = 3;

        if (!hasMovedRef.current && Math.abs(delta) > dragThreshold) {
          hasMovedRef.current = true;
          setIsDragging(true);
          document.body.style.cursor = 'ew-resize';
        }

        if (hasMovedRef.current) {
          const range = max - min;
          const sensitivity = (range / 200) * dragSensitivity;
          const newValue = dragStartRef.current.value + delta * sensitivity;
          updateValue(newValue);
        }
      };

      const handleMouseUp = () => {
        if (dragStartRef.current && !hasMovedRef.current) {
          inputRef.current?.focus();
        }
        setIsDragging(false);
        dragStartRef.current = null;
        hasMovedRef.current = false;
        document.body.style.cursor = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [max, min, dragSensitivity]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center h-6 rounded-control overflow-hidden',
          'bg-input border border-input-border',
          'focus-within:border-accent',
          !disabled && !isEditing && 'cursor-ew-resize',
          disabled && 'opacity-50 cursor-not-allowed',
          isDragging && 'border-accent',
          inputWidth,
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={isEditing ? inputText : currentValue}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          className={cn(
            'flex-1 h-full bg-transparent px-1.5 text-xs text-text text-right focus:outline-none min-w-0',
            !isEditing && 'cursor-ew-resize select-none'
          )}
        />
        {suffix && (
          <span className="text-2xs text-text-muted pr-1.5 select-none">{suffix}</span>
        )}
      </div>
    );
  }
);
SliderWithInput.displayName = 'SliderWithInput';

export { Slider, SliderWithInput };
