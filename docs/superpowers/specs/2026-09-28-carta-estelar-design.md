# Carta Estelar — Documento de Design

**Data:** 28 de setembro de 2026
**Decisões:** Julia, escolhendo entre quatro direções desenhadas (Carta
Estelar, Arquivo de Bordo, Revista Pulp, Console de Bordo) e depois pergunta a
pergunta
**Situação:** design aprovado, pronto para virar plano de implementação

O site troca de roupa inteira: cor, letra e composição. O motivo é um só — o
visual cansou —, e a autora deixou tudo mudar, com uma condição: o laranja fica.
A direção escolhida é a **Carta Estelar**: o site como um mapa do céu, com a
Polaris no centro. É a única das quatro que nasce do nome do site, e o laranja
vira a própria estrela, a mesma do ícone da aba.

Nada de conteúdo muda. Os endereços das páginas, a busca, o gerador por dentro,
o acervo e o ícone da aba ficam como estão.

**Volta garantida.** O site de antes está marcado pela etiqueta
`antes-da-carta-estelar` no GitHub, pedido da autora "para o caso de eu não
gostar". O trabalho corre na branch `carta-estelar` e só chega a `main` depois
da aprovação com o site rodando.

---

## 1. Cores

### Tema escuro (o padrão)

| Papel | Hoje | Carta Estelar | Contraste sobre o fundo |
|---|---|---|---|
| `--fundo` | `#0b0b0e` + aurora | `#0a1020`, azul-noite liso | — |
| `--texto-forte` | `#ffffff` | `#f2f5fa` | 17,35:1 |
| `--texto` | `#d5d5df` | `#d3dbe8` | 13,60:1 |
| `--apagado` | `#8e8e9c` | `#8390a8` | 5,88:1 |
| `--destaque` | `--ouro` `#ffc300` | laranja-estrela `#f06c30` | 6,22:1 |
| `--apoio` | `--violeta` `#b07cff` | azul-estrela `#9db4e0` | 9,06:1 |

O laranja é o do ícone (240, 108, 48). O azul-estrela foi escolha da autora
entre três caminhos (azul-estrela, só laranja, manter o violeta): é a cor das
linhas do mapa e o par escuro do azul-tinta que o tema claro já usa.

`--ouro` e `--violeta` deixam de existir. A origem dos dois papéis passa a ser o
próprio valor, sem token de cor nomeada no meio — a regra "cor por papel, nunca
por nome" continua, só perde a camada que hoje só existia para ser a origem.

Botão principal e etiqueta levam a letra em `--fundo` sobre o laranja: 6,22:1.

### Tema claro

| Papel | Hoje | Carta Estelar | Contraste |
|---|---|---|---|
| `--fundo` | `#f5f7f9` | `#f1f3f7`, papel de carta | — |
| `--texto-forte` | `#14181f` | `#121a2b` | 15,64:1 |
| `--texto` | `#2f3540` | igual | 11,09:1 |
| `--apagado` | `#5b6472` | `#56627a` | 5,52:1 |
| `--destaque` | `#b34700` | igual | 4,95:1 |
| `--apoio` | `#1b2a4a` | igual | 12,80:1 |

O laranja-tijolo e o azul-tinta ficam: combinam com a carta e já estavam
verificados. O fundo esfria um pouco para ler como papel de carta náutica. O
laranja cai de 5,12 para 4,95:1 com o fundo novo e continua acima dos 4,5.

### Superfícies

- `--bloco` (premissa e prompt do gerador): no escuro, `#111a30`, um azul-noite
  um pouco mais claro que o fundo — texto a 12,41:1, laranja a 5,68:1. No
  claro, `#e6eaf1` — laranja a **4,56:1**, o valor mais justo do site. Escurecer
  esse bloco reprova as peças sorteadas.
- `--flutuante` e `--painel` continuam com a mesma receita (apoio misturado ao
  fundo), recalculados sobre as cores novas.
- `--grade`, novo: a cor dos anéis e raios do mapa. `#243150` no escuro,
  `#c6cedc` no claro. É decoração, não texto: não precisa de contraste mínimo.

### A aurora sai de vez

Escolha da autora entre três caminhos (virar cor da estrela, sumir, ficar mais
fraca): **nenhuma cor por subgênero**. O subgênero se reconhece pelo nome e, na
home, pela posição no mapa. Saem:

- o componente `Aurora.astro`, `src/lib/aurora.ts` e o teste dele;
- o campo `aurora` do esquema de subgênero e dos dez arquivos de subgênero;
- a prop `aurora` de `Base.astro` e das páginas que a passam;
- a regra "`completo: true` exige `aurora`" no esquema e no teste.

Com a aurora some também o motivo de metade das contas de
`docs/verificacao-visual.md` (o "céu" como pilha de três camadas). O documento
é reescrito para o fundo liso.

## 2. Letras

| Papel | Letra | Onde |
|---|---|---|
| Títulos | **Fraunces** (serifa variável, com itálico) | título da página, título de seção, nome do verbete, epígrafe |
| Texto | **IBM Plex Sans** | texto corrido, botões, links da barra |
| Rótulos | **IBM Plex Mono** | coordenadas, numeração "01 / 11", nome POLARIS na barra, linha de rótulo acima dos títulos, cadeados e rótulos do gerador |

Hoje o site usa a letra do sistema (Segoe UI no Windows). As três entram pela
API de fontes do próprio Astro (`fonts` no `astro.config.ts`, componente
`<Font />` no `<head>`), que baixa os arquivos **no build** e os publica junto
do site. O navegador de quem visita não fala com o Google — a restrição "sem
dependência de runtime no cliente" continua de pé.

Os títulos deixam o estilo de pôster de hoje (peso 900, caixa alta, entrelinha
0,95) e passam a Fraunces em peso médio, caixa normal.

## 3. O laranja fica mais contido

Hoje o `h1` de toda página sai em `--destaque`. Na Carta Estelar **o `h1` passa
a `--texto-forte`**, e o laranja sobe para uma **linha de rótulo** acima dele,
em Plex Mono e caixa alta: "SPACE OPERA · 11 ARQUÉTIPOS". Na home, uma palavra
do título vai em itálico laranja ("Arquétipos da *ficção científica*").

O laranja fica, portanto, em: estrela e rótulos do mapa aceso, linha de rótulo,
numeração dos verbetes, botão principal, etiqueta do felino, peças sorteadas da
premissa, cadeado travado. Nada mais.

Isso muda uma regra do CLAUDE.md ("`--destaque` é o título da página") e a nota
de contraste do `h1`, que deixa de depender de ser texto grande.

## 4. Página por página

### Barra do topo (todas as páginas)

Mesma estrutura, mesmos links, mesmo "Mais" e mesma busca. Muda:

- À esquerda, o capacete (o ícone da aba, nas versões clara e escura, trocadas
  pela classe de tema como as ilustrações) e POLARIS em Plex Mono espaçado.
- Links em Plex Sans.
- **A página aberta** deixa de ser pintada com `--flutuante` e ganha um traço de
  2px em `--apoio` embaixo do nome. O estado continua no `aria-current="page"`.
  Dentro do painel do "Mais" vale o mesmo traço.

### Home

1. **Abertura em duas colunas.** À esquerda: as coordenadas reais da Polaris em
   laranja (`AR 02h 31m 49s · DEC +89° 15′ 51″`), o título com a palavra final
   em itálico laranja, o `subtitulo` e o botão "Gerar uma premissa". À direita:
   o mapa.
2. **O mapa** (SVG desenhado no build): a Polaris no centro, como a estrela de
   quatro pontas do ícone, com o rótulo "α UMi · Polaris"; três anéis e quatro
   raios de grade; os dez subgêneros como estrelas em volta, ligados por uma
   rota. Cada estrela e seu nome são **um link** para `/subgeneros/<id>/`. Ao
   passar o mouse ou focar pelo teclado, a estrela e o nome acendem em laranja.
   A posição de cada subgênero sai da `ordem`, em volta do centro, alternando
   dois raios — subgênero novo entra no mapa sem ninguém desenhar nada.
3. **O mapa substitui a fileira de subgêneros** da home. No celular (até 640px)
   os nomes não cabem legíveis dentro do mapa: ele fica só com as estrelas, sem
   rótulos, e a fileira de pílulas volta logo abaixo dele. As estrelas continuam
   links (com o nome do subgênero em `aria-label`), porque continuam tocáveis. O botão "Escolher um subgênero" que recolhe a fileira sai:
   no celular ela aparece aberta.
4. **Os três caminhos** (Arquétipos, Cenários, Elementos Narrativos) continuam,
   deixam de ser cartões com moldura laranja e viram três colunas separadas por
   linhas finas, título em Fraunces. No celular, uma embaixo da outra.
5. **Apresentação e "Como usar"**, o corpo de `home.md`, sem mudança de texto.
6. **Chamada do gerador**: o título e a `chamadaGerador`, sem cartão, com o
   botão principal.
7. **Citação** em Fraunces itálico.

### Catálogos (`/arquetipos/<sub>/`, `/cenarios/<sub>/`, `/elementos/<sub>/`)

- Linha de rótulo em laranja ("SPACE OPERA · 11 ARQUÉTIPOS"), `h1` em Fraunces
  `--texto-forte`, parágrafo de abertura.
- **Verbetes em lista de uma coluna** (escolha da autora contra a grade de três
  colunas). Cada verbete: numeração "01 / 11" em Plex Mono laranja, nome em
  Fraunces, texto; **linha fina** `--borda-suave` separando um verbete do
  próximo. A barra lateral em `--apoio` sai.
- O felino continua fechando a lista, com etiqueta e desenho ao lado. Os
  desenhos de tema escuro são traço claro sobre transparente e funcionam no
  azul-noite sem regerar nada.
- A epígrafe (só em `/arquetipos/<sub>/`) em Fraunces itálico, com o filete
  lateral em `--destaque` como hoje.
- A fileira "Trocar de subgênero" fica no fim: pílulas contornadas em
  `--apoio`, a aberta preenchida. No claro continua a regra invertida de hoje.

A numeração conta a posição na lista da página (1 a N), não o campo `ordem`:
os dois coincidem hoje, mas a lista é o que a pessoa vê.

### Índices (`/arquetipos/`, `/cenarios/`, `/elementos/`)

Mesmo tratamento de cabeçalho (rótulo + `h1` + abertura), fileira de subgêneros
com as pílulas novas, "Como usar esta página" depois dela.

### Páginas de subgênero (`/subgeneros/<sub>/`)

Mesmo tratamento dos catálogos: rótulo, `h1`, texto do subgênero, e as três
seções com os três primeiros de cada tipo e o "Ver todos". **Sem mapa**, por
escolha da autora (o mapa fica só na home).

### Gerador

Estrutura igual: seletor de subgênero, premissa em quatro linhas com os
cadeados, botões, prompt para IA, link para o guia. Muda a roupa: premissa sobre
o `--bloco` novo, peças sorteadas em laranja, rótulos e seletor em Plex Mono,
premissa em Plex Sans num corpo maior.

### Sobre, Estilos, Guia de personagens, 404, busca

Herdam cores e letras; recebem a linha de rótulo acima do `h1` onde houver
`h1`. Nenhuma mudança de estrutura. A lista de resultados da busca e o painel do
"Mais" continuam opacos (`--flutuante`) ou com o véu de `--painel`, como hoje.

## 5. O que não muda

Conteúdo, endereços, a busca e seu índice, o gerador por dentro (`src/lib/gerador/`),
o ícone da aba, a troca de tema pelo botão, `prefers-reduced-motion`, a coluna
de 1280px e o `--recuo`, a barra fixa com seus 96px de `scroll-margin-top`, a
escada de `z-index`.

## 6. Testes e verificação

- Os testes de esquema perdem os casos da aurora e ganham um que confirma que
  um subgênero `completo: true` sem `aurora` passa.
- A posição das estrelas no mapa sai de uma função pura em `src/lib/` (ordem →
  coordenadas), com teste: dez posições distintas, todas dentro da caixa do
  desenho, a Polaris no centro.
- `npx vitest run`, `npm run check` e `npm run build` passam.
- `docs/verificacao-visual.md` refeito para o fundo liso, com as medições da
  seção 1.
- Aprovação da autora com `npm run dev` no ar, página por página, antes de
  qualquer coisa chegar a `main`.

## 7. Documentação que envelhece junto

O CLAUDE.md fala da aurora em vários lugares (restrições, `Base`, `aurora.ts`,
esquema de subgênero, contraste do `h1`, `--destaque` no título da página,
barra lateral dos verbetes, `--flutuante` marcando a página na barra). Todos são
atualizados no mesmo trabalho. Os documentos antigos de `docs/superpowers/` não
mudam: são registro do que valia na época.
