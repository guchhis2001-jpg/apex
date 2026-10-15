import theme from '@/config/theme.json';
import { collectionUrl } from '@/config/brand';
import { collections, type Collection } from '@/lib/products';
import { useClaimResolver } from '@/lib/claims';
import { Picture } from '@/components/Picture';
import { RevealLines } from '@/components/Reveal';
import { ArrowUpRight } from '@/components/Icons';
import { PlaceholderTag } from '@/components/AddToCart';

const TONES = theme.moments as Record<string, { bg: string; ink: string }>;

// Bento placement by position. 7 tiles: big hero tile + mixed spans. 6 tiles: last row splits in two.
const LAYOUT_7 = [
  'sm:col-span-2 lg:col-span-6 lg:row-span-2',
  'lg:col-span-6',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
];
const LAYOUT_6 = [
  'sm:col-span-2 lg:col-span-6 lg:row-span-2',
  'lg:col-span-6',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-6',
  'sm:col-span-2 lg:col-span-6',
];

function Tile({ c, layout, big }: { c: Collection & { pending: boolean }; layout: string; big: boolean }) {
  const tone = TONES[c.handle] ?? { bg: '#2F5D3A', ink: '#F5EDE0' };
  const dark = tone.ink === '#F5EDE0' || tone.bg === '#1C1A17';
  return (
    <a
      href={collectionUrl(c.handle)}
      className={`group relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-transform duration-500 ease-expo hover:-translate-y-1 lg:p-7 ${big ? 'min-h-[340px] lg:min-h-0' : ''} ${layout} ${dark ? 'on-dark' : ''}`}
      style={{ background: tone.bg, color: tone.ink }}
    >
      <Picture
        src={c.image}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute -z-10 object-contain transition-transform duration-700 ease-expo group-hover:-rotate-6 group-hover:scale-110 ${
          big ? '-bottom-[10%] -right-[8%] w-[62%] lg:w-[58%]' : '-bottom-[26%] -right-[14%] w-[52%] sm:w-[50%]'
        }`}
      />
      <h3 className={`display max-w-[9ch] ${big ? 'text-[clamp(56px,7vw,124px)]' : 'text-[clamp(40px,3.4vw,60px)]'}`}>{c.title}</h3>
      <div className="flex items-end gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-current transition-transform duration-500 ease-expo group-hover:rotate-45">
          <ArrowUpRight width={20} height={20} />
        </span>
        <div className="max-w-[24ch] pr-[30%] sm:pr-0">
          {c.pending && <PlaceholderTag className="mb-2">claim pending approval</PlaceholderTag>}
          <p className={`font-semibold leading-snug ${big ? 'text-[18px]' : 'text-[15px]'}`}>{c.line}</p>
        </div>
      </div>
    </a>
  );
}

export function Moments() {
  // Collections behind a health claim only render once the claim is approved.
  const resolve = useClaimResolver();
  const states = collections.map((c) => ({ c, s: resolve(c.requires_claim) }));
  const visible = states.filter((x) => x.s !== 'hidden').map((x) => ({ ...x.c, pending: x.s === 'pending' }));
  const layout = visible.length >= 7 ? LAYOUT_7 : LAYOUT_6;

  return (
    <section id="moments" className="bg-cream px-5 py-20 sm:px-8 lg:px-[4vw] lg:py-28" aria-labelledby="moments-title">
      <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-field">Shop by moment</p>
          <RevealLines as="h2" lines={['What are we', 'cooking today?']} className="display mt-3 text-[clamp(52px,9vw,150px)]" />
        </div>
        <p className="max-w-[32ch] text-[16px] leading-snug text-ink/80 lg:text-right">Pick the mood. We already did the meal plan.</p>
      </div>
      <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-12 lg:gap-5">
        {visible.map((c, i) => (
          <Tile key={c.handle} c={c} layout={layout[i] ?? 'lg:col-span-4'} big={i === 0} />
        ))}
      </div>
    </section>
  );
}
