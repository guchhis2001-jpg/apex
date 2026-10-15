import { useEffect, useState } from 'react';
import { LOGO_SRC, NAV_LINKS } from '@/config/brand';
import { useCart } from '@/lib/cart';
import { scrollToTarget, lockScroll } from '@/lib/motion';
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from '@/components/Icons';

export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string, after?: () => void) {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  if (after) {
    after(); // e.g. close the menu, which unlocks scroll on the next commit
    window.setTimeout(() => scrollToTarget(href, -64), 60);
  } else scrollToTarget(href, -64);
}

export function Nav({ onSearch }: { onSearch: () => void }) {
  const { count, setOpen, bump } = useCart();
  const [shrunk, setShrunk] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setShrunk(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    lockScroll(menu);
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [menu]);

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Main"
        className={`flex items-center justify-between gap-4 border-b px-4 transition-[height,background-color,border-color] duration-500 ease-expo sm:px-6 lg:px-10 ${
          shrunk ? 'h-14 border-ink/10 bg-cream/90 backdrop-blur-md' : 'h-[72px] border-transparent bg-cream'
        }`}
      >
        <a href="#top" onClick={(e) => onAnchorClick(e, '#top')} className="flex shrink-0 items-center" aria-label="Millet Matters home">
          <img
            src={LOGO_SRC}
            alt="Millet Matters"
            width={180}
            height={36}
            className={`w-auto origin-left transition-[height] duration-500 ease-expo ${shrunk ? 'h-7' : 'h-8 sm:h-9'}`}
          />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => onAnchorClick(e, l.href)}
                className="rounded-full px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-ink hover:text-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={onSearch} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Search products">
            <SearchIcon />
          </button>
          <a
            href="#shop"
            onClick={(e) => onAnchorClick(e, '#shop')}
            className="btn btn-primary hidden min-h-[42px] px-5 text-[14px] md:inline-flex"
          >
            Shop now
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-turmeric text-ink"
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
          >
            <CartIcon />
            <span
              key={bump}
              className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-cream ${bump ? 'animate-pop' : ''}`}
              aria-hidden
            >
              {count}
            </span>
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
            <MenuIcon />
          </button>
        </div>
      </nav>

      {menu && (
        <div className="on-dark fixed inset-0 z-[60] flex flex-col bg-field px-6 pb-10 pt-4 text-cream lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex justify-end">
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full bg-cream/10" onClick={() => setMenu(false)} aria-label="Close menu" autoFocus>
              <CloseIcon />
            </button>
          </div>
          <ul className="mt-8 space-y-2">
            {[{ label: 'Shop the mixes', href: '#shop' }, ...NAV_LINKS, { label: 'Build a box', href: '#box' }].map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={(e) => onAnchorClick(e, l.href, () => setMenu(false))} className="display block text-[16vw] sm:text-7xl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
