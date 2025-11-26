import type { Meta, StoryObj } from '@storybook/react';
import {
  Panel,
  PanelGroup,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  PropertyRow,
  PropertyGroup,
  NumberSpinner,
  SliderWithInput,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ColorInput,
  Button,
  TreeView,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Input,
  Switch,
  // New components
  StatusBar,
  StatusBarItem,
  StatusBarSeparator,
  StatusBarCoordinates,
  StatusBarZoom,
  StatusBarProgress,
  LayerStack,
  Breadcrumbs,
  CommandPalette,
  SwatchPalette,
  presetPalettes,
  GradientEditor,
  createDefaultGradient,
  ProgressIndicator,
  ResizablePanes,
  SplitPane,
  MenuBar,
  ToastProvider,
  useToast,
} from '../index';
import type { Layer, GradientValue, MenuDefinition } from '../index';
import {
  Layers,
  Move,
  Square,
  Circle,
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Type,
  Hand,
  ZoomIn,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  FolderOpen,
  Image,
  Settings,
  Sliders,
  Palette,
  Home,
  File,
  Save,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Search,
} from 'lucide-react';
import * as React from 'react';

const meta: Meta = {
  title: 'Demo/Creative Tool UI',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const PhotoshopStyleInterface: StoryObj = {
  render: () => {
    // Tool state
    const [selectedTool, setSelectedTool] = React.useState('move');
    const [brushSize, setBrushSize] = React.useState(12);
    const [brushOpacity, setBrushOpacity] = React.useState(100);
    const [brushHardness, setBrushHardness] = React.useState(100);
    const [antiAlias, setAntiAlias] = React.useState(true);

    // Layer state
    const [layers, setLayers] = React.useState<Layer[]>([
      { id: 'bg', name: 'Background', visible: true, locked: true, opacity: 100, thumbnail: '🖼️' },
      { id: 'shapes', name: 'Shape Layer', visible: true, locked: false, opacity: 100, thumbnail: '⬛' },
      { id: 'text', name: 'Typography', visible: true, locked: false, opacity: 85, thumbnail: '📝' },
      { id: 'fx', name: 'Effects', visible: false, locked: false, opacity: 100, thumbnail: '✨' },
      { id: 'adj', name: 'Curves Adjustment', visible: true, locked: false, opacity: 100, thumbnail: '📈' },
    ]);
    const [selectedLayer, setSelectedLayer] = React.useState('shapes');

    // UI state
    const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState(100);
    const [cursorPos, setCursorPos] = React.useState({ x: 512, y: 384 });
    const [foregroundColor, setForegroundColor] = React.useState('#3b82f6');
    const [backgroundColor, setBackgroundColor] = React.useState('#ffffff');
    const [selectedSwatch, setSelectedSwatch] = React.useState<string | undefined>('blue');
    const [gradient, setGradient] = React.useState<GradientValue>(createDefaultGradient());
    const [selectedGradientStop, setSelectedGradientStop] = React.useState<string | undefined>();
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveProgress, setSaveProgress] = React.useState(0);

    // History state
    const [history] = React.useState([
      { id: '1', action: 'Open Document' },
      { id: '2', action: 'New Layer' },
      { id: '3', action: 'Brush Stroke' },
      { id: '4', action: 'Transform' },
      { id: '5', action: 'Add Text' },
    ]);
    const [historyIndex, setHistoryIndex] = React.useState(4);

    // Keyboard shortcut for command palette
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Simulate save
    const handleSave = () => {
      setIsSaving(true);
      setSaveProgress(0);
      const interval = setInterval(() => {
        setSaveProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsSaving(false), 500);
            return 100;
          }
          return p + 10;
        });
      }, 100);
    };

    const commands = [
      { id: 'new', label: 'New Document', shortcut: ['⌘', 'N'], icon: <File size={14} />, category: 'File' },
      { id: 'open', label: 'Open...', shortcut: ['⌘', 'O'], icon: <FolderOpen size={14} />, category: 'File' },
      { id: 'save', label: 'Save', shortcut: ['⌘', 'S'], icon: <Save size={14} />, category: 'File', onSelect: handleSave },
      { id: 'export', label: 'Export As...', shortcut: ['⌘', '⇧', 'E'], icon: <Image size={14} />, category: 'File' },
      { id: 'undo', label: 'Undo', shortcut: ['⌘', 'Z'], icon: <Undo size={14} />, category: 'Edit' },
      { id: 'redo', label: 'Redo', shortcut: ['⌘', '⇧', 'Z'], icon: <Redo size={14} />, category: 'Edit' },
      { id: 'copy', label: 'Copy', shortcut: ['⌘', 'C'], icon: <Copy size={14} />, category: 'Edit' },
      { id: 'paste', label: 'Paste', shortcut: ['⌘', 'V'], icon: <Clipboard size={14} />, category: 'Edit' },
      { id: 'transform', label: 'Free Transform', shortcut: ['⌘', 'T'], icon: <Move size={14} />, category: 'Edit' },
      { id: 'newlayer', label: 'New Layer', shortcut: ['⌘', '⇧', 'N'], icon: <Plus size={14} />, category: 'Layer' },
      { id: 'duplicate', label: 'Duplicate Layer', shortcut: ['⌘', 'J'], icon: <Copy size={14} />, category: 'Layer' },
      { id: 'merge', label: 'Merge Down', shortcut: ['⌘', 'E'], icon: <Layers size={14} />, category: 'Layer' },
      { id: 'zoomin', label: 'Zoom In', shortcut: ['⌘', '+'], icon: <ZoomIn size={14} />, category: 'View' },
      { id: 'zoomout', label: 'Zoom Out', shortcut: ['⌘', '-'], icon: <ZoomIn size={14} />, category: 'View' },
      { id: 'fit', label: 'Fit on Screen', shortcut: ['⌘', '0'], icon: <Square size={14} />, category: 'View' },
    ];

    const menuDefinitions: MenuDefinition[] = [
      {
        id: 'file',
        label: 'File',
        items: [
          { type: 'action', id: 'new', label: 'New...', shortcut: '⌘N', icon: <File size={12} /> },
          { type: 'action', id: 'open', label: 'Open...', shortcut: '⌘O', icon: <FolderOpen size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'save', label: 'Save', shortcut: '⌘S', icon: <Save size={12} />, onSelect: handleSave },
          { type: 'action', id: 'saveas', label: 'Save As...', shortcut: '⌘⇧S' },
          {
            type: 'submenu',
            id: 'export',
            label: 'Export',
            icon: <Image size={12} />,
            items: [
              { type: 'action', id: 'export-png', label: 'Export as PNG' },
              { type: 'action', id: 'export-jpg', label: 'Export as JPEG' },
              { type: 'action', id: 'export-svg', label: 'Export as SVG' },
              { type: 'action', id: 'export-pdf', label: 'Export as PDF' },
            ],
          },
          { type: 'separator' },
          { type: 'action', id: 'close', label: 'Close', shortcut: '⌘W' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          { type: 'action', id: 'undo', label: 'Undo', shortcut: '⌘Z', icon: <Undo size={12} /> },
          { type: 'action', id: 'redo', label: 'Redo', shortcut: '⌘⇧Z', icon: <Redo size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'cut', label: 'Cut', shortcut: '⌘X', icon: <Scissors size={12} /> },
          { type: 'action', id: 'copy', label: 'Copy', shortcut: '⌘C', icon: <Copy size={12} /> },
          { type: 'action', id: 'paste', label: 'Paste', shortcut: '⌘V', icon: <Clipboard size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'transform', label: 'Free Transform', shortcut: '⌘T' },
          {
            type: 'submenu',
            id: 'transform-menu',
            label: 'Transform',
            items: [
              { type: 'action', id: 'scale', label: 'Scale' },
              { type: 'action', id: 'rotate', label: 'Rotate' },
              { type: 'action', id: 'skew', label: 'Skew' },
              { type: 'action', id: 'flip-h', label: 'Flip Horizontal' },
              { type: 'action', id: 'flip-v', label: 'Flip Vertical' },
            ],
          },
        ],
      },
      {
        id: 'layer',
        label: 'Layer',
        items: [
          { type: 'action', id: 'new-layer', label: 'New Layer', shortcut: '⌘⇧N', icon: <Plus size={12} /> },
          { type: 'action', id: 'duplicate-layer', label: 'Duplicate Layer', shortcut: '⌘J' },
          { type: 'action', id: 'delete-layer', label: 'Delete Layer', icon: <Trash2 size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'group', label: 'Group Layers', shortcut: '⌘G' },
          { type: 'action', id: 'ungroup', label: 'Ungroup Layers', shortcut: '⌘⇧G' },
          { type: 'separator' },
          { type: 'action', id: 'merge-down', label: 'Merge Down', shortcut: '⌘E' },
          { type: 'action', id: 'flatten', label: 'Flatten Image' },
        ],
      },
      {
        id: 'view',
        label: 'View',
        items: [
          { type: 'action', id: 'zoom-in', label: 'Zoom In', shortcut: '⌘+' },
          { type: 'action', id: 'zoom-out', label: 'Zoom Out', shortcut: '⌘-' },
          { type: 'action', id: 'fit-screen', label: 'Fit on Screen', shortcut: '⌘0' },
          { type: 'action', id: 'actual-size', label: 'Actual Pixels', shortcut: '⌘1' },
          { type: 'separator' },
          { type: 'checkbox', id: 'rulers', label: 'Rulers', checked: true, shortcut: '⌘R' },
          { type: 'checkbox', id: 'grid', label: 'Grid', checked: false, shortcut: "⌘'" },
          { type: 'checkbox', id: 'guides', label: 'Guides', checked: true, shortcut: '⌘;' },
          { type: 'separator' },
          {
            type: 'submenu',
            id: 'panels',
            label: 'Panels',
            items: [
              { type: 'checkbox', id: 'layers-panel', label: 'Layers', checked: true },
              { type: 'checkbox', id: 'history-panel', label: 'History', checked: true },
              { type: 'checkbox', id: 'swatches-panel', label: 'Swatches', checked: true },
              { type: 'checkbox', id: 'brushes-panel', label: 'Brushes', checked: false },
            ],
          },
        ],
      },
      {
        id: 'filter',
        label: 'Filter',
        items: [
          {
            type: 'submenu',
            id: 'blur',
            label: 'Blur',
            items: [
              { type: 'action', id: 'gaussian', label: 'Gaussian Blur...' },
              { type: 'action', id: 'motion', label: 'Motion Blur...' },
              { type: 'action', id: 'radial', label: 'Radial Blur...' },
            ],
          },
          {
            type: 'submenu',
            id: 'sharpen',
            label: 'Sharpen',
            items: [
              { type: 'action', id: 'sharpen', label: 'Sharpen' },
              { type: 'action', id: 'unsharp', label: 'Unsharp Mask...' },
            ],
          },
          { type: 'separator' },
          { type: 'action', id: 'noise', label: 'Add Noise...' },
        ],
      },
    ];

    // Tool-specific options based on selected tool
    const renderToolOptions = () => {
      switch (selectedTool) {
        case 'brush':
        case 'eraser':
          return (
            <>
              <PropertyRow label="Size" labelWidth="auto" className="w-32">
                <NumberSpinner value={brushSize} onChange={setBrushSize} suffix="px" min={1} max={1000} />
              </PropertyRow>
              <ToolbarSeparator />
              <PropertyRow label="Hardness" labelWidth="auto" className="w-36">
                <SliderWithInput value={brushHardness} onChange={setBrushHardness} min={0} max={100} suffix="%" />
              </PropertyRow>
              <ToolbarSeparator />
              <PropertyRow label="Opacity" labelWidth="auto" className="w-36">
                <SliderWithInput value={brushOpacity} onChange={setBrushOpacity} min={0} max={100} suffix="%" />
              </PropertyRow>
            </>
          );
        case 'move':
          return (
            <>
              <Checkbox checked={true} />
              <span className="text-xs text-text-label">Auto-Select</span>
              <ToolbarSeparator />
              <Checkbox checked={true} />
              <span className="text-xs text-text-label">Show Transform Controls</span>
            </>
          );
        case 'select':
        case 'ellipse':
          return (
            <>
              <Select defaultValue="new">
                <SelectTrigger size="sm" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Selection</SelectItem>
                  <SelectItem value="add">Add to Selection</SelectItem>
                  <SelectItem value="subtract">Subtract</SelectItem>
                  <SelectItem value="intersect">Intersect</SelectItem>
                </SelectContent>
              </Select>
              <ToolbarSeparator />
              <PropertyRow label="Feather" labelWidth="auto" className="w-28">
                <NumberSpinner value={0} suffix="px" min={0} max={250} />
              </PropertyRow>
              <ToolbarSeparator />
              <Checkbox checked={antiAlias} onCheckedChange={(c) => setAntiAlias(c === true)} />
              <span className="text-xs text-text-label">Anti-alias</span>
            </>
          );
        case 'text':
          return (
            <>
              <Select defaultValue="arial">
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
              <ToolbarSeparator />
              <PropertyRow label="Size" labelWidth="auto" className="w-24">
                <NumberSpinner value={24} suffix="pt" min={1} max={1000} />
              </PropertyRow>
              <ToolbarSeparator />
              <ColorInput value={foregroundColor} onChange={setForegroundColor} />
            </>
          );
        case 'fill':
          return (
            <>
              <Select defaultValue="foreground">
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foreground">Foreground Color</SelectItem>
                  <SelectItem value="background">Background Color</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                </SelectContent>
              </Select>
              <ToolbarSeparator />
              <PropertyRow label="Opacity" labelWidth="auto" className="w-36">
                <SliderWithInput value={100} min={0} max={100} suffix="%" />
              </PropertyRow>
              <ToolbarSeparator />
              <PropertyRow label="Tolerance" labelWidth="auto" className="w-28">
                <NumberSpinner value={32} min={0} max={255} />
              </PropertyRow>
            </>
          );
        default:
          return (
            <span className="text-xs text-text-muted">Select a tool to see options</span>
          );
      }
    };

    const swatches = [
      { id: 'black', color: '#000000', name: 'Black' },
      { id: 'white', color: '#ffffff', name: 'White' },
      { id: 'red', color: '#ef4444', name: 'Red' },
      { id: 'orange', color: '#f97316', name: 'Orange' },
      { id: 'yellow', color: '#eab308', name: 'Yellow' },
      { id: 'green', color: '#22c55e', name: 'Green' },
      { id: 'blue', color: '#3b82f6', name: 'Blue' },
      { id: 'purple', color: '#a855f7', name: 'Purple' },
      { id: 'pink', color: '#ec4899', name: 'Pink' },
      { id: 'gray', color: '#6b7280', name: 'Gray' },
      { id: 'brown', color: '#92400e', name: 'Brown' },
      { id: 'cyan', color: '#06b6d4', name: 'Cyan' },
    ];

    return (
      <ToastProvider position="bottom-right">
        <div className="flex flex-col h-screen bg-surface">
          {/* Menu Bar */}
          <MenuBar menus={menuDefinitions} />

          <div className="flex flex-1 overflow-hidden">
            {/* Left Toolbar */}
            <Toolbar orientation="vertical" className="rounded-none border-r">
              <ToolbarToggleGroup
                type="single"
                value={selectedTool}
                onValueChange={(v) => v && setSelectedTool(v as string)}
              >
                <ToolbarToggleItem value="move" tooltip="Move Tool (V)">
                  <Move />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="select" tooltip="Rectangle Select (M)">
                  <Square />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="ellipse" tooltip="Ellipse Select (L)">
                  <Circle />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
              <ToolbarSeparator orientation="horizontal" />
              <ToolbarToggleGroup
                type="single"
                value={selectedTool}
                onValueChange={(v) => v && setSelectedTool(v as string)}
              >
                <ToolbarToggleItem value="brush" tooltip="Brush Tool (B)">
                  <Pencil />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="eraser" tooltip="Eraser Tool (E)">
                  <Eraser />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="fill" tooltip="Paint Bucket (G)">
                  <PaintBucket />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="eyedropper" tooltip="Eyedropper (I)">
                  <Pipette />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
              <ToolbarSeparator orientation="horizontal" />
              <ToolbarToggleGroup
                type="single"
                value={selectedTool}
                onValueChange={(v) => v && setSelectedTool(v as string)}
              >
                <ToolbarToggleItem value="text" tooltip="Text Tool (T)">
                  <Type />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="hand" tooltip="Hand Tool (H)">
                  <Hand />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="zoom" tooltip="Zoom Tool (Z)">
                  <ZoomIn />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Color swatches at bottom */}
              <div className="relative w-8 h-8 mb-2">
                <div
                  className="absolute top-0 left-0 w-5 h-5 rounded-sm border border-panel-border shadow-sm cursor-pointer"
                  style={{ backgroundColor: foregroundColor }}
                  title="Foreground Color"
                />
                <div
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-sm border border-panel-border shadow-sm cursor-pointer"
                  style={{ backgroundColor: backgroundColor }}
                  title="Background Color"
                />
              </div>
            </Toolbar>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Top Options Bar */}
              <Toolbar className="rounded-none border-b justify-start gap-2 px-2">
                <span className="text-2xs text-text-muted uppercase tracking-wide">{selectedTool}:</span>
                <ToolbarSeparator />
                {renderToolOptions()}
              </Toolbar>

              {/* Canvas Area */}
              <div
                className="flex-1 bg-surface-sunken flex items-center justify-center overflow-auto"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setCursorPos({
                    x: Math.round(e.clientX - rect.left),
                    y: Math.round(e.clientY - rect.top),
                  });
                }}
              >
                <div
                  className="bg-white shadow-dropdown rounded-sm flex items-center justify-center text-text-muted relative"
                  style={{
                    width: `${1024 * (zoom / 100)}px`,
                    height: `${768 * (zoom / 100)}px`,
                    backgroundImage: `
                      linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                >
                  <span className="text-sm">1024 × 768 @ {zoom}%</span>
                </div>
              </div>
            </div>

            {/* Right Panels */}
            <div className="w-72 bg-panel border-l border-panel-border flex flex-col overflow-hidden">
              <SplitPane
                direction="vertical"
                defaultFirstSize={55}
                minFirstSize={150}
                minSecondSize={150}
                first={
                  <div className="h-full overflow-auto">
                    <PanelGroup>
                      {/* Layers Panel */}
                      <Panel title="Layers" collapsible icon={<Layers size={12} />} defaultCollapsed={false}>
                        <Toolbar className="mb-2 border-0 bg-transparent p-0">
                          <ToolbarButton tooltip="New Layer">
                            <Plus size={14} />
                          </ToolbarButton>
                          <ToolbarButton tooltip="New Group">
                            <FolderOpen size={14} />
                          </ToolbarButton>
                          <ToolbarSeparator />
                          <Select defaultValue="normal">
                            <SelectTrigger size="sm" className="w-20 h-5 text-2xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="multiply">Multiply</SelectItem>
                              <SelectItem value="screen">Screen</SelectItem>
                              <SelectItem value="overlay">Overlay</SelectItem>
                            </SelectContent>
                          </Select>
                          <ToolbarSeparator />
                          <ToolbarButton tooltip="Delete Layer">
                            <Trash2 size={14} />
                          </ToolbarButton>
                        </Toolbar>
                        <LayerStack
                          layers={layers}
                          selectedId={selectedLayer}
                          onSelect={setSelectedLayer}
                          onVisibilityChange={(id, visible) =>
                            setLayers((l) => l.map((layer) => (layer.id === id ? { ...layer, visible } : layer)))
                          }
                          onLockChange={(id, locked) =>
                            setLayers((l) => l.map((layer) => (layer.id === id ? { ...layer, locked } : layer)))
                          }
                          onOpacityChange={(id, opacity) =>
                            setLayers((l) => l.map((layer) => (layer.id === id ? { ...layer, opacity } : layer)))
                          }
                          onReorder={setLayers}
                        />
                      </Panel>

                      {/* History Panel */}
                      <Panel title="History" collapsible icon={<Undo size={12} />}>
                        <div className="space-y-0.5">
                          {history.map((item, index) => (
                            <button
                              key={item.id}
                              onClick={() => setHistoryIndex(index)}
                              className={`w-full text-left px-2 py-1 text-xs rounded-sm transition-colors ${
                                index === historyIndex
                                  ? 'bg-selection text-selection-text'
                                  : index > historyIndex
                                  ? 'text-text-muted opacity-50'
                                  : 'text-text hover:bg-control-hover'
                              }`}
                            >
                              {item.action}
                            </button>
                          ))}
                        </div>
                      </Panel>
                    </PanelGroup>
                  </div>
                }
                second={
                  <div className="h-full overflow-auto">
                    <PanelGroup>
                      {/* Swatches Panel */}
                      <Panel title="Swatches" collapsible icon={<Palette size={12} />}>
                        <SwatchPalette
                          swatches={swatches}
                          selectedId={selectedSwatch}
                          onSwatchSelect={(s) => {
                            setSelectedSwatch(s.id);
                            setForegroundColor(s.color);
                          }}
                          allowAdd
                          onAdd={() => console.log('Add swatch')}
                          columns={6}
                          size="sm"
                        />
                      </Panel>

                      {/* Gradient Panel */}
                      <Panel title="Gradient" collapsible icon={<Sliders size={12} />}>
                        <GradientEditor
                          value={gradient}
                          onChange={setGradient}
                          selectedStopId={selectedGradientStop}
                          onStopSelect={(s) => setSelectedGradientStop(s?.id)}
                        />
                      </Panel>

                      {/* Color Panel */}
                      <Panel title="Color" collapsible icon={<Palette size={12} />}>
                        <div className="space-y-2">
                          <PropertyRow label="H">
                            <SliderWithInput defaultValue={210} max={360} suffix="°" />
                          </PropertyRow>
                          <PropertyRow label="S">
                            <SliderWithInput defaultValue={80} max={100} suffix="%" />
                          </PropertyRow>
                          <PropertyRow label="B">
                            <SliderWithInput defaultValue={60} max={100} suffix="%" />
                          </PropertyRow>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </div>
                }
              />
            </div>
          </div>

          {/* Status Bar */}
          <StatusBar>
            <StatusBarCoordinates x={cursorPos.x} y={cursorPos.y} />
            <StatusBarSeparator />
            <StatusBarItem>1024 × 768 px</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>RGB/8</StatusBarItem>
            <StatusBarSeparator />
            {isSaving && (
              <>
                <StatusBarProgress value={saveProgress} label="Saving..." />
                <StatusBarSeparator />
              </>
            )}
            <div className="flex-1" />
            <StatusBarItem className="text-text-muted">Press ⌘K for commands</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarZoom
              value={zoom}
              onChange={setZoom}
              presets={[25, 50, 100, 200, 400]}
            />
          </StatusBar>

          {/* Command Palette */}
          <CommandPalette
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
            commands={commands}
            onSelect={(cmd) => {
              cmd.onSelect?.();
              setCommandPaletteOpen(false);
            }}
            placeholder="Search commands..."
          />
        </div>
      </ToastProvider>
    );
  },
};

export const BlenderStyleNodeEditor: StoryObj = {
  render: () => {
    // Workspace state
    const [activeWorkspace, setActiveWorkspace] = React.useState('shading');
    const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

    // Scene hierarchy
    const [selectedObjects, setSelectedObjects] = React.useState(['cube']);
    const [expandedObjects, setExpandedObjects] = React.useState(['collection']);

    // Transform state
    const [location, setLocation] = React.useState({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = React.useState({ x: 0, y: 0, z: 0 });
    const [scale, setScale] = React.useState({ x: 1, y: 1, z: 1 });

    // Material state
    const [baseColor, setBaseColor] = React.useState('#808080');
    const [roughness, setRoughness] = React.useState(50);
    const [metallic, setMetallic] = React.useState(0);
    const [emission, setEmission] = React.useState(0);

    // Render state
    const [isRendering, setIsRendering] = React.useState(false);
    const [renderProgress, setRenderProgress] = React.useState(0);
    const [renderSamples, setRenderSamples] = React.useState(128);

    // View state
    const [showGrid, setShowGrid] = React.useState(true);
    const [showOverlay, setShowOverlay] = React.useState(true);
    const [shadingMode, setShadingMode] = React.useState('material');

    // Keyboard shortcut for search
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F3') {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Simulate render
    const handleRender = () => {
      setIsRendering(true);
      setRenderProgress(0);
      const interval = setInterval(() => {
        setRenderProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsRendering(false), 1000);
            return 100;
          }
          return p + 2;
        });
      }, 50);
    };

    const sceneData = [
      {
        id: 'collection',
        label: 'Scene Collection',
        icon: <FolderOpen size={14} />,
        children: [
          { id: 'camera', label: 'Camera', icon: <Eye size={14} /> },
          { id: 'light', label: 'Light', icon: <Circle size={14} /> },
          { id: 'cube', label: 'Cube', icon: <Square size={14} /> },
          { id: 'sphere', label: 'Sphere', icon: <Circle size={14} /> },
        ],
      },
    ];

    const commands = [
      { id: 'add-cube', label: 'Add Cube', shortcut: ['⇧', 'A'], icon: <Square size={14} />, category: 'Add' },
      { id: 'add-sphere', label: 'Add Sphere', shortcut: ['⇧', 'A'], icon: <Circle size={14} />, category: 'Add' },
      { id: 'add-plane', label: 'Add Plane', shortcut: ['⇧', 'A'], icon: <Square size={14} />, category: 'Add' },
      { id: 'add-light', label: 'Add Light', shortcut: ['⇧', 'A'], icon: <Circle size={14} />, category: 'Add' },
      { id: 'render', label: 'Render Image', shortcut: ['F12'], icon: <Image size={14} />, category: 'Render', onSelect: handleRender },
      { id: 'render-anim', label: 'Render Animation', shortcut: ['⌃', 'F12'], icon: <Image size={14} />, category: 'Render' },
      { id: 'duplicate', label: 'Duplicate', shortcut: ['⇧', 'D'], icon: <Copy size={14} />, category: 'Object' },
      { id: 'delete', label: 'Delete', shortcut: ['X'], icon: <Trash2 size={14} />, category: 'Object' },
      { id: 'grab', label: 'Grab/Move', shortcut: ['G'], icon: <Move size={14} />, category: 'Transform' },
      { id: 'rotate', label: 'Rotate', shortcut: ['R'], icon: <Move size={14} />, category: 'Transform' },
      { id: 'scale', label: 'Scale', shortcut: ['S'], icon: <Move size={14} />, category: 'Transform' },
      { id: 'undo', label: 'Undo', shortcut: ['⌘', 'Z'], icon: <Undo size={14} />, category: 'Edit' },
      { id: 'redo', label: 'Redo', shortcut: ['⌘', '⇧', 'Z'], icon: <Redo size={14} />, category: 'Edit' },
    ];

    const menuDefinitions: MenuDefinition[] = [
      {
        id: 'file',
        label: 'File',
        items: [
          { type: 'action', id: 'new', label: 'New', shortcut: '⌘N' },
          { type: 'action', id: 'open', label: 'Open...', shortcut: '⌘O' },
          { type: 'separator' },
          { type: 'action', id: 'save', label: 'Save', shortcut: '⌘S' },
          { type: 'action', id: 'saveas', label: 'Save As...', shortcut: '⌘⇧S' },
          { type: 'separator' },
          {
            type: 'submenu',
            id: 'export',
            label: 'Export',
            items: [
              { type: 'action', id: 'export-fbx', label: 'FBX (.fbx)' },
              { type: 'action', id: 'export-obj', label: 'Wavefront (.obj)' },
              { type: 'action', id: 'export-gltf', label: 'glTF 2.0 (.glb/.gltf)' },
            ],
          },
          { type: 'separator' },
          { type: 'action', id: 'quit', label: 'Quit', shortcut: '⌘Q' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          { type: 'action', id: 'undo', label: 'Undo', shortcut: '⌘Z' },
          { type: 'action', id: 'redo', label: 'Redo', shortcut: '⌘⇧Z' },
          { type: 'separator' },
          { type: 'action', id: 'preferences', label: 'Preferences...', shortcut: '⌘,' },
        ],
      },
      {
        id: 'add',
        label: 'Add',
        items: [
          {
            type: 'submenu',
            id: 'mesh',
            label: 'Mesh',
            items: [
              { type: 'action', id: 'add-plane', label: 'Plane' },
              { type: 'action', id: 'add-cube', label: 'Cube' },
              { type: 'action', id: 'add-circle', label: 'Circle' },
              { type: 'action', id: 'add-sphere', label: 'UV Sphere' },
              { type: 'action', id: 'add-cylinder', label: 'Cylinder' },
              { type: 'action', id: 'add-cone', label: 'Cone' },
              { type: 'action', id: 'add-torus', label: 'Torus' },
            ],
          },
          {
            type: 'submenu',
            id: 'light',
            label: 'Light',
            items: [
              { type: 'action', id: 'add-point', label: 'Point' },
              { type: 'action', id: 'add-sun', label: 'Sun' },
              { type: 'action', id: 'add-spot', label: 'Spot' },
              { type: 'action', id: 'add-area', label: 'Area' },
            ],
          },
          { type: 'action', id: 'add-camera', label: 'Camera' },
          { type: 'separator' },
          { type: 'action', id: 'add-empty', label: 'Empty' },
        ],
      },
      {
        id: 'object',
        label: 'Object',
        items: [
          { type: 'action', id: 'duplicate', label: 'Duplicate', shortcut: '⇧D' },
          { type: 'action', id: 'delete', label: 'Delete', shortcut: 'X' },
          { type: 'separator' },
          {
            type: 'submenu',
            id: 'transform',
            label: 'Transform',
            items: [
              { type: 'action', id: 'grab', label: 'Move', shortcut: 'G' },
              { type: 'action', id: 'rotate', label: 'Rotate', shortcut: 'R' },
              { type: 'action', id: 'scale', label: 'Scale', shortcut: 'S' },
            ],
          },
          { type: 'action', id: 'apply', label: 'Apply Transforms', shortcut: '⌘A' },
        ],
      },
      {
        id: 'render',
        label: 'Render',
        items: [
          { type: 'action', id: 'render-image', label: 'Render Image', shortcut: 'F12', onSelect: handleRender },
          { type: 'action', id: 'render-animation', label: 'Render Animation', shortcut: '⌃F12' },
          { type: 'separator' },
          { type: 'action', id: 'view-render', label: 'View Render', shortcut: 'F11' },
        ],
      },
    ];

    const workspaces = [
      { id: 'layout', label: 'Layout' },
      { id: 'modeling', label: 'Modeling' },
      { id: 'sculpting', label: 'Sculpting' },
      { id: 'uv', label: 'UV Editing' },
      { id: 'texture', label: 'Texture Paint' },
      { id: 'shading', label: 'Shading' },
      { id: 'animation', label: 'Animation' },
      { id: 'rendering', label: 'Rendering' },
    ];

    return (
      <ToastProvider position="bottom-right">
        <div className="flex flex-col h-screen bg-surface">
          {/* Top Bar: Menu + Workspaces */}
          <div className="flex items-center border-b border-panel-border">
            <MenuBar menus={menuDefinitions} size="sm" />
            <div className="flex-1" />
            <Tabs value={activeWorkspace} onValueChange={setActiveWorkspace} className="h-full">
              <TabsList variant="pills" size="sm" className="h-6 bg-transparent px-2">
                {workspaces.map((ws) => (
                  <TabsTrigger key={ws.id} value={ws.id} variant="pills" size="sm">
                    {ws.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex-1" />
            <div className="px-2">
              <Button size="sm" variant="ghost" onClick={() => setCommandPaletteOpen(true)}>
                <Search size={14} />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0 flex overflow-hidden">
            <ResizablePanes
              direction="horizontal"
              panes={[
                { id: 'left', defaultSize: 15, minSize: 180 },
                { id: 'center', defaultSize: 65, minSize: 300 },
                { id: 'right', defaultSize: 20, minSize: 200 },
              ]}
            >
              {/* Left Panel: Outliner */}
              <div className="h-full flex flex-col bg-panel">
                <div className="px-2 py-1 border-b border-panel-border text-2xs text-text-muted font-medium uppercase tracking-wide">
                  Outliner
                </div>
                <div className="flex-1 overflow-auto p-1">
                  <TreeView
                    data={sceneData}
                    selected={selectedObjects}
                    expanded={expandedObjects}
                    onSelectionChange={setSelectedObjects}
                    onExpansionChange={setExpandedObjects}
                  />
                </div>
              </div>

              {/* Center: 3D Viewport */}
              <div className="h-full flex flex-col">
                {/* Viewport Header */}
                <Toolbar className="rounded-none border-b h-7 justify-start px-2">
                  <Select value={shadingMode} onValueChange={setShadingMode}>
                    <SelectTrigger size="sm" className="w-24 h-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="rendered">Rendered</SelectItem>
                    </SelectContent>
                  </Select>
                  <ToolbarSeparator />
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={showGrid}
                      onCheckedChange={(c) => setShowGrid(c === true)}
                      id="grid"
                    />
                    <label htmlFor="grid" className="text-2xs text-text-label cursor-pointer">Grid</label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={showOverlay}
                      onCheckedChange={(c) => setShowOverlay(c === true)}
                      id="overlay"
                    />
                    <label htmlFor="overlay" className="text-2xs text-text-label cursor-pointer">Overlays</label>
                  </div>
                  <div className="flex-1" />
                  <ToolbarButton tooltip="Render" onClick={handleRender}>
                    <Image size={14} />
                  </ToolbarButton>
                </Toolbar>

                {/* 3D Viewport */}
                <div className="flex-1 bg-surface-sunken flex items-center justify-center relative">
                  {/* Grid overlay */}
                  {showGrid && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, var(--panel-border) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--panel-border) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                      }}
                    />
                  )}
                  <div className="text-center">
                    <div className="w-24 h-24 border-2 border-accent rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Square size={40} className="text-accent" />
                    </div>
                    <span className="text-sm text-text-muted">Cube</span>
                    <div className="text-2xs text-text-muted mt-1">
                      {shadingMode.charAt(0).toUpperCase() + shadingMode.slice(1)} Mode
                    </div>
                  </div>

                  {/* Gizmo overlay */}
                  {showOverlay && (
                    <div className="absolute bottom-4 left-4 flex gap-1 text-2xs">
                      <span className="text-red-500">X</span>
                      <span className="text-green-500">Y</span>
                      <span className="text-blue-500">Z</span>
                    </div>
                  )}

                  {/* Render progress overlay */}
                  {isRendering && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="w-64 space-y-2">
                        <div className="text-sm text-white text-center">Rendering...</div>
                        <ProgressIndicator
                          value={renderProgress}
                          status="running"
                          showPercentage
                          showCancel
                          onCancel={() => setIsRendering(false)}
                        />
                        <div className="text-2xs text-gray-400 text-center">
                          Sample {Math.round((renderProgress / 100) * renderSamples)}/{renderSamples}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="h-8 border-t border-panel-border bg-panel flex items-center px-2 gap-2">
                  <ToolbarButton tooltip="Play" size="sm">
                    <Move size={12} />
                  </ToolbarButton>
                  <div className="flex-1 h-2 bg-surface-sunken rounded-full relative">
                    <div className="absolute left-1/4 top-0 w-0.5 h-full bg-accent" />
                  </div>
                  <span className="text-2xs text-text-muted tabular-nums">Frame 25 / 250</span>
                </div>
              </div>

              {/* Right Panel: Properties */}
              <div className="h-full flex flex-col bg-panel overflow-hidden">
                <Tabs defaultValue="object" className="flex-1 flex flex-col overflow-hidden">
                  <TabsList variant="default" size="sm" className="justify-start px-1 border-b border-panel-border rounded-none h-7">
                    <TabsTrigger value="object" variant="default" size="sm" title="Object">
                      <Square size={12} />
                    </TabsTrigger>
                    <TabsTrigger value="modifier" variant="default" size="sm" title="Modifiers">
                      <Sliders size={12} />
                    </TabsTrigger>
                    <TabsTrigger value="material" variant="default" size="sm" title="Material">
                      <Palette size={12} />
                    </TabsTrigger>
                    <TabsTrigger value="render" variant="default" size="sm" title="Render">
                      <Image size={12} />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="object" className="flex-1 overflow-auto p-0 m-0">
                    <PanelGroup>
                      <Panel title="Transform" collapsible defaultCollapsed={false}>
                        <PropertyGroup title="Location">
                          <PropertyRow label="X">
                            <NumberSpinner
                              value={location.x}
                              onChange={(v) => setLocation((l) => ({ ...l, x: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                          <PropertyRow label="Y">
                            <NumberSpinner
                              value={location.y}
                              onChange={(v) => setLocation((l) => ({ ...l, y: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                          <PropertyRow label="Z">
                            <NumberSpinner
                              value={location.z}
                              onChange={(v) => setLocation((l) => ({ ...l, z: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                        </PropertyGroup>
                        <PropertyGroup title="Rotation" divider>
                          <PropertyRow label="X">
                            <NumberSpinner
                              value={rotation.x}
                              onChange={(v) => setRotation((r) => ({ ...r, x: v }))}
                              precision={1}
                              suffix="°"
                            />
                          </PropertyRow>
                          <PropertyRow label="Y">
                            <NumberSpinner
                              value={rotation.y}
                              onChange={(v) => setRotation((r) => ({ ...r, y: v }))}
                              precision={1}
                              suffix="°"
                            />
                          </PropertyRow>
                          <PropertyRow label="Z">
                            <NumberSpinner
                              value={rotation.z}
                              onChange={(v) => setRotation((r) => ({ ...r, z: v }))}
                              precision={1}
                              suffix="°"
                            />
                          </PropertyRow>
                        </PropertyGroup>
                        <PropertyGroup title="Scale" divider>
                          <PropertyRow label="X">
                            <NumberSpinner
                              value={scale.x}
                              onChange={(v) => setScale((s) => ({ ...s, x: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                          <PropertyRow label="Y">
                            <NumberSpinner
                              value={scale.y}
                              onChange={(v) => setScale((s) => ({ ...s, y: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                          <PropertyRow label="Z">
                            <NumberSpinner
                              value={scale.z}
                              onChange={(v) => setScale((s) => ({ ...s, z: v }))}
                              precision={3}
                              step={0.1}
                            />
                          </PropertyRow>
                        </PropertyGroup>
                      </Panel>
                    </PanelGroup>
                  </TabsContent>

                  <TabsContent value="modifier" className="flex-1 overflow-auto p-0 m-0">
                    <PanelGroup>
                      <Panel title="Modifiers" collapsible>
                        <div className="text-center py-4">
                          <Button size="sm" variant="outline" className="w-full">
                            <Plus size={12} className="mr-1" />
                            Add Modifier
                          </Button>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </TabsContent>

                  <TabsContent value="material" className="flex-1 overflow-auto p-0 m-0">
                    <PanelGroup>
                      <Panel title="Surface" collapsible defaultCollapsed={false}>
                        <div className="space-y-3">
                          <PropertyRow label="Base Color">
                            <ColorInput value={baseColor} onChange={setBaseColor} />
                          </PropertyRow>
                          <PropertyRow label="Metallic">
                            <SliderWithInput
                              value={metallic}
                              onChange={setMetallic}
                              min={0}
                              max={100}
                              suffix="%"
                            />
                          </PropertyRow>
                          <PropertyRow label="Roughness">
                            <SliderWithInput
                              value={roughness}
                              onChange={setRoughness}
                              min={0}
                              max={100}
                              suffix="%"
                            />
                          </PropertyRow>
                          <PropertyRow label="Emission">
                            <SliderWithInput
                              value={emission}
                              onChange={setEmission}
                              min={0}
                              max={100}
                              suffix="%"
                            />
                          </PropertyRow>
                        </div>
                      </Panel>
                      <Panel title="Settings" collapsible>
                        <PropertyRow label="Blend Mode">
                          <Select defaultValue="opaque">
                            <SelectTrigger size="sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="opaque">Opaque</SelectItem>
                              <SelectItem value="alpha-clip">Alpha Clip</SelectItem>
                              <SelectItem value="alpha-blend">Alpha Blend</SelectItem>
                            </SelectContent>
                          </Select>
                        </PropertyRow>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-text-label">Backface Culling</span>
                          <Switch size="sm" />
                        </div>
                      </Panel>
                    </PanelGroup>
                  </TabsContent>

                  <TabsContent value="render" className="flex-1 overflow-auto p-0 m-0">
                    <PanelGroup>
                      <Panel title="Render Engine" collapsible>
                        <Select defaultValue="cycles">
                          <SelectTrigger size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eevee">Eevee</SelectItem>
                            <SelectItem value="cycles">Cycles</SelectItem>
                            <SelectItem value="workbench">Workbench</SelectItem>
                          </SelectContent>
                        </Select>
                      </Panel>
                      <Panel title="Sampling" collapsible>
                        <PropertyRow label="Samples">
                          <NumberSpinner
                            value={renderSamples}
                            onChange={setRenderSamples}
                            min={1}
                            max={4096}
                          />
                        </PropertyRow>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-text-label">Denoise</span>
                          <Switch defaultChecked size="sm" />
                        </div>
                      </Panel>
                      <Panel title="Output" collapsible>
                        <PropertyRow label="Resolution X">
                          <NumberSpinner defaultValue={1920} suffix="px" min={1} max={8192} />
                        </PropertyRow>
                        <PropertyRow label="Resolution Y">
                          <NumberSpinner defaultValue={1080} suffix="px" min={1} max={8192} />
                        </PropertyRow>
                        <PropertyRow label="Frame Rate">
                          <NumberSpinner defaultValue={24} suffix="fps" min={1} max={120} />
                        </PropertyRow>
                      </Panel>
                    </PanelGroup>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanes>
          </div>

          {/* Status Bar */}
          <StatusBar>
            <StatusBarItem>
              {selectedObjects.length > 0 ? `Selected: ${selectedObjects[0]}` : 'No selection'}
            </StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>Verts: 8 | Faces: 6 | Tris: 12</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>Objects: 4</StatusBarItem>
            <div className="flex-1" />
            {isRendering && (
              <>
                <StatusBarProgress value={renderProgress} label="Rendering" />
                <StatusBarSeparator />
              </>
            )}
            <StatusBarItem className="text-text-muted">Press F3 to search</StatusBarItem>
          </StatusBar>

          {/* Command Palette */}
          <CommandPalette
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
            commands={commands}
            onSelect={(cmd) => {
              cmd.onSelect?.();
              setCommandPaletteOpen(false);
            }}
            placeholder="Search operators..."
          />
        </div>
      </ToastProvider>
    );
  },
};

export const ComponentShowcase: StoryObj = {
  render: () => {
    return (
      <div className="p-6 bg-surface min-h-screen">
        <h1 className="text-lg font-medium text-text mb-6">Component Showcase</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Buttons */}
          <Panel title="Buttons">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="icon">
                <Settings size={16} />
              </Button>
            </div>
          </Panel>

          {/* Inputs */}
          <Panel title="Inputs">
            <div className="space-y-2">
              <Input placeholder="Text input..." />
              <NumberSpinner defaultValue={42} suffix="px" />
              <SliderWithInput defaultValue={75} max={100} suffix="%" />
              <ColorInput defaultValue="#ff6b6b" />
            </div>
          </Panel>

          {/* Toggles */}
          <Panel title="Toggles">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Checkbox id="c1" defaultChecked />
                <label htmlFor="c1" className="text-xs">Checkbox</label>
              </div>
              <div className="flex items-center gap-4">
                <Switch id="s1" defaultChecked />
                <label htmlFor="s1" className="text-xs">Switch</label>
              </div>
            </div>
          </Panel>

          {/* Select */}
          <Panel title="Select">
            <Select defaultValue="option1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Panel>

          {/* Tabs */}
          <Panel title="Tabs" className="col-span-2">
            <Tabs defaultValue="default">
              <TabsList>
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="pills">Pills</TabsTrigger>
                <TabsTrigger value="underline">Underline</TabsTrigger>
              </TabsList>
              <TabsContent value="default">
                <Tabs defaultValue="a">
                  <TabsList variant="default">
                    <TabsTrigger value="a" variant="default">Tab A</TabsTrigger>
                    <TabsTrigger value="b" variant="default">Tab B</TabsTrigger>
                    <TabsTrigger value="c" variant="default">Tab C</TabsTrigger>
                  </TabsList>
                </Tabs>
              </TabsContent>
              <TabsContent value="pills">
                <Tabs defaultValue="a">
                  <TabsList variant="pills">
                    <TabsTrigger value="a" variant="pills">Tab A</TabsTrigger>
                    <TabsTrigger value="b" variant="pills">Tab B</TabsTrigger>
                    <TabsTrigger value="c" variant="pills">Tab C</TabsTrigger>
                  </TabsList>
                </Tabs>
              </TabsContent>
              <TabsContent value="underline">
                <Tabs defaultValue="a">
                  <TabsList variant="underline">
                    <TabsTrigger value="a" variant="underline">Tab A</TabsTrigger>
                    <TabsTrigger value="b" variant="underline">Tab B</TabsTrigger>
                    <TabsTrigger value="c" variant="underline">Tab C</TabsTrigger>
                  </TabsList>
                </Tabs>
              </TabsContent>
            </Tabs>
          </Panel>
        </div>
      </div>
    );
  },
};

// New Components Showcase
export const NewComponentsShowcase: StoryObj = {
  render: () => {
    const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
    const [selectedSwatch, setSelectedSwatch] = React.useState<string | undefined>('red');
    const [gradient, setGradient] = React.useState<GradientValue>(createDefaultGradient());
    const [selectedStop, setSelectedStop] = React.useState<string | undefined>();
    const [layers, setLayers] = React.useState<Layer[]>([
      { id: '1', name: 'Background', visible: true, locked: false, opacity: 100 },
      { id: '2', name: 'Layer 1', visible: true, locked: false, opacity: 80 },
      { id: '3', name: 'Layer 2', visible: false, locked: true, opacity: 100 },
    ]);
    const [selectedLayer, setSelectedLayer] = React.useState('2');

    const commands = [
      { id: 'new', label: 'New File', shortcut: ['⌘', 'N'], icon: <File size={14} /> },
      { id: 'open', label: 'Open File', shortcut: ['⌘', 'O'], icon: <FolderOpen size={14} /> },
      { id: 'save', label: 'Save', shortcut: ['⌘', 'S'], icon: <Save size={14} /> },
      { id: 'copy', label: 'Copy', shortcut: ['⌘', 'C'], icon: <Copy size={14} /> },
      { id: 'paste', label: 'Paste', shortcut: ['⌘', 'V'], icon: <Clipboard size={14} /> },
      { id: 'undo', label: 'Undo', shortcut: ['⌘', 'Z'], icon: <Undo size={14} /> },
      { id: 'redo', label: 'Redo', shortcut: ['⌘', '⇧', 'Z'], icon: <Redo size={14} /> },
    ];

    const breadcrumbItems = [
      { id: '1', label: 'Home', icon: <Home size={12} /> },
      { id: '2', label: 'Projects' },
      { id: '3', label: 'Design System' },
      { id: '4', label: 'Components' },
    ];

    const menuDefinitions: MenuDefinition[] = [
      {
        id: 'file',
        label: 'File',
        items: [
          { type: 'action', id: 'new', label: 'New', shortcut: '⌘N', icon: <File size={12} /> },
          { type: 'action', id: 'open', label: 'Open', shortcut: '⌘O', icon: <FolderOpen size={12} /> },
          { type: 'action', id: 'save', label: 'Save', shortcut: '⌘S', icon: <Save size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'exit', label: 'Exit' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          { type: 'action', id: 'undo', label: 'Undo', shortcut: '⌘Z', icon: <Undo size={12} /> },
          { type: 'action', id: 'redo', label: 'Redo', shortcut: '⌘⇧Z', icon: <Redo size={12} /> },
          { type: 'separator' },
          { type: 'action', id: 'cut', label: 'Cut', shortcut: '⌘X', icon: <Scissors size={12} /> },
          { type: 'action', id: 'copy', label: 'Copy', shortcut: '⌘C', icon: <Copy size={12} /> },
          { type: 'action', id: 'paste', label: 'Paste', shortcut: '⌘V', icon: <Clipboard size={12} /> },
        ],
      },
      {
        id: 'view',
        label: 'View',
        items: [
          { type: 'checkbox', id: 'rulers', label: 'Rulers', checked: true },
          { type: 'checkbox', id: 'grid', label: 'Grid', checked: false },
          { type: 'separator' },
          {
            type: 'submenu',
            id: 'zoom',
            label: 'Zoom',
            items: [
              { type: 'action', id: 'zoom-in', label: 'Zoom In', shortcut: '⌘+' },
              { type: 'action', id: 'zoom-out', label: 'Zoom Out', shortcut: '⌘-' },
              { type: 'action', id: 'zoom-fit', label: 'Fit to Window', shortcut: '⌘0' },
            ],
          },
        ],
      },
    ];

    return (
      <div className="p-6 bg-surface min-h-screen space-y-6">
        <h1 className="text-lg font-medium text-text">New Components Showcase</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* MenuBar */}
          <Panel title="MenuBar" className="col-span-2">
            <MenuBar menus={menuDefinitions} />
          </Panel>

          {/* Breadcrumbs */}
          <Panel title="Breadcrumbs">
            <div className="space-y-4">
              <Breadcrumbs items={breadcrumbItems} />
              <Breadcrumbs items={breadcrumbItems} showHomeIcon />
              <Breadcrumbs items={breadcrumbItems} maxItems={3} />
            </div>
          </Panel>

          {/* Command Palette */}
          <Panel title="Command Palette">
            <Button onClick={() => setCommandPaletteOpen(true)}>
              Open Command Palette (⌘K)
            </Button>
            <CommandPalette
              open={commandPaletteOpen}
              onOpenChange={setCommandPaletteOpen}
              commands={commands}
              onSelect={(cmd) => console.log('Selected:', cmd.label)}
            />
          </Panel>

          {/* SwatchPalette */}
          <Panel title="Swatch Palette">
            <SwatchPalette
              swatches={presetPalettes.basic}
              selectedId={selectedSwatch}
              onSwatchSelect={(s) => setSelectedSwatch(s.id)}
              allowAdd
              onAdd={() => console.log('Add swatch')}
            />
          </Panel>

          {/* GradientEditor */}
          <Panel title="Gradient Editor">
            <GradientEditor
              value={gradient}
              onChange={setGradient}
              selectedStopId={selectedStop}
              onStopSelect={(s) => setSelectedStop(s?.id)}
            />
          </Panel>

          {/* LayerStack */}
          <Panel title="Layer Stack">
            <LayerStack
              layers={layers}
              selectedId={selectedLayer}
              onSelect={setSelectedLayer}
              onVisibilityChange={(id, visible) =>
                setLayers((l) => l.map((layer) => (layer.id === id ? { ...layer, visible } : layer)))
              }
              onLockChange={(id, locked) =>
                setLayers((l) => l.map((layer) => (layer.id === id ? { ...layer, locked } : layer)))
              }
              onReorder={setLayers}
            />
          </Panel>

          {/* ProgressIndicator */}
          <Panel title="Progress Indicators">
            <div className="space-y-4">
              <ProgressIndicator
                label="Exporting image..."
                value={65}
                status="running"
                showCancel
                showPauseResume
                estimatedTime={45}
              />
              <ProgressIndicator
                label="Processing complete"
                value={100}
                status="completed"
              />
              <ProgressIndicator
                label="Upload failed"
                value={30}
                status="error"
                statusText="Network connection lost"
                variant="detailed"
              />
              <ProgressIndicator
                label="Rendering..."
                status="running"
                variant="minimal"
              />
            </div>
          </Panel>

          {/* ResizablePanes */}
          <Panel title="Resizable Panes" className="col-span-2">
            <div className="h-48 border border-panel-border rounded">
              <SplitPane
                direction="horizontal"
                defaultFirstSize={30}
                minFirstSize={100}
                first={
                  <div className="h-full bg-surface-sunken p-2 text-xs text-text-muted">
                    Left Pane (drag divider)
                  </div>
                }
                second={
                  <SplitPane
                    direction="vertical"
                    defaultFirstSize={60}
                    first={
                      <div className="h-full bg-surface p-2 text-xs text-text-muted">
                        Top Right
                      </div>
                    }
                    second={
                      <div className="h-full bg-surface-sunken p-2 text-xs text-text-muted">
                        Bottom Right
                      </div>
                    }
                  />
                }
              />
            </div>
          </Panel>

          {/* StatusBar */}
          <Panel title="Status Bar" className="col-span-2">
            <StatusBar>
              <StatusBarCoordinates x={1024} y={768} />
              <StatusBarSeparator />
              <StatusBarItem>Document: 1920 × 1080</StatusBarItem>
              <StatusBarSeparator />
              <StatusBarProgress value={45} label="Saving..." />
              <div className="flex-1" />
              <StatusBarZoom value={100} />
            </StatusBar>
          </Panel>
        </div>
      </div>
    );
  },
};

// Toast Demo with Provider
const ToastDemoContent: React.FC = () => {
  const { addToast } = useToast();

  return (
    <div className="space-y-2">
      <Button onClick={() => addToast({ type: 'info', title: 'Info', description: 'This is an info message' })}>
        Show Info Toast
      </Button>
      <Button onClick={() => addToast({ type: 'success', title: 'Success', description: 'Operation completed!' })}>
        Show Success Toast
      </Button>
      <Button onClick={() => addToast({ type: 'warning', title: 'Warning', description: 'Please review your changes' })}>
        Show Warning Toast
      </Button>
      <Button onClick={() => addToast({ type: 'error', title: 'Error', description: 'Something went wrong' })}>
        Show Error Toast
      </Button>
    </div>
  );
};

export const ToastDemo: StoryObj = {
  render: () => (
    <ToastProvider position="bottom-right">
      <div className="p-6 bg-surface min-h-screen">
        <Panel title="Toast Notifications">
          <ToastDemoContent />
        </Panel>
      </div>
    </ToastProvider>
  ),
};
