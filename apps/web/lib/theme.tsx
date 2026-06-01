'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type ThemePreset = 'car' | 'pet' | 'home';

interface Theme {
  name: ThemePreset;
  brand: string;
  brandAccent: string;
  surface: string;
  ink: string;
  logoText: string;
}

const THEMES: Record<ThemePreset, Theme> = {
  car: { name: 'car', brand: '#0f172a', brandAccent: '#f97316', surface: '#f8fafc', ink: '#0f172a', logoText: 'Allyoucanuse' },
  pet: { name: 'pet', brand: '#7c3aed', brandAccent: '#f59e0b', surface: '#faf5ff', ink: '#1e1b4b', logoText: 'Pawkind' },
  home: { name: 'home', brand: '#065f46', brandAccent: '#d97706', surface: '#fafaf9', ink: '#1c1917', logoText: 'Homely' }
};

const Ctx = createContext<Theme>(THEMES.car);

export function ThemeProvider({ preset = 'car', children }: { preset?: ThemePreset; children: ReactNode }) {
  const theme = useMemo(() => THEMES[preset] ?? THEMES.car, [preset]);
  const css = `:root{
    --brand:${theme.brand};
    --brand-accent:${theme.brandAccent};
    --surface:${theme.surface};
    --ink:${theme.ink};
  }`;
  return (
    <Ctx.Provider value={theme}>
      <style>{css}</style>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): Theme { return useContext(Ctx); }
