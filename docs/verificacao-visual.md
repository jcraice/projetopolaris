# Verificação visual — contraste, movimento e tela estreita

Refeito do zero para a Carta Estelar (28 de setembro de 2026). Até ali o fundo do
tema escuro era uma pilha de três camadas — fundo, aurora girando a 0,36 e
painel — e cada medição usava o pior subgênero. A aurora saiu, e com ela a pilha:
hoje o fundo é liso nos dois temas e cada par de cores tem um número só.

Refazer estas contas sempre que mudar `--fundo`, `--bloco`, `--flutuante`,
`--destaque`, `--apoio`, `--texto`, `--apagado` ou o tamanho de fonte de algum
texto em cor de acento.

## Como o contraste foi medido

Fórmula WCAG 2.1: luminância relativa linearizada, `(L1 + 0,05) / (L2 + 0,05)`.
Mínimos: **4,5:1** para texto comum, **3:1** para texto grande (a partir de
24px, ou 18,66px em negrito) e para elementos de interface.

`--flutuante` é `color-mix` de `--apoio` no fundo (14% no escuro, 8% no claro);
as contas usam a cor resultante, `#1f273b` no escuro e `#e0e3e9` no claro.

## Tema escuro

| Texto | Sobre `--fundo` `#0a1020` | Sobre `--bloco` `#111a30` | Sobre `--flutuante` `#1f273b` |
|---|---|---|---|
| `--texto-forte` `#f2f5fa` | 17,35 | 15,83 | 13,61 |
| `--texto` `#d3dbe8` | 13,60 | 12,41 | 10,67 |
| `--apagado` `#8390a8` | 5,88 | 5,37 | — |
| `--destaque` `#f06c30` | 6,22 | 5,68 | — |
| `--apoio` `#9db4e0` | 9,06 | 8,27 | 7,11 |

Preenchimentos com a letra em `--fundo`: botão principal, etiqueta e peça em
`--destaque` dão **6,22:1**; a pílula do subgênero aberto, em `--apoio`,
**9,06:1**.

## Tema claro

| Texto | Sobre `--fundo` `#f1f3f7` | Sobre `--bloco` `#e6eaf1` | Sobre `--flutuante` `#e0e3e9` |
|---|---|---|---|
| `--texto-forte` `#121a2b` | 15,64 | 14,40 | 13,52 |
| `--texto` `#2f3540` | 11,09 | 10,21 | 9,58 |
| `--apagado` `#56627a` | 5,52 | 5,08 | — |
| `--destaque` `#b34700` | 4,95 | **4,56** | — |
| `--apoio` `#1b2a4a` | 12,80 | 11,79 | — |

Preenchimentos com a letra em `--fundo`: `--destaque` **4,95:1**, `--apoio`
**12,80:1**.

**O valor mais justo do site é o laranja do claro sobre o `--bloco`: 4,56:1.**
São as peças sorteadas dentro da fita do prompt, no gerador, e os nomes de
subgênero do guia de personagens. Clarear `--destaque` no claro, ou escurecer
`--bloco`, reprova os dois. (A premissa deixou de ficar sobre o `--bloco`
quando virou transmissão: hoje ela fica direto sobre o fundo, a 4,95:1.)

## O que ficou sem mínimo

- `--grade` (anéis e raios do mapa) e a rota entre as estrelas são decoração:
  não carregam informação e não precisam de contraste.
- As estrelas do mapa são interface: `--texto-forte` sobre o fundo, 17,35 e
  15,64:1. O nome de cada uma, em `--apagado`, fica em 5,88 e 5,52:1.
- `--borda-suave`, a linha entre verbetes, é separação visual; o que separa
  para quem não enxerga é a marcação (um `<article>` por verbete).

A pendência antiga — `--apagado` e os links violeta direto sobre o céu, entre
2,12 e 2,67:1 — deixou de existir com a aurora.

## Movimento reduzido

Três animações existem no site, e as três têm guarda
`prefers-reduced-motion`:

| Animação | Arquivo | Regra sob `prefers-reduced-motion: reduce` |
|---|---|---|
| surgir da lista de busca | `Busca.astro` | `.busca__lista { animation: none }` |
| surgir do painel "Mais" e giro da seta | `Nav.astro` | `animation: none`, `transition: none` |
| transição de cor do cadeado e do botão de tema | `gerador.astro`, `Nav.astro` | `transition: none` |

O giro de 90 segundos da aurora, que era a maior animação do site, saiu com ela.

## Tela estreita

Conferido em captura de tela a 390px (a home e `/arquetipos/fc-militar/`), além
da leitura do CSS:

- Nada rola de lado. `html` tem `overflow-x: hidden`; o `body` **não** tem, de
  propósito, senão a barra do topo, que é sticky, se fixaria nele e não na tela.
- A abertura da home vira uma coluna abaixo de 640px. O mapa encolhe com a
  tela e perde os nomes das estrelas — ficariam com uns 7px —, e a fileira de
  pílulas aparece embaixo dele. As estrelas continuam links, com o nome no
  `aria-label` e um alvo de toque de 24px de diâmetro.
- Os três caminhos da home viram uma coluna, com a linha fina em cima de cada.
- O menu recolhido tem teto: `.nav__links` expandido é
  `max-height: calc(100dvh - 150px)` com rolagem interna.

## Verificação final

Rodado em 29 de julho de 2026, tudo passando:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 75 testes, 9 arquivos |
| `npm run check` | 44 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 39 páginas |
| `cd scripts && python -m pytest` | 107 testes |

Refeita em 4 de agosto de 2026, depois do 404, das aberturas novas e da troca de
paleta do tema claro:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 84 testes, 10 arquivos |
| `npm run check` | 47 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 40 páginas |

Refeita em 7 de agosto de 2026, depois de os títulos de seção das páginas de
subgênero virarem pastilha preenchida:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 86 testes, 10 arquivos |
| `npm run check` | 47 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 40 páginas |

A pastilha não tem mais nenhuma regra condicionada ao tema: uma declaração só,
`box-shadow: 4px 4px 0 var(--apoio)`, que os tokens resolvem para violeta no
escuro e azul-tinta no claro.

Refeita em 18 de agosto de 2026, depois de os nomes dos subgêneros no guia de
personagens passarem a `--destaque`:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 87 testes, 10 arquivos |
| `npm run check` | 51 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 41 páginas |

Refeita em 28 de setembro de 2026, na Carta Estelar (aurora fora, cores e
letras novas, mapa na home):

| Comando | Resultado |
|---|---|
| `npx vitest run` | 122 testes |
| `npm run check` | 0 erros, 0 avisos, 0 hints |
| `npm run build` | 50 páginas |
