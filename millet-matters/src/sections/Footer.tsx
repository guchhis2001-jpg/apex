import { useState } from 'react';
import { LOGO_SRC, NAV_LINKS, POLICY_LINKS } from '@/config/brand';
import { shop } from '@/lib/products';
import { scrollToTarget } from '@/lib/motion';
import { RevealLines } from '@/components/Reveal';
import { ArrowRight, Instagram } from '@/components/Icons';
import { onAnchorClick } from './Nav';

export function Footer() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState('error');
    // UI only. Wire to Shopify customer marketing / Klaviyo in the theme build.
    setState('done');
  };

  return (
    <footer className="bg-cream" aria-labelledby="footer-cta">
      {/* Final CTA */}
      <div className="relative overflow-hidden px-5 pb-16 pt-24 text-center sm:px-8 lg:px-[4vw] lg:pt-32">
        <p className="eyebrow text-field">Last call for breakfast</p>
        <RevealLines as="h2" lines={['Start with', 'pancakes.']} className="display mx-auto mt-4 text-[clamp(64px,15vw,260px)]" />
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#shop" onClick={(e) => { e.preventDefault(); scrollToTarget('#shop', -64); }} className="btn btn-primary">
            Shop the mixes
          </a>
          <a href="#box" onClick={(e) => { e.preventDefault(); scrollToTarget('#box', -64); }} className="btn btn-ghost">
            Build a box
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className="on-dark mx-3 rounded-[32px] bg-ink px-6 py-12 text-cream sm:mx-6 sm:px-10 lg:mx-[2vw] lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16 lg:px-14 lg:py-16">
        <div>
          <h2 id="footer-cta" className="display text-[clamp(52px,8vw,128px)] text-turmeric">Recipes, not spam.</h2>
          <p className="mt-4 max-w-[40ch] text-[16px] text-cream/85">
            One email when there's a new recipe worth your tawa. Unsubscribe whenever.
          </p>
        </div>
        <form onSubmit={submit} className="mt-8 lg:mt-0" noValidate>
          <label htmlFor="nl-email" className="eyebrow mb-3 block text-cream/80">Email address</label>
          {state === 'done' ? (
            <p className="display-soft text-[32px]" role="status">You're in. First recipe soon.</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="nl-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
                placeholder="you@kitchen.in"
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'nl-err' : undefined}
                className="min-h-[52px] flex-1 rounded-full border-2 border-cream/30 bg-transparent px-5 text-[16px] text-cream placeholder:text-cream/50 focus:border-turmeric focus:outline-none"
              />
              <button type="submit" className="btn btn-turmeric">
                Subscribe <ArrowRight width={18} height={18} />
              </button>
            </div>
          )}
          {state === 'error' && <p id="nl-err" className="mt-2 text-[14px] font-semibold text-turmeric">That email looks off. Try again?</p>}
        </form>
      </div>

      {/* Links */}
      <div className="grid gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-[4vw]">
        <div>
          <img src={LOGO_SRC} alt="Millet Matters" width={180} height={36} className="h-9 w-auto" loading="lazy" />
          <p className="mt-4 max-w-[30ch] text-[14px] text-ink/75">Millet premixes and snacks from {shop.legal_name}.</p>
        </div>
        <nav aria-label="Shop">
          <h3 className="eyebrow mb-4 text-ink/70">Shop</h3>
          <ul className="space-y-2 text-[15px] font-semibold">
            <li><a href="#shop" onClick={(e) => onAnchorClick(e, '#shop')} className="hover:underline">All mixes</a></li>
            {NAV_LINKS.map((l) => (
              <li key={l.label}><a href={l.href} onClick={(e) => onAnchorClick(e, l.href)} className="hover:underline">{l.label}</a></li>
            ))}
            <li><a href="#box" onClick={(e) => onAnchorClick(e, '#box')} className="hover:underline">Build a box</a></li>
          </ul>
        </nav>
        <nav aria-label="Policies">
          <h3 className="eyebrow mb-4 text-ink/70">Policies</h3>
          <ul className="space-y-2 text-[15px] font-semibold">
            {POLICY_LINKS.map((l) => (
              <li key={l.label}><a href={l.href} className="hover:underline">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="eyebrow mb-4 text-ink/70">Talk to us</h3>
          <ul className="space-y-2 text-[15px] font-semibold">
            <li><a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="hover:underline">{shop.phone}</a></li>
            <li><a href={`mailto:${shop.email}`} className="hover:underline">{shop.email}</a></li>
            <li>
              <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                <Instagram width={18} height={18} /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-ink/10 px-5 py-6 text-[13px] text-ink/70 sm:flex-row sm:justify-between sm:px-8 lg:px-[4vw]">
        <p>© {new Date().getFullYear()} {shop.legal_name}. All rights reserved.</p>
        <p>Made with six millets and zero maida.</p>
      </div>
    </footer>
  );
}
