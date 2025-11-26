export interface Theme {
  name: string;
  label: string;
  description: string;
}

export const THEMES: Theme[] = [
  // Creative Tools
  {
    name: 'photoshop',
    label: 'Photoshop',
    description: 'Adobe Photoshop-inspired dark theme',
  },
  {
    name: 'blender',
    label: 'Blender',
    description: 'Blender 3D-inspired darker theme',
  },
  {
    name: 'gimp',
    label: 'GIMP',
    description: 'GIMP-inspired dark theme',
  },
  {
    name: 'vscode',
    label: 'VS Code',
    description: 'Visual Studio Code-inspired theme',
  },
  // Daisy-UI Inspired
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon pink and cyan on dark - futuristic',
  },
  {
    name: 'synthwave',
    label: 'Synthwave',
    description: 'Retro 80s purple and pink vibes',
  },
  {
    name: 'dracula',
    label: 'Dracula',
    description: 'Popular dark theme with purple accent',
  },
  {
    name: 'nord',
    label: 'Nord',
    description: 'Arctic, bluish color palette',
  },
  {
    name: 'retro',
    label: 'Retro',
    description: 'Warm cream and brown tones',
  },
  {
    name: 'coffee',
    label: 'Coffee',
    description: 'Rich coffee browns - warm and cozy',
  },
  {
    name: 'sunset',
    label: 'Sunset',
    description: 'Warm orange and purple gradient',
  },
  {
    name: 'aqua',
    label: 'Aqua',
    description: 'Ocean blue-green theme',
  },
  // Retro OS Themes
  {
    name: 'win95',
    label: 'Windows 95/98',
    description: 'Classic 3D beveled look from the 90s',
  },
  {
    name: 'winxp',
    label: 'Windows XP',
    description: 'Luna Blue theme from Windows XP',
  },
  {
    name: 'macos9',
    label: 'Mac OS 9',
    description: 'Classic Platinum appearance',
  },
  // Accessibility
  {
    name: 'light',
    label: 'Light',
    description: 'Light theme for accessibility',
  },
  {
    name: 'high-contrast',
    label: 'High Contrast',
    description: 'High contrast theme for accessibility',
  },
];

export interface ComponentDef {
  name: string;
  description: string;
  dependencies?: string[];
  npmDependencies?: string[];
  files: string[];
}

export const COMPONENTS: ComponentDef[] = [
  {
    name: 'button',
    description: 'Compact button with multiple variants',
    npmDependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    files: ['Button/Button.tsx', 'Button/index.ts'],
  },
  {
    name: 'input',
    description: 'Compact text input field',
    files: ['Input/Input.tsx', 'Input/index.ts'],
  },
  {
    name: 'number-spinner',
    description: 'Number input with increment/decrement and scrubbing',
    npmDependencies: ['lucide-react'],
    files: ['NumberSpinner/NumberSpinner.tsx', 'NumberSpinner/index.ts'],
  },
  {
    name: 'slider',
    description: 'Slider with optional value input',
    npmDependencies: ['@radix-ui/react-slider'],
    files: ['Slider/Slider.tsx', 'Slider/index.ts'],
  },
  {
    name: 'checkbox',
    description: 'Compact checkbox with optional label',
    npmDependencies: ['@radix-ui/react-checkbox', 'lucide-react'],
    files: ['Checkbox/Checkbox.tsx', 'Checkbox/index.ts'],
  },
  {
    name: 'switch',
    description: 'Compact toggle switch',
    npmDependencies: ['@radix-ui/react-switch'],
    files: ['Switch/Switch.tsx', 'Switch/index.ts'],
  },
  {
    name: 'select',
    description: 'Compact dropdown select',
    npmDependencies: ['@radix-ui/react-select', 'lucide-react'],
    files: ['Select/Select.tsx', 'Select/index.ts'],
  },
  {
    name: 'color-input',
    description: 'Color picker with hex input and presets',
    npmDependencies: ['@radix-ui/react-popover'],
    files: ['ColorInput/ColorInput.tsx', 'ColorInput/index.ts'],
  },
  {
    name: 'panel',
    description: 'Collapsible panel container',
    npmDependencies: ['@radix-ui/react-collapsible', 'lucide-react'],
    files: ['Panel/Panel.tsx', 'Panel/index.ts'],
  },
  {
    name: 'toolbar',
    description: 'Toolbar with buttons and toggle groups',
    npmDependencies: ['@radix-ui/react-toggle-group', '@radix-ui/react-tooltip', 'lucide-react'],
    files: ['Toolbar/Toolbar.tsx', 'Toolbar/index.ts'],
  },
  {
    name: 'property-row',
    description: 'Label + control row for property panels',
    npmDependencies: ['@radix-ui/react-label'],
    files: ['PropertyRow/PropertyRow.tsx', 'PropertyRow/index.ts'],
  },
  {
    name: 'tree-view',
    description: 'Hierarchical tree with selection and expansion',
    npmDependencies: ['lucide-react'],
    files: ['TreeView/TreeView.tsx', 'TreeView/index.ts'],
  },
  {
    name: 'tabs',
    description: 'Tabbed interface with multiple variants',
    npmDependencies: ['@radix-ui/react-tabs'],
    files: ['Tabs/Tabs.tsx', 'Tabs/index.ts'],
  },
  {
    name: 'accordion',
    description: 'Collapsible accordion sections',
    npmDependencies: ['@radix-ui/react-accordion', 'lucide-react'],
    files: ['Accordion/Accordion.tsx', 'Accordion/index.ts'],
  },
  {
    name: 'context-menu',
    description: 'Right-click context menu',
    npmDependencies: ['@radix-ui/react-context-menu', 'lucide-react'],
    files: ['ContextMenu/ContextMenu.tsx', 'ContextMenu/index.ts'],
  },
  {
    name: 'tooltip',
    description: 'Tooltip overlay',
    npmDependencies: ['@radix-ui/react-tooltip'],
    files: ['Tooltip/Tooltip.tsx', 'Tooltip/index.ts'],
  },
  {
    name: 'scroll-area',
    description: 'Custom scrollable area',
    npmDependencies: ['@radix-ui/react-scroll-area'],
    files: ['ScrollArea/ScrollArea.tsx', 'ScrollArea/index.ts'],
  },
  {
    name: 'separator',
    description: 'Visual divider',
    npmDependencies: ['@radix-ui/react-separator'],
    files: ['Separator/Separator.tsx', 'Separator/index.ts'],
  },
];

export interface ComponentFile {
  name: string;
  content: string;
}

export function getComponentFiles(componentName: string): ComponentFile[] {
  const component = COMPONENTS.find((c) => c.name === componentName);
  if (!component) return [];

  // In a real implementation, this would fetch from a registry or generate the files
  // For now, return placeholder that directs users to copy from the package
  return component.files.map((file) => ({
    name: file,
    content: `// ${file}
// Copy this file from @chadcn/ui/src/components/${file}
// Or install @chadcn/ui directly: npm install @chadcn/ui

export {};
`,
  }));
}
