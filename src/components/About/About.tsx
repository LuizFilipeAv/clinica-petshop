import Image from 'next/image';
import SplitText from '@/components/motion/SplitText';
import vet from '@/assets/img/about-vet.webp';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="clinica" className={styles.about} aria-labelledby="sobre-title">
      <div className={styles.card}>
        <div className={styles.copy} data-stagger>
          <SplitText as="h2" id="sobre-title" className={`display ${styles.title}`}>
            Gente que ama <span className={styles.hl}>bicho</span> tanto quanto você
          </SplitText>

          <p className={styles.lead} data-reveal="up">
            A Dra. Marina Albuquerque (CRMV-SP 48.213) abriu a Bigode há 12 anos com uma ideia simples: tratar cada
            pet pelo nome e cada tutor como parte da equipe. Hoje somos veterinários, auxiliares e banhistas que
            conhecem o ronco do seu cachorro e o jeito do seu gato de pedir colo.
          </p>

          <dl className={styles.facts} data-reveal="up">
            <div className={styles.fact}>
              <dt>anos de clínica</dt>
              <dd><span className={styles.num} data-count="12">12</span></dd>
            </div>
            <div className={styles.fact}>
              <dt>pets atendidos</dt>
              <dd><span className={styles.num} data-count="8000" data-suffix="+">8.000+</span></dd>
            </div>
            <div className={styles.fact}>
              <dt>plantão de emergência</dt>
              <dd><span className={styles.num} data-count="24" data-suffix="h">24h</span></dd>
            </div>
          </dl>

          <a className="btn btn--ghost" href="#contato" data-reveal="up" data-magnetic>
            Conheça a equipe
            <span className="btn__arrow" aria-hidden="true">
              <svg viewBox="0 0 10 10"><path d="M0 5.6h7.6L4.1 9.1 5 10l5-5-5-5-.9.9 3.5 3.5H0z" fill="currentColor" /></svg>
            </span>
          </a>
        </div>

        <div className={styles.photo} data-reveal="up">
          <Image
            src={vet}
            alt="Veterinária sorrindo com um buldogue francês nos braços"
            sizes="(min-width: 900px) 48vw, 90vw"
            className={styles.img}
          />

          <svg className={styles.scribble} viewBox="0 0 170 110" fill="none" aria-hidden="true" data-draw>
            <path
              d="M6 12C52-6 92 22 70 46C54 64 26 44 52 30C84 14 124 52 152 94"
              stroke="var(--coral)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M131 87.6L152 94L147 72.6"
              stroke="var(--coral)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
