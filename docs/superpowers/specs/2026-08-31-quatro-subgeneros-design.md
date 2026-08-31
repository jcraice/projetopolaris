# Quatro subgêneros novos — Documento de Design

**Data:** 31 de agosto de 2026
**Autoria do conteúdo:** Julia (os 44 arquétipos) e Claude (cenários, elementos,
profissões, aberturas), tudo sob revisão dela
**Situação:** design aprovado, pronto para virar plano de implementação

O acervo sai de seis subgêneros para dez. A autora trouxe as quatro listas de
arquétipos prontas; o resto do que um subgênero precisa para existir no site —
cenários, elementos narrativos, profissões do gerador, aberturas de catálogo e
epígrafe — é escrito neste trabalho.

Nenhuma estrutura muda. Os esquemas, as rotas, a busca e o Nav ficam como estão:
o site já sabe montar um subgênero, e o que falta é conteúdo. As poucas linhas
de código que mudam estão nas seções 7 e 10, e existem por causa de duas coisas
concretas — uma sigla no nome e uns números trancados em teste.

---

## 1. O que entra

| | Hoje | Depois |
|---|---|---|
| Subgêneros com página | 6 | 10 |
| Arquétipos | 76 | 120 |
| Cenários | 60 | 100 |
| Elementos narrativos | 60 | 100 |
| Profissões do gerador | 60 | 100 |

Por subgênero novo: 11 arquétipos (10 mais o felino), 10 cenários, 10 elementos,
10 profissões, 3 aberturas de catálogo e 1 epígrafe. São **164 verbetes novos** e
**12 parágrafos de abertura**.

O gerador cresce junto, sem nada de especial: `poolsFiltrados` filtra por
subgênero e o seletor de Subgênero lista quem tem `completo: true`. Dentro de um
subgênero novo o gerador passa a poder montar 10 × 9 profissões × 30
características × 30 personalidades × 10 locais × 40 fatos — a mesma conta de
sempre, cerca de 32 milhões de premissas.

## 2. Os quatro subgêneros

| Nome | Identificador | Ordem |
|---|---|---|
| FC Militar | `fc-militar` | 7 |
| FC Climática | `fc-climatica` | 8 |
| Primeiro Contato | `primeiro-contato` | 9 |
| Biopunk | `biopunk` | 10 |

O pool **10 Arquétipos Comuns** sai da ordem 7 para a **11**. Ele sempre foi o
último da fila e continua sendo; sem essa renumeração ele apareceria no meio dos
subgêneros novos nos índices.

"FC Militar" é decisão da autora, tomada contra "Ficção Científica Militar", que
faria o gerador escrever *"Essa é uma ficção científica de ficção científica
militar."* "FC Climática" segue a mesma forma, e as duas siglas cobram um ajuste
no gerador — seção 7.

**FC Climática entrou no lugar de Space Western**, que chegou a ser desenhado
aqui e foi trocado pela autora antes de qualquer verbete ser escrito. Onde este
documento fala em quatro subgêneros, são estes quatro.

### As auroras

Nenhuma cor nova entra no site. Os quatro trios são recombinações de hexes que já
estão em uso:

| Subgênero | Trio | Leitura |
|---|---|---|
| FC Militar | `#2f6b4f` `#c8b47a` `#ff5f45` | verde de campanha, cáqui, vermelho de fogo |
| FC Climática | `#ffb03a` `#1c5e8f` `#c8b47a` | âmbar de seca, azul de enchente, cáqui de terra rachada |
| Primeiro Contato | `#35e5f0` `#1c5e8f` `#ffd66e` | ciano do sinal, azul profundo, areia |
| Biopunk | `#6ee7a0` `#ff2d92` `#7c3aed` | verde de cultura, magenta de carne, violeta de laboratório |

Primeiro Contato fica perto de Invasão Alienígena de propósito — os dois falam de
chegada, e o que separa é a areia quente no lugar do verde-limão. FC Climática
tem os dois extremos do desastre no mesmo trio: a seca e a água.

## 3. Contraste: por que nenhuma conta é refeita

[verificacao-visual.md](../../verificacao-visual.md) mede o pior caso de cada
subgênero pela **cor mais clara do trio**, porque a aurora gira e toda região da
tela passa por baixo das três. A cor mais clara do acervo hoje é o verde-limão
`#a6ff6e` da Invasão Alienígena, com luminância relativa 0,8075 — é ela que
sustenta os piores números do documento.

As cores mais claras dos quatro trios novos são todas mais escuras que ela:

| Subgênero | Pior cor | Luminância |
|---|---|---|
| FC Militar | `#c8b47a` | 0,4633 |
| FC Climática | `#ffb03a` | 0,5262 |
| Primeiro Contato | `#ffd66e` | 0,7048 |
| Biopunk | `#6ee7a0` | 0,6300 |

Fundo mais escuro é contraste maior contra o texto claro do site, então **todo
mínimo que o documento já garante continua garantido**, e o pior caso do site
segue sendo a Invasão Alienígena. Nenhum token muda, a opacidade da aurora
continua em 0,36 e nenhuma decisão de cor é reaberta.

O que o plano faz é acrescentar as quatro linhas nas tabelas do documento, com os
números calculados, para que ele continue listando os subgêneros que existem.
`#ffb03a` e `#6ee7a0` já têm linha lá (Distopia e Pós Apocalíptico), e os valores
se repetem.

## 4. Os 44 arquétipos

Vêm da autora. A única edição é de gênero gramatical: ela pediu a normalização
para a convenção do acervo, em que o nome fica no masculino e o feminino aparece
só quando **o substantivo** é feminino — como em IA Emergente, Criança das Ruínas
e Vítima do Paradoxo. Nove nomes mudaram por isso, e três nascem femininos.

O campo `artigo` registra o gênero de cada um, como manda o esquema.

### FC Militar (`fc-militar`)

| Ordem | Nome | `artigo` | |
|---|---|---|---|
| 1 | Recruta em Combate | o | |
| 2 | Sargento Endurecido | o | |
| 3 | Comandante Estratégico | o | |
| 4 | Alto Comando Corrupto | o | |
| 5 | Atirador de Elite | o | era "Atiradora de Elite" |
| 6 | Soldado de Armadura Pesada | o | |
| 7 | Cientista de Guerra | o | |
| 8 | Mercenário Desiludido | o | |
| 9 | Esquadrão Sacrificável | o | |
| 10 | Desertor em Fuga | o | |
| 11 | Mascote de Trincheira | o | `felino: true` |

### FC Climática (`fc-climatica`)

| Ordem | Nome | `artigo` | |
|---|---|---|---|
| 1 | Cientista Dissidente | o | |
| 2 | Refugiado Climático | o | era "Refugiada Climática" |
| 3 | Executivo Poluidor | o | |
| 4 | Ativista Radical | o | |
| 5 | Barão dos Recursos | o | |
| 6 | Jovem Geração Cobrando Contas | a | substantivo feminino |
| 7 | Engenheiro de Geoengenharia | o | era "Engenheira de Geoengenharia" |
| 8 | Povo do Saber Ancestral | o | era "Guardiã do Conhecimento Ancestral" — ver seção 9 |
| 9 | Sobrevivente Enlutado pela Paisagem | o | era "Sobrevivente Enlutada pela Paisagem" |
| 10 | Líder Comunitário Pós-Colapso | o | ver seção 9 |
| 11 | Gato das Marés | o | `felino: true` |

### Primeiro Contato (`primeiro-contato`)

| Ordem | Nome | `artigo` | |
|---|---|---|---|
| 1 | Linguista Decifrador | o | era "Linguista Decifradora" |
| 2 | Cientista Cético | o | era "Cientista Cética" |
| 3 | Falcão Militar | o | |
| 4 | Embaixador Alienígena | o | |
| 5 | Multidão em Pânico | a | substantivo feminino |
| 6 | Observador Benevolente | o | |
| 7 | Intermediário Acidental | o | era "Intermediária Acidental" |
| 8 | Isolacionista Convicto | o | |
| 9 | Jornalista da Primeira Hora | o | |
| 10 | Diplomata Terrestre | o | |
| 11 | Guardião do Sinal | o | `felino: true` |

### Biopunk (`biopunk`)

| Ordem | Nome | `artigo` | |
|---|---|---|---|
| 1 | Bio-hacker Rebelde | o | |
| 2 | Geneticista Renegado | o | |
| 3 | Corpo Modificado | o | |
| 4 | Executor de Patentes | o | era "Executor Corporativo" — ver seção 9 |
| 5 | Híbrido Rejeitado | o | |
| 6 | Bebê de Design | o | |
| 7 | Traficante de Genes | o | |
| 8 | Vítima de Praga Sintética | a | substantivo feminino |
| 9 | Curandeiro Clandestino | o | era "Curandeira Clandestina" |
| 10 | Mutação Descontrolada | a | substantivo feminino |
| 11 | Felino Modificado | o | `felino: true` |

Os quatro felinos entram **sem ilustração**. O campo é opcional e a página não
quebra sem ele; quando a autora desenhar os quatro gatos, eles encaixam no
verbete de ordem 11 como os seis que já existem, e aí sim `ilustracao` e
`ilustracaoAlt` entram juntos.

## 5. Os 40 cenários e os 40 elementos

Escritos neste trabalho, pelo critério que
[revisao-de-repeticoes.md](../../revisao-de-repeticoes.md) fixou:

- **cenário é onde** — um lugar em que a cena acontece, não uma condição;
- **elemento é o quê ou que força** — tecnologia, conflito, ideia, pressão.

Formato igual ao do acervo: um parágrafo curto por verbete, `titulo` com inicial
maiúscula, `ordem` de 1 a 10, `subgenero` igual ao identificador. Cenário leva
também `singular`, que precisa começar por "um " ou "uma " porque é a forma que
entra na premissa contraída com a preposição ("Tudo começa **numa** trincheira
orbital").

**Corpo de verbete começa com maiúscula e termina em ponto**, nas duas coleções.
Nos elementos isso já valia nos 60. Nos cenários convivia com a forma minúscula,
em que o corpo completava a frase do título — *"sedes blindadas e distritos de
elite..."* —, e a autora decidiu padronizar: os 50 cenários antigos que
começavam em minúscula foram corrigidos antes deste trabalho começar, no commit
`2fd2bff`. Os 80 verbetes novos já nascem na forma padronizada.

**Título é frase, não manchete**: inicial maiúscula e o resto minúsculo ("Áreas
corporativas exclusivas"), como em 110 dos 120 verbetes. A exceção é o **Space
Opera**, cujos dez cenários têm título em Caixa Alta; ela fica como está, porque
a autora padronizou o corpo e não o título.

## 6. As 40 profissões do gerador

Dez por subgênero, em [profissoes.ts](../../../src/lib/gerador/profissoes.ts),
seguindo as regras que já valem lá:

- nome com inicial maiúscula e sem ponto final, porque é nome de arquétipo de
  profissão;
- concordância marcada com "(a)" em substantivo e adjetivo — "Engenheiro(a)
  Chefe", "Executivo(a) Corporativo(a)" —, e palavra invariável fica limpa;
- onde o "(a)" não produz o feminino certo, a frase é refeita com palavra
  invariável em vez de forçar a marcação;
- `descricao` no singular, frase inteira terminada em ponto, porque ela é o corpo
  do guia em `/guia-de-personagens/` e descreve o personagem que saiu sorteado.

**Profissão não é arquétipo.** As dez de cada subgênero descrevem ofício — o que
a pessoa faz para viver dentro daquele mundo —, e não função narrativa. É a
separação que impede o guia de virar um segundo catálogo de "quem", e ela vale
especialmente aqui: FC Militar tem arquétipos que soam como cargo (Sargento
Endurecido, Comandante Estratégico), e as profissões daquele subgênero precisam
puxar para outro lado — quem conserta a armadura, quem cozinha para o pelotão,
quem enterra os mortos.

## 7. A sigla no gerador

`redigir()` abaixa o nome do subgênero na primeira linha da premissa: "Space
Opera" vira "space opera". Com "FC Militar" isso produziria *"de fc militar"*,
que lê como erro de digitação.

A correção fica em [redacao.ts](../../../src/lib/gerador/redacao.ts): abaixar
palavra por palavra, **preservando a que é toda maiúscula**. "FC Militar" vira
"FC militar"; "Space Opera" continua virando "space opera"; e "Misturar
subgêneros" continua unindo nomes com " + " ("FC militar + space opera").

É a única mudança de comportamento do gerador neste trabalho, e ganha teste
próprio em `redacao.test.ts`.

## 8. As epígrafes

Frases de gente real. A autora **aprovou as três** que sobreviveram à troca de
subgênero; a de FC Climática é proposta nova e ainda precisa do aval dela.

| Subgênero | Frase | Autoria | Obra |
|---|---|---|---|
| FC Militar | "A violência, a força nua, resolveu mais questões na história do que qualquer outro fator." | Robert A. Heinlein | *Tropas Estelares* |
| FC Climática | "A crise climática é também uma crise da cultura, e portanto da imaginação." | Amitav Ghosh | *A Grande Loucura* |
| Primeiro Contato | "Se somos os únicos, é um desperdício enorme de espaço." | Carl Sagan | *Contato* |
| Biopunk | "Você é meu criador, mas eu sou seu senhor." | Mary Shelley | *Frankenstein* |

A tradução de cada frase é deste trabalho; a atribuição é que precisa estar
certa, porque citação mal atribuída fica no ar com o nome de outra pessoa. Se a
de Ghosh não convencer, a alternativa é o verso de Semente da Terra em *A
Parábola do Semeador*, de Octavia E. Butler — "Todo o que tocas, tu mudas; tudo o
que mudas, muda-te" —, com a ressalva de que Butler já assina a epígrafe de
Viagem no Tempo e passaria a aparecer duas vezes. Em último caso o campo fica
vazio até a autora escolher: ele é opcional.

## 9. A revisão de repetições

Os quatro subgêneros novos passam pelo mesmo crivo dos seis antigos, e o
resultado entra em [revisao-de-repeticoes.md](../../revisao-de-repeticoes.md).

**Decidido pela autora:** **Executor Corporativo** (biopunk) ficava a uma letra
do **Executivo Corporativo** (cyberpunk), e vira **Executor de Patentes** — nome
que diz o que ele faz e desfaz a colisão na busca.

FC Climática é vizinha do Pós Apocalíptico, e a troca de Space Western por ela
trouxe duas colisões novas que precisam de decisão:

- **Guardiã do Conhecimento Ancestral** (climática) × **Guardião do Conhecimento
  Perdido** (pós-apocalíptico) repetiam três palavras em quatro. A descrição da
  autora fala de uma **comunidade** indígena ou tradicional, não de uma pessoa
  guardiã, então este documento já registra o nome como **Povo do Saber
  Ancestral**: mantém o sentido dela, desfaz a colisão e ainda diz que é um povo.
  Precisa do aval da autora.
- **Líder Comunitário Pós-Colapso** (climática) × **Líder de Comunidade**
  (pós-apocalíptico). Aqui a sobreposição é de conteúdo, não só de nome: os dois
  organizam comunidade depois que a instituição falhou. O que separa é a causa —
  colapso climático contra colapso total — e a ênfase em adaptação local.
  Recomendação: manter e registrar como sobreposição de propósito, porque os dois
  subgêneros são vizinhos e a grade existe para mostrar isso. Se a autora
  preferir separar, **Organizador da Adaptação Local** resolve.
- **Cientista Dissidente** (climática), **Cientista de Guerra** (militar),
  **Cientista Cético** (primeiro contato) e **Cientista/Inventor** (comuns) fazem
  quatro cientistas no acervo. Cada um responde a uma pressão diferente —
  instituição, comando, evidência e curiosidade. Recomendação: manter; "Cientista
  X" virou um tipo da casa, e o adjetivo é que carrega o verbete.
- **Sobrevivente Enlutado pela Paisagem** (climática) × **Sobrevivente
  Solitário** (pós-apocalíptico) dividem só o substantivo. Manter.
- **Observador Benevolente** (primeiro contato) × **Observador Espacial** (o
  felino do space opera). Um é entidade alienígena, o outro é um gato.
  Recomendação: manter — o contexto da página separa os dois sem esforço.

## 10. O que envelhece junto

Nada disso é opcional: são os lugares que ficam mentindo no dia em que o acervo
cresce.

**Testes que trancam contagem** —
[dados.test.ts](../../../src/lib/gerador/dados.test.ts) exige 60 profissões, dez
por subgênero, e mantém a lista dos identificadores válidos. Passa a exigir 100 e
ganha os quatro identificadores novos.

**Os seis lugares que repetem o tamanho do acervo por extenso**, que nenhum teste
confere: [README.md](../../../README.md),
[sobre.md](../../../src/content/paginas/sobre.md), o comentário dos cenários em
[gerador.astro](../../../src/pages/gerador.astro), o `nome` de
[comuns.md](../../../src/content/subgeneros/comuns.md), os dois comentários de
[subgeneros/[subgenero].astro](../../../src/pages/subgeneros/%5Bsubgenero%5D.astro)
e [atributos-do-gerador.md](../../atributos-do-gerador.md).

O texto de `sobre.md` é prosa da autora e diz "6 subgêneros de ficção científica,
cada um com 10 arquétipos". O plano troca o número; se ela quiser reescrever a
frase, é dela.

**Documentos** — [atributos-do-gerador.md](../../atributos-do-gerador.md) lista
as profissões verbete a verbete e ganha 40 linhas;
[verificacao-visual.md](../../verificacao-visual.md) ganha as quatro linhas de
aurora da seção 3; [revisao-de-repeticoes.md](../../revisao-de-repeticoes.md)
ganha a revisão da seção 9; [CLAUDE.md](../../../CLAUDE.md) e o
[README.md](../../../README.md) acompanham as contagens.

## 11. O que acontece sozinho

Vale escrever para ninguém procurar trabalho onde não há: as quatro rotas
`[subgenero]`, a página `/subgeneros/[subgenero]/`, o índice da busca, a fileira
"Trocar de subgênero" e o seletor do gerador **se atualizam sozinhos** a partir
das coleções. Nenhum arquivo `.astro` precisa ser tocado para os quatro
subgêneros novos aparecerem.

Uma consequência visual pede olho, não código: a fileira de pílulas passa de seis
para dez, na home, nos três índices e no fim de cada catálogo. Ela já quebra em
mais de uma linha, então a mudança é de altura, não de layout — mas entra na
conferência final com o site rodando.

## 12. Ordem de entrega

**FC Militar inteiro primeiro** — 11 arquétipos, 10 cenários, 10 elementos, 10
profissões, 3 aberturas e a epígrafe —, a autora lê, e só então os outros três.
Não é entregar menos: é descobrir um erro de tom em 41 verbetes em vez de em 164.

Os três subgêneros seguintes entram um a um, cada um completo, na ordem FC
Climática, Primeiro Contato e Biopunk. As contagens, os testes e os documentos da
seção 10 fecham no fim, de uma vez, quando os quatro estiverem no lugar — assim
os números não são reescritos quatro vezes.

## 13. Verificação

Além de `npx vitest run`, `npm run check` e `npm run build` a cada etapa:

- `npm run build` é o que valida o frontmatter dos 164 verbetes novos contra o
  Zod — inclusive o "um "/"uma " de cada `singular` e a aurora obrigatória dos
  quatro subgêneros;
- o gerador rolado à mão em cada subgênero novo, conferindo a primeira linha
  (com atenção ao "FC militar") e a premissa inteira;
- a fileira de dez pílulas vista na home, num índice e no fim de um catálogo;
- a busca por um verbete de cada subgênero novo, que confirma que o índice pegou
  as entradas e que a âncora leva ao lugar certo.
