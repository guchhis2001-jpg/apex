import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { rupees } from '@/lib/products';
import { scrollToTarget } from '@/lib/motion';
import { CartIcon } from './Icons';

/**
 * Always-reachable order button. Hidden where a buy action is already on screen
 * (hero, transformation card, box builder, footer CTA) so it never covers one.
 */
export function FloatingOrder() {
  const { count, total, setOpen } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hiders = Array.from(document.querySelectorAll('[data-hide-float]'));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setShow(visible.size === 0);
      },
      { threshold: 0, rootMargin: '-20% 0px -20% 0px' },
    );
    hiders.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 flex justify-center transition-[transform,opacity] duration-500 ease-expo sm:inset-x-auto sm:bottom-6 sm:right-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
      aria-hidden={!show}
    >
      <div className="flex w-full items-center gap-1 rounded-full bg-ink p-1.5 text-cream shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] sm:w-auto">
        <button
          type="button"
          tabIndex={show ? 0 : -1}
          onClick={() => scrollToTarget('#shop', -64)}
          className="min-h-[44px] flex-1 rounded-full bg-turmeric px-5 text-[14px] font-extrabold text-ink sm:flex-none"
        >
          Order now
        </button>
        <button
          type="button"
          tabIndex={show ? 0 : -1}
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[14px] font-bold"
          aria-label={`Open cart, ${count} items, ${rupees(total)}`}
        >
          <CartIcon width={20} height={20} /> {count ? `${count} · ${rupees(total)}` : 'Cart'}
        </button>
      </div>
    </div>
  );
}
