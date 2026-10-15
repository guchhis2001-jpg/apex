import { shop } from '@/lib/products';
import { asset } from '@/lib/asset';
import { RevealLines } from '@/components/Reveal';
import { PlaceholderTag } from '@/components/AddToCart';
import { Instagram, Star } from '@/components/Icons';

/** Reviews and UGC are placeholders until the client supplies verified material. Never invent quotes. */
const REVIEWS = [
  { tone: 'bg-turmeric text-ink', rotate: '-rotate-1' },
  { tone: 'bg-field text-cream on-dark', rotate: 'rotate-1' },
  { tone: 'bg-paper text-ink', rotate: '-rotate-[0.5deg]' },
];

export function Proof() {
  return (
    <section id="proof" className="overflow-hidden bg-cream px-5 py-20 sm:px-8 lg:px-[4vw] lg:py-28" aria-labelledby="proof-title">
      <p className="eyebrow text-field">Proof</p>
      <RevealLines as="h2" lines={['Said by people', 'who cook.']} className="display mt-3 text-[clamp(52px,9vw,150px)]" />

      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <li key={i} className={`flex min-h-[260px] flex-col justify-between rounded-[28px] p-7 ${r.tone} ${r.rotate}`}>
            <div>
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }, (_, k) => <Star key={k} width={18} height={18} />)}
              </div>
              <blockquote className="display-soft mt-5 text-[30px] leading-[1.02]">
                <PlaceholderTag className="text-[11px]">Client to supply verified review</PlaceholderTag>
                <span className="mt-4 block italic">“Verified customer quote goes here, ideally under 20 words.”</span>
              </blockquote>
            </div>
            <p className="mt-6 text-[13px] font-semibold">
              <PlaceholderTag>Name · City · Product</PlaceholderTag>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="display-soft text-[clamp(32px,4vw,56px)]">Real kitchens. Real tawas.</h3>
        <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <Instagram width={20} height={20} /> @milletmatters_official
        </a>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <a
              href={shop.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
              aria-label={`Instagram post ${i + 1} from @milletmatters_official (opens in a new tab)`}
            >
              <img src={asset(`assets/ugc/ugc-${i + 1}.webp`)} alt="" loading="lazy" width={600} height={600} className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-ink/0 text-cream opacity-0 transition-[opacity,background-color] duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                <Instagram width={28} height={28} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
