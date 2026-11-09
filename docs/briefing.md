# Briefing — Clínica & Petshop (projeto conceitual)

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--blue` | `#0E359D` | Cor de marca: logo, fundos de seção, tipografia display |
| `--white` | `#FFFFFF` | Fundo base, texto sobre azul |
| `--coral` | `#FF606A` | Destaque: CTAs, ilustrações à mão, mascote, hover |

Fotos: preto e branco (dessaturadas e frias), com **um único detalhe colorido**, como na referência "Meaw": os olhos ou um acessório na cor da marca.

## Análise do site de referência: voldogfood.com

**Stack:** WordPress + Divi + WooCommerce + jQuery + GSAP 3.12 + ScrollTrigger + Lenis (carregado de `@latest`).

**Medido no carregamento (desktop, 1440×900):**
- 127 requisições, ~23 MB transferidos, 50 scripts e 13 CSS
- DOMContentLoaded em ~12 s e load em ~14 s
- Vídeo de fundo do hero em `.webm` com **11 MB**
- Vários rastreadores (GTM, Facebook Pixel, reCAPTCHA, CookieYes)

### O que tem de motion e vale reproduzir

1. **Intro/loader:** o logo aparece pequeno e centralizado, cresce e sobe para o hero. Uma cortina (overlay `scaleX`) faz a transição entre páginas.
2. **Hero com marca gigante:** o wordmark ocupa a largura toda e o animal fica *na frente* das letras. A troca cão/gato muda o fundo, o vídeo e o link.
3. **Hero que encolhe no scroll:** o hero vira um card arredondado, e o logo passa do hero para o header (clip-path abrindo do centro).
4. **Traços desenhados à mão (`draw-path`):** setas e risquinhos SVG se desenham com `stroke-dashoffset` quando entram na tela.
5. **Texto em onda:** uma faixa de texto corre num `textPath` SVG em loop.
6. **Reveal escalonado** de títulos e cards, com cada item entrando ~100 ms depois do anterior.
7. **Cursor que segue o mouse** (com lerp) e vira "drag" em cima de carrosséis.
8. **Carrossel arrastável** com o último item visível desbotado.
9. **Seletor em pílula** com highlight deslizante.

### Por que é lento e como faremos diferente

| Problema na referência | Nossa abordagem |
|---|---|
| Vídeo de 11 MB no hero | Fotos recortadas em AVIF/WebP (<150 KB) animadas com transform e parallax |
| jQuery + Divi + 50 scripts | Vanilla/Astro, JS só onde há interação, GSAP com import modular |
| Lenis `@latest` via CDN | Versão fixa e empacotada, ou scroll nativo + ScrollTrigger |
| `IntersectionObserver` que reinicia a animação toda vez que sai da tela | Reveal único (`once`), com CSS fazendo o trabalho |
| Cursor animando `left/top` | Só `transform: translate3d`, com loop rAF que para quando o cursor está parado |
| Sem `prefers-reduced-motion` em várias partes | Respeitar em todo lugar |

Meta de performance: LCP < 1,5 s, CLS ≈ 0, página inicial < 1 MB e animações só com `transform`/`opacity`/`clip-path`.

---

## Prompts de imagem

**Regras gerais para todas as imagens:**
- **Nenhuma imagem com texto, logo ou marca.** O logo e as letras são feitos em SVG/código.
- Gerar no maior tamanho possível. Eu converto para AVIF/WebP e recorto.
- Salvar em `assets/raw/` com o nome indicado em cada item.
- Os prompts estão em inglês porque os geradores entendem melhor.
- Se o gerador aceitar *negative prompt*, use: `text, letters, watermark, logo, signature, collar tag text, extra limbs, deformed paws, blurry, cartoon, illustration, 3d render`

### 1. Hero: gato (`hero-cat.png`), PRIORIDADE MÁXIMA
Proporção 4:5 (vertical) ou 1:1.

```
Studio photograph of a fluffy white long-haired cat walking calmly straight toward the camera, centered, full body visible from head to paws, eye-level camera, slight low angle. Seamless light grey studio backdrop with a soft floor shadow. The image is almost monochrome: desaturated, cool neutral greys and whites. The ONLY saturated color is the cat's eyes, which are a vivid deep royal blue (#0E359D). Soft diffused high-key lighting, crisp fur detail, shallow depth of field, editorial pet photography, Hasselblad look, generous empty space above the cat's head (top 35% of the frame is empty backdrop).
```

### 2. Hero: cachorro (`hero-dog.png`)
Mesma proporção, luz e enquadramento do gato. É o par para o seletor cão/gato.

```
Studio photograph of a white fluffy Samoyed puppy (or white Bichon-style dog) walking calmly straight toward the camera, centered, full body visible, eye-level camera. Seamless light grey studio backdrop with a soft floor shadow. Almost monochrome: desaturated, cool neutral greys and whites. The ONLY saturated color is a thin coral-red collar (#FF606A) with no tag and no text. Soft diffused high-key lighting, crisp fur detail, editorial pet photography, same framing as a matching cat photo, top 35% of the frame is empty backdrop.
```

> As duas fotos do hero precisam parecer do **mesmo ensaio**: mesmo fundo, mesma luz e o animal do mesmo tamanho no quadro.

### 3. Serviços: 4 retratos (`service-consulta.png`, `service-vacina.png`, `service-banho.png`, `service-hotel.png`)
Proporção 4:5. Fundo sólido, alternando azul e coral, para virar card colorido.

**3a. Consulta**
```
Editorial studio portrait of a calm beagle sitting, looking up, a veterinarian's hand gently holding a stethoscope against its chest (only the gloved hand and forearm visible, no face). Solid seamless royal blue backdrop (#0E359D). Pet desaturated to near black-and-white while the backdrop stays saturated blue. Soft key light, crisp detail, minimal, premium.
```

**3b. Vacinação**
```
Editorial studio portrait of a tabby kitten sitting on a white examination towel, looking curiously at the camera, a small round coral bandage on its shoulder. Solid seamless coral backdrop (#FF606A). Pet desaturated to near black-and-white while the backdrop stays saturated coral. Soft key light, minimal, premium, playful.
```

**3c. Banho & tosa**
```
Editorial studio portrait of a wet, freshly bathed small white poodle wrapped in a white towel like a hood, happy expression, a few soap bubbles floating. Solid seamless royal blue backdrop (#0E359D). Dog desaturated to near black-and-white while the backdrop stays saturated blue. Soft key light, crisp detail, minimal, premium, playful.
```

**3d. Hotel / Daycare**
```
Editorial studio portrait of a golden retriever lying relaxed on a round plush pet bed, head resting on paws, sleepy content expression. Solid seamless coral backdrop (#FF606A). Dog and bed desaturated to near black-and-white while the backdrop stays saturated coral. Soft key light, minimal, premium, cozy.
```

### 4. Sobre / equipe (`about-vet.png`)
Proporção 3:4.

```
Editorial portrait of a friendly veterinarian in her 30s wearing a plain white coat (no logos, no name badge text), smiling and holding a French bulldog in her arms against her chest. Solid seamless royal blue backdrop (#0E359D). People and dog desaturated to black-and-white, backdrop stays saturated blue. Soft studio light, warm genuine expression, waist-up framing, premium magazine style.
```

### 5. Espaço da clínica (`clinic-space.png`)
Proporção 16:9 (seção larga ou fundo do card que encolhe).

```
Interior photograph of a bright, minimal, modern veterinary clinic reception: white walls, light oak wood, rounded furniture, large windows with soft daylight, a few plants, accent details in royal blue (#0E359D) and coral (#FF606A) such as a chair and a cushion. A dog waiting calmly on the floor. No signs, no text, no screens with text. Architectural photography, wide angle, airy, clean.
```

### 6. Depoimentos: 3 avatares de pets (`pet-avatar-1/2/3.png`)
Proporção 1:1. Vão em círculos pequenos.

```
Square close-up portrait of a [1: smiling mixed-breed caramel dog / 2: grey British shorthair cat / 3: dachshund with tilted head], looking at camera, solid seamless light grey backdrop, desaturated near black-and-white, soft studio light, crisp eyes, centered head and shoulders.
```

### 7. CTA final: pet espiando (`cta-peek-dog.png`)
Proporção 3:2. Vai ser recortado e "sobe" da borda inferior da seção com o scroll.

```
Studio photograph of a happy white Jack Russell terrier peeking up from behind a flat horizontal edge at the bottom of the frame, only the head and two front paws resting on the edge visible, ears perked, looking at the camera. Plain flat light grey background, high-key, desaturated near black-and-white, the ONLY color is a tiny coral (#FF606A) tongue tip. Crisp detail, centered.
```

### 8. Petshop: produtos (opcional) (`shop-food.png`, `shop-toy.png`, `shop-bed.png`)
Proporção 1:1, objetos isolados.

```
Product photo of a [plain unbranded matte kraft pet food bag / coral rubber dog chew toy shaped like a bone / round royal blue plush pet bed], isolated, centered, soft shadow, flat light grey background, no text, no label, no logo, minimal premium product photography.
```

---

### Prioridade de geração
1. `hero-cat` e `hero-dog`. Sem eles não começamos.
2. Os 4 `service-*`.
3. `about-vet` e `cta-peek-dog`.
4. `clinic-space`, avatares e produtos (o código pode começar sem eles, com placeholders).

### Gerado em código (não precisa de imagem)
Logo (wordmark com orelhas de gato numa letra, no estilo "Meaw"), traços desenhados à mão, setas, patinhas, faixa de texto em onda, ícones de serviço e o mascote/flor em coral (no estilo da imagem de paleta).
