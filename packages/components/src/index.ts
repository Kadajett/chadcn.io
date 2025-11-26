// Utilities
export { cn } from './lib/utils';

// Layout Components
export { Panel, PanelHeader, PanelContent, PanelGroup } from './components/Panel';
export type { PanelProps } from './components/Panel';

export {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from './components/Toolbar';
export type {
  ToolbarProps,
  ToolbarButtonProps,
  ToolbarToggleGroupProps,
  ToolbarToggleItemProps,
} from './components/Toolbar';

export { PropertyRow, PropertyGroup, PropertyDivider } from './components/PropertyRow';
export type { PropertyRowProps, PropertyGroupProps } from './components/PropertyRow';

// Input Components
export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { NumberSpinner } from './components/NumberSpinner';
export type { NumberSpinnerProps } from './components/NumberSpinner';

export { Slider, SliderWithInput } from './components/Slider';
export type { SliderProps, SliderWithInputProps } from './components/Slider';

export { Checkbox, CheckboxWithLabel } from './components/Checkbox';
export type { CheckboxProps, CheckboxWithLabelProps } from './components/Checkbox';

export { Switch, SwitchWithLabel } from './components/Switch';
export type { SwitchProps, SwitchWithLabelProps } from './components/Switch';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from './components/Select';
export type { SelectTriggerProps } from './components/Select';

export { ColorInput } from './components/ColorInput';
export type { ColorInputProps } from './components/ColorInput';

export { Button, buttonVariants } from './components/Button';
export type { ButtonProps } from './components/Button';

// Navigation Components
export { TreeView } from './components/TreeView';
export type { TreeViewProps, TreeNode } from './components/TreeView';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
export type { TabsListProps, TabsTriggerProps } from './components/Tabs';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion';
export type { AccordionTriggerProps } from './components/Accordion';

// Overlay Components
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from './components/ContextMenu';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/Tooltip';

// Utility Components
export { ScrollArea, ScrollBar } from './components/ScrollArea';
export { Separator } from './components/Separator';

// Status & Feedback Components
export {
  StatusBar,
  StatusBarItem,
  StatusBarSeparator,
  StatusBarCoordinates,
  StatusBarZoom,
  StatusBarProgress,
} from './components/StatusBar';
export type {
  StatusBarProps,
  StatusBarItemProps,
  StatusBarCoordinatesProps,
  StatusBarZoomProps,
  StatusBarProgressProps,
} from './components/StatusBar';

export { ProgressIndicator, BatchProgress } from './components/ProgressIndicator';
export type {
  ProgressIndicatorProps,
  ProgressStatus,
  BatchProgressProps,
  BatchProgressItem,
} from './components/ProgressIndicator';

export { Toast, ToastViewport, ToastProvider, useToast, createToast } from './components/Toast';
export type {
  ToastProps,
  ToastData,
  ToastType,
  ToastPosition,
  ToastViewportProps,
  ToastProviderProps,
} from './components/Toast';

// Creative Tool Components
export { LayerStack, LayerStackHeader } from './components/LayerStack';
export type { Layer, LayerStackProps, LayerStackHeaderProps } from './components/LayerStack';

export { SwatchPalette, presetPalettes } from './components/SwatchPalette';
export type { SwatchPaletteProps, Swatch, SwatchGroup } from './components/SwatchPalette';

export { GradientEditor, createDefaultGradient, gradientToCSS } from './components/GradientEditor';
export type {
  GradientEditorProps,
  GradientStop,
  GradientType,
  GradientValue,
} from './components/GradientEditor';

// Navigation Components (extended)
export { Breadcrumbs } from './components/Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './components/Breadcrumbs';

export { CommandPalette } from './components/CommandPalette';
export type { CommandPaletteProps, Command, CommandGroup } from './components/CommandPalette';

export { MenuBar } from './components/MenuBar';
export type {
  MenuBarProps,
  MenuDefinition,
  MenuItem,
  MenuAction,
  MenuCheckbox,
  MenuRadioGroup,
  MenuSeparator,
  MenuSubmenu,
} from './components/MenuBar';

// Layout Components (extended)
export { ResizablePanes, SplitPane } from './components/ResizablePanes';
export type {
  ResizablePanesProps,
  SplitPaneProps,
  PaneConfig,
  PaneDirection,
} from './components/ResizablePanes';
