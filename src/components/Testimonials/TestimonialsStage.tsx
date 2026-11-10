'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Image, { type StaticImageData } from 'next/image';
import styles from './Testimonials.module.css';

export type Testimonial = {
  pet: string;
  tutor: string;
  bairro: string;
  img: StaticImageData;
  quote: string;
};

const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z';
const MARK = 'M0 30V17C0 7 5 1.5 14 0l1.6 4.4C11 6 9 8.6 9 12h6.5v18zM21 30V17C21 7 26 1.5 35 0l1.6 4.4C32 6 30 8.6 30 12h6.5v18z';
const INTERVAL = 7000;

export default function TestimonialsStage({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [index, setIndex] = useState(0);
  /* bumped on every manual selection so the auto-advance timer restarts */
  const [epoch, setEpoch] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* reduced motion + document visibility */
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncRm = () => setReduced(rm.matches);
    const syncVis = () => setDocHidden(document.hidden);
    syncRm();
    syncVis();
    rm.addEventListener('change', syncRm);
    document.addEventListener('visibilitychange', syncVis);
    return () => {
      rm.removeEventListener('change', syncRm);
      document.removeEventListener('visibilitychange', syncVis);
    };
  }, []);

  /* pause while the section is off-screen */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const root = stage.closest('section') ?? stage;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[entries.length - 1].isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  /* auto-advance: one timeout per (index, pause-state) combination */
  useEffect(() => {
    if (reduced || hovered || focused || !visible || docHidden) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [index, epoch, reduced, hovered, focused, visible, docHidden, n]);

  const select = (i: number, focus = false) => {
    const next = (i + n) % n;
    setIndex(next);
    setEpoch((e) => e + 1);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown') select(index + 1, true);
    else if (k === 'ArrowLeft' || k === 'ArrowUp') select(index - 1, true);
    else if (k === 'Home') select(0, true);
    else if (k === 'End') select(n - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      data-reveal="up"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => setFocused((e.target as Element).matches(':focus-visible'))}
      onBlur={() => setFocused(false)}
    >
      <svg className={styles.mark} viewBox="0 0 40 30" aria-hidden="true">
        <path d={MARK} fill="currentColor" />
      </svg>

      <div className={styles.panels}>
        {items.map((it, i) => (
          <article
            key={it.pet}
            className={`${styles.panel}${i === index ? ` ${styles['is-active']}` : ''}`}
            role="tabpanel"
            id={`dep-panel-${i}`}
            aria-labelledby={`dep-tab-${i}`}
          >
            <svg className={styles.stars} viewBox="0 0 120 24" role="img" aria-label="Nota 5 de 5">
              {[0, 1, 2, 3, 4].map((s) => (
                <path key={s} d={STAR} transform={`translate(${s * 24} 0)`} fill="currentColor" />
              ))}
            </svg>
            <blockquote className={styles.quote}>{it.quote}</blockquote>
            <p className={styles.who}><strong>{it.pet}</strong> e {it.tutor}, {it.bairro}</p>
          </article>
        ))}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Escolha um depoimento">
        {items.map((it, i) => (
          <button
            key={it.pet}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            className={styles.tab}
            id={`dep-tab-${i}`}
            aria-controls={`dep-panel-${i}`}
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={onKeyDown}
          >
            <span className={styles.avatar}>
              <Image className={styles.avatarImg} src={it.img} alt="" sizes="88px" />
            </span>
            <span className={styles.name}>{it.pet}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
