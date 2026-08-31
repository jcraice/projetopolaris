# Quatro subgêneros novos — Plano de Implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: usar
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para implementar tarefa a tarefa. Os passos usam
> caixa (`- [ ]`) para acompanhamento.

**Objetivo:** levar o acervo de seis para dez subgêneros — FC Militar, FC
Climática, Primeiro Contato e Biopunk —, cada um com arquétipos, cenários,
elementos narrativos e profissões do gerador.

**Arquitetura:** o site já sabe montar um subgênero. As rotas, a busca, a fileira
de pílulas e o seletor do gerador saem das coleções e se atualizam sozinhos, então
quase tudo aqui é conteúdo em Markdown mais dez linhas por subgênero em
`profissoes.ts`. A única mudança de comportamento está na Tarefa 1, e existe
porque duas siglas entram no acervo.

**Tecnologias:** Astro 7, coleções de conteúdo com esquema Zod, Vitest,
TypeScript estrito.

**Spec:** [2026-08-31-quatro-subgeneros-design.md](../specs/2026-08-31-quatro-subgeneros-design.md)

## Restrições globais

Valem para toda tarefa deste plano.

- **Tudo em português do Brasil**: nome de arquivo, identificador, conteúdo,
  comentário e mensagem de commit (imperativo — "Acrescenta o subgênero FC
  Militar").
- **Nenhuma cor nova.** Os quatro trios de aurora são recombinações de hexes já
  em uso e estão fixados na Tarefa 2, 6, 10 e 14. Não inventar cor.
- **Nenhuma dependência nova**, de runtime ou de build.
- **Verbete é um parágrafo só**, sem Markdown no corpo: as páginas de catálogo
  renderizam `entrada.body` como texto puro, então asterisco e link apareceriam
  literais.
- **Corpo de verbete começa com maiúscula e termina em ponto**, nas duas
  coleções.
- **Título é frase, não manchete**: "Trincheiras orbitais", não "Trincheiras
  Orbitais".
- **`singular` de cenário precisa começar com "um " ou "uma "** — o esquema
  recusa o resto, e é a forma que entra na premissa contraída ("Tudo começa
  **numa** trincheira orbital").
- **`artigo` de arquétipo é obrigatório e não tem padrão.** Ele registra o gênero
  do nome, e o esquema não deixa ele nascer implícito.
- **`npm run build` é o validador de conteúdo.** Não existe lint de frontmatter:
  o build passa o Zod em cada entrada e falha com o arquivo e o campo.
- **Mexeu no esquema de coleção com `npm run dev` rodando?** Apague `.astro/` e
  reinicie — o cache guarda a entrada interpretada pelo esquema antigo e o campo
  novo sai vazio na página sem ninguém reclamar.
- **Commit por tarefa**, com corpo explicando o porquê, e a linha
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` no fim.

---

## Tarefa 1: A sigla na primeira linha da premissa

`redigir()` abaixa o nome do subgênero — "Space Opera" vira "space opera". Com
"FC Militar" isso produz "de fc militar", que lê como erro de digitação. A
correção abaixa palavra por palavra e preserva a que é toda maiúscula.

**Arquivos:**
- Modificar: `src/lib/gerador/redacao.ts` (a entrada `'{subgenero}'` de `VALOR`)
- Teste: `src/lib/gerador/redacao.test.ts`

**Interfaces:**
- Consome: nada.
- Produz: `abaixarNome(nome: string): string`, exportada de `redacao.ts` e
  reexportada por `index.ts`. Recebe o nome já montado por `nomearSubgeneros()`
  — um nome ("FC Militar") ou vários unidos por " + " — e devolve a forma que
  entra na premissa.

- [ ] **Passo 1: escrever os testes que falham**

Em `src/lib/gerador/redacao.test.ts`, ao lado dos testes de `redigir`:

```ts
describe('abaixarNome', () => {
  it('abaixa nome comum inteiro', () => {
    expect(abaixarNome('Space Opera')).toBe('space opera');
  });

  it('preserva a palavra que é toda maiúscula', () => {
    expect(abaixarNome('FC Militar')).toBe('FC militar');
  });

  /* "Misturar subgêneros" une os nomes com " + " antes de chegar aqui, e a
     regra precisa valer para cada palavra dos dois lados do sinal. */
  it('preserva a sigla também em nome composto', () => {
    expect(abaixarNome('FC Militar + Space Opera')).toBe('FC militar + space opera');
  });
});
```

E o teste de ponta a ponta, junto dos que já existem para `redigir`:

```ts
it('escreve a sigla do subgênero sem abaixar', () => {
  expect(redigir(sorteio, MOLDE, 'FC Militar')).toContain('ficção científica de FC militar.');
});
```

Acrescentar `abaixarNome` ao `import` do arquivo de teste.

- [ ] **Passo 2: rodar e ver falhar**

Roda: `npx vitest run src/lib/gerador/redacao.test.ts`
Esperado: FALHA — `abaixarNome is not a function`.

- [ ] **Passo 3: implementar**

Em `src/lib/gerador/redacao.ts`, acima de `VALOR`:

```ts
/* O nome do subgênero entra na premissa em minúscula ("Space Opera" vira "space
   opera"), mas sigla não se abaixa: "FC Militar" viraria "fc militar", que lê
   como erro de digitação. Palavra toda maiúscula fica intacta; o resto abaixa.

   `nome` pode trazer mais de um subgênero unido por " + ", quando "Misturar
   subgêneros" está ligado — a divisão por espaço já cobre esse caso, e o "+"
   passa intacto por não ter letra minúscula para trocar. */
export function abaixarNome(nome: string): string {
  return nome
    .split(' ')
    .map((palavra) => (palavra === palavra.toLocaleUpperCase('pt-BR') ? palavra : palavra.toLocaleLowerCase('pt-BR')))
    .join(' ');
}
```

E trocar a linha do marcador para usá-la:

```ts
  '{subgenero}': (_, subgenero) => abaixarNome(subgenero),
```

- [ ] **Passo 4: rodar e ver passar**

Roda: `npx vitest run src/lib/gerador/redacao.test.ts`
Esperado: PASSA, incluindo os testes que já existiam.

- [ ] **Passo 5: exportar no ponto de entrada**

Em `src/lib/gerador/index.ts`, acrescentar `abaixarNome` à linha que já exporta
`contrair, partes, redigir` de `./redacao`.

- [ ] **Passo 6: rodar a suíte inteira e o check**

Roda: `npx vitest run && npm run check`
Esperado: tudo verde.

- [ ] **Passo 7: commit**

```bash
git add src/lib/gerador/redacao.ts src/lib/gerador/redacao.test.ts src/lib/gerador/index.ts
git commit -m "Ensina o gerador a não abaixar sigla de subgênero"
```

---

## Tarefa 2: FC Militar — o subgênero e os 11 arquétipos

**Arquivos:**
- Criar: `src/content/subgeneros/fc-militar.md`
- Criar: 11 arquivos em `src/content/arquetipos/fc-militar/`
- Modificar: `src/content/subgeneros/comuns.md` (ordem 7 → 11)

**Interfaces:**
- Consome: nada.
- Produz: o identificador `fc-militar`, usado como `subgenero` por toda entrada
  das Tarefas 3, 4 e 5.

- [ ] **Passo 1: mover o pool dos comuns para o fim da fila**

Em `src/content/subgeneros/comuns.md`, trocar `ordem: 7` por `ordem: 11`. Sem
isso o pool aparece no meio dos subgêneros novos nos índices — ele sempre foi o
último.

- [ ] **Passo 2: criar o subgênero**

`src/content/subgeneros/fc-militar.md`:

```markdown
---
nome: "FC Militar"
ordem: 7
completo: true
aurora: ["#2f6b4f", "#c8b47a", "#ff5f45"]
citacao: "A violência, a força nua, resolveu mais questões na história do que qualquer outro fator."
citacaoAutor: "Robert A. Heinlein"
aberturaArquetipos: "<um parágrafo, escrito na execução>"
aberturaCenarios: "<um parágrafo, escrito na execução>"
aberturaElementos: "<um parágrafo, escrito na execução>"
---

<um parágrafo descrevendo o subgênero, escrito na execução>
```

As três aberturas seguem a forma dos seis subgêneros que já existem: começam com
"Nesse subgênero, ...", citam **três** verbetes daquela página pelo nome e
terminam dizendo o que aquele tipo de verbete decide na história. As três
precisam nomear verbetes que existem — as dos cenários e dos elementos só podem
ser escritas depois das Tarefas 3 e 4, então este passo deixa as duas com uma
frase provisória e a Tarefa 4 fecha as três.

- [ ] **Passo 3: criar os 11 arquétipos**

Um arquivo por linha da tabela, em `src/content/arquetipos/fc-militar/`, com o
nome do arquivo em minúsculas e hífens (`recruta-em-combate.md`). O corpo é o
texto da autora, um parágrafo, com maiúscula e ponto.

| Ordem | Nome | `artigo` | Corpo (da autora) |
|---|---|---|---|
| 1 | Recruta em Combate | o | Entra na cadeia de comando do zero e aprende a sobreviver e a obedecer sob disciplina militar. |
| 2 | Sargento Endurecido | o | Veterano de várias campanhas, treina os novatos com dureza e esconde trauma atrás da rotina. |
| 3 | Comandante Estratégico | o | Planeja operações em larga escala, sacrifica peças no tabuleiro para vencer a guerra. |
| 4 | Alto Comando Corrupto | o | Oficiais de cúpula que tratam a tropa como recurso descartável, movidos por política ou ambição. |
| 5 | Atirador de Elite | o | Especialista solitário em eliminação à distância, disciplina fria, isolado do resto do pelotão. |
| 6 | Soldado de Armadura Pesada | o | Infantaria blindada em exoesqueleto, linha de frente contra inimigos avassaladores. |
| 7 | Cientista de Guerra | o | Desenvolve armas ou tecnologia militar, em tensão constante com os comandantes sobre o uso do que cria. |
| 8 | Mercenário Desiludido | o | Soldado de aluguel cínico, luta por contrato e não por bandeira, mas segue um código próprio. |
| 9 | Esquadrão Sacrificável | o | Grupo de condenados enviado para missões suicidas, os únicos com "nada a perder". |
| 10 | Desertor em Fuga | o | Abandona a cadeia de comando após um ato de consciência, agora caçado pelos próprios. |
| 11 | Mascote de Trincheira | o | Gato adotado pelo pelotão como amuleto de sorte, sobrevive a cada missão contra todas as probabilidades e é o único capaz de acalmar os nervos da tropa antes do combate. |

O frontmatter de cada um, com o felino como exceção:

```markdown
---
nome: "Recruta em Combate"
artigo: o
subgenero: fc-militar
ordem: 1
felino: false
---
```

O de ordem 11 leva `felino: true` e **não** leva `ilustracao` nem
`ilustracaoAlt`: os quatro gatos novos entram sem desenho, e o esquema recusa um
dos dois campos sem o outro.

Atenção ao nome do quinto: a autora escreveu "Atiradora de Elite" e a
normalização de gênero decidida na spec o traz para "Atirador de Elite", com
`artigo: o`. O corpo acompanha ("Especialista solitário", não "solitária").

- [ ] **Passo 4: validar o conteúdo**

Roda: `rm -rf .astro && npm run build`
Esperado: build completo, e a contagem de páginas sobe de 34 para **38**: as
quatro rotas de um subgênero nascem junto com este arquivo, porque os
`getStaticPaths` filtram por `completo: true` e não pela existência de verbete.
`/cenarios/fc-militar/` e `/elementos/fc-militar/` nascem vazias e enchem nas
Tarefas 3 e 4.

Se o Zod reclamar, a mensagem diz o arquivo e o campo. Erro provável: esquecer
`artigo`, que não tem padrão.

- [ ] **Passo 5: olhar as duas páginas**

Roda: `npm run dev`
Confere em `/arquetipos/fc-militar/`: os 11 verbetes na ordem certa, o felino por
último com a etiqueta, a aurora verde e vermelha no fundo, a epígrafe de Heinlein
no fim e a fileira agora com sete pílulas.
Confere em `/subgeneros/fc-militar/`: os três primeiros arquétipos na amostra, e
as seções de cenários e elementos ainda vazias — elas enchem nas Tarefas 3 e 4.

- [ ] **Passo 6: commit**

```bash
git add src/content/subgeneros/fc-militar.md src/content/subgeneros/comuns.md src/content/arquetipos/fc-militar/
git commit -m "Acrescenta o subgênero FC Militar e seus 11 arquétipos"
```

---

## Tarefa 3: FC Militar — os 10 cenários

**Arquivos:**
- Criar: 10 arquivos em `src/content/cenarios/fc-militar/`

**Interfaces:**
- Consome: o identificador `fc-militar` da Tarefa 2.
- Produz: 10 locais para o sorteio do gerador — o campo `singular` de cada um é o
  que entra na premissa como `{em:local}`.

- [ ] **Passo 1: criar os 10 cenários**

Cenário é **onde**, nunca condição nem força — é o critério de
[revisao-de-repeticoes.md](../../revisao-de-repeticoes.md), e a revisão inteira
nasceu de "cenários" que eram condição.

| Ordem | Título | `singular` |
|---|---|---|
| 1 | Trincheiras orbitais | uma trincheira orbital |
| 2 | Naves de desembarque | uma nave de desembarque |
| 3 | Bases avançadas em planeta hostil | uma base avançada em planeta hostil |
| 4 | Centros de comando blindados | um centro de comando blindado |
| 5 | Campos de treinamento | um campo de treinamento |
| 6 | Hospitais de campanha | um hospital de campanha |
| 7 | Zonas desmilitarizadas | uma zona desmilitarizada |
| 8 | Depósitos de suprimento sitiados | um depósito de suprimento sitiado |
| 9 | Cidades sob ocupação militar | uma cidade sob ocupação militar |
| 10 | Cemitérios de naves | um cemitério de naves |

Frontmatter:

```markdown
---
titulo: "Trincheiras orbitais"
singular: "uma trincheira orbital"
subgenero: fc-militar
ordem: 1
---

<um parágrafo, escrito na execução: o que é o lugar e o que ele faz com quem
está dentro dele>
```

- [ ] **Passo 2: validar**

Roda: `npm run build`
Esperado: build completo, ainda 38 páginas — `/cenarios/fc-militar/` já existe
desde a Tarefa 2 e agora deixa de estar vazia.
Erro provável: `singular` que não começa com "um " ou "uma " — o esquema recusa.

- [ ] **Passo 3: conferir no gerador**

Roda: `npm run dev` e abre `/gerador/`, escolhe FC Militar, gera algumas vezes.
Confere que a linha do local sai contraída e legível: "Tudo começa **numa**
trincheira orbital.", "Tudo começa **num** centro de comando blindado."

- [ ] **Passo 4: commit**

```bash
git add src/content/cenarios/fc-militar/
git commit -m "Escreve os dez cenários de FC Militar"
```

---

## Tarefa 4: FC Militar — os 10 elementos e as três aberturas

**Arquivos:**
- Criar: 10 arquivos em `src/content/elementos/fc-militar/`
- Modificar: `src/content/subgeneros/fc-militar.md` (as três aberturas)

**Interfaces:**
- Consome: `fc-militar` da Tarefa 2 e os cenários da Tarefa 3, que as aberturas
  citam pelo nome.
- Produz: o subgênero completo, pronto para a leitura da autora.

- [ ] **Passo 1: criar os 10 elementos**

Elemento é **o quê** ou **que força** — tecnologia, conflito, ideia, pressão.
Nunca um lugar.

| Ordem | Título |
|---|---|
| 1 | Cadeia de comando e insubordinação |
| 2 | Ordem que ninguém quer cumprir |
| 3 | Armamento experimental em teste de campo |
| 4 | Perdas aceitáveis |
| 5 | Propaganda de recrutamento |
| 6 | Trauma de combate |
| 7 | Regras de engajamento |
| 8 | Guerra por procuração |
| 9 | Lealdade ao pelotão acima da bandeira |
| 10 | Rendição negociada |

Frontmatter:

```markdown
---
titulo: "Cadeia de comando e insubordinação"
subgenero: fc-militar
ordem: 1
---

<um parágrafo, escrito na execução>
```

- [ ] **Passo 2: fechar as três aberturas do subgênero**

Voltar em `src/content/subgeneros/fc-militar.md` e escrever as três de verdade,
cada uma citando três verbetes que agora existem — três arquétipos em
`aberturaArquetipos`, três cenários em `aberturaCenarios`, três elementos em
`aberturaElementos`.

O esquema é `.strict()`: um `aberturaCenários` com acento seria descartado em
silêncio e a página abriria sem parágrafo. Conferir os três nomes de campo letra
por letra.

- [ ] **Passo 3: validar**

Roda: `rm -rf .astro && npm run build`
Esperado: 38 páginas, as mesmas da Tarefa 2. O `rm -rf .astro` aqui não é zelo: as aberturas mudaram
depois de o servidor já ter lido o arquivo uma vez.

- [ ] **Passo 4: olhar as quatro páginas do subgênero**

Roda: `npm run dev`
Confere `/arquetipos/fc-militar/`, `/cenarios/fc-militar/`,
`/elementos/fc-militar/` e `/subgeneros/fc-militar/`: cada catálogo abre com o seu
parágrafo, os três verbetes citados aparecem logo abaixo, e a porta de entrada
mostra três de cada tipo.

- [ ] **Passo 5: commit**

```bash
git add src/content/elementos/fc-militar/ src/content/subgeneros/fc-militar.md
git commit -m "Escreve os dez elementos de FC Militar e fecha as aberturas"
```

---

## Tarefa 5: FC Militar — as 10 profissões do gerador

**Arquivos:**
- Modificar: `src/lib/gerador/profissoes.ts`
- Modificar: `src/lib/gerador/dados.test.ts`

**Interfaces:**
- Consome: `fc-militar`.
- Produz: `PROFISSOES` com 70 entradas, dez com `subgenero: 'fc-militar'`.

- [ ] **Passo 1: atualizar o teste primeiro**

Em `src/lib/gerador/dados.test.ts`: acrescentar `'fc-militar'` à constante
`SUBGENEROS` e trocar `expect(PROFISSOES).toHaveLength(60)` por `70`.

- [ ] **Passo 2: rodar e ver falhar**

Roda: `npx vitest run src/lib/gerador/dados.test.ts`
Esperado: FALHA — 60 profissões onde se esperava 70, e nenhuma com
`subgenero: 'fc-militar'`.

- [ ] **Passo 3: escrever as dez profissões**

No fim de `PROFISSOES`, em `src/lib/gerador/profissoes.ts`:

```ts
  { nome: 'Mecânico(a) de Exoesqueleto', subgenero: 'fc-militar', descricao: 'Quem mantém a armadura pesada de pé entre uma missão e outra.' },
  { nome: 'Paramédico(a) de Combate', subgenero: 'fc-militar', descricao: 'Socorrista que trabalha sob fogo, com o que couber na mochila.' },
  { nome: 'Operador(a) de Radar', subgenero: 'fc-militar', descricao: 'Vigia de turno que lê no ruído da tela o que ainda não apareceu.' },
  { nome: 'Cozinheiro(a) de Rancho', subgenero: 'fc-militar', descricao: 'Alimenta o pelotão inteiro e ouve tudo o que se fala na fila.' },
  { nome: 'Sapador(a)', subgenero: 'fc-militar', descricao: 'Abre caminho e desarma o que foi deixado para trás para matar.' },
  { nome: 'Piloto de Transporte de Tropa', subgenero: 'fc-militar', descricao: 'Leva gente para a zona de pouso e tenta trazer todo mundo de volta.' },
  { nome: 'Intendente', subgenero: 'fc-militar', descricao: 'Controla munição, ração e peça de reposição — e decide quem recebe primeiro.' },
  { nome: 'Instrutor(a) de Recrutas', subgenero: 'fc-militar', descricao: 'Transforma civil em soldado no prazo curto que a guerra permite.' },
  { nome: 'Correspondente de Guerra', subgenero: 'fc-militar', descricao: 'Acompanha a tropa para contar o que acontece, sob censura do comando.' },
  { nome: 'Capelão(ã) Militar', subgenero: 'fc-militar', descricao: 'Escuta confissão antes do combate e enterra quem não voltou.' },
```

**Profissão é ofício, não função narrativa.** Nenhuma delas repete um arquétipo
da Tarefa 2: o catálogo tem o Sargento e o Comandante, e o gerador tem quem
conserta a armadura, cozinha e enterra os mortos. É o que impede o guia de virar
um segundo catálogo de "quem".

Regras de concordância que valem aqui: o "(a)" marca substantivo e adjetivo
("Mecânico(a)"), palavra invariável fica limpa ("Intendente", "Correspondente de
Guerra"), e a `descricao` é frase inteira no singular, com ponto final.

- [ ] **Passo 4: rodar e ver passar**

Roda: `npx vitest run && npm run check`
Esperado: tudo verde.

- [ ] **Passo 5: rolar o gerador**

Roda: `npm run dev` e abre `/gerador/` em FC Militar. Gera dez vezes.
Confere: a primeira linha diz "Essa é uma ficção científica de **FC militar**."
(Tarefa 1), os dois personagens nunca saem com a mesma profissão, e o guia em
`/guia-de-personagens/` mostra a sétima seção com as dez descrições.

- [ ] **Passo 6: commit**

```bash
git add src/lib/gerador/profissoes.ts src/lib/gerador/dados.test.ts
git commit -m "Acrescenta as dez profissões de FC Militar ao gerador"
```

---

## Portão: a autora lê FC Militar

**Parar aqui.** O subgênero está completo — 11 arquétipos, 10 cenários, 10
elementos, 10 profissões, três aberturas e a epígrafe. É o ponto combinado na
spec para a autora ler o tom antes de os outros três serem escritos.

Mostrar com o site rodando: `/arquetipos/fc-militar/`, `/cenarios/fc-militar/`,
`/elementos/fc-militar/`, `/subgeneros/fc-militar/` e o gerador rolado algumas
vezes naquele subgênero.

Se o tom precisar mudar, muda **aqui**, em 41 verbetes, e as Tarefas 6 a 17
nascem já corrigidas.

---

## Tarefa 6: FC Climática — o subgênero e os 11 arquétipos

**Arquivos:**
- Criar: `src/content/subgeneros/fc-climatica.md`
- Criar: 11 arquivos em `src/content/arquetipos/fc-climatica/`

**Interfaces:**
- Consome: nada das tarefas anteriores.
- Produz: o identificador `fc-climatica`, usado como `subgenero` nas Tarefas 7, 8 e 9.

- [ ] **Passo 1: criar o subgênero**

`src/content/subgeneros/fc-climatica.md`:

```markdown
---
nome: "FC Climática"
ordem: 8
completo: true
aurora: ["#ffb03a", "#1c5e8f", "#c8b47a"]
citacao: "A crise climática é também uma crise da cultura, e portanto da imaginação."
citacaoAutor: "Amitav Ghosh"
aberturaArquetipos: "<um parágrafo, escrito na execução>"
aberturaCenarios: "<provisório; a Tarefa 8 fecha>"
aberturaElementos: "<provisório; a Tarefa 8 fecha>"
---

<um parágrafo descrevendo o subgênero, escrito na execução>
```

- [ ] **Passo 2: criar os 11 arquétipos**

Em `src/content/arquetipos/fc-climatica/`, um arquivo por linha:

| Ordem | Nome | `artigo` | Corpo (da autora) |
|---|---|---|---|
| 1 | Cientista Dissidente | o | Climatologista que soa o alarme e é ignorado ou perseguido por instituições que preferem não agir. |
| 2 | Refugiado Climático | o | Desloca-se por causa de enchentes, secas ou colapso agrícola, atravessa fronteiras hostis em busca de terra habitável. |
| 3 | Executivo Poluidor | o | Dirige uma corporação que lucra com a destruição ambiental, minimiza riscos publicamente sabendo a verdade internamente. |
| 4 | Ativista Radical | o | Sabota infraestrutura ou empresas poluidoras, disposto a métodos extremos diante da inércia política. |
| 5 | Barão dos Recursos | o | Controla água, alimento ou energia num mundo de escassez, decide quem sobrevive através do preço. |
| 6 | Jovem Geração Cobrando Contas | a | Enfrenta os adultos responsáveis pela crise, carrega o peso de um futuro que não escolheu. |
| 7 | Engenheiro de Geoengenharia | o | Implementa soluções técnicas de larga escala, como captura de carbono ou gestão solar, com consequências imprevisíveis. |
| 8 | Guardião do Saber Ancestral | o | Comunidade indígena ou tradicional cujo saber de adaptação territorial se torna essencial para a sobrevivência coletiva. |
| 9 | Sobrevivente Enlutado pela Paisagem | o | Carrega solastalgia — o luto por uma terra ou clima que já não existe mais como era. |
| 10 | Organizador da Adaptação Local | o | Organiza uma comunidade resiliente em meio ao caos institucional, com foco em adaptação local e cooperação. |
| 11 | Gato das Marés | o | Felino que se adapta às inundações cíclicas da cidade afogada, subindo e descendo entre telhados submersos — sobrevivente silencioso que os moradores tomam como sinal de que a vida ainda encontra um jeito. |

Frontmatter igual ao da Tarefa 2 (`nome`, `artigo`, `subgenero: fc-climatica`,
`ordem`, `felino`), com `felino: true` só no de ordem 11 e sem ilustração.

Quatro nomes e dois corpos mudaram em relação ao que a autora mandou, pela
normalização de gênero decidida na spec: "Refugiada Climática" virou "Refugiado
Climático", "Engenheira de Geoengenharia" virou "Engenheiro", "Sobrevivente
Enlutada" virou "Enlutado" e "disposta a métodos extremos" virou "disposto". Os
dois renomeados por colisão — "Guardiã do Conhecimento Ancestral" para "Guardião
do Saber Ancestral" e "Líder Comunitário Pós-Colapso" para "Organizador da
Adaptação Local" — são decisão da autora, registrada na seção 9 da spec.

"Jovem Geração Cobrando Contas" fica com `artigo: a` porque o substantivo é
feminino, como IA Emergente e Criança das Ruínas.

- [ ] **Passo 3: validar**

Roda: `rm -rf .astro && npm run build`
Esperado: build completo, mais duas páginas.

- [ ] **Passo 4: commit**

```bash
git add src/content/subgeneros/fc-climatica.md src/content/arquetipos/fc-climatica/
git commit -m "Acrescenta o subgênero FC Climática e seus 11 arquétipos"
```

---

## Tarefa 7: FC Climática — os 10 cenários

**Arquivos:**
- Criar: 10 arquivos em `src/content/cenarios/fc-climatica/`

**Interfaces:**
- Consome: `fc-climatica` da Tarefa 6.
- Produz: 10 locais para o sorteio.

- [ ] **Passo 1: criar os 10 cenários**

| Ordem | Título | `singular` |
|---|---|---|
| 1 | Cidades afogadas pela maré | uma cidade afogada pela maré |
| 2 | Acampamentos de deslocados pela seca | um acampamento de deslocados pela seca |
| 3 | Fazendas verticais sob cúpula | uma fazenda vertical sob cúpula |
| 4 | Reservatórios com guarda armada | um reservatório com guarda armada |
| 5 | Litorais em recuo | um litoral em recuo |
| 6 | Florestas queimadas | uma floresta queimada |
| 7 | Estações de captura de carbono | uma estação de captura de carbono |
| 8 | Bairros com muro contra a água | um bairro com muro contra a água |
| 9 | Rotas de migração sazonal | uma rota de migração sazonal |
| 10 | Bancos de sementes | um banco de sementes |

Frontmatter igual ao da Tarefa 3, com `subgenero: fc-climatica`.

O segundo se chama "Acampamentos de deslocados pela seca", e não "Campos de
refugiados climáticos", para não colidir com "Campos de refugiados", que já
existe em Invasão Alienígena.

- [ ] **Passo 2: validar e conferir a contração**

Roda: `npm run build`, depois `npm run dev` e o gerador em FC Climática.
Confere: "Tudo começa **numa** cidade afogada pela maré.", "Tudo começa **num**
banco de sementes."

- [ ] **Passo 3: commit**

```bash
git add src/content/cenarios/fc-climatica/
git commit -m "Escreve os dez cenários de FC Climática"
```

---

## Tarefa 8: FC Climática — os 10 elementos e as três aberturas

**Arquivos:**
- Criar: 10 arquivos em `src/content/elementos/fc-climatica/`
- Modificar: `src/content/subgeneros/fc-climatica.md`

**Interfaces:**
- Consome: `fc-climatica`, os cenários da Tarefa 7 e os arquétipos da Tarefa 6.
- Produz: o subgênero completo.

- [ ] **Passo 1: criar os 10 elementos**

| Ordem | Título |
|---|---|
| 1 | Escassez de água potável |
| 2 | Negacionismo institucional |
| 3 | Geoengenharia de consequência imprevisível |
| 4 | Solastalgia |
| 5 | Migração em massa |
| 6 | Crédito de carbono como moeda |
| 7 | Colapso agrícola |
| 8 | Saber tradicional de adaptação |
| 9 | Litígio climático |
| 10 | Racionamento por classe |

"Solastalgia" repete de propósito a palavra que aparece no corpo do arquétipo
Sobrevivente Enlutado pela Paisagem: é o par **quem × que força** que a grade de
duas dimensões existe para permitir, como Refugiado da Invasão × Campos de
refugiados. A Tarefa 18 registra isso na revisão de repetições.

- [ ] **Passo 2: fechar as três aberturas**

Como no Passo 2 da Tarefa 4: cada uma cita três verbetes que agora existem, e os
três nomes de campo (`aberturaArquetipos`, `aberturaCenarios`,
`aberturaElementos`) precisam estar sem acento e exatos, porque o esquema é
`.strict()`.

- [ ] **Passo 3: validar e olhar**

Roda: `rm -rf .astro && npm run build && npm run dev`
Confere as quatro páginas de `fc-climatica`, com a aurora âmbar e azul.

- [ ] **Passo 4: commit**

```bash
git add src/content/elementos/fc-climatica/ src/content/subgeneros/fc-climatica.md
git commit -m "Escreve os dez elementos de FC Climática e fecha as aberturas"
```

---

## Tarefa 9: FC Climática — as 10 profissões do gerador

**Arquivos:**
- Modificar: `src/lib/gerador/profissoes.ts`, `src/lib/gerador/dados.test.ts`

**Interfaces:**
- Produz: `PROFISSOES` com 80 entradas.

- [ ] **Passo 1: atualizar o teste primeiro**

Acrescentar `'fc-climatica'` a `SUBGENEROS` e trocar `70` por `80`.

- [ ] **Passo 2: rodar e ver falhar**

Roda: `npx vitest run src/lib/gerador/dados.test.ts` — FALHA.

- [ ] **Passo 3: escrever as dez profissões**

```ts
  { nome: 'Hidrólogo(a)', subgenero: 'fc-climatica', descricao: 'Mede o que resta de água doce e diz a verdade que ninguém quer ouvir.' },
  { nome: 'Engenheiro(a) de Diques', subgenero: 'fc-climatica', descricao: 'Levanta e remenda a barreira que segura o mar fora da cidade.' },
  { nome: 'Agrônomo(a) de Cultivo Resistente', subgenero: 'fc-climatica', descricao: 'Procura a semente que ainda germina no clima que chegou.' },
  { nome: 'Brigadista Florestal', subgenero: 'fc-climatica', descricao: 'Enfrenta o fogo em temporada que já não tem começo nem fim.' },
  { nome: 'Piloto de Drone de Semeadura', subgenero: 'fc-climatica', descricao: 'Replanta encosta inteira do ar, onde ninguém consegue subir a pé.' },
  { nome: 'Perito(a) em Seguro Climático', subgenero: 'fc-climatica', descricao: 'Calcula o preço do desastre e decide o que a apólice ainda cobre.' },
  { nome: 'Coletor(a) de Água de Neblina', subgenero: 'fc-climatica', descricao: 'Tira do ar úmido o que a chuva parou de trazer.' },
  { nome: 'Guarda de Reservatório', subgenero: 'fc-climatica', descricao: 'Vigia o que virou a coisa mais valiosa da região.' },
  { nome: 'Meteorologista de Emergência', subgenero: 'fc-climatica', descricao: 'Decide a hora de mandar uma cidade inteira sair de casa.' },
  { nome: 'Mediador(a) de Reassentamento', subgenero: 'fc-climatica', descricao: 'Negocia para onde vai quem perdeu o lugar onde morava.' },
```

Nenhuma repete arquétipo: o catálogo tem o Cientista Dissidente e o Engenheiro de
Geoengenharia; o gerador tem quem mede, remenda, replanta e vigia.

- [ ] **Passo 4: rodar e ver passar**

Roda: `npx vitest run && npm run check` — verde.

- [ ] **Passo 5: commit**

```bash
git add src/lib/gerador/profissoes.ts src/lib/gerador/dados.test.ts
git commit -m "Acrescenta as dez profissões de FC Climática ao gerador"
```

---

## Tarefa 10: Primeiro Contato — o subgênero e os 11 arquétipos

**Arquivos:**
- Criar: `src/content/subgeneros/primeiro-contato.md`
- Criar: 11 arquivos em `src/content/arquetipos/primeiro-contato/`

**Interfaces:**
- Produz: o identificador `primeiro-contato`.

- [ ] **Passo 1: criar o subgênero**

```markdown
---
nome: "Primeiro Contato"
ordem: 9
completo: true
aurora: ["#35e5f0", "#1c5e8f", "#ffd66e"]
citacao: "Se somos os únicos, é um desperdício enorme de espaço."
citacaoAutor: "Carl Sagan"
aberturaArquetipos: "<um parágrafo, escrito na execução>"
aberturaCenarios: "<provisório; a Tarefa 12 fecha>"
aberturaElementos: "<provisório; a Tarefa 12 fecha>"
---

<um parágrafo descrevendo o subgênero, escrito na execução>
```

A aurora é vizinha da de Invasão Alienígena de propósito — os dois falam de
chegada —, e o que separa é a areia `#ffd66e` no lugar do verde-limão.

- [ ] **Passo 2: criar os 11 arquétipos**

| Ordem | Nome | `artigo` | Corpo (da autora) |
|---|---|---|---|
| 1 | Linguista Decifrador | o | Decodifica a linguagem alienígena, ponte cognitiva entre as duas espécies, motor de toda a comunicação. |
| 2 | Cientista Cético | o | Astrônomo ou físico que capta o primeiro sinal, exige provas, resiste ao sensacionalismo e ao pânico. |
| 3 | Falcão Militar | o | Quer tratar o contato como ameaça, pressiona por resposta armada preventiva, desconfia da boa intenção alienígena. |
| 4 | Embaixador Alienígena | o | Representante da espécie visitante, tenta estabelecer diálogo, muitas vezes incompreendido por motivos culturais. |
| 5 | Multidão em Pânico | a | População civil tomada por histeria coletiva, reage ao desconhecido com violência ou fuga irracional. |
| 6 | Observador Benevolente | o | Entidade alienígena avançada que estuda a humanidade à distância, intervém pouco, motivos ambíguos. |
| 7 | Intermediário Acidental | o | Pessoa comum escolhida pelo acaso para ser o elo entre as espécies, sem preparo, mas com empatia genuína. |
| 8 | Isolacionista Convicto | o | Defende romper contato antes que comece, teme contaminação cultural ou tecnológica irreversível. |
| 9 | Jornalista da Primeira Hora | o | Corre para cobrir o evento, dividido entre furo de reportagem e responsabilidade com o que divulga. |
| 10 | Diplomata Terrestre | o | Representa a humanidade oficialmente, negocia protocolos e limites sob pressão de facções internas. |
| 11 | Guardião do Sinal | o | Gato que reage ao equipamento de comunicação antes de qualquer humano perceber a anomalia, sensível a algo que os instrumentos ainda não captaram. |

Três nomes e um corpo mudaram pela normalização: "Linguista Decifradora" virou
"Decifrador", "Cientista Cética" virou "Cético" — na grafia brasileira, com um
"c" só —, "Intermediária Acidental" virou "Intermediário", e "Astrônoma ou
física" virou "Astrônomo ou físico". "Multidão em Pânico" fica com `artigo: a`.

- [ ] **Passo 3: validar**

Roda: `rm -rf .astro && npm run build`

- [ ] **Passo 4: commit**

```bash
git add src/content/subgeneros/primeiro-contato.md src/content/arquetipos/primeiro-contato/
git commit -m "Acrescenta o subgênero Primeiro Contato e seus 11 arquétipos"
```

---

## Tarefa 11: Primeiro Contato — os 10 cenários

**Arquivos:**
- Criar: 10 arquivos em `src/content/cenarios/primeiro-contato/`

**Interfaces:**
- Consome: `primeiro-contato` da Tarefa 10.
- Produz: 10 locais para o sorteio.

- [ ] **Passo 1: criar os 10 cenários**

| Ordem | Título | `singular` |
|---|---|---|
| 1 | Radiotelescópios em vigília | um radiotelescópio em vigília |
| 2 | Salas de quarentena diplomática | uma sala de quarentena diplomática |
| 3 | Sítios de pouso isolados | um sítio de pouso isolado |
| 4 | Centros de decifração | um centro de decifração |
| 5 | Cúpulas de encontro neutro | uma cúpula de encontro neutro |
| 6 | Órbitas de espera | uma órbita de espera |
| 7 | Praças tomadas pela multidão | uma praça tomada pela multidão |
| 8 | Naves-embaixada | uma nave-embaixada |
| 9 | Bases militares em prontidão | uma base militar em prontidão |
| 10 | Estúdios de transmissão ao vivo | um estúdio de transmissão ao vivo |

"Naves-embaixada" não colide com "Naves-mãe orbitais", de Invasão Alienígena: uma
chega para falar, a outra para tomar. O corpo de cada um precisa deixar isso
claro.

- [ ] **Passo 2: validar e conferir a contração**

Roda: `npm run build`, depois o gerador em Primeiro Contato.
Confere: "Tudo começa **numa** órbita de espera.", "Tudo começa **num**
radiotelescópio em vigília."

- [ ] **Passo 3: commit**

```bash
git add src/content/cenarios/primeiro-contato/
git commit -m "Escreve os dez cenários de Primeiro Contato"
```

---

## Tarefa 12: Primeiro Contato — os 10 elementos e as três aberturas

**Arquivos:**
- Criar: 10 arquivos em `src/content/elementos/primeiro-contato/`
- Modificar: `src/content/subgeneros/primeiro-contato.md`

**Interfaces:**
- Consome: os cenários da Tarefa 11 e os arquétipos da Tarefa 10.
- Produz: o subgênero completo.

- [ ] **Passo 1: criar os 10 elementos**

| Ordem | Título |
|---|---|
| 1 | Barreira linguística |
| 2 | Protocolo de contato |
| 3 | Silêncio de rádio |
| 4 | Choque cultural |
| 5 | Exigência de prova extraordinária |
| 6 | Medo do desconhecido |
| 7 | Tradução malfeita |
| 8 | Assimetria tecnológica |
| 9 | Vazamento de informação |
| 10 | A primeira imagem divulgada |

- [ ] **Passo 2: fechar as três aberturas**

Cada uma citando três verbetes que agora existem, com os nomes de campo exatos e
sem acento.

- [ ] **Passo 3: validar e olhar**

Roda: `rm -rf .astro && npm run build && npm run dev`, e as quatro páginas.

- [ ] **Passo 4: commit**

```bash
git add src/content/elementos/primeiro-contato/ src/content/subgeneros/primeiro-contato.md
git commit -m "Escreve os dez elementos de Primeiro Contato e fecha as aberturas"
```

---

## Tarefa 13: Primeiro Contato — as 10 profissões do gerador

**Arquivos:**
- Modificar: `src/lib/gerador/profissoes.ts`, `src/lib/gerador/dados.test.ts`

**Interfaces:**
- Produz: `PROFISSOES` com 90 entradas.

- [ ] **Passo 1: atualizar o teste primeiro**

Acrescentar `'primeiro-contato'` a `SUBGENEROS` e trocar `80` por `90`.

- [ ] **Passo 2: rodar e ver falhar**

Roda: `npx vitest run src/lib/gerador/dados.test.ts` — FALHA.

- [ ] **Passo 3: escrever as dez profissões**

```ts
  { nome: 'Radioastrônomo(a)', subgenero: 'primeiro-contato', descricao: 'Passa a carreira ouvindo o céu e um dia escuta resposta.' },
  { nome: 'Analista de Sinais', subgenero: 'primeiro-contato', descricao: 'Separa o que é ruído do que tem intenção dentro.' },
  { nome: 'Tradutor(a) Simultâneo(a)', subgenero: 'primeiro-contato', descricao: 'Verte em tempo real uma fala que ninguém garante ter entendido.' },
  { nome: 'Chefe de Protocolo', subgenero: 'primeiro-contato', descricao: 'Decide quem cumprimenta quem primeiro, quando não há precedente nenhum.' },
  { nome: 'Assessor(a) de Imprensa', subgenero: 'primeiro-contato', descricao: 'Escolhe o que o público sabe e a que horas fica sabendo.' },
  { nome: 'Bioeticista', subgenero: 'primeiro-contato', descricao: 'Pergunta o que é permitido fazer com o visitante — e com quem o recebe.' },
  { nome: 'Operador(a) de Antena', subgenero: 'primeiro-contato', descricao: 'Aponta o prato e mantém o enlace de pé no turno da madrugada.' },
  { nome: 'Psicólogo(a) de Crise', subgenero: 'primeiro-contato', descricao: 'Cuida de quem viu primeiro e não conseguiu voltar a dormir.' },
  { nome: 'Documentarista', subgenero: 'primeiro-contato', descricao: 'Registra tudo, porque isso vai ser a memória da espécie.' },
  { nome: 'Segurança de Perímetro', subgenero: 'primeiro-contato', descricao: 'Mantém a curiosidade humana do lado de fora da cerca.' },
```

- [ ] **Passo 4: rodar e ver passar**

Roda: `npx vitest run && npm run check` — verde.

- [ ] **Passo 5: commit**

```bash
git add src/lib/gerador/profissoes.ts src/lib/gerador/dados.test.ts
git commit -m "Acrescenta as dez profissões de Primeiro Contato ao gerador"
```

---

## Tarefa 14: Biopunk — o subgênero e os 11 arquétipos

**Arquivos:**
- Criar: `src/content/subgeneros/biopunk.md`
- Criar: 11 arquivos em `src/content/arquetipos/biopunk/`

**Interfaces:**
- Produz: o identificador `biopunk`.

- [ ] **Passo 1: criar o subgênero**

```markdown
---
nome: "Biopunk"
ordem: 10
completo: true
aurora: ["#6ee7a0", "#ff2d92", "#7c3aed"]
citacao: "Você é meu criador, mas eu sou seu senhor."
citacaoAutor: "Mary Shelley"
aberturaArquetipos: "<um parágrafo, escrito na execução>"
aberturaCenarios: "<provisório; a Tarefa 16 fecha>"
aberturaElementos: "<provisório; a Tarefa 16 fecha>"
---

<um parágrafo descrevendo o subgênero, escrito na execução>
```

- [ ] **Passo 2: criar os 11 arquétipos**

| Ordem | Nome | `artigo` | Corpo (da autora) |
|---|---|---|---|
| 1 | Bio-hacker Rebelde | o | Ativista que modifica DNA fora da lei, luta contra corporações que monopolizam o material genético. |
| 2 | Geneticista Renegado | o | Cientista que rompeu com a corporação ou o governo, conhecimento perigoso, motivado por ambição ou remorso. |
| 3 | Corpo Modificado | o | Personagem alterado, aprimorado ou danificado por biotecnologia — encarna o preço físico do avanço científico. |
| 4 | Executor de Patentes | o | Agente de segurança biotech, protege patentes genéticas e elimina ameaças ao monopólio da empresa. |
| 5 | Híbrido Rejeitado | o | Ser humano-animal ou humano-sintético, cidadão de segunda classe, vive à margem por causa da própria origem. |
| 6 | Bebê de Design | o | Geneticamente otimizado antes de nascer, carrega as expectativas e falhas do projeto que o criou. |
| 7 | Traficante de Genes | o | Comercializa material genético raro ou ilegal no mercado negro, informação biológica como moeda de poder. |
| 8 | Vítima de Praga Sintética | a | Sobrevivente ou infectada por um patógeno bioengenheirado escapado de laboratório, o corpo como campo de batalha. |
| 9 | Curandeiro Clandestino | o | Opera clínica ilegal de modificações corporais, trata quem a medicina oficial recusa ou explora. |
| 10 | Mutação Descontrolada | a | Resultado de um experimento que fugiu ao controle — força da natureza imprevisível dentro da trama. |
| 11 | Felino Modificado | o | Gato geneticamente alterado, com traços aumentados como inteligência ou regeneração — produto de laboratório que escapou e agora vive por conta própria. |

Duas coisas para não errar aqui:

- O de ordem 4 é **Executor de Patentes**, e não "Executor Corporativo" como a
  autora escreveu: ela renomeou para não ficar a uma letra do "Executivo
  Corporativo" do Cyberpunk. O corpo continua o dela, intacto.
- O de ordem 8 tem `artigo: a` porque "vítima" é feminino, e o corpo acompanha —
  "Sobrevivente ou **infectada**", não "infectado". Mesmo caso do de ordem 10.

- [ ] **Passo 3: validar**

Roda: `rm -rf .astro && npm run build`

- [ ] **Passo 4: commit**

```bash
git add src/content/subgeneros/biopunk.md src/content/arquetipos/biopunk/
git commit -m "Acrescenta o subgênero Biopunk e seus 11 arquétipos"
```

---

## Tarefa 15: Biopunk — os 10 cenários

**Arquivos:**
- Criar: 10 arquivos em `src/content/cenarios/biopunk/`

**Interfaces:**
- Consome: `biopunk` da Tarefa 14.
- Produz: 10 locais para o sorteio.

- [ ] **Passo 1: criar os 10 cenários**

| Ordem | Título | `singular` |
|---|---|---|
| 1 | Laboratórios clandestinos | um laboratório clandestino |
| 2 | Fazendas de tecido | uma fazenda de tecido |
| 3 | Clínicas de porão | uma clínica de porão |
| 4 | Bancos genéticos corporativos | um banco genético corporativo |
| 5 | Zonas de contenção biológica | uma zona de contenção biológica |
| 6 | Feiras de órgãos sob encomenda | uma feira de órgãos sob encomenda |
| 7 | Estufas de organismos projetados | uma estufa de organismos projetados |
| 8 | Depósitos de descarte biológico | um depósito de descarte biológico |
| 9 | Comunidades de híbridos | uma comunidade de híbridos |
| 10 | Incubadoras corporativas | uma incubadora corporativa |

O sexto é lugar, não força: a feira é onde se negocia. O elemento que trata da
mercantilização do corpo é do Cyberpunk ("Corpos e órgãos como mercadoria") e
continua sendo dele — a sobreposição é **onde × que força**, e é de propósito.

- [ ] **Passo 2: validar e conferir a contração**

Roda: `npm run build`, depois o gerador em Biopunk.
Confere: "Tudo começa **numa** clínica de porão.", "Tudo começa **num**
laboratório clandestino."

- [ ] **Passo 3: commit**

```bash
git add src/content/cenarios/biopunk/
git commit -m "Escreve os dez cenários de Biopunk"
```

---

## Tarefa 16: Biopunk — os 10 elementos e as três aberturas

**Arquivos:**
- Criar: 10 arquivos em `src/content/elementos/biopunk/`
- Modificar: `src/content/subgeneros/biopunk.md`

**Interfaces:**
- Consome: os cenários da Tarefa 15 e os arquétipos da Tarefa 14.
- Produz: o subgênero completo.

- [ ] **Passo 1: criar os 10 elementos**

| Ordem | Título |
|---|---|
| 1 | Patente sobre o vivo |
| 2 | Praga sintética |
| 3 | Consentimento fabricado |
| 4 | Melhoria genética como privilégio |
| 5 | Rejeição do corpo modificado |
| 6 | Mercado negro de material genético |
| 7 | Experimento fora de controle |
| 8 | Linhagem projetada |
| 9 | Terapia inacessível |
| 10 | Contaminação cruzada |

- [ ] **Passo 2: fechar as três aberturas**

Cada uma citando três verbetes que agora existem, com os nomes de campo exatos e
sem acento.

- [ ] **Passo 3: validar e olhar**

Roda: `rm -rf .astro && npm run build && npm run dev`, e as quatro páginas.

- [ ] **Passo 4: commit**

```bash
git add src/content/elementos/biopunk/ src/content/subgeneros/biopunk.md
git commit -m "Escreve os dez elementos de Biopunk e fecha as aberturas"
```

---

## Tarefa 17: Biopunk — as 10 profissões do gerador

**Arquivos:**
- Modificar: `src/lib/gerador/profissoes.ts`, `src/lib/gerador/dados.test.ts`

**Interfaces:**
- Produz: `PROFISSOES` com 100 entradas, dez por subgênero nos dez subgêneros.

- [ ] **Passo 1: atualizar o teste primeiro**

Acrescentar `'biopunk'` a `SUBGENEROS` e trocar `90` por `100`.

- [ ] **Passo 2: rodar e ver falhar**

Roda: `npx vitest run src/lib/gerador/dados.test.ts` — FALHA.

- [ ] **Passo 3: escrever as dez profissões**

```ts
  { nome: 'Biotécnico(a) de Bancada', subgenero: 'biopunk', descricao: 'Executa o protocolo que outra pessoa desenhou e assina o resultado.' },
  { nome: 'Cultivador(a) de Órgãos', subgenero: 'biopunk', descricao: 'Cria tecido humano sob encomenda e conhece o prazo de cada peça.' },
  { nome: 'Perito(a) em Patente Genética', subgenero: 'biopunk', descricao: 'Prova em juízo de quem é a sequência que está dentro de alguém.' },
  { nome: 'Veterinário(a) de Híbridos', subgenero: 'biopunk', descricao: 'Atende o que a medicina humana e a animal recusam por não saber classificar.' },
  { nome: 'Fiscal de Biossegurança', subgenero: 'biopunk', descricao: 'Lacra laboratório e assina o auto que fecha o lugar.' },
  { nome: 'Corretor(a) de Genoma', subgenero: 'biopunk', descricao: 'Aproxima quem tem a sequência rara de quem paga por ela.' },
  { nome: 'Enfermeiro(a) de Clínica Ilegal', subgenero: 'biopunk', descricao: 'Cuida do pós-operatório que nenhum hospital vai registrar.' },
  { nome: 'Analista de Sequenciamento', subgenero: 'biopunk', descricao: 'Lê o genoma inteiro e percebe o que foi acrescentado nele.' },
  { nome: 'Zelador(a) de Biotério', subgenero: 'biopunk', descricao: 'Alimenta e limpa a criação do laboratório, e vê o que ninguém anota.' },
  { nome: 'Entregador(a) de Material Refrigerado', subgenero: 'biopunk', descricao: 'Transporta a caixa fria sem perguntar o que tem dentro.' },
```

- [ ] **Passo 4: rodar e ver passar**

Roda: `npx vitest run && npm run check` — verde.

- [ ] **Passo 5: commit**

```bash
git add src/lib/gerador/profissoes.ts src/lib/gerador/dados.test.ts
git commit -m "Acrescenta as dez profissões de Biopunk ao gerador"
```

---

## Tarefa 18: As contagens e os documentos

Os quatro subgêneros estão no ar; agora os textos que contam o acervo por extenso
param de mentir. Nenhum teste confere estes números — é por isso que eles têm
tarefa própria.

**Arquivos:**
- Modificar: `README.md`
- Modificar: `src/content/paginas/sobre.md`
- Modificar: `src/pages/gerador.astro` (comentário dos cenários)
- Modificar: `src/content/subgeneros/comuns.md` (só se o `nome` precisar mudar)
- Modificar: `src/pages/subgeneros/[subgenero].astro` (dois comentários)
- Modificar: `docs/atributos-do-gerador.md`
- Modificar: `docs/verificacao-visual.md`
- Modificar: `docs/revisao-de-repeticoes.md`
- Modificar: `CLAUDE.md`

- [ ] **Passo 1: achar tudo o que conta o acervo**

Roda:

```bash
grep -rn "76\|seis subgêneros\|dez por subgênero\|60 cenários\|60 elementos\|60 profissões\|32 milhões" README.md CLAUDE.md docs/ src/content/paginas/ src/pages/ src/lib/
```

O resultado é a lista de trabalho deste passo. Os números novos: **10
subgêneros**, **120 arquétipos** (11 por subgênero mais os 10 comuns), **100
cenários**, **100 elementos**, **100 profissões**.

A conta de premissas por subgênero **não muda** — continua 10 × 9 × 30 × 30 × 10
× 40, cerca de 32 milhões —, porque ela é por subgênero, e cada um continua com
dez profissões e dez locais. O que muda é quantos subgêneros existem.

- [ ] **Passo 2: `sobre.md`**

A frase é prosa da autora: "Hoje o site reúne 6 subgêneros de ficção científica,
cada um com 10 arquétipos — mais um felino bônus". Trocar só o número, para 10.
Se a frase pedir mais do que isso, é reescrita da autora, não deste plano.

- [ ] **Passo 3: `atributos-do-gerador.md`**

Acrescentar as 40 profissões novas nas tabelas por subgênero, com a mesma
`descricao` que está em `profissoes.ts` — as duas não podem divergir. Atualizar a
linha da tabela de peças ("Profissão ... (60)" vira 100) e o cabeçalho "Profissões
— 60, dez por subgênero".

- [ ] **Passo 4: `verificacao-visual.md`**

Acrescentar as quatro linhas nas tabelas de contraste, com a pior cor de cada
aurora nova: FC Militar `#c8b47a`, FC Climática `#ffb03a`, Primeiro Contato
`#ffd66e`, Biopunk `#6ee7a0`.

Escrever, junto, por que nenhuma conta foi refeita: as quatro são mais escuras
que o verde-limão `#a6ff6e` da Invasão Alienígena, que segue sendo o pior caso do
site. `#ffb03a` e `#6ee7a0` já têm linha lá (Distopia e Pós Apocalíptico) e os
valores se repetem.

- [ ] **Passo 5: `revisao-de-repeticoes.md`**

Registrar a revisão dos quatro subgêneros novos, com as decisões da seção 9 da
spec: os dois renomeados (Executor de Patentes, Guardião do Saber Ancestral,
Organizador da Adaptação Local) e as sobreposições que ficam de propósito —
Solastalgia × Sobrevivente Enlutado pela Paisagem, os quatro "Cientista X",
Observador Benevolente × Observador Espacial, Feiras de órgãos sob encomenda ×
Corpos e órgãos como mercadoria.

- [ ] **Passo 6: `CLAUDE.md`**

Atualizar as contagens e a lista dos seis subgêneros que aparece em vários
parágrafos, incluindo a frase sobre o felino ("o arquétipo felino dos seis
subgêneros"), que passa a ser dez, e a lista de lugares que envelhecem em
silêncio.

- [ ] **Passo 7: validar**

Roda: `npx vitest run && npm run check && npm run build`
Esperado: tudo verde, **50 páginas** — as 34 de antes mais quatro rotas por
subgênero novo (`/arquetipos/`, `/cenarios/`, `/elementos/` e `/subgeneros/`).

- [ ] **Passo 8: commit**

```bash
git add -A
git commit -m "Atualiza as contagens do acervo para dez subgêneros"
```

---

## Tarefa 19: Verificação final com o site rodando

Nada aqui muda arquivo. É a conferência de olho, que os testes não fazem.

- [ ] **Passo 1: subir o site**

Roda: `rm -rf .astro dist && npm run build && npm run dev`

- [ ] **Passo 2: a fileira de dez pílulas**

Olhar a home, um índice (`/arquetipos/`) e o fim de um catálogo
(`/cenarios/biopunk/`). A fileira passou de seis para dez pílulas e quebra em
mais linhas — conferir que ela continua legível, que a pílula do subgênero aberto
está marcada e que nada estourou a largura da coluna.

Conferir também no **tema claro**, onde a marca do subgênero aberto é a pílula
vazada entre as preenchidas.

- [ ] **Passo 3: o gerador nos quatro subgêneros novos**

Em `/gerador/`, gerar algumas vezes em cada um. Conferir:

- a primeira linha em FC Militar e FC Climática sai com a sigla em maiúscula —
  "de FC militar", "de FC climática";
- os dois personagens nunca saem com a mesma profissão;
- os cadeados travam as quatro linhas;
- "Copiar premissa" traz o mesmo texto da tela;
- o prompt de IA mostra o subgênero certo na primeira linha.

- [ ] **Passo 4: a busca**

Buscar um verbete de cada subgênero novo — "trincheira", "solastalgia",
"radiotelescópio", "híbrido" — e conferir que o resultado leva à âncora certa,
com o título parando abaixo da barra fixa e não atrás dela.

- [ ] **Passo 5: o guia de personagens**

Abrir `/guia-de-personagens/` e conferir que são dez seções, uma por subgênero,
com dez profissões cada.

- [ ] **Passo 6: mostrar para a autora**

Com o site rodando, antes de publicar. A publicação é decisão dela.
