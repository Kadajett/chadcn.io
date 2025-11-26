import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  category?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandGroup {
  id: string;
  label: string;
  commands: Command[];
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Command groups */
  groups?: CommandGroup[];
  /** Flat list of commands (alternative to groups) */
  commands?: Command[];
  /** Callback when a command is selected */
  onSelect?: (command: Command) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Filter function */
  filter?: (command: Command, search: string) => boolean;
}

const defaultFilter = (command: Command, search: string): boolean => {
  const searchLower = search.toLowerCase();
  return (
    command.label.toLowerCase().includes(searchLower) ||
    command.description?.toLowerCase().includes(searchLower) ||
    command.keywords?.some((k) => k.toLowerCase().includes(searchLower)) ||
    false
  );
};

const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      groups,
      commands,
      onSelect,
      placeholder = 'Type a command or search...',
      emptyMessage = 'No commands found.',
      filter = defaultFilter,
    },
    ref
  ) => {
    const [search, setSearch] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Normalize commands into groups
    const normalizedGroups = React.useMemo(() => {
      if (groups) return groups;
      if (commands) return [{ id: 'default', label: '', commands }];
      return [];
    }, [groups, commands]);

    // Filter commands
    const filteredGroups = React.useMemo(() => {
      if (!search) return normalizedGroups;

      return normalizedGroups
        .map((group) => ({
          ...group,
          commands: group.commands.filter((cmd) => filter(cmd, search)),
        }))
        .filter((group) => group.commands.length > 0);
    }, [normalizedGroups, search, filter]);

    // Flatten commands for keyboard navigation
    const flatCommands = React.useMemo(() => {
      return filteredGroups.flatMap((g) => g.commands);
    }, [filteredGroups]);

    // Reset selection when search changes
    React.useEffect(() => {
      setSelectedIndex(0);
    }, [search]);

    // Reset when opened
    React.useEffect(() => {
      if (open) {
        setSearch('');
        setSelectedIndex(0);
      }
    }, [open]);

    // Scroll selected item into view
    React.useEffect(() => {
      const selected = listRef.current?.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selected = flatCommands[selectedIndex];
          if (selected && !selected.disabled) {
            selected.onSelect?.();
            onSelect?.(selected);
            onOpenChange?.(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange?.(false);
          break;
      }
    };

    const handleSelect = (command: Command) => {
      if (command.disabled) return;
      command.onSelect?.();
      onSelect?.(command);
      onOpenChange?.(false);
    };

    let commandIndex = -1;

    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 animate-fade-in z-50" />
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              'fixed left-1/2 top-[20%] -translate-x-1/2 z-50',
              'w-full max-w-lg',
              'bg-panel border border-panel-border rounded-panel shadow-dropdown',
              'animate-slide-down',
              'focus:outline-none'
            )}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-panel-border">
              <Search size={16} className="text-icon-muted flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className={cn(
                  'flex-1 bg-transparent text-sm text-text',
                  'placeholder:text-text-muted',
                  'focus:outline-none'
                )}
              />
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-sunken text-2xs text-text-muted">
                esc
              </kbd>
            </div>

            {/* Command list */}
            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto py-1"
              role="listbox"
            >
              {filteredGroups.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-text-muted">
                  {emptyMessage}
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.id} role="group">
                    {group.label && (
                      <div className="px-3 py-1 text-2xs text-text-muted font-medium">
                        {group.label}
                      </div>
                    )}
                    {group.commands.map((command) => {
                      commandIndex++;
                      const isSelected = commandIndex === selectedIndex;

                      return (
                        <div
                          key={command.id}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={command.disabled}
                          data-selected={isSelected}
                          onClick={() => handleSelect(command)}
                          onMouseEnter={() => setSelectedIndex(commandIndex)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 cursor-pointer',
                            'transition-colors duration-75',
                            isSelected
                              ? 'bg-selection text-selection-text'
                              : 'text-text',
                            command.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {command.icon && (
                            <span className={cn(
                              'flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4',
                              isSelected ? 'opacity-80' : 'text-icon'
                            )}>
                              {command.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">{command.label}</div>
                            {command.description && (
                              <div className={cn(
                                'text-2xs truncate',
                                isSelected ? 'opacity-70' : 'text-text-muted'
                              )}>
                                {command.description}
                              </div>
                            )}
                          </div>
                          {command.shortcut && (
                            <div className="flex items-center gap-0.5">
                              {command.shortcut.map((key, i) => (
                                <kbd
                                  key={i}
                                  className={cn(
                                    'px-1.5 py-0.5 rounded text-2xs font-mono',
                                    isSelected
                                      ? 'bg-white/20'
                                      : 'bg-surface-sunken text-text-muted'
                                  )}
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
);
CommandPalette.displayName = 'CommandPalette';

export { CommandPalette };
