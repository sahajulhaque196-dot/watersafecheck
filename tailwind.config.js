/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Grade badge colors — dynamic, must not be purged
    'bg-green-600', 'bg-blue-600', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600', 'bg-gray-400',
    'text-green-600', 'text-blue-600', 'text-yellow-500', 'text-orange-500', 'text-red-600',
    // Grade row bg for ZIP grid
    'bg-green-50', 'text-green-700', 'hover:bg-green-100',
    'bg-blue-50',  'text-blue-700',  'hover:bg-blue-100',
    'bg-yellow-50','text-yellow-700','hover:bg-yellow-100',
    'bg-orange-50','text-orange-700','hover:bg-orange-100',
    'bg-red-50',   'text-red-700',   'hover:bg-red-100',
    // Alert sections
    'bg-green-50',  'border-green-100',  'text-green-800',
    'bg-yellow-50', 'border-yellow-100', 'text-yellow-800',
    'bg-orange-50', 'border-orange-100', 'text-orange-800',
    'bg-red-50',    'border-red-100',    'text-red-800',
    'bg-purple-50', 'border-purple-100', 'text-purple-800',
    'bg-blue-50',   'border-blue-100',   'text-blue-800',
    // StatCard colors
    'text-blue-700', 'bg-blue-50', 'text-green-700', 'bg-green-50',
    'text-yellow-700','bg-yellow-50','text-red-700','bg-red-50','text-gray-700','bg-gray-50',
    // Alert text
    'text-green-900','text-yellow-900','text-orange-900','text-red-900','text-purple-900','text-blue-900',
    // Apple system tokens safelist
    'bg-emerald-500', 'text-emerald-500', 'bg-sky-500', 'text-sky-500', 'bg-amber-500', 'text-amber-500',
    'bg-rose-500', 'text-rose-500', 'border-emerald-200', 'border-sky-200', 'border-amber-200', 'border-rose-200',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0f766e',
          700: '#0f172a',
          800: '#0b1120',
          900: '#020617',
        },
        apple: {
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          'blue-deep': '#0058b0',
          'blue-light': '#e8f2ff',
          gray: {
            50: '#fbfbfd',
            100: '#f5f5f7',
            200: '#e5e5ea',
            300: '#d1d1d6',
            400: '#aeaeb2',
            500: '#8e8e93',
            600: '#636366',
            700: '#48484a',
            800: '#2c2c2e',
            900: '#1d1d1f',
          },
          teal: '#00c7be',
          cyan: '#32ade6',
          green: '#34c759',
          amber: '#ff9500',
          red: '#ff3b30',
          purple: '#af52de',
          indigo: '#5856d6',
        },
        water: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        safe:    { DEFAULT: '#10b981', light: '#d1fae5' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        danger:  { DEFAULT: '#ef4444', light: '#fee2e2' },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'var(--font-inter)',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 2px 10px -2px rgba(0, 0, 0, 0.04), 0 12px 30px -4px rgba(0, 0, 0, 0.06)',
        'apple-card-hover': '0 12px 28px -6px rgba(0, 0, 0, 0.09), 0 24px 48px -10px rgba(0, 0, 0, 0.10)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'apple-float': '0 20px 50px -12px rgba(0, 113, 227, 0.22), 0 8px 24px -4px rgba(0, 0, 0, 0.08)',
        'apple-glow': '0 0 30px -5px rgba(0, 113, 227, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
}
