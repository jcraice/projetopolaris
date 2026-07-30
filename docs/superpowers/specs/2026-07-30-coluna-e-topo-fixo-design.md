# Coluna de conteúdo e topo fixo — Documento de Design

**Data:** 30 de julho de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. Os dois problemas

**Largura.** Nenhum elemento do site tem limite. O `<main>` de
[Base.astro](../../../src/layouts/Base.astro) recebe só `padding: 24px 20px`, e todo o resto é
fluido: as faixas do topo e do rodapé atravessam a tela, os pilares da home crescem por
`flex: 1 1 220px`, e os verbetes ocupam a largura que houver. Numa tela de 2560px, POLARIS fica no
canto esquerdo e o botão de tema no direito, com um vão de mais de dois mil pixels no meio; os três
pilares viram faixas largas e baixas; e as linhas dos verbetes correm quase 2500px.

O incômodo relatado é **o layout espalhado**, não o comprimento das linhas. Layout espalhado e
medida de linha longa são problemas distintos, com remédios distintos; deste par, o design resolve
só o layout — a medida de linha fica de fora, e a seção 6 explica por quê.

**Navegação.** A barra do topo rola com a página e desaparece. As páginas de mundo e as de tipo por
subgênero são longas — 21 verbetes numa página de arquétipos —, e voltar para a navegação ou para a
busca exige rolar até o começo.

## 2. Decisões tomadas

| Decisão | Escolha |
|---|---|
| Largura da coluna de conteúdo | 1280px |
| Margem lateral mínima | 20px, a de hoje |
| Faixas (topo e rodapé) | Fundo e borda de ponta a ponta; só o conteúdo se alinha à coluna |
| Medida de linha do texto | Sem limite próprio, como já era a escolha da autora |
| Barra do topo | Fixa por `position: sticky`, em todas as larguras |
| Fundo da barra no escuro | `--painel` como hoje, com o `blur(9px)` — vidro fosco |
| Fundo da barra no claro | `--fundo` opaco, sem `backdrop-filter` |
| Aurora | Intocada — segue cobrindo a viewport inteira |

## 3. A coluna de conteúdo

A coluna para de crescer em 1280px e fica centralizada. O recuo lateral é
`max(20px, (100% - 1280px) / 2)`, então ele só passa de 20px quando a tela ultrapassa **1320px**
(1280 + os 40px de margem que já existem hoje).

Consequência que importa: **abaixo de 1320px nada muda**. Os pontos de quebra de 1079px da
navegação ([Nav.astro](../../../src/components/Nav.astro)) e da lista de mundos
([index.astro](../../../src/pages/index.astro)) ficam intactos.

| Tela | Coluna | Margem de cada lado |
|---|---|---|
| 1320px | 1280px | 20px |
| 1440px | 1280px | 80px |
| 1920px | 1280px | 320px |
| 2560px | 1280px | 640px |

A barra do topo e o rodapé continuam sendo faixas: fundo, vidro fosco e bordas seguem de borda a
borda da tela. O que se move para dentro é o conteúdo — marca, links, busca, botão de tema, texto
do rodapé —, alinhado à mesma coluna do `<main>`. POLARIS fica exatamente acima do `<h1>`.

A aurora não entra na conta: `position: fixed; inset: -45%` em
[Aurora.astro](../../../src/components/Aurora.astro) já é geometria de viewport. Ela continua
girando de ponta a ponta, o que sustenta o caráter de pôster quando a coluna encolhe no meio de uma
tela grande.

### Implementação

Dois tokens novos em `:root`, em [global.css](../../../src/styles/global.css):

```css
--largura-conteudo: 1280px;
--recuo: max(20px, calc((100% - var(--largura-conteudo)) / 2));
```

O `100%` dentro de `--recuo` é resolvido no ponto de uso, não na declaração — o token só vale,
portanto, para filho direto do `<body>`, onde `100%` é a largura da tela. Isso vai comentado no
CSS, porque usar o mesmo token dentro de um contêiner mais estreito daria um recuo silenciosamente
errado.

| Seletor | Arquivo | Antes | Depois |
|---|---|---|---|
| `.nav` | Nav.astro | `padding: 16px 20px` | `padding: 16px var(--recuo)` |
| `main` | Base.astro | `padding: 24px 20px` | `padding: 24px var(--recuo)` |
| `.rodape` | Base.astro | `padding: 20px` | `padding: 20px var(--recuo)` |

Nenhuma mudança de HTML. O `.nav` mantém o `display: flex` com `justify-content: space-between` e
`flex-wrap: wrap` nos quatro filhos diretos que já tem; o recuo maior só aproxima os extremos.

**Alternativa descartada:** embrulhar o conteúdo de cada faixa numa `<div class="coluna">` com
`max-width` e `margin-inline: auto`. Chega no mesmo pixel, mas custa três elementos novos e, no
caso do `.nav`, o embrulho teria que herdar o `display: flex`, o `space-between` e o `flex-wrap`
que hoje pertencem ao `<header>`. A única vantagem real da abordagem — permitir que um filho fure a
coluna e sangre até a borda — não serve a nenhuma página atual.

O comentário de `.abertura` em global.css afirma hoje que "em tela larga as linhas agora ficam bem
mais longas" que os 68ch removidos, sem teto nenhum. Com a coluna existindo, ele é atualizado para
registrar que elas param em torno de 1240px.

## 4. O topo fixo

`position: sticky; top: 0` no `.nav`, em todas as larguras. Sticky e não `fixed` de propósito: o
elemento continua ocupando espaço no fluxo, então nenhuma página precisa de espaçador nem de
`padding-top` calculado — o que importa porque a altura da barra muda quando ela quebra em linha em
tela estreita.

Cinco coisas no código de hoje precisam ceder para isso funcionar.

### 4.1 `overflow-x: hidden` no `body` — o obstáculo real

[global.css](../../../src/styles/global.css) põe `overflow-x: hidden` no `html` **e** no `body`.
Com um eixo em `hidden`, o `body` passa a ser contêiner de rolagem próprio (o outro eixo computa
para `auto`), e um filho sticky se fixa em relação ao contêiner de rolagem mais próximo — o `body`,
que não é o que rola. Resultado esperado: a barra sobe embora, exatamente o que não queremos.

A correção é tirar `overflow-x: hidden` do `body` e deixar só no `html`. A declaração provavelmente
existe por causa da aurora, que é `inset: -45%` e transborda de propósito, então a implementação
**precisa confirmar no navegador** que nenhuma barra de rolagem horizontal volta, nos dois temas e
em tela estreita.

Este é o único ponto do trabalho com risco de precisar de plano B. O plano B é `position: fixed` com
espaço reservado no `<main>`, e ele é bem pior: a altura da barra varia com a quebra de linha, então
o espaço reservado teria que ser recalculado por media query e passaria a divergir sozinho. Só
recorrer a ele se a rolagem horizontal se mostrar impossível de evitar de outro jeito.

### 4.2 Empilhamento

O `.nav` recebe `z-index: 10`. Sem isso, descendentes posicionados dentro do `<main>` — o `.cadeado`
do gerador é `position: absolute` — pintam depois da barra na ordem do documento e apareceriam por
cima dela.

O `z-index: 10` cria contexto de empilhamento no `.nav`, e a lista da busca (`.busca__lista`,
`z-index: 20`) continua funcionando dentro dele, acima de todo o conteúdo do `main`.

### 4.3 O fundo da barra no tema claro

No escuro, `--painel` é `rgba(11, 11, 14, 0.8)` — 80% opaco, mais o `blur(9px)`. Barra fixa com esse
fundo lê como vidro fosco, que é o efeito pretendido: o conteúdo que passa por baixo vira borrão de
propósito. **Fica como está.**

No claro, `--painel` é `rgba(20, 24, 31, 0.05)`. Cinco por cento não segura nada: o texto rolando
por baixo apareceria através da barra, atrás dos links. No tema claro a barra passa a usar
`var(--fundo)` opaco (`#f5f7f9`) e perde o `backdrop-filter`, que não tem mais o que borrar — e cujo
custo de composição a cada quadro de rolagem deixa de ser pago, na mesma linha da decisão que já
removeu a aurora inteira do tema claro.

Sobre contraste: `--painel` **não** muda de valor, então o gatilho registrado em
[verificacao-visual.md](../../verificacao-visual.md) ("refazer sempre que mudar `--painel`") não é
acionado. O que muda é qual superfície a navegação usa no tema claro, e a tabela do tema claro
naquele documento já mede as duas — tem a coluna "sobre o fundo `#f5f7f9`" ao lado de "sobre o
painel (navegação)", com `--texto-forte` em 16,57. **Nenhuma conta nova**: entra uma nota dizendo
que a navegação no claro passou a ler pela primeira coluna.

### 4.4 As âncoras que aterrissam atrás da barra

Os verbetes já estão prontos: `scroll-margin-top: 96px` em
[Cartao.astro](../../../src/components/Cartao.astro). A barra recolhida tem cerca de 68px, então a
folga já existe — é o que a busca usa quando salta para um verbete.

O sumário dos mundos não está pronto. Ele salta para `#arquetipos`, `#cenarios`, `#elementos` e
`#livros`, que são `<section>` sem `scroll-margin-top` em
[mundos/[subgenero].astro](../../../src/pages/mundos/[subgenero].astro). Hoje o `<h2>` para no topo
da tela; com a barra fixa, para atrás dela. Entram os mesmos 96px, nas quatro seções.

### 4.5 O teto do menu aberto em tela estreita

Recolhida, a barra no celular é marca + hambúrguer + botão de tema, cerca de 68px, e ser fixa não
custa nada. O menu aberto é outro caso: os sete links e a busca vivem dentro do próprio `<header>` e
aparecem por `display`, então quem cresce é a barra — vai a uns 400px em 375px de largura.

Em celular de pé (667px de altura) isso é confortável. Em paisagem (375px de altura) a barra fica
maior que a tela, e um elemento sticky grudado no topo não se move mais: os últimos links passam do
fim da tela e não há como rolar até eles.

O teto vai na lista de links, `.nav__links` no estado expandido:

```css
max-height: calc(100dvh - 150px);
overflow-y: auto;
```

Os 150px são o que fica acima e abaixo dela dentro da barra: 16px de recuo superior, ~36px da
fileira da marca, 12px de intervalo, ~44px da busca, 12px de intervalo e 16px de recuo inferior,
arredondado para cima. O valor exato se confirma no navegador.

O teto vai na lista, e **não** no `<header>`: `.busca__lista` é `position: absolute` dentro da
busca, e `overflow-y` no `<header>` cortaria os resultados da busca em vez de deixá-los sobrepor a
página. Fora do estado expandido a declaração não tem efeito, porque a lista de links é uma fileira
que cabe.

## 5. Ordem de trabalho

A coluna e o topo fixo são independentes, e o topo fixo é o que tem risco. Fazer a coluna primeiro
deixa o repositório num estado bom e publicável mesmo que o topo fixo precise de mais idas e vindas
com o navegador.

## 6. Fora de escopo

**Limite de medida para o texto corrido.** `.abertura` continua com `max-width: none`. A escolha de
o texto acompanhar a largura da página é da autora e está registrada no CSS; este design não a
reverte. O efeito colateral, dito com clareza: a 1280px as linhas passam a caber em cerca de 145
caracteres, contra cerca de 300 numa tela de 2560px. É uma melhora grande e ainda é bem mais largo
que a medida clássica de leitura. Se um teto próprio para o texto for desejado depois, é uma
declaração isolada e reversível — assunto de outra conversa.

**Esconder a barra ao rolar para baixo e trazê-la de volta ao subir.** Pediria JavaScript de
rolagem e uma animação a mais para respeitar em `prefers-reduced-motion`. A barra fica sempre
visível, e ponto.

**Qualquer ajuste de tamanho de fonte, da aurora ou dos valores dos tokens de cor.** Nada disso é
tocado; a única mudança de cor é qual token o `.nav` consome no tema claro.

## 7. Verificação

`npx vitest run` e `npm run check` continuam sendo o portão do repositório, mas nenhum dos dois mede
CSS — a suíte cobre funções puras e não deve mudar de resultado. A conferência de verdade é no
navegador, e tem itens que só existem por causa do topo fixo.

**Provar que nada se moveu:** 375px, 1079px e 1280px idênticos ao estado atual em largura, incluindo
o menu recolhido e a lista de mundos da home.

**A coluna:** 1440px, 1920px e 2560px — faixas do topo e do rodapé atravessando a tela, marca
alinhada com o título da página, aurora cobrindo o fundo inteiro.

**O topo fixo:**

- rolar uma página longa (arquétipos de um subgênero) e ver a barra parada, nos dois temas;
- no tema claro, confirmar que nenhum texto aparece através da barra;
- ausência de barra de rolagem horizontal depois de tirar o `overflow-x` do `body` — nos dois temas,
  em 375px e em 2560px;
- buscar um verbete e conferir que o título não aterrissa atrás da barra;
- clicar nos quatro atalhos do sumário de um mundo e conferir o mesmo;
- abrir o menu em 375×667 e em 667×375 (paisagem), confirmando que todos os sete links são
  alcançáveis;
- abrir a busca com o menu expandido em tela estreita e confirmar que a lista de resultados não é
  cortada;
- o cadeado do gerador não aparece por cima da barra ao rolar.

As contas de contraste de [verificacao-visual.md](../../verificacao-visual.md) não são refeitas:
`--painel`, a opacidade da aurora e os trios de cores dos mundos ficam nos valores atuais. Entra
apenas a nota da seção 4.3.
