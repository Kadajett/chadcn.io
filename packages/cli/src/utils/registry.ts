import { TEMPLATES } from './templates.js';

export interface Theme {
  name: string;
  label: string;
  description: string;
  category: 'creative' | 'daisyui' | 'retro-os' | 'accessibility';
}

export const THEMES: Theme[] = [
  // Creative Tools
  { name: 'photoshop', label: 'Photoshop', description: 'Adobe Photoshop-inspired dark theme', category: 'creative' },
  { name: 'blender', label: 'Blender', description: 'Blender 3D-inspired darker theme', category: 'creative' },
  { name: 'gimp', label: 'GIMP', description: 'GIMP-inspired dark theme', category: 'creative' },
  { name: 'vscode', label: 'VS Code', description: 'Visual Studio Code-inspired theme', category: 'creative' },
  // Daisy-UI Inspired
  { name: 'cyberpunk', label: 'Cyberpunk', description: 'Neon pink and cyan on dark - futuristic', category: 'daisyui' },
  { name: 'synthwave', label: 'Synthwave', description: 'Retro 80s purple and pink vibes', category: 'daisyui' },
  { name: 'dracula', label: 'Dracula', description: 'Popular dark theme with purple accent', category: 'daisyui' },
  { name: 'nord', label: 'Nord', description: 'Arctic, bluish color palette', category: 'daisyui' },
  { name: 'retro', label: 'Retro', description: 'Warm cream and brown tones', category: 'daisyui' },
  { name: 'coffee', label: 'Coffee', description: 'Rich coffee browns - warm and cozy', category: 'daisyui' },
  { name: 'sunset', label: 'Sunset', description: 'Warm orange and purple gradient', category: 'daisyui' },
  { name: 'aqua', label: 'Aqua', description: 'Ocean blue-green theme', category: 'daisyui' },
  // Retro OS Themes
  { name: 'win95', label: 'Windows 95/98', description: 'Classic 3D beveled look from the 90s', category: 'retro-os' },
  { name: 'winxp', label: 'Windows XP', description: 'Luna Blue theme from Windows XP', category: 'retro-os' },
  { name: 'macos9', label: 'Mac OS 9', description: 'Classic Platinum appearance', category: 'retro-os' },
  // Accessibility
  { name: 'light', label: 'Light', description: 'Light theme for accessibility', category: 'accessibility' },
  { name: 'high-contrast', label: 'High Contrast', description: 'High contrast theme for accessibility', category: 'accessibility' },
];

export interface ComponentDef {
  name: string;
  description: string;
  category: 'input' | 'layout' | 'navigation' | 'overlay' | 'feedback' | 'creative' | 'utility';
  dependencies?: string[]; // Other chadcn components this depends on
  npmDependencies?: string[]; // npm packages required
  devDependencies?: string[]; // npm dev dependencies
  files: string[]; // File paths relative to component dir
  registryDependencies?: string[]; // For compatibility with shadcn registry format
}

export const COMPONENTS: ComponentDef[] = [
  // Input Components
  {
    name: 'button',
    description: 'Compact button with multiple variants (default, primary, ghost, destructive, outline)',
    category: 'input',
    npmDependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    files: ['Button/Button.tsx', 'Button/index.ts'],
  },
  {
    name: 'input',
    description: 'Compact text input field with ghost variant',
    category: 'input',
    files: ['Input/Input.tsx', 'Input/index.ts'],
  },
  {
    name: 'number-spinner',
    description: 'Number input with increment/decrement buttons and mouse scrubbing',
    category: 'input',
    npmDependencies: ['lucide-react'],
    files: ['NumberSpinner/NumberSpinner.tsx', 'NumberSpinner/index.ts'],
  },
  {
    name: 'slider',
    description: 'Slider with optional value input display',
    category: 'input',
    npmDependencies: ['@radix-ui/react-slider'],
    files: ['Slider/Slider.tsx', 'Slider/index.ts'],
  },
  {
    name: 'checkbox',
    description: 'Compact checkbox with optional label',
    category: 'input',
    npmDependencies: ['@radix-ui/react-checkbox', 'lucide-react'],
    files: ['Checkbox/Checkbox.tsx', 'Checkbox/index.ts'],
  },
  {
    name: 'switch',
    description: 'Compact toggle switch',
    category: 'input',
    npmDependencies: ['@radix-ui/react-switch'],
    files: ['Switch/Switch.tsx', 'Switch/index.ts'],
  },
  {
    name: 'select',
    description: 'Compact dropdown select with groups and separators',
    category: 'input',
    npmDependencies: ['@radix-ui/react-select', 'lucide-react'],
    files: ['Select/Select.tsx', 'Select/index.ts'],
  },
  {
    name: 'color-input',
    description: 'Color picker with hex input, eyedropper, and preset swatches',
    category: 'input',
    npmDependencies: ['@radix-ui/react-popover'],
    files: ['ColorInput/ColorInput.tsx', 'ColorInput/index.ts'],
  },

  // Layout Components
  {
    name: 'panel',
    description: 'Collapsible panel container with header and drag handle',
    category: 'layout',
    npmDependencies: ['@radix-ui/react-collapsible', 'lucide-react'],
    files: ['Panel/Panel.tsx', 'Panel/index.ts'],
  },
  {
    name: 'toolbar',
    description: 'Toolbar with buttons, separators, and toggle groups',
    category: 'layout',
    npmDependencies: ['@radix-ui/react-toggle-group', '@radix-ui/react-tooltip', 'lucide-react'],
    dependencies: ['tooltip'],
    files: ['Toolbar/Toolbar.tsx', 'Toolbar/index.ts'],
  },
  {
    name: 'property-row',
    description: 'Label + control row layout for property panels',
    category: 'layout',
    npmDependencies: ['@radix-ui/react-label'],
    files: ['PropertyRow/PropertyRow.tsx', 'PropertyRow/index.ts'],
  },
  {
    name: 'resizable-panes',
    description: 'Resizable split pane layout with draggable dividers',
    category: 'layout',
    npmDependencies: ['lucide-react'],
    files: ['ResizablePanes/ResizablePanes.tsx', 'ResizablePanes/index.ts'],
  },

  // Navigation Components
  {
    name: 'tree-view',
    description: 'Hierarchical tree with selection, expansion, and drag-and-drop',
    category: 'navigation',
    npmDependencies: ['lucide-react'],
    files: ['TreeView/TreeView.tsx', 'TreeView/index.ts'],
  },
  {
    name: 'tabs',
    description: 'Tabbed interface with underline, pills, and compact variants',
    category: 'navigation',
    npmDependencies: ['@radix-ui/react-tabs'],
    files: ['Tabs/Tabs.tsx', 'Tabs/index.ts'],
  },
  {
    name: 'accordion',
    description: 'Collapsible accordion sections',
    category: 'navigation',
    npmDependencies: ['@radix-ui/react-accordion', 'lucide-react'],
    files: ['Accordion/Accordion.tsx', 'Accordion/index.ts'],
  },
  {
    name: 'breadcrumbs',
    description: 'Breadcrumb navigation with customizable separator',
    category: 'navigation',
    npmDependencies: ['lucide-react'],
    files: ['Breadcrumbs/Breadcrumbs.tsx', 'Breadcrumbs/index.ts'],
  },
  {
    name: 'command-palette',
    description: 'Command palette with search, keyboard navigation, and grouping',
    category: 'navigation',
    npmDependencies: ['@radix-ui/react-dialog', 'lucide-react'],
    files: ['CommandPalette/CommandPalette.tsx', 'CommandPalette/index.ts'],
  },
  {
    name: 'menu-bar',
    description: 'Application menu bar with submenus, checkboxes, and radio groups',
    category: 'navigation',
    npmDependencies: ['@radix-ui/react-dropdown-menu', 'lucide-react'],
    files: ['MenuBar/MenuBar.tsx', 'MenuBar/index.ts'],
  },

  // Overlay Components
  {
    name: 'context-menu',
    description: 'Right-click context menu with items, submenus, and shortcuts',
    category: 'overlay',
    npmDependencies: ['@radix-ui/react-context-menu', 'lucide-react'],
    files: ['ContextMenu/ContextMenu.tsx', 'ContextMenu/index.ts'],
  },
  {
    name: 'tooltip',
    description: 'Tooltip overlay with configurable delay',
    category: 'overlay',
    npmDependencies: ['@radix-ui/react-tooltip'],
    files: ['Tooltip/Tooltip.tsx', 'Tooltip/index.ts'],
  },

  // Feedback Components
  {
    name: 'status-bar',
    description: 'Application status bar with coordinates, zoom, and progress',
    category: 'feedback',
    files: ['StatusBar/StatusBar.tsx', 'StatusBar/index.ts'],
  },
  {
    name: 'progress-indicator',
    description: 'Progress bar with percentage, ETA, pause/resume, and cancel',
    category: 'feedback',
    npmDependencies: ['lucide-react'],
    files: ['ProgressIndicator/ProgressIndicator.tsx', 'ProgressIndicator/index.ts'],
  },
  {
    name: 'toast',
    description: 'Toast notifications with types (info, success, warning, error)',
    category: 'feedback',
    npmDependencies: ['@radix-ui/react-toast', 'lucide-react'],
    files: ['Toast/Toast.tsx', 'Toast/index.ts'],
  },

  // Creative Tool Components
  {
    name: 'layer-stack',
    description: 'Layer management panel with visibility, lock, and reordering',
    category: 'creative',
    npmDependencies: ['lucide-react'],
    files: ['LayerStack/LayerStack.tsx', 'LayerStack/index.ts'],
  },
  {
    name: 'swatch-palette',
    description: 'Color swatch palette with groups, add/remove, and presets',
    category: 'creative',
    npmDependencies: ['lucide-react'],
    files: ['SwatchPalette/SwatchPalette.tsx', 'SwatchPalette/index.ts'],
  },
  {
    name: 'gradient-editor',
    description: 'Gradient editor with draggable color stops and angle control',
    category: 'creative',
    npmDependencies: ['lucide-react'],
    files: ['GradientEditor/GradientEditor.tsx', 'GradientEditor/index.ts'],
  },

  // Utility Components
  {
    name: 'scroll-area',
    description: 'Custom scrollable area with styled scrollbars',
    category: 'utility',
    npmDependencies: ['@radix-ui/react-scroll-area'],
    files: ['ScrollArea/ScrollArea.tsx', 'ScrollArea/index.ts'],
  },
  {
    name: 'separator',
    description: 'Visual divider (horizontal or vertical)',
    category: 'utility',
    npmDependencies: ['@radix-ui/react-separator'],
    files: ['Separator/Separator.tsx', 'Separator/index.ts'],
  },
];

// Base URL for fetching component templates
const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/kadajett/chadcn/main/packages/components/src/components';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/kadajett/chadcn/main/packages/components/src';

export interface ComponentFile {
  name: string;
  content: string;
}

// Fetch component files - prioritizes embedded templates, falls back to GitHub
export async function fetchComponentFiles(componentName: string): Promise<ComponentFile[]> {
  const component = COMPONENTS.find((c) => c.name === componentName);
  if (!component) return [];

  const files: ComponentFile[] = [];
  const templates = getEmbeddedTemplates();

  for (const filePath of component.files) {
    // First try embedded templates (always available, no network needed)
    if (templates[componentName]?.[filePath]) {
      let content = templates[componentName][filePath];
      content = transformImports(content);
      files.push({
        name: filePath,
        content,
      });
      continue;
    }

    // Fallback to fetching from GitHub
    try {
      const url = `${REGISTRY_BASE_URL}/${filePath}`;
      const response = await fetch(url);

      if (response.ok) {
        let content = await response.text();
        content = transformImports(content);
        files.push({
          name: filePath,
          content,
        });
      } else {
        files.push({
          name: filePath,
          content: generatePlaceholder(componentName, filePath),
        });
      }
    } catch {
      files.push({
        name: filePath,
        content: generatePlaceholder(componentName, filePath),
      });
    }
  }

  return files;
}

// Transform imports from package structure to user's project structure
function transformImports(content: string): string {
  // Replace relative lib imports with user's utils alias
  content = content.replace(
    /from ['"]\.\.\/\.\.\/lib\/utils['"]/g,
    "from '@/lib/utils'"
  );
  content = content.replace(
    /from ['"]\.\.\/lib\/utils['"]/g,
    "from '@/lib/utils'"
  );
  // Replace relative component imports
  content = content.replace(
    /from ['"]\.\.\/(\w+)['"]/g,
    "from '@/components/ui/$1'"
  );
  content = content.replace(
    /from ['"]\.\/(\w+)['"]/g,
    "from './$1'"
  );
  return content;
}

function generatePlaceholder(componentName: string, filePath: string): string {
  return `// ${filePath}
// This file should be copied from the chadcn repository
// https://github.com/kadajett/chadcn/tree/main/packages/components/src/components/${filePath}
//
// Or install the package directly:
// npm install @chadchin/ui

export {};
`;
}

// Synchronous version using embedded templates (for offline/bundled use)
export function getComponentFiles(componentName: string): ComponentFile[] {
  const component = COMPONENTS.find((c) => c.name === componentName);
  if (!component) return [];

  // Check if we have embedded templates
  const templates = getEmbeddedTemplates();
  if (templates[componentName]) {
    return component.files.map((filePath) => ({
      name: filePath,
      content: templates[componentName][filePath] || generatePlaceholder(componentName, filePath),
    }));
  }

  // Fallback to placeholders
  return component.files.map((filePath) => ({
    name: filePath,
    content: generatePlaceholder(componentName, filePath),
  }));
}

// Get all npm dependencies for a set of components (including transitive deps)
export function getAllDependencies(componentNames: string[]): {
  npm: string[];
  dev: string[];
} {
  const npm = new Set<string>();
  const dev = new Set<string>();

  const processComponent = (name: string, visited = new Set<string>()) => {
    if (visited.has(name)) return;
    visited.add(name);

    const component = COMPONENTS.find((c) => c.name === name);
    if (!component) return;

    component.npmDependencies?.forEach((dep) => npm.add(dep));
    component.devDependencies?.forEach((dep) => dev.add(dep));
    component.dependencies?.forEach((dep) => processComponent(dep, visited));
  };

  componentNames.forEach((name) => processComponent(name));

  // Always include base dependencies
  npm.add('clsx');
  npm.add('tailwind-merge');
  npm.add('class-variance-authority');

  return {
    npm: Array.from(npm).sort(),
    dev: Array.from(dev).sort(),
  };
}

// Get embedded templates from the bundled templates file
function getEmbeddedTemplates(): Record<string, Record<string, string>> {
  return TEMPLATES;
}

// Get components by category
export function getComponentsByCategory(): Record<string, ComponentDef[]> {
  const categories: Record<string, ComponentDef[]> = {};

  for (const component of COMPONENTS) {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  }

  return categories;
}

// Get component with resolved dependencies
export function resolveComponentDependencies(componentName: string): string[] {
  const resolved = new Set<string>();

  const resolve = (name: string) => {
    if (resolved.has(name)) return;

    const component = COMPONENTS.find((c) => c.name === name);
    if (!component) return;

    // First resolve dependencies
    component.dependencies?.forEach(resolve);

    // Then add this component
    resolved.add(name);
  };

  resolve(componentName);
  return Array.from(resolved);
}
