'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  // Creative Tools
  { name: 'photoshop', label: 'Photoshop', description: 'Adobe Photoshop-inspired dark theme', category: 'Creative Tools' },
  { name: 'blender', label: 'Blender', description: 'Blender 3D-inspired darker theme', category: 'Creative Tools' },
  { name: 'gimp', label: 'GIMP', description: 'GIMP-inspired dark theme', category: 'Creative Tools' },
  { name: 'vscode', label: 'VS Code', description: 'Visual Studio Code-inspired theme', category: 'Creative Tools' },
  // DaisyUI
  { name: 'cyberpunk', label: 'Cyberpunk', description: 'Neon pink and cyan on dark', category: 'DaisyUI Inspired' },
  { name: 'synthwave', label: 'Synthwave', description: 'Retro 80s purple and pink', category: 'DaisyUI Inspired' },
  { name: 'dracula', label: 'Dracula', description: 'Popular purple-accented dark', category: 'DaisyUI Inspired' },
  { name: 'nord', label: 'Nord', description: 'Arctic bluish color palette', category: 'DaisyUI Inspired' },
  { name: 'retro', label: 'Retro', description: 'Warm cream and brown tones', category: 'DaisyUI Inspired' },
  { name: 'coffee', label: 'Coffee', description: 'Rich coffee browns', category: 'DaisyUI Inspired' },
  { name: 'sunset', label: 'Sunset', description: 'Warm orange and purple', category: 'DaisyUI Inspired' },
  { name: 'aqua', label: 'Aqua', description: 'Ocean blue-green theme', category: 'DaisyUI Inspired' },
  // Retro OS
  { name: 'win95', label: 'Windows 95/98', description: 'Classic 3D beveled look', category: 'Retro OS' },
  { name: 'winxp', label: 'Windows XP Luna', description: 'Luna Blue theme', category: 'Retro OS' },
  { name: 'macos9', label: 'Mac OS 9', description: 'Classic Platinum appearance', category: 'Retro OS' },
  // Accessibility
  { name: 'light', label: 'Light', description: 'Light theme for accessibility', category: 'Accessibility' },
  { name: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast theme', category: 'Accessibility' },
];

function ThemePreview({ theme, isActive, onClick }: {
  theme: typeof THEMES[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-theme={theme.name}
      className={cn(
        'relative w-full text-left rounded-panel overflow-hidden border-2 transition-all',
        isActive ? 'border-accent ring-2 ring-accent/30' : 'border-transparent hover:border-accent/50'
      )}
    >
      {/* Preview */}
      <div className="bg-surface p-4">
        <div className="flex gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-state-error" />
          <div className="w-3 h-3 rounded-full bg-state-warning" />
          <div className="w-3 h-3 rounded-full bg-state-success" />
        </div>
        <div className="bg-panel rounded-control p-3 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <div className="h-2 w-20 bg-text rounded" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-6 bg-control rounded-control" />
            <div className="h-6 px-3 bg-accent rounded-control" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 h-1.5 bg-state-info rounded-full" />
          <div className="flex-1 h-1.5 bg-divider rounded-full" />
        </div>
      </div>

      {/* Label */}
      <div className="bg-panel-header px-4 py-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-panel-header-text">{theme.label}</div>
          <div className="text-2xs text-text-muted">{theme.description}</div>
        </div>
        {isActive && (
          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <Check className="w-3 h-3 text-accent-text" />
          </div>
        )}
      </div>
    </button>
  );
}

function ComponentDemo() {
  const [value, setValue] = React.useState(50);

  return (
    <div className="bg-panel rounded-panel border border-panel-border overflow-hidden">
      {/* Panel Header */}
      <div className="bg-panel-header px-4 py-2 border-b border-panel-border flex items-center justify-between">
        <span className="text-sm font-medium text-panel-header-text">Properties</span>
        <div className="flex gap-1">
          <button className="w-4 h-4 rounded hover:bg-control-hover flex items-center justify-center">
            <span className="text-icon-muted text-xs">-</span>
          </button>
          <button className="w-4 h-4 rounded hover:bg-control-hover flex items-center justify-center">
            <span className="text-icon-muted text-xs">x</span>
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-4 space-y-4">
        {/* Input Row */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-label w-16">Name</label>
          <input
            type="text"
            defaultValue="Layer 1"
            className="flex-1 h-6 px-2 bg-input border border-input-border rounded-control text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        {/* Slider Row */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-label w-16">Opacity</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="flex-1 h-1 bg-control rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
            />
            <span className="text-xs text-text w-8 text-right">{value}%</span>
          </div>
        </div>

        {/* Select Row */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-label w-16">Blend</label>
          <select className="flex-1 h-6 px-2 bg-control border border-control-border rounded-control text-sm text-text focus:border-accent focus:outline-none appearance-none">
            <option>Normal</option>
            <option>Multiply</option>
            <option>Screen</option>
            <option>Overlay</option>
          </select>
        </div>

        {/* Checkbox Row */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-label w-16">Visible</label>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 rounded border border-control-border bg-control checked:bg-accent checked:border-accent"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 h-6 px-3 bg-control border border-control-border rounded-control text-xs text-text hover:bg-control-hover transition-colors">
            Cancel
          </button>
          <button className="flex-1 h-6 px-3 bg-accent rounded-control text-xs text-accent-text hover:bg-accent-hover transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* State Colors */}
      <div className="px-4 py-2 bg-surface-sunken flex gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-state-success" />
          <span className="text-2xs text-text-muted">Success</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-state-warning" />
          <span className="text-2xs text-text-muted">Warning</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-state-error" />
          <span className="text-2xs text-text-muted">Error</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-state-info" />
          <span className="text-2xs text-text-muted">Info</span>
        </div>
      </div>
    </div>
  );
}

export default function ThemesPage() {
  const [currentTheme, setCurrentTheme] = React.useState('photoshop');

  React.useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const groupedThemes = THEMES.reduce((acc, theme) => {
    if (!acc[theme.category]) acc[theme.category] = [];
    acc[theme.category].push(theme);
    return acc;
  }, {} as Record<string, typeof THEMES>);

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
                Back
              </Link>
              <div className="h-4 w-px bg-divider" />
              <h1 className="text-lg font-semibold text-text flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                Theme Gallery
              </h1>
            </div>
            <div className="text-sm text-text-muted">
              {THEMES.length} themes available
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Theme Grid */}
          <div className="space-y-8">
            {Object.entries(groupedThemes).map(([category, themes]) => (
              <section key={category}>
                <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  {category === 'Creative Tools' && <Monitor className="w-4 h-4 text-accent" />}
                  {category === 'Accessibility' && <Sun className="w-4 h-4 text-accent" />}
                  {category === 'Retro OS' && <Monitor className="w-4 h-4 text-accent" />}
                  {category === 'DaisyUI Inspired' && <Moon className="w-4 h-4 text-accent" />}
                  {category}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <ThemePreview
                      key={theme.name}
                      theme={theme}
                      isActive={currentTheme === theme.name}
                      onClick={() => setCurrentTheme(theme.name)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-text-label mb-1">Live Preview</h3>
              <p className="text-xs text-text-muted">
                Currently viewing: <span className="text-accent">{THEMES.find(t => t.name === currentTheme)?.label}</span>
              </p>
            </div>
            <ComponentDemo />

            {/* CSS Variable Preview */}
            <div className="mt-4 bg-panel rounded-panel border border-panel-border p-4">
              <h4 className="text-xs font-medium text-text-label mb-3">Color Tokens</h4>
              <div className="space-y-2 text-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-surface border border-panel-border" />
                  <span className="text-text-muted">--surface</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-panel border border-panel-border" />
                  <span className="text-text-muted">--panel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-control border border-panel-border" />
                  <span className="text-text-muted">--control</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent" />
                  <span className="text-text-muted">--accent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-input border border-input-border" />
                  <span className="text-text-muted">--input</span>
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="mt-4 bg-surface-sunken rounded-panel p-4">
              <h4 className="text-xs font-medium text-text-label mb-2">Usage</h4>
              <pre className="text-2xs font-mono text-text-muted overflow-x-auto">
{`<body data-theme="${currentTheme}">
  ...
</body>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
