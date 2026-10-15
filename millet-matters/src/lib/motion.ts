import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** Lenis drives the scroll, GSAP's ticker drives Lenis, ScrollTrigger listens to Lenis. One clock. */
export function initSmoothScroll(reduced: boolean) {
  registerGsap();
  if (reduced || lenis) return () => {};
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, { offset, duration: 1.4 });
  } else if (typeof el === 'number') {
    window.scrollTo({ top: el });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  }
}

export const lockScroll = (locked: boolean) => {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
};

export { gsap, ScrollTrigger };
