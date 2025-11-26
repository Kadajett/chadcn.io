import * as React from 'react';
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MenuAction {
  type: 'action';
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuCheckbox {
  type: 'checkbox';
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface MenuRadioGroup {
  type: 'radio-group';
  id: string;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  items: {
    id: string;
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}

export interface MenuSeparator {
  type: 'separator';
}

export interface MenuSubmenu {
  type: 'submenu';
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  items: MenuItem[];
}

export type MenuItem = MenuAction | MenuCheckbox | MenuRadioGroup | MenuSeparator | MenuSubmenu;

export interface MenuDefinition {
  id: string;
  label: string;
  items: MenuItem[];
}

export interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Menu definitions */
  menus: MenuDefinition[];
  /** Size variant */
  size?: 'sm' | 'default';
}

const MenuBarItem: React.FC<{
  item: MenuItem;
  size: 'sm' | 'default';
}> = ({ item, size }) => {
  const itemClasses = cn(
    'relative flex items-center gap-2 px-2 rounded-sm cursor-pointer',
    'text-text select-none outline-none',
    'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    'data-[highlighted]:bg-selection data-[highlighted]:text-selection-text',
    size === 'sm' ? 'py-0.5 text-2xs' : 'py-1 text-xs'
  );

  if (item.type === 'separator') {
    return (
      <MenuPrimitive.Separator className="h-px my-1 bg-panel-border" />
    );
  }

  if (item.type === 'checkbox') {
    return (
      <MenuPrimitive.CheckboxItem
        className={itemClasses}
        checked={item.checked}
        onCheckedChange={item.onCheckedChange}
        disabled={item.disabled}
      >
        <div className="w-4 flex items-center justify-center">
          <MenuPrimitive.ItemIndicator>
            <Check size={12} />
          </MenuPrimitive.ItemIndicator>
        </div>
        <span className="flex-1">{item.label}</span>
      </MenuPrimitive.CheckboxItem>
    );
  }

  if (item.type === 'radio-group') {
    return (
      <MenuPrimitive.RadioGroup
        value={item.value}
        onValueChange={item.onValueChange}
      >
        {item.label && (
          <MenuPrimitive.Label className="px-2 py-1 text-2xs text-text-muted">
            {item.label}
          </MenuPrimitive.Label>
        )}
        {item.items.map((radioItem) => (
          <MenuPrimitive.RadioItem
            key={radioItem.id}
            value={radioItem.value}
            disabled={radioItem.disabled}
            className={itemClasses}
          >
            <div className="w-4 flex items-center justify-center">
              <MenuPrimitive.ItemIndicator>
                <Circle size={6} className="fill-current" />
              </MenuPrimitive.ItemIndicator>
            </div>
            <span className="flex-1">{radioItem.label}</span>
          </MenuPrimitive.RadioItem>
        ))}
      </MenuPrimitive.RadioGroup>
    );
  }

  if (item.type === 'submenu') {
    return (
      <MenuPrimitive.Sub>
        <MenuPrimitive.SubTrigger
          className={cn(itemClasses, 'data-[state=open]:bg-selection data-[state=open]:text-selection-text')}
          disabled={item.disabled}
        >
          {item.icon && (
            <span className="w-4 flex items-center justify-center [&_svg]:w-3 [&_svg]:h-3">
              {item.icon}
            </span>
          )}
          <span className="flex-1">{item.label}</span>
          <ChevronRight size={12} className="ml-auto" />
        </MenuPrimitive.SubTrigger>
        <MenuPrimitive.Portal>
          <MenuPrimitive.SubContent
            className={cn(
              'min-w-[160px] p-1 rounded-panel',
              'bg-panel border border-panel-border shadow-dropdown',
              'animate-fade-in z-50'
            )}
            sideOffset={2}
            alignOffset={-5}
          >
            {item.items.map((subItem, i) => (
              <MenuBarItem
                key={subItem.type === 'separator' ? `sep-${i}` : (subItem as MenuAction).id}
                item={subItem}
                size={size}
              />
            ))}
          </MenuPrimitive.SubContent>
        </MenuPrimitive.Portal>
      </MenuPrimitive.Sub>
    );
  }

  // Default action item
  return (
    <MenuPrimitive.Item
      className={itemClasses}
      disabled={item.disabled}
      onSelect={item.onSelect}
    >
      {item.icon && (
        <span className="w-4 flex items-center justify-center [&_svg]:w-3 [&_svg]:h-3">
          {item.icon}
        </span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <span className="ml-auto text-text-muted text-2xs">
          {item.shortcut}
        </span>
      )}
    </MenuPrimitive.Item>
  );
};

const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, menus, size = 'default', ...props }, ref) => {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-0.5 px-1',
          'bg-panel border-b border-panel-border',
          size === 'sm' ? 'h-6' : 'h-7',
          className
        )}
        {...props}
      >
        {menus.map((menu) => (
          <MenuPrimitive.Root
            key={menu.id}
            open={openMenu === menu.id}
            onOpenChange={(open) => setOpenMenu(open ? menu.id : null)}
          >
            <MenuPrimitive.Trigger
              className={cn(
                'px-2 rounded-sm transition-colors',
                'text-text select-none outline-none',
                'hover:bg-control-hover',
                'data-[state=open]:bg-selection data-[state=open]:text-selection-text',
                size === 'sm' ? 'py-0.5 text-2xs' : 'py-1 text-xs'
              )}
              onMouseEnter={() => {
                if (openMenu !== null && openMenu !== menu.id) {
                  setOpenMenu(menu.id);
                }
              }}
            >
              {menu.label}
            </MenuPrimitive.Trigger>
            <MenuPrimitive.Portal>
              <MenuPrimitive.Content
                className={cn(
                  'min-w-[180px] p-1 rounded-panel',
                  'bg-panel border border-panel-border shadow-dropdown',
                  'animate-slide-down z-50'
                )}
                sideOffset={2}
                align="start"
              >
                {menu.items.map((item, i) => (
                  <MenuBarItem
                    key={item.type === 'separator' ? `sep-${i}` : (item as MenuAction).id}
                    item={item}
                    size={size}
                  />
                ))}
              </MenuPrimitive.Content>
            </MenuPrimitive.Portal>
          </MenuPrimitive.Root>
        ))}
      </div>
    );
  }
);
MenuBar.displayName = 'MenuBar';

export { MenuBar };
