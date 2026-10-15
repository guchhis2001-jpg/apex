import { useState } from 'react';
import { findProduct, isPurchasable, offers, priceLabel, products, rupees } from '@/lib/products';
import { boxDiscount, boxValue, useCart } from '@/lib/cart';
import { Picture } from '@/components/Picture';
import { RevealLines } from '@/components/Reveal';
import { Check, CloseIcon, Gift, Plus, Truck } from '@/components/Icons';

const SIZE = offers.box_size;

function Meter({ value, max, label, done, icon }: { value: number; max: number; label: string; done: boolean; icon: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[14px] font-semibold">
        <span className={`grid h-7 w-7 place-items-center rounded-full ${done ? 'bg-turmeric text-ink' : 'bg-cream/15'}`}>{done ? <Check width={15} height={15} strokeWidth={3} /> : icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/15" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)} aria-label={label}>
        <div className="h-full origin-left rounded-full bg-turmeric transition-transform duration-700 ease-expo" style={{ transform: `scaleX(${Math.min(1, value / max)})` }} />
      </div>
    </div>
  );
}

export function BuildYourBox() {
  const [box, setBox] = useState<string[]>([]);
  const { addBox } = useCart();
  const full = box.length >= SIZE;
  const value = boxValue(box);
  const discount = full ? boxDiscount(box) : 0;
  const pay = value - discount;
  const giftGap = offers.free_gift_threshold - pay;
  const shipGap = offers.free_shipping_threshold - pay;

  const addOne = (h: string) => !full && setBox((b) => [...b, h]);
  const removeAt = (i: number) => setBox((b) => b.filter((_, k) => k !== i));
  const removeOne = (h: string) =>
    setBox((b) => {
      const i = b.lastIndexOf(h);
      return i < 0 ? b : b.filter((_, k) => k !== i);
    });

  const status = full
    ? `${offers.box_percent}% off unlocked`
    : `Add ${SIZE - box.length} more to unlock ${offers.box_percent}% off`;

  return (
    <section id="box" className="on-dark relative bg-field px-5 py-20 text-cream sm:px-8 lg:px-[4vw] lg:py-28" aria-labelledby="box-title">
      <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-cream">Curate your Millet Box</p>
          <RevealLines as="h2" lines={['Pick any six.', `Take ${offers.box_percent}% off.`]} className="display mt-3 text-[clamp(52px,9vw,150px)]" />
        </div>
        <p className="max-w-[34ch] text-[16px] leading-snug text-cream/85 lg:text-right">
          Tap packs into the box. Doubles allowed. The discount and the gift unlock as you go.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {/* Picker */}
        <ul className="order-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:order-1 xl:grid-cols-4" aria-label="Products you can add to the box">
          {products.map((p) => {
            const n = box.filter((h) => h === p.handle).length;
            const ok = isPurchasable(p);
            return (
              <li key={p.handle} className={`relative flex flex-col rounded-[20px] bg-paper p-3 text-ink transition-transform duration-300 ease-expo ${ok ? 'hover:-translate-y-1' : 'opacity-60'}`}>
                <button
                  type="button"
                  onClick={() => addOne(p.handle)}
                  disabled={!ok || full}
                  className="flex flex-1 flex-col text-left disabled:cursor-not-allowed"
                >
                  <span className="sr-only">{ok ? 'Add to box: ' : 'Not available yet: '}</span>
                  <span className="block aspect-[4/5] w-full">
                    <Picture src={p.image.src} alt="" width={800} height={1000} className="h-full w-full object-contain" />
                  </span>
                  <span className="mt-2 block text-[13px] font-bold leading-tight">{p.short_title}</span>
                  <span className="mt-1 flex items-center justify-between text-[13px] font-semibold text-ink/75">
                    {priceLabel(p)}
                    {ok && (
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-cream" aria-hidden>
                        <Plus width={16} height={16} strokeWidth={3} />
                      </span>
                    )}
                  </span>
                </button>
                {n > 0 && (
                  <button
                    type="button"
                    onClick={() => removeOne(p.handle)}
                    className="absolute left-2 top-2 inline-flex h-8 items-center gap-1 rounded-full bg-turmeric px-2.5 text-[12px] font-extrabold text-ink"
                    aria-label={`Remove one ${p.title} from box (${n} in box)`}
                  >
                    ×{n} <CloseIcon width={12} height={12} strokeWidth={3} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* The box */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[28px] bg-[#C99B66] p-4 shadow-[inset_0_-10px_0_rgba(0,0,0,0.15),0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-5">
              <div className="mb-3 flex items-center justify-between px-1 text-ink">
                <span className="display-soft text-[24px]">Your Millet Box</span>
                <span className="text-[14px] font-extrabold tabular-nums" aria-live="polite">{box.length}/{SIZE}</span>
              </div>
              <ol className="grid grid-cols-3 gap-2.5 rounded-[18px] bg-[#A87B4A] p-2.5 shadow-[inset_0_6px_14px_rgba(0,0,0,0.3)]">
                {Array.from({ length: SIZE }, (_, i) => {
                  const h = box[i];
                  const p = h ? findProduct(h) : undefined;
                  return (
                    <li key={i} className="aspect-[4/5]">
                      {p ? (
                        <button
                          key={`${h}-${i}`}
                          type="button"
                          onClick={() => removeAt(i)}
                          className="animate-drop-in group relative h-full w-full rounded-xl bg-paper p-1.5"
                          aria-label={`Remove ${p.title} from box`}
                        >
                          <Picture src={p.image.src} alt="" width={800} height={1000} className="h-full w-full object-contain" />
                          <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
                            <CloseIcon width={12} height={12} strokeWidth={3} />
                          </span>
                        </button>
                      ) : (
                        <span className="grid h-full w-full place-items-center rounded-xl border-2 border-dashed border-ink/30 text-[20px] font-extrabold text-ink/40">{i + 1}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-6 space-y-4">
              <Meter value={box.length} max={SIZE} label={status} done={full} icon={<span className="text-[11px] font-extrabold">%</span>} />
              <Meter
                value={pay}
                max={offers.free_gift_threshold}
                done={giftGap <= 0}
                icon={<Gift width={15} height={15} />}
                label={giftGap <= 0 ? 'Free surprise gift unlocked' : `${rupees(giftGap)} away from a free surprise gift`}
              />
              <Meter
                value={pay}
                max={offers.free_shipping_threshold}
                done={shipGap <= 0}
                icon={<Truck width={15} height={15} />}
                label={shipGap <= 0 ? 'Free shipping unlocked' : `${rupees(shipGap)} away from free shipping`}
              />
            </div>

            <dl className="mt-6 space-y-1.5 border-t border-cream/20 pt-5 text-[15px]">
              <div className="flex justify-between"><dt>Box value</dt><dd className="tabular-nums">{rupees(value)}</dd></div>
              <div className="flex justify-between font-bold"><dt>Box discount ({offers.box_percent}%)</dt><dd className="tabular-nums">{discount ? `−${rupees(discount)}` : '—'}</dd></div>
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-bold">You pay</dt>
                <dd className="display-soft text-[40px] tabular-nums">{rupees(pay)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="btn btn-turmeric flex-1"
                disabled={!full}
                onClick={() => {
                  addBox(box);
                  setBox([]);
                }}
              >
                {full ? 'Add box to cart' : `Pick ${SIZE - box.length} more`}
              </button>
              <button type="button" className="btn border-2 border-cream/40 px-5 hover:bg-cream hover:text-ink" onClick={() => setBox([])} disabled={!box.length}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
