# Plano — a ficha mínima

Segundo modo do gerador, ao lado do que já existe. O de hoje devolve uma frase
corrida (uma premissa); este devolve uma ficha de quatro linhas (um briefing).
Os dois convivem — decisão da autora, e o de hoje já está pronto e testado.

O molde vem de um esquema que a autora escreveu antes deste site:

```
Essa é uma ficção científica de "tema".

"Personagem A" que "característica física"
"Personagem B" que é "personalidade"

Tudo começa "local".

Importante: "fato".
```

## O que entra nesta versão, e o que fica para depois

**Esta é a versão mínima**: só o que o acervo já sustenta, sem escrever conteúdo
novo. A intenção declarada é ver o formato de pé antes de investir em bancos de
conteúdo que talvez não sejam usados.

| Peça do esquema | Nesta versão | Vem de |
|---|---|---|
| tema | ✓ | `subgeneros` (o nome do mundo, já resolvido por `nomearMundos`) |
| Personagem A e B | ✓ | `arquetipos`, dois, distintos |
| local | ✓ | `cenarios.singular`, contraído com "em" (→ "num laboratório secreto") |
| fato | ✓ | `COMPLICACOES` |
| característica física | ✗ | banco que não existe |
| personalidade | ✗ | banco que não existe |

As duas linhas de personagem saem sem o "que é ...", então ficam só os dois
nomes. É a diferença visível entre esta versão e o esquema original.

**Por que os traços ficaram de fora, e o que vão exigir.** Não é falta de banco,
é concordância: "cego de um olho" precisa de "cega", "egocêntrico" precisa de
"egocêntrica", e "contrabandista" não muda nunca. Este projeto já decidiu como
lidar com isso — `arquetipos.nome` é obrigado a começar com "A " ou "O " para o
gênero ser **declarado** e não deduzido, e `redacao.ts` registra por que cada
tentativa de derivar por sufixo foi descartada. Então, quando os traços vierem,
cada entrada declara as duas formas no frontmatter. Nada de derivar por regra.

Bom notar que reusar arquétipos como personagem já resolve metade disso de graça:
"A Pilota Rebelde" declara o gênero no artigo. Só os traços precisarão das duas
formas.

## Regras do sorteio

Decisões da autora:

- **Mesmo mundo para tudo**, a não ser que "misturar mundos" esteja ligado —
  igual ao gerador de hoje, e é o mesmo `poolsFiltrados` que resolve.
- **Os dois personagens nunca se repetem.**
- A complicação não repete a de antes, nem a família dela, como já acontece hoje.

## Passos

### 1. Tipos

`SorteioFicha` (`personagemA`, `personagemB`, `cenario`, `complicacao`,
`familia`) e `TravasFicha` (`personagemA`, `personagemB`, `cenario`) em
`tipos.ts`. `Opcoes` e `Pools` são reaproveitados sem mudança.

### 2. `sortearFicha`, com teste antes

Em `sorteio.ts`, ao lado de `sortear`. Sorteia A do pool filtrado e B do pool
**menos A**. Casos que o teste precisa cobrir:

- os dois personagens são sempre distintos;
- pool com um só arquétipo lança erro explícito em vez de repetir o personagem;
- trava de A com B solto: B continua diferente de A;
- respeita o filtro de mundo e o de comuns;
- não repete complicação nem família em duas rodadas seguidas.

### 3. `preencher`, e `redigirFicha` em cima dela

`montarPrompt` já troca marcadores em maiúsculas e lança se sobrar um
desconhecido. A ficha precisa do mesmo mecanismo com outros cinco marcadores,
então a substituição sai de `prompt.ts` para um `modelo.ts` próprio, como
`preencher(modelo, valores)`. `montarPrompt` passa a ser uma casca fina em cima
dela — os testes que já existem protegem esse movimento.

`redigirFicha(modelo, sorteio, mundo)` monta os valores: o mundo como vem de
`nomearMundos`, os dois nomes de arquétipo como estão no acervo, o cenário
contraído com "em", e a complicação crua.

### 4. O molde, em Markdown

`src/content/paginas/ficha.md`, no precedente de `prompt-ia.md`: prosa da autora
com marcadores em maiúsculas — `[MUNDO]`, `[PERSONAGEM A]`, `[PERSONAGEM B]`,
`[LOCAL]`, `[FATO]`. As quebras de linha fazem parte do molde.

Como no prompt, a página chama `redigirFicha` uma vez no frontmatter com valores
de descarte, só para um marcador errado estourar `npm run build` em vez de
chegar em produção.

### 5. A página

`src/pages/ficha.astro`, com as mesmas opções de sorteio do gerador (mundo,
misturar, incluir comuns), as travas por peça, o texto da ficha e um botão de
copiar. Pools injetados como JSON no build, zero requisição em runtime.

**Fora da navegação, por ora.** O header tem sete itens e há registro de que ele
foi ajustado para caber numa linha só até recolher em 1079px (commit 2582dd5);
um oitavo item arrisca quebrar isso. O acesso vem de um link no fim de
`/gerador/`. Se a autora quiser na navegação, aí se mede o header.

### 6. Verificação

`npx vitest run`, `npm run check`, `npm run build`, e a ficha aberta no
navegador nos dois temas.

## O que este plano não faz

- Não cria banco de característica física nem de personalidade.
- Não põe a ficha na navegação.
- Não muda a lógica do gerador de hoje: `sortear`, `redigir` e `moldes.ts`
  continuam idênticos em comportamento.

## Desvios, decididos durante a execução

**A carta e as opções viraram componentes.** O plano dizia não tocar em
`gerador.astro`, e a ideia era duplicar o CSS da carta e do cadeado na página
nova — cerca de 120 linhas, mais o par de SVGs. Isso contraria o precedente
registrado em `global.css`: `.lista-subgeneros` foi consolidada lá justamente
"para não criar uma quinta e sexta cópia". Então saíram
[CartaSorteada.astro](../../../src/components/CartaSorteada.astro) e
[OpcoesDoSorteio.astro](../../../src/components/OpcoesDoSorteio.astro), usados
pelas duas páginas, e `.pilha-cartas`, `.acoes` e `.aviso` foram para
`global.css`. `gerador.astro` encolheu e não mudou de aparência — conferido por
captura antes e depois.

**`nomearMundos` ganhou uma versão que recebe a lista de subgêneros.** A ordem
das cartas na tela é o que decide como "Cyberpunk + Distopia" sai escrito, e a
ficha tem outra ordem que a premissa. A primeira tentativa foi montar um
`Sorteio` falso para reusar a função como estava, passando o personagem B no
campo do elemento — funcionava, mas trocava a ordem em silêncio. Virou
`nomearMundosDe(subgeneros, opcoes, nomes)`, com `nomearMundos` como casca fina
em cima, e um teste que tranca a ordem.
