import { useEffect, useRef, useState } from 'react';
import { MILLET_TRIBE } from '@/config/brand';
import { PlaceholderTag } from './AddToCart';

/** "Millet Tribe" live counter. Counts up on first view; polls the endpoint if one is configured. */
export function TribeCounter() {
  const [count, setCount] = useState<number | null>(MILLET_TRIBE.fallback);
  const [shown, setShown] = useState<number | null>(null);
  const shownRef = useRef<number | null>(null);

  useEffect(() => {
    if (!MILLET_TRIBE.endpoint) return;
    let alive = true;
    const pull = async () => {
      try {
        const r = await fetch(MILLET_TRIBE.endpoint!, { cache: 'no-store' });
        const j = (await r.json()) as { count?: number };
        if (alive && typeof j.count === 'number') setCount(j.count);
      } catch {
        /* keep last value */
      }
    };
    pull();
    const t = window.setInterval(pull, MILLET_TRIBE.pollMs);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (count === null) return;
    const from = shownRef.current ?? Math.round(count * 0.92);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      const v = Math.round(from + (count - from) * (1 - Math.pow(1 - t, 3)));
      shownRef.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="animate-live h-2 w-2 rounded-full bg-field" aria-hidden />
      <span className="font-bold">Millet Tribe</span>
      {shown !== null ? (
        <span className="tabular-nums" aria-live="polite">{shown.toLocaleString('en-IN')}</span>
      ) : (
        <PlaceholderTag>live count</PlaceholderTag>
      )}
    </span>
  );
}
