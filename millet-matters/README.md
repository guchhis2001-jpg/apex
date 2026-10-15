# Millet Matters — landing page

Single landing page for Millet Matters (Udgith Millet Foods LLP). Vite + React + TypeScript + Tailwind, with GSAP ScrollTrigger and Lenis for motion. The production build prerenders the page to static HTML, so the hero paints before any JavaScript runs.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck → client build → SSR prerender → dist/
npm run preview      # serve dist/ on http://localhost:4173
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, Shopify CDN).

**Measured (Lighthouse 12, local preview build):** mobile scores 90 for performance, 100 for accessibility, 100 for best practices and 100 for SEO. Desktop scores 100 on all four. CLS is 0.

---

## Where things live

```
data/products.json        All product, offer, claim and collection data (Shopify-shaped)
data/millets.json         "Meet the millets" content
src/config/theme.json     Every colour: base tokens, chapter colours, moment tiles
src/config/chapters.ts    The 4 Transformation chapters (copy, products, frame counts)
src/config/brand.ts       Hero SKU, logo path, rating/review numbers, Millet Tribe counter, nav + policy links
src/sections/*            One component per page section, in page order
public/assets/**          All images (see below)
scripts/*                 Asset generation, optimisation, contrast check, prerender
```

## Dropping in real assets

Every placeholder is labelled `PLACEHOLDER` on the image itself. To replace one, keep the filename, overwrite the file, and rebuild.

| What | Path | Spec |
|---|---|---|
| Logo | `public/assets/brand/logo.svg` | SVG, about 5:1. PNG works if you also change `LOGO_SRC` in `src/config/brand.ts` |
| Favicon | `public/assets/brand/favicon.svg` | Square SVG |
| Pack shots (13) | `public/assets/packs/*.png` | **Transparent PNG**, 4:5 (800×1000 or larger), pack centred, soft shadow optional |
| Plated dishes (7) | `public/assets/dishes/*.png` | Transparent PNG, square, dish centred. Shown on rail hover and moment tiles |
| Grain macros (6) | `public/assets/grains/{foxtail,jowar,little,kodo,barnyard,ragi}.webp` | Square WebP, 800×800, full-bleed macro |
| UGC tiles (6) | `public/assets/ugc/ugc-{1..6}.webp` | Square WebP, 600×600 |
| Sequences (4) | `public/assets/sequences/{pancake,khichdi,dosa,cookie}/0001.webp …` | See next section |

After replacing any PNG in `packs/` or `dishes/`, run:

```bash
npm run assets:optimize   # writes .avif + .webp next to each PNG; the page serves AVIF → WebP → PNG
```

The hero pack is the LCP image and is preloaded in `index.html`. If you change `HERO_HANDLE` in `src/config/brand.ts`, update that `<link rel="preload">` too.

## Transformation sequences

Each chapter is a numbered image sequence drawn to `<canvas>` and scrubbed by scroll.

1. Export frames as `0001.webp`, `0002.webp`, … (4-digit, 1-based) into `public/assets/sequences/{chapter}/`.
2. Set `frames` for that chapter in `src/config/chapters.ts` (all four default to 60).
3. Rebuild.

**Frame spec:** square, 720–900 px, WebP at about quality 60. Up to **120 frames on desktop**. Phones draw every `mobileStep`th frame (default 2, so at most 60). Keep each chapter around 1.5MB on desktop, which keeps all four under 8MB on mobile (the placeholders total 5.6MB on desktop and about 2.8MB on mobile). AVIF also works: set `ext: 'avif'`.

**Shooting:** shoot on a seamless background in the chapter colour, or deliver frames with alpha (WebP supports transparency). The chapter background shows through transparent pixels. Start each sequence on raw grain and end on the plated dish. The first and last frames double as the reduced-motion before/after stills.

**Mobile video fallback:** set `mobileVideo: '/assets/sequences/pancake/mobile.mp4'` on a chapter and phones play a muted, looping, inline MP4 instead of the canvas.

**Loading:** frames start downloading only after the page has loaded and the section is within two screens. Loading is progressive (first and last frame of every chapter, then every 8th, 4th, 2nd, then all), so scrubbing always has a nearby frame to draw.

To regenerate the placeholder art: `npm run assets:placeholders` (or `node scripts/generate-placeholders.mjs static|sequences`).

## Changing colours

All colour lives in `src/config/theme.json`.

- `colors`: base tokens. These become Tailwind classes (`bg-cream`, `text-field`, and so on). Replace them with values sampled from the real logo and packaging.
- `chapters.{pancake|khichdi|dosa|cookie}`:
  - `bg`: chapter background
  - `ink`: text colour
  - `accent`: eyebrow, the RAW→READY sticker, and the readable label colour
  - `word`: the giant word behind the food (decorative, so keep it close to `bg`)
- `moments`: background and text for each Shop-by-Moment tile, keyed by collection handle.
- `surfaces`: other pairings used on the page, listed so they get checked.

After any colour change, run:

```bash
npm run contrast   # fails if any text pairing drops below WCAG AA (4.5:1)
```

All current pairings pass. Three chapter accents were adjusted from the brief to get there: khichdi uses cocoa, dosa uses a deep cocoa, and cookie uses a light turmeric.

## Product data

`data/products.json` mirrors Shopify product objects (`handle`, `title`, `product_type`, `tags`, `price`, `compare_at_price`, `image`, `metafields`), so it maps directly onto a theme section or Hydrogen loader. Prices are in rupees (multiply by 100 for Shopify).

- **`price: null`** means the client hasn't supplied it. The UI shows "Price TBC" and keeps the item out of the cart and the box. Five snack prices are null today; only Almond Cashew Cookies (₹135) was supplied. Filling them in switches everything on automatically, including the Ragi Cookies card in chapter 4. Until then that chapter features Almond Cashew Cookies.
- **`variant_group`**: products that share a group become one rail card with a flavour toggle (the two pancake mixes).
- **`metafields.ready_in_min`** feeds "Ready in X min". Only khichdi (10 min) comes from the brief. **Every value is an estimate** and shows a `VERIFY` tag until `ready_in_verified` is set to `true`.

## Health claims

`CLAIMS_APPROVED` in `products.json` gates every health claim. All three (gluten-free, high in protein, diabetic-friendly) are `false` by default, which means:

- The hero sticker reads "READY IN MINUTES · NO MAIDA". It switches to "GLUTEN-FREE" once that claim is approved.
- The **Diabetic-Friendly Combo** moment tile is hidden. With six tiles the bento re-flows automatically.
- Product claim chips are hidden.

Add `?claims=preview` to the URL to see every pending claim, marked "pending approval". This is for client review only. Per-product `claims` arrays also need confirming against the actual labels.

## Still needed from the client

These items are clearly marked on the page:

- [ ] Logo + packaging files (then sample the real colours into `theme.json`)
- [ ] 13 transparent pack shots, 7 plated-dish photos, 6 grain macros, 4 transformation sequences
- [ ] Rating and review count → `PROOF` in `src/config/brand.ts`
- [ ] Millet Tribe counter: the live number or an endpoint returning `{ "count": n }` → `MILLET_TRIBE` in `src/config/brand.ts`. The current site was unreachable from the build environment, so this is not wired yet.
- [ ] 3 verified reviews (the page never shows invented quotes) and 6 UGC images
- [ ] Prices for 5 snacks
- [ ] Cook times (`ready_in_min`)
- [ ] Claim approvals
- [ ] Re-check of the millet facts in `data/millets.json`
- [ ] Real collection handles. Moment tiles link to `/collections/{handle}`, nav links to `/pages/our-story` and `/blogs/recipes`. These inner pages are not built yet.

## Notes for the Shopify move

- Cart is UI-only (React context + localStorage, `src/lib/cart.tsx`). Swap the reducer for Storefront API cart mutations. A box line maps to 6 line items plus an automatic discount.
- The newsletter form is UI-only (`src/sections/Footer.tsx`). Wire it to Shopify customer marketing or Klaviyo.
- Each section is a standalone component that reads only from `/data` and `/src/config`, so each one ports to a theme section or Hydrogen route one at a time.

## Motion and accessibility

- Lenis drives scroll, GSAP's ticker drives Lenis, and ScrollTrigger listens to Lenis, so the whole page runs on one clock.
- Only two things loop: the offers marquee (pauses on hover) and the rotating sticker.
- With `prefers-reduced-motion`:
  - Lenis is off and nothing pins.
  - The Transformation becomes static before/after stills.
  - The No-List shows already struck through.
  - Marquee and sticker stop.
- Keyboard and screen readers:
  - The cart drawer and search are modal dialogs with a focus trap, close on Escape, and return focus when closed.
  - Every buy button carries the product name for screen readers.
