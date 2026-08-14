# Premissa de dois personagens — Documento de Design

**Data:** 14 de agosto de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. O que muda

A premissa deixa de ser uma frase corrida sobre um protagonista e passa a ser um
bloco fixo de quatro linhas sobre **dois** personagens:

```
Essa é uma ficção científica de invasão alienígena.

Um(a) biomédico(a) que é cego(a) de um olho.
Um(a) contrabandista que é egocêntrico(a).

Tudo começa num laboratório secreto.

Importante: um personagem está de luto.
```

É uma substituição, não um segundo modo: o formato antigo sai inteiro.

## 2. As peças, antes e depois

| Hoje | Depois |
|---|---|
| Arquétipo (76 verbetes do acervo) | Profissão A + característica física |
| — | Profissão B + personalidade |
| Cenário (60 verbetes do acervo) | Local — **o mesmo cenário**, sem mudança |
| Elemento narrativo (60 verbetes) | *sai* |
| Complicação (40, em 7 famílias) | Fato (40, sem famílias) |
| 10 moldes de frase | 1 bloco fixo |

**Arquétipos e elementos continuam no catálogo, na busca e em `/mundos/`.** O que
eles perdem é o assento no gerador. Nenhum arquivo de `src/content/` é apagado.

## 3. As quatro listas novas

Vivem em TypeScript dentro de [src/lib/gerador/](../../../src/lib/gerador/), pelo
mesmo motivo que as complicações vivem hoje: são peça de sorteio, não verbete de
leitura. Continuam sendo conteúdo editorial da autora, sob CC BY, como o resto do
acervo.

| Arquivo | Quantas | Por mundo? | Forma do texto | Exemplo |
|---|---|---|---|---|
| `profissoes.ts` | 10 por mundo (60) | sim | minúscula, com artigo | `um(a) contrabandista` |
| `caracteristicas.ts` | 30 | não | **começa com verbo** | `é cego(a) de um olho` |
| `personalidades.ts` | 30 | não | **sem verbo**, adjetivo | `egocêntrico(a)` |
| `fatos.ts` | 40 | não | oração completa | `um personagem está de luto` |

Nenhuma termina em ponto — quem fecha a linha é o molde, como já acontece com as
complicações.

### Por que só as profissões são divididas por mundo

Porque só elas mudam com o subgênero: um "piloto de salto" é de space opera e um
"técnico de implantes" é de cyberpunk. Ser cego de um olho, ser egocêntrico ou
estar de luto não pertence a subgênero nenhum, e inventar seis versões de cada um
produziria repetição, não sabor.

### Por que o "(a)" está em toda parte

A profissão é escrita sem gênero — decisão da autora, para quem escreve a
história decidir. Isso obriga o adjetivo que vem depois a acompanhar: *"Um(a)
contrabandista que é egocêntrico"* devolve pela porta dos fundos o gênero que a
profissão tinha acabado de deixar em aberto. Daí `cego(a)`, `egocêntrico(a)`.

Onde o traço já é invariável, fica limpo, sem parênteses: `leal demais`,
`de poucas palavras`, `tem cicatrizes nas mãos`, `incapaz de mentir`. Escrever
traços invariáveis sempre que possível é preferência de estilo, não regra.

### O tamanho do repertório

Dentro de um mundo só: 10 × 9 profissões × 30 características × 30
personalidades × 10 locais × 40 fatos ≈ **32 milhões** de premissas. Os 10 moldes
saem, mas a variedade não depende mais deles.

## 4. O molde

Um só, fixo:

```
Essa é uma ficção científica de {mundo}.

{profissaoA} que {caracteristica}.
{profissaoB} que é {personalidade}.

Tudo começa {em:local}.

Importante: {fato}.
```

Detalhes que decidem se a frase sai certa:

- **`{mundo}`** é o nome de exibição do subgênero, inteiro em minúscula
  (`Invasão Alienígena` → `invasão alienígena`). Com "Misturar mundos" ligado,
  `nomearMundos()` continua fazendo o trabalho que já faz — os mundos de fato
  usados, sem repetir, unidos por `" + "` —, agora na ordem profissão A →
  profissão B → local, e o resultado inteiro desce para minúscula
  (`space opera + distopia`).
- **O `é` muda de lado.** A característica física traz o verbo dentro (`é cego(a)
  de um olho`, `tem cicatrizes nas mãos`), porque nem toda característica usa o
  verbo *ser*. A personalidade não traz (`egocêntrico(a)`), e o `é` fica no
  molde. Não é assimetria por descuido: é o que permite `que tem cicatrizes` sem
  precisar de duas listas de característica.
- **`{profissaoA}` e `{profissaoB}` abrem linha**, então a primeira letra sobe
  para maiúscula no momento de redigir. As listas guardam tudo em minúscula, como
  `cenarios.singular` já faz.
- **`{em:local}`** passa por `contrair()`: `em` + `um laboratório secreto` →
  `num laboratório secreto`. É a única concordância que sobra no gerador.

## 5. O sorteio

```ts
// Só nome e mundo: profissão não é entrada de conteúdo, não tem página nem
// descrição, e por isso não precisa de `id` como as peças do acervo.
type Profissao = { nome: string; subgenero: string };

type Sorteio = {
  personagemA: { profissao: Profissao; caracteristica: string };
  personagemB: { profissao: Profissao; personalidade: string };
  local: PecaCenario;
  fato: string;
};

type Travas = { personagemA: boolean; personagemB: boolean; local: boolean };
```

Regras:

- **As duas profissões nunca são iguais na mesma premissa.** É o que "sem
  repetição de personagem" quer dizer. B é sorteado de um pool sem a profissão de
  A — inclusive quando A está travado. Se isso esvaziar o pool, `escolher()`
  lança, como já faz hoje.
- **O fato nunca repete o da rodada anterior**, no mesmo espírito da complicação
  de hoje. Sem famílias: as complicações tinham 7 famílias e o sorteio evitava
  repetir a família também; os fatos são uma lista só, e a regra é só não repetir
  o último.
- **O fato não trava.** Cada rolagem traz um fato novo, mesmo com as três cartas
  travadas — é o uso que o cadeado sempre teve: segurar o elenco e o lugar e ficar
  rolando o que complica.
- O cadeado trava o personagem **inteiro**, profissão e traço juntos.
- `sortear()` continua recebendo `aleatorio: () => number` para os testes serem
  determinísticos.

## 6. A página

A forma não muda: três cartas com cadeado, o botão "Gerar", o bloco da premissa,
o bloco do prompt, os dois botões de copiar.

| Carta hoje | Carta depois | O que mostra |
|---|---|---|
| Arquétipo | **Personagem A** | `um(a) biomédico(a)` / `é cego(a) de um olho` |
| Cenário | **Personagem B** | `um(a) contrabandista` / `egocêntrico(a)` |
| Elemento narrativo | **Local** | `Laboratório secreto` |

A etiqueta de mundo de cada carta continua existindo e continua saindo da peça
que tem mundo: a profissão nas duas cartas de personagem, o local na terceira. A
característica e a personalidade são universais e não contribuem com etiqueta —
nenhuma carta fica sem uma, porque toda carta tem uma peça de mundo dentro.

**A caixa "Incluir os 10 arquétipos comuns" sai do formulário.** Ela existia para
jogar no sorteio os arquétipos que servem a todos os mundos; sem arquétipos no
gerador, não tem o que incluir. O pool `comuns` continua intacto no acervo e em
`/arquetipos/comuns/`. O campo `incluirComuns` sai de `Opcoes`.

"Mundo" e "Misturar mundos" ficam como estão.

## 7. O que sai do código

Três peças existem hoje só para servir arquétipos e elementos, e saem com eles:

- **`numeroDe()`** — decide se um elemento é singular ou plural (*"impera a
  vigilância"* vs *"imperam os drones"*). São ~90 linhas com os comentários mais
  longos do projeto, documentando cada alternativa mais simples que foi testada e
  falhou. Sai inteira, junto com `PREPOSICOES`, `ARTIGOS`,
  `NUCLEOS_SINGULARES_TERMINADOS_EM_S` e `EXCECOES_COORDENACAO_DE_ADJETIVOS`.
- **`generoDe()`** e o marcador `{pronome}` — escolhiam entre "ela" e "ele" pelo
  artigo do arquétipo. Sem arquétipo e sem gênero fixo, não há o que decidir.
- **`emMinuscula()`** — abaixava a primeira letra dos títulos de elemento, que
  abrem com artigo. As profissões já nascem em minúscula.

Sai também o conteúdo antigo: `MOLDES` (10) e `COMPLICACOES` (40 em 7 famílias).

**`contrair()` fica**, com os testes que tem. É ela que produz `num laboratório
secreto`, e é a única concordância que o formato novo ainda pede.

O campo `arquetipos.artigo` **continua obrigatório no esquema**. Ele deixa de ser
lido pelo gerador, mas é o que diz o gênero do arquétipo, e tirá-lo apagaria
informação editorial de 76 verbetes por um motivo que é só de código.

## 8. O prompt de IA

[prompt-ia.md](../../../src/content/paginas/prompt-ia.md) hoje entrega quatro
peças à IA — Mundo, Protagonista, Cenário, Elemento narrativo. Os marcadores
`[ARQUÉTIPO]` e `[ELEMENTO NARRATIVO]` deixam de ter valor para receber.

O arquivo é reescrito para os marcadores do formato novo: `[MUNDO]`,
`[PERSONAGEM A]`, `[PERSONAGEM B]`, `[LOCAL]`, `[FATO]`. O texto em volta é da
autora — a implementação entrega uma primeira versão para ela corrigir por cima.

`montarPrompt()` não muda de comportamento: continua trocando marcadores e
lançando em marcador desconhecido, e `gerador.astro` continua chamando-a uma vez
em tempo de build com valores de descarte, para um `[PERSONAGEM Á]` com acento
errado quebrar `npm run build` em vez de chegar em produção.

## 9. Quem escreve as 160 entradas

A implementação entrega uma **primeira versão completa** das quatro listas — 60
profissões, 30 características, 30 personalidades, 40 fatos —, e a autora
reescreve por cima. Nenhuma lista nasce pela metade nem com marcador de
"preencher depois": o gerador precisa rodar de verdade para ela julgar o
resultado, e página em branco é pior ponto de partida do que texto para corrigir.

## 10. O que não muda

- O acervo em `src/content/`: nenhum arquivo criado, editado ou apagado.
- O catálogo, a busca, `/mundos/`, o menu — nenhuma rota muda.
- Nenhuma cor, tamanho de fonte ou opacidade da aurora. As contas de
  [verificacao-visual.md](../../verificacao-visual.md) não são refeitas.
- Nenhuma dependência nova; nada carregado em tempo de execução. Os pools
  continuam injetados como JSON estático em tempo de build.
- O gerador continua efêmero: nada escrito no navegador.

## 11. Fora de escopo

- **Catálogo de profissões.** Decisão da autora: elas vivem só dentro do gerador,
  sem página, sem descrição e sem entrada na busca. O arquétipo segue sendo o
  único "quem" que se lê no site, como manda
  [revisao-de-repeticoes.md](../../revisao-de-repeticoes.md).
- **Um terceiro personagem**, ou número variável de personagens.
- **Escolher a profissão ou o traço à mão.** O gerador sorteia; o cadeado é o
  único controle.
- **Recuperar os 10 moldes** como variação do bloco.

## 12. Verificação

Testes novos e reescritos em `src/lib/gerador/`:

- `sortear` não devolve a mesma profissão nos dois personagens.
- `sortear` respeita a regra acima **com A travado** — B continua evitando a
  profissão de A entre uma rodada e outra.
- `sortear` não repete o fato da rodada anterior.
- `sortear` traz fato novo mesmo com as três travas ligadas.
- `sortear` respeita cada uma das três travas.
- `poolsFiltrados` filtra profissões e locais pelo mundo, e **não** filtra
  características, personalidades e fatos, que são universais.
- `redigir` monta o bloco inteiro com as quebras de linha nos lugares certos.
- `redigir` sobe a primeira letra das duas linhas de personagem.
- `redigir` contrai a preposição do local (`em` + `uma órbita baixa` → `numa
  órbita baixa`), com um caso para `um` e um para `uma`.
- `redigir` põe o `é` só na linha da personalidade.
- `redigir` escreve o mundo em minúscula.
- As contagens das quatro listas ficam trancadas em `dados.test.ts`, como as 7
  famílias e 40 complicações estão hoje: 60 profissões (10 por mundo em cada um
  dos seis), 30, 30 e 40.
- Nenhuma entrada das quatro listas termina em ponto; profissões e personalidades
  começam em minúscula.
- `montarPrompt` troca os cinco marcadores novos e lança no desconhecido.

Os testes de `numeroDe` e `generoDe` saem junto com as funções.
[redacao.test.ts](../../../src/lib/gerador/redacao.test.ts) encolhe para os casos
de `contrair` mais os do bloco novo.

`npx vitest run` e `npm run check` precisam passar — são os dois portões que o
deploy roda.

No navegador: as três cartas com os rótulos novos; o cadeado segurando personagem
inteiro; o fato mudando a cada "Gerar" mesmo com tudo travado; "Misturar mundos"
trazendo mais de um nome na primeira linha; o formulário sem a caixa de comuns; a
premissa com as quebras de linha visíveis; e os dois botões de copiar levando o
texto certo.

## 13. Documentação que envelhece junto

- [docs/atributos-do-gerador.md](../../atributos-do-gerador.md) — é o inventário
  do que o gerador pode produzir, e passa a descrever outro gerador. Reescrita
  inteira: as quatro listas verbete a verbete, o molde único, as regras do
  sorteio. As seções de arquétipos, elementos, complicações e dos 10 moldes saem.
- [CLAUDE.md](../../../CLAUDE.md) — a seção "Gerador de premissas" inteira, mais
  a menção a `incluirComuns` e ao acervo injetado em `gerador.astro`. A regra de
  que `arquetipos.artigo` alimenta o gerador deixa de valer e precisa ser
  reescrita, não apagada: o campo continua obrigatório por motivo editorial.
- [README.md](../../../README.md) — descreve o gerador como "combina as peças em
  premissas"; conferir se a frase ainda descreve o que a página faz.
