import { findProduct, isPurchasable, millets } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { RevealLines, FadeUp } from '@/components/Reveal';
import { ArrowRight, Plus } from '@/components/Icons';

export function MeetTheMillets() {
  const { add } = useCart();
  return (
    <section id="millets" className="bg-paper px-5 py-20 sm:px-8 lg:px-[4vw] lg:py-28" aria-labelledby="millets-title">
      <div className="mb-10 flex flex-col gap-4 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-field">Shop by millet</p>
          <RevealLines as="h2" lines={['Meet the', 'millets.']} className="display mt-3 text-[clamp(56px,11vw,180px)]" />
        </div>
        <p className="max-w-[34ch] text-[16px] leading-snug text-ink/80 lg:text-right">
          Six grains your grandparents knew by name. Here's what each one does in our kitchen.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {millets.map((m, i) => (
          <li key={m.key}>
            <FadeUp delay={(i % 3) * 80} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-cream" aria-labelledby={`millet-${m.key}`}>
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={m.image}
                    alt={`Macro photo of ${m.name} grains`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={800}
                    className="h-full w-full scale-100 object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.35]"
                  />
                  <span className="display absolute bottom-3 left-4 text-[64px] leading-none text-cream mix-blend-overlay" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 id={`millet-${m.key}`} className="display text-[48px]">{m.name}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-ink/75">{m.aka}</p>
                  <p className="mt-4 text-[16px] font-medium leading-snug">{m.fact}</p>
                  <div className="mt-auto pt-6">
                    <p className="eyebrow mb-3 flex items-center gap-2 text-field">
                      Becomes <ArrowRight width={14} height={14} />
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {m.becomes.map((h) => {
                        const p = findProduct(h);
                        if (!p) return null;
                        const buyable = isPurchasable(p);
                        return (
                          <li key={h}>
                            <button
                              type="button"
                              disabled={!buyable}
                              onClick={() => add(h)}
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-ink px-3 text-[13px] font-bold transition-colors enabled:hover:bg-ink enabled:hover:text-cream disabled:border-dashed disabled:opacity-60"
                              aria-label={buyable ? `Add ${p.short_title} to cart` : `${p.short_title}, price to be confirmed`}
                            >
                              {buyable && <Plus width={14} height={14} strokeWidth={3} />}
                              {p.short_title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            </FadeUp>
          </li>
        ))}
      </ul>
    </section>
  );
}
