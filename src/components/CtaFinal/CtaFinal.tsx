import Image from 'next/image';
import SplitText from '@/components/motion/SplitText';
import dog from '@/assets/img/cta-peek-dog.webp';
import CtaPeek from './CtaPeek';
import styles from './CtaFinal.module.css';

export default function CtaFinal() {
  return (
    <section id="contato" className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.card}>
        <div className={styles.main}>
          <SplitText as="h2" id="cta-title" className={`display ${styles.title}`}>
            Bora marcar uma visita?
          </SplitText>
          <p className={styles.lead} data-reveal="up">
            Passe aqui para conhecer o espaço, apresentar o seu bichinho e tirar as dúvidas com a equipe. A primeira conversa é por nossa conta.
          </p>

          <div className={styles.actions} data-reveal="up">
            <a className={`btn ${styles.wa}`} href="https://wa.me/5511900000000" target="_blank" rel="noopener" data-magnetic>Agendar pelo WhatsApp</a>
            <a className="btn btn--ghost" href="tel:+551130000000">Ligar (11) 3000-0000</a>

            <svg className={styles.arrow} viewBox="0 0 100 66" fill="none" aria-hidden="true" data-draw>
              <path d="M94 60C70 64 30 58 20 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M7 25L20 9L34 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>

        <div className={styles.panel} data-reveal="scale">
          <CtaPeek>
            <Image
              src={dog}
              alt="Cachorro jack russell sorridindo de língua para fora, espiando por cima de uma beirada"
              fill
              sizes="(min-width: 900px) 40vw, 90vw"
              className={styles.img}
            />
          </CtaPeek>
        </div>

        <dl className={styles.info} data-stagger>
          <div data-reveal="up">
            <dt>Endereço</dt>
            <dd>Rua dos Pinheiros, 1200<br />Pinheiros, São Paulo</dd>
          </div>
          <div data-reveal="up">
            <dt>Horário</dt>
            <dd>Seg a Sáb, 8h–20h<br />Emergência 24h</dd>
          </div>
          <div data-reveal="up">
            <dt>Contato</dt>
            <dd><a href="mailto:oi@bigode.vet">oi@bigode.vet</a></dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
