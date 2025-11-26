'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Search } from 'lucide-react';

const COMPONENTS = {
  Input: [
    { name: 'Button', description: 'Compact button with multiple variants', path: 'button' },
    { name: 'Input', description: 'Compact text input field', path: 'input' },
    { name: 'NumberSpinner', description: 'Number input with increment/decrement', path: 'number-spinner' },
    { name: 'Slider', description: 'Slider with optional value input', path: 'slider' },
    { name: 'Checkbox', description: 'Compact checkbox with label', path: 'checkbox' },
    { name: 'Switch', description: 'Compact toggle switch', path: 'switch' },
    { name: 'Select', description: 'Dropdown select with groups', path: 'select' },
    { name: 'ColorInput', description: 'Color picker with hex input', path: 'color-input' },
  ],
  Layout: [
    { name: 'Panel', description: 'Collapsible panel container', path: 'panel' },
    { name: 'Toolbar', description: 'Toolbar with toggle groups', path: 'toolbar' },
    { name: 'PropertyRow', description: 'Label + control row layout', path: 'property-row' },
    { name: 'ResizablePanes', description: 'Resizable split pane layout', path: 'resizable-panes' },
  ],
  Navigation: [
    { name: 'TreeView', description: 'Hierarchical tree with selection', path: 'tree-view' },
    { name: 'Tabs', description: 'Tabbed interface variants', path: 'tabs' },
    { name: 'Accordion', description: 'Collapsible sections', path: 'accordion' },
    { name: 'Breadcrumbs', description: 'Breadcrumb navigation', path: 'breadcrumbs' },
    { name: 'CommandPalette', description: 'Command palette with search', path: 'command-palette' },
    { name: 'MenuBar', description: 'Application menu bar', path: 'menu-bar' },
  ],
  Overlay: [
    { name: 'ContextMenu', description: 'Right-click context menu', path: 'context-menu' },
    { name: 'Tooltip', description: 'Tooltip overlay', path: 'tooltip' },
  ],
  Feedback: [
    { name: 'StatusBar', description: 'Application status bar', path: 'status-bar' },
    { name: 'ProgressIndicator', description: 'Progress bar with controls', path: 'progress-indicator' },
    { name: 'Toast', description: 'Toast notifications', path: 'toast' },
  ],
  Creative: [
    { name: 'LayerStack', description: 'Layer management panel', path: 'layer-stack' },
    { name: 'SwatchPalette', description: 'Color swatch palette', path: 'swatch-palette' },
    { name: 'GradientEditor', description: 'Gradient editor with stops', path: 'gradient-editor' },
  ],
  Utility: [
    { name: 'ScrollArea', description: 'Custom scrollable area', path: 'scroll-area' },
    { name: 'Separator', description: 'Visual divider', path: 'separator' },
  ],
};

export default function ComponentsPage() {
  const [search, setSearch] = React.useState('');

  const filteredComponents = React.useMemo(() => {
    if (!search) return COMPONENTS;

    const filtered: Partial<typeof COMPONENTS> = {};
    for (const [category, components] of Object.entries(COMPONENTS)) {
      const matches = components.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      );
      if (matches.length > 0) {
        filtered[category as keyof typeof COMPONENTS] = matches;
      }
    }
    return filtered;
  }, [search]);

  const totalComponents = Object.values(COMPONENTS).flat().length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-panel/80 backdrop-blur-sm border-b border-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </Link>
              <div className="h-4 w-px bg-divider" />
              <h1 className="text-lg font-semibold text-text flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Components
              </h1>
            </div>
            <div className="text-sm text-text-muted">
              {totalComponents} components
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-muted" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-input border border-input-border rounded-panel text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Component Grid */}
        <div className="space-y-12">
          {Object.entries(filteredComponents).map(([category, components]) => (
            <section key={category} id={category.toLowerCase()}>
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                {category}
                <span className="text-sm font-normal text-text-muted">({components.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map((component) => (
                  <Link
                    key={component.path}
                    href={`/components/${component.path}`}
                    className="bg-panel border border-panel-border rounded-panel p-4 hover:border-accent/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-text group-hover:text-accent transition-colors">
                        {component.name}
                      </h3>
                      <code className="text-2xs bg-surface-sunken px-1.5 py-0.5 rounded text-text-muted">
                        {component.path}
                      </code>
                    </div>
                    <p className="text-sm text-text-muted">{component.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {Object.keys(filteredComponents).length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No components found matching &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
