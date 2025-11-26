import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Hyper-dense spacing scale (tighter than default)
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        // Panel-specific sizes
        'panel-sm': '200px',
        'panel-md': '280px',
        'panel-lg': '320px',
        'toolbar': '28px',
        'toolbar-lg': '36px',
      },
      // Compact font sizes for dense UIs
      fontSize: {
        '2xs': ['10px', { lineHeight: '12px' }],
        'xs': ['11px', { lineHeight: '14px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['13px', { lineHeight: '18px' }],
        'lg': ['14px', { lineHeight: '20px' }],
      },
      // Border radius for controls
      borderRadius: {
        'control': '3px',
        'panel': '4px',
        'button': '2px',
      },
      // CSS variable-based colors for theming
      colors: {
        // Surface colors
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          sunken: 'var(--surface-sunken)',
          overlay: 'var(--surface-overlay)',
        },
        // Panel backgrounds
        panel: {
          DEFAULT: 'var(--panel)',
          header: 'var(--panel-header)',
          border: 'var(--panel-border)',
        },
        // Control colors
        control: {
          DEFAULT: 'var(--control)',
          hover: 'var(--control-hover)',
          active: 'var(--control-active)',
          disabled: 'var(--control-disabled)',
          border: 'var(--control-border)',
        },
        // Input fields
        input: {
          DEFAULT: 'var(--input)',
          hover: 'var(--input-hover)',
          focus: 'var(--input-focus)',
          border: 'var(--input-border)',
        },
        // Text colors
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          label: 'var(--text-label)',
        },
        // Accent/highlight colors
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
        },
        // State colors
        state: {
          success: 'var(--state-success)',
          warning: 'var(--state-warning)',
          error: 'var(--state-error)',
          info: 'var(--state-info)',
        },
        // Selection
        selection: {
          DEFAULT: 'var(--selection)',
          text: 'var(--selection-text)',
        },
        // Dividers and separators
        divider: 'var(--divider)',
        // Icon colors
        icon: {
          DEFAULT: 'var(--icon)',
          muted: 'var(--icon-muted)',
          active: 'var(--icon-active)',
        },
      },
      // Box shadows for depth
      boxShadow: {
        'control': '0 1px 2px var(--shadow-color)',
        'control-inset': 'inset 0 1px 2px var(--shadow-color)',
        'panel': '0 2px 8px var(--shadow-color)',
        'dropdown': '0 4px 16px var(--shadow-color)',
        'tooltip': '0 2px 4px var(--shadow-color)',
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-down': 'slideDown 150ms ease-out',
        'slide-up': 'slideUp 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Transition defaults
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
      },
    },
  },
  plugins: [],
};

export default config;
