'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Book, Palette, Package, Terminal, ArrowRight } from 'lucide-react';

const DOCS_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs/installation', label: 'Installation', icon: Terminal },
      { href: '/docs/theming', label: 'Theming', icon: Palette },
      { href: '/docs/cli', label: 'CLI', icon: Terminal },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/components', label: 'All Components', icon: Package },
      { href: '/components#input', label: 'Input', icon: Package },
      { href: '/components#layout', label: 'Layout', icon: Package },
      { href: '/components#navigation', label: 'Navigation', icon: Package },
      { href: '/components#overlay', label: 'Overlay', icon: Package },
      { href: '/components#feedback', label: 'Feedback', icon: Package },
      { href: '/components#creative', label: 'Creative', icon: Package },
    ],
  },
];

export default function DocsPage() {
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
                <Book className="w-5 h-5 text-accent" />
                Documentation
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose mb-12">
          <h1 className="text-3xl font-bold text-text">Documentation</h1>
          <p className="text-text-muted text-lg">
            Learn how to install, configure, and use chadcn components in your project.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-panel rounded-panel border border-panel-border p-6 mb-8">
          <h2 className="text-xl font-semibold text-text mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-muted mb-2">1. Initialize chadcn in your project</p>
              <pre className="bg-surface-sunken rounded-control p-3 text-sm font-mono text-text overflow-x-auto">
                npx chadcn init
              </pre>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-2">2. Add components</p>
              <pre className="bg-surface-sunken rounded-control p-3 text-sm font-mono text-text overflow-x-auto">
                npx chadcn add button input panel
              </pre>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-2">3. Import and use</p>
              <pre className="bg-surface-sunken rounded-control p-3 text-sm font-mono text-text overflow-x-auto">
{`import { Button } from '@/components/ui/Button'

<Button>Click me</Button>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Doc Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {DOCS_SECTIONS.map((section) => (
            <div key={section.title} className="bg-panel rounded-panel border border-panel-border p-6">
              <h3 className="text-lg font-semibold text-text mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors py-1"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-panel bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-medium text-text mb-1">28 Components</h4>
            <p className="text-sm text-text-muted">From buttons to gradient editors</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-panel bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Palette className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-medium text-text mb-1">17 Themes</h4>
            <p className="text-sm text-text-muted">Creative tools to retro OS</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-panel bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Terminal className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-medium text-text mb-1">CLI Install</h4>
            <p className="text-sm text-text-muted">Just like shadcn/ui</p>
          </div>
        </div>
      </div>
    </div>
  );
}
