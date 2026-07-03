/**
 * Dogvanta logo mark — the "Refined Paw" emblem.
 * Emerald disc, gold hairline ring, cream paw with a single gold toe.
 * Pure/presentational (no hooks) so it works in server or client components.
 */
export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Dogvanta"
      className={className}
    >
      <circle cx="48" cy="48" r="45" fill="#0f766e" />
      <circle cx="48" cy="48" r="38.5" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <path d="M48 51C56 51 62 57 62 64 62 72 55 75 48 75 41 75 34 72 34 64 34 57 40 51 48 51Z" fill="#fbfaf8" />
      <ellipse cx="34" cy="48" rx="5.4" ry="7" fill="#fbfaf8" />
      <ellipse cx="43" cy="40" rx="5.4" ry="7.2" fill="#fbfaf8" />
      <ellipse cx="53" cy="40" rx="5.4" ry="7.2" fill="#f59e0b" />
      <ellipse cx="62" cy="48" rx="5.4" ry="7" fill="#fbfaf8" />
    </svg>
  );
}
