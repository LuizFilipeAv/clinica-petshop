import type { StaticImageData } from 'next/image';
import SplitText from '@/components/motion/SplitText';
import food from '@/assets/img/shop-food.webp';
import toy from '@/assets/img/shop-toy.webp';
import bed from '@/assets/img/shop-bed.webp';
import ShopCarousel from './ShopCarousel';
import styles from './Shop.module.css';

export type Product = {
  name: string;
  price: number;
  img: StaticImageData;
  /** Sampled from each photo's studio backdrop so the image melts into the card. */
  bg: string;
  alt: string;
};

const products: Product[] = [
  { name: 'Ração natural 3kg', price: 189, img: food, bg: '#cfcfd1', alt: 'Embalagem de ração natural em papel kraft sobre fundo cinza claro' },
  { name: 'Osso de borracha', price: 39, img: toy, bg: '#cccccc', alt: 'Osso de borracha coral com textura de bolinhas e frisos' },
  { name: 'Caminha nuvem', price: 249, img: bed, bg: '#cfcfcf', alt: 'Caminha redonda de pelúcia azul, macia e fofa' },
  { name: 'Ração filhote 1kg', price: 79, img: food, bg: '#cfcfd1', alt: 'Pacote de ração para filhotes em papel kraft' },
  { name: 'Caminha nuvem P', price: 169, img: bed, bg: '#cfcfcf', alt: 'Caminha redonda azul de pelúcia, tamanho pequeno' },
];

export default function Shop() {
  return (
    <section id="petshop" className={styles.shop} aria-labelledby="shop-title">
      <ShopCarousel products={products}>
        <SplitText as="h2" id="shop-title" className={`display ${styles.title}`}>
          Petshop: o que eles amam, a gente tem
        </SplitText>
      </ShopCarousel>
    </section>
  );
}
