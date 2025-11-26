import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../lib/utils';

export interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'defaultValue'> {
  /** Current color value (hex) */
  value?: string;
  /** Default color for uncontrolled mode */
  defaultValue?: string;
  /** Callback when color changes */
  onChange?: (color: string) => void;
  /** Show hex input field */
  showInput?: boolean;
  /** Preset colors to display */
  presets?: string[];
  /** Size variant */
  size?: 'sm' | 'default';
}

const defaultPresets = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff',
  '#808080', '#c0c0c0', '#800000', '#008000', '#000080',
  '#808000', '#800080', '#008080', '#ff8080', '#80ff80',
];

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = '#000000',
      onChange,
      showInput = true,
      presets = defaultPresets,
      size = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [inputText, setInputText] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const value = controlledValue ?? internalValue;

    const updateColor = (newColor: string) => {
      // Ensure valid hex format
      const hex = newColor.startsWith('#') ? newColor : `#${newColor}`;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        setInternalValue(hex);
        onChange?.(hex);
      }
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true);
      setInputText(value.replace('#', ''));
      e.target.select();
    };

    const handleInputBlur = () => {
      setIsEditing(false);
      updateColor(inputText);
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

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateColor(e.target.value);
    };

    const sizeClasses = {
      sm: 'h-5',
      default: 'h-6',
    };

    const swatchSizeClasses = {
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
    };

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            'flex items-center gap-1 rounded-control overflow-hidden',
            'bg-input border border-input-border',
            'focus-within:border-accent',
            disabled && 'opacity-50 cursor-not-allowed',
            sizeClasses[size],
            className
          )}
        >
          <PopoverPrimitive.Trigger asChild disabled={disabled}>
            <button
              type="button"
              className={cn(
                'flex-shrink-0 rounded-button m-0.5 cursor-pointer',
                'border border-control-border',
                'focus:outline-none focus:ring-1 focus:ring-accent',
                swatchSizeClasses[size]
              )}
              style={{ backgroundColor: value }}
            />
          </PopoverPrimitive.Trigger>

          {showInput && (
            <>
              <span className="text-text-muted text-xs">#</span>
              <input
                ref={ref}
                type="text"
                maxLength={6}
                value={isEditing ? inputText : value.replace('#', '').toUpperCase()}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                disabled={disabled}
                className={cn(
                  'flex-1 h-full bg-transparent pr-1 text-xs text-text uppercase',
                  'focus:outline-none min-w-0 font-mono'
                )}
                {...props}
              />
            </>
          )}

          {/* Hidden native color input for system picker */}
          <input
            type="color"
            value={value}
            onChange={handleNativeChange}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
          />
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className={cn(
              'z-50 p-2 rounded-control',
              'bg-surface-overlay border border-panel-border shadow-dropdown',
              'animate-fade-in'
            )}
          >
            <div className="grid grid-cols-5 gap-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    updateColor(preset);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-5 h-5 rounded-button border border-control-border',
                    'hover:scale-110 transition-transform',
                    'focus:outline-none focus:ring-1 focus:ring-accent',
                    value.toLowerCase() === preset.toLowerCase() && 'ring-1 ring-accent'
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-divider">
              <label className="flex items-center gap-2">
                <span className="text-2xs text-text-muted">Custom:</span>
                <input
                  type="color"
                  value={value}
                  onChange={handleNativeChange}
                  className="w-full h-5 cursor-pointer bg-transparent"
                />
              </label>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);
ColorInput.displayName = 'ColorInput';

export { ColorInput };
