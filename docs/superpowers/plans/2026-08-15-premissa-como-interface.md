# A premissa como interface — Plano de Implementação

**Goal:** Fazer a premissa ser a interface do gerador — peças sorteadas em `--destaque`, quatro cadeados inline, e a pilha de cartas apagada.

**Architecture:** Uma função nova `partes()` em `redacao.ts` devolve a premissa dividida em linhas e trechos, cada trecho sabendo se veio do sorteio e cada linha sabendo qual trava lhe corresponde. `redigir()` passa a ser a junção dessas partes, então o texto continua existindo num lugar só (o `MOLDE`). A página constrói a estrutura uma vez e a cada rolagem só reescreve o texto dos trechos sorteados.

**Spec:** [docs/superpowers/specs/2026-08-15-premissa-como-interface-design.md](../specs/2026-08-15-premissa-como-interface-design.md)

## Global Constraints

- Sem framework de interface; sem dependências de runtime no cliente.
- **Nenhuma cor literal** — só tokens. Nenhum token, tamanho de fonte ou opacidade da aurora muda.
- Tudo em português do Brasil, inclusive mensagens de commit (imperativo).
- Nada fora de `src/lib/gerador/` importa arquivo interno da pasta.
- `Math.random()` nunca dentro de `src/lib/`.
- Nenhum arquivo de `src/content/` é tocado.
- `npx vitest run`, `npm run check` e `npm run build` verdes antes de cada commit.

---

## Task 1 — O fato passa a travar

**Files:** `src/lib/gerador/tipos.ts`, `src/lib/gerador/sorteio.ts`, `src/lib/gerador/sorteio.test.ts`

- [ ] Teste: `sortear` preserva o fato quando `travas.fato` está ligada.
- [ ] Teste: as quatro travas juntas preservam as quatro peças.
- [ ] Teste: com o fato solto, ele continua não repetindo o anterior.
- [ ] Rodar, ver falhar.
- [ ] `Travas` ganha `fato: boolean`.
- [ ] Em `sortear`, o fato passa por trava antes do filtro de não-repetição.
- [ ] Ajustar os testes existentes que montam `Travas` com três chaves.
- [ ] Rodar, ver passar. Commit.

## Task 2 — `partes()`

**Files:** `src/lib/gerador/moldes.ts`, `src/lib/gerador/redacao.ts`, `src/lib/gerador/redacao.test.ts`, `src/lib/gerador/dados.test.ts`, `src/lib/gerador/index.ts`

- [ ] Testes de `partes`: uma linha por linha do molde (inclusive vazias); marca como sorteado só mundo/profissões/traços/local/fato; trava certa por linha e `null` na do mundo; local já contraído num trecho só; lança em marcador desconhecido.
- [ ] Teste em `dados.test.ts`: `TRAVA_DO_MARCADOR` cobre os quatro traváveis e não inclui `{mundo}`.
- [ ] **Teste-âncora:** `redigir` devolve exatamente a mesma string de hoje (o caso "monta o bloco inteiro" que já existe passa sem mudança).
- [ ] Rodar, ver falhar.
- [ ] `TRAVA_DO_MARCADOR` em `moldes.ts`, ao lado do `MOLDE`.
- [ ] `Trecho`, `Linha` e `partes()` em `redacao.ts`; `redigir()` vira junção.
- [ ] Exportar em `index.ts`.
- [ ] Rodar, ver passar. Commit.

## Task 3 — A página

**Files:** `src/pages/gerador.astro`

- [ ] Apagar a `<section id="cartas">`, o array `CARTAS`, e todo o CSS de `.pilha-cartas`, `.carta`, `.carta__topo`, `.carta__papel`, `.carta__nome`, `.carta__traco`.
- [ ] Mover os SVGs do cadeado para um `<template id="modelo-cadeado">`, com a área tocável em 28px e o ícone em 16px.
- [ ] "Gerar" passa a ficar logo abaixo da premissa, seguido de "Copiar premissa".
- [ ] Script: `montarPremissa()` constrói spans e botões uma vez a partir de `partes()`; `pintar()` só reescreve o texto dos sorteados e o `aria-pressed`.
- [ ] "Copiar premissa" copia `redigir()`.
- [ ] `.sorteado { color: var(--destaque); }` — sem cor literal.
- [ ] Portões verdes. Commit.

## Task 4 — Documentação

**Files:** `CLAUDE.md`, `docs/atributos-do-gerador.md`

- [ ] Trocar a descrição das três cartas pela premissa-interface e os quatro cadeados.
- [ ] Corrigir "o fato não trava" nos dois documentos.
- [ ] Registrar `partes()` e por que ela existe.
- [ ] Portões verdes. Commit.

## Verificação final

`npx vitest run && npm run check && npm run build`, depois conferência no navegador nos dois temas: cartas sumidas, amarelo nos trechos certos, quatro cadeados nas linhas certas e nenhum na do mundo, travar as quatro e gerar não muda nada, copiar traz as quebras de linha.
