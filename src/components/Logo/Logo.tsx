import styles from './Logo.module.css';

type Props = { className?: string; id?: string; as?: 'span' | 'div' };

/** Wordmark "bigode": the "o" is a cat face — ears, eyes and coral whiskers. Sizes with font-size. */
export default function Logo({ className = '', id, as: Tag = 'span' }: Props) {
  return (
    <Tag className={`${styles.logo} logo ${className}`} id={id} role="img" aria-label="Bigode — clínica veterinária e petshop">
      <span aria-hidden="true">big</span>
      <span className={styles.o} aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none">
          <path className={`${styles.ear} ${styles.earL} logo__ear`} d="M22 52 L26 8 Q28 2 33 6 L60 30" fill="currentColor" />
          <path className={`${styles.ear} ${styles.earR} logo__ear`} d="M98 52 L94 8 Q92 2 87 6 L60 30" fill="currentColor" />
          <circle cx="60" cy="68" r="38" stroke="currentColor" strokeWidth="17" fill="var(--logo-fill, transparent)" />
          <g className={styles.eyes} fill="currentColor">
            <ellipse cx="47" cy="64" rx="5" ry="6.5" />
            <ellipse cx="73" cy="64" rx="5" ry="6.5" />
          </g>
          <path d="M55 76 Q60 81 65 76" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <g stroke="var(--coral)" strokeWidth="4.5" strokeLinecap="round">
            <g className={styles.wl}><path d="M30 74 H8" /><path d="M31 83 L10 90" /></g>
            <g className={styles.wr}><path d="M90 74 H112" /><path d="M89 83 L110 90" /></g>
          </g>
        </svg>
      </span>
      <span aria-hidden="true">de</span>
    </Tag>
  );
}
