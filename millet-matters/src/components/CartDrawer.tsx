import { useCallback, useState } from 'react';
import { boxDiscount, boxValue, lineValue, useCart, type Line } from '@/lib/cart';
import { findProduct, offers, rupees } from '@/lib/products';
import { scrollToTarget } from '@/lib/motion';
import { Picture } from './Picture';
import { CloseIcon, Gift, Minus, Plus, Truck } from './Icons';
import { useDialog } from './useDialog';

function Progress({ total }: { total: number }) {
  const ship = offers.free_shipping_threshold;
  const gift = offers.free_gift_threshold;
  const pct = Math.min(1, total / gift);
  const shipPct = ship / gift;
  const msg =
    total >= gift
      ? 'Free shipping + a surprise gift. Nicely done.'
      : total >= ship
        ? `Free shipping unlocked. ${rupees(gift - total)} more for a surprise gift.`
        : `${rupees(ship - total)} more for free shipping.`;
  return (
    <div className="rounded-2xl bg-cream p-4">
      <p className="text-[14px] font-semibold" aria-live="polite">{msg}</p>
      <div className="relative mt-4 h-2 rounded-full bg-ink/10">
        <div className="absolute inset-y-0 left-0 rounded-full bg-field transition-[width] duration-700 ease-expo" style={{ width: `${pct * 100}%` }} />
        {[{ at: shipPct, icon: <Truck width={14} height={14} />, on: total >= ship }, { at: 1, icon: <Gift width={14} height={14} />, on: total >= gift }].map((m, i) => (
          <span
            key={i}
            className={`absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 ${m.on ? 'border-field bg-field text-cream' : 'border-ink/20 bg-paper text-ink/70'}`}
            style={{ left: `calc(${m.at * 100}% - ${i === 1 ? 14 : 0}px)` }}
            aria-hidden
          >
            {m.icon}
          </span>
        ))}
      </div>
    </div>
  );
}

function LineRow({ l }: { l: Line }) {
  const { setQty, remove } = useCart();
  if (l.kind === 'product') {
    const p = findProduct(l.handle)!;
    return (
      <li className="flex gap-3 py-4">
        <div className="h-[84px] w-[68px] shrink-0 rounded-xl bg-cream p-1">
          <Picture src={p.image.src} alt="" width={800} height={1000} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">{p.title}</p>
          <p className="mt-0.5 text-[13px] text-ink/70">{p.weight} {p.weight_unit}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center rounded-full border-2 border-ink/15">
              <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Decrease ${p.title}`}><Minus width={16} height={16} /></button>
              <span className="w-6 text-center text-[14px] font-bold tabular-nums" aria-label={`Quantity ${l.qty}`}>{l.qty}</span>
              <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Increase ${p.title}`}><Plus width={16} height={16} /></button>
            </div>
            <span className="font-bold tabular-nums">{rupees(lineValue(l))}</span>
          </div>
        </div>
      </li>
    );
  }
  const d = boxDiscount(l.handles);
  return (
    <li className="py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">Your Millet Box ({l.handles.length})</p>
          <p className="text-[13px] font-semibold text-field">{offers.box_percent}% box discount · −{rupees(d)}</p>
        </div>
        <button type="button" onClick={() => remove(l.key)} className="text-[13px] font-semibold underline">Remove</button>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-1.5">
        {l.handles.map((h, i) => {
          const p = findProduct(h)!;
          return (
            <div key={i} className="aspect-[4/5] rounded-lg bg-cream p-0.5" title={p.title}>
              <Picture src={p.image.src} alt={p.short_title} width={800} height={1000} className="h-full w-full object-contain" />
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-right font-bold tabular-nums">
        <s className="mr-2 font-semibold text-ink/50">{rupees(boxValue(l.handles))}</s>
        {rupees(lineValue(l))}
      </p>
    </li>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, total, savings, count } = useCart();
  const close = useCallback(() => setOpen(false), [setOpen]);
  const ref = useDialog<HTMLDivElement>(open, close);
  const [note, setNote] = useState(false);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/50 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={close} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        {...(!open ? { inert: '' } : {})}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-2xl transition-transform duration-700 ease-expo ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="display text-[40px]">Cart <span className="text-field">({count})</span></h2>
          <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-cream" aria-label="Close cart" data-autofocus>
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4" data-lenis-prevent>
          <Progress total={total} />
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="display text-[44px]">Empty tawa.</p>
              <p className="mt-2 text-ink/75">Let's fix that.</p>
              <button
                type="button"
                className="btn btn-primary mt-6"
                onClick={() => {
                  close();
                  window.setTimeout(() => scrollToTarget('#shop', -64), 80);
                }}
              >
                Shop the mixes
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">{lines.map((l) => <LineRow key={l.key} l={l} />)}</ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-ink/10 px-5 pb-6 pt-4">
            {savings > 0 && (
              <p className="flex justify-between text-[14px] font-semibold text-field"><span>Box savings</span><span>−{rupees(savings)}</span></p>
            )}
            <p className="mt-1 flex items-baseline justify-between">
              <span className="font-bold">Subtotal</span>
              <span className="display-soft text-[34px] tabular-nums">{rupees(total)}</span>
            </p>
            <p className="mt-1 text-[13px] text-ink/70">
              First order? Use <strong className="text-ink">{offers.welcome_code}</strong> at checkout for {offers.welcome_percent}% off.
            </p>
            <button type="button" className="btn btn-primary mt-4 w-full" onClick={() => setNote(true)}>Checkout</button>
            {note && <p className="mt-2 text-center text-[13px] font-semibold text-ink/75" role="status">Demo cart. Checkout connects to Shopify in the theme build.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
