'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Terminal, Package } from 'lucide-react';

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

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="relative group rounded-panel overflow-hidden border border-panel-border">
      {filename && (
        <div className="bg-panel-header px-4 py-2 border-b border-panel-border flex items-center justify-between">
          <span className="text-xs text-panel-header-text font-mono">{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="bg-surface-sunken p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-text">
          <code>{code}</code>
        </pre>
      </div>
      {!filename && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-panel/80 backdrop-blur-sm border-b border-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Docs
              </Link>
              <div className="h-4 w-px bg-divider" />
              <h1 className="text-lg font-semibold text-text flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                Installation
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose">
          <h1 className="text-3xl font-bold text-text mb-4">Installation</h1>
          <p className="text-text-muted text-lg mb-8">
            Add chadcn components to your project in minutes.
          </p>

          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">Prerequisites</h2>
            <ul className="list-disc pl-6 text-text-muted space-y-2 mb-4">
              <li>React 18 or later</li>
              <li>Tailwind CSS 3.4 or later</li>
              <li>TypeScript (recommended)</li>
            </ul>
            <p className="text-sm text-text-muted">
              chadcn works with Next.js, Vite, Remix, and other React frameworks.
            </p>
          </section>

          {/* Initialize */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">1. Initialize chadcn</h2>
            <p className="text-text-muted mb-4">
              Run the init command to set up chadcn in your project:
            </p>
            <CodeBlock code="npx chadcn init" />
            <p className="text-sm text-text-muted mt-4">
              This will create:
            </p>
            <ul className="list-disc pl-6 text-text-muted space-y-1 text-sm mt-2">
              <li><code className="bg-surface-sunken px-1 rounded">chadcn.json</code> - Configuration file</li>
              <li><code className="bg-surface-sunken px-1 rounded">globals.css</code> - Theme CSS variables</li>
              <li><code className="bg-surface-sunken px-1 rounded">tailwind.config</code> - Tailwind configuration</li>
              <li><code className="bg-surface-sunken px-1 rounded">lib/utils.ts</code> - Utility functions</li>
            </ul>
          </section>

          {/* Add Components */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">2. Add Components</h2>
            <p className="text-text-muted mb-4">
              Add individual components or all at once:
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted mb-2">Add specific components:</p>
                <CodeBlock code="npx chadcn add button input panel slider" />
              </div>

              <div>
                <p className="text-sm text-text-muted mb-2">Add all components:</p>
                <CodeBlock code="npx chadcn add --all" />
              </div>

              <div>
                <p className="text-sm text-text-muted mb-2">Interactive selection:</p>
                <CodeBlock code="npx chadcn add" />
              </div>
            </div>
          </section>

          {/* Install Dependencies */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">3. Install Dependencies</h2>
            <p className="text-text-muted mb-4">
              The CLI will prompt you to install required npm packages. You can also install them manually:
            </p>
            <CodeBlock
              code={`npm install clsx tailwind-merge class-variance-authority \\
  @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-select \\
  @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs \\
  @radix-ui/react-tooltip @radix-ui/react-accordion lucide-react`}
            />
            <p className="text-sm text-text-muted mt-2">
              Not all packages are required - only those needed for the components you use.
            </p>
          </section>

          {/* Usage */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">4. Use Components</h2>
            <p className="text-text-muted mb-4">
              Import and use components in your app:
            </p>
            <CodeBlock
              code={`import { Button, Panel, Input, Slider } from '@/components/ui'

export function MyComponent() {
  return (
    <Panel title="Settings">
      <div className="space-y-4">
        <Input placeholder="Enter name..." />
        <Slider defaultValue={[50]} />
        <Button variant="primary">Save Changes</Button>
      </div>
    </Panel>
  )
}`}
              filename="app/page.tsx"
            />
          </section>

          {/* Theming */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">5. Apply a Theme</h2>
            <p className="text-text-muted mb-4">
              Add the <code className="bg-surface-sunken px-1 rounded">data-theme</code> attribute to change themes:
            </p>
            <CodeBlock
              code={`<body data-theme="photoshop">
  {/* Your app */}
</body>

<!-- Or dynamically -->
<body data-theme="blender">
<body data-theme="cyberpunk">
<body data-theme="win95">`}
              filename="app/layout.tsx"
            />
            <p className="text-text-muted mt-4">
              See the <Link href="/themes" className="text-accent hover:underline">themes gallery</Link> for all 17 available themes.
            </p>
          </section>

          {/* Configuration */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text mb-4">Configuration</h2>
            <p className="text-text-muted mb-4">
              The <code className="bg-surface-sunken px-1 rounded">chadcn.json</code> file stores your configuration:
            </p>
            <CodeBlock
              code={`{
  "style": "default",
  "theme": "photoshop",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css"
  },
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils"
  },
  "typescript": true
}`}
              filename="chadcn.json"
            />
          </section>

          {/* Next Steps */}
          <section className="bg-panel rounded-panel border border-panel-border p-6">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Next Steps
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/components" className="text-accent hover:underline">
                  Browse all 28 components
                </Link>
              </li>
              <li>
                <Link href="/themes" className="text-accent hover:underline">
                  Explore 17 themes
                </Link>
              </li>
              <li>
                <Link href="/docs/theming" className="text-accent hover:underline">
                  Learn about custom theming
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
