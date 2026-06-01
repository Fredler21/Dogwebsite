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
      }
    }
  },
  plugins: []
};
export default config;
