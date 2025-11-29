/**
 * Script to generate embedded component templates for the CLI
 * This reads all component source files and embeds them into a JSON file
 * so the CLI works without needing to fetch from GitHub
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to components source
const COMPONENTS_DIR = path.resolve(__dirname, '../../components/src/components');
const TEMPLATES_JSON_FILE = path.resolve(__dirname, '../src/utils/component-templates.json');

// Component registry - must match registry.ts
const COMPONENTS = [
  { name: 'button', files: ['Button/Button.tsx', 'Button/index.ts'] },
  { name: 'input', files: ['Input/Input.tsx', 'Input/index.ts'] },
  { name: 'number-spinner', files: ['NumberSpinner/NumberSpinner.tsx', 'NumberSpinner/index.ts'] },
  { name: 'slider', files: ['Slider/Slider.tsx', 'Slider/index.ts'] },
  { name: 'checkbox', files: ['Checkbox/Checkbox.tsx', 'Checkbox/index.ts'] },
  { name: 'switch', files: ['Switch/Switch.tsx', 'Switch/index.ts'] },
  { name: 'select', files: ['Select/Select.tsx', 'Select/index.ts'] },
  { name: 'color-input', files: ['ColorInput/ColorInput.tsx', 'ColorInput/index.ts'] },
  { name: 'panel', files: ['Panel/Panel.tsx', 'Panel/index.ts'] },
  { name: 'toolbar', files: ['Toolbar/Toolbar.tsx', 'Toolbar/index.ts'] },
  { name: 'property-row', files: ['PropertyRow/PropertyRow.tsx', 'PropertyRow/index.ts'] },
  { name: 'resizable-panes', files: ['ResizablePanes/ResizablePanes.tsx', 'ResizablePanes/index.ts'] },
  { name: 'tree-view', files: ['TreeView/TreeView.tsx', 'TreeView/index.ts'] },
  { name: 'tabs', files: ['Tabs/Tabs.tsx', 'Tabs/index.ts'] },
  { name: 'accordion', files: ['Accordion/Accordion.tsx', 'Accordion/index.ts'] },
  { name: 'breadcrumbs', files: ['Breadcrumbs/Breadcrumbs.tsx', 'Breadcrumbs/index.ts'] },
  { name: 'command-palette', files: ['CommandPalette/CommandPalette.tsx', 'CommandPalette/index.ts'] },
  { name: 'menu-bar', files: ['MenuBar/MenuBar.tsx', 'MenuBar/index.ts'] },
  { name: 'context-menu', files: ['ContextMenu/ContextMenu.tsx', 'ContextMenu/index.ts'] },
  { name: 'tooltip', files: ['Tooltip/Tooltip.tsx', 'Tooltip/index.ts'] },
  { name: 'status-bar', files: ['StatusBar/StatusBar.tsx', 'StatusBar/index.ts'] },
  { name: 'progress-indicator', files: ['ProgressIndicator/ProgressIndicator.tsx', 'ProgressIndicator/index.ts'] },
  { name: 'toast', files: ['Toast/Toast.tsx', 'Toast/index.ts'] },
  { name: 'layer-stack', files: ['LayerStack/LayerStack.tsx', 'LayerStack/index.ts'] },
  { name: 'swatch-palette', files: ['SwatchPalette/SwatchPalette.tsx', 'SwatchPalette/index.ts'] },
  { name: 'gradient-editor', files: ['GradientEditor/GradientEditor.tsx', 'GradientEditor/index.ts'] },
  { name: 'scroll-area', files: ['ScrollArea/ScrollArea.tsx', 'ScrollArea/index.ts'] },
  { name: 'separator', files: ['Separator/Separator.tsx', 'Separator/index.ts'] },
];

function generateTemplates(): Record<string, Record<string, string>> {
  const templates: Record<string, Record<string, string>> = {};

  for (const component of COMPONENTS) {
    templates[component.name] = {};

    for (const filePath of component.files) {
      const fullPath = path.join(COMPONENTS_DIR, filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        templates[component.name][filePath] = content;
        console.log(`  ✓ ${filePath}`);
      } else {
        console.warn(`  ✗ Missing: ${filePath}`);
      }
    }
  }

  return templates;
}

function main() {
  console.log('Generating embedded component templates...\n');
  console.log(`Components source: ${COMPONENTS_DIR}`);
  console.log(`Output file: ${TEMPLATES_JSON_FILE}\n`);

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Error: Components directory not found: ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const templates = generateTemplates();

  // Write templates as JSON (properly escaped)
  fs.writeFileSync(TEMPLATES_JSON_FILE, JSON.stringify(templates, null, 2));

  console.log(`\n✓ Generated templates for ${Object.keys(templates).length} components`);
}

main();
