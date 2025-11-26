<p align="center">
  <img src="https://chadcn.io/logo.svg" width="120" alt="chadcn logo" />
</p>

<h1 align="center">chadcn/ui</h1>

<p align="center">
  <strong>Hyper-dense UI components for people who actually need to get things done.</strong>
</p>

<p align="center">
  <a href="https://chadcn.io">Documentation</a> •
  <a href="#installation">Installation</a> •
  <a href="#themes">Themes</a> •
  <a href="#components">Components</a>
</p>

---

## What is this?

A React component library for building dense, professional interfaces like those found in Photoshop, Blender, VS Code, and other tools where screen real estate is precious and every pixel earns its keep.

Not everything needs to be a big, friendly button with 48px of padding. Sometimes you need 47 controls visible at once. We don't judge.

## Features

- **Compact by default** — Designed for information-dense interfaces
- **17 themes** — From Photoshop dark to Windows 95 (yes, really)
- **Radix primitives** — Accessible, unstyled foundations
- **Tailwind CSS** — Utility-first styling with CSS variables
- **TypeScript** — Full type safety
- **Themeable** — Swap themes at runtime via `data-theme`

## Installation

```bash
# Install the package
npm install @chadcn/ui

# Or use the CLI to add components individually
npx chadcn init
npx chadcn add panel toolbar slider
```

## Quick Start

```tsx
import { Panel, PropertyRow, NumberSpinner, Slider } from '@chadcn/ui';
import '@chadcn/ui/styles.css';

function TransformPanel() {
  return (
    <Panel title="Transform" collapsible>
      <PropertyRow label="Position X">
        <NumberSpinner defaultValue={0} suffix="px" />
      </PropertyRow>
      <PropertyRow label="Position Y">
        <NumberSpinner defaultValue={0} suffix="px" />
      </PropertyRow>
      <PropertyRow label="Rotation">
        <Slider defaultValue={0} max={360} suffix="°" />
      </PropertyRow>
    </Panel>
  );
}
```

Set a theme on your root element:

```html
<html data-theme="photoshop">
```

## Themes

### Creative Tools
| Theme | Description |
|-------|-------------|
| `photoshop` | Adobe Photoshop-inspired dark |
| `blender` | Blender 3D darker theme |
| `gimp` | GIMP-inspired dark |
| `vscode` | Visual Studio Code dark |

### Community Favorites
| Theme | Description |
|-------|-------------|
| `dracula` | Popular purple-accented dark theme |
| `nord` | Arctic, bluish palette |
| `cyberpunk` | Neon pink and cyan |
| `synthwave` | Retro 80s purple and pink |
| `coffee` | Warm coffee browns |
| `sunset` | Orange and purple gradient |
| `aqua` | Ocean blue-green |
| `retro` | Warm cream and brown |

### Retro OS
| Theme | Description |
|-------|-------------|
| `win95` | Windows 95/98 with 3D beveled controls |
| `winxp` | Windows XP Luna Blue |
| `macos9` | Mac OS 9 Platinum |

### Accessibility
| Theme | Description |
|-------|-------------|
| `light` | Light theme |
| `high-contrast` | Maximum contrast |

## Components

### Layout
- **Panel** — Collapsible container with header
- **Toolbar** — Horizontal/vertical toolbar with toggle groups
- **PropertyRow** — Label + control pairs for property panels

### Inputs
- **Input** — Compact text input
- **NumberSpinner** — Numeric input with scrubbing support
- **Slider** — Range slider with optional value input
- **ColorInput** — Color picker with presets
- **Checkbox** — Compact checkbox
- **Switch** — Toggle switch
- **Select** — Dropdown select

### Navigation
- **TreeView** — Hierarchical list (layers panel style)
- **Tabs** — Tabbed interface with multiple variants
- **Accordion** — Collapsible sections

### Overlay
- **ContextMenu** — Right-click menus
- **Tooltip** — Hover tooltips

### Utility
- **Button** — Compact buttons with variants
- **ScrollArea** — Custom scrollbars
- **Separator** — Dividers

## Development

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm storybook

# Build
pnpm build

# Lint
pnpm lint
```

## Philosophy

Professional tools have dense interfaces for a reason — experts need information and controls at their fingertips, not hidden behind three clicks and a hamburger menu.

This library provides the building blocks for interfaces that respect your users' expertise.

## Credits

Inspired by [shadcn/ui](https://ui.shadcn.com), built on [Radix](https://radix-ui.com), styled with [Tailwind CSS](https://tailwindcss.com).

Windows 95/98 theme colors referenced from [98.css](https://jdan.github.io/98.css/) by Jordan Scales.

## License

MIT © [kadajett](https://github.com/kadajett)
