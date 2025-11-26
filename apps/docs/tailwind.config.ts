import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/components/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme]'],
  theme: {
    extend: {
      // Hyper-dense spacing scale
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
        'panel-sm': '200px',
        'panel-md': '280px',
        'panel-lg': '320px',
        'toolbar': '28px',
        'toolbar-lg': '36px',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '12px' }],
        'xs': ['11px', { lineHeight: '14px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['13px', { lineHeight: '18px' }],
        'lg': ['14px', { lineHeight: '20px' }],
        'xl': ['16px', { lineHeight: '24px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['30px', { lineHeight: '36px' }],
        '5xl': ['36px', { lineHeight: '40px' }],
      },
      borderRadius: {
        'control': '3px',
        'panel': '4px',
        'button': '2px',
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          sunken: 'var(--surface-sunken)',
          overlay: 'var(--surface-overlay)',
        },
        panel: {
          DEFAULT: 'var(--panel)',
          header: 'var(--panel-header)',
          border: 'var(--panel-border)',
        },
        'panel-header-text': 'var(--panel-header-text)',
        control: {
          DEFAULT: 'var(--control)',
          hover: 'var(--control-hover)',
          active: 'var(--control-active)',
          'active-text': 'var(--control-active-text)',
          disabled: 'var(--control-disabled)',
          border: 'var(--control-border)',
        },
        input: {
          DEFAULT: 'var(--input)',
          hover: 'var(--input-hover)',
          focus: 'var(--input-focus)',
          border: 'var(--input-border)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          label: 'var(--text-label)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
          text: 'var(--accent-text)',
        },
        state: {
          success: 'var(--state-success)',
          warning: 'var(--state-warning)',
          error: 'var(--state-error)',
          info: 'var(--state-info)',
        },
        selection: {
          DEFAULT: 'var(--selection)',
          hover: 'var(--selection-hover)',
          text: 'var(--selection-text)',
        },
        divider: 'var(--divider)',
        icon: {
          DEFAULT: 'var(--icon)',
          muted: 'var(--icon-muted)',
          active: 'var(--icon-active)',
        },
      },
      backgroundImage: {
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-surface': 'var(--gradient-surface)',
      },
      boxShadow: {
        'control': '0 1px 2px var(--shadow-color)',
        'control-inset': 'inset 0 1px 2px var(--shadow-color)',
        'panel': '0 2px 8px var(--shadow-color)',
        'dropdown': '0 4px 16px var(--shadow-color)',
        'tooltip': '0 2px 4px var(--shadow-color)',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'fade-out': 'fadeOut 150ms ease-out',
        'slide-down': 'slideDown 150ms ease-out',
        'slide-up': 'slideUp 150ms ease-out',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
