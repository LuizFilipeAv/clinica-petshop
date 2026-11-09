# Convenções do projeto (leia antes de criar um componente)

Projeto: site conceitual da **Bigode**, uma clínica veterinária & petshop fictícia (São Paulo). É uma peça de portfólio: precisa ser bonito, reativo e **leve**.
Stack: Astro 5 (saída estática), CSS escopado em `<style>` dentro de cada `.astro`, TypeScript. Sem frameworks de UI e sem Tailwind.

## Arquivos que você NÃO edita
`src/styles/global.css`, `src/scripts/motion.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `package.json`. Crie apenas os componentes pedidos em `src/components/`. Não faça commit nem rode `npm install`, `astro dev` ou `astro build`. Quem integra e verifica é o orquestrador.

## Tokens (CSS custom properties, já globais)
- Cores: `--blue #0E359D` (marca), `--blue-deep`, `--blue-soft`, `--coral #FF606A` (destaque/CTA), `--coral-deep`, `--coral-soft`, `--white`, `--paper #f4f5f8`, `--stone`, `--ink #0b1433` (texto), `--ink-soft`.
- Fontes: `--font-display` (Big Shoulders Display 900, sempre MAIÚSCULAS, para títulos; use a classe `.display`), `--font-body` (Figtree), `--font-logo` (Fredoka, só no logo).
- Escala tipográfica: `--step--1` até `--step-4`. Display no máximo `--step-4`.
- Espaço: `--gutter`, `--section` (padding vertical de seção), `--radius-s/m/l`, `--max`. Use `.container` para a largura.
- Motion: `--ease-out` (expo, para entradas), `--ease-back` (overshoot leve, para micro-interações), `--ease-in-out`, `--dur-fast 180ms`, `--dur 320ms`, `--dur-slow 700ms`.
- Sombras: `--shadow-soft`, `--shadow-lift`.
- Botões: `.btn` (coral), `.btn--blue`, `.btn--ghost`. Para seta: `<span class="btn__arrow"><svg viewBox="0 0 10 10"><path d="M0 5.6h7.6L4.1 9.1 5 10l5-5-5-5-.9.9 3.5 3.5H0z" fill="currentColor"/></svg></span>`.

## Motion: use atributos, não escreva JS de animação
O `motion.ts` global já trata estes atributos:
- `data-reveal="up|fade|scale|clip"`: entrada única quando o elemento entra na tela. `clip` serve para imagens (abre de um retângulo menor).
- `data-stagger` no pai: os filhos com `data-reveal` entram em sequência (o índice vai para `--i`).
- `data-split` num título: as palavras sobem por baixo de uma máscara.
- `data-draw` num `<svg>` (ou `<path>`): traço desenhado à mão que se desenha ao aparecer. O path precisa de `stroke`, `fill="none"` e `stroke-linecap="round"`.
- `data-parallax="0.1"`: drift vertical conforme o scroll. Use pouco, em imagens.
- `data-count="1200"` com `data-suffix="+"` opcional: número que conta.
- `data-magnetic`: botão que segue levemente o ponteiro.
- `data-cursor="Arraste"`: o cursor customizado mostra esse texto no hover.

Só escreva `<script>` se a interação for própria do componente (ex.: carrossel com arraste). Nesse caso:
- use `import { gsap } from 'gsap'` se precisar;
- anime apenas `transform`, `opacity` e `clip-path`;
- use `pointer events` e listeners `passive` quando possível;
- respeite `matchMedia('(prefers-reduced-motion: reduce)')`;
- não crie loops de rAF que rodem para sempre.

Hover e estados em CSS: `transition` com os tokens. Nada de `transition: all`.

## Imagens
Fotos em `src/assets/img/*.webp`. Use sempre o componente otimizado:
```astro
---
import { Picture } from 'astro:assets';
import vet from '../assets/img/about-vet.webp';
---
<Picture src={vet} formats={['avif', 'webp']} widths={[400, 800, 1200]} sizes="(min-width: 900px) 40vw, 90vw" alt="Descrição real em português" loading="lazy" />
```
Todas as fotos estão em P&B com um detalhe colorido. As de serviço têm fundo sólido azul ou coral.

## Regras de design (obrigatórias)
- **Nada de "eyebrow"/kicker** (o rótulo pequeno em cima do título). O título fala sozinho.
- Nada de texto em gradiente, glassmorphism decorativo, `border-left` colorido em cards, sombras duras (`4px 4px 0`), emoji ou caracteres unicode no lugar de ícones. Ícones são SVG desenhados, com traço consistente.
- Evite grade de cards todos iguais (ícone + título + texto). Varie tamanho e ritmo.
- Nada de numeração de seção (01/02/03).
- Contraste: texto ≥ 4.5:1. Texto secundário sobre fundo colorido usa tom derivado da cor (ex.: branco com opacidade sobre azul), nunca cinza.
- Mais espaço acima de um título do que abaixo. Corpo de texto com no máximo 65ch.
- Responsivo de 360px até 1600px, sem scroll horizontal. Mobile first.
- Estados: hover, `:focus-visible` (já global) e `:active`. Alvos de toque ≥ 44px.
- HTML semântico (`section` com `aria-labelledby`, `h2`, listas). `alt` descritivo em português.
- Copy em **português do Brasil**, tom caloroso, leve e confiante, sem clichês de marketing. Dados de contato fictícios.
