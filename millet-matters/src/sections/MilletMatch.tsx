import { useMemo, useRef, useState } from 'react';
import { accentOf, heroProducts, milletLabel, priceLabel, type Product } from '@/lib/products';
import { useClaim, CLAIM_LABEL } from '@/lib/claims';
import { Picture } from '@/components/Picture';
import { AddToCart } from '@/components/AddToCart';
import { ReadyIn } from '@/components/ProductCard';
import { RevealLines } from '@/components/Reveal';
import { ArrowLeft, ArrowRight } from '@/components/Icons';

/** One card per millet; products sharing a `variant_group` (the two pancakes) become one card with a flavour toggle. */
type Group = { key: string; items: Product[] };

function ClaimChip({ claim }: { claim: string }) {
  const state = useClaim(claim);
  if (state === 'hidden') return null;
  return (
    <span className="rounded-full border border-current px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
      {CLAIM_LABEL[claim] ?? claim}
      {state === 'pending' && ' · pending'}
    </span>
  );
}

function RailCard({ group, index }: { group: Group; index: number }) {
  const [vi, setVi] = useState(0);
  const p = group.items[vi];
  const tone = accentOf(p);
  const dark = tone.ink === '#F5EDE0';
  return (
    <article
      className={`group/card relative flex w-[78vw] shrink-0 snap-start flex-col rounded-[28px] p-5 transition-transform duration-500 ease-expo [transform-style:preserve-3d] hover:-translate-y-2 hover:rotate-[-1.5deg] xs:w-[300px] sm:w-[330px] lg:w-[360px] ${dark ? 'on-dark' : ''}`}
      style={{ background: tone.bg, color: tone.ink }}
      aria-labelledby={`rail-${p.handle}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{String(index + 1).padStart(2, '0')} · {milletLabel(p)}</span>
        <span className="text-[13px] font-semibold opacity-90">{p.weight} {p.weight_unit}</span>
      </div>

      {/* pack ↔ plated dish */}
      <div className="relative mx-auto my-4 aspect-[4/5] w-full max-w-[260px]">
        <Picture
          src={p.image.src}
          alt={p.image.alt}
          width={800}
          height={1000}
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-500 ease-expo group-hover/card:scale-90 group-hover/card:opacity-0"
        />
        <Picture
          src={p.dish_image.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-contain opacity-0 transition-[opacity,transform] duration-500 ease-expo group-hover/card:scale-125 group-hover/card:opacity-100"
        />
      </div>

      <h3 id={`rail-${p.handle}`} className="display-soft text-[30px] leading-[0.95]">{p.short_title}</h3>

      {group.items.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Flavour">
          {group.items.map((it, i) => (
            <button
              key={it.handle}
              type="button"
              role="radio"
              aria-checked={i === vi}
              onClick={() => setVi(i)}
              className={`rounded-full border-2 border-current px-3 py-1.5 text-[12px] font-bold transition-colors ${i === vi ? 'bg-current' : ''}`}
            >
              <span style={i === vi ? { color: tone.bg } : undefined}>{it.variant_label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-semibold">
        <ReadyIn product={p} />
        {p.claims.map((c) => <ClaimChip key={c} claim={c} />)}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="display-soft text-[30px]">{priceLabel(p)}</span>
        <AddToCart
          product={p}
          label="Quick add"
          className={`btn ${dark ? 'btn-cream' : 'btn-primary'} transition-[opacity,transform] duration-300 ease-expo [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100`}
        />
      </div>
    </article>
  );
}

export function MilletMatch() {
  const rail = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => {
    const out: Group[] = [];
    for (const p of heroProducts) {
      const key = p.variant_group ?? p.handle;
      const g = out.find((x) => x.key === key);
      if (g) g.items.push(p);
      else out.push({ key, items: [p] });
    }
    return out;
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 760), behavior: 'smooth' });
  };

  return (
    <section id="shop" className="relative overflow-hidden bg-cream py-20 lg:py-28" aria-labelledby="match-title">
      <div className="flex flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-[4vw]">
        <div>
          <p className="eyebrow text-field">Shop the mixes</p>
          <RevealLines as="h2" lines={['Find your', 'millet match.']} className="display mt-3 text-[clamp(56px,11vw,180px)]" />
        </div>
        <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-end">
          <p className="max-w-[34ch] text-[16px] leading-snug text-ink/80 lg:text-right">
            Six millets, six mixes. Hover a pack to see what it turns into.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollBy(-1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-cream" aria-label="Previous products">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => scrollBy(1)} className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream" aria-label="Next products">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 pt-3 sm:scroll-px-8 sm:px-8 lg:gap-6 lg:scroll-px-[4vw] lg:px-[4vw]"
        role="list"
        tabIndex={0}
        aria-label="Millet mixes"
      >
        {groups.map((g, i) => (
          <div role="listitem" key={g.key} className="flex">
            <RailCard group={g} index={i} />
          </div>
        ))}
        <div className="w-1 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
