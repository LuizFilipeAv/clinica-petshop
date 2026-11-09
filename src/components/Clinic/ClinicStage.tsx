'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '@/lib/motion';
import styles from './Clinic.module.css';

/** Scroll-scrubbed window: the photo frame opens from an inset rounded rectangle to full size. */
export default function ClinicStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = stage.current;
    if (!root || prefersReduced()) return;
    const frame = root.querySelector<HTMLElement>('[data-frame]');
    const inner = root.querySelector<HTMLElement>('[data-inner]');
    const tags = root.querySelector<HTMLElement>('[data-tags]');
    if (!frame || !inner) return;

    // side/top insets (% of the frame) for the starting "~70% wide" rounded rectangle
    const inset = () => (window.innerWidth >= 900 ? { x: 15, y: 9 } : { x: 8, y: 6 });
    // mirrors --radius-l: clamp(24px, 1rem + 2vw, 44px)
    const radius = () => Math.min(44, Math.max(24, 16 + window.innerWidth * 0.02));

    const trigger = {
      trigger: root,
      start: 'top 88%',
      end: 'top 22%',
      scrub: true,
      invalidateOnRefresh: true,
    };

    gsap.fromTo(
      frame,
      {
        clipPath: () => {
          const { x, y } = inset();
          return `inset(${y}% ${x}% ${y}% ${x}% round ${radius()}px)`;
        },
      },
      { clipPath: () => `inset(0% 0% 0% 0% round ${radius()}px)`, ease: 'none', scrollTrigger: trigger },
    );

    // depth: the photo settles while the window opens
    gsap.fromTo(inner, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: trigger });

    // keep the tags inside the visible part of the photo while the frame is still inset
    if (tags) {
      gsap.fromTo(
        tags,
        {
          x: () => (root.offsetWidth * inset().x) / 100,
          y: () => -(root.offsetHeight * inset().y) / 100,
        },
        { x: 0, y: 0, ease: 'none', scrollTrigger: trigger },
      );
    }

    ScrollTrigger.refresh();
  }, { scope: stage });

  return <div ref={stage} className={styles.stage}>{children}</div>;
}
