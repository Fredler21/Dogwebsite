import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables set in lib/theme.tsx
        brand: 'var(--brand)',
        'brand-accent': 'var(--brand-accent)',
        surface: 'var(--surface)',
        ink: 'var(--ink)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -12px rgba(16,24,40,0.18)'
      },
      maxWidth: {
        '7xl': '80rem'
      }
    }
  },
  plugins: []
};
export default config;
