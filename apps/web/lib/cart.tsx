'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from './types';

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, variantId?: string) => void;
  setQty: (productId: string, qty: number, variantId?: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'ayu_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);

  const add = useCallback((item: CartItem) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.productId === item.productId && p.variantId === item.variantId);
      if (i >= 0) { const c = [...prev]; c[i] = { ...c[i], quantity: c[i].quantity + item.quantity }; return c; }
      return [...prev, item];
    });
  }, []);
  const remove = useCallback((productId: string, variantId?: string) =>
    setItems(prev => prev.filter(p => !(p.productId === productId && p.variantId === variantId))), []);
  const setQty = useCallback((productId: string, qty: number, variantId?: string) =>
    setItems(prev => prev.map(p => (p.productId === productId && p.variantId === variantId) ? { ...p, quantity: Math.max(1, qty) } : p)), []);
  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, subtotal, count }}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used within CartProvider');
  return v;
}

export const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;
