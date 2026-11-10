'use client';
/**
 * Global motion runtime — mounted once in the root layout.
 *
 * Declarative API (plain data-attributes in JSX, no per-section JS needed):
 *   data-reveal="up|fade|scale|clip"   one-shot entrance when 15% visible
 *   data-stagger                       on a parent: its [data-reveal] children get an --i index
 *   <SplitText>                        heading words rise from a mask (see SplitText.tsx)
 *   data-draw                          on <svg> or <path>: hand-drawn stroke draws in
 *   data-parallax="0.15"               scrubbed vertical drift
 *   data-count="1200" data-suffix="+"  number counts up when visible
 *   data-magnetic                      element leans toward the pointer
 *   data-cursor="Arraste"              custom cursor shows this label while hovering
 *
 * Visibility is flagged with the `data-inview` attribute (not a class) so React re-renders
 * that change className never wipe it.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReduced, finePointer, setLenis } from '@/lib/motion';

const fmt = new Intl.NumberFormat('pt-BR');

function countUp(el: HTMLElement, reduced: boolean) {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  if (reduced) { el.textContent = fmt.format(end) + suffix; return; }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: end, duration: 1.6, ease: 'expo.out',
    onUpdate: () => { el.textContent = fmt.format(Math.round(obj.v)) + suffix; },
  });
}

export default function MotionProvider() {
  useEffect(() => {
    const reduced = prefersReduced();
    const cleanups: Array<() => void> = [];

    /* ---------- Smooth scroll ---------- */
    if (!reduced) {
      const lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4) });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a || e.defaultPrevented) return;
        const id = a.getAttribute('href')!;
        const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
        history.replaceState(null, '', id);
      };
      document.addEventListener('click', onClick);
      cleanups.push(() => { document.removeEventListener('click', onClick); gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); });
    }

    /* ---------- Reveal / draw / count (one-shot) ---------- */
    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
      parent.querySelectorAll<HTMLElement>('[data-reveal]').forEach((c, i) => c.style.setProperty('--i', String(i)));
    });
    document.querySelectorAll<SVGPathElement>('[data-draw] path, path[data-draw]').forEach((p, i) => {
      p.style.setProperty('--len', String(Math.ceil(p.getTotalLength())));
      if (!p.style.getPropertyValue('--i')) p.style.setProperty('--i', String(i % 6));
    });
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split], [data-draw], [data-count]');
    if (reduced) {
      targets.forEach((t) => { t.setAttribute('data-inview', ''); if (t.dataset.count) countUp(t, true); });
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.setAttribute('data-inview', '');
          if (el.dataset.count) countUp(el, false);
          io.unobserve(el);
        }),
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      );
      targets.forEach((t) => { if (!t.hasAttribute('data-inview')) io.observe(t); });
      cleanups.push(() => io.disconnect());
    }

    /* ---------- Parallax ---------- */
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || '0.15') * 100;
        gsap.fromTo(el, { yPercent: amt }, {
          yPercent: -amt, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
    cleanups.push(() => ctx.revert());

    /* ---------- Magnetic + cursor (fine pointers only) ---------- */
    if (!reduced && finePointer()) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.3);
          y((e.clientY - r.top - r.height / 2) * 0.3);
        };
        const leave = () => { x(0); y(0); };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });

      const c = document.createElement('div');
      c.className = 'cursor';
      c.setAttribute('aria-hidden', 'true');
      c.innerHTML = '<span class="cursor__label"></span>';
      document.body.append(c);
      const label = c.firstElementChild as HTMLElement;
      const xTo = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3.out' });
      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) { gsap.set(c, { x: e.clientX, y: e.clientY }); shown = true; c.classList.add('is-on'); }
        xTo(e.clientX); yTo(e.clientY);
        const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
        const text = t?.dataset.cursor ?? '';
        c.classList.toggle('is-label', !!text);
        c.classList.toggle('is-link', !!t && !text);
        if (text && label.textContent !== text) label.textContent = text;
      };
      const hide = () => c.classList.remove('is-on');
      const show = () => c.classList.add('is-on');
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', hide);
      document.documentElement.addEventListener('pointerenter', show);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', hide);
        document.documentElement.removeEventListener('pointerenter', show);
        c.remove();
      });
    }

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
