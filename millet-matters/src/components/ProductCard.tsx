import { milletLabel, priceLabel, type Product } from '@/lib/products';
import { Picture } from './Picture';
import { AddToCart, PlaceholderTag } from './AddToCart';
import { Clock } from './Icons';

export function ReadyIn({ product, className = '' }: { product: Product; className?: string }) {
  const m = product.metafields.ready_in_min;
  if (!m) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Clock width={15} height={15} />
      <span>Ready in {m} min</span>
      {!product.metafields.ready_in_verified && <PlaceholderTag className="ml-0.5">verify</PlaceholderTag>}
    </span>
  );
}

/** Compact buy card used inside the Transformation chapters. */
export function ChapterProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-paper p-3 pr-4 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] sm:gap-4 sm:p-4">
      <div className={`shrink-0 overflow-hidden rounded-2xl bg-cream ${compact ? 'h-[72px] w-[60px]' : 'h-[112px] w-[92px]'}`}>
        <Picture src={product.image.src} alt={product.image.alt} width={800} height={1000} className="h-full w-full object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-ink/75">{milletLabel(product)} · {product.weight} {product.weight_unit}</p>
        <h3 className={`display-soft mt-1 ${compact ? 'text-[18px]' : 'text-[26px]'}`}>{product.short_title}</h3>
        {compact ? (
          <p className="mt-1 text-[15px] font-extrabold">{priceLabel(product)}</p>
        ) : (
          <>
            <ReadyIn product={product} className="mt-1.5 text-[13px] font-semibold text-ink/80" />
            <div className="mt-3 flex items-center gap-3">
              <span className="display-soft text-[28px]">{priceLabel(product)}</span>
              <AddToCart product={product} className="btn btn-primary min-h-[44px] flex-1 px-4" />
            </div>
          </>
        )}
      </div>
      {compact && <AddToCart product={product} compact className="btn btn-primary h-12 w-12 shrink-0 px-0" />}
    </div>
  );
}
