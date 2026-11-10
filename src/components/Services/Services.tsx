import SplitText from '@/components/motion/SplitText';
import consulta from '@/assets/img/service-consulta.webp';
import vacina from '@/assets/img/service-vacina.webp';
import banho from '@/assets/img/service-banho.webp';
import hotel from '@/assets/img/service-hotel.webp';
import ServicesAccordion, { type Service } from './ServicesAccordion';
import styles from './Services.module.css';

const services: Service[] = [
  {
    id: 'consulta',
    title: 'Consulta veterinária',
    text: 'Escuta atenta, sem pressa e sem susto. Avaliamos seu pet de focinho a rabo e explicamos tudo em português claro.',
    details: ['Clínico geral e especialistas', 'Exames no mesmo dia', 'Retorno incluso em até 15 dias'],
    img: consulta,
    alt: 'Beagle sentado em preto e branco, olhando para cima enquanto uma veterinária de luvas ouve seu coração com um estetoscópio, sobre fundo azul',
    tone: 'blue',
    pos: '45% 18%',
  },
  {
    id: 'vacina',
    title: 'Vacinação',
    text: 'Esquema completo para filhotes e adultos, aplicado numa sala calma e com petisco de recompensa no final.',
    details: ['Carteirinha digital', 'Lembrete de reforço por mensagem', 'Sala tranquila para gatos'],
    img: vacina,
    alt: 'Gatinho em preto e branco com um curativo coral na pata, depois da vacina, sobre fundo coral',
    tone: 'coral',
    pos: '50% 30%',
  },
  {
    id: 'banho',
    title: 'Banho & tosa',
    text: 'Água morna, secagem sem estresse e aquele cheirinho de bicho novo. Tosa na máquina ou na tesoura, você escolhe.',
    details: ['Produtos hipoalergênicos', 'Tosa higiênica e na tesoura', 'Leva e traz de carro'],
    img: banho,
    alt: 'Poodle molhado, em preto e branco, enrolado numa toalha e cercado de bolhas de sabão, sobre fundo azul',
    tone: 'blue',
    pos: '50% 30%',
  },
  {
    id: 'hotel',
    title: 'Hotel & creche',
    text: 'Um dia de brincadeira com a turma ou noites de sono na caminha, com monitores por perto o tempo todo.',
    details: ['Monitores 24 horas', 'Área de brincar e passeios', 'Boletim diário com fotos'],
    img: hotel,
    alt: 'Golden retriever dormindo com o focinho apoiado nas patas, numa caminha felpuda, em preto e branco sobre fundo coral',
    tone: 'coral',
    pos: '50% 100%',
  },
];

export default function Services() {
  return (
    <section id="servicos" className={styles.services} aria-labelledby="servicos-title">
      <div className="container">
        <header className={styles.head}>
          <SplitText as="h2" id="servicos-title" className={`display ${styles.title}`}>
            Tudo que seu pet precisa, num lugar só
          </SplitText>
          <p className={styles.intro} data-reveal="up">
            Do primeiro check-up ao fim de semana de hotel, a equipe da Bigode cuida do seu bicho como cuidaria do
            nosso. Cada serviço tem hora marcada, gente paciente e nenhuma pressa.
          </p>
        </header>

        <ServicesAccordion services={services} />
      </div>
    </section>
  );
}
