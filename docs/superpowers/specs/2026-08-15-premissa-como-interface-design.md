# A premissa como interface — Documento de Design

**Data:** 15 de agosto de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

Continuação de
[2026-08-14-premissa-de-personagens-design.md](2026-08-14-premissa-de-personagens-design.md),
que trocou a premissa de um protagonista por uma de dois personagens. Este
trabalho mexe só na página: o sorteio e o acervo ficam como estão, com uma
exceção (o fato passa a travar).

---

## 1. O que muda

A pilha de três cartas — "Personagem A", "Personagem B", "Local" — **deixa de
existir**. A premissa passa a ser a própria interface do gerador: o texto mostra
em amarelo o que o sorteio trouxe, e quatro cadeados pequenos, um por linha
travável, tomam o lugar dos três cadeados das cartas.

Motivo da autora: o gerador precisa ser **fluido**. Ler a mesma informação duas
vezes — uma na carta, outra na frase — quebra a leitura, e a frase é a forma
melhor.

A página fica com dois blocos: a premissa e "Crie enredos com sua IA favorita".

## 2. A premissa na tela

```
Essa é uma ficção científica de space opera.

Um(a) Engenheiro(a) Chefe que é muito mais alto(a) que todo mundo ali.  ⌷
Um(a) Caçador(a) de Recompensas Espacial que é rancoroso(a).            ⌷

Tudo começa numa frota nômade.                                          ⌷

Importante: um dos dois é o único que sabe voltar.                      ⌷
```

**Em amarelo (`--destaque`), tudo o que varia de uma premissa para a outra:**

| Linha | Trechos em amarelo |
|---|---|
| mundo | o nome do mundo (`space opera`, ou `space opera + distopia` misturando) |
| personagem A | a profissão e a característica física |
| personagem B | a profissão e a personalidade |
| local | o local já contraído com a preposição (`numa frota nômade`) |
| fato | o fato inteiro |

O texto fixo do molde — `Essa é uma ficção científica de`, `Um(a)`, `que`,
`que é`, `Tudo começa`, `Importante:` e a pontuação — fica na cor do texto.

**O amarelo é `--destaque`, sem cor literal**, como manda o projeto. Sobre o
fundo do bloco ele dá 6,78:1 no pior mundo escuro e 4,59:1 no claro — acima dos
4,5:1 que texto comum exige, e é a mesma medida que
[verificacao-visual.md](../../verificacao-visual.md) já registra para o rótulo
das cartas. **Nenhuma conta é refeita e nenhum token muda.** Como 4,59 passa com
folga pequena, o `--destaque` do tema claro continua sem poder clarear.

## 3. Os cadeados

**Quatro, um por linha travável**, no fim da linha. A linha do mundo é a única
sem cadeado: quem manda nela é o seletor de Mundo, no alto da página.

| Linha | Trava |
|---|---|
| mundo | — |
| personagem A | `personagemA` |
| personagem B | `personagemB` |
| local | `local` |
| fato | `fato` ← **novo** |

**O fato passa a travar.** Era a única peça sem cadeado, de propósito, para que
travar tudo e clicar em "Gerar" continuasse trocando alguma coisa. Com um
cadeado por linha, deixá-lo de fora faria a última linha parecer esquecimento em
vez de decisão — a autora escolheu a coerência. A regra de **não repetir o fato
da rodada anterior continua valendo quando ele está solto**; travado, ele fica
parado como as outras peças.

**São menores e mais discretos que os das cartas:** ícone de 16px numa área
tocável de 28px — acima dos 24px que o WCAG 2.2 AA exige, abaixo dos 36px que as
cartas usavam. Cor `--texto` em repouso (elemento de interface precisa de 3:1) e
`--destaque` quando travado, como hoje.

O par de ícones aberto/fechado continua no HTML, com o CSS trocando um pelo
outro a partir do `aria-pressed` — **o estado mora num lugar só**, e o que a tela
mostra não tem como divergir do que o leitor de tela anuncia.

## 4. A ordem da página

```
Opções do sorteio  (Mundo, Misturar mundos — como estão)

┌─ Premissa ────────────────────────────────────┐
│  Essa é uma ficção científica de space opera. │
│                                               │
│  Um(a) Engenheiro(a) Chefe que ...        ⌷   │
│  Um(a) Caçador(a) de Recompensas ...      ⌷   │
│                                               │
│  Tudo começa numa frota nômade.           ⌷   │
│                                               │
│  Importante: um dos dois ...              ⌷   │
└───────────────────────────────────────────────┘
                    [Gerar]
              [Copiar premissa]

┌─ Crie enredos com sua IA favorita ────────────┐
│  Você é um roteirista de ficção científica... │
└───────────────────────────────────────────────┘
               [Copiar prompt]
```

"Gerar" vira o botão principal logo abaixo da premissa, no lugar onde ficava
depois das cartas. O bloco do prompt e o "Copiar prompt" não mudam.

## 5. `partes()`, a irmã de `redigir()`

A página precisa saber **onde cada peça começa e termina** para pintá-la. Hoje
`redigir()` devolve o texto pronto e não há como recuperar essa informação de uma
string.

Entra uma função nova em [redacao.ts](../../../src/lib/gerador/redacao.ts):

```ts
export type Trecho = { texto: string; sorteado: boolean };
export type Linha = { trechos: Trecho[]; trava: keyof Travas | null };

export function partes(sorteio: Sorteio, molde: string, mundo: string): Linha[];
```

- Uma `Linha` por linha do molde, **inclusive as vazias** (`trechos: []`), para
  que a premissa copiada tenha as mesmas quebras que a da tela.
- `trava` sai de uma tabela que liga marcador a trava, em
  [moldes.ts](../../../src/lib/gerador/moldes.ts) junto do molde:
  `{profissaoA}` → `personagemA`, `{profissaoB}` → `personagemB`,
  `{em:local}` → `local`, `{fato}` → `fato`. `{mundo}` não está na tabela, e por
  isso aquela linha não ganha cadeado.

**`redigir()` passa a ser a junção de `partes()`** — os trechos de cada linha
concatenados, as linhas unidas por `\n`. O texto continua existindo num lugar só,
o molde, e o que se copia é exatamente o que está na tela. A assinatura de
`redigir` não muda, e os testes que ela já tem continuam valendo.

**O molde não muda de forma:** continua a mesma string com os mesmos sete
marcadores. O que entra é a tabela de travas ao lado dele.

## 6. Como a página monta isso

**A estrutura é construída uma vez, no carregamento**, a partir de `partes()`:
para cada trecho um `<span>` (com `class="sorteado"` quando for), para cada linha
com trava um `<button class="cadeado">`. A cada "Gerar", só o **texto** dos spans
sorteados é reescrito.

Não é otimização: é o que preserva o foco do teclado de quem está navegando pelos
cadeados e evita religar ouvinte de evento a cada rolagem. O molde é fixo, então
a estrutura é estável — só os valores mudam.

O contêiner continua com `white-space: pre-wrap`, que é o que faz as quebras de
linha do molde aparecerem. Os cadeados são `inline-flex` dentro do texto.

**"Copiar premissa" copia `redigir()`**, não o `textContent` do contêiner — os
botões não contribuem com texto, mas depender disso seria frágil.

## 7. O que não muda

- O sorteio, tirando a trava nova do fato.
- O acervo em `src/content/` e as quatro listas de `src/lib/gerador/`.
- O prompt de IA, o `montarPrompt`, o `nomearMundos`.
- O guia de personagens e o link para ele.
- Nenhum token de cor, tamanho de fonte ou opacidade da aurora.
- O seletor de Mundo e a caixa "Misturar mundos".

## 8. Fora de escopo

- **Travar o mundo.** O seletor já faz isso.
- **Cadeado por peça** (profissão e traço separados) — considerado e recusado
  pela autora: seis ícones dentro do texto corrido picotam a leitura.
- **Editar uma peça à mão.** O gerador sorteia; o cadeado é o único controle.
- **Guardar o sorteio no navegador.** O gerador é efêmero por decisão de projeto.

## 9. Verificação

Testes novos em [redacao.test.ts](../../../src/lib/gerador/redacao.test.ts):

- `partes` devolve uma linha por linha do molde, com as vazias no lugar certo.
- `partes` marca como sorteado exatamente o mundo, as duas profissões, os dois
  traços, o local contraído e o fato — e nada do texto fixo.
- `partes` põe a trava certa em cada linha, e **`null` na linha do mundo**.
- `partes` devolve o local já contraído (`numa frota nômade`) num trecho só.
- **`redigir` continua devolvendo exatamente a mesma string de hoje** — é o teste
  que garante que trocar a implementação por cima de `partes` não mudou o texto.

Em [sorteio.test.ts](../../../src/lib/gerador/sorteio.test.ts):

- `sortear` preserva o fato quando `travas.fato` está ligada.
- `sortear` continua não repetindo o fato anterior quando ele está solto.
- As quatro travas juntas preservam as quatro peças.

Em [dados.test.ts](../../../src/lib/gerador/dados.test.ts):

- A tabela de travas cobre os quatro marcadores traváveis e não inclui
  `{mundo}`.

`npx vitest run`, `npm run check` e `npm run build` precisam passar.

No navegador: a pilha de cartas sumiu; os trechos amarelos são exatamente os da
tabela da seção 2; os quatro cadeados aparecem no fim das linhas certas e a do
mundo não tem nenhum; travar as quatro e clicar em "Gerar" não muda nada; travar
três e gerar muda só a solta; "Copiar premissa" traz o texto com as quebras de
linha; e tudo legível nos dois temas.

## 10. Documentação que envelhece junto

- [CLAUDE.md](../../../CLAUDE.md) — a seção do gerador descreve as três cartas e
  a regra de o fato nunca travar. As duas mudam.
- [docs/atributos-do-gerador.md](../../atributos-do-gerador.md) — as regras do
  sorteio incluem "o fato não trava". Muda.
