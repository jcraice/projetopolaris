# Verificação visual — contraste, movimento e tela estreita

Registro da Task 14. Refazer esta medição sempre que mudar `--painel`,
a opacidade da aurora ou o trio de cores de algum mundo.

## Como o contraste foi medido

O fundo atrás de um texto não é uma cor chapada — é uma pilha de três camadas:

| Camada | Onde | Composição |
|---|---|---|
| fundo da página | `body` | `--tinta` `#0b0b0e`, opaco |
| aurora | `.aurora` | gradiente cônico do mundo, `opacity: 0.36` sobre a tinta |
| painel | `.cartao`, `.nav`, `.pilar` | `--painel` `rgba(11, 11, 14, 0.8)` sobre a aurora |

Daí saem as duas superfícies que importam:

```
céu    = 0,36 × cor_da_aurora + 0,64 × tinta
painel = 0,80 × tinta          + 0,20 × céu
```

O `blur(58px)` e o `backdrop-filter` não mudam a cor média, só a espalham —
podem ser ignorados na conta. A razão de contraste é a fórmula WCAG 2.1
(luminância relativa linearizada, `(L1 + 0,05) / (L2 + 0,05)`).

**Pior caso por mundo.** Cada trio de aurora vira três faixas de 120° que giram
em 90 segundos, então toda região da tela passa por baixo de todas as três
cores. A medição usa sempre a cor mais clara do trio: é o instante mais
desfavorável, e ele acontece de verdade em todas as páginas.

Mínimos exigidos: **4,5:1** para corpo de texto, **3:1** para texto grande e
elementos de interface.

## Contraste sobre o painel

É onde vive quase todo o texto do site — cartões, navegação, pilares da home.

| Mundo | Pior cor | `--texto` | `--ouro` | `--violeta` | `--apagado` |
|---|---|---|---|---|---|
| Cyberpunk | `#00e5ff` | 12,14 | 11,00 | 6,04 | 5,47 |
| Distopia | `#ffb03a` | 12,21 | 11,06 | 6,07 | 5,50 |
| Invasão Alienígena | `#a6ff6e` | 11,84 | 10,73 | 5,90 | 5,34 |
| Pós Apocalíptico | `#6ee7a0` | 12,06 | 10,93 | 6,00 | 5,44 |
| Space Opera | `#ffc300` | 12,12 | 10,98 | 6,03 | 5,46 |
| Viagem no Tempo | `#ffd66e` | 11,95 | 10,83 | 5,95 | 5,39 |

**Todas as combinações passam com folga em todos os seis mundos** — a menor é
5,34:1, contra o mínimo de 4,5:1. O painel não precisou ser escurecido: o alfa
segue em 0,8.

> **Atualização depois da medição.** As molduras douradas saíram do site por
> decisão editorial — primeiro dos verbetes do catálogo, depois das três cartas
> do gerador. Nos dois casos o painel saiu junto, e o texto passou a ficar
> direto sobre o céu. Restam sobre painel apenas a navegação e os pilares da
> home. A tabela acima vale para esses dois; para todo o resto, use a próxima.

## Contraste direto sobre o céu

Fora dos painéis — os verbetes do catálogo, os parágrafos de abertura, os
títulos, o sumário dos mundos, o rodapé — o texto encosta no céu, que é bem
mais claro que o painel. Foi aqui que a medição encontrou problema.

| Mundo | `--texto` antes (0,42) | `--texto` agora (0,36) | `--papel` | `--ouro` | `--apagado` | `--violeta` |
|---|---|---|---|---|---|---|
| Cyberpunk | 4,53 | **5,46** | 7,95 | 4,94 | 2,46 | 2,72 |
| Distopia | 4,99 | **5,92** | 8,63 | 5,37 | 2,67 | 2,95 |
| Invasão Alienígena | **3,85** ✗ | **4,71** | 6,86 | 4,27 | 2,12 | 2,34 |
| Pós Apocalíptico | 4,49 ✗ | **5,40** | 7,87 | 4,89 | 2,44 | 2,69 |
| Space Opera | 4,62 | **5,54** | 8,07 | 5,02 | 2,50 | 2,76 |
| Viagem no Tempo | **4,18** ✗ | **5,07** | 7,39 | 4,59 | 2,29 | 2,52 |

### Correção aplicada: aurora de 0,42 para 0,36

Com a aurora em 0,42, o corpo de texto sobre o céu ficava abaixo de 4,5:1 em
três dos seis mundos. O remédio previsto pelo plano é escurecer o fundo, nunca
mexer no dourado e no violeta, que são fixos por decisão de projeto — então a
opacidade da aurora em [`src/components/Aurora.astro`](../src/components/Aurora.astro)
caiu para **0,36**. É o valor mais alto que ainda deixa o pior mundo passar
(4,71:1). Acima de 0,37 o Invasão Alienígena volta a reprovar.

### Pendência: `--apagado` e links violeta fora do painel

Estes dois **continuam reprovados** e a correção não cabia nesta task, porque
muda o desenho e não só um número:

- `--apagado` sobre o céu: 2,12 a 2,67 — usado no rodapé
  ([Base.astro](../src/layouts/Base.astro)), no `blockquote cite`
  ([global.css](../src/styles/global.css)), no "Ver todos →" das páginas de
  mundo e na legenda e no aviso do gerador.
- `--violeta` como cor de link sobre o céu: 2,34 a 2,95 — abaixo até do mínimo
  de 3:1 para elementos grandes.
- `--ouro` sobre o céu, **só no mundo Invasão Alienígena**: 4,27, contra 4,5
  exigidos. Nos outros cinco mundos fica entre 4,59 e 5,37, e dentro do painel
  passa em todos (10,7+). Atinge os estados `:hover` de texto pequeno fora do
  painel — `.lista-subgeneros a`, `.ver-tudo` e `.sumario a` — e, desde que os
  verbetes saíram do painel, também a linha de autor dos livros (`.autor`, 0,8
  rem), que é conteúdo permanente e não estado de interação.

O corpo dos verbetes passa sobre o céu em todos os mundos — 4,71 a 5,92 para
`--texto` — e o mesmo vale para os nomes das peças sorteadas no gerador, que
usam `--papel` (6,86 a 8,63). A barra lateral violeta do `.corpo` fica entre
2,34 e 2,95, mas é divisória decorativa, não elemento de interface com
significado próprio.

**Títulos dos verbetes em dourado.** Passaram a `var(--ouro)` para distinguir um
verbete do outro sem moldura, o que os coloca naqueles mesmos 4,27 do pior
mundo. Por isso foram de 1.1rem para **1.2rem**: a partir de 18,66px em negrito
o WCAG trata o texto como grande e o mínimo cai para 3:1, que o dourado cumpre
em todos os seis mundos. Encolher esses títulos de volta reprova o contraste.

**Cadeado do gerador.** Usa `--texto` no estado destravado (4,71 no pior mundo)
e `--ouro` no travado (4,27) — os dois acima dos 3:1 que o WCAG 1.4.11 pede de
elemento de interface. `--apagado` foi descartado justamente por ficar em 2,12.

Nenhum ajuste de opacidade resolve: para `--apagado` passar em 4,5:1 sobre o
céu, a aurora teria que cair para 0,135, o que apaga a identidade visual do
site. As saídas reais são dar fundo de painel a esses trechos (rodapé, legenda,
aviso), ou trocar o papel da cor nesses lugares específicos. **Decisão de
desenho, da autora.**

## Tema claro

Acrescentado depois, contra a decisão original de tema escuro único, a pedido
da autora. Vale por atributo `data-tema="claro"` na raiz do documento, escrito
por um script embutido no `<head>` antes da primeira pintura. Sem JavaScript o
site fica escuro, que era o único tema até então.

**Não há céu aqui**: a aurora é removida por completo (`display: none`) e o
fundo é liso. Por isso a medição não depende de mundo nenhum — é um par de
números só, igual nas seis páginas de mundo.

| Papel | Valor | Sobre o fundo `#faf8f5` | Sobre o painel (navegação, pilares) |
|---|---|---|---|
| `--texto-forte` | `#16151c` | 17,11 | 15,47 |
| `--texto` | `#34313f` | 11,95 | 10,81 |
| `--apagado` | `#605d6d` | 6,03 | 5,46 |
| `--ouro` | `#8a6300` | 5,13 | 4,64 |
| `--violeta` | `#6b21a8` | 8,23 | 7,44 |

A etiqueta dourada e o botão principal invertem o par — âmbar de fundo com o
texto na cor do fundo da página — e dão os mesmos 5,13:1.

**Os dois acentos mudam de valor aqui, e isso é deliberado.** No escuro eles são
fixos por decisão de projeto, mas os mesmos `#ffc300` e `#b07cff` sobre fundo
claro dão 1,6:1 e 2,6:1 — ilegíveis. Escurecem mantendo o matiz: o dourado vira
âmbar, o violeta vira roxo.

**Tudo passa, inclusive o que reprova no escuro.** As três pendências da seção
anterior — `--apagado`, links violeta e o dourado de texto pequeno — deixam de
existir no tema claro, onde o pior número da tabela inteira é 4,64:1. A
pendência continua valendo só para o tema escuro.

## Movimento reduzido

Três animações existem no site, e as três têm guarda `prefers-reduced-motion`.
Confirmado no CSS gerado por `npm run build`:

| Animação | Arquivo | Regra sob `prefers-reduced-motion: reduce` |
|---|---|---|
| giro da aurora, 90s | `Aurora.astro` | `.aurora { animation: none }` |
| surgir da lista de busca | `Busca.astro` | `.busca__lista { animation: none }` |
| transição de cor do cadeado | `gerador.astro` | `.cadeado { transition: none }` |
| transição de cor do botão de tema | `Nav.astro` | `.tema { transition: none }` |

Como a aurora vive no layout `Base.astro`, a guarda vale para todas as 39
páginas. Falta só a confirmação visual com "reduzir movimento" ligado no
sistema.

## Tela estreita (360px)

Verificado por leitura do CSS; falta a confirmação visual no navegador.

- Nenhum contêiner tem largura fixa. Os três `min-width` do site cabem em
  360px descontada a margem de 20px de cada lado: busca 180px, `.pilar` 220px,
  `.busca` no máximo 320px.
- Todos os agrupamentos horizontais — navegação, links, pilares, sumário,
  ações do gerador — usam `flex-wrap: wrap`.
- As cartas do gerador já são uma coluna em qualquer largura
  (`.pilha-cartas` é `flex-direction: column`, decisão de projeto), então
  empilham por construção, não por media query.
- `html` e `body` têm `overflow-x: hidden`, que impede a rolagem horizontal
  mesmo se algo vazar.

## Verificação final

Rodado em 29 de julho de 2026, tudo passando:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 71 testes, 8 arquivos |
| `npm run check` | 0 erros, 0 avisos, 0 hints |
| `npm run build` | 39 páginas |
| `cd scripts && python -m pytest` | 107 testes |
