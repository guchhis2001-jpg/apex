import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { gsap, registerGsap, ScrollTrigger, scrollToTarget } from '@/lib/motion';

const NOS = ['No maida.', 'No preservatives.', 'No refined sugar.', 'No artificial flavours.'];
const STRIKE = '#E3A92B';

export function NoList() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    registerGsap();
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const ctx = gsap.context(() => {
      const pinLength = () => window.innerHeight * (mobile ? 1.8 : 2.6);
      ScrollTrigger.create({ trigger: section.current, start: 'top top', end: () => `+=${pinLength()}`, pin: stage.current, invalidateOnRefresh: true });
      // The timeline starts while the section is still scrolling in, so the first line is already there when it pins.
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top 55%',
          end: () => `top+=${pinLength()} top`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>('[data-no]').forEach((li, i) => {
        const strike = li.querySelector('[data-strike]');
        tl.fromTo(li, { xPercent: 14, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5 }, i * 0.9)
          .fromTo(strike, { backgroundSize: '0% 0.12em' }, { backgroundSize: '100% 0.12em', duration: 0.45, ease: 'power2.inOut' }, i * 0.9 + 0.4)
          .to(li, { opacity: 0.32, duration: 0.3 }, i * 0.9 + 0.8);
      });
      tl.to('[data-nolist]', { scale: 0.94, opacity: 0.12, duration: 0.6 }, '+=0.2')
        .fromTo('[data-just]', { scale: 0.55, autoAlpha: 0, rotate: -4 }, { scale: 1, autoAlpha: 1, rotate: -2, duration: 0.8, ease: 'expo.out' }, '<0.1')
        .fromTo('[data-just-cta]', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, '<0.4')
        .to({}, { duration: 0.4 });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} id="no-list" className="on-dark relative bg-ink text-cream" aria-labelledby="nolist-title">
      <div ref={stage} className={`relative flex flex-col justify-center overflow-hidden px-5 sm:px-8 lg:px-[4vw] ${reduced ? 'py-24' : 'h-[100svh]'}`}>
        <p id="nolist-title" className="eyebrow mb-6 text-turmeric">What's not in the pack</p>
        <ul data-nolist className="origin-left space-y-1 lg:space-y-0">
          {NOS.map((t) => (
            <li key={t} data-no className="display text-[clamp(44px,12.5vw,80px)] md:text-[7.4vw]">
              <span
                data-strike
                className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                style={{
                  backgroundImage: `linear-gradient(${STRIKE}, ${STRIKE})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 54%',
                  backgroundSize: '100% 0.12em',
                }}
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
        <div className={reduced ? 'mt-12' : 'absolute inset-0 grid place-items-center px-5'}>
          <div className="text-center">
            <p data-just className="display text-[clamp(72px,22vw,360px)] text-turmeric">
              Just millet.
            </p>
            <a
              data-just-cta
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#shop', -64);
              }}
              className="btn btn-cream mt-6"
            >
              Shop the mixes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
