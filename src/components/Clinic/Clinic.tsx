import Image from 'next/image';
import SplitText from '@/components/motion/SplitText';
import space from '@/assets/img/clinic-space.webp';
import ClinicStage from './ClinicStage';
import styles from './Clinic.module.css';

export default function Clinic() {
  return (
    <section className={styles.clinic} aria-labelledby="espaco-title">
      <div className={`container ${styles.head}`}>
        <SplitText as="h2" id="espaco-title" className={`display ${styles.title}`}>
          Um espaço pensado pra eles
        </SplitText>
        <p className={styles.lead} data-reveal="up">
          Salas separadas para cães e gatos, piso que não escorrega e uma recepção onde ninguém precisa esperar
          apertado. Consultório, exames e internação ficam no mesmo endereço, pra você não sair correndo com o
          bicho no colo.
        </p>
      </div>

      <ClinicStage>
        <div className={styles.frame} data-frame>
          <div className={styles.inner} data-inner>
            <Image
              src={space}
              alt="Recepção clara da clínica Bigode, com poltronas azuis e coral e um golden retriever deitado no chão"
              fill
              sizes="(min-width: 900px) calc(100vw - 4rem), 100vw"
              className={styles.img}
            />
          </div>
        </div>

        <ul className={styles.tags} data-tags data-stagger>
          <li className={styles.tag} data-reveal="up">Sala só para gatos</li>
          <li className={styles.tag} data-reveal="up">Internação monitorada</li>
          <li className={styles.tag} data-reveal="up">Raio-X digital</li>
        </ul>
      </ClinicStage>
    </section>
  );
}
