import { useId } from 'react';

/** Circular sticker with text running round the edge. */
export function RotatingBadge({
  text, size = 140, bg = '#E3A92B', ink = '#1C1A17', center, className = '',
}: { text: string; size?: number; bg?: string; ink?: string; center?: React.ReactNode; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`relative grid place-items-center rounded-full ${className}`} style={{ width: size, height: size, background: bg, color: ink }} aria-hidden>
      <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 h-full w-full">
        <defs><path id={`c${id}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
        <text fill={ink} style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 800, fontSize: 17 }}>
          <textPath href={`#c${id}`} textLength={464} lengthAdjust="spacing">
            {text.repeat(Math.max(1, Math.round(30 / text.length)))}
          </textPath>
        </text>
      </svg>
      <div className="relative">{center}</div>
    </div>
  );
}
