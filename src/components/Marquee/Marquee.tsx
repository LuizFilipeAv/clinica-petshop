import styles from './Marquee.module.css';

type Props = {
  reverse?: boolean;
  tone?: 'blue' | 'coral';
};

const items = ['Consultas', 'Vacinas', 'Banho & tosa', 'Hotel', 'Petshop', 'Emergência 24h'];

function Paw() {
  return (
    <svg className={styles.paw} viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <ellipse cx="12" cy="16" rx="5.6" ry="4.6" />
      <ellipse cx="4.6" cy="10.2" rx="2.1" ry="2.7" />
      <ellipse cx="9.2" cy="5.6" rx="2.1" ry="2.7" />
      <ellipse cx="14.8" cy="5.6" rx="2.1" ry="2.7" />
      <ellipse cx="19.4" cy="10.2" rx="2.1" ry="2.7" />
    </svg>
  );
}

/**
 * Decorative ticker band. The moving track is aria-hidden; a visually-hidden
 * list carries the same services for screen readers.
 * tone: 'blue' (default) or 'coral'. reverse: scrolls in the opposite direction.
 */
export default function Marquee({ reverse = false, tone = 'blue' }: Props) {
  const rootClass = tone === 'coral' ? `${styles.marquee} ${styles.coral}` : styles.marquee;
  const trackClass = reverse ? `${styles.track} ${styles.reverse}` : styles.track;

  return (
    <div className={rootClass}>
      <div className={styles.band}>
        <div className={trackClass} aria-hidden="true">
          {[0, 1].map((group) => (
            <div className={styles.group} key={group}>
              {items.map((label) => (
                <span className={styles.item} key={label}>
                  {label}
                  <Paw />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ul className="visually-hidden">
        {items.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
