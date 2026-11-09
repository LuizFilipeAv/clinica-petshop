import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.css';

const sections = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#clinica', label: 'Clínica' },
  { href: '#petshop', label: 'Petshop' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo className={styles.logo} />
            <p className={styles.tagline}>Cuidado de verdade, do primeiro miado ao último latido.</p>
          </div>

          <nav className={styles.col} aria-labelledby="footer-nav-title">
            <h2 className={styles.title} id="footer-nav-title">
              Navegação
            </h2>
            <ul className={styles.list}>
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <address className={styles.col}>
            <h2 className={styles.title} id="footer-contact-title">
              Contato
            </h2>
            <ul className={styles.list}>
              <li>Rua dos Pinheiros, 1200 — São Paulo</li>
              <li>
                <a href="tel:+551130000000">(11) 3000-0000</a>
              </li>
              <li>
                <a href="mailto:oi@bigode.vet">oi@bigode.vet</a>
              </li>
            </ul>
          </address>

          <div className={styles.col}>
            <h2 className={styles.title} id="footer-social-title">
              Redes
            </h2>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.social}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className={styles.social}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
                    <path d="M14 3c.4 2.6 2.2 4.4 5 4.7" />
                  </svg>
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" className={styles.social}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="4" />
                    <path d="M10 9.5v5l4.5-2.5z" />
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Bigode — projeto conceitual de portfólio.</p>
          <a href="#top" className={styles.topLink}>
            Voltar ao topo
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
