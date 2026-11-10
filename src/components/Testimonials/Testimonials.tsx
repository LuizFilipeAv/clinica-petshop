import SplitText from '@/components/motion/SplitText';
import a1 from '@/assets/img/pet-avatar-1.webp';
import a2 from '@/assets/img/pet-avatar-2.webp';
import a3 from '@/assets/img/pet-avatar-3.webp';
import TestimonialsStage, { type Testimonial } from './TestimonialsStage';
import styles from './Testimonials.module.css';

const items: Testimonial[] = [
  {
    pet: 'Paçoca', tutor: 'Marina Teixeira', bairro: 'Vila Madalena', img: a1,
    quote: 'A Paçoca tinha pavor de veterinário. Aqui ela entrou abanando o rabo, saiu com biscoito, e eu saí com o exame explicado em português de gente.',
  },
  {
    pet: 'Chumbinho', tutor: 'Rodrigo Álvares', bairro: 'Pompeia', img: a2,
    quote: 'O Chumbinho odeia tudo e todos. A doutora sentou no chão, esperou ele chegar sozinho e só depois pegou o estetoscópio. Já marquei o retorno.',
  },
  {
    pet: 'Salsicha', tutor: 'Camila Nogueira', bairro: 'Perdizes', img: a3,
    quote: 'Levei a Salsicha para um banho e voltei com ela cheirosa e uma foto no WhatsApp. É atendimento de quem gosta de bicho de verdade.',
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className={styles.testi} aria-labelledby="dep-title">
      <div className={`container ${styles.grid}`}>
        <SplitText as="h2" id="dep-title" className={`display ${styles.title}`}>
          Quem confia, abana o rabo
        </SplitText>
        <TestimonialsStage items={items} />
      </div>
    </section>
  );
}
