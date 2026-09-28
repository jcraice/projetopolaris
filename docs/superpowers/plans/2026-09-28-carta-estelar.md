# Carta Estelar — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repaginar o site inteiro na direção Carta Estelar — azul-noite, laranja-estrela, azul-estrela, Fraunces/Plex, mapa de subgêneros na home — sem mudar conteúdo, endereços nem o gerador por dentro.

**Architecture:** A troca é quase toda de CSS: tokens novos em `global.css`, letras servidas pela API de fontes do Astro, e o tratamento tipográfico aplicado página a página. As três peças novas de lógica são funções puras com teste (`numeracao`, `contagem`, `posicoesDoMapa`); o mapa é um componente Astro que desenha SVG no build. A aurora sai inteira.

**Tech Stack:** Astro 7.1 (API `fonts` + `<Font />`, provedor Fontsource), TypeScript estrito, Vitest, Python + Pillow só para regerar o capacete.

**Spec:** [docs/superpowers/specs/2026-09-28-carta-estelar-design.md](../specs/2026-09-28-carta-estelar-design.md)

## Global Constraints

- Sem framework de interface; interatividade em TypeScript puro dentro de `<script>`.
- Sem dependência de runtime no cliente: fontes baixadas no build e publicadas junto, nunca `fonts.googleapis.com` no HTML.
- Toda cor vem de token em `:root`; nenhum componente escreve cor literal.
- Cor por papel: `--destaque` (laranja) e `--apoio` (azul); `--ouro` e `--violeta` deixam de existir.
- Tema escuro é o padrão e o único sem JavaScript; claro entra por `data-tema="claro"`.
- Escuro: `--fundo #0a1020`, `--texto-forte #f2f5fa`, `--texto #d3dbe8`, `--apagado #8390a8`, `--destaque #f06c30`, `--apoio #9db4e0`, `--bloco #111a30`, `--grade #243150`.
- Claro: `--fundo #f1f3f7`, `--texto-forte #121a2b`, `--texto #2f3540`, `--apagado #56627a`, `--destaque #b34700`, `--apoio #1b2a4a`, `--bloco #e6eaf1`, `--grade #c6cedc`.
- `prefers-reduced-motion` respeitado.
- Tudo em português do Brasil: identificadores, arquivos, comentários, commits no imperativo.
- Todo link interno passa por `import.meta.env.BASE_URL`.
- `scroll-margin-top: 96px` nos alvos de âncora continua.

## Review Focus

1. **Tema claro depois de trocar pelo botão** — toda peça nova (capacete, mapa, rótulo, numeração, traço da página atual) precisa trocar pela classe `data-tema`, não por `prefers-color-scheme`. Verificado à mão na Task 9 em cada página.
2. **Celular (até 640px)** — o mapa perde os nomes e as pílulas aparecem; nenhuma página rola de lado. Verificado na Task 9.
3. **Navegação só por teclado no mapa** — cada estrela é um link com nome acessível e foco visível. Teste de marcação na Task 5 (todo `<a>` do mapa tem `aria-label`).
4. **Subgênero novo no acervo** — o mapa posiciona qualquer quantidade sem sobrepor e sem sair da caixa. Teste em `mapa.test.ts` com 10 e 12.
5. **Build sem rede para as fontes** — o build baixa as fontes; se falhar, o erro precisa ser claro. Verificado rodando `npm run build` na Task 2.

---

### Task 1: Tirar a aurora

**Files:**
- Delete: `src/components/Aurora.astro`, `src/lib/aurora.ts`, `src/lib/aurora.test.ts`
- Modify: `src/lib/schemas.ts` (campo `aurora`, constante `cor` e o `.refine`)
- Modify: `src/lib/schemas.test.ts` (casos da aurora)
- Modify: os 10 `src/content/subgeneros/*.md` com `completo` verdadeiro (linha `aurora:`)
- Modify: `src/layouts/Base.astro` (import, prop e `<Aurora />`)
- Modify: `src/pages/{arquetipos,cenarios,elementos,subgeneros}/[subgenero].astro` (prop `aurora=`)

**Interfaces:** Produces: `Base` passa a aceitar só `{ titulo: string }`.

- [ ] **Step 1: Reescrever os testes de subgênero**

Em `schemas.test.ts`, trocar os dois primeiros casos e o quarto por:

```ts
  it('aceita subgênero completo sem campo de cor', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3, completo: true });
    expect(r.success).toBe(true);
  });

  it('aceita o pool que não é subgênero completo', () => {
    const r = esquemaSubgenero.safeParse({
      nome: '10 Arquétipos Comuns', ordem: 11, completo: false,
    });
    expect(r.success).toBe(true);
  });

  /* A aurora saiu na Carta Estelar. Com o esquema .strict(), um arquivo que
     ainda traga o campo quebra o build em vez de carregar cor que ninguém lê. */
  it('recusa o campo aurora, que saiu do site', () => {
    const r = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(r.success).toBe(false);
  });
```

Nos demais casos, apagar `aurora: [...]` dos objetos.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/schemas.test.ts`
Expected: FAIL em "aceita subgênero completo sem campo de cor" e "recusa o campo aurora".

- [ ] **Step 3: Tirar do esquema**

Em `schemas.ts`: apagar a linha `aurora: z.tuple(...)`, o `.refine(...)` inteiro e a constante `cor` (fica sem uso). O objeto termina em `.strict();`.

- [ ] **Step 4: Tirar do conteúdo e das páginas**

Run: `sed -i '/^aurora:/d' src/content/subgeneros/*.md`
Em `Base.astro`: apagar `import Aurora`, o campo `aurora` da interface, o `aurora` do destructuring e `<Aurora cores={aurora} />`.
Nas quatro páginas `[subgenero].astro`: apagar ` aurora={subgenero.data.aurora}`.
Apagar `src/components/Aurora.astro`, `src/lib/aurora.ts`, `src/lib/aurora.test.ts`.

- [ ] **Step 5: Verificar**

Run: `npx vitest run && npm run check && npm run build`
Expected: tudo passa; `grep -rn aurora src` só acha comentários, que a Task 8 revisa.

- [ ] **Step 6: Commit** — "Tira a aurora do site"

---

### Task 2: Cores e letras novas

**Files:**
- Modify: `astro.config.ts` (bloco `fonts`)
- Modify: `src/layouts/Base.astro` (`<Font />` no `<head>`)
- Modify: `src/styles/global.css` (tokens, tipografia, classes compartilhadas)

**Interfaces:** Produces: variáveis `--fonte-titulo`, `--fonte-texto`, `--fonte-rotulo`; token `--grade`; classe global `.rotulo`.

- [ ] **Step 1: Declarar as fontes**

```ts
import { defineConfig, fontProviders } from 'astro/config';
// ...
  /* As três letras da Carta Estelar. O Astro baixa os arquivos no build e os
     publica junto do site: o navegador de quem visita não fala com terceiro
     nenhum, o que mantém a regra de nada carregado de fora em runtime. */
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--fonte-titulo',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--fonte-texto',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--fonte-rotulo',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
```

Em `Base.astro`: `import { Font } from 'astro:assets';` e, no `<head>`, depois dos `<link rel="icon">`:

```astro
    <Font cssVariable="--fonte-titulo" preload />
    <Font cssVariable="--fonte-texto" preload />
    <Font cssVariable="--fonte-rotulo" />
```

- [ ] **Step 2: Tokens**

Em `global.css`, bloco `:root`: apagar `--ouro` e `--violeta` e o comentário que os apresenta; pôr os valores escuros de Global Constraints nos papéis (`--destaque: #f06c30; --apoio: #9db4e0;` direto), mais `--grade: #243150;` e `--bloco: #111a30;`. Reescrever o comentário dos papéis dizendo que o laranja é o da estrela do ícone e o azul-estrela o das linhas do mapa. Bloco `:root[data-tema='claro']`: valores claros de Global Constraints, mais `--grade: #c6cedc;` e `--bloco: #e6eaf1;`. Os comentários que citam aurora, céu, dourado ou violeta são reescritos para o fundo liso.

- [ ] **Step 3: Tipografia base**

```css
body {
  /* ... o que já existe ... */
  font-family: var(--fonte-texto);
  line-height: 1.6;
}

/* Fraunces nos títulos, em peso médio e caixa normal. Os títulos eram de
   pôster (900, caixa alta, entrelinha 0,95); a Carta Estelar troca o grito
   pela serifa de atlas. */
h1, h2, h3 {
  color: var(--texto-forte);
  font-family: var(--fonte-titulo);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-wrap: balance;
}

h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); margin-block: 0 16px; }

/* A linha acima do título da página. É ela, e não o h1, que carrega o
   laranja desde a Carta Estelar: 6,22:1 no escuro e 4,95:1 no claro, acima
   dos 4,5 de texto pequeno. */
.rotulo {
  font-family: var(--fonte-rotulo);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--destaque);
  margin-block: 0 12px;
}
```

Apagar a regra `h1 { color: var(--destaque); }` e o comentário dela.

- [ ] **Step 4: Classes compartilhadas**

- `.botao`: `font-family: var(--fonte-texto); font-weight: 600; text-transform: none; border-radius: 3px; box-shadow: none;` — a sombra deslocada de pôster sai nos dois temas; a regra do claro que a tirava fica sem motivo e sai do comentário.
- `.etiqueta`: `font-family: var(--fonte-rotulo); font-weight: 500;`.
- `.lista-subgeneros a`: `font-family: var(--fonte-rotulo); font-weight: 500; font-size: 0.8rem; letter-spacing: 0.04em; border-width: 1px; border-radius: 99px; padding: 6px 14px;`, cor `--texto`, traço `--apoio`. `[aria-current='page']`: `background: var(--apoio); color: var(--fundo);` no escuro (9,06:1). O claro mantém a regra invertida que já existe.
- `blockquote`: `font-family: var(--fonte-titulo); font-size: 1.2rem;` (itálico já existe).
- `.bloco`: `border-radius: 4px;`.

- [ ] **Step 5: Verificar**

Run: `npm run build` e conferir `grep -o "fonts.googleapis" -r dist | wc -l` → `0`, e `ls dist/_astro/fonts | head` com arquivos `.woff2`.
Run: `npx vitest run && npm run check`

- [ ] **Step 6: Commit** — "Troca cores e letras pelas da Carta Estelar"

---

### Task 3: Numeração e contagem

**Files:**
- Modify: `src/lib/texto.ts`
- Test: `src/lib/texto.test.ts`

**Interfaces:** Produces: `numeracao(posicao: number, total: number): string` e `contagem(n: number, singular: string, plural: string): string`.

- [ ] **Step 1: Testes**

```ts
describe('numeracao', () => {
  it('põe zero à esquerda até dois dígitos', () => {
    expect(numeracao(1, 11)).toBe('01 / 11');
    expect(numeracao(11, 11)).toBe('11 / 11');
  });

  it('não corta número de três dígitos', () => {
    expect(numeracao(7, 100)).toBe('07 / 100');
  });
});

describe('contagem', () => {
  it('usa o singular só para um', () => {
    expect(contagem(1, 'arquétipo', 'arquétipos')).toBe('1 arquétipo');
    expect(contagem(11, 'arquétipo', 'arquétipos')).toBe('11 arquétipos');
    expect(contagem(0, 'cenário', 'cenários')).toBe('0 cenários');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/lib/texto.test.ts` → FAIL, funções não existem.

- [ ] **Step 3: Implementar**

```ts
/** "01 / 11": a posição do verbete na lista da página, não o campo `ordem`
 *  — os dois coincidem hoje, mas o que a pessoa vê é a lista. */
export function numeracao(posicao: number, total: number): string {
  return `${String(posicao).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

/** "11 arquétipos", "1 cenário". Só o português do acervo, sem Intl. */
export function contagem(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
```

- [ ] **Step 4: Rodar e ver passar** — `npx vitest run src/lib/texto.test.ts` → PASS.

- [ ] **Step 5: Commit** — "Acrescenta numeração e contagem de verbetes"

---

### Task 4: Verbete e páginas de catálogo

**Files:**
- Modify: `src/components/Cartao.astro`
- Modify: `src/pages/{arquetipos,cenarios,elementos}/[subgenero].astro`
- Modify: `src/pages/{arquetipos,cenarios,elementos}/index.astro`
- Modify: `src/pages/subgeneros/[subgenero].astro`

**Interfaces:** Consumes: `numeracao`, `contagem` (Task 3), `.rotulo` (Task 2). Produces: prop opcional `numero?: string` no `Cartao`.

- [ ] **Step 1: Cartão**

Prop nova `numero?: string`, renderizada antes do marcador: `{numero && <span class="verbete__numero">{numero}</span>}`. Estilo:

```css
  .verbete__numero {
    font-family: var(--fonte-rotulo);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: var(--destaque);
  }

  /* Linha fina entre um verbete e o próximo, no lugar da barra lateral em
     --apoio: na Carta Estelar a lista é de atlas, e a cor fica só no número. */
  .verbete {
    padding-block: 20px;
    margin: 0;
    border-bottom: 1px solid var(--borda-suave);
  }

  .verbete h3 { font-size: 1.35rem; }
```

Tirar `border-left`/`padding-left` de `.corpo` e reescrever os comentários que falam da barra lateral e de `margin-block-end: 32px`.

- [ ] **Step 2: Os três catálogos**

Em cada `[subgenero].astro` de catálogo: trocar `<div class="bloco">` por `<div class="lista-verbetes">` (sem fundo: a lista não é mais caixa), pôr a linha de rótulo antes do `h1` e passar `numero`. Arquétipos:

```astro
  <p class="rotulo">{subgenero.data.nome} · {contagem(fichas.length, 'arquétipo', 'arquétipos')}</p>
  <h1>Arquétipos {subgenero.data.nome}</h1>
  ...
    {comuns.map((f, i) => (
      <Cartao numero={numeracao(i + 1, fichas.length)} titulo={f.data.nome} ...>
    ...
        <Cartao numero={numeracao(fichas.length, fichas.length)} marcador="Arquétipo Felino" ...>
```

Cenários e elementos: `numeracao(i + 1, cenarios.length)` e `contagem(cenarios.length, 'cenário', 'cenários')`; `contagem(elementos.length, 'elemento', 'elementos')`. `.lista-verbetes` vai em `global.css` com `border-top: 1px solid var(--borda-suave);`. A regra `.bloco > :last-child > .verbete:last-child` sai de `global.css` junto do caso do felino que ela atendia.

- [ ] **Step 3: Índices e subgênero**

Índices: `<p class="rotulo">Catálogo · {contagem(subgeneros.length, 'subgênero', 'subgêneros')}</p>` antes do `h1`, usando a lista que a página já monta. `/subgeneros/[subgenero]/`: `<p class="rotulo">Subgênero</p>` antes do `h1`; as três seções usam `.lista-verbetes` em volta dos cartões e `numeracao(i + 1, PREVIA)` não entra aqui — amostra não é lista numerada. O sumário e o "Ver todos →" vão para `--fonte-rotulo`.

- [ ] **Step 4: Verificar**

Run: `npx vitest run && npm run check && npm run build`; `grep -c 'verbete__numero' dist/arquetipos/space-opera/index.html` → `11`.

- [ ] **Step 5: Commit** — "Numera os verbetes e troca a barra lateral por linha fina"

---

### Task 5: Mapa estelar

**Files:**
- Create: `src/lib/mapa.ts`, `src/lib/mapa.test.ts`
- Create: `src/components/MapaEstelar.astro`

**Interfaces:** Produces:

```ts
export interface Estrela { x: number; y: number; rotuloX: number; rotuloY: number; ancora: 'start' | 'middle' | 'end' }
export const LARGURA_MAPA = 440;
export const ALTURA_MAPA = 300;
export const CENTRO = { x: 220, y: 150 };
export function posicoesDoMapa(quantidade: number): Estrela[];
```

`MapaEstelar.astro` recebe `{ subgeneros: { nome: string; href: string }[] }`.

- [ ] **Step 1: Testes**

```ts
import { describe, expect, it } from 'vitest';
import { ALTURA_MAPA, CENTRO, LARGURA_MAPA, posicoesDoMapa } from './mapa';

describe('posicoesDoMapa', () => {
  for (const n of [10, 12]) {
    it(`põe ${n} estrelas distintas dentro da caixa`, () => {
      const estrelas = posicoesDoMapa(n);
      expect(estrelas).toHaveLength(n);
      const chaves = new Set(estrelas.map((e) => `${e.x.toFixed(1)},${e.y.toFixed(1)}`));
      expect(chaves.size).toBe(n);
      for (const e of estrelas) {
        expect(e.x).toBeGreaterThan(0);
        expect(e.x).toBeLessThan(LARGURA_MAPA);
        expect(e.y).toBeGreaterThan(0);
        expect(e.y).toBeLessThan(ALTURA_MAPA);
      }
    });
  }

  it('começa pelo alto, acima da Polaris', () => {
    const [primeira] = posicoesDoMapa(10);
    expect(primeira.x).toBeCloseTo(CENTRO.x);
    expect(primeira.y).toBeLessThan(CENTRO.y);
  });

  it('manda o rótulo para fora do centro', () => {
    for (const e of posicoesDoMapa(10)) {
      if (e.x > CENTRO.x + 10) expect(e.ancora).toBe('start');
      if (e.x < CENTRO.x - 10) expect(e.ancora).toBe('end');
    }
  });
});
```

- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/lib/mapa.test.ts` → FAIL, módulo não existe.

- [ ] **Step 3: Implementar**

```ts
/* Posição de cada subgênero no mapa da home. A ordem do acervo gira em volta
   da Polaris no sentido do relógio, a partir do alto, alternando dois raios
   para que vizinhos não se atropelem. Subgênero novo entra no mapa sem
   ninguém desenhar nada: a função só precisa da quantidade. */
export interface Estrela {
  x: number;
  y: number;
  rotuloX: number;
  rotuloY: number;
  ancora: 'start' | 'middle' | 'end';
}

export const LARGURA_MAPA = 440;
export const ALTURA_MAPA = 300;
export const CENTRO = { x: 220, y: 150 };
const RAIOS = [85, 125] as const;
const FOLGA = 8;

export function posicoesDoMapa(quantidade: number): Estrela[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const angulo = (i / quantidade) * 2 * Math.PI;
    const raio = RAIOS[i % 2];
    const x = CENTRO.x + raio * Math.sin(angulo);
    const y = CENTRO.y - raio * Math.cos(angulo);
    if (x > CENTRO.x + 10) return { x, y, rotuloX: x + FOLGA, rotuloY: y + 3, ancora: 'start' };
    if (x < CENTRO.x - 10) return { x, y, rotuloX: x - FOLGA, rotuloY: y + 3, ancora: 'end' };
    return { x, y, rotuloX: x, rotuloY: y < CENTRO.y ? y - FOLGA - 2 : y + FOLGA + 8, ancora: 'middle' };
  });
}
```

- [ ] **Step 4: Rodar e ver passar** — `npx vitest run src/lib/mapa.test.ts` → PASS.

- [ ] **Step 5: Componente**

`MapaEstelar.astro` desenha, dentro de `<svg viewBox="0 0 440 300" role="group" aria-label="Mapa dos subgêneros">`: três `circle.anel` (r 50, 100, 140) e quatro `line.raio` em volta de `CENTRO`; uma `polyline.rota` passando por todas as estrelas e voltando à primeira; a Polaris como o caminho de quatro pontas `M220 134 L223.2 146.8 L236 150 L223.2 153.2 L220 166 L216.8 153.2 L204 150 L216.8 146.8Z` com o texto "α UMi · Polaris" em (220, 180); e para cada subgênero:

```astro
<a href={s.href} aria-label={s.nome} class="mapa__destino">
  <circle cx={e.x} cy={e.y} r="3" />
  <circle class="mapa__alvo" cx={e.x} cy={e.y} r="12" />
  <text x={e.rotuloX} y={e.rotuloY} text-anchor={e.ancora}>{s.nome}</text>
</a>
```

O círculo `.mapa__alvo` é transparente e existe para o toque no celular ter onde acertar. Estilo, todo por token: anéis e raios em `--grade`, rota em `--apagado` a 0,6, estrela em `--texto-forte`, Polaris em `--destaque`, texto em `--fonte-rotulo` 9,5px `--apagado`. `.mapa__destino:hover` e `:focus-visible` pintam estrela e texto de `--destaque`; `:focus-visible` ganha `outline: 2px solid var(--apoio)`. Abaixo de 640px: `.mapa text:not(.mapa__polaris-rotulo) { display: none; }` e o raio da estrela sobe para 4.

- [ ] **Step 6: Commit** — "Acrescenta o mapa estelar dos subgêneros"

---

### Task 6: Home

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/content/paginas/home.md` só se o título precisar de separação (ver Step 1)

**Interfaces:** Consumes: `MapaEstelar` (Task 5), `.rotulo`, `.lista-subgeneros`.

- [ ] **Step 1: Abertura**

O título de `home.md` é "Projeto Polaris: Arquétipos da Ficção Científica". A página mostra a parte depois dos dois-pontos e põe as duas últimas palavras em itálico laranja, sem tocar no Markdown:

```ts
const [, depois = pagina.data.titulo] = pagina.data.titulo.split(': ');
const palavras = depois.split(' ');
const realce = palavras.slice(-2).join(' ');
const inicio = palavras.slice(0, -2).join(' ');
```

```astro
<div class="abertura-home">
  <div>
    <p class="rotulo">AR 02h 31m 49s · DEC +89° 15′ 51″</p>
    <h1>{inicio} <em>{realce}</em></h1>
    <p class="subtitulo">{pagina.data.subtitulo}</p>
    <a class="botao botao--principal" href={`${raiz}gerador`}>Gerar uma premissa</a>
  </div>
  <MapaEstelar subgeneros={subgeneros.map((m) => ({ nome: m.data.nome, href: `${raiz}subgeneros/${m.id}/` }))} />
</div>
<ul class="lista-subgeneros lista-subgeneros--celular">…as pílulas de hoje…</ul>
```

`h1 em { font-style: italic; color: var(--destaque); }` — texto grande, 6,22 e 4,95:1. `.subtitulo` deixa de ser laranja: `--apagado`, 1.05rem. `.abertura-home` é grade de duas colunas (1fr 1.1fr) acima de 640px e uma coluna abaixo. `.lista-subgeneros--celular` só aparece abaixo de 640px. O botão "Escolher um subgênero", seu CSS e o `<script>` do `ligarExpansivel` saem da home.

- [ ] **Step 2: Resto da página**

Ordem: abertura, os três caminhos, apresentação (`<Content />`), chamada do gerador, citação.
Os caminhos: `.pilares` vira grade de três colunas com `border-top: 1px solid var(--borda-suave)`, cada `.pilar` sem moldura e sem fundo, `border-left: 1px solid var(--borda-suave)` a partir do segundo, `h2` em Fraunces 1.3rem, hover pinta o `h2` de `--destaque`. As regras de tema claro que preenchiam o pilar saem. Abaixo de 640px, uma coluna, e a linha vira `border-top`.
A chamada do gerador: `section.cta-gerador` sem moldura e sem fundo, `h2` + parágrafo + botão principal.

- [ ] **Step 3: Verificar** — `npm run check && npm run build`; `grep -c 'mapa__destino' dist/index.html` → `10`.

- [ ] **Step 4: Commit** — "Refaz a home com o mapa estelar"

---

### Task 7: Barra do topo com o capacete

**Files:**
- Modify: `scripts/gerar-favicon.py` (duas saídas novas)
- Create: `src/assets/capacete-tema-claro.png`, `src/assets/capacete-tema-escuro.png` (gerados)
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Capacete para a barra**

No fim de `main()` em `gerar-favicon.py`, salvar as duas versões em 64px (32px na tela, densidade 2):

```python
    ASSETS = RAIZ / 'src' / 'assets'
    claro.resize((64, 64), Image.LANCZOS).save(ASSETS / 'capacete-tema-claro.png', optimize=True)
    escuro.resize((64, 64), Image.LANCZOS).save(ASSETS / 'capacete-tema-escuro.png', optimize=True)
```

Run: `python scripts/gerar-favicon.py src/assets/favicon/original.png`. Atualizar a docstring com as duas saídas.

- [ ] **Step 2: Marca**

```astro
<a class="nav__marca" href={base}>
  <Image class="nav__capacete nav__capacete--escuro" src={capaceteEscuro} alt="" width={28} height={28} />
  <Image class="nav__capacete nav__capacete--claro" src={capaceteClaro} alt="" width={28} height={28} />
  POLARIS
</a>
```

`.nav__marca`: `display: inline-flex; align-items: center; gap: 10px; font-family: var(--fonte-rotulo); font-weight: 500; font-size: 0.85rem; letter-spacing: 0.2em;`. As duas imagens trocam como as ilustrações: `--escuro` visível por padrão, `:root[data-tema='claro']` inverte. Sem `display` no seletor genérico `.nav__capacete`.

- [ ] **Step 3: Página atual**

`.nav__links a[aria-current='page']` e `.nav__mais-botao--atual`: sem `background`; `box-shadow: inset 0 -2px 0 var(--apoio); color: var(--texto-forte);`. Dentro do painel do "Mais", o mesmo traço. Reescrever o comentário que justificava `--flutuante`. Links e botão "Mais" em `--fonte-texto`, peso 500, sem caixa alta.

- [ ] **Step 4: Ponto de quebra**

Com letra nova a barra muda de largura. Medir no navegador (`npm run dev`, DevTools, largura de `.nav__marca`, `.nav__links`, busca e tema numa linha) e refazer a soma do comentário do `@media (max-width: 919px)`; ajustar o valor se a soma mudar.

- [ ] **Step 5: Verificar** — `npm run check && npm run build`.

- [ ] **Step 6: Commit** — "Põe o capacete na barra e marca a página atual com traço"

---

### Task 8: Gerador e demais páginas

**Files:**
- Modify: `src/pages/gerador.astro`, `src/pages/guia-de-personagens.astro`, `src/pages/sobre.astro`, `src/pages/estilos.astro`, `src/pages/404.astro`
- Modify: `src/components/Busca.astro`, `src/components/TrocarDeSubgenero.astro` (só se herdar mal)

- [ ] **Step 1: Rótulos**

Antes de cada `h1`: gerador `<p class="rotulo">Gerador · premissa em quatro linhas</p>`; guia `<p class="rotulo">Gerador · {contagem(PROFISSOES.length, 'profissão', 'profissões')}</p>`; sobre e estilos `<p class="rotulo">Projeto Polaris</p>`; 404 `<p class="rotulo">Erro 404</p>`.

- [ ] **Step 2: Gerador**

Premissa em `--fonte-texto` 1.2rem sobre `.bloco`; `.premissa :global(.sorteado)` continua em `--destaque`, peso 600; seletor de subgênero, rótulos de campo e botões de cadeado em `--fonte-rotulo`. Conferir que o `white-space: pre-wrap` e o cadeado inline ficam como estão.

- [ ] **Step 3: Varredura de estilo antigo**

Run: `grep -rn "font-weight: 900\|font-weight: 800\|text-transform: uppercase" src/pages src/components`
Cada ocorrência é revista: título vira Fraunces peso 500; rótulo pequeno vira `--fonte-rotulo`; o resto perde a caixa alta.
Run: `grep -rn "aurora\|dourad\|violeta\|--ouro\|--violeta" src` — comentários reescritos, nenhum token.

- [ ] **Step 4: Verificar** — `npx vitest run && npm run check && npm run build`.

- [ ] **Step 5: Commit** — "Veste o gerador e as páginas de texto com a Carta Estelar"

---

### Task 9: Documentação e aprovação

**Files:**
- Modify: `docs/verificacao-visual.md` (reescrito para o fundo liso)
- Modify: `CLAUDE.md`
- Modify: `README.md` só se citar aurora ou cores

- [ ] **Step 1: Verificação visual**

Reescrever `docs/verificacao-visual.md`: sai a pilha de três camadas e o pior caso por subgênero; entra uma tabela por tema com as medições do spec (seção 1), a do `--bloco` e a nota de que o laranja claro sobre o bloco (4,56:1) é o valor mais justo do site. Mantém as seções de movimento e tela estreita, atualizadas (sem aurora girando; mapa sem rótulos até 640px).

- [ ] **Step 2: CLAUDE.md**

Atualizar: restrições (tokens, `--destaque` não é mais título, aurora fora, letras pela API de fontes), comando de regerar o capacete, esquema de subgênero sem `aurora`, `Base` sem prop, o parágrafo do `h1` em destaque, barra lateral dos verbetes → linha fina + numeração, página atual na barra → traço em `--apoio`, a home com o mapa (`mapa.ts` e `MapaEstelar.astro`), `.rotulo` e `.lista-verbetes` na lista de classes compartilhadas.

- [ ] **Step 3: Verificação final**

Run: `npx vitest run && npm run check && npm run build` → tudo passa.
Subir `npm run dev` e percorrer nos dois temas (pelo botão) e em 390px de largura: `/`, `/arquetipos/`, `/arquetipos/space-opera/`, `/arquetipos/comuns/`, `/cenarios/cyberpunk/`, `/subgeneros/biopunk/`, `/gerador/`, `/guia-de-personagens/`, `/sobre/`, `/estilos/`, uma URL inexistente, e a busca abrindo sobre a home. Nenhuma rolagem lateral, capacete e desenhos trocando com o tema, mapa navegável por Tab.

- [ ] **Step 4: Commit** — "Atualiza a documentação para a Carta Estelar"

- [ ] **Step 5: Entregar para aprovação**

Deixar `npm run dev` no ar e montar imagens de tela das páginas principais nos dois temas para a autora (ela não consegue abrir o endereço local). Só levar a `main` e publicar depois do "gostei".
