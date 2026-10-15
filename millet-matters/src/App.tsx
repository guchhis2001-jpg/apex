import { useEffect, useState } from 'react';
import { CartProvider } from '@/lib/cart';
import { ClaimsProvider } from '@/lib/claims';
import { initSmoothScroll, ScrollTrigger } from '@/lib/motion';
import { AnnouncementBar } from '@/sections/AnnouncementBar';
import { Nav } from '@/sections/Nav';
import { Hero } from '@/sections/Hero';
import { Transformation } from '@/sections/Transformation';
import { MilletMatch } from '@/sections/MilletMatch';
import { Moments } from '@/sections/Moments';
import { NoList } from '@/sections/NoList';
import { MeetTheMillets } from '@/sections/MeetTheMillets';
import { Proof } from '@/sections/Proof';
import { BuildYourBox } from '@/sections/BuildYourBox';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { SearchOverlay } from '@/components/SearchOverlay';
import { FloatingOrder } from '@/components/FloatingOrder';

export default function App() {
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stop = initSmoothScroll(reduced);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      stop();
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <ClaimsProvider>
      <CartProvider>
        {import.meta.env.VITE_PREVIEW === '1' && (
          <p className="bg-turmeric px-4 py-1.5 text-center text-[12px] font-bold text-ink">
            Concept preview · Not the official Millet Matters store · Checkout is disabled
          </p>
        )}
        <AnnouncementBar />
        <Nav onSearch={() => setSearch(true)} />
        <main id="main">
          <div data-hide-float><Hero /></div>
          <div data-hide-float><Transformation /></div>
          <MilletMatch />
          <Moments />
          <NoList />
          <MeetTheMillets />
          <Proof />
          <div data-hide-float><BuildYourBox /></div>
        </main>
        <div data-hide-float><Footer /></div>
        <FloatingOrder />
        <CartDrawer />
        <SearchOverlay open={search} onClose={() => setSearch(false)} />
      </CartProvider>
    </ClaimsProvider>
  );
}
