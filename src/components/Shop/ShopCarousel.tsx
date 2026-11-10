'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReduced } from '@/lib/motion';
import type { Product } from './Shop';
import ProductCard from './ProductCard';
import styles from './Shop.module.css';

const ARROW = 'M0 5.6h7.6L4.1 9.1 5 10l5-5-5-5-.9.9 3.5 3.5H0z';

export default function ShopCarousel({ products, children }: { products: Product[]; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /* bitmask of cards that are partially visible on the right edge */
  const [peekMask, setPeekMask] = useState(0);
  const [status, setStatus] = useState('');
  const statusRaf = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = () => [...track.querySelectorAll<HTMLElement>('[data-card]')];
    const behavior = (): ScrollBehavior => (prefersReduced() ? 'auto' : 'smooth');
    const maxScroll = () => track.scrollWidth - track.clientWidth;

    /* ---------- arrows + edge state (derived from scroll position) ---------- */
    let ticking = false;
    let updRaf = 0;
    const update = () => {
      ticking = false;
      setAtStart(track.scrollLeft <= 2);
      setAtEnd(track.scrollLeft >= maxScroll() - 2);
      const tr = track.getBoundingClientRect();
      let mask = 0;
      cards().forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.right - tr.right > 4 && r.left < tr.right) mask |= 1 << i;
      });
      setPeekMask(mask);
    };
    const queue = () => { if (!ticking) { ticking = true; updRaf = requestAnimationFrame(update); } };
    track.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();

    /* ---------- mouse drag with inertia (touch uses native scroll) ---------- */
    let down = false, active = false, startX = 0, startScroll = 0, lastX = 0, lastT = 0, vel = 0;
    let raf = 0, releaseTimer = 0;

    const release = () => {
      clearTimeout(releaseTimer);
      track.classList.remove(styles['is-dragging']);
    };

    const settle = () => {
      raf = 0;
      const list = cards();
      if (!list.length) return release();
      const pad = list[0].offsetLeft;
      const x = track.scrollLeft;
      let best = list[0];
      let bestD = Infinity;
      list.forEach((c) => {
        const d = Math.abs(c.offsetLeft - pad - x);
        if (d < bestD) { bestD = d; best = c; }
      });
      track.scrollTo({ left: best.offsetLeft - pad, behavior: behavior() });
      if (prefersReduced()) return release();
      // keep snap off until the glide to the card ends, so it doesn't jump
      track.addEventListener('scrollend', release, { once: true });
      releaseTimer = window.setTimeout(release, 700);
    };

    const glide = () => {
      let prevT = performance.now();
      const tick = (t: number) => {
        const dt = Math.min(t - prevT, 32);
        prevT = t;
        track.scrollLeft += vel * dt;
        vel *= Math.pow(0.94, dt / 16);
        const x = track.scrollLeft;
        if (Math.abs(vel) < 0.04 || x <= 0 || x >= maxScroll() - 1) return settle(); // stops the rAF
        raf = requestAnimationFrame(tick);
      };
      if (Math.abs(vel) < 0.04) settle();
      else raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      if (!active) {
        if (Math.abs(dx) < 4) return;
        active = true;
        track.classList.add(styles['is-dragging']);
      }
      track.scrollLeft = startScroll - dx;
      const dt = e.timeStamp - lastT;
      if (dt > 0) vel = vel * 0.6 + ((lastX - e.clientX) / dt) * 0.4;
      lastX = e.clientX;
      lastT = e.timeStamp;
    };

    const removeWindowListeners = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    function onUp(e: PointerEvent) {
      removeWindowListeners();
      down = false;
      if (!active) return;
      active = false;
      if (prefersReduced() || e.timeStamp - lastT > 80) vel = 0;
      glide();
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || down) return;
      if ((e.target as Element).closest('button')) return;
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
      down = true; active = false; vel = 0;
      startX = lastX = e.clientX;
      startScroll = track.scrollLeft;
      lastT = e.timeStamp;
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };
    track.addEventListener('pointerdown', onDown);

    return () => {
      track.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('scrollend', release);
      removeWindowListeners();
      cancelAnimationFrame(updRaf);
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(statusRaf.current), []);

  const go = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const list = track.querySelectorAll<HTMLElement>('[data-card]');
    const step = list.length > 1 ? list[1].offsetLeft - list[0].offsetLeft : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: prefersReduced() ? 'auto' : 'smooth' });
  }, []);

  const announce = useCallback((name: string) => {
    setStatus('');
    cancelAnimationFrame(statusRaf.current);
    statusRaf.current = requestAnimationFrame(() => setStatus(`${name} adicionado à sacola`));
  }, []);

  return (
    <>
      <div className={`container ${styles.head}`}>
        {children}
        <div className={styles.nav} data-reveal="fade">
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="Ver produtos anteriores"
            aria-disabled={atStart}
            onClick={() => { if (!atStart) go(-1); }}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d={ARROW} fill="currentColor" /></svg>
          </button>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Ver próximos produtos"
            aria-disabled={atEnd}
            onClick={() => { if (!atEnd) go(1); }}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d={ARROW} fill="currentColor" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        data-cursor="Arraste"
        data-reveal="up"
        role="region"
        aria-label="Produtos do petshop"
        tabIndex={0}
      >
        <ul className={styles.list}>
          {products.map((p, i) => (
            <ProductCard key={`${p.name}-${i}`} product={p} peek={(peekMask & (1 << i)) !== 0} onAdd={announce} />
          ))}
        </ul>
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{status}</p>
    </>
  );
}
