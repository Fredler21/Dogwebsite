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
  // `pet` is the live Refined Paw brand: trustworthy teal primary + warm amber accent.
  pet: { name: 'pet', brand: '#0f766e', brandAccent: '#f59e0b', surface: '#fbfaf8', ink: '#1c1917', logoText: 'Refined Paw' },
  car: { name: 'car', brand: '#0f172a', brandAccent: '#f97316', surface: '#f8fafc', ink: '#0f172a', logoText: 'Refined Paw' },
  home: { name: 'home', brand: '#065f46', brandAccent: '#d97706', surface: '#fafaf9', ink: '#1c1917', logoText: 'Homely' }
};

const Ctx = createContext<Theme>(THEMES.pet);

export function ThemeProvider({ preset = 'pet', children }: { preset?: ThemePreset; children: ReactNode }) {
  const theme = useMemo(() => THEMES[preset] ?? THEMES.pet, [preset]);
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
