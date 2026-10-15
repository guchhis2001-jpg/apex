import { useMemo, useState } from 'react';
import { MILLET_NAMES, milletLabel, priceLabel, products } from '@/lib/products';
import { Picture } from './Picture';
import { AddToCart } from './AddToCart';
import { CloseIcon, SearchIcon } from './Icons';
import { useDialog } from './useDialog';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      [p.title, ...p.tags, ...p.millet.map((m) => MILLET_NAMES[m] ?? m)].join(' ').toLowerCase().includes(s),
    );
  }, [q]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-ink/50" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="mx-auto mt-0 flex max-h-[100svh] w-full max-w-[720px] flex-col bg-paper sm:mt-[8vh] sm:max-h-[80vh] sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 p-4">
          <SearchIcon />
          <label htmlFor="search-q" className="sr-only">Search mixes, snacks or millets</label>
          <input
            id="search-q"
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “dosa”, “ragi”, “cookie”"
            className="min-h-[44px] flex-1 bg-transparent text-[18px] font-semibold outline-none placeholder:text-ink/50"
          />
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-cream" aria-label="Close search"><CloseIcon /></button>
        </div>
        <ul className="overflow-y-auto p-2" data-lenis-prevent aria-live="polite">
          {results.length === 0 && <li className="p-6 text-center font-semibold">Nothing yet. Try a millet name.</li>}
          {results.map((p) => (
            <li key={p.handle} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-cream">
              <div className="h-16 w-14 shrink-0"><Picture src={p.image.src} alt="" width={800} height={1000} className="h-full w-full object-contain" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight">{p.title}</p>
                <p className="text-[13px] text-ink/70">{milletLabel(p)} · {p.weight} {p.weight_unit} · {priceLabel(p)}</p>
              </div>
              <AddToCart product={p} compact className="btn btn-primary h-11 w-11 px-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
