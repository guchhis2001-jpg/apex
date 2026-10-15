import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { isPurchasable, type Product } from '@/lib/products';
import { Check, Plus } from './Icons';

/** Add button that knows about unpriced products (shows "Price TBC", never adds a ₹0 line). */
export function AddToCart({
  product, className = 'btn btn-primary', label = 'Add to cart', compact = false, openDrawer = true,
}: { product: Product; className?: string; label?: string; compact?: boolean; openDrawer?: boolean }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  if (!isPurchasable(product)) {
    return (
      <button type="button" className={className} disabled aria-label={`${product.title}: price to be confirmed`}>
        Price TBC
      </button>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={compact ? `Add ${product.title} to cart` : undefined}
      onClick={() => {
        add(product.handle, { open: openDrawer });
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <Check width={18} height={18} /> : <Plus width={18} height={18} />}
      {!compact && (
        <span>
          {done ? 'Added' : label}
          <span className="sr-only">: {product.title}</span>
        </span>
      )}
    </button>
  );
}

export function PlaceholderTag({ children = 'Client to supply', className = '' }: { children?: React.ReactNode; className?: string }) {
  return <span className={`placeholder-tag ${className}`}>{children}</span>;
}
