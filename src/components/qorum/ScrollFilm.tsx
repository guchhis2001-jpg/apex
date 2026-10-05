import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 337;
const FILM_SECONDS = 14;
// Past this point the film bleeds from monochrome into its true colour.
const COLOR_REVEAL_START = 0.82;
const COLOR_REVEAL_END = 0.95;

const framePath = (i: number) =>
  `${import.meta.env.BASE_URL}qorum/frames/f_${String(i + 1).padStart(3, "0")}.webp`;

type Chapter = {
  start: number;
  index: string;
  label: string;
  eyebrow: string;
  title: string[];
  body: string;
  specs: [string, string][];
};

// Chapter boundaries follow the cuts in the source film (14s @ 24fps).
const CHAPTERS: Chapter[] = [
  {
    start: 0,
    index: "01",
    label: "Kronos",
    eyebrow: "The Kronos Chronograph",
    title: ["Time,", "engineered."],
    body: "Three registers, one tachymetric sweep. A chronograph drawn with the restraint of a blueprint and the nerve of a racing dial.",
    specs: [
      ["Collection", "Kronos"],
      ["Function", "Chronograph"],
      ["Registers", "3 sub-dials"],
    ],
  },
  {
    start: 0.14,
    index: "02",
    label: "Dial",
    eyebrow: "The Dial",
    title: ["Built to", "catch light."],
    body: "Sunray-brushed surface, faceted applied indices and luminous hands — legible in a glance, rewarding at a stare.",
    specs: [
      ["Finish", "Sunray brushed"],
      ["Indices", "Applied, faceted"],
      ["Crystal", "Hardened mineral"],
    ],
  },
  {
    start: 0.32,
    index: "03",
    label: "Strap",
    eyebrow: "The Strap",
    title: ["Sculpted", "to move."],
    body: "Architectural ribs channel air and flex with the wrist, locked by a solid brushed-steel keeper engraved with the Qorum mark.",
    specs: [
      ["Material", "Sculpted silicone"],
      ["Keeper", "Brushed steel"],
      ["Feel", "All-day comfort"],
    ],
  },
  {
    start: 0.47,
    index: "04",
    label: "Movement",
    eyebrow: "The Movement",
    title: ["The heart,", "on display."],
    body: "Turn it over. A Japanese Miyota calibre beats behind an exhibition caseback — every bridge and jewel left in plain sight.",
    specs: [
      ["Calibre", "Miyota, Japan"],
      ["Caseback", "Exhibition"],
      ["Precision", "Chronograph"],
    ],
  },
  {
    start: 0.68,
    index: "05",
    label: "Case",
    eyebrow: "The Case",
    title: ["Steel, carved", "with intent."],
    body: "A knurled bezel you can feel in the dark, guarded pushers and a signed crown — milled from 304 stainless steel.",
    specs: [
      ["Diameter", "42 mm"],
      ["Thickness", "12.7 mm"],
      ["Material", "304 steel"],
    ],
  },
  {
    start: 0.8,
    index: "06",
    label: "Reveal",
    eyebrow: "Qorum Kronos — Crimson",
    title: ["Luxury, without", "the cost."],
    body: "Designed in India, made to global standards. The Kronos chronograph — from ₹9,999.",
    specs: [
      ["Price", "From ₹9,999"],
      ["Water res.", "3 ATM"],
      ["Origin", "Designed in India"],
    ],
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// -1 while the opening wordmark is still on screen
const chapterAt = (p: number) => {
  if (p < 0.05) return -1;
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].start) idx = i;
  return idx;
};
const formatTime = (s: number) => `00:${s.toFixed(1).padStart(4, "0")}`;

// Coarse-to-fine load order: a sparse skeleton of frames arrives first so the
// film is scrubbable almost immediately, then the gaps fill in.
function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Uint8Array(count);
  for (const stride of [48, 24, 12, 6, 3, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  if (!seen[count - 1]) order.splice(1, 0, count - 1);
  return order;
}

export function ScrollFilm() {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(-1);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!track || !canvas || !ctx) return;

    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(
      null,
    );
    let cancelled = false;
    let loadedCount = 0;
    let drawn = -1;
    let dirty = true;
    let current = 0;
    let lastChapter = -2;
    let raf = 0;
    let visible = true;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const queue = loadOrder(FRAME_COUNT);
    const loadNext = () => {
      const i = queue.shift();
      if (i === undefined || cancelled) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        loadedCount++;
        dirty = true;
        if (loadedCount % 8 === 0 || loadedCount === FRAME_COUNT)
          setLoaded(loadedCount);
        loadNext();
      };
      img.onerror = loadNext;
      img.src = framePath(i);
    };
    for (let k = 0; k < 6; k++) loadNext();

    const nearestLoaded = (i: number) => {
      if (images[i]) return i;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (i - d >= 0 && images[i - d]) return i - d;
        if (i + d < FRAME_COUNT && images[i + d]) return i + d;
      }
      return -1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (i: number) => {
      const img = images[i];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      // object-fit: cover
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      if (posterRef.current && posterRef.current.style.opacity !== "0") {
        posterRef.current.style.opacity = "0";
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const total = track.offsetHeight - window.innerHeight;
      const p = clamp(-track.getBoundingClientRect().top / Math.max(total, 1));
      const target = p * (FRAME_COUNT - 1);
      current = reduceMotion ? target : current + (target - current) * 0.16;
      if (Math.abs(target - current) < 0.01) current = target;

      const frame = nearestLoaded(Math.round(current));
      if (frame !== -1 && (frame !== drawn || dirty)) {
        draw(frame);
        drawn = frame;
        dirty = false;
      }

      const shown = current / (FRAME_COUNT - 1);
      const grey = 1 - smoothstep(COLOR_REVEAL_START, COLOR_REVEAL_END, shown);
      if (mediaRef.current) {
        mediaRef.current.style.filter = `grayscale(${grey.toFixed(3)}) contrast(${(1 + grey * 0.12).toFixed(3)}) brightness(${(1 - grey * 0.14).toFixed(3)})`;
      }
      if (stageRef.current) {
        stageRef.current.style.setProperty(
          "--spot",
          `${(18 + shown * 64).toFixed(2)}%`,
        );
      }
      if (heroRef.current) {
        const h = 1 - smoothstep(0, 0.06, shown);
        heroRef.current.style.opacity = h.toFixed(3);
        heroRef.current.style.transform = `translate3d(0, ${(-(1 - h) * 8).toFixed(2)}vh, 0) scale(${(1 + (1 - h) * 0.06).toFixed(4)})`;
        heroRef.current.style.visibility = h <= 0.001 ? "hidden" : "visible";
      }
      if (cueRef.current)
        cueRef.current.style.opacity = (1 - smoothstep(0, 0.02, p)).toFixed(3);
      if (barRef.current)
        barRef.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (timeRef.current)
        timeRef.current.textContent = formatTime(shown * FILM_SECONDS);

      const c = chapterAt(shown);
      if (c !== lastChapter) {
        lastChapter = c;
        setChapter(c);
      }
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    io.observe(track);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const scrollToChapter = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const total = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + total * (CHAPTERS[i].start + 0.005),
      behavior: "smooth",
    });
  };

  const loadPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section
      ref={trackRef}
      id="kronos"
      aria-label="Qorum Kronos film"
      className="relative h-[760svh]"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#07080a]">
        {/* Studio backdrop: graphite with a spotlight that sweeps as you scroll */}
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 75% at var(--spot, 30%) -10%, rgb(255 255 255 / 0.13), transparent 65%), radial-gradient(40% 50% at calc(100% - var(--spot, 30%)) 110%, rgb(170 185 200 / 0.06), transparent 70%), linear-gradient(180deg, #0e1013 0%, #07080a 100%)",
          }}
        />

        {/* Film: full-bleed on mobile, a tall feathered panel on desktop */}
        <div
          ref={mediaRef}
          className="q-feather absolute inset-0 md:right-auto md:left-1/2 md:w-[min(100vw,80svh)] md:-translate-x-1/2"
          style={{ filter: "grayscale(1) contrast(1.12) brightness(0.86)" }}
        >
          <img
            ref={posterRef}
            src={framePath(0)}
            alt=""
            aria-hidden
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          {/* mobile: keep the copy legible over a full-bleed frame */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07080a]/80 to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#07080a] via-[#07080a]/70 to-transparent md:hidden" />
        </div>

        {/* Opening wordmark, inverted against the film */}
        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center mix-blend-difference will-change-transform"
        >
          <p className="font-q-mono text-[10px] tracking-[0.5em] text-white/80 uppercase md:text-xs">
            Introducing
          </p>
          <h1 className="mt-4 font-sans text-[22vw] leading-[0.8] font-light tracking-[-0.04em] text-white md:text-[17vw]">
            KRONOS
          </h1>
          <p className="mt-6 font-q-serif text-xl text-white/90 italic md:text-3xl">
            A Qorum chronograph
          </p>
        </div>

        <div
          ref={cueRef}
          className="pointer-events-none absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-28"
        >
          <span className="font-q-mono text-[10px] tracking-[0.4em] text-white/60 uppercase">
            Scroll
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[q-cue_1.8s_ease-in-out_infinite] bg-white" />
          </span>
        </div>

        {/* Chapter copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 px-5 md:top-0 md:right-auto md:bottom-0 md:flex md:w-[calc(50%-40svh/2)] md:max-w-[34rem] md:items-center md:px-10 lg:px-14">
          <div className="relative w-full min-h-[13.5rem] md:min-h-[22rem]">
            {CHAPTERS.map((c, i) => {
              const active = i === chapter;
              return (
                <article
                  key={c.index}
                  aria-hidden={!active}
                  className="absolute inset-x-0 bottom-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
                >
                  {[
                    <p
                      key="e"
                      className="flex items-center gap-3 font-q-mono text-[10px] tracking-[0.3em] text-white/55 uppercase md:text-[11px]"
                    >
                      <span className="text-white">{c.index}</span>
                      <span className="h-px w-8 bg-white/30" />
                      {c.eyebrow}
                    </p>,
                    <h2
                      key="t"
                      className="mt-4 font-q-serif text-[2.75rem] leading-[0.95] font-normal tracking-[-0.01em] text-white md:mt-6 md:text-[clamp(3rem,4.6vw,5.25rem)]"
                    >
                      {c.title[0]}
                      <br />
                      <em className="text-white/60">{c.title[1]}</em>
                    </h2>,
                    <p
                      key="b"
                      className="mt-4 max-w-[26rem] text-sm leading-relaxed text-white/65 md:mt-6 md:text-[15px]"
                    >
                      {c.body}
                    </p>,
                  ].map((el, k) => (
                    <div
                      key={k}
                      className="transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active ? "none" : "translateY(18px)",
                        filter: active ? "none" : "blur(6px)",
                        transitionDelay: active ? `${120 + k * 90}ms` : "0ms",
                      }}
                    >
                      {el}
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </div>

        {/* Spec readout (desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc(50%-40svh/2)] items-center justify-end px-10 md:flex lg:px-14">
          <div className="relative h-48 w-full max-w-[17rem]">
            {CHAPTERS.map((c, i) => {
              const active = i === chapter;
              return (
                <dl
                  key={c.index}
                  className="absolute inset-0"
                  aria-hidden={!active}
                >
                  {c.specs.map(([k, v], j) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-6 border-b border-white/15 py-3.5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active ? "none" : "translateX(16px)",
                        transitionDelay: active ? `${200 + j * 80}ms` : "0ms",
                      }}
                    >
                      <dt className="font-q-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">
                        {k}
                      </dt>
                      <dd className="text-right text-sm text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
              );
            })}
          </div>
        </div>

        {/* HUD: timeline + timecode */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-8 lg:px-14">
          <div className="flex items-end justify-between gap-6 font-q-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
            <span className="hidden md:inline">Qorum — Film 01</span>
            <nav
              aria-label="Film chapters"
              className="flex flex-1 justify-between md:max-w-xl"
            >
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.index}
                  type="button"
                  onClick={() => scrollToChapter(i)}
                  className={`group flex items-center gap-1.5 transition-colors hover:text-white ${
                    i === Math.max(chapter, 0) ? "text-white" : ""
                  }`}
                >
                  <span
                    className={`block h-1 w-1 rounded-full transition-colors ${
                      i <= Math.max(chapter, 0) ? "bg-white" : "bg-white/30"
                    }`}
                  />
                  <span className="hidden lg:inline">{c.label}</span>
                </button>
              ))}
            </nav>
            <span className="tabular-nums">
              <span ref={timeRef} className="text-white">
                00:00.0
              </span>
              <span className="hidden sm:inline">
                {" "}
                / {formatTime(FILM_SECONDS)}
              </span>
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-white/15">
            <div
              ref={barRef}
              className="h-px w-full origin-left scale-x-0 bg-white"
            />
          </div>
          {loadPct < 100 && (
            <p className="absolute right-5 bottom-[3.25rem] font-q-mono text-[9px] tracking-[0.2em] text-white/35 uppercase md:right-10 lg:right-14">
              Buffering film {loadPct}%
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
