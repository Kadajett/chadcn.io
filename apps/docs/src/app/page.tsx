'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Github,
  Palette,
  Layers,
  Zap,
  Monitor,
  Package,
  Terminal,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  { name: 'photoshop', label: 'Photoshop', category: 'Creative Tools' },
  { name: 'blender', label: 'Blender', category: 'Creative Tools' },
  { name: 'vscode', label: 'VS Code', category: 'Creative Tools' },
  { name: 'gimp', label: 'GIMP', category: 'Creative Tools' },
  { name: 'cyberpunk', label: 'Cyberpunk', category: 'DaisyUI' },
  { name: 'synthwave', label: 'Synthwave', category: 'DaisyUI' },
  { name: 'dracula', label: 'Dracula', category: 'DaisyUI' },
  { name: 'nord', label: 'Nord', category: 'DaisyUI' },
  { name: 'retro', label: 'Retro', category: 'DaisyUI' },
  { name: 'coffee', label: 'Coffee', category: 'DaisyUI' },
  { name: 'sunset', label: 'Sunset', category: 'DaisyUI' },
  { name: 'aqua', label: 'Aqua', category: 'DaisyUI' },
  { name: 'win95', label: 'Windows 95', category: 'Retro OS' },
  { name: 'winxp', label: 'Windows XP', category: 'Retro OS' },
  { name: 'macos9', label: 'Mac OS 9', category: 'Retro OS' },
  { name: 'light', label: 'Light', category: 'Accessibility' },
  { name: 'high-contrast', label: 'High Contrast', category: 'Accessibility' },
];

const COMPONENTS = [
  { name: 'Button', category: 'Input' },
  { name: 'Input', category: 'Input' },
  { name: 'NumberSpinner', category: 'Input' },
  { name: 'Slider', category: 'Input' },
  { name: 'Checkbox', category: 'Input' },
  { name: 'Switch', category: 'Input' },
  { name: 'Select', category: 'Input' },
  { name: 'ColorInput', category: 'Input' },
  { name: 'Panel', category: 'Layout' },
  { name: 'Toolbar', category: 'Layout' },
  { name: 'PropertyRow', category: 'Layout' },
  { name: 'ResizablePanes', category: 'Layout' },
  { name: 'TreeView', category: 'Navigation' },
  { name: 'Tabs', category: 'Navigation' },
  { name: 'Accordion', category: 'Navigation' },
  { name: 'Breadcrumbs', category: 'Navigation' },
  { name: 'CommandPalette', category: 'Navigation' },
  { name: 'MenuBar', category: 'Navigation' },
  { name: 'ContextMenu', category: 'Overlay' },
  { name: 'Tooltip', category: 'Overlay' },
  { name: 'StatusBar', category: 'Feedback' },
  { name: 'ProgressIndicator', category: 'Feedback' },
  { name: 'Toast', category: 'Feedback' },
  { name: 'LayerStack', category: 'Creative' },
  { name: 'SwatchPalette', category: 'Creative' },
  { name: 'GradientEditor', category: 'Creative' },
  { name: 'ScrollArea', category: 'Utility' },
  { name: 'Separator', category: 'Utility' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-control-hover transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-state-success" />
      ) : (
        <Copy className="w-4 h-4 text-icon-muted" />
      )}
    </button>
  );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      <pre className="bg-surface-sunken rounded-panel p-4 overflow-x-auto text-sm font-mono text-text">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

function ThemeSelector({ currentTheme, onThemeChange }: {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {THEMES.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-button transition-all',
            currentTheme === theme.name
              ? 'bg-accent text-accent-text'
              : 'bg-control hover:bg-control-hover text-text border border-control-border'
          )}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-panel border border-panel-border rounded-panel p-6 hover:border-accent/50 transition-colors">
      <div className="w-10 h-10 rounded-panel bg-accent/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted text-sm">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [currentTheme, setCurrentTheme] = React.useState('photoshop');

  React.useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-panel/80 backdrop-blur-sm border-b border-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-panel bg-accent flex items-center justify-center">
                <span className="text-accent-text font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-text">chadcn</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-sm text-text-muted hover:text-text transition-colors">
                Docs
              </Link>
              <Link href="/components" className="text-sm text-text-muted hover:text-text transition-colors">
                Components
              </Link>
              <Link href="/themes" className="text-sm text-text-muted hover:text-text transition-colors">
                Themes
              </Link>
              <a
                href="https://github.com/kadajett/chadcn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-button hover:bg-control-hover transition-colors"
              >
                <Github className="w-5 h-5 text-icon" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs mb-6">
            <Zap className="w-3 h-3" />
            <span>28 Components &bull; 17 Themes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
            Hyper-dense UI for{' '}
            <span className="text-accent">professional tools</span>
          </h1>

          <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
            A component library designed for control panels, creative tools, and data-dense interfaces.
            Inspired by Photoshop, Blender, and professional creative software.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/docs/installation"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-text rounded-button hover:bg-accent-hover transition-colors font-medium"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/kadajett/chadcn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-control border border-control-border text-text rounded-button hover:bg-control-hover transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* Quick Install */}
          <div className="max-w-lg mx-auto">
            <CodeBlock code="npx chadcn init" />
          </div>
        </div>
      </section>

      {/* Theme Preview Section */}
      <section className="py-16 px-4 bg-surface-sunken">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-text mb-3">17 Beautiful Themes</h2>
            <p className="text-text-muted">Click to preview different themes</p>
          </div>

          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />

          {/* Theme Preview */}
          <div className="mt-10 bg-panel border border-panel-border rounded-panel p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-control border border-control-border rounded-control p-3 text-center">
                <div className="text-xs text-text-muted mb-1">Control</div>
                <div className="text-sm text-text font-medium">Button</div>
              </div>
              <div className="bg-input border border-input-border rounded-control p-3 text-center">
                <div className="text-xs text-text-muted mb-1">Input</div>
                <div className="text-sm text-text font-medium">Value</div>
              </div>
              <div className="bg-accent text-accent-text rounded-control p-3 text-center">
                <div className="text-xs opacity-80 mb-1">Accent</div>
                <div className="text-sm font-medium">Primary</div>
              </div>
              <div className="bg-selection text-selection-text rounded-control p-3 text-center">
                <div className="text-xs opacity-80 mb-1">Selection</div>
                <div className="text-sm font-medium">Selected</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 h-2 bg-state-success rounded-full" />
              <div className="flex-1 h-2 bg-state-warning rounded-full" />
              <div className="flex-1 h-2 bg-state-error rounded-full" />
              <div className="flex-1 h-2 bg-state-info rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text mb-3">Built for Professionals</h2>
            <p className="text-text-muted">Everything you need to build data-dense interfaces</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              title="Dense by Design"
              description="Compact spacing and font sizes optimized for control panels with lots of options."
            />
            <FeatureCard
              icon={Palette}
              title="17 Themes"
              description="From Photoshop dark to Cyberpunk neon, plus accessibility themes."
            />
            <FeatureCard
              icon={Package}
              title="28 Components"
              description="Everything from buttons to gradient editors, layer stacks, and more."
            />
            <FeatureCard
              icon={Terminal}
              title="CLI Installation"
              description="Add components with npx chadcn add. Just like shadcn/ui."
            />
            <FeatureCard
              icon={Monitor}
              title="Radix Primitives"
              description="Built on accessible Radix UI primitives for solid foundations."
            />
            <FeatureCard
              icon={Zap}
              title="Tailwind CSS"
              description="Fully customizable with CSS variables and Tailwind utilities."
            />
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="py-16 px-4 bg-surface-sunken">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text mb-3">28 Components</h2>
            <p className="text-text-muted">Everything you need for professional tool interfaces</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {COMPONENTS.map((component) => (
              <Link
                key={component.name}
                href={`/components/${component.name.toLowerCase()}`}
                className="bg-panel border border-panel-border rounded-control p-3 text-center hover:border-accent/50 transition-colors group"
              >
                <div className="text-sm text-text group-hover:text-accent transition-colors">{component.name}</div>
                <div className="text-2xs text-text-muted mt-1">{component.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text mb-3">Quick Start</h2>
            <p className="text-text-muted">Get up and running in minutes</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-text mb-3">1. Initialize chadcn</h3>
              <CodeBlock code="npx chadcn init" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-text mb-3">2. Add components</h3>
              <CodeBlock code="npx chadcn add button input panel" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-text mb-3">3. Or add all components</h3>
              <CodeBlock code="npx chadcn add --all" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-text mb-3">4. Use in your app</h3>
              <CodeBlock
                code={`import { Button, Panel, Input } from '@/components/ui'

export function MyComponent() {
  return (
    <Panel title="Settings">
      <Input placeholder="Enter value..." />
      <Button>Save</Button>
    </Panel>
  )
}`}
                language="tsx"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-panel border-t border-panel-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-text font-bold text-sm">C</span>
            </div>
            <span className="text-sm text-text-muted">chadcn - Hyper-dense UI components</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kadajett/chadcn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Link href="/docs" className="text-sm text-text-muted hover:text-text transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
