import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Fredoka, Figtree } from 'next/font/google';
import MotionProvider from '@/components/motion/MotionProvider';
import './globals.css';

const display = Big_Shoulders({ subsets: ['latin'], weight: '900', variable: '--nf-display', display: 'swap' });
const logo = Fredoka({ subsets: ['latin'], weight: '700', variable: '--nf-logo', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--nf-body', display: 'swap' });

const title = 'Bigode — Clínica veterinária & petshop';
const description =
  'Consultas, vacinas, banho & tosa e hotel para cães e gatos. Cuidado de verdade, do primeiro miado ao último latido.';

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: { title, description, locale: 'pt_BR', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#0E359D' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${logo.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* flag JS before paint so reveal start-states never flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(sessionStorage.getItem('bigode-intro'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body>
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        {children}
        <MotionProvider />
      </body>
    </html>
  );
}
