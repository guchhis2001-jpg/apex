import { createElement, type CSSProperties } from 'react';
import { useInView } from '@/lib/hooks';

/** Line-by-line text reveal. Each string in `lines` is one masked line. */
export function RevealLines({
  lines, as = 'h2', className = '', style, active,
}: { lines: string[]; as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'; className?: string; style?: CSSProperties; active?: boolean }) {
  const [ref, inView] = useInView<HTMLElement>();
  const on = active ?? inView;
  return createElement(
    as,
    { ref, className: `reveal ${on ? 'is-in' : ''} ${className}`, style, 'aria-label': lines.join(' ') },
    lines.map((l, i) => (
      <span className="line" key={i} aria-hidden>
        <span>{l}</span>
      </span>
    )),
  );
}

export function FadeUp({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-up ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
