import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: '#0f172a', accent: '#0ea5e9' } } } },
  plugins: []
};
export default config;
