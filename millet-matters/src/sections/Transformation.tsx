import { useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS, frameUrl, type Chapter } from '@/config/chapters';
import { findProduct, isPurchasable, type Product } from '@/lib/products';
import { afterLoadIdle, useIsMobileResolved, useReducedMotion } from '@/lib/hooks';
import { gsap, ScrollTrigger, registerGsap, scrollToTarget } from '@/lib/motion';
import { SequenceSet } from '@/lib/sequence';
import { ChapterProductCard } from '@/components/ProductCard';
import { RevealLines } from '@/components/Reveal';

const featured = (ch: Chapter): Product => {
  const list = ch.products.map(findProduct).filter(Boolean) as Product[];
  return list.find(isPurchasable) ?? list[0];
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const PIN_VH = { desktop: 1, mobile: 0.6 }; // scroll length per chapter, in viewport heights

export function Transformation() {
  const reduced = useReducedMotion();
  return (
    <section id="transformation" aria-label="From grain to plate" className="relative">
      {reduced ? <StaticChapters /> : <PinnedChapters />}
    </section>
  );
}

function ChapterHeading({ ch, i, active }: { ch: Chapter; i: number; active: boolean }) {
  return (
    <div className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!active}>
      <p className="eyebrow" style={{ color: ch.accent }}>
        {String(i + 1).padStart(2, '0')} / 04 · {ch.grain}
      </p>
      <RevealLines as="h2" active={active} lines={ch.lines} className="display-soft mt-3 text-[clamp(38px,10.5vw,52px)] lg:text-[clamp(44px,4.6vw,84px)]" />
    </div>
  );
}

function PinnedChapters() {
  const resolved = useIsMobileResolved();
  const isMobile = !!resolved;
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dotFill = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const activeRef = useRef(0);
  const doneRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  const step = isMobile ? CHAPTERS[0].mobileStep : 1;
  const useVideo = isMobile && CHAPTERS.some((c) => c.mobileVideo);

  // Frame URLs per chapter (mobile: every Nth frame, always keep the last)
  const urls = useMemo(
    () =>
      CHAPTERS.map((ch) => {
        const s = isMobile ? ch.mobileStep : 1;
        const out: string[] = [];
        for (let i = 0; i < ch.frames; i += s) out.push(frameUrl(ch, i));
        if ((ch.frames - 1) % s !== 0) out.push(frameUrl(ch, ch.frames - 1));
        return out;
      }),
    [isMobile],
  );

  useEffect(() => {
    if (resolved === null) return; // wait for the breakpoint so the pin is built once
    registerGsap();
    const sec = section.current!;
    const st = stage.current!;
    const cv = canvas.current;
    const ctx2d = cv?.getContext('2d', { alpha: true }) ?? null;
    const seq = new SequenceSet(urls);
    let current = { c: -1, f: -1, drawn: null as HTMLImageElement | null };
    let size = 0;

    const fit = () => {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = cv.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      current = { c: -1, f: -1, drawn: null };
    };

    const draw = (c: number, f: number) => {
      if (!ctx2d || !cv) return;
      const img = seq.nearest(c, f);
      if (!img || (current.c === c && current.f === f && current.drawn === img)) return;
      ctx2d.clearRect(0, 0, cv.width, cv.height);
      const s = Math.min(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx2d.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      current = { c, f, drawn: img };
    };

    const lerpColor = gsap.utils.interpolate;
    const render = (p: number) => {
      const total = p * CHAPTERS.length;
      const c = Math.min(CHAPTERS.length - 1, Math.floor(total));
      const local = total - c;
      const ch = CHAPTERS[c];
      const next = CHAPTERS[c + 1];

      // grain → dish over the middle of the chapter; holds at both ends
      const fp = clamp01((local - 0.06) / 0.72);
      const n = seq.count(c);
      draw(c, Math.round(fp * (n - 1)));

      // colour world: blend into the next chapter during the last 14%
      const m = next ? clamp01((local - 0.86) / 0.14) : 0;
      st.style.backgroundColor = m > 0 ? lerpColor(ch.bg, next!.bg, m) : ch.bg;
      st.style.color = m > 0.5 ? next!.ink : ch.ink;

      // dissolve the plate out and the next pile of grain in
      let o = 1;
      if (next && local > 0.88) o = 1 - (local - 0.88) / 0.12;
      if (c > 0 && local < 0.05) o = local / 0.05;
      if (cv) cv.style.opacity = o.toFixed(3);

      CHAPTERS.forEach((_, i) => {
        const el = dotFill.current[i];
        if (el) el.style.transform = `scaleY(${i < c ? 1 : i === c ? local : 0})`;
      });

      const nowActive = m > 0.5 ? c + 1 : c;
      if (nowActive !== activeRef.current) {
        activeRef.current = nowActive;
        setActive(nowActive);
      }
      const isDone = fp > 0.92 && m < 0.5;
      if (isDone !== doneRef.current) {
        doneRef.current = isDone;
        setDone(isDone);
      }
    };

    seq.onFrame = (c) => {
      if (c === activeRef.current) render(stRef.current?.progress ?? 0);
    };

    fit();
    const perChapter = isMobile ? PIN_VH.mobile : PIN_VH.desktop;
    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: () => `+=${window.innerHeight * perChapter * CHAPTERS.length}`,
      pin: st,
      scrub: true,
      anticipatePin: 1,
      refreshPriority: 1, // pins higher on the page must be measured before the No-List pin below
      invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => {
        fit();
        render(self.progress);
      },
    });
    stRef.current = trigger;
    // Re-created when the viewport crosses the mobile breakpoint: re-measure everything after it.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Start loading frames after the page has loaded, once the section is within ~2 screens
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          seq.start(isMobile ? 4 : 6);
          io.disconnect();
        }
      },
      { rootMargin: '200% 0px' },
    );
    const cancelIdle = afterLoadIdle(() => io.observe(sec));

    const ro = new ResizeObserver(() => {
      fit();
      render(trigger.progress);
    });
    if (cv) ro.observe(cv);
    render(0);

    return () => {
      cancelIdle();
      io.disconnect();
      ro.disconnect();
      seq.destroy();
      trigger.kill();
      stRef.current = null;
    };
  }, [urls, isMobile, resolved]);

  const jump = (i: number) => {
    const t = stRef.current;
    if (!t) return;
    const y = t.start + (t.end - t.start) * ((i + 0.08) / CHAPTERS.length);
    scrollToTarget(y);
  };

  const ch = CHAPTERS[active];

  return (
    <div ref={section}>
      <div
        ref={stage}
        className={`relative h-[100svh] w-full overflow-hidden ${ch.ink === '#F5EDE0' ? 'on-dark' : ''}`}
        style={{ backgroundColor: CHAPTERS[0].bg, color: CHAPTERS[0].ink }}
      >
        <div className="grain-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        {/* Oversized chapter word, behind the food */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
          {CHAPTERS.map((c, i) => (
            <span
              key={c.id}
              className="display absolute select-none whitespace-nowrap text-[30vw] transition-[opacity,transform] duration-700 ease-expo lg:text-[25vw]"
              style={{
                color: c.wordColor,
                opacity: i === active ? 1 : 0,
                transform: `translate3d(0, ${i === active ? 0 : i < active ? -8 : 8}%, 0) scale(${i === active ? 1 : 0.94})`,
              }}
            >
              {c.word}
            </span>
          ))}
        </div>

        {/* The food */}
        <div className="absolute inset-0 grid place-items-center pt-[64px] lg:pt-0">
          {useVideo ? (
            <video
              key={ch.id}
              className="aspect-square w-[min(92vw,52svh)] object-contain"
              src={ch.mobileVideo ?? undefined}
              poster={frameUrl(ch, ch.frames - 1)}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : (
            <canvas
              ref={canvas}
              className="aspect-square w-[min(94vw,50svh)] will-change-[opacity] lg:w-[min(82vh,54vw)]"
              role="img"
              aria-label={`${ch.grain} turning into ${ch.word.toLowerCase()}`}
            />
          )}
        </div>

        {/* RAW → READY sticker */}
        <div className="pointer-events-none absolute left-1/2 top-[calc(50%+min(25svh,47vw))] z-10 -translate-x-1/2 lg:left-[calc(50%+min(30vh,20vw))] lg:top-[18%] lg:translate-x-0" aria-hidden>
          <span
            className="inline-block -rotate-6 rounded-full border-2 border-current px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.14em] transition-[transform,background-color] duration-500 ease-expo"
            style={done ? { background: ch.accent, color: ch.bg, borderColor: ch.accent, transform: 'rotate(4deg) scale(1.08)' } : undefined}
          >
            {done ? ch.after : ch.before}
          </span>
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 top-[calc(var(--nav-h)-8px)] z-20 px-5 sm:px-8 lg:left-[4vw] lg:right-auto lg:top-1/2 lg:w-[34vw] lg:-translate-y-1/2 lg:px-0">
          <p className="eyebrow mb-4 hidden opacity-80 lg:block">The transformation</p>
          <div className="relative">
            {CHAPTERS.map((c, i) => (
              <div key={c.id} className={i === 0 ? 'relative' : 'absolute inset-x-0 top-0'}>
                <ChapterHeading ch={c} i={i} active={i === active} />
              </div>
            ))}
          </div>
        </div>

        {/* Product card */}
        <div className="absolute inset-x-3 bottom-4 z-30 sm:inset-x-auto sm:right-6 sm:w-[420px] lg:bottom-10 lg:right-[4vw] lg:w-[min(440px,32vw)]">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              className={`transition-[opacity,transform] duration-500 ease-expo ${i === 0 ? 'relative' : 'absolute inset-0'} ${
                i === active ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
              }`}
              aria-hidden={i !== active}
              {...(i !== active ? { inert: '' } : {})}
            >
              <ChapterProductCard product={featured(c)} compact={isMobile} />
            </div>
          ))}
        </div>

        {/* Progress: 4 dots */}
        <nav
          aria-label="Transformation chapters"
          className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 max-lg:top-[38%] lg:right-6"
        >
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => jump(i)}
              className="group relative grid h-11 w-11 place-items-center"
              aria-label={`Chapter ${i + 1}: ${c.word}`}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className={`relative block h-3 w-3 overflow-hidden rounded-full border-2 border-current transition-transform duration-300 ${i === active ? 'scale-125' : ''}`}>
                <span ref={(n) => (dotFill.current[i] = n)} className="absolute inset-0 origin-bottom bg-current" style={{ transform: 'scaleY(0)' }} />
              </span>
              <span className="pointer-events-none absolute right-11 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {c.word}
              </span>
            </button>
          ))}
        </nav>
      </div>
      {step > 1 && <span className="sr-only">Showing a lighter frame sequence on small screens.</span>}
    </div>
  );
}

/** prefers-reduced-motion: no pin, no scrub. Before/after stills per chapter. */
function StaticChapters() {
  return (
    <div>
      {CHAPTERS.map((ch, i) => {
        const p = featured(ch);
        return (
          <div key={ch.id} className={`px-5 py-16 sm:px-8 lg:px-[4vw] lg:py-24 ${ch.ink === '#F5EDE0' ? 'on-dark' : ''}`} style={{ background: ch.bg, color: ch.ink }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <p className="eyebrow" style={{ color: ch.accent }}>{String(i + 1).padStart(2, '0')} / 04 · {ch.grain}</p>
                <h2 className="display-soft mt-3 text-[clamp(40px,5vw,84px)]">{ch.lines.join(' ')}</h2>
                <div className="mt-8 max-w-[440px]"><ChapterProductCard product={p} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ src: frameUrl(ch, 0), label: ch.before }, { src: frameUrl(ch, ch.frames - 1), label: ch.after }].map((f) => (
                  <figure key={f.label} className="text-center">
                    <img src={f.src} alt={`${f.label}`} loading="lazy" width={720} height={720} className="aspect-square w-full object-contain" />
                    <figcaption className="eyebrow mt-2">{f.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
