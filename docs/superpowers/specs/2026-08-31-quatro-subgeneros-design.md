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
| Space Western | `space-western` | 8 |
| Primeiro Contato | `primeiro-contato` | 9 |
| Biopunk | `biopunk` | 10 |

O pool **10 Arquétipos Comuns** sai da ordem 7 para a **11**. Ele sempre foi o
último da fila e continua sendo; sem essa renumeração ele apareceria no meio dos
subgêneros novos nos índices.

"FC Militar" é decisão da autora, tomada contra "Ficção Científica Militar", que
faria o gerador escrever *"Essa é uma ficção científica de ficção científica
militar."* A sigla cobra um ajuste no gerador — seção 7.

### As auroras

Nenhuma cor nova entra no site. Os quatro trios são recombinações de hexes que já
estão em uso:

| Subgênero | Trio | Leitura |
|---|---|---|
| FC Militar | `#2f6b4f` `#c8b47a` `#ff5f45` | verde de campanha, cáqui, vermelho de fogo |
| Space Western | `#ffb03a` `#7a1f2b` `#c8b47a` | âmbar de poeira, couro, cáqui |
| Primeiro Contato | `#35e5f0` `#1c5e8f` `#ffd66e` | ciano do sinal, azul profundo, areia |
| Biopunk | `#6ee7a0` `#ff2d92` `#7c3aed` | verde de cultura, magenta de carne, violeta de laboratório |

Primeiro Contato fica perto de Invasão Alienígena de propósito — os dois falam de
chegada, e o que separa é a areia quente no lugar do verde-limão.

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
| Space Western | `#ffb03a` | 0,5262 |
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

### Space Western (`space-western`)

| Ordem | Nome | `artigo` | |
|---|---|---|---|
| 1 | Pistoleiro Solitário | o | |
| 2 | Caçador de Recompensas | o | era "Caçadora de Recompensas" |
| 3 | Xerife da Fronteira | o | |
| 4 | Barão da Companhia | o | |
| 5 | Líder de Bando Fora-da-Lei | o | |
| 6 | Contrabandista de Nave | o | |
| 7 | Dono do Saloon | o | era "Dona do Saloon" |
| 8 | Povo Nativo Deslocado | o | |
| 9 | Curandeiro Itinerante | o | era "Curandeira Itinerante" |
| 10 | Jogador Trapaceiro | o | era "Jogadora Trapaceira" |
| 11 | Gato do Deserto | o | `felino: true` |

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
| 4 | Executor Corporativo | o | ver seção 9 |
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

O acervo de hoje tem duas formas convivendo, e os 80 verbetes novos seguem a
majoritária de cada coleção:

- **Elemento** é frase inteira, com inicial maiúscula e ponto — assim nos 60 que
  existem, sem exceção. *"Mentes copiadas para um suporte digital, que continuam
  falando depois que o corpo acaba."*
- **Cenário** é a frase que o título começa: inicial minúscula e ponto no fim, em
  50 dos 60. *"sedes blindadas e distritos de elite isolados do restante da
  cidade."* O título é o sujeito, o corpo completa.
- **Título** é frase, não manchete: inicial maiúscula e o resto minúsculo
  ("Áreas corporativas exclusivas"), como em 110 dos 120 verbetes.

A exceção nos três pontos é o **Space Opera**, cujos dez cenários têm título em
Caixa Alta e corpo começando com maiúscula. Ele fica como está — este trabalho
não reescreve o acervo existente —, e se a autora preferir que a Caixa Alta seja
o padrão, é ela quem decide, e aí a mudança é outra e alcança os seis subgêneros
antigos.

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

Quatro frases de gente real, propostas aqui para a autora conferir antes de
publicar — citação mal atribuída é erro que fica no ar com o nome de outra
pessoa. Se alguma não bater, o campo fica vazio até ela escolher outra: ele é
opcional.

| Subgênero | Frase | Autoria | Obra |
|---|---|---|---|
| FC Militar | "A violência, a força nua, resolveu mais questões na história do que qualquer outro fator." | Robert A. Heinlein | *Tropas Estelares* |
| Space Western | "O homem de preto fugiu pelo deserto, e o pistoleiro foi atrás." | Stephen King | *O Pistoleiro* |
| Primeiro Contato | "Se somos os únicos, é um desperdício enorme de espaço." | Carl Sagan | *Contato* |
| Biopunk | "Você é meu criador, mas eu sou seu senhor." | Mary Shelley | *Frankenstein* |

## 9. A revisão de repetições

Os quatro subgêneros novos passam pelo mesmo crivo dos seis antigos, e o
resultado entra em [revisao-de-repeticoes.md](../../revisao-de-repeticoes.md).
Três casos já estão visíveis e precisam de decisão explícita no plano:

- **Executor Corporativo** (biopunk) × **Executivo Corporativo** (cyberpunk).
  Papéis diferentes — um é segurança armada de patente, o outro é burocrata de
  megacorporação —, mas os nomes ficam a uma letra de distância na busca.
  Recomendação: renomear o do biopunk para **Executor de Patentes**, que diz o
  que ele faz e desfaz a colisão.
- **Curandeiro Itinerante** (space western) × **Curandeiro Clandestino**
  (biopunk) × **Curandeiro da Comunidade** (pós-apocalíptico). Três curandeiros,
  mas cada um resolve uma escassez diferente: distância, ilegalidade e
  comunidade. Recomendação: manter, e registrar como sobreposição de propósito.
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

Os três subgêneros seguintes entram um a um, cada um completo, na ordem Space
Western, Primeiro Contato e Biopunk. As contagens, os testes e os documentos da
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
