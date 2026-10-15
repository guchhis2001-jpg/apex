import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { findProduct, isPurchasable, offers } from './products';

/** UI-only cart. Swap the reducer for Shopify Storefront cart mutations when this moves into Hydrogen. */

export type ProductLine = { kind: 'product'; key: string; handle: string; qty: number };
export type BoxLine = { kind: 'box'; key: string; handles: string[]; qty: number };
export type Line = ProductLine | BoxLine;

type Action =
  | { type: 'add'; handle: string; qty?: number }
  | { type: 'addBox'; handles: string[] }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'hydrate'; lines: Line[] };

function reducer(lines: Line[], a: Action): Line[] {
  switch (a.type) {
    case 'add': {
      const key = `p:${a.handle}`;
      const found = lines.find((l) => l.key === key);
      if (found) return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + (a.qty ?? 1) } : l));
      return [...lines, { kind: 'product', key, handle: a.handle, qty: a.qty ?? 1 }];
    }
    case 'addBox':
      return [...lines, { kind: 'box', key: `b:${Date.now().toString(36)}`, handles: a.handles, qty: 1 }];
    case 'setQty':
      return a.qty <= 0 ? lines.filter((l) => l.key !== a.key) : lines.map((l) => (l.key === a.key ? { ...l, qty: a.qty } : l));
    case 'remove':
      return lines.filter((l) => l.key !== a.key);
    case 'hydrate':
      return a.lines;
  }
}

export const boxValue = (handles: string[]) => handles.reduce((s, h) => s + (findProduct(h)?.price ?? 0), 0);
export const boxDiscount = (handles: string[]) =>
  handles.length >= offers.box_size ? Math.round((boxValue(handles) * offers.box_percent) / 100) : 0;

export const lineValue = (l: Line) =>
  l.kind === 'product' ? (findProduct(l.handle)?.price ?? 0) * l.qty : (boxValue(l.handles) - boxDiscount(l.handles)) * l.qty;

interface CartCtx {
  lines: Line[];
  count: number;
  subtotal: number;
  savings: number;
  total: number;
  open: boolean;
  bump: number;
  setOpen: (v: boolean) => void;
  add: (handle: string, opts?: { open?: boolean }) => void;
  addBox: (handles: string[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'mm-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = (JSON.parse(raw) as Line[]).filter((l) =>
          l.kind === 'product' ? !!findProduct(l.handle) : l.handles.every((h) => !!findProduct(h)),
        );
        dispatch({ type: 'hydrate', lines: parsed });
      }
    } catch {
      /* storage unavailable: cart just starts empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback((handle: string, opts?: { open?: boolean }) => {
    const p = findProduct(handle);
    if (!p || !isPurchasable(p)) return;
    dispatch({ type: 'add', handle });
    setBump((b) => b + 1);
    if (opts?.open !== false) setOpen(true);
  }, []);
  const addBox = useCallback((handles: string[]) => {
    dispatch({ type: 'addBox', handles });
    setBump((b) => b + 1);
    setOpen(true);
  }, []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'setQty', key, qty }), []);
  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + (l.kind === 'box' ? l.handles.length : 1) * l.qty, 0);
    const gross = lines.reduce(
      (s, l) => s + (l.kind === 'product' ? (findProduct(l.handle)?.price ?? 0) * l.qty : boxValue(l.handles) * l.qty),
      0,
    );
    const savings = lines.reduce((s, l) => s + (l.kind === 'box' ? boxDiscount(l.handles) * l.qty : 0), 0);
    return { lines, count, subtotal: gross, savings, total: gross - savings, open, bump, setOpen, add, addBox, setQty, remove };
  }, [lines, open, bump, add, addBox, setQty, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
