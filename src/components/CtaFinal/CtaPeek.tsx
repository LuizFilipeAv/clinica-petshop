'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '@/lib/motion';
import styles from './CtaFinal.module.css';

/** The dog peeks up from behind the panel's bottom edge as the section scrolls in. */
export default function CtaPeek({ children }: { children: ReactNode }) {
  const photo = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = photo.current;
    if (!el || prefersReduced()) return;
    gsap.fromTo(
      el,
      { yPercent: 35 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top 92%', end: 'top 35%', scrub: 0.5 },
      },
    );
    ScrollTrigger.refresh();
  }, { scope: photo });

  return <div ref={photo} className={styles.photo}>{children}</div>;
}
