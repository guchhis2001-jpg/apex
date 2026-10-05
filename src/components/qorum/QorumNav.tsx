import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const SHOP_URL = "https://qorum.in";

const LINKS = [
  { href: "#kronos", label: "Kronos" },
  { href: "#details", label: "Details" },
  { href: "#story", label: "Story" },
  { href: "#collections", label: "Collections" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-sans font-medium tracking-[0.42em] uppercase ${className}`}
    >
      Qorum
    </span>
  );
}

export function QorumNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#07080a]/55 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10 lg:px-14">
          <a href="#top" aria-label="Qorum home" className="text-white">
            <Wordmark className="text-sm md:text-[15px]" />
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-10 md:flex"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-q-mono text-[11px] tracking-[0.22em] text-white/60 uppercase transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={SHOP_URL}
              className="group hidden items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 font-q-mono text-[11px] tracking-[0.2em] text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-black md:inline-flex"
            >
              Shop
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-[#07080a] px-5 pb-10 transition-[opacity,visibility] duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-white/10 py-5 text-white transition-[opacity,transform] duration-500"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(12px)",
                transitionDelay: open ? `${100 + i * 60}ms` : "0ms",
              }}
            >
              <span className="font-q-serif text-5xl">{l.label}</span>
              <span className="font-q-mono text-[10px] tracking-[0.3em] text-white/40">
                0{i + 1}
              </span>
            </a>
          ))}
        </nav>
        <a
          href={SHOP_URL}
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-white py-4 font-q-mono text-xs tracking-[0.2em] text-black uppercase"
        >
          Shop Qorum <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </>
  );
}
