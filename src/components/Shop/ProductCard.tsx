'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import type { Product } from './Shop';
import styles from './Shop.module.css';

const brl = (n: number) => `R$ ${n}`;

export default function ProductCard({ product: p, peek, onAdd }: { product: Product; peek: boolean; onAdd: (name: string) => void }) {
  const [added, setAdded] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const add = () => {
    setAdded(true);
    onAdd(p.name);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <li className={`${styles.card}${peek ? ` ${styles['is-peek']}` : ''}`} data-card>
      <div className={styles.media} style={{ '--bg': p.bg } as CSSProperties}>
        <Image
          className={styles.img}
          src={p.img}
          alt={p.alt}
          sizes="(min-width: 600px) 330px, 72vw"
          draggable={false}
        />
      </div>
      <div className={styles.info}>
        <div>
          <h3 className={styles.name}>{p.name}</h3>
          <p className={styles.price}>{brl(p.price)}</p>
        </div>
        <button
          type="button"
          className={`${styles.add}${added ? ` ${styles['is-added']}` : ''}`}
          aria-label={`Adicionar ${p.name} à sacola`}
          onClick={add}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className={styles.plus} d="M12 5v14M5 12h14" />
            <path className={styles.check} d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" />
          </svg>
        </button>
      </div>
    </li>
  );
}
