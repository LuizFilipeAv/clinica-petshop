# Convenções do projeto: Next.js (branch `front-react`)

O projeto é o site conceitual da **Bigode**, uma clínica veterinária & petshop fictícia (São Paulo), feito como peça de portfólio. Precisa ser bonito, reativo e **leve**.

**Stack:** Next.js 16 (App Router), React 19, TypeScript strict, CSS Modules, GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis. Não usamos Tailwind nem biblioteca de UI.

A versão anterior em Astro está na branch `front-antigo`. Leia o original de uma seção com:
`git show front-antigo:src/components/<Nome>.astro`
Ao portar, mantenha **o mesmo visual, copy, markup semântico e motion**. Só muda a forma (JSX + CSS Module + hooks).

## Arquivos que você NÃO edita
`src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/motion.ts`, `src/components/motion/*`, `package.json`, `next.config.ts`.
Crie **apenas** os componentes pedidos, cada um como `src/components/<Nome>/<Nome>.tsx` + `src/components/<Nome>/<Nome>.module.css`.
Não faça commit e não rode `npm install`, `next dev` ou `next build`. Para checar tipos, pode rodar `npx tsc --noEmit -p .`.

## Server vs client
- O padrão é **Server Component** (sem `'use client'`).
- Use `'use client'` só quando o componente tiver estado, efeitos ou listeners (carrossel, tabs, accordion, ScrollTrigger).
- Se só um pedaço é interativo, extraia esse pedaço num subcomponente client e deixe o resto server.

## Tokens globais (CSS custom properties em `globals.css`)
- **Cores:** `--blue #0E359D`, `--blue-deep`, `--blue-soft`, `--coral #FF606A`, `--coral-deep`, `--coral-soft`, `--white`, `--paper`, `--stone`, `--ink`, `--ink-soft`.
- **Fundos das fotos:** os cards que recebem foto usam `--photo-blue #01258f`, `--photo-coral #fb5860` e `--photo-grey #cfcfcf`, que são as cores exatas do fundo de estúdio das imagens. Assim não aparece emenda.
- **Fontes:** `--font-display` (Big Shoulders 900, use a classe global `display`), `--font-body`, `--font-logo`.
- **Escala:** `--step--1` até `--step-4`, `--gutter`, `--section`, `--radius-s/m/l`, `--max`.
- **Motion:** `--ease-out`, `--ease-back`, `--ease-in-out`, `--dur-fast`, `--dur`, `--dur-slow`. Sombras: `--shadow-soft`, `--shadow-lift`.
- **Classes globais:** `container`, `display`, `visually-hidden`, `btn`, `btn--blue`, `btn--ghost` e `btn__arrow`. Classes globais vão em `className` como string comum, por exemplo `className={`btn ${styles.cta}`}`.

## Motion: atributos declarativos (o runtime global trata)
- `data-reveal="up|fade|scale|clip"`: entrada única quando o elemento aparece na tela.
- `data-stagger` no pai: os filhos com `data-reveal` entram em sequência.
- `data-draw` em `<svg>` ou `<path>`: traço desenhado à mão. O path precisa de `stroke`, `fill="none"` e `strokeLinecap="round"`.
- `data-parallax="0.1"`, `data-count="1200"` (+ `data-suffix="+"`), `data-magnetic` e `data-cursor="Arraste"`.
- **Títulos com palavras subindo:** use `import SplitText from '@/components/motion/SplitText'` e escreva `<SplitText as="h2" id="x" className="display ...">Texto <em>destaque</em></SplitText>`. Não use `data-split` direto.
- O runtime marca o elemento visível com o atributo `data-inview`. **Nunca** remova nem controle esse atributo pelo React.

## GSAP no React
```tsx
'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '@/lib/motion';

const root = useRef<HTMLElement>(null);
useGSAP(() => {
  if (prefersReduced()) return;
  gsap.fromTo('.x', {...}, { scrollTrigger: { trigger: root.current, scrub: true } });
}, { scope: root });
```
- `useGSAP` faz o cleanup automaticamente. Use `scope` e seletores relativos, ou refs.
- Anime só `transform`, `opacity` e `clip-path`.
- Listeners em `useEffect`, sempre com cleanup. Nada de rAF infinito.
- Respeite `prefersReduced()`.

## Imagens
```tsx
import Image from 'next/image';
import vet from '@/assets/img/about-vet.webp';
<Image src={vet} alt="Descrição real em português" sizes="(min-width: 900px) 40vw, 90vw" />
```
- O import estático já fornece largura, altura e blur. O Next gera AVIF/WebP responsivos.
- Use `priority` só no hero.
- Para ocupar o pai, use `fill` com o pai em `position: relative`, ou CSS (`width: 100%; height: auto`).
- Para estilizar o `<img>`, use `className` no `Image`.

## Regras de design (obrigatórias)
- Nada de eyebrow/kicker acima do título, texto em gradiente, glassmorphism decorativo, `border-left` colorido, sombras duras ou emoji/unicode no lugar de ícones. Ícones são SVG.
- Contraste ≥ 4.5:1 em texto. Branco sobre coral **não passa**: use `--ink`, `--blue-deep` ou um coral mais escuro.
- Responsivo de 360 a 1600px, sem scroll horizontal. Alvos de toque ≥ 44px. `:focus-visible` já é global.
- HTML semântico, `alt` em português, copy em pt-BR.
