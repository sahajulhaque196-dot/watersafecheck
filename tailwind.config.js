/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
    // Score ring colors
    '#16a34a', '#2563eb', '#d97706', '#ea580c', '#dc2626', '#9ca3af',
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
          700: '#0f172a', // Deep slate for primary brand (text/dark mode)
          800: '#0b1120',
          900: '#020617',
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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
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
