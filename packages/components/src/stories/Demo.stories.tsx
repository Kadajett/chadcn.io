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
} from '../index';
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
    const [selectedTool, setSelectedTool] = React.useState('move');
    const [selectedLayers, setSelectedLayers] = React.useState(['layer-1']);
    const [expandedLayers, setExpandedLayers] = React.useState(['group-1']);

    const layerData = [
      {
        id: 'group-1',
        label: 'Group 1',
        icon: <FolderOpen size={14} />,
        children: [
          { id: 'layer-1', label: 'Background', icon: <Image size={14} /> },
          { id: 'layer-2', label: 'Shape Layer', icon: <Square size={14} /> },
        ],
      },
      { id: 'layer-3', label: 'Text Layer', icon: <Type size={14} /> },
      { id: 'layer-4', label: 'Adjustment', icon: <Sliders size={14} /> },
    ];

    return (
      <div className="flex h-screen bg-surface">
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
        </Toolbar>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Options Bar */}
          <Toolbar className="rounded-none border-b justify-start">
            <span className="text-xs text-text-muted px-2">Tool Options:</span>
            <ToolbarSeparator />
            <PropertyRow label="Size" labelWidth="auto" className="w-32">
              <NumberSpinner value={12} suffix="px" min={1} max={1000} />
            </PropertyRow>
            <ToolbarSeparator />
            <PropertyRow label="Opacity" labelWidth="auto" className="w-36">
              <SliderWithInput value={100} min={0} max={100} suffix="%" />
            </PropertyRow>
            <ToolbarSeparator />
            <Checkbox defaultChecked />
            <span className="text-xs text-text-label">Anti-alias</span>
          </Toolbar>

          {/* Canvas */}
          <div className="flex-1 bg-surface-sunken flex items-center justify-center">
            <div className="w-96 h-64 bg-white shadow-panel rounded-sm flex items-center justify-center text-text-muted">
              Canvas Area
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-panel border-l border-panel-border flex flex-col">
          <PanelGroup className="flex-1 overflow-auto">
            {/* Layers Panel */}
            <Panel title="Layers" collapsible icon={<Layers size={12} />}>
              <Toolbar className="mb-2 border-0 bg-transparent p-0">
                <ToolbarButton tooltip="New Layer">
                  <Plus size={14} />
                </ToolbarButton>
                <ToolbarButton tooltip="New Group">
                  <FolderOpen size={14} />
                </ToolbarButton>
                <ToolbarSeparator />
                <ToolbarButton tooltip="Delete Layer">
                  <Trash2 size={14} />
                </ToolbarButton>
              </Toolbar>
              <TreeView
                data={layerData}
                selected={selectedLayers}
                expanded={expandedLayers}
                onSelectionChange={setSelectedLayers}
                onExpansionChange={setExpandedLayers}
                multiSelect
              />
            </Panel>

            {/* Properties Panel */}
            <Panel title="Properties" collapsible icon={<Settings size={12} />}>
              <Tabs defaultValue="fill">
                <TabsList variant="underline" size="sm" className="w-full">
                  <TabsTrigger value="fill" variant="underline" size="sm">
                    Fill
                  </TabsTrigger>
                  <TabsTrigger value="stroke" variant="underline" size="sm">
                    Stroke
                  </TabsTrigger>
                  <TabsTrigger value="effects" variant="underline" size="sm">
                    Effects
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="fill" className="space-y-2 pt-2">
                  <PropertyRow label="Color">
                    <ColorInput defaultValue="#3b82f6" />
                  </PropertyRow>
                  <PropertyRow label="Opacity">
                    <SliderWithInput defaultValue={100} max={100} suffix="%" />
                  </PropertyRow>
                </TabsContent>
                <TabsContent value="stroke" className="space-y-2 pt-2">
                  <PropertyRow label="Color">
                    <ColorInput defaultValue="#000000" />
                  </PropertyRow>
                  <PropertyRow label="Width">
                    <NumberSpinner defaultValue={1} min={0} max={100} suffix="px" />
                  </PropertyRow>
                </TabsContent>
                <TabsContent value="effects" className="pt-2">
                  <Accordion type="multiple" defaultValue={['shadow']}>
                    <AccordionItem value="shadow">
                      <AccordionTrigger>Drop Shadow</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <PropertyRow label="Offset X">
                          <NumberSpinner defaultValue={4} suffix="px" />
                        </PropertyRow>
                        <PropertyRow label="Offset Y">
                          <NumberSpinner defaultValue={4} suffix="px" />
                        </PropertyRow>
                        <PropertyRow label="Blur">
                          <NumberSpinner defaultValue={8} min={0} suffix="px" />
                        </PropertyRow>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="glow">
                      <AccordionTrigger>Inner Glow</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <PropertyRow label="Color">
                          <ColorInput defaultValue="#ffffff" />
                        </PropertyRow>
                        <PropertyRow label="Size">
                          <NumberSpinner defaultValue={10} min={0} suffix="px" />
                        </PropertyRow>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
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
      </div>
    );
  },
};

export const BlenderStyleNodeEditor: StoryObj = {
  render: () => {
    return (
      <div className="h-screen bg-surface p-4" data-theme="blender">
        <div className="flex gap-4 h-full">
          {/* Node Properties */}
          <Panel className="w-72" title="Node Properties" collapsible>
            <div className="space-y-3">
              <PropertyGroup title="Transform">
                <PropertyRow label="Location X">
                  <NumberSpinner defaultValue={0} precision={2} />
                </PropertyRow>
                <PropertyRow label="Location Y">
                  <NumberSpinner defaultValue={0} precision={2} />
                </PropertyRow>
                <PropertyRow label="Scale">
                  <NumberSpinner defaultValue={1} precision={2} step={0.1} />
                </PropertyRow>
                <PropertyRow label="Rotation">
                  <NumberSpinner defaultValue={0} precision={1} suffix="°" />
                </PropertyRow>
              </PropertyGroup>

              <PropertyGroup title="Color" divider>
                <PropertyRow label="Base Color">
                  <ColorInput defaultValue="#808080" />
                </PropertyRow>
                <PropertyRow label="Roughness">
                  <SliderWithInput defaultValue={50} max={100} suffix="%" />
                </PropertyRow>
                <PropertyRow label="Metallic">
                  <SliderWithInput defaultValue={0} max={100} suffix="%" />
                </PropertyRow>
              </PropertyGroup>

              <PropertyGroup title="Options" divider>
                <PropertyRow label="Blend Mode">
                  <Select defaultValue="mix">
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mix">Mix</SelectItem>
                      <SelectItem value="add">Add</SelectItem>
                      <SelectItem value="multiply">Multiply</SelectItem>
                      <SelectItem value="screen">Screen</SelectItem>
                    </SelectContent>
                  </Select>
                </PropertyRow>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-text-label">Use Alpha</span>
                  <Switch defaultChecked size="sm" />
                </div>
              </PropertyGroup>
            </div>
          </Panel>

          {/* Canvas */}
          <div className="flex-1 bg-surface-sunken rounded-panel flex items-center justify-center">
            <span className="text-text-muted">Node Editor Canvas</span>
          </div>
        </div>
      </div>
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
