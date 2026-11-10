import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Marquee from '@/components/Marquee/Marquee';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Clinic from '@/components/Clinic/Clinic';
import Shop from '@/components/Shop/Shop';
import Testimonials from '@/components/Testimonials/Testimonials';
import CtaFinal from '@/components/CtaFinal/CtaFinal';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Clinic />
        <Marquee reverse tone="coral" />
        <Shop />
        <Testimonials />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
