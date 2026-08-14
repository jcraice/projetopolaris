# Premissa de dois personagens — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a premissa do gerador — hoje uma frase sobre um arquétipo, um cenário e um elemento — por um bloco de quatro linhas sobre dois personagens com profissão e traço, um local e um fato.

**Architecture:** Quatro listas novas em TypeScript dentro de `src/lib/gerador/` (profissões por mundo, características, personalidades e fatos universais), um molde único no lugar dos dez, e `sortear`/`redigir` reescritos em volta de um `Sorteio` de dois personagens. O acervo em `src/content/` não é tocado: arquétipos e elementos continuam no catálogo, só saem do gerador. Cenários viram "locais" e são a única peça que ainda vem de coleção de conteúdo.

**Tech Stack:** Astro 7, TypeScript estrito, Vitest. Sem framework de interface, sem dependência de runtime no cliente.

**Spec:** [docs/superpowers/specs/2026-08-14-premissa-de-personagens-design.md](../specs/2026-08-14-premissa-de-personagens-design.md)

## Global Constraints

- **Tudo em português do Brasil**: identificadores, nomes de arquivo, interface, comentários e mensagens de commit (imperativo — "Adiciona busca global").
- **Sem framework de interface e sem dependência de runtime no cliente.** Interatividade em TypeScript puro dentro de `<script>`. Nenhuma requisição em tempo de execução.
- **Testes ao lado do código** (`src/**/*.test.ts`); nenhum teste acessa a rede.
- **`sortear` recebe `aleatorio: () => number` como parâmetro** — nunca chamar `Math.random()` dentro de `src/lib/`.
- **Nada fora de `src/lib/gerador/` importa arquivo interno da pasta**; tudo passa por `index.ts`.
- **Nenhuma cor, tamanho de fonte ou opacidade da aurora muda.** As contas de [docs/verificacao-visual.md](../../verificacao-visual.md) não são refeitas.
- **Nenhum arquivo de `src/content/` é criado, editado ou apagado**, com uma exceção nomeada: `src/content/paginas/prompt-ia.md`, reescrito na Task 5.
- **Toda entrada das quatro listas novas começa em minúscula e não termina em ponto** — quem fecha a linha é o molde.
- **`npx vitest run` e `npm run check` precisam passar** antes de cada commit: são os dois portões que o deploy roda.

---

### Task 1: As quatro listas de conteúdo

Conteúdo editorial primeiro, porque todo o resto depende dos nomes e do formato do texto. Estas listas são conteúdo da autora sob CC BY — esta é a primeira versão, para ela reescrever por cima.

**Files:**
- Create: `src/lib/gerador/profissoes.ts`
- Create: `src/lib/gerador/caracteristicas.ts`
- Create: `src/lib/gerador/personalidades.ts`
- Create: `src/lib/gerador/fatos.ts`
- Modify: `src/lib/gerador/tipos.ts` (só acrescenta `Profissao`)
- Test: `src/lib/gerador/dados.test.ts` (reescrito)
- Delete: `src/lib/gerador/complicacoes.ts`
- Delete: `src/lib/gerador/moldes.ts` é da Task 3 — **não mexer aqui**

**Interfaces:**
- Consumes: nada.
- Produces: `type Profissao = { nome: string; subgenero: string }` em `tipos.ts`; `PROFISSOES: Profissao[]` (60), `CARACTERISTICAS: string[]` (30), `PERSONALIDADES: string[]` (30), `FATOS: string[]` (40).

- [ ] **Step 1: Acrescentar o tipo `Profissao` em `tipos.ts`**

Só acrescentar. Não apagar nada de `tipos.ts` nesta task — o resto sai na Task 2, e apagar agora quebra `sorteio.ts` e `redacao.ts` antes da hora.

```ts
/* Só nome e mundo: profissão não é entrada de conteúdo — não tem página, não
   tem descrição e não entra na busca —, então não precisa do `id` que as peças
   vindas de src/content/ carregam. */
export type Profissao = { nome: string; subgenero: string };
```

- [ ] **Step 2: Escrever `profissoes.ts`**

Dez por mundo, seis mundos. Em minúscula e com o artigo junto, como `cenarios.singular` já faz — quem sobe a primeira letra é `redigir`, porque a profissão abre linha. O `(a)` está lá porque a autora decidiu que a profissão não fixa gênero.

```ts
import type { Profissao } from './tipos';

/* Conteúdo editorial da autora (CC BY), não código — mesma situação das
   complicações que existiam antes: é peça de sorteio, não verbete de leitura,
   e por isso mora aqui e não em src/content/.

   Escritas em minúscula e com artigo junto, como `cenarios.singular`. Sem
   gênero — decisão da autora, para quem escreve a história decidir. O adjetivo
   que vem depois, na lista de personalidades, acompanha a mesma regra. */
export const PROFISSOES: Profissao[] = [
  { nome: 'um(a) técnico(a) de implantes', subgenero: 'cyberpunk' },
  { nome: 'um(a) corretor(a) de dados', subgenero: 'cyberpunk' },
  { nome: 'um(a) segurança de corporação', subgenero: 'cyberpunk' },
  { nome: 'um(a) médico(a) de rua', subgenero: 'cyberpunk' },
  { nome: 'um(a) falsificador(a) de identidades', subgenero: 'cyberpunk' },
  { nome: 'um(a) entregador(a) de encomendas sigilosas', subgenero: 'cyberpunk' },
  { nome: 'um(a) programador(a) desempregado(a)', subgenero: 'cyberpunk' },
  { nome: 'um(a) dono(a) de bar', subgenero: 'cyberpunk' },
  { nome: 'um(a) jornalista independente', subgenero: 'cyberpunk' },
  { nome: 'um(a) cobrador(a) de dívidas', subgenero: 'cyberpunk' },

  { nome: 'um(a) arquivista do Estado', subgenero: 'distopia' },
  { nome: 'um(a) professor(a) primário(a)', subgenero: 'distopia' },
  { nome: 'um(a) inspetor(a) de rações', subgenero: 'distopia' },
  { nome: 'um(a) censor(a) de correspondência', subgenero: 'distopia' },
  { nome: 'um(a) operário(a) de turno noturno', subgenero: 'distopia' },
  { nome: 'um(a) locutor(a) de rádio oficial', subgenero: 'distopia' },
  { nome: 'um(a) enfermeiro(a) de posto público', subgenero: 'distopia' },
  { nome: 'um(a) contador(a) de uma repartição', subgenero: 'distopia' },
  { nome: 'um(a) motorista de transporte coletivo', subgenero: 'distopia' },
  { nome: 'um(a) recrutador(a) da juventude', subgenero: 'distopia' },

  { nome: 'um(a) biomédico(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) radioamador(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) veterinário(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) piloto de helicóptero', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) tradutor(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) fotógrafo(a) de guerra', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) sargento da reserva', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) agricultor(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) astrônomo(a) amador(a)', subgenero: 'invasao-alienigena' },
  { nome: 'um(a) coveiro(a)', subgenero: 'invasao-alienigena' },

  { nome: 'um(a) catador(a) de sucata', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) guia de estrada', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) curandeiro(a)', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) mecânico(a) de motores velhos', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) guarda de um poço de água', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) sementeiro(a)', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) contador(a) de histórias', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) caçador(a)', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) ferreiro(a)', subgenero: 'pos-apocaliptico' },
  { nome: 'um(a) rastreador(a) de mapas antigos', subgenero: 'pos-apocaliptico' },

  { nome: 'um(a) contrabandista', subgenero: 'space-opera' },
  { nome: 'um(a) piloto de salto', subgenero: 'space-opera' },
  { nome: 'um(a) cozinheiro(a) de bordo', subgenero: 'space-opera' },
  { nome: 'um(a) diplomata júnior', subgenero: 'space-opera' },
  { nome: 'um(a) mecânico(a) de casco', subgenero: 'space-opera' },
  { nome: 'um(a) cartógrafo(a) estelar', subgenero: 'space-opera' },
  { nome: 'um(a) oficial de comunicações', subgenero: 'space-opera' },
  { nome: 'um(a) comerciante de rota longa', subgenero: 'space-opera' },
  { nome: 'um(a) médico(a) de nave', subgenero: 'space-opera' },
  { nome: 'um(a) desertor(a) da frota', subgenero: 'space-opera' },

  { nome: 'um(a) historiador(a)', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) relojoeiro(a)', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) arqueólogo(a)', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) físico(a) de laboratório', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) genealogista', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) restaurador(a) de documentos', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) detetive de seguros', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) bibliotecário(a)', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) fotógrafo(a) de retratos', subgenero: 'viagem-no-tempo' },
  { nome: 'um(a) escrivão(ã) de cartório', subgenero: 'viagem-no-tempo' },
];
```

Os seis identificadores de mundo precisam bater exatamente com os arquivos de `src/content/subgeneros/`: `cyberpunk`, `distopia`, `invasao-alienigena`, `pos-apocaliptico`, `space-opera`, `viagem-no-tempo`. Um erro de digitação aqui não quebra nada — só faz a profissão nunca ser sorteada.

- [ ] **Step 3: Escrever `caracteristicas.ts`**

Trinta, universais. **Começam com verbo**, porque o molde escreve `{profissaoA} que {caracteristica}` — o verbo vem de dentro, e é isso que permite `que tem cicatrizes` e `que é cego(a)` na mesma lista.

```ts
/* Conteúdo editorial da autora (CC BY). Universais: ser cego de um olho não
   pertence a subgênero nenhum.

   Começam com verbo de propósito. O molde escreve "{profissaoA} que
   {caracteristica}", sem verbo próprio, e é isso que deixa a lista misturar
   "é cego(a) de um olho" com "tem cicatrizes nas mãos" sem precisar de duas
   listas. A linha da personalidade faz o contrário: lá o "é" está no molde. */
export const CARACTERISTICAS: string[] = [
  'é cego(a) de um olho',
  'tem cicatrizes nas mãos',
  'é muito mais alto(a) que todo mundo ali',
  'tem uma tatuagem que não sabe explicar',
  'anda com dificuldade desde criança',
  'tem as mãos sempre frias',
  'perdeu dois dedos',
  'tem uma queimadura no pescoço',
  'é surdo(a) de um ouvido',
  'tem cabelo branco desde os vinte anos',
  'tem olhos de cores diferentes',
  'usa um braço mecânico mal ajustado',
  'é pequeno(a) e passa despercebido(a)',
  'tem uma voz rouca que não melhora',
  'tem uma marca de nascença no rosto',
  'respira com esforço',
  'tem os dentes da frente quebrados',
  'carrega um tremor na mão direita',
  'tem calos de quem trabalha com corda',
  'é magro(a) demais para a idade',
  'tem uma cicatriz atravessando a sobrancelha',
  'não sente dor',
  'tem manchas na pele que ninguém soube diagnosticar',
  'usa óculos grossos e não enxerga sem eles',
  'tem ombros largos de nadador(a)',
  'anda com um mancar antigo',
  'tem uma prótese na perna',
  'tem as unhas sempre roídas',
  'tem uma cicatriz de queimadura na palma da mão',
  'é ruivo(a), o que naquele lugar chama atenção',
];
```

- [ ] **Step 4: Escrever `personalidades.ts`**

Trinta, universais. **Sem verbo** — o `é` mora no molde.

```ts
/* Conteúdo editorial da autora (CC BY). Universais, como as características.

   Sem verbo: o molde escreve "{profissaoB} que é {personalidade}", então aqui
   entra só o adjetivo ou o sintagma que o segue. O "(a)" acompanha o "um(a)" da
   profissão — sem ele, "um(a) contrabandista que é egocêntrico" devolveria pela
   porta dos fundos o gênero que a profissão deixou em aberto. Onde o traço já é
   invariável ("leal demais", "de poucas palavras"), fica limpo. */
export const PERSONALIDADES: string[] = [
  'egocêntrico(a)',
  'leal demais',
  'incapaz de mentir',
  'de poucas palavras',
  'desconfiado(a) de todo mundo',
  'impaciente',
  'covarde, e sabe disso',
  'generoso(a) até o prejuízo',
  'teimoso(a)',
  'viciado(a) em risco',
  'sarcástico(a)',
  'obcecado(a) por ordem',
  'incapaz de pedir ajuda',
  'maternal com quem não devia',
  'rancoroso(a)',
  'otimista sem motivo',
  'curioso(a) além da conta',
  'orgulhoso(a) demais para recuar',
  'calculista',
  'distraído(a)',
  'rígido(a) com regras',
  'cínico(a)',
  'protetor(a) de quem é mais fraco',
  'mentiroso(a) por hábito',
  'ingênuo(a)',
  'ciumento(a)',
  'incapaz de ficar parado(a)',
  'severo(a) consigo mesmo(a)',
  'sedento(a) por reconhecimento',
  'paciente até o limite',
];
```

- [ ] **Step 5: Escrever `fatos.ts`**

Quarenta, universais. Orações completas, porque entram sozinhas depois de "Importante:" — é a diferença em relação às complicações antigas, que herdavam o sujeito do arquétipo.

```ts
/* Conteúdo editorial da autora (CC BY). Substituem as 40 complicações.

   A diferença de forma é o ponto: as complicações vinham depois de "{arquetipo}
   descobre que" e podiam não ter sujeito próprio ("pertence, por nascimento, ao
   lado que jurou destruir"). Aqui a frase entra sozinha depois de "Importante:",
   então cada fato é uma oração completa e fala dos dois personagens de fora, sem
   se grudar em nenhum deles. */
export const FATOS: string[] = [
  'um personagem está de luto',
  'os dois já se conheceram antes',
  'um dos dois está mentindo sobre o nome',
  'chove sem parar há trinta dias',
  'um dos dois deve dinheiro ao outro',
  'ninguém ali sabe usar uma arma',
  'um dos dois foi enviado para vigiar o outro',
  'os dois são procurados por motivos diferentes',
  'um deles tem menos de uma semana de vida',
  'o lugar vai ser evacuado em dois dias',
  'um dos dois já esteve preso',
  'eles são a última esperança de alguém que não sabem quem é',
  'um dos dois não consegue dormir',
  'existe uma criança escondida ali',
  'um dos dois trabalha para quem eles estão fugindo',
  'a comida acaba antes do fim da semana',
  'um dos dois perdeu a família no mesmo dia',
  'os dois se odeiam e precisam um do outro',
  'um deles carrega uma carta que não abriu',
  'ninguém pode saber que eles estiveram ali',
  'um dos dois é o único que sabe voltar',
  'há um corpo que ninguém enterrou',
  'um deles reconhece o lugar e não diz nada',
  'os dois assinaram um acordo que não leram',
  'um dos dois está armado e o outro não sabe',
  'o rádio parou de responder há três dias',
  'um deles é irmão de quem eles procuram',
  'eles têm um prazo e não sabem qual',
  'um dos dois já tentou desistir uma vez',
  'existe uma testemunha viva',
  'o combustível dá para a ida, não para a volta',
  'um dos dois está doente e esconde',
  'eles carregam algo que não abriram',
  'alguém está seguindo os dois desde o começo',
  'um deles tem medo do escuro',
  'a rota que eles conhecem não existe mais',
  'um dos dois prometeu voltar e não vai conseguir',
  'ninguém acredita na versão que eles vão contar',
  'um deles guarda a chave de algo que perdeu',
  'há um terceiro que os dois preferem não mencionar',
];
```

- [ ] **Step 6: Reescrever `dados.test.ts`**

Substituir o arquivo inteiro. Ele trancava 7 famílias / 40 complicações / 10 moldes; passa a trancar as quatro listas. O teste de molde entra na Task 3, quando `MOLDE` existir.

```ts
import { describe, expect, it } from 'vitest';
import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import { PROFISSOES } from './profissoes';

const MUNDOS = [
  'cyberpunk', 'distopia', 'invasao-alienigena',
  'pos-apocaliptico', 'space-opera', 'viagem-no-tempo',
];

describe('PROFISSOES', () => {
  it('tem sessenta profissões, dez por mundo', () => {
    expect(PROFISSOES).toHaveLength(60);
    for (const mundo of MUNDOS) {
      expect(PROFISSOES.filter((p) => p.subgenero === mundo)).toHaveLength(10);
    }
  });

  it('não usa nenhum mundo fora dos seis', () => {
    for (const p of PROFISSOES) expect(MUNDOS).toContain(p.subgenero);
  });

  it('não tem profissão repetida', () => {
    expect(new Set(PROFISSOES.map((p) => p.nome)).size).toBe(60);
  });
});

describe('as três listas universais', () => {
  it('têm os tamanhos trancados', () => {
    expect(CARACTERISTICAS).toHaveLength(30);
    expect(PERSONALIDADES).toHaveLength(30);
    expect(FATOS).toHaveLength(40);
  });

  it('não têm entrada repetida', () => {
    expect(new Set(CARACTERISTICAS).size).toBe(30);
    expect(new Set(PERSONALIDADES).size).toBe(30);
    expect(new Set(FATOS).size).toBe(40);
  });
});

/* A regra vale para as quatro listas: quem fecha a linha é o molde, e uma
   entrada que já venha com ponto produziria "egocêntrico(a)..". A minúscula
   vale porque nenhuma delas abre frase — a de profissão abre linha, mas quem
   sobe a primeira letra é redigir(). */
describe('a forma do texto das quatro listas', () => {
  const todas = [
    ...PROFISSOES.map((p) => p.nome),
    ...CARACTERISTICAS, ...PERSONALIDADES, ...FATOS,
  ];

  it('nenhuma entrada termina em ponto', () => {
    for (const texto of todas) expect(texto.endsWith('.')).toBe(false);
  });

  it('toda entrada começa em minúscula', () => {
    for (const texto of todas) expect(texto[0]).toBe(texto[0].toLowerCase());
  });
});
```

- [ ] **Step 7: Apagar `complicacoes.ts`**

```bash
git rm src/lib/gerador/complicacoes.ts
```

`sorteio.ts` e `index.ts` ainda importam `COMPLICACOES` — o projeto fica quebrado ao fim desta task, e é esperado: a Task 2 conserta. Por isso o passo seguinte roda só o teste desta task, não a suíte.

- [ ] **Step 8: Rodar só o teste dos dados**

Run: `npx vitest run src/lib/gerador/dados.test.ts`
Expected: PASS, 7 testes.

`npx vitest run` inteiro **vai falhar** aqui, em `sorteio.test.ts` e `redacao.test.ts`, porque `complicacoes.ts` não existe mais e os tipos antigos continuam de pé. É o único ponto do plano em que a suíte fica vermelha.

- [ ] **Step 9: Commit**

```bash
git add src/lib/gerador/profissoes.ts src/lib/gerador/caracteristicas.ts src/lib/gerador/personalidades.ts src/lib/gerador/fatos.ts src/lib/gerador/tipos.ts src/lib/gerador/dados.test.ts
git rm --cached src/lib/gerador/complicacoes.ts 2>/dev/null; git add -u src/lib/gerador/
git commit -m "Escreve as quatro listas da premissa de personagens"
```

---

### Task 2: O sorteio de dois personagens

**Files:**
- Modify: `src/lib/gerador/tipos.ts` (agora sim, reescrito)
- Modify: `src/lib/gerador/sorteio.ts`
- Test: `src/lib/gerador/sorteio.test.ts` (reescrito)

**Interfaces:**
- Consumes: `PROFISSOES`, `CARACTERISTICAS`, `PERSONALIDADES`, `FATOS`, `Profissao` (Task 1).
- Produces:
  - `type Sorteio = { personagemA: { profissao: Profissao; caracteristica: string }; personagemB: { profissao: Profissao; personalidade: string }; local: PecaCenario; fato: string }`
  - `type Pools = { profissoes: Profissao[]; locais: PecaCenario[] }`
  - `type Travas = { personagemA: boolean; personagemB: boolean; local: boolean }`
  - `type Opcoes = { subgenero: string | null; misturarMundos: boolean }`
  - `poolsFiltrados(pools: Pools, opcoes: Opcoes): Pools`
  - `sortear(pools: Pools, opcoes: Opcoes, travas: Travas, anterior: Sorteio | null, aleatorio: () => number): Sorteio`

- [ ] **Step 1: Reescrever `tipos.ts`**

Arquivo inteiro. Saem `Familia`, `Artigo`, `PecaArquetipo` e o campo `incluirComuns`.

```ts
/* Só nome e mundo: profissão não é entrada de conteúdo — não tem página, não
   tem descrição e não entra na busca —, então não precisa do `id` que as peças
   vindas de src/content/ carregam. */
export type Profissao = { nome: string; subgenero: string };

export type Peca = { id: string; nome: string; subgenero: string };
export type PecaCenario = Peca & { singular: string };

export type Sorteio = {
  personagemA: { profissao: Profissao; caracteristica: string };
  personagemB: { profissao: Profissao; personalidade: string };
  local: PecaCenario;
  fato: string;
};

/* Só as duas peças que vêm de fora entram aqui. Características, personalidades
   e fatos são universais e a lib os importa direto, como fazia com as
   complicações — não há o que filtrar por mundo neles. */
export type Pools = {
  profissoes: Profissao[];
  locais: PecaCenario[];
};

export type Travas = { personagemA: boolean; personagemB: boolean; local: boolean };

/* `incluirComuns` saiu junto com os arquétipos: a caixa existia para somar ao
   sorteio os 10 arquétipos comuns, e sem arquétipos no gerador não há o que
   incluir. O pool `comuns` continua intacto no acervo e em /arquetipos/comuns/. */
export type Opcoes = {
  subgenero: string | null;
  misturarMundos: boolean;
};
```

- [ ] **Step 2: Escrever os testes que falham**

Substituir `sorteio.test.ts` inteiro.

```ts
import { describe, expect, it } from 'vitest';
import { poolsFiltrados, sortear } from './sorteio';
import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import type { Opcoes, Pools, Sorteio, Travas } from './tipos';

const pools: Pools = {
  profissoes: [
    { nome: 'um(a) técnico(a) de implantes', subgenero: 'cyberpunk' },
    { nome: 'um(a) corretor(a) de dados', subgenero: 'cyberpunk' },
    { nome: 'um(a) contrabandista', subgenero: 'space-opera' },
  ],
  locais: [
    { id: 'c1', nome: 'Megacidades', subgenero: 'cyberpunk', singular: 'uma megacidade' },
    { id: 'c2', nome: 'Ruínas Antigas', subgenero: 'space-opera', singular: 'uma ruína antiga' },
  ],
};

const SEM_TRAVA: Travas = { personagemA: false, personagemB: false, local: false };
const base: Opcoes = { subgenero: 'cyberpunk', misturarMundos: false };
const zero = () => 0;

describe('poolsFiltrados', () => {
  it('mantém apenas o mundo escolhido', () => {
    const r = poolsFiltrados(pools, base);
    expect(r.profissoes.map((p) => p.nome)).toEqual([
      'um(a) técnico(a) de implantes', 'um(a) corretor(a) de dados',
    ]);
    expect(r.locais.map((l) => l.id)).toEqual(['c1']);
  });

  it('deixa passar todos os mundos no modo misturar', () => {
    const r = poolsFiltrados(pools, { ...base, misturarMundos: true });
    expect(r.profissoes).toHaveLength(3);
    expect(r.locais).toHaveLength(2);
  });
});

describe('sortear', () => {
  it('respeita o mundo escolhido', () => {
    const s = sortear(pools, base, SEM_TRAVA, null, zero);
    expect(s.personagemA.profissao.subgenero).toBe('cyberpunk');
    expect(s.personagemB.profissao.subgenero).toBe('cyberpunk');
    expect(s.local.subgenero).toBe('cyberpunk');
  });

  it('nunca dá a mesma profissão aos dois personagens', () => {
    for (let i = 0; i < 100; i++) {
      const s = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
      expect(s.personagemA.profissao.nome).not.toBe(s.personagemB.profissao.nome);
    }
  });

  it('mantém profissões diferentes com o personagem A travado', () => {
    let anterior: Sorteio | null = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 100; i++) {
      anterior = sortear(
        pools, { ...base, misturarMundos: true },
        { personagemA: true, personagemB: false, local: false }, anterior, Math.random,
      );
      expect(anterior.personagemA.profissao.nome).not.toBe(anterior.personagemB.profissao.nome);
    }
  });

  /* O caso espelhado do anterior, e o que motivou o pool de A ser filtrado: com
     B travado, é A que precisa desviar — sem isso, A cairia na profissão de B. */
  it('mantém profissões diferentes com o personagem B travado', () => {
    let anterior: Sorteio | null = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 100; i++) {
      anterior = sortear(
        pools, { ...base, misturarMundos: true },
        { personagemA: false, personagemB: true, local: false }, anterior, Math.random,
      );
      expect(anterior.personagemA.profissao.nome).not.toBe(anterior.personagemB.profissao.nome);
    }
  });

  it('preserva cada peça travada', () => {
    const anterior = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, () => 0.9);
    const novo = sortear(
      pools, { ...base, misturarMundos: true },
      { personagemA: true, personagemB: true, local: true }, anterior, () => 0,
    );
    expect(novo.personagemA).toEqual(anterior.personagemA);
    expect(novo.personagemB).toEqual(anterior.personagemB);
    expect(novo.local).toEqual(anterior.local);
  });

  it('nunca repete o fato da rolagem anterior', () => {
    let anterior: Sorteio | null = null;
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, SEM_TRAVA, anterior, Math.random);
      if (anterior) expect(atual.fato).not.toBe(anterior.fato);
      anterior = atual;
    }
  });

  /* O fato é a única peça sem cadeado: travar as três cartas e continuar
     clicando em Gerar é o uso que o cadeado sempre teve — segurar o elenco e o
     lugar e rolar só o que complica. */
  it('traz fato novo mesmo com as três travas ligadas', () => {
    const todas: Travas = { personagemA: true, personagemB: true, local: true };
    let anterior: Sorteio | null = sortear(pools, base, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, todas, anterior, Math.random);
      expect(atual.fato).not.toBe(anterior!.fato);
      anterior = atual;
    }
  });

  /* As três listas universais não passam por Pools nem por filtro de mundo: a
     lib as importa direto. Este caso tranca isso pelo comportamento — com um
     mundo escolhido, o traço sorteado continua vindo da lista inteira. */
  it('usa as listas universais mesmo com um mundo escolhido', () => {
    for (let i = 0; i < 50; i++) {
      const s = sortear(pools, base, SEM_TRAVA, null, Math.random);
      expect(CARACTERISTICAS).toContain(s.personagemA.caracteristica);
      expect(PERSONALIDADES).toContain(s.personagemB.personalidade);
      expect(FATOS).toContain(s.fato);
    }
  });

  it('lança erro quando não há peça disponível', () => {
    const vazio: Pools = { profissoes: [], locais: [] };
    expect(() => sortear(vazio, base, SEM_TRAVA, null, zero)).toThrow(/sem peças/i);
  });

  /* Um mundo com uma profissão só não consegue formar dois personagens
     diferentes. Falhar alto é melhor do que devolver os dois iguais em
     silêncio — e o acervo tem dez por mundo, então isto é guarda-corpo. */
  it('lança erro quando só há uma profissão para os dois personagens', () => {
    const soUma: Pools = {
      profissoes: [{ nome: 'um(a) técnico(a) de implantes', subgenero: 'cyberpunk' }],
      locais: pools.locais,
    };
    expect(() => sortear(soUma, base, SEM_TRAVA, null, zero)).toThrow(/sem peças/i);
  });
});
```

- [ ] **Step 3: Rodar os testes e ver falhar**

Run: `npx vitest run src/lib/gerador/sorteio.test.ts`
Expected: FAIL — `sorteio.ts` ainda importa `./complicacoes`, que não existe, e os tipos não batem.

- [ ] **Step 4: Reescrever `sorteio.ts`**

```ts
import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import type { Opcoes, Pools, Sorteio, Travas } from './tipos';

function escolher<T>(lista: T[], aleatorio: () => number): T {
  if (lista.length === 0) throw new Error('sem peças disponíveis para sortear');
  return lista[Math.floor(aleatorio() * lista.length) % lista.length];
}

function pertence(peca: { subgenero: string }, opcoes: Opcoes): boolean {
  return opcoes.misturarMundos || peca.subgenero === opcoes.subgenero;
}

export function poolsFiltrados(pools: Pools, opcoes: Opcoes): Pools {
  return {
    profissoes: pools.profissoes.filter((p) => pertence(p, opcoes)),
    locais: pools.locais.filter((l) => pertence(l, opcoes)),
  };
}

export function sortear(
  pools: Pools,
  opcoes: Opcoes,
  travas: Travas,
  anterior: Sorteio | null,
  aleatorio: () => number,
): Sorteio {
  const disponivel = poolsFiltrados(pools, opcoes);

  /* Os dois personagens nunca saem com a mesma profissão, e a trava pode estar
     em qualquer um dos dois — por isso o desvio acontece nos dois sentidos.
     Quando B está travado, é A que precisa evitar a profissão dele; nos outros
     casos A sai livre e B evita a de A. Sortear os dois sem olhar um para o
     outro deixaria passar "um(a) contrabandista / um(a) contrabandista". */
  const bTravado = travas.personagemB && anterior ? anterior.personagemB : null;
  const paraA = bTravado
    ? disponivel.profissoes.filter((p) => p.nome !== bTravado.profissao.nome)
    : disponivel.profissoes;

  const personagemA = travas.personagemA && anterior ? anterior.personagemA : {
    profissao: escolher(paraA, aleatorio),
    caracteristica: escolher(CARACTERISTICAS, aleatorio),
  };

  const personagemB = bTravado ?? {
    profissao: escolher(
      disponivel.profissoes.filter((p) => p.nome !== personagemA.profissao.nome),
      aleatorio,
    ),
    personalidade: escolher(PERSONALIDADES, aleatorio),
  };

  /* O fato não tem cadeado e nunca repete o da rodada anterior. As complicações
     de antes tinham famílias e a regra evitava repetir a família também; os
     fatos são uma lista só, e a regra é só não repetir o último. */
  const fato = escolher(FATOS.filter((f) => f !== anterior?.fato), aleatorio);

  return {
    personagemA,
    personagemB,
    local: travas.local && anterior ? anterior.local : escolher(disponivel.locais, aleatorio),
    fato,
  };
}
```

- [ ] **Step 5: Rodar os testes e ver passar**

Run: `npx vitest run src/lib/gerador/sorteio.test.ts`
Expected: PASS, 12 testes.

- [ ] **Step 6: Commit**

```bash
git add src/lib/gerador/tipos.ts src/lib/gerador/sorteio.ts src/lib/gerador/sorteio.test.ts
git commit -m "Sorteia dois personagens sem repetir profissão"
```

---

### Task 3: O molde único e a redação

**Files:**
- Modify: `src/lib/gerador/moldes.ts`
- Modify: `src/lib/gerador/redacao.ts`
- Test: `src/lib/gerador/redacao.test.ts` (encolhe)
- Test: `src/lib/gerador/dados.test.ts` (acrescenta o teste do molde)

**Interfaces:**
- Consumes: `Sorteio`, `PecaCenario` (Task 2).
- Produces: `MOLDE: string`; `contrair(preposicao: 'em' | 'a' | 'de', sintagma: string): string` (inalterada); `redigir(sorteio: Sorteio, molde: string, mundo: string): string`.

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar a `redacao.test.ts`, **mantendo intactos os casos de `contrair`** que já estão no arquivo. Apagar do arquivo todos os `describe` de `numeroDe`, `generoDe` e `emMinuscula`, e os casos antigos de `redigir`.

```ts
import { describe, expect, it } from 'vitest';
import { redigir } from './redacao';
import { MOLDE } from './moldes';
import type { Sorteio } from './tipos';

const sorteio: Sorteio = {
  personagemA: {
    profissao: { nome: 'um(a) biomédico(a)', subgenero: 'invasao-alienigena' },
    caracteristica: 'é cego(a) de um olho',
  },
  personagemB: {
    profissao: { nome: 'um(a) contrabandista', subgenero: 'space-opera' },
    personalidade: 'egocêntrico(a)',
  },
  local: {
    id: 'l1', nome: 'Laboratórios Secretos',
    subgenero: 'invasao-alienigena', singular: 'um laboratório secreto',
  },
  fato: 'um personagem está de luto',
};

describe('redigir', () => {
  it('monta o bloco inteiro', () => {
    expect(redigir(sorteio, MOLDE, 'Invasão Alienígena')).toBe(
      'Essa é uma ficção científica de invasão alienígena.\n\n'
      + 'Um(a) biomédico(a) que é cego(a) de um olho.\n'
      + 'Um(a) contrabandista que é egocêntrico(a).\n\n'
      + 'Tudo começa num laboratório secreto.\n\n'
      + 'Importante: um personagem está de luto.',
    );
  });

  it('escreve o mundo inteiro em minúscula', () => {
    const frase = redigir(sorteio, MOLDE, 'Space Opera');
    expect(frase).toContain('ficção científica de space opera.');
  });

  /* Com "Misturar mundos" a primeira linha recebe mais de um nome, já unido por
     nomearMundos — e a minúscula precisa alcançar os dois. */
  it('abaixa também o nome composto de mundos misturados', () => {
    const frase = redigir(sorteio, MOLDE, 'Space Opera + Invasão Alienígena');
    expect(frase).toContain('de space opera + invasão alienígena.');
  });

  it('sobe a primeira letra das duas linhas de personagem', () => {
    const frase = redigir(sorteio, MOLDE, 'Distopia');
    expect(frase).toContain('\nUm(a) biomédico(a) que');
    expect(frase).toContain('\nUm(a) contrabandista que');
  });

  /* O "é" fica no molde só na linha da personalidade. Na de característica ele
     vem de dentro do texto, e é o que deixa "tem cicatrizes nas mãos" conviver
     com "é cego(a) de um olho" na mesma lista. */
  it('não põe "é" antes da característica', () => {
    const outro: Sorteio = {
      ...sorteio,
      personagemA: { ...sorteio.personagemA, caracteristica: 'tem cicatrizes nas mãos' },
    };
    const frase = redigir(outro, MOLDE, 'Distopia');
    expect(frase).toContain('Um(a) biomédico(a) que tem cicatrizes nas mãos.');
    expect(frase).not.toContain('que é tem cicatrizes');
  });

  it('contrai a preposição do local com "um"', () => {
    expect(redigir(sorteio, MOLDE, 'Distopia')).toContain('Tudo começa num laboratório secreto.');
  });

  it('contrai a preposição do local com "uma"', () => {
    const outro: Sorteio = {
      ...sorteio,
      local: { ...sorteio.local, singular: 'uma órbita baixa' },
    };
    expect(redigir(outro, MOLDE, 'Distopia')).toContain('Tudo começa numa órbita baixa.');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/gerador/redacao.test.ts`
Expected: FAIL — `MOLDE` não existe e `redigir` tem outra assinatura.

- [ ] **Step 3: Reescrever `moldes.ts`**

Arquivo inteiro. `MOLDES` (plural, 10) vira `MOLDE` (singular, 1).

```ts
/* Um molde só, no lugar dos dez que existiam. A variedade passou para as
   listas: dentro de um mundo são 10 × 9 profissões × 30 características × 30
   personalidades × 10 locais × 40 fatos, cerca de 32 milhões de premissas.

   As quebras de linha fazem parte do molde e aparecem na tela — a premissa é um
   bloco de quatro linhas, não um parágrafo corrido, e é por isso que o
   parágrafo da premissa em gerador.astro precisa de `white-space: pre-wrap`.

   Repare no "é": ele está no molde só na linha da personalidade. Na linha da
   característica o verbo vem de dentro do texto sorteado, o que permite "que
   tem cicatrizes nas mãos" e "que é cego(a) de um olho" na mesma lista. */
export const MOLDE = `Essa é uma ficção científica de {mundo}.

{profissaoA} que {caracteristica}.
{profissaoB} que é {personalidade}.

Tudo começa {em:local}.

Importante: {fato}.`;
```

- [ ] **Step 4: Reescrever `redacao.ts`**

Manter `CONTRACOES` e `contrair` **exatamente como estão**, com os comentários. Apagar `generoDe`, `emMinuscula`, `numeroDe` e todas as constantes que só serviam a ela — `ARTIGOS`, `NUCLEOS_SINGULARES_TERMINADOS_EM_S`, `PREPOSICOES`, `EXCECOES_COORDENACAO_DE_ADJETIVOS`, `limpar` — e o aviso de leitura que as introduz. Substituir `redigir`.

`contrair` fica inteira, com os três mapas de preposição, mesmo o molde novo usando só `em`: é função de uso geral, tem testes próprios, e podá-la seria mudança que a spec não pediu.

```ts
import type { Sorteio } from './tipos';

// ... CONTRACOES e contrair() ficam como estão, sem uma linha de mudança ...

function subirPrimeira(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* `mundo` chega pronto de nomearMundos() — pode ser um nome ("Space Opera") ou
   vários unidos por " + " quando "Misturar mundos" está ligado. A minúscula é
   aplicada aqui, e não lá, porque o prompt de IA usa o mesmo valor e quer o
   nome como está escrito na coleção. */
export function redigir(sorteio: Sorteio, molde: string, mundo: string): string {
  const { personagemA, personagemB, local, fato } = sorteio;

  return molde
    .replaceAll('{mundo}', mundo.toLocaleLowerCase('pt-BR'))
    .replaceAll('{profissaoA}', subirPrimeira(personagemA.profissao.nome))
    .replaceAll('{caracteristica}', personagemA.caracteristica)
    .replaceAll('{profissaoB}', subirPrimeira(personagemB.profissao.nome))
    .replaceAll('{personalidade}', personagemB.personalidade)
    .replaceAll('{em:local}', contrair('em', local.singular))
    .replaceAll('{fato}', fato);
}
```

- [ ] **Step 5: Acrescentar o teste do molde em `dados.test.ts`**

```ts
import { MOLDE } from './moldes';

describe('MOLDE', () => {
  it('usa os seis marcadores', () => {
    for (const marcador of [
      '{mundo}', '{profissaoA}', '{caracteristica}',
      '{profissaoB}', '{personalidade}', '{em:local}', '{fato}',
    ]) {
      expect(MOLDE).toContain(marcador);
    }
  });

  it('termina em ponto final', () => {
    expect(MOLDE.endsWith('.')).toBe(true);
  });

  /* Quatro linhas de texto separadas por linha em branco. Se alguém colar o
     molde numa linha só, a premissa vira um parágrafo e o formato se perde. */
  it('tem as quatro linhas separadas por linha em branco', () => {
    expect(MOLDE.split('\n\n')).toHaveLength(4);
  });
});
```

- [ ] **Step 6: Atualizar `index.ts`**

```ts
// Ponto único de entrada para quem consome o gerador de fora da pasta —
// hoje só src/pages/gerador.astro, mas evita que o consumidor precise saber
// em qual arquivo interno cada peça mora (sorteio.ts, redacao.ts, moldes.ts).
export { poolsFiltrados, sortear } from './sorteio';
export { contrair, redigir } from './redacao';
export { MOLDE } from './moldes';
export { PROFISSOES } from './profissoes';
export { CARACTERISTICAS } from './caracteristicas';
export { PERSONALIDADES } from './personalidades';
export { FATOS } from './fatos';
export { montarPrompt, nomearMundos } from './prompt';
export type { Opcoes, Peca, PecaCenario, Pools, Profissao, Sorteio, Travas } from './tipos';
export type { ValoresDoPrompt } from './prompt';
```

- [ ] **Step 7: Rodar os dois arquivos de teste**

Run: `npx vitest run src/lib/gerador/redacao.test.ts src/lib/gerador/dados.test.ts`
Expected: PASS. `prompt.test.ts` ainda falha — é a Task 4.

- [ ] **Step 8: Commit**

```bash
git add src/lib/gerador/moldes.ts src/lib/gerador/redacao.ts src/lib/gerador/redacao.test.ts src/lib/gerador/dados.test.ts src/lib/gerador/index.ts
git commit -m "Redige a premissa em bloco de quatro linhas"
```

---

### Task 4: O prompt de IA

**Files:**
- Modify: `src/lib/gerador/prompt.ts`
- Modify: `src/content/paginas/prompt-ia.md`
- Test: `src/lib/gerador/prompt.test.ts`

**Interfaces:**
- Consumes: `Sorteio`, `Opcoes` (Task 2).
- Produces: `type ValoresDoPrompt = { mundo: string; personagemA: string; personagemB: string; local: string; fato: string }`; `nomearMundos(sorteio: Sorteio, opcoes: Opcoes, nomes: Record<string, string>): string`; `montarPrompt(modelo: string, valores: ValoresDoPrompt): string`.

- [ ] **Step 1: Escrever os testes que falham**

Em `prompt.test.ts`, adaptar os casos existentes ao `Sorteio` novo e trocar os marcadores. O caso do pool `comuns` em `nomearMundos` **sai**: não há mais pool `comuns` no gerador.

```ts
import { describe, expect, it } from 'vitest';
import { montarPrompt, nomearMundos } from './prompt';
import type { Opcoes, Sorteio } from './tipos';

const nomes = {
  'space-opera': 'Space Opera',
  distopia: 'Distopia',
  cyberpunk: 'Cyberpunk',
};

const sorteio: Sorteio = {
  personagemA: {
    profissao: { nome: 'um(a) contrabandista', subgenero: 'space-opera' },
    caracteristica: 'é cego(a) de um olho',
  },
  personagemB: {
    profissao: { nome: 'um(a) arquivista do Estado', subgenero: 'distopia' },
    personalidade: 'egocêntrico(a)',
  },
  local: { id: 'l1', nome: 'Ruínas Antigas', subgenero: 'cyberpunk', singular: 'uma ruína antiga' },
  fato: 'um personagem está de luto',
};

const base: Opcoes = { subgenero: 'space-opera', misturarMundos: false };

describe('nomearMundos', () => {
  it('sem misturar, devolve o mundo do seletor', () => {
    expect(nomearMundos(sorteio, base, nomes)).toBe('Space Opera');
  });

  it('misturando, devolve os mundos usados na ordem A, B, local', () => {
    expect(nomearMundos(sorteio, { ...base, misturarMundos: true }, nomes))
      .toBe('Space Opera + Distopia + Cyberpunk');
  });

  it('misturando, não repete um mundo usado por mais de uma peça', () => {
    const mesmo: Sorteio = {
      ...sorteio,
      personagemB: {
        profissao: { nome: 'um(a) piloto de salto', subgenero: 'space-opera' },
        personalidade: 'teimoso(a)',
      },
      local: { ...sorteio.local, subgenero: 'space-opera' },
    };
    expect(nomearMundos(mesmo, { ...base, misturarMundos: true }, nomes)).toBe('Space Opera');
  });
});

describe('montarPrompt', () => {
  const valores = {
    mundo: 'Space Opera',
    personagemA: 'um(a) contrabandista que é cego(a) de um olho',
    personagemB: 'um(a) arquivista do Estado que é egocêntrico(a)',
    local: 'Ruínas Antigas',
    fato: 'um personagem está de luto',
  };

  it('troca os cinco marcadores', () => {
    const modelo = 'M: [MUNDO] A: [PERSONAGEM A] B: [PERSONAGEM B] L: [LOCAL] F: [FATO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'M: Space Opera A: um(a) contrabandista que é cego(a) de um olho'
      + ' B: um(a) arquivista do Estado que é egocêntrico(a)'
      + ' L: Ruínas Antigas F: um personagem está de luto',
    );
  });

  /* O caso real que justifica a regra: um marcador escrito errado no
     prompt-ia.md quebra `npm run build`, e não chega em produção com o
     colchete cru no meio do texto que vai para a IA. */
  it('lança em marcador desconhecido', () => {
    expect(() => montarPrompt('[PERSONAGEM C]', valores)).toThrow(/marcador desconhecido/i);
  });

  it('deixa passar colchetes em minúscula, que não são marcadores', () => {
    expect(montarPrompt('texto [ver nota] fim', valores)).toBe('texto [ver nota] fim');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/gerador/prompt.test.ts`
Expected: FAIL — `ValoresDoPrompt` e os campos do `Sorteio` não batem.

- [ ] **Step 3: Atualizar `prompt.ts`**

Trocar o corpo de `nomearMundos` e a tabela de marcadores. `MARCADOR_QUE_SOBROU` e a lógica de `montarPrompt` ficam **como estão**.

```ts
export function nomearMundos(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarMundos) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  /* A ordem é a das cartas na tela — personagem A, personagem B, local — e o
     Set preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na ordem
     em que a pessoa lê as peças, não em ordem alfabética nem de coleção.

     O filtro do pool `comuns` que existia aqui saiu junto com os arquétipos: as
     profissões pertencem aos seis mundos e a nenhum outro pool. */
  const usados = [
    sorteio.personagemA.profissao.subgenero,
    sorteio.personagemB.profissao.subgenero,
    sorteio.local.subgenero,
  ];

  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}

export type ValoresDoPrompt = {
  mundo: string;
  personagemA: string;
  personagemB: string;
  local: string;
  fato: string;
};

const MARCADORES: Record<string, keyof ValoresDoPrompt> = {
  '[MUNDO]': 'mundo',
  '[PERSONAGEM A]': 'personagemA',
  '[PERSONAGEM B]': 'personagemB',
  '[LOCAL]': 'local',
  '[FATO]': 'fato',
};
```

Apagar o `NAO_E_MUNDO` e o comentário sobre o pool `comuns` no topo do arquivo.

- [ ] **Step 4: Reescrever `prompt-ia.md`**

Primeira versão, para a autora corrigir. O corpo é lido como texto cru e nunca renderizado — o que a IA recebe é o que está escrito aqui.

```markdown
---
titulo: "Prompt para IA"
ordem: 8
---

Você é um roteirista de ficção científica. Escreva um enredo de no máximo 400 palavras a partir destas peças:

Mundo: [MUNDO]
Personagem A: [PERSONAGEM A]
Personagem B: [PERSONAGEM B]
Onde começa: [LOCAL]
Fato importante: [FATO]

Os dois personagens precisam se encontrar logo no começo, e o fato importante precisa mudar o que um deles quer. Dê à história um título e ao menos uma reviravolta, e faça os dois terminarem diferentes de como começaram.
```

- [ ] **Step 5: Rodar os testes e ver passar**

Run: `npx vitest run src/lib/gerador/prompt.test.ts`
Expected: PASS, 6 testes.

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npx vitest run`
Expected: PASS. A lib está inteira de novo — só `gerador.astro` continua desatualizado, e ele não tem teste.

- [ ] **Step 7: Commit**

```bash
git add src/lib/gerador/prompt.ts src/lib/gerador/prompt.test.ts src/content/paginas/prompt-ia.md
git commit -m "Entrega os dois personagens ao prompt de IA"
```

---

### Task 5: A página do gerador

**Files:**
- Modify: `src/pages/gerador.astro`

**Interfaces:**
- Consumes: tudo o que `src/lib/gerador/index.ts` exporta (Tasks 1–4).
- Produces: nada que outra task consuma.

- [ ] **Step 1: Trocar o frontmatter**

O acervo injetado encolhe: só os locais vêm de coleção de conteúdo. As profissões são módulo TypeScript e o `<script>` as importa direto, como já faz com o molde.

```ts
---
import { getCollection, getEntry } from 'astro:content';
import Base from '../layouts/Base.astro';
import { montarPrompt } from '../lib/gerador';

const subgeneros = await getCollection('subgeneros');
const mundos = subgeneros.filter((s) => s.data.mundo).sort((a, b) => a.data.ordem - b.data.ordem);

const modeloDoPrompt = await getEntry('paginas', 'prompt-ia');
if (!modeloDoPrompt) throw new Error("página 'prompt-ia' não encontrada em src/content/paginas");
if (!modeloDoPrompt.body) throw new Error("página 'prompt-ia' está sem corpo em src/content/paginas");

// O montarPrompt estoura em marcador desconhecido, e é aqui que isso vira
// utilidade: uma chamada em tempo de build faz um `[PERSONAGEM Á]` com acento
// errado quebrar `npm run build` — o mesmo portão que o deploy roda — em vez de
// chegar em produção e deixar o card do prompt vazio em silêncio.
// Os valores são de descarte: quem importa aqui são os marcadores do modelo.
montarPrompt(modeloDoPrompt.body, {
  mundo: 'conferência',
  personagemA: 'conferência',
  personagemB: 'conferência',
  local: 'conferência',
  fato: 'conferência',
});

const nomesDosMundos = Object.fromEntries(mundos.map((m) => [m.id, m.data.nome]));

// Só os locais vêm daqui: são os 60 cenários do acervo, lidos em build e
// injetados como JSON estático. As profissões, características, personalidades
// e fatos moram em src/lib/gerador/ e o <script> os importa direto — não
// precisam passar pelo HTML.
const locais = (await getCollection('cenarios')).map((c) => ({
  id: c.id, nome: c.data.titulo, subgenero: c.data.subgenero, singular: c.data.singular,
}));

// Rótulo fixo de cada carta — não depende do sorteio, por isso é escrito em
// build, diferente de {etiqueta} e {nome}, que o script preenche a cada rolagem.
const CARTAS = [
  { tipo: 'personagemA', rotulo: 'Personagem A' },
  { tipo: 'personagemB', rotulo: 'Personagem B' },
  { tipo: 'local', rotulo: 'Local' },
] as const;
---
```

- [ ] **Step 2: Trocar o formulário e a marcação das cartas**

No `<form id="opcoes">`, **apagar a linha da caixa de comuns**:

```html
<label><input type="checkbox" name="incluirComuns" /> Incluir os 10 arquétipos comuns</label>
```

Nas cartas, acrescentar a linha do traço depois de `carta__nome`. O resto da marcação (topo, etiqueta, botão de cadeado com os dois SVGs) fica **exatamente como está** — só os valores de `CARTAS` mudaram.

```html
<p class="carta__nome" data-papel="nome"></p>
<p class="carta__traco" data-papel="traco"></p>
```

E trocar o `<script type="application/json" id="pools">` por:

```html
<script type="application/json" id="locais" is:inline set:html={JSON.stringify(locais)}></script>
```

- [ ] **Step 3: Acrescentar o estilo das duas linhas novas**

No `<style>` da página:

```css
/* Segunda linha da carta de personagem: o traço sorteado, mais discreto que a
   profissão porque é qualificador dela, não outra peça. --texto, e não
   --apagado: precisa dos 4,5:1 de texto comum sobre o fundo. */
.carta__traco {
  margin: 0;
  font-size: 1rem;
  color: var(--texto);
}

/* A carta do local não tem traço, e o parágrafo vazio somaria um espaço que
   desalinharia as três cartas. */
.carta__traco:empty {
  display: none;
}
```

E no `.bloco-premissa #premissa`, acrescentar `white-space: pre-wrap`:

```css
/* pre-wrap porque a premissa deixou de ser uma frase e virou um bloco de quatro
   linhas: as quebras vêm do MOLDE e precisam aparecer na tela. Mesmo motivo do
   .prompt__texto logo abaixo. */
.bloco-premissa #premissa {
  min-height: 1.6em;
  font-size: 1.15rem;
  color: var(--texto-forte);
  white-space: pre-wrap;
}
```

- [ ] **Step 4: Reescrever o `<script>`**

```ts
<script>
  import { montarPrompt, nomearMundos, sortear, redigir, MOLDE, PROFISSOES } from '../lib/gerador';
  import type { Opcoes, PecaCenario, Pools, Sorteio, Travas } from '../lib/gerador';

  const locais: PecaCenario[] = JSON.parse(document.getElementById('locais')!.textContent!);
  const modeloDoPrompt: string = JSON.parse(document.getElementById('modelo-prompt')!.textContent!);
  const nomesDosMundos: Record<string, string> = JSON.parse(
    document.getElementById('nomes-dos-mundos')!.textContent!,
  );

  // As profissões vêm do módulo, os locais do JSON injetado: os dois se juntam
  // aqui para sortear() continuar recebendo tudo por parâmetro e seguir puro.
  const pools: Pools = { profissoes: PROFISSOES, locais };

  const form = document.getElementById('opcoes') as HTMLFormElement;
  const premissa = document.getElementById('premissa')!;
  const prompt = document.getElementById('prompt')!;

  const travas: Travas = { personagemA: false, personagemB: false, local: false };
  const TIPOS = ['personagemA', 'personagemB', 'local'] as const;

  let atual: Sorteio | null = null;

  const lerOpcoes = (): Opcoes => {
    const dados = new FormData(form);
    return {
      subgenero: String(dados.get('subgenero')),
      misturarMundos: dados.get('misturarMundos') === 'on',
    };
  };

  /* Cada carta mostra a peça que tem mundo (a profissão, ou o local) e, nas
     duas de personagem, o traço embaixo. A etiqueta sai sempre da peça de
     mundo — característica e personalidade são universais e não têm o que
     etiquetar. */
  const conteudoDaCarta = (s: Sorteio, tipo: (typeof TIPOS)[number]) => {
    if (tipo === 'local') {
      return { nome: s.local.nome, traco: '', subgenero: s.local.subgenero };
    }
    const personagem = s[tipo];
    const traco = tipo === 'personagemA' ? personagem.caracteristica : personagem.personalidade;
    return { nome: personagem.profissao.nome, traco, subgenero: personagem.profissao.subgenero };
  };

  function pintar(sorteio: Sorteio, opcoes: Opcoes) {
    for (const tipo of TIPOS) {
      const carta = document.querySelector(`[data-carta="${tipo}"]`)!;
      const { nome, traco, subgenero } = conteudoDaCarta(sorteio, tipo);
      carta.querySelector('[data-papel="nome"]')!.textContent = nome;
      carta.querySelector('[data-papel="traco"]')!.textContent = traco;
      carta.querySelector('[data-papel="etiqueta"]')!.textContent = subgenero.replace(/-/g, ' ');
    }

    const mundo = nomearMundos(sorteio, opcoes, nomesDosMundos);
    premissa.textContent = redigir(sorteio, MOLDE, mundo);
    prompt.textContent = montarPrompt(modeloDoPrompt, {
      mundo,
      personagemA: `${sorteio.personagemA.profissao.nome} que ${sorteio.personagemA.caracteristica}`,
      personagemB: `${sorteio.personagemB.profissao.nome} que é ${sorteio.personagemB.personalidade}`,
      local: sorteio.local.nome,
      fato: sorteio.fato,
    });
  }

  function rolar() {
    const opcoes = lerOpcoes();
    atual = sortear(pools, opcoes, travas, atual, Math.random);
    pintar(atual, opcoes);
  }

  document.getElementById('sortear')!.addEventListener('click', rolar);

  /* A mensagem de sucesso vem pronta em vez de ser montada com o nome da peça:
     "premissa" é feminino e "prompt" é masculino, e montar a frase aqui daria
     "Prompt copiada". */
  async function copiar(texto: string, aviso: HTMLElement, sucesso: string) {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      aviso.textContent = sucesso;
    } catch {
      aviso.textContent = 'Não foi possível copiar automaticamente.';
    }
    setTimeout(() => { aviso.textContent = ''; }, 2000);
  }

  const avisoDaPremissa = document.getElementById('aviso-premissa')!;
  const avisoDoPrompt = document.getElementById('aviso-prompt')!;

  document.getElementById('copiar-premissa')!.addEventListener('click', () => {
    copiar(premissa.textContent ?? '', avisoDaPremissa, 'Premissa copiada.');
  });

  document.getElementById('copiar-prompt')!.addEventListener('click', () => {
    copiar(prompt.textContent ?? '', avisoDoPrompt, 'Prompt copiado.');
  });

  for (const botao of document.querySelectorAll<HTMLButtonElement>('[data-travar]')) {
    botao.addEventListener('click', () => {
      const tipo = botao.dataset.travar as keyof Travas;
      travas[tipo] = !travas[tipo];
      // aria-pressed é o estado inteiro: o CSS troca o cadeado aberto pelo
      // fechado a partir dele. Nada de mexer no conteúdo do botão aqui —
      // escrever textContent apagaria os dois SVGs de dentro dele.
      botao.setAttribute('aria-pressed', String(travas[tipo]));
    });
  }

  // Trocar de mundo (ou qualquer opção do formulário) zera o sorteio anterior:
  // sem isto, uma peça travada do mundo antigo sobreviveria e contradiria a
  // opção recém-escolhida. As travas também zeram aqui — sortear() já as ignora
  // sem `anterior`, mas sem este trecho os cadeados continuariam fechados, com
  // aria-pressed="true", para peças que não estão mais travadas.
  form.addEventListener('change', () => {
    atual = null;
    for (const tipo of TIPOS) {
      travas[tipo] = false;
      document.querySelector<HTMLButtonElement>(`[data-travar="${tipo}"]`)!
        .setAttribute('aria-pressed', 'false');
    }
    rolar();
  });

  rolar();
</script>
```

- [ ] **Step 5: Rodar os dois portões**

Run: `npx vitest run && npm run check`
Expected: os dois PASS. `astro check` é o que pega `data-carta="arquetipo"` sobrando ou tipo desalinhado no script.

- [ ] **Step 6: Rodar o build**

Run: `npm run build`
Expected: PASS. É aqui que a chamada de `montarPrompt` em tempo de build confere os marcadores do `prompt-ia.md`.

Se o build reclamar de esquema de conteúdo sem motivo aparente, apagar `.astro/` e rodar de novo — o cache guarda entradas interpretadas pelo esquema antigo.

- [ ] **Step 7: Conferir no navegador**

Run: `npm run dev` e abrir `http://localhost:4321/gerador/`

Conferir, item a item:
- As três cartas dizem "Personagem A", "Personagem B" e "Local".
- As duas de personagem mostram profissão em cima e traço embaixo; a de local mostra só o nome, sem espaço sobrando.
- A premissa aparece em quatro linhas, com as linhas em branco entre elas.
- O formulário tem só "Mundo" e "Misturar mundos".
- Clicar em "Gerar" várias vezes: as duas profissões nunca saem iguais.
- Travar as três cartas e clicar em "Gerar": só o fato muda.
- Ligar "Misturar mundos": a primeira linha mostra mais de um mundo, em minúscula.
- Trocar o mundo no seletor: os cadeados voltam a abrir sozinhos.
- Os dois botões de copiar levam o texto certo.
- Trocar para o tema claro e conferir que as duas linhas da carta continuam legíveis.

- [ ] **Step 8: Commit**

```bash
git add src/pages/gerador.astro
git commit -m "Mostra dois personagens nas cartas do gerador"
```

---

### Task 6: A documentação

Três documentos descrevem o gerador antigo e passam a mentir. Esta task é o que impede o próximo leitor de confiar neles.

**Files:**
- Modify: `docs/atributos-do-gerador.md` (reescrita inteira)
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: o comportamento final das Tasks 1–5.
- Produces: nada.

- [ ] **Step 1: Reescrever `docs/atributos-do-gerador.md`**

É o inventário do que o gerador pode produzir, e existe porque essas peças não aparecem em página nenhuma do site — só se conhece o repertório rolando o gerador. Passa a listar:

- as 60 profissões, agrupadas pelos seis mundos;
- as 30 características, as 30 personalidades e os 40 fatos, cada lista inteira;
- o molde único, com a tabela dos sete marcadores (`{mundo}`, `{profissaoA}`, `{caracteristica}`, `{profissaoB}`, `{personalidade}`, `{em:local}`, `{fato}`) e o que cada um recebe;
- as regras do sorteio: profissões diferentes entre A e B, fato sem cadeado e sem repetir o anterior, travas nas três cartas, filtro por mundo só em profissões e locais.

Saem as seções de arquétipos, elementos, complicações por família e os 10 moldes. A tabela de origem das peças passa a apontar para `src/lib/gerador/` nas quatro listas e para `src/content/cenarios/` nos locais.

- [ ] **Step 2: Reescrever a seção "Gerador de premissas" do `CLAUDE.md`**

O que precisa mudar, ponto a ponto:

- `sortear()` escolhe **dois personagens + local + fato**, não arquétipo/cenário/elemento/complicação.
- As travas são `personagemA`, `personagemB`, `local`; **o fato nunca trava e nunca repete o anterior**. Sai a menção às famílias de complicação.
- O banco editorial em TypeScript passa a ser **quatro** arquivos, não um. Manter a explicação de por que eles moram em código e não em Markdown, e a regra de começar em minúscula e não terminar em ponto.
- `dados.test.ts` tranca 60 profissões (10 por mundo), 30, 30 e 40 — não mais "7 famílias, 40 complicações, 10 moldes".
- **Um molde só**, `MOLDE`, com sete marcadores. Sai a regra de "todo molde usa as quatro peças".
- A seção de concordância encolhe: sobra `contrair`. Apagar a parte sobre `numeroDe`, a heurística de número e o pedido de "leia os comentários antes de mexer" — a função não existe mais.
- Em `gerador.astro`: só os **cenários** são injetados como JSON; as quatro listas são importadas pelo `<script>`.
- Os marcadores do prompt viraram `[MUNDO]`, `[PERSONAGEM A]`, `[PERSONAGEM B]`, `[LOCAL]`, `[FATO]`.

Fora dessa seção, dois trechos também envelheceram:

- A regra de `arquetipos.artigo` na seção "Conteúdo" diz que o gerador tira dali o artigo e o gênero do `{pronome}`. **Reescrever, não apagar**: o campo continua obrigatório porque é o que registra o gênero de cada arquétipo no acervo, mas o gerador não o lê mais.
- O parágrafo dos sete lugares com o tamanho do acervo cita "o rótulo de 'incluir comuns' e o comentário dos pools em `gerador.astro`". O rótulo não existe mais e o comentário mudou de texto — são seis lugares agora. Conferir os outros cinco e corrigir a contagem.

- [ ] **Step 3: Conferir o `README.md`**

O texto diz "um gerador que combina as peças em premissas prontas para começar uma história" e "o gerador roda inteiramente no navegador, a partir de dados embutidos na página em tempo de build". A segunda frase continua verdadeira. A primeira também, mas conferir se alguma frase em volta promete arquétipo ou elemento no gerador — se prometer, ajustar.

Os números do acervo (76 arquétipos, 60 cenários, 60 elementos, 36 livros) **não mudam**: nenhum arquivo de `src/content/` foi tocado.

- [ ] **Step 4: Rodar os dois portões uma última vez**

Run: `npx vitest run && npm run check`
Expected: PASS nos dois.

- [ ] **Step 5: Commit**

```bash
git add docs/atributos-do-gerador.md CLAUDE.md README.md
git commit -m "Atualiza a documentação para a premissa de personagens"
```

---

## Verificação final

Depois da Task 6, com tudo commitado no branch `premissa-de-personagens`:

```bash
npx vitest run && npm run check && npm run build
```

Os três precisam passar — os dois primeiros são o que o GitHub Actions roda antes de publicar.

**Publicar é decisão da autora.** O branch fica esperando; nada vai para o ar sem ela pedir.
