import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Callback when an item is clicked */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  /** Show home icon for first item */
  showHomeIcon?: boolean;
  /** Maximum items to show before collapsing */
  maxItems?: number;
  /** Separator element */
  separator?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'default';
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      items,
      onItemClick,
      showHomeIcon = false,
      maxItems,
      separator,
      size = 'default',
      ...props
    },
    ref
  ) => {
    const displayItems = React.useMemo(() => {
      if (!maxItems || items.length <= maxItems) {
        return { items, collapsed: false, collapsedCount: 0 };
      }

      // Show first item, ellipsis, and last (maxItems - 2) items
      const first = items[0];
      const lastItems = items.slice(-(maxItems - 2));
      const collapsedCount = items.length - maxItems + 1;

      return {
        items: [first, ...lastItems],
        collapsed: true,
        collapsedCount,
        collapsedItems: items.slice(1, items.length - (maxItems - 2)),
      };
    }, [items, maxItems]);

    const sizeClasses = {
      sm: 'text-2xs h-5',
      default: 'text-xs h-6',
    };

    const defaultSeparator = (
      <ChevronRight
        size={size === 'sm' ? 10 : 12}
        className="text-icon-muted flex-shrink-0"
      />
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
        {...props}
      >
        <ol className={cn('flex items-center gap-0.5', sizeClasses[size])}>
          {displayItems.items.map((item, index) => {
            const isLast = index === displayItems.items.length - 1;
            const isFirst = index === 0;
            const originalIndex = isFirst
              ? 0
              : displayItems.collapsed && index > 0
              ? items.length - (displayItems.items.length - index)
              : index;

            return (
              <React.Fragment key={item.id}>
                {/* Collapsed indicator */}
                {displayItems.collapsed && index === 1 && (
                  <>
                    <li className="flex items-center">
                      <span className="px-1 text-text-muted">...</span>
                    </li>
                    <li className="flex items-center" aria-hidden="true">
                      {separator ?? defaultSeparator}
                    </li>
                  </>
                )}

                {/* Separator */}
                {index > 0 && !(displayItems.collapsed && index === 1) && (
                  <li className="flex items-center" aria-hidden="true">
                    {separator ?? defaultSeparator}
                  </li>
                )}

                {/* Breadcrumb item */}
                <li className="flex items-center min-w-0">
                  <button
                    type="button"
                    onClick={() => onItemClick?.(item, originalIndex)}
                    disabled={isLast}
                    className={cn(
                      'flex items-center gap-1 px-1 rounded-sm max-w-40',
                      'transition-colors duration-75',
                      isLast
                        ? 'text-text font-medium cursor-default'
                        : 'text-text-muted hover:text-text hover:bg-control-hover cursor-pointer'
                    )}
                  >
                    {isFirst && showHomeIcon ? (
                      <Home size={size === 'sm' ? 10 : 12} className="flex-shrink-0" />
                    ) : (
                      item.icon && (
                        <span className="flex-shrink-0 [&_svg]:w-3 [&_svg]:h-3">
                          {item.icon}
                        </span>
                      )
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs };
