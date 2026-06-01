# Theme Authoring

Themes are defined in `apps/web/lib/theme.tsx`. Each preset sets four CSS variables:

```
--brand
--brand-accent
--surface
--ink
```

Tailwind classes already reference these via `theme.extend.colors` in `tailwind.config.ts`. Components should prefer `bg-brand`, `text-ink`, `bg-brand-accent` — never hard-code hex values.

## Adding a new preset

1. Add the preset to the `THEMES` map in `lib/theme.tsx`.
2. Add the preset to the `ThemePreset` union type.
3. (Optional) Override font in `app/layout.tsx` per preset via `next/font`.
4. Verify Lighthouse + contrast ratios (WCAG AA: 4.5:1 for body text, 3:1 for large text).

## Hot-swapping in admin

The store-level `themePreset` field can be changed from `/admin/stores/{id}` and takes effect on next page load — no redeploy.
