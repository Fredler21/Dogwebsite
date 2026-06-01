/** Currency formatter — pure, importable from server and client components. */
export const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;
