import { useEffect, useRef } from 'react';
import { HERO_HANDLE, PROOF } from '@/config/brand';
import { getProduct, rupees } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { useClaim } from '@/lib/claims';
import { gsap, ScrollTrigger, registerGsap, scrollToTarget } from '@/lib/motion';
import { Picture } from '@/components/Picture';
import { RotatingBadge } from '@/components/RotatingBadge';
import { TribeCounter } from '@/components/TribeCounter';
import { PlaceholderTag } from '@/components/AddToCart';
import { ArrowDown, Plus, ScribbleArrow, Star } from '@/components/Icons';

type GrainType = 'jowar' | 'foxtail' | 'ragi';
// x/y in % of the pack stage; d = depth layer (0 far → 2 near); s = px size
const GRAINS: { x: number; y: number; d: 0 | 1 | 2; t: GrainType; s: number; r: number }[] = [
  { x: -18, y: 8, d: 0, t: 'foxtail', s: 14, r: 30 }, { x: 112, y: 14, d: 0, t: 'jowar', s: 16, r: 0 },
  { x: -30, y: 62, d: 0, t: 'jowar', s: 13, r: 0 }, { x: 128, y: 70, d: 0, t: 'foxtail', s: 12, r: -40 },
  { x: 8, y: -6, d: 0, t: 'ragi', s: 10, r: 0 }, { x: 84, y: 98, d: 0, t: 'ragi', s: 11, r: 0 },
  { x: -6, y: 30, d: 1, t: 'jowar', s: 22, r: 0 }, { x: 104, y: 40, d: 1, t: 'foxtail', s: 18, r: 60 },
  { x: 20, y: 96, d: 1, t: 'foxtail', s: 17, r: -20 }, { x: 96, y: -2, d: 1, t: 'jowar', s: 21, r: 0 },
  { x: -22, y: 88, d: 1, t: 'ragi', s: 14, r: 0 }, { x: 120, y: 92, d: 1, t: 'jowar', s: 19, r: 0 },
  { x: -12, y: 46, d: 2, t: 'foxtail', s: 28, r: 20 }, { x: 108, y: 58, d: 2, t: 'jowar', s: 34, r: 0 },
  { x: 2, y: 82, d: 2, t: 'jowar', s: 30, r: 0 }, { x: 88, y: 8, d: 2, t: 'foxtail', s: 26, r: -50 },
  { x: 118, y: 26, d: 2, t: 'ragi', s: 18, r: 0 },
];
const GRAIN_SHAPE: Record<GrainType, { rx: number; ry: number; grad: string }> = {
  jowar: { rx: 10, ry: 9.4, grad: 'g-jowar' },
  foxtail: { rx: 10, ry: 7, grad: 'g-foxtail' },
  ragi: { rx: 10, ry: 10, grad: 'g-ragi' },
};
const DEPTH = [10, 22, 42]; // px of travel per depth layer at full mouse deflection

function Grain({ t, s, r }: { t: GrainType; s: number; r: number }) {
  const g = GRAIN_SHAPE[t];
  return (
    <svg width={s} height={s} viewBox="-11 -11 22 22" style={{ transform: `rotate(${r}deg)` }} aria-hidden>
      <ellipse rx={g.rx} ry={g.ry} fill={`url(#${g.grad})`} />
    </svg>
  );
}

export function Hero() {
  const hero = getProduct(HERO_HANDLE);
  const { add } = useCart();
  const gf = useClaim('gluten-free');
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const packTilt = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);

  // Mouse parallax: lerped, rAF only while the pointer is moving, transform-only (stays on the compositor).
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      layers.current.forEach((l, i) => {
        if (l) l.style.transform = `translate3d(${(-cur.x * DEPTH[i]).toFixed(2)}px, ${(-cur.y * DEPTH[i]).toFixed(2)}px, 0)`;
      });
      if (packTilt.current) {
        packTilt.current.style.transform = `rotateY(${(cur.x * 10).toFixed(2)}deg) rotateX(${(-cur.y * 8).toFixed(2)}deg)`;
      }
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width - 0.5;
      target.y = (e.clientY - b.top) / b.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Entrance (grains burst out of the pack) + scroll parallax.
  useEffect(() => {
    registerGsap();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const s = stage.current!;
      const sb = s.getBoundingClientRect();
      const cx = sb.left + sb.width / 2;
      const cy = sb.top + sb.height / 2;
      gsap.from('[data-grain]', {
        x: (_i: number, el: HTMLElement) => {
          const b = el.getBoundingClientRect();
          return cx - (b.left + b.width / 2);
        },
        y: (_i: number, el: HTMLElement) => {
          const b = el.getBoundingClientRect();
          return cy - (b.top + b.height / 2);
        },
        scale: 0.2,
        opacity: 0,
        duration: 1.6,
        ease: 'expo.out',
        stagger: { each: 0.025, from: 'random' },
        delay: 0.15,
      });
      gsap.from('[data-pack]', { yPercent: 6, rotate: -9, duration: 1.4, ease: 'expo.out' });
      gsap.from('[data-hero-fade]', { y: 18, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.25 });

      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-depth="0"]', { y: -40, ease: 'none', scrollTrigger: st });
      gsap.to('[data-depth="1"]', { y: -110, ease: 'none', scrollTrigger: st });
      gsap.to('[data-depth="2"]', { y: -220, ease: 'none', scrollTrigger: st });
      gsap.to('[data-pack-scroll]', { y: -60, ease: 'none', scrollTrigger: st });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const layer = (d: 0 | 1 | 2) => (
    <div className={`pointer-events-none absolute inset-0 ${d === 2 ? 'z-30' : 'z-10'}`} data-depth={d}>
      <div ref={(n) => (layers.current[d] = n)} className="absolute inset-0 will-change-transform" style={d === 0 ? { filter: 'blur(1.2px)' } : undefined}>
        {GRAINS.filter((g) => g.d === d).map((g, i) => (
          <div key={i} data-grain className="absolute" style={{ left: `${g.x}%`, top: `${g.y}%`, marginLeft: -g.s / 2, marginTop: -g.s / 2 }}>
            <Grain t={g.t} s={g.s * (d === 2 ? 1.25 : 1)} r={g.r} />
          </div>
        ))}
      </div>
    </div>
  );

  const badgeText = gf === 'approved' ? 'READY IN MINUTES · GLUTEN-FREE · ' : 'READY IN MINUTES · NO MAIDA · ';

  return (
    <section id="top" ref={root} className="relative isolate overflow-hidden bg-cream" aria-labelledby="hero-title">
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <radialGradient id="g-jowar" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" /><stop offset=".3" stopColor="#F1E4C8" /><stop offset="1" stopColor="#B99863" /></radialGradient>
          <radialGradient id="g-foxtail" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#FFF4CF" /><stop offset=".3" stopColor="#E9C46A" /><stop offset="1" stopColor="#A87A22" /></radialGradient>
          <radialGradient id="g-ragi" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#E59A82" /><stop offset=".3" stopColor="#9B4A35" /><stop offset="1" stopColor="#4F2015" /></radialGradient>
        </defs>
      </svg>

      <div className="relative mx-auto flex flex-col pb-10 lg:block lg:h-[calc(100svh-108px)] lg:max-h-[1040px] lg:min-h-[640px] lg:pb-0">
        {/* Headline: behind the pack on desktop, below it on mobile. Never on top of the food. */}
        <h1
          id="hero-title"
          className="display relative z-0 order-2 px-4 text-center text-[16.4vw] text-ink sm:text-[15vw] lg:absolute lg:inset-x-0 lg:bottom-[3.5%] lg:top-[2.5%] lg:flex lg:flex-col lg:items-center lg:justify-between lg:px-0 lg:text-[12vw] 3xl:text-[11vw]"
        >
          <span className="block">Grain in.</span>
          <span className="block">
            Breakfast <br className="lg:hidden" />
            <span className="text-field">out.</span>
          </span>
        </h1>

        {/* Pack stage */}
        <div
          ref={stage}
          className="relative order-1 mx-auto mt-4 h-[44svh] max-h-[460px] min-h-[300px] w-full max-w-[min(100%,560px)] lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:h-[67%] lg:max-h-none lg:w-auto lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-[52%]"
          style={{ aspectRatio: '4 / 5' }}
        >
          {layer(0)}
          {layer(1)}
          <div data-pack-scroll className="absolute inset-0 z-20 [perspective:1200px]">
            <div ref={packTilt} className="h-full w-full will-change-transform [transform-style:preserve-3d]">
              <div data-pack className="relative h-full w-full -rotate-[4deg]">
                <Picture
                  src={hero.image.src}
                  alt={hero.image.alt}
                  width={800}
                  height={1000}
                  priority
                  className="h-full w-full object-contain drop-shadow-[0_40px_40px_rgba(60,30,10,0.35)]"
                />
              </div>
            </div>
            {/* Price sticker that is also the add button */}
            <button
              type="button"
              onClick={() => add(hero.handle)}
              className="group absolute bottom-[8%] right-[2%] z-40 grid h-[clamp(84px,9vw,124px)] w-[clamp(84px,9vw,124px)] rotate-[10deg] place-items-center rounded-full bg-turmeric text-ink shadow-[0_10px_0_-2px_rgba(28,26,23,0.9)] transition-transform duration-300 ease-expo hover:rotate-0 hover:scale-105 lg:right-[-6%]"
            >
              <span className="text-center leading-none">
                <span className="display-soft block text-[clamp(22px,2.4vw,34px)]">{rupees(hero.price!)}</span>
                <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-extrabold uppercase tracking-wider">
                  Add <Plus width={12} height={12} strokeWidth={3} />
                </span>
                <span className="sr-only"> {hero.title} to cart</span>
              </span>
            </button>
          </div>
          {layer(2)}
          <div className="absolute -top-2 left-[3%] z-40 sm:left-[2%] lg:-left-[6%] lg:top-[2%] xl:-left-[16%] xl:top-[6%]">
            <RotatingBadge text={badgeText} size={120} bg="#2F5D3A" ink="#F5EDE0" className="scale-[.8] lg:scale-100" center={<span className="display text-[34px] text-turmeric">✺</span>} />
          </div>
        </div>

        {/* Left: what it is + CTAs */}
        <div className="relative z-40 order-3 mx-auto mt-6 w-full max-w-[560px] px-5 text-center lg:absolute lg:left-[4vw] lg:top-1/2 lg:mt-0 lg:w-[min(25vw,360px)] lg:-translate-y-1/2 lg:px-0 lg:text-left">
          <p data-hero-fade className="text-[17px] font-medium leading-snug text-ink/85 lg:text-[clamp(16px,1.25vw,19px)]">
            Six Indian millets, turned into pancakes, dosa, khichdi and cookies in minutes. <strong className="font-extrabold text-ink">No maida. No shortcuts.</strong>
          </p>
          <div data-hero-fade className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:flex-col lg:items-start xl:flex-row">
            <a href="#shop" onClick={(e) => { e.preventDefault(); scrollToTarget('#shop', -64); }} className="btn btn-primary">
              Shop the mixes
            </a>
            <a href="#transformation" onClick={(e) => { e.preventDefault(); scrollToTarget('#transformation'); }} className="btn btn-ghost">
              Watch it cook <ArrowDown width={18} height={18} />
            </a>
          </div>
          <div data-hero-fade className="mt-6 hidden items-start gap-2 text-cocoa lg:flex">
            <p className="display-soft max-w-[15ch] -rotate-3 text-[22px] leading-[1]">Jowar + foxtail in. Chocochip pancakes out.</p>
            <ScribbleArrow className="mt-2 h-14 w-20 shrink-0" />
          </div>
        </div>

        {/* Right: proof */}
        <div data-hero-fade className="relative z-40 order-4 mx-auto mt-6 flex w-full max-w-[560px] flex-col items-center gap-2 px-5 lg:absolute lg:right-[4vw] lg:top-1/2 lg:mt-0 lg:w-[min(22vw,300px)] lg:-translate-y-1/2 lg:items-end lg:px-0">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl bg-paper px-4 py-3 text-[13px] shadow-[0_1px_0_rgba(28,26,23,0.08),0_12px_30px_-12px_rgba(28,26,23,0.25)] lg:flex-col lg:items-end lg:rounded-3xl lg:px-5 lg:py-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex text-turmeric" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => <Star key={i} width={15} height={15} />)}
              </span>
              {PROOF.rating !== null ? (
                <span className="font-bold">{PROOF.rating} · {PROOF.reviewCount?.toLocaleString('en-IN')} reviews</span>
              ) : (
                <PlaceholderTag>rating + reviews</PlaceholderTag>
              )}
            </span>
            <TribeCounter />
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/70 lg:text-right">
            175 g · {hero.millet.map((m) => m[0].toUpperCase() + m.slice(1)).join(' + ')} · {rupees(hero.price!)}
          </p>
        </div>
      </div>
    </section>
  );
}
