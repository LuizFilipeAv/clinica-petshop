'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image, { type StaticImageData } from 'next/image';
import styles from './Services.module.css';

export type Service = {
  id: string;
  title: string;
  text: string;
  details: string[];
  img: StaticImageData;
  alt: string;
  tone: 'blue' | 'coral';
  pos: string;
};

const HOVER_INTENT_MS = 90;
const isDesktop = () => window.matchMedia('(min-width: 1000px)').matches;

export default function ServicesAccordion({ services }: { services: Service[] }) {
  const [open, setOpenState] = useState<number | null>(0);
  const openRef = useRef<number | null>(0);
  const timer = useRef<number>(0);
  const wasOpen = useRef(false);
  const pointerType = useRef('');

  const setOpen = (v: number | null) => {
    openRef.current = v;
    setOpenState(v);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ul className={styles.accordion} data-stagger>
      {services.map((s, i) => {
        const isOpen = open === i;
        return (
          <li
            key={s.id}
            className={`${styles.panel} ${s.tone === 'coral' ? styles.coral : ''} ${isOpen ? styles.isOpen : ''}`}
            data-reveal="up"
            data-cursor="Ver"
            style={{ '--pos': s.pos } as CSSProperties}
            // Mouse hover: small intent delay so the resizing panels do not make the pointer flip-flop.
            onPointerEnter={(e) => {
              if (!isDesktop() || e.pointerType !== 'mouse') return;
              window.clearTimeout(timer.current);
              if (openRef.current === i) return;
              timer.current = window.setTimeout(() => setOpen(i), HOVER_INTENT_MS);
            }}
            onPointerLeave={() => window.clearTimeout(timer.current)}
            // Keyboard: focus expands the panel (links inside become reachable).
            onFocus={() => {
              if (isDesktop()) setOpen(i);
            }}
          >
            <div className={styles.media}>
              <Image
                src={s.img}
                alt={s.alt}
                fill
                sizes="(min-width: 1000px) 700px, (min-width: 640px) 50vw, 100vw"
                className={styles.img}
              />
            </div>

            {/* Touch / pen / click: the button toggles. */}
            <button
              type="button"
              className={styles.toggle}
              data-cursor="Ver"
              aria-expanded={isOpen}
              aria-controls={`svc-${s.id}-body`}
              aria-labelledby={`svc-${s.id}-title`}
              onPointerDown={(e) => {
                pointerType.current = e.pointerType;
                wasOpen.current = openRef.current === i;
              }}
              onClick={(e) => {
                window.clearTimeout(timer.current);
                if (e.detail === 0) {
                  // keyboard activation (focus already opened it)
                  setOpen(openRef.current === i ? null : i);
                } else if (pointerType.current !== 'mouse' && wasOpen.current) {
                  setOpen(null);
                } else {
                  setOpen(i);
                }
                pointerType.current = '';
              }}
            >
              <span className={`${styles.label} display`} aria-hidden="true">{s.title}</span>
              <span className={styles.plus} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            <div className={styles.body} id={`svc-${s.id}-body`}>
              <h3 className={`display ${styles.panelTitle}`} id={`svc-${s.id}-title`}>{s.title}</h3>
              <p className={styles.text}>{s.text}</p>
              <ul className={styles.details}>
                {s.details.map((d) => (
                  <li key={d}>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8.6l3.2 3L13 4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.action}>
                <a className={styles.cta} href="#contato">
                  <span>Agendar<span className="visually-hidden">: {s.title}</span></span>
                  <svg viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M0 5.6h7.6L4.1 9.1 5 10l5-5-5-5-.9.9 3.5 3.5H0z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
