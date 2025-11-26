import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel title displayed in header */
  title?: string;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Icon to show in header */
  icon?: React.ReactNode;
  /** Actions to show in header (buttons, etc.) */
  headerActions?: React.ReactNode;
  /** Remove padding from content */
  noPadding?: boolean;
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      title,
      collapsible = false,
      defaultCollapsed = false,
      collapsed,
      onCollapsedChange,
      icon,
      headerActions,
      noPadding = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const actualCollapsed = collapsed ?? isCollapsed;

    const handleCollapsedChange = (open: boolean) => {
      const newCollapsed = !open;
      setIsCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
    };

    if (collapsible) {
      return (
        <CollapsiblePrimitive.Root
          open={!actualCollapsed}
          onOpenChange={handleCollapsedChange}
          asChild
        >
          <div
            ref={ref}
            className={cn('bg-panel border border-panel-border rounded-panel', className)}
            {...props}
          >
            <CollapsiblePrimitive.Trigger asChild>
              <PanelHeader collapsible collapsed={actualCollapsed} icon={icon} actions={headerActions}>
                {title}
              </PanelHeader>
            </CollapsiblePrimitive.Trigger>
            <CollapsiblePrimitive.Content>
              <PanelContent noPadding={noPadding}>{children}</PanelContent>
            </CollapsiblePrimitive.Content>
          </div>
        </CollapsiblePrimitive.Root>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('bg-panel border border-panel-border rounded-panel', className)}
        {...props}
      >
        {title && (
          <PanelHeader icon={icon} actions={headerActions}>
            {title}
          </PanelHeader>
        )}
        <PanelContent noPadding={noPadding}>{children}</PanelContent>
      </div>
    );
  }
);
Panel.displayName = 'Panel';

interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean;
  collapsed?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ className, collapsible, collapsed, icon, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1 h-6 px-2 bg-panel-header border-b border-panel-border',
          'text-text-label text-xs font-medium select-none',
          collapsible && 'cursor-pointer hover:bg-surface-raised',
          className
        )}
        {...props}
      >
        {collapsible && (
          <span className="flex-shrink-0 text-icon-muted">
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        )}
        {icon && <span className="flex-shrink-0 text-icon-muted">{icon}</span>}
        <span className="flex-1 truncate">{children}</span>
        {actions && (
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
    );
  }
);
PanelHeader.displayName = 'PanelHeader';

interface PanelContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const PanelContent = React.forwardRef<HTMLDivElement, PanelContentProps>(
  ({ className, noPadding, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(!noPadding && 'p-2', className)} {...props}>
        {children}
      </div>
    );
  }
);
PanelContent.displayName = 'PanelContent';

interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of panel stack */
  direction?: 'horizontal' | 'vertical';
}

const PanelGroup = React.forwardRef<HTMLDivElement, PanelGroupProps>(
  ({ className, direction = 'vertical', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col gap-0.5' : 'flex-row gap-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PanelGroup.displayName = 'PanelGroup';

export { Panel, PanelHeader, PanelContent, PanelGroup };
