import { offers } from '@/lib/products';

const ITEMS = [
  `Free shipping above ₹${offers.free_shipping_threshold}`,
  `${offers.welcome_code} · ${offers.welcome_percent}% off your first order`,
  `Free surprise gift above ₹${offers.free_gift_threshold}`,
  `Curate your Millet Box · any ${offers.box_size}, ${offers.box_percent}% off`,
];

export function AnnouncementBar() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6">
          <span>{t}</span>
          <span className="ml-12 text-turmeric" aria-hidden>✺</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-wrap relative overflow-hidden bg-ink py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream" role="region" aria-label="Offers">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
