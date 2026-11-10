'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Logo from '@/components/Logo/Logo';
import { gsap, ScrollTrigger, useGSAP, prefersReduced, finePointer, getLenis } from '@/lib/motion';
import cat from '@/assets/img/hero-cat.webp';
import dog from '@/assets/img/hero-dog.webp';
import s from './Hero.module.css';

type Pet = 'gato' | 'cachorro';
const words: Record<Pet, string> = { gato: 'gatos', cachorro: 'cães' };

/** Replays a [data-draw] svg by toggling the runtime's data-inview flag across two frames. */
const redraw = (svgs: NodeListOf<SVGElement> | SVGElement[]) => {
  svgs.forEach((m) => m.removeAttribute('data-inview'));
  requestAnimationFrame(() => requestAnimationFrame(() => svgs.forEach((m) => m.setAttribute('data-inview', ''))));
};

export default function Hero() {
  const [pet, setPet] = useState<Pet>('gato');
  const root = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const reduced = prefersReduced();
      const q = gsap.utils.selector(root);
      const mark = q('[data-hero-mark-inner]')[0];
      const stage = q('[data-hero-stage]')[0];
      const ui = q('[data-hero-ui]');
      const marks = q('[data-draw]') as unknown as SVGElement[];

      /* ---------- Entrance ---------- */
      const firstVisit = !document.documentElement.classList.contains('intro-seen');
      if ((reduced || !firstVisit) && intro.current) intro.current.style.display = 'none';

      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        gsap.set(mark, { yPercent: 100, clipPath: 'inset(0 0 100% 0)' });
        gsap.set(stage, { yPercent: 6, scale: 1.04, opacity: 0 });
        gsap.set(ui, { y: 30, opacity: 0 });

        if (firstVisit && intro.current) {
          try { sessionStorage.setItem('bigode-intro', '1'); } catch {}
          const ov = intro.current;
          const logo = ov.querySelector('.logo')!;
          tl.add(() => getLenis()?.stop())
            .from(logo, { yPercent: 40, opacity: 0, duration: 0.6 })
            .from(logo.querySelectorAll('.logo__ear'), { scale: 0, transformOrigin: '50% 100%', duration: 0.5, ease: 'back.out(3)', stagger: 0.06 }, '<0.15')
            .to(ov, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '+=0.15')
            .add(() => { ov.style.display = 'none'; getLenis()?.start(); });
        }
        tl.to(stage, { yPercent: 0, scale: 1, opacity: 1, duration: 1.2 }, firstVisit ? '-=0.45' : 0)
          .to(mark, { yPercent: 0, clipPath: 'inset(0 0 -20% 0)', duration: 1 }, '<0.1')
          .to(ui, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '<0.3')
          .add(() => redraw(marks), '<');

        /* ---------- Scroll: card shrinks, wordmark lifts away ---------- */
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('[data-hero-card]'), { scale: 0.9, borderRadius: 64, ease: 'none', scrollTrigger: st });
        gsap.to(q('[data-hero-mark]'), { yPercent: -60, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
        gsap.to(q('[data-hero-pets]'), { yPercent: 10, ease: 'none', scrollTrigger: st });
        ScrollTrigger.refresh();
      }

      /* ---------- Pointer: subtle depth ---------- */
      if (!reduced && finePointer()) {
        const px = gsap.quickTo(q('[data-hero-pets]'), 'x', { duration: 1, ease: 'power3.out' });
        const mx = gsap.quickTo(mark, 'x', { duration: 1.2, ease: 'power3.out' });
        const my = gsap.quickTo(mark, 'y', { duration: 1.2, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          px(nx * 18); mx(nx * -26); my(ny * -12);
        };
        const leave = () => { px(0); mx(0); my(0); };
        const el = root.current!;
        el.addEventListener('pointermove', move, { passive: true });
        el.addEventListener('pointerleave', leave);
        return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
      }
    },
    { scope: root },
  );

  const select = contextSafe((to: Pet) => {
    if (to === pet) return;
    setPet(to);
    if (prefersReduced()) return;
    gsap.fromTo(word.current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)' });
    redraw(root.current!.querySelectorAll<SVGElement>('[data-draw]'));
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next: Pet = pet === 'gato' ? 'cachorro' : 'gato';
    select(next);
    switchRef.current?.querySelector<HTMLButtonElement>(`[data-to="${next}"]`)?.focus();
  };

  return (
    <>
      <div className={s.intro} ref={intro} aria-hidden="true">
        <Logo className={s.intro__logo} />
      </div>

      <section className={s.hero} id="top" ref={root} aria-labelledby="hero-title">
        <div className={s.hero__card} data-hero-card="">
          <h1 id="hero-title" className="visually-hidden">Bigode, clínica veterinária e petshop em Pinheiros, São Paulo</h1>

          <div className={s.hero__mark} data-hero-mark="">
            <div data-hero-mark-inner=""><Logo className={s.hero__logo} /></div>
          </div>

          <div className={s.hero__stage} data-hero-stage="">
            <div className={s.hero__pets} data-hero-pets="">
              <div className={`${s.hero__pet} ${pet === 'gato' ? s['is-active'] : ''}`} aria-hidden={pet !== 'gato'}>
                <Image src={cat} alt="Gato branco de pelo longo e olhos azuis caminhando em direção à câmera"
                  fill priority sizes="(min-width: 900px) 62vh, 90vw" />
              </div>
              <div className={`${s.hero__pet} ${pet === 'cachorro' ? s['is-active'] : ''}`} aria-hidden={pet !== 'cachorro'}>
                <Image src={dog} alt="Filhote de samoieda branco com coleira coral caminhando sorridente"
                  fill sizes="(min-width: 900px) 62vh, 90vw" />
              </div>
            </div>

            <svg className={`${s.hero__marks} ${s['hero__marks--r']}`} viewBox="0 0 120 120" fill="none" data-draw="" aria-hidden="true">
              <path d="M18 62 L44 50" stroke="var(--coral)" strokeWidth="7" strokeLinecap="round" />
              <path d="M24 34 L48 30" stroke="var(--coral)" strokeWidth="7" strokeLinecap="round" style={{ ['--i' as string]: 1 }} />
              <path d="M40 10 L54 18" stroke="var(--coral)" strokeWidth="7" strokeLinecap="round" style={{ ['--i' as string]: 2 }} />
            </svg>
            <svg className={`${s.hero__marks} ${s['hero__marks--l']}`} viewBox="0 0 160 120" fill="none" data-draw="" aria-hidden="true">
              <path d="M150 96 C 120 100, 92 88, 88 66 C 84 44, 112 40, 114 58 C 116 80, 74 92, 40 70 C 24 60, 16 44, 12 26"
                stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" style={{ ['--i' as string]: 3 }} />
            </svg>
          </div>

          <div className={s.hero__ui}>
            <a className={s.hero__pill} href="#servicos" data-hero-ui="">
              <span>Clínica veterinária & petshop para <b ref={word}>{words[pet]}</b> e quem os ama</span>
              <span className={s['hero__pill-go']} aria-hidden="true">
                <svg viewBox="0 0 10 10"><path d="M5.6 0v7.6l3.5-3.5L10 5l-5 5-5-5 .9-.9 3.5 3.5V0z" fill="currentColor" /></svg>
              </span>
            </a>

            <div className={s.hero__switch} role="radiogroup" aria-label="Escolha seu pet" data-hero-ui=""
              data-active={pet} ref={switchRef} onKeyDown={onKey}>
              <span className={s['hero__switch-hl']} aria-hidden="true" />
              <button type="button" role="radio" aria-checked={pet === 'gato'} tabIndex={pet === 'gato' ? 0 : -1}
                data-to="gato" onClick={() => select('gato')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 10 4 3l5 3.5h6L20 3l-1 7" /><path d="M5 10a7 7 0 1 0 14 0" /><path d="M10 13h.01M14 13h.01" /><path d="M2 15l4-.5M22 15l-4-.5" />
                </svg>
                Gato
              </button>
              <button type="button" role="radio" aria-checked={pet === 'cachorro'} tabIndex={pet === 'cachorro' ? 0 : -1}
                data-to="cachorro" onClick={() => select('cachorro')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 5C4 5 2 8 3 12l3-1" /><path d="M17 5c3 0 5 3 4 7l-3-1" /><path d="M6 9.5a6 6 0 0 0 12 0V9a6 6 0 0 0-12 0z" /><path d="M10 11h.01M14 11h.01" /><path d="M11 15h2l-1 1z" />
                </svg>
                Cachorro
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
