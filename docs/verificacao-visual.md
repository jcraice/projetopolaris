# Verificação visual — contraste, movimento e tela estreita

Registro da Task 14, atualizado a cada mudança de cor desde então. Refazer esta
medição sempre que mudar `--painel`, `--bloco`, `--destaque`, `--apoio`, a
opacidade da aurora, o trio de cores de algum mundo ou o tamanho de fonte de
qualquer texto que use cor de acento.

## Como o contraste foi medido

O fundo atrás de um texto não é uma cor chapada — é uma pilha de três camadas:

| Camada | Onde | Composição |
|---|---|---|
| fundo da página | `body` | `--fundo` `#0b0b0e`, opaco |
| aurora | `.aurora` | gradiente cônico do mundo, `opacity: 0.36` sobre o fundo |
| painel | `.cartao`, `.nav`, `.pilar`, `.cta-gerador` | `--painel` `rgba(11, 11, 14, 0.8)` sobre a aurora |

Daí saem as duas superfícies que importam:

```
céu    = 0,36 × cor_da_aurora + 0,64 × fundo
painel = 0,80 × fundo          + 0,20 × céu
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

**Nomes dos tokens.** Dois mudaram depois desta medição, sem mudar de valor, e
as tabelas já usam os nomes de hoje: `--tinta` virou `--fundo`, e `--papel`,
`--texto-forte`. As colunas `--ouro` e `--violeta` continuam com esses nomes
porque tudo daqui até a seção do tema claro mede o tema escuro, onde
`--destaque` é o ouro e `--apoio` é o violeta — em componente, porém, a cor se
pede sempre pelo papel.

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
> decisão editorial — primeiro dos verbetes do catálogo, depois da interface do
> gerador. Nos dois casos o painel saiu junto, e o texto passou a ficar
> direto sobre o céu. Restam sobre painel a navegação, os pilares da home e o
> card do gerador na home. A tabela acima vale para esses três; para todo o
> resto, use a próxima.

**A barra do topo é sticky**, então deixou de ser só a navegação vista sobre a
aurora: o fundo dela agora é o que rola por baixo. O pior caso real é um título
quase branco passando sob o véu de 80%, que compõe para algo perto de
`rgb(60, 60, 62)` — mais claro que o `--fundo` opaco que a tabela acima assume.
Mesmo nesse extremo, `--texto` fica em ~7,5:1 e `--texto-forte` em ~11:1: os
dois continuam passando, mas o pior caso da navegação não é mais o número da
tabela.

## Contraste direto sobre o céu

Fora dos painéis — os verbetes do catálogo, os parágrafos de abertura, os
títulos, o sumário dos mundos, o rodapé — o texto encosta no céu, que é bem
mais claro que o painel. Foi aqui que a medição encontrou problema.

| Mundo | `--texto` antes (0,42) | `--texto` agora (0,36) | `--texto-forte` | `--ouro` | `--apagado` | `--violeta` |
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
  painel — `.lista-subgeneros a`, `.ver-tudo` e `.sumario a`. **Não atinge o
  `h1`**, que é acento mas tem 32px e por isso responde ao mínimo de 3:1.

  **Resolvido para a linha de autor dos livros.** `.autor` (0,8rem) era o único
  conteúdo permanente de texto pequeno em cor de acento, e por isso a reprovação
  mais visível do site — 4,27:1. Quando os títulos de verbete perderam a cor, ele
  virou também o elemento mais aparente do verbete, acima do próprio título do
  livro. A autora aprovou passá-lo a `--texto`: **4,71:1** no pior mundo, e a
  hierarquia volta à ordem. O que o distingue do corpo agora é peso, caixa alta e
  corpo menor, não cor.

  Sobra a pendência só nos estados `:hover`, que são interação e não conteúdo.

O corpo dos verbetes passa sobre o céu em todos os mundos — 4,71 a 5,92 para
`--texto` — e o mesmo vale para os nomes das peças sorteadas no gerador, que
usam `--texto-forte` (6,86 a 8,63). A barra lateral violeta do `.corpo` fica entre
2,34 e 2,95, mas é divisória decorativa, não elemento de interface com
significado próprio.

**Títulos dos verbetes: a cor saiu.** Foram `var(--ouro)` por um tempo, para
distinguir um verbete do outro sem moldura, e chegaram a ser `var(--apoio)` por
um instante. A autora recusou as duas versões — quer o acento em um lugar só — e
eles passaram a herdar `--texto-forte`. Sobre o céu isso dá **6,86 a 8,63:1**,
folga até no critério de texto pequeno, contra os 4,27 do dourado no pior mundo.
O que separa um verbete do próximo é o peso do título e a barra lateral do
`.corpo`, em `--apoio`.

Consequência: os **1.2rem existiam por contraste** e agora não mais. Eram 1.1rem
até o dourado exigir os 18,66px que fazem o WCAG tratar o texto como grande. Em
`--texto-forte` esse piso desapareceu, então o tamanho hoje é escolha de
hierarquia e pode encolher sem reprovar.

**Título da página em `--destaque`.** O `h1` é o único texto de acento que restou
fora dos preenchimentos. Tem 2em, ou 32px, em peso 900 — texto grande, mínimo
3:1 —, e o dourado sobre o céu fica entre **4,27 e 5,37:1**. Passa nos seis
mundos, e em cinco deles passaria até no critério de texto pequeno. Encolher o
`h1` abaixo de 18,66px reprova.

**Títulos de seção das páginas de mundo: pastilha preenchida.** Os quatro `h2` de
[`/mundos/[subgenero]/`](../src/pages/mundos/%5Bsubgenero%5D.astro) — Arquétipos,
Cenários, Elementos Narrativos, Livros — herdavam `--texto-forte` e ficavam
iguais aos títulos dos verbetes logo abaixo, que também são claros: a página
inteira lia como um bloco só. Viraram pastilha preenchida por escolha da autora,
no mesmo par que o `.botao--principal` e a `.etiqueta` já usam — fundo
`--destaque`, letra `--fundo`. Dá **12,22:1** no tema escuro e **5,12:1** no
claro, folga até no critério de texto pequeno. Nenhum dos dois números depende do
mundo: o preenchimento é opaco e tapa o céu, então a tabela por mundo não se
aplica a este elemento.

A sombra deslocada de 4px em `--apoio` põe a segunda cor de acento na peça sem
carregar texto, e por isso não responde a mínimo de contraste.

**Títulos dentro de `.bloco`: texto em `--destaque`, não pastilha.** São dois
lugares, medidos juntos porque a situação é a mesma: os seis `h2` de
[`/guia-de-personagens/`](../src/pages/guia-de-personagens.astro), um por mundo,
e o "Crie enredos com sua IA favorita" do
[gerador](../src/pages/gerador.astro). Os dois ficam dentro de um `.bloco`, onde
o acento mede **6,78:1** no escuro e **4,59:1** no claro — folga até no critério
de texto pequeno, e o `h2` tem 24px. Por isso aqui a cor pôde ir
na letra em vez do preenchimento: o problema que criou a pastilha nas páginas de
mundo era o `h2` claro se confundir com o que vem logo abaixo dele — os títulos
de verbete lá, os sessenta termos do `<dl>` no guia, o texto do prompt no
gerador. O `.bloco` já dá o
contraste que o céu não daria — direto sobre o céu o número cairia para 4,27 no
pior mundo, ainda acima dos 3:1 de texto grande, mas sem esta folga.

**A sombra fica nos dois temas, e isso é exceção à regra do `.botao`.**
[global.css](../src/styles/global.css) tira a sombra deslocada dos botões no tema
claro, por ela ser recurso de pôster que brilha sobre o céu escuro e pesa sobre
fundo claro. A primeira versão desta pastilha seguia a mesma regra; a autora
pediu para manter a sombra também no claro, para a peça ter a mesma forma nos
dois temas. Não há conflito visual porque a página de mundo não renderiza nenhum
`.botao` — não existe sombra ausente ao lado desta para destoar. Como a cor vem
por papel, no claro ela sai azul-tinta `#1b2a4a` em vez de violeta.

**O que foi medido e recusado aqui.** A proposta inicial era letra `--apoio`
sobre preenchimento `--destaque` — "roxo com fundo amarelo". Reprova nos dois
temas: **1,82:1** no escuro e **2,59:1** no claro, contra os 3:1 de texto grande.
O motivo é estrutural e vale para qualquer par dos dois acentos: no tema escuro
os dois foram escolhidos para brilhar sobre o mesmo céu, então são as duas cores
mais claras da paleta e não se separam uma da outra; no claro, 2,59:1 é
exatamente o número que este documento já registrava como a distância entre os
acentos. Também foi medido `--fundo` sobre `--apoio` (**6,71:1** no escuro e
**13,24:1** no claro): passa, mas gasta o papel da barra lateral dos verbetes que
vêm logo abaixo, e os dois passariam a competir.

**Consequência estrutural.** O "Ver todos →" saiu de dentro do `<h2>` e virou
irmão dele, dentro de um `.titulo-linha`. Dentro da pastilha ele ficaria em
`--apagado` sobre `--destaque`: **2,01:1** no escuro e **1,09:1** no claro, e é
texto pequeno — a mesma reprovação do roxo-sobre-amarelo, em pior grau. Fora
dela ele continua sobre o céu, com os mesmos 2,12 a 2,67 da pendência registrada
acima; a mudança não melhora nem piora esse número.

**Cadeado do gerador.** Usa `--texto` no estado destravado (4,71 no pior mundo)
e `--destaque` no travado (4,27) — os dois acima dos 3:1 que o WCAG 1.4.11 pede
de elemento de interface. `--apagado` foi descartado por ficar em 2,12.

**Onde `--bloco` é usado.** No gerador, nas peças sorteadas e na dica de enredo;
no catálogo, envolvendo os verbetes de `/arquetipos/`, `/cenarios/` e
`/elementos/` por subgênero. Nesses lugares o texto não fica mais direto sobre
o céu, e as razões da tabela acima sobem. Ficaram de fora, ainda sobre o céu:
`/livros/` e as páginas de mundo, que reúnem os quatro tipos. A primeira
tentativa foi o acento puro a 8% por cima, e ela **reprovava**: `--apoio` é mais
claro que o céu, então clareava o fundo e derrubava o corpo de texto para
4,45:1. O valor em uso é o acento misturado a 20% no fundo da página e aplicado
a 45% — escurece em vez de clarear, e o texto sobe de 4,71 para **6,90**, o
destaque para **6,78** e o apagado de 2,12 para 3,38.

Esses números se aplicam ao `.sorteado`, o texto em `--destaque` dentro da premissa sorteada no gerador. Agora é texto comum (não mais um rótulo pequeno), então os 4,59:1 do tema claro passam dos 4,5:1 exigidos com folga pequena — o que reforça a regra de que o `--destaque` do tema claro não pode clarear.

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
fundo é liso. Por isso a medição não depende de mundo nenhum — é uma tabela só,
igual em todas as páginas.

**A paleta é outra, não o escuro clareado.** A primeira tentativa escureceu
dourado e violeta para caberem em fundo claro; a autora recusou o par e
escolheu, entre três propostas, um destaque ciano profundo com apoio azul-tinta.
Dourado e violeta ficaram só no tema escuro.

**O ciano depois caiu.** Vendo as duas cores em uso, a autora recusou ter dois
tons frios — "muito colorido, quero uma cor que salta aos olhos apenas" — e
trocou o `--destaque` por um laranja-tijolo. O apoio azul-tinta ficou.

| Papel | Valor | Sobre o fundo `#f5f7f9` | Sobre o painel (lista da busca) | Sobre `--bloco` |
|---|---|---|---|---|
| `--texto-forte` | `#14181f` | 16,57 | 15,00 | 14,84 |
| `--texto` | `#2f3540` | 11,47 | 10,39 | 10,28 |
| `--apagado` | `#5b6472` | 5,57 | 5,04 | 4,99 |
| `--destaque` | `#b34700` laranja-tijolo | 5,12 | 4,64 | 4,59 |
| `--apoio` | `#1b2a4a` azul-tinta | 13,24 | 11,99 | 11,86 |

**Por que este laranja, e não um vivo.** `--destaque` é usado como preenchimento
com a letra na cor do fundo — botão principal, etiqueta, pilares —, e isso exige
4,5:1. Os candidatos medidos:

| Laranja | Sobre o fundo claro | Serve de preenchimento | Separação do ciano |
|---|---|---|---|
| `#ff7a00` vivo | 2,43 | ✗ | 2,27 |
| `#d35400` médio | 3,88 | ✗ | 1,42 |
| `#b34700` tijolo | **5,12** | ✓ | 1,08 |
| `#8f3a00` escuro | 7,05 | ✓ | 1,28 |

A última coluna é o que decidiu qual azul ficaria: qualquer laranja utilizável
tem quase a mesma claridade do ciano — 1,08:1 no caso do escolhido —, então os
dois competiriam onde se encostassem. Contra o azul-tinta o laranja separa
**2,59:1**, folga maior que os 2,40:1 dos dois azuis anteriores. Clarear o
`#b34700` reprova o preenchimento.

**A navegação passou para a primeira coluna.** Desde que a barra do topo é fixa
(`position: sticky`), o fundo dela no tema claro é `--fundo` opaco e não
`--painel`: cinco por cento de véu deixariam o texto rolando por baixo aparecer
atrás dos links. Então, no tema claro, a navegação se lê pela coluna "sobre o
fundo `#f5f7f9`". `--painel` não mudou de valor, e a coluna do painel continua
valendo para a lista de resultados da busca, que é o que ainda o usa aqui.

Os botões e os retângulos são preenchidos aqui, e não de contorno como no
escuro, onde o traço brilha sobre o céu e sobre fundo claro ficaria apagado.
Junto com a etiqueta, invertem o par — cor de fundo, texto na cor do fundo da
página:

| Elemento | Preenchimento | Texto | Razão |
|---|---|---|---|
| botão principal, etiqueta, pilares | `--destaque` | `--fundo` | 5,12 |
| botões secundários, retângulos de mundo | `--apoio` | `--fundo` | 13,24 |
| os mesmos, no hover | trocam entre si | `--fundo` | 5,12 / 13,24 |

Sobre `--bloco`, o véu de `--apoio` a 6% que agrupa as peças e a dica de enredo
no gerador, o corpo de texto fica em 10,28:1 e o destaque em 4,59:1 — aqui não
há céu para escurecer, então o bloco só precisa ser sutil.

**Uma regra que este documento descrevia e não existe mais.** Havia aqui a
troca da etiqueta de `--destaque` para `--apoio` dentro de um pilar preenchido,
com a observação de que os dois acentos separavam 2,40:1. Os pilares da home não
contêm etiqueta nenhuma — são um `h2` e um `p` dentro de um link —, e a regra saiu
do CSS. Hoje a etiqueta aparece em três lugares e nenhum é um pilar: o marcador
do arquétipo felino, na interface do gerador e o "Erro 404". Em
todos, ela fica sobre o fundo da página. A separação entre os dois acentos
continua registrada — **2,59:1** com o laranja — porque é útil saber, não porque
algum lugar dependa dela.

**Tudo passa, inclusive o que reprova no escuro.** As três pendências da seção
anterior — `--apagado`, links e o acento em texto pequeno — deixam de existir no
tema claro, onde o pior número da tabela inteira é 4,59:1. A pendência continua
valendo só para o tema escuro.

## Movimento reduzido

Quatro animações existem no site, e as quatro têm guarda
`prefers-reduced-motion`. Confirmado no CSS gerado por `npm run build`:

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
- A premissa sorteada é sempre uma coluna em qualquer largura (texto é
  `display: block`, decisão de projeto), então empilha por construção, não
  por media query.
- `html` tem `overflow-x: hidden`, que impede a rolagem horizontal mesmo se algo
  vazar. O `body` **não** tem, de propósito: com um eixo em hidden ele viraria
  contêiner de rolagem e a barra do topo, que é sticky, se fixaria em relação a
  ele em vez da tela. O hidden do `html` é propagado para a viewport e clipa
  igual.
- O menu aberto tem teto: `.nav__links` no estado expandido é
  `max-height: calc(100dvh - 150px)` com rolagem interna. Sem isso, em celular
  na horizontal (375px de altura) a barra aberta passaria da tela e, sendo
  sticky, deixaria os últimos links inalcançáveis.

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
mundo virarem pastilha preenchida:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 86 testes, 10 arquivos |
| `npm run check` | 47 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 40 páginas |

A pastilha não tem mais nenhuma regra condicionada ao tema: uma declaração só,
`box-shadow: 4px 4px 0 var(--apoio)`, que os tokens resolvem para violeta no
escuro e azul-tinta no claro.

Refeita em 18 de agosto de 2026, depois de os nomes dos mundos no guia de
personagens passarem a `--destaque`:

| Comando | Resultado |
|---|---|
| `npx vitest run` | 87 testes, 10 arquivos |
| `npm run check` | 51 arquivos, 0 erros, 0 avisos, 0 hints |
| `npm run build` | 41 páginas |
