# Limite de largura em telas grandes — Documento de Design

**Data:** 30 de julho de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. O problema

Nenhum elemento do site tem limite de largura. O `<main>` de
[Base.astro](../../../src/layouts/Base.astro) recebe só `padding: 24px 20px`, e todo o resto é
fluido: as faixas do topo e do rodapé atravessam a tela, os pilares da home crescem por
`flex: 1 1 220px`, e os verbetes ocupam a largura que houver.

Em tela muito grande o resultado é um layout espalhado. Numa tela de 2560px, POLARIS fica no
canto esquerdo e o botão de tema no direito, com um vão de mais de dois mil pixels no meio; os
três pilares viram faixas largas e baixas; e as linhas dos verbetes correm quase 2500px.

O incômodo relatado é **o layout espalhado**, não o comprimento das linhas. Os dois problemas têm
remédios diferentes e o design ataca só o primeiro — ver a seção 5.

## 2. Decisões tomadas

| Decisão | Escolha |
|---|---|
| Largura da coluna de conteúdo | 1280px |
| Margem lateral mínima | 20px, a de hoje |
| Faixas (topo e rodapé) | Fundo e borda de ponta a ponta; só o conteúdo se alinha à coluna |
| Aurora | Intocada — segue cobrindo a viewport inteira |
| Medida de linha do texto | Sem limite próprio, como já era a escolha da autora |
| Técnica | Token de recuo no `padding-inline`, sem elemento novo no HTML |

## 3. Comportamento

A coluna de conteúdo para de crescer em 1280px e fica centralizada. O recuo lateral é
`max(20px, (100% - 1280px) / 2)`, então ele só passa de 20px quando a tela ultrapassa **1320px**
(1280 + os 40px de margem que já existem hoje).

Consequência que importa: **abaixo de 1320px nada muda**. Os pontos de quebra de 1079px da
navegação ([Nav.astro](../../../src/components/Nav.astro)) e da lista de mundos
([index.astro](../../../src/pages/index.astro)) ficam intactos, e o comportamento em celular e
notebook é idêntico ao atual.

Acima disso:

| Tela | Coluna | Margem de cada lado |
|---|---|---|
| 1320px | 1280px | 20px |
| 1440px | 1280px | 80px |
| 1920px | 1280px | 320px |
| 2560px | 1280px | 640px |

A barra do topo e o rodapé continuam sendo faixas: o fundo de `--painel`, o vidro fosco e as
bordas seguem de borda a borda da tela. O que se move para dentro é o conteúdo — marca, links,
busca, botão de tema, texto do rodapé —, alinhado à mesma coluna do `<main>`. POLARIS fica
exatamente acima do `<h1>` de cada página.

A aurora não entra na conta: `position: fixed; inset: -45%` em
[Aurora.astro](../../../src/components/Aurora.astro) já é geometria de viewport. Ela continua
girando de ponta a ponta, o que é justamente o que sustenta o caráter de pôster quando a coluna
encolhe no meio de uma tela grande.

## 4. Implementação

Dois tokens novos em `:root`, em [global.css](../../../src/styles/global.css), junto dos demais:

```css
--largura-conteudo: 1280px;
--recuo: max(20px, calc((100% - var(--largura-conteudo)) / 2));
```

O `100%` dentro de `--recuo` é resolvido no ponto de uso, não na declaração — o token só vale,
portanto, para filho direto do `<body>`, onde `100%` é a largura da tela. Isso vai comentado no
CSS, porque usar o mesmo token dentro de um contêiner mais estreito daria um recuo silenciosamente
errado.

Três declarações passam a consumi-lo, preservando o espaçamento vertical de cada uma:

| Seletor | Arquivo | Antes | Depois |
|---|---|---|---|
| `.nav` | Nav.astro | `padding: 16px 20px` | `padding: 16px var(--recuo)` |
| `main` | Base.astro | `padding: 24px 20px` | `padding: 24px var(--recuo)` |
| `.rodape` | Base.astro | `padding: 20px` | `padding: 20px var(--recuo)` |

Nenhuma mudança de HTML. O `.nav` mantém `display: flex` com `justify-content: space-between` e
`flex-wrap: wrap` nos quatro filhos diretos que já tem; o recuo maior só aproxima os extremos.

**Alternativa descartada:** embrulhar o conteúdo de cada faixa numa `<div class="coluna">` com
`max-width` e `margin-inline: auto`. Chega no mesmo pixel, mas custa três elementos novos e, no
caso do `.nav`, o embrulho teria que herdar o `display: flex`, o `space-between` e o `flex-wrap`
que hoje pertencem ao `<header>`. A única vantagem real da abordagem — permitir que um filho fure
a coluna e sangre até a borda — não serve a nenhuma página atual.

O comentário de `.abertura` em global.css afirma hoje que "em tela larga as linhas agora ficam bem
mais longas" que os 68ch removidos, sem teto nenhum. Com a coluna existindo, ele é atualizado para
registrar que elas param em torno de 1240px.

## 5. Fora de escopo

**Limite de medida para o texto corrido.** `.abertura` continua com `max-width: none`. A escolha de
o texto acompanhar a largura da página é da autora e está registrada no CSS; este design não a
reverte. O efeito colateral, dito com clareza: a 1280px as linhas passam a caber em cerca de 145
caracteres, contra cerca de 300 numa tela de 2560px. É uma melhora grande e ainda é bem mais largo
que a medida clássica de leitura. Se um teto próprio para o texto for desejado depois, é uma
declaração isolada e reversível — assunto de outra conversa.

**Qualquer ajuste de cor, de tamanho de fonte ou da aurora.** Nada disso é tocado.

## 6. Verificação

`npx vitest run` e `npm run check` continuam sendo o portão do repositório, mas nenhum dos dois
mede CSS — a suíte cobre funções puras e não deve mudar de resultado. A conferência de verdade é
visual, abrindo o site em duas frentes:

- **Provar que nada se moveu:** 375px, 1079px e 1280px devem ficar idênticos ao estado atual,
  incluindo o menu recolhido e a lista de mundos.
- **Ver a coluna:** 1440px, 1920px e 2560px, checando que as faixas do topo e do rodapé seguem
  atravessando a tela, que a marca alinha com o título da página e que a aurora continua cobrindo
  o fundo inteiro.

As contas de [verificacao-visual.md](../../verificacao-visual.md) **não** precisam ser refeitas: a
regra do CLAUDE.md dispara para mudança de cor, de tamanho de fonte ou de opacidade da aurora, e
contraste não depende da largura da coluna.
