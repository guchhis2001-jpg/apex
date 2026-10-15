import type { ImgHTMLAttributes } from 'react';
import { asset } from '@/lib/asset';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  /** PNG/JPG sources get AVIF + WebP siblings (built by `npm run assets:optimize`). */
  priority?: boolean;
};

/** <picture> with AVIF → WebP → original fallback. */
export function Picture({ src: rawSrc, priority, alt = '', loading, decoding, ...rest }: Props) {
  const src = asset(rawSrc);
  const isRaster = /\.(png|jpe?g)$/i.test(src);
  const base = src.replace(/\.(png|jpe?g)$/i, '');
  const img = (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      {...(priority ? { fetchpriority: 'high' } : {})}
      {...rest}
    />
  );
  if (!isRaster) return img;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}.avif`} />
      <source type="image/webp" srcSet={`${base}.webp`} />
      {img}
    </picture>
  );
}
