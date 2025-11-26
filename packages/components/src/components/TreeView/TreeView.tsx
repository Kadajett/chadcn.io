import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tree data */
  data: TreeNode[];
  /** Selected node IDs */
  selected?: string[];
  /** Default selected node IDs */
  defaultSelected?: string[];
  /** Expanded node IDs */
  expanded?: string[];
  /** Default expanded node IDs */
  defaultExpanded?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (ids: string[]) => void;
  /** Callback when expansion changes */
  onExpansionChange?: (ids: string[]) => void;
  /** Allow multiple selection */
  multiSelect?: boolean;
  /** Indent size in pixels */
  indentSize?: number;
  /** Show connecting lines */
  showLines?: boolean;
}

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      data,
      selected: controlledSelected,
      defaultSelected = [],
      expanded: controlledExpanded,
      defaultExpanded = [],
      onSelectionChange,
      onExpansionChange,
      multiSelect = false,
      indentSize = 16,
      showLines = false,
      ...props
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
    const [internalExpanded, setInternalExpanded] = React.useState<string[]>(defaultExpanded);

    const selected = controlledSelected ?? internalSelected;
    const expanded = controlledExpanded ?? internalExpanded;

    const handleSelect = (id: string, e: React.MouseEvent) => {
      let newSelected: string[];

      if (multiSelect && (e.ctrlKey || e.metaKey)) {
        newSelected = selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id];
      } else if (multiSelect && e.shiftKey) {
        // Simple shift selection - add to selection
        newSelected = selected.includes(id) ? selected : [...selected, id];
      } else {
        newSelected = [id];
      }

      setInternalSelected(newSelected);
      onSelectionChange?.(newSelected);
    };

    const handleToggle = (id: string) => {
      const newExpanded = expanded.includes(id)
        ? expanded.filter((e) => e !== id)
        : [...expanded, id];

      setInternalExpanded(newExpanded);
      onExpansionChange?.(newExpanded);
    };

    const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded.includes(node.id);
      const isSelected = selected.includes(node.id);

      return (
        <div key={node.id} className="select-none">
          <div
            role="treeitem"
            aria-selected={isSelected}
            aria-expanded={hasChildren ? isExpanded : undefined}
            tabIndex={0}
            onClick={(e) => !node.disabled && handleSelect(node.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!node.disabled) {
                  handleSelect(node.id, e as unknown as React.MouseEvent);
                }
              } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
                handleToggle(node.id);
              } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
                handleToggle(node.id);
              }
            }}
            className={cn(
              'flex items-center h-6 pr-2 rounded-button cursor-pointer',
              'transition-colors duration-75',
              'hover:bg-control-hover',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              isSelected && 'bg-selection text-selection-text',
              node.disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{ paddingLeft: depth * indentSize + 4 }}
          >
            {/* Expand/collapse toggle */}
            {hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(node.id);
                }}
                className={cn(
                  'flex items-center justify-center w-4 h-4 mr-0.5',
                  'text-icon-muted hover:text-icon',
                  'focus:outline-none'
                )}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : (
              <span className="w-4 mr-0.5" />
            )}

            {/* Icon */}
            {node.icon && (
              <span className="flex items-center justify-center w-4 h-4 mr-1 text-icon">
                {node.icon}
              </span>
            )}

            {/* Label */}
            <span className="text-xs truncate">{node.label}</span>
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div role="group" className={cn(showLines && 'border-l border-divider ml-2')}>
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="tree"
        aria-multiselectable={multiSelect}
        className={cn('py-1', className)}
        {...props}
      >
        {data.map((node) => renderNode(node))}
      </div>
    );
  }
);
TreeView.displayName = 'TreeView';

export { TreeView };
