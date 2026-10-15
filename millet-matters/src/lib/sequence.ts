/**
 * Progressive image-sequence loader.
 * Loads in tiers so a scrubbed canvas always has *something* close to draw:
 *   first + last frame of every chapter → every 8th → every 4th → every 2nd → all.
 */
export class SequenceSet {
  private frames: (HTMLImageElement | null)[][];
  private started = false;
  private aborted = false;
  onFrame: ((chapter: number, index: number) => void) | null = null;

  constructor(private urls: string[][]) {
    this.frames = urls.map((u) => u.map(() => null));
  }

  count(chapter: number) {
    return this.urls[chapter].length;
  }

  start(concurrency = 6) {
    if (this.started) return;
    this.started = true;
    const queue: [number, number][] = [];
    const seen = new Set<string>();
    const push = (c: number, i: number) => {
      const k = `${c}:${i}`;
      if (!seen.has(k) && i >= 0 && i < this.urls[c].length) {
        seen.add(k);
        queue.push([c, i]);
      }
    };
    this.urls.forEach((u, c) => { push(c, 0); push(c, u.length - 1); });
    for (const step of [8, 4, 2, 1]) this.urls.forEach((u, c) => { for (let i = 0; i < u.length; i += step) push(c, i); });

    const worker = async () => {
      while (queue.length && !this.aborted) {
        const [c, i] = queue.shift()!;
        const img = new Image();
        img.decoding = 'async';
        img.src = this.urls[c][i];
        try {
          await img.decode();
          this.frames[c][i] = img;
          this.onFrame?.(c, i);
        } catch {
          /* missing frame: nearest() will fall back */
        }
      }
    };
    for (let k = 0; k < concurrency; k++) void worker();
  }

  /** The loaded frame closest to `index` (searching outward). */
  nearest(chapter: number, index: number): HTMLImageElement | null {
    const f = this.frames[chapter];
    if (f[index]) return f[index];
    for (let d = 1; d < f.length; d++) {
      if (f[index - d]) return f[index - d];
      if (f[index + d]) return f[index + d];
    }
    return null;
  }

  destroy() {
    this.aborted = true;
    this.onFrame = null;
  }
}
