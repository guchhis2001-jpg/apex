import data from '@data/products.json';
import milletData from '@data/millets.json';

export type Claim = 'gluten-free' | 'high-in-protein' | 'diabetic-friendly';

export interface ShopImage { src: string; alt: string; width?: number; height?: number }

export interface Product {
  id: string;
  handle: string;
  title: string;
  short_title: string;
  product_type: string;
  vendor: string;
  variant_group?: string;
  variant_label?: string;
  millet: string[];
  weight: number;
  weight_unit: string;
  price: number | null;
  compare_at_price: number | null;
  available: boolean;
  image: ShopImage;
  dish_image: ShopImage;
  tags: string[];
  claims: string[];
  metafields: { ready_in_min?: number; ready_in_verified?: boolean; accent?: string };
}

export interface Collection { handle: string; title: string; line: string; image: string; requires_claim?: string }
export interface Millet { key: string; name: string; aka: string; fact: string; image: string; becomes: string[] }

export const shop = data.shop;
export const offers = data.offers;
export const claimsApproved: Record<string, boolean> = Object.fromEntries(
  Object.entries(data.CLAIMS_APPROVED).filter(([, v]) => typeof v === 'boolean'),
) as Record<string, boolean>;
export const products = data.products as Product[];
export const collections = data.collections as Collection[];
export const millets = milletData.millets as Millet[];

const byHandle = new Map(products.map((p) => [p.handle, p]));
export const getProduct = (handle: string) => {
  const p = byHandle.get(handle);
  if (!p) throw new Error(`Unknown product handle: ${handle}`);
  return p;
};
export const findProduct = (handle: string) => byHandle.get(handle);

export const isPurchasable = (p: Product) => p.available && typeof p.price === 'number';
export const heroProducts = products.filter((p) => p.tags.includes('hero'));

export const MILLET_NAMES: Record<string, string> = {
  foxtail: 'Foxtail', jowar: 'Jowar', little: 'Little Millet', kodo: 'Kodo', barnyard: 'Barnyard', ragi: 'Ragi', multi: 'Multi-millet',
};
export const milletLabel = (p: Product) => p.millet.map((m) => MILLET_NAMES[m] ?? m).join(' + ');

export const ACCENTS: Record<string, { bg: string; ink: string }> = {
  cocoa: { bg: '#5B3A29', ink: '#F5EDE0' },
  vanilla: { bg: '#EBD9B4', ink: '#5B3A29' },
  turmeric: { bg: '#E3A92B', ink: '#1C1A17' },
  crisp: { bg: '#D98E3A', ink: '#1C1A17' },
  leaf: { bg: '#8DB25B', ink: '#1C1A17' },
  field: { bg: '#2F5D3A', ink: '#F5EDE0' },
  ragi: { bg: '#7A3B2E', ink: '#F5EDE0' },
};
export const accentOf = (p: Product) => ACCENTS[p.metafields.accent ?? 'cocoa'] ?? ACCENTS.cocoa;

export const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const priceLabel = (p: Product) => (typeof p.price === 'number' ? rupees(p.price) : 'Price TBC');
