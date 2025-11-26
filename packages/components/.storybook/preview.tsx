import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import * as React from 'react';
import { TooltipProvider } from '../src/components/Tooltip';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: 'padded',
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        // Creative Tools
        photoshop: 'photoshop',
        blender: 'blender',
        gimp: 'gimp',
        vscode: 'vscode',
        // Daisy-UI Inspired
        cyberpunk: 'cyberpunk',
        synthwave: 'synthwave',
        dracula: 'dracula',
        nord: 'nord',
        retro: 'retro',
        coffee: 'coffee',
        sunset: 'sunset',
        aqua: 'aqua',
        // Retro OS
        'windows-95': 'win95',
        'windows-xp': 'winxp',
        'mac-os-9': 'macos9',
        // Accessibility
        light: 'light',
        'high-contrast': 'high-contrast',
      },
      defaultTheme: 'photoshop',
      attributeName: 'data-theme',
    }),
    // Wrap all stories with TooltipProvider
    (Story) => (
      <TooltipProvider delayDuration={300}>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default preview;
