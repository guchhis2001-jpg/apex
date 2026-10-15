/** Brand-level switches. Everything a non-developer may need to change lives here or in /data. */

export const HERO_HANDLE = 'double-chocochip-millet-pancake-mix'; // keep the <link rel=preload> in index.html in sync

import { asset } from '@/lib/asset';

export const LOGO_SRC = asset('assets/brand/logo.svg');

/** Social proof. `null` renders a visible CLIENT TO SUPPLY marker instead of an invented number. */
export const PROOF = {
  rating: null as number | null, // e.g. 4.8
  reviewCount: null as number | null, // e.g. 1240
};

/**
 * "Millet Tribe" live counter from milletmatters.com.
 * - `endpoint`: URL returning JSON { count: number }. Polled every `pollMs`.
 * - `fallback`: number shown before/without the endpoint. `null` = CLIENT TO SUPPLY marker.
 */
export const MILLET_TRIBE = {
  endpoint: null as string | null,
  fallback: null as number | null,
  pollMs: 60_000,
};

export const NAV_LINKS = [
  { label: 'Shop by Millet', href: '#millets' },
  { label: 'Shop by Moment', href: '#moments' },
  { label: 'Our Story', href: '/pages/our-story' },
  { label: 'Recipes', href: '/blogs/recipes' },
];

export const POLICY_LINKS = [
  { label: 'Shipping policy', href: '/policies/shipping-policy' },
  { label: 'Refund policy', href: '/policies/refund-policy' },
  { label: 'Privacy policy', href: '/policies/privacy-policy' },
  { label: 'Terms of service', href: '/policies/terms-of-service' },
];

export const collectionUrl = (handle: string) => `/collections/${handle}`;
