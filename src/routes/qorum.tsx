import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollFilm } from "@/components/qorum/ScrollFilm";
import { QorumNav, SHOP_URL, Wordmark } from "@/components/qorum/QorumNav";

export const Route = createFileRoute("/qorum")({
  head: () => ({
    meta: [
      { title: "Qorum — Kronos Chronograph" },
      {
        name: "description",
        content:
          "Qorum Kronos: a chronograph designed in India and made to global standards. Luxury doesn't always come at a cost.",
      },
      { property: "og:title", content: "Qorum — Kronos Chronograph" },
      {
        property: "og:description",
        content: "Luxury doesn't always come at a cost.",
      },
      { property: "og:image", content: "/qorum/stills/kronos.webp" },
      { name: "theme-color", content: "#07080a" },
    ],
    links: [
      { rel: "preload", as: "image", href: "/qorum/frames/f_001.webp" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: QorumLanding,
});

/* ---------- shared bits ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Eyebrow({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-3 font-q-mono text-[10px] tracking-[0.3em] text-white/50 uppercase md:text-[11px]">
      <span className="text-white">{index}</span>
      <span className="h-px w-8 bg-white/30" />
      {children}
    </p>
  );
}

/* ---------- sections ---------- */

const SPECS: [string, string][] = [
  ["Case diameter", "42 mm"],
  ["Case thickness", "12.7 mm"],
  ["Case material", "304 stainless steel"],
  ["Movement", "Miyota, Japan"],
  ["Crystal", "Hardened mineral glass"],
  ["Water resistance", "3 ATM / 30 m"],
  ["Functions", "Hours, minutes, chronograph, date"],
  ["Strap", "Sculpted silicone, steel keeper"],
];

function Details() {
  return (
    <section
      id="details"
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40 lg:px-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 15% 30%, rgb(255 255 255 / 0.07), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div data-reveal>
            <Eyebrow index="07">Specification</Eyebrow>
            <h2 className="mt-6 font-q-serif text-5xl leading-[0.95] font-normal tracking-[-0.01em] text-white md:text-7xl">
              The details,
              <br />
              <em className="text-white/55">in numbers.</em>
            </h2>
          </div>

          <div
            data-reveal
            className="relative mt-16 aspect-square w-full max-w-[26rem]"
          >
            <div className="q-ring absolute inset-0" />
            <div className="absolute inset-[7%] overflow-hidden rounded-full">
              <img
                src="/qorum/stills/regalia.webp"
                alt="Close-up of the Kronos sunray dial"
                loading="lazy"
                className="h-full w-full scale-110 object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_35%,#07080a_100%)]" />
            </div>
            <span className="absolute top-1/2 -right-2 h-px w-10 bg-white/40 md:-right-6" />
            <span className="absolute top-1/2 -right-2 translate-x-full pl-3 font-q-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-white/50 uppercase md:-right-6">
              Ø 42 mm
            </span>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-24">
          <dl className="border-t border-white/15">
            {SPECS.map(([k, v], i) => (
              <div
                key={k}
                data-reveal
                style={{ transitionDelay: `${i * 50}ms` }}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-white/15 py-6 md:grid-cols-[3rem_1fr_auto] md:py-7"
              >
                <span className="hidden font-q-mono text-[10px] text-white/30 md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="font-q-mono text-[11px] tracking-[0.22em] text-white/50 uppercase">
                  {k}
                </dt>
                <dd className="text-right text-base text-white transition-transform duration-500 group-hover:-translate-x-1 md:text-lg">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={SHOP_URL}
            className="group mt-10 inline-flex items-center gap-3 font-q-mono text-[11px] tracking-[0.22em] text-white uppercase"
          >
            <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
              Full technical sheet
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

const MANIFESTO =
  "Luxury doesn't always come at a cost. True luxury lies in how a watch makes you feel — the weight of steel, the sweep of a hand, the quiet confidence of something made well.";

function Story() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(
      el.querySelectorAll<HTMLSpanElement>("[data-word]"),
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph enters at 85% of the viewport, 1 when its end reaches 45%
      const p = Math.min(
        1,
        Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)),
      );
      const lit = p * words.length;
      words.forEach((w, i) => {
        w.style.opacity = String(
          0.14 + 0.86 * Math.min(1, Math.max(0, lit - i)),
        );
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="story"
      className="relative px-5 py-28 md:px-10 md:py-44 lg:px-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 80% 0%, rgb(255 255 255 / 0.08), transparent 70%), linear-gradient(180deg, #07080a, #0c0e11 50%, #07080a)",
        }}
      />
      <div className="relative mx-auto max-w-[1600px]">
        <div data-reveal>
          <Eyebrow index="08">The Qorum Idea</Eyebrow>
        </div>
        <p
          ref={ref}
          className="mt-10 max-w-[22ch] font-q-serif text-[2.6rem] leading-[1.02] tracking-[-0.01em] text-white md:text-[clamp(3.5rem,6.4vw,7.5rem)]"
        >
          {MANIFESTO.split(" ").map((w, i) => (
            <span key={i} data-word className="transition-opacity duration-200">
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:mt-28 md:grid-cols-3">
          {[
            [
              "Homegrown",
              "A tribute to Indian design, integrity and ambition — crafted to global standards, proudly made for the world.",
            ],
            [
              "Honest value",
              "Brushed steel, considered movements and finishing that rivals the shelf above — priced for people, not for vaults.",
            ],
            [
              "Founded with intent",
              "Co-founded by Ajay Devgn and Nishant Pitti to make fine watchmaking something you wear, not something you wait for.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="group relative bg-[#08090b] p-8 transition-colors duration-500 hover:bg-[#0f1114] md:p-10"
            >
              <span className="font-q-mono text-[10px] text-white/35">
                0{i + 1}
              </span>
              <h3 className="mt-14 font-q-serif text-3xl font-normal tracking-normal text-white md:text-4xl">
                {t}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                {b}
              </p>
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-white transition-transform duration-700 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COLLECTIONS = [
  {
    name: "Kronos",
    kind: "Chronograph",
    note: "₹9,999 – ₹12,999",
    img: "kronos",
  },
  {
    name: "Equinox",
    kind: "Skeleton automatic",
    note: "Explore",
    img: "equinox",
  },
  { name: "Regalia", kind: "Automatic, date", note: "Explore", img: "regalia" },
  { name: "Reef", kind: "Automatic, date", note: "Explore", img: "reef" },
  { name: "Aquaxplorer", kind: "Diver", note: "Explore", img: "aquaxplorer" },
];

function Collections() {
  const [hover, setHover] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const list = listRef.current;
    const f = floatRef.current;
    if (!list || !f) return;
    const r = list.getBoundingClientRect();
    f.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0) translate(-50%, -50%)`;
  };

  return (
    <section
      id="collections"
      className="relative px-5 py-28 md:px-10 md:py-40 lg:px-14"
    >
      <div className="mx-auto max-w-[1600px]">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <Eyebrow index="09">Collections</Eyebrow>
            <h2 className="mt-6 font-q-serif text-5xl leading-[0.95] font-normal tracking-[-0.01em] text-white md:text-7xl">
              Five ways
              <br />
              <em className="text-white/55">to keep time.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            For men and women. Limited first editions, each with its own
            character and the same refusal to compromise.
          </p>
        </div>

        <div
          ref={listRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          className="relative mt-16 border-t border-white/15 md:mt-24"
        >
          {/* cursor-following preview (desktop) */}
          <div
            ref={floatRef}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-10 hidden aspect-[3/4] w-[17rem] md:block"
          >
            {COLLECTIONS.map((c, i) => (
              <img
                key={c.img}
                src={`/qorum/stills/${c.img}.webp`}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: hover === i ? 1 : 0,
                  transform: hover === i ? "scale(1)" : "scale(0.92)",
                }}
              />
            ))}
          </div>

          {COLLECTIONS.map((c, i) => (
            <a
              key={c.name}
              href={SHOP_URL}
              data-reveal
              onMouseEnter={() => setHover(i)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/15 py-6 md:grid-cols-[4rem_1fr_16rem_12rem_2rem] md:gap-6 md:py-9"
            >
              <span className="font-q-mono text-[10px] text-white/35">
                0{i + 1}
              </span>
              <span className="flex items-center gap-4">
                <img
                  src={`/qorum/stills/${c.img}.webp`}
                  alt=""
                  loading="lazy"
                  className="h-14 w-11 object-cover grayscale md:hidden"
                />
                <span className="font-q-serif text-4xl text-white transition-[transform,color] duration-500 group-hover:translate-x-3 md:text-7xl">
                  {c.name}
                </span>
              </span>
              <span className="hidden font-q-mono text-[11px] tracking-[0.22em] text-white/50 uppercase md:block">
                {c.kind}
              </span>
              <span className="hidden text-sm text-white/70 md:block">
                {c.note}
              </span>
              <ArrowUpRight className="h-5 w-5 text-white/40 transition-[transform,color] duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-white transition-transform duration-700 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Designed in India",
    "Built for the world",
    "Kronos",
    "Steel & intent",
  ];
  const row = [...items, ...items];
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-white/10 py-8 md:py-12"
    >
      <div className="q-marquee flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {row.map((t, i) => (
              <span
                key={`${dup}-${i}`}
                className={`flex items-center px-6 font-sans text-6xl font-light tracking-[-0.03em] whitespace-nowrap uppercase md:px-10 md:text-[9rem] ${
                  i % 2 ? "q-outline" : "text-white"
                }`}
              >
                {t}
                <span className="ml-12 inline-block h-3 w-3 rounded-full border border-white/50 md:ml-20 md:h-4 md:w-4" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Closing() {
  const [sent, setSent] = useState(false);
  return (
    <section className="relative overflow-hidden px-5 py-32 md:px-10 md:py-48 lg:px-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 50%, rgb(255 255 255 / 0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="q-ring pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[130vw] -translate-x-1/2 -translate-y-1/2 opacity-50 md:w-[62vw]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] md:w-[78vw]"
      />

      <div
        data-reveal
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <p className="font-q-mono text-[10px] tracking-[0.4em] text-white/50 uppercase md:text-[11px]">
          Kronos — from ₹9,999
        </p>
        <h2 className="mt-8 font-q-serif text-6xl leading-[0.9] font-normal tracking-[-0.02em] text-white md:text-[8.5rem]">
          Wear the
          <br />
          <em className="text-white/55">moment.</em>
        </h2>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={SHOP_URL}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-q-mono text-xs tracking-[0.2em] text-black uppercase transition-[box-shadow] hover:shadow-[0_0_48px_rgb(255_255_255/0.35)]"
          >
            Shop Kronos
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#collections"
            className="inline-flex items-center gap-3 rounded-full border border-white/25 px-8 py-4 font-q-mono text-xs tracking-[0.2em] text-white uppercase transition-colors hover:border-white"
          >
            All collections
          </a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-20 w-full max-w-md"
        >
          <label
            htmlFor="q-email"
            className="font-q-mono text-[10px] tracking-[0.3em] text-white/45 uppercase"
          >
            First access to new editions
          </label>
          <div className="mt-4 flex items-center border-b border-white/30 focus-within:border-white">
            <input
              id="q-email"
              type="email"
              required
              placeholder="you@email.com"
              disabled={sent}
              className="w-full bg-transparent py-3 text-base text-white placeholder:text-white/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sent}
              className="font-q-mono text-[11px] tracking-[0.2em] whitespace-nowrap text-white uppercase disabled:text-white/50"
            >
              {sent ? "Subscribed" : "Notify me →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const cols: [string, string[]][] = [
    ["Shop", ["Men", "Women", "Kronos", "Bestsellers"]],
    ["Qorum", ["Our story", "Journal", "Boutiques", "Press"]],
    ["Care", ["Warranty", "Shipping & returns", "Servicing", "Contact"]],
  ];
  return (
    <footer className="relative border-t border-white/10 px-5 pt-20 pb-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark className="text-base text-white" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Indian luxury watches, crafted to global standards. Luxury doesn't
              always come at a cost.
            </p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h} className="md:col-span-2">
              <p className="font-q-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                {h}
              </p>
              <ul className="mt-5 space-y-3">
                {items.map((it) => (
                  <li key={it}>
                    <a
                      href={SHOP_URL}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-2">
            <p className="font-q-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
              Follow
            </p>
            <ul className="mt-5 space-y-3">
              {["Instagram", "YouTube", "X"].map((s) => (
                <li key={s}>
                  <a
                    href={SHOP_URL}
                    className="inline-flex items-center gap-1 text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {s} <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-24 -mb-[0.12em] text-center font-sans text-[24vw] leading-[0.8] font-light tracking-[-0.05em] text-white/[0.06] select-none"
        >
          QORUM
        </p>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 font-q-mono text-[10px] tracking-[0.2em] text-white/40 uppercase md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Qorum. All rights reserved.</span>
          <span>Designed in India</span>
        </div>
      </div>
    </footer>
  );
}

function QorumLanding() {
  useReveal();
  return (
    <div
      id="top"
      className="relative min-h-screen bg-[#07080a] font-sans text-white antialiased selection:bg-white selection:text-black"
    >
      <QorumNav />
      <main>
        <ScrollFilm />
        <Details />
        <Story />
        <Collections />
        <Marquee />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
