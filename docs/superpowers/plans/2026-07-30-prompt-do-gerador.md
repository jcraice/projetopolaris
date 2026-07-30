# Gerador de prompt para IA — Plano de Implementação

> **Para quem executa com agentes:** SUB-SKILL OBRIGATÓRIA: use
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para implementar tarefa por tarefa. Os passos usam
> caixas (`- [ ]`) para acompanhamento.

**Objetivo:** acrescentar ao gerador um card que monta um prompt completo para
IA a partir das peças sorteadas, e pôr cada botão no rodapé do bloco a que ele
pertence.

**Arquitetura:** duas funções puras novas em `src/lib/gerador/` fazem a montagem
e são testadas de verdade; o texto do prompt mora num arquivo de conteúdo e é
injetado na página em tempo de build, como o acervo já é; o `<script>` da página
só liga as funções ao DOM.

**Pilha:** Astro 7, TypeScript estrito, Vitest, CSS puro com tokens em `:root`,
sem framework de interface e sem dependência de runtime no cliente.

**Spec:** [2026-07-30-prompt-do-gerador-design.md](../specs/2026-07-30-prompt-do-gerador-design.md)

## Sobre os testes deste plano

Diferente dos dois planos anteriores, **este tem teste de verdade**. A Task 1 é
TDD de ponta a ponta: as duas funções são puras, vivem em `src/lib/gerador/` e a
suíte já alcança essa pasta. As Tasks 2 e 3 são conteúdo, template e CSS, que o
repositório não tem como testar — elas se verificam pelo portão e pelo navegador.

**Contagem de testes:** 72 hoje. A Task 1 acrescenta **10 casos num arquivo
novo**, e o esperado passa a ser **82 testes em 10 arquivos** daí em diante.
Qualquer outro número é problema.

## Restrições globais

Do [CLAUDE.md](../../../CLAUDE.md) e do spec, valem para toda tarefa:

- **Tudo em português do Brasil**: identificadores, nomes de arquivo, comentários
  e mensagens de commit (imperativo — "Adiciona busca global"). O repositório
  **não** usa Conventional Commits: nada de `feat:` ou `fix:`.
- **Prosa autoral não entra em `.astro`.** O texto do prompt vai para
  `src/content/paginas/`, e entra **verbatim** — sem corrigir, reescrever ou
  reformatar.
- **Sem framework e sem dependência de runtime.** Nenhuma requisição em tempo de
  execução: o texto do prompt é injetado no HTML em build, como os pools.
- **A lógica testável fica na lib.** O `<script>` da página importa funções puras
  e só faz a ligação com o DOM — é o padrão de todo script do site.
- **`Math.random()` não entra na lib.** Quem injeta o acaso é o script da página.
- **Toda cor vem de token em `:root`**, pedida por papel. Nenhuma mudança de cor,
  tamanho de fonte ou opacidade da aurora: as contas de
  [verificacao-visual.md](../../verificacao-visual.md) não são refeitas.
- **A premissa e o motor de concordância ficam intactos.** `redigir`, `MOLDES` e
  `redacao.ts` continuam em uso e não devem ser tocados.
- Comentário no código é obrigatório em decisão não óbvia — é o padrão do
  repositório. Os comentários deste plano vêm escritos; copie-os.

### Estado ao começar

Branch `prompt-do-gerador`, criado a partir de `main`, com o spec já commitado e
a árvore limpa. `esquemaPagina` é `.strict()`: um campo a mais no frontmatter
quebra o build de propósito.

## Estrutura de arquivos

| Arquivo | Responsabilidade | Tarefas |
|---|---|---|
| `src/lib/gerador/prompt.ts` | **Novo** — `nomearMundos` e `montarPrompt` | 1 |
| `src/lib/gerador/prompt.test.ts` | **Novo** — os 10 casos | 1 |
| `src/lib/gerador/index.ts` | Exporta as duas funções e o tipo | 1 |
| `src/content/paginas/prompt-ia.md` | **Novo** — o texto do prompt | 2 |
| `src/pages/gerador.astro` | Injeção, card do prompt, montagem, botões | 2, 3 |

---

## Task 1: As duas funções puras

TDD. Nenhuma outra tarefa depende desta para compilar, mas as duas seguintes a
consomem.

**Arquivos:**
- Criar: `src/lib/gerador/prompt.ts`
- Testar: `src/lib/gerador/prompt.test.ts`
- Modificar: `src/lib/gerador/index.ts`

**Interfaces:**
- Consome: os tipos `Opcoes` e `Sorteio` de `./tipos`.
- Produz, para as Tasks 2 e 3:
  - `nomearMundos(sorteio: Sorteio, opcoes: Opcoes, nomes: Record<string, string>): string`
  - `montarPrompt(modelo: string, valores: ValoresDoPrompt): string`
  - `type ValoresDoPrompt = { mundo: string; arquetipo: string; cenario: string; elemento: string }`

- [ ] **Passo 1: Escrever os testes de `nomearMundos`**

Criar `src/lib/gerador/prompt.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { montarPrompt, nomearMundos } from './prompt';
import type { Opcoes, Sorteio } from './tipos';

const NOMES = {
  'space-opera': 'Space Opera',
  distopia: 'Distopia',
  cyberpunk: 'Cyberpunk',
};

// Só os subgêneros importam para nomearMundos; o resto do sorteio é preenchido
// com valores plausíveis para o objeto ser do tipo certo.
const sorteioCom = (arquetipo: string, cenario: string, elemento: string): Sorteio => ({
  arquetipo: { id: 'a', nome: 'O Hacker', subgenero: arquetipo },
  cenario: { id: 'c', nome: 'Megacidades superpovoadas', subgenero: cenario, singular: 'uma megacidade superpovoada' },
  elemento: { id: 'e', nome: 'Vigilância onipresente', subgenero: elemento },
  complicacao: 'alguém do mesmo lado já negociou a rendição de todos',
  familia: 'Traição e confiança',
});

const opcoesCom = (subgenero: string | null, misturarMundos: boolean): Opcoes => ({
  subgenero,
  misturarMundos,
  incluirComuns: false,
});

describe('nomearMundos', () => {
  it('sem misturar, devolve o nome do mundo escolhido no seletor', () => {
    const sorteio = sorteioCom('distopia', 'distopia', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', false), NOMES)).toBe('Distopia');
  });

  it('sem misturar, devolve o próprio identificador quando o nome é desconhecido', () => {
    const sorteio = sorteioCom('mundo-novo', 'mundo-novo', 'mundo-novo');
    expect(nomearMundos(sorteio, opcoesCom('mundo-novo', false), NOMES)).toBe('mundo-novo');
  });

  it('misturando, não repete o nome quando as três peças são do mesmo mundo', () => {
    const sorteio = sorteioCom('cyberpunk', 'cyberpunk', 'cyberpunk');
    expect(nomearMundos(sorteio, opcoesCom('cyberpunk', true), NOMES)).toBe('Cyberpunk');
  });

  it('misturando, junta dois mundos na ordem arquétipo, cenário, elemento', () => {
    const sorteio = sorteioCom('distopia', 'cyberpunk', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', true), NOMES)).toBe('Distopia + Cyberpunk');
  });

  it('misturando, junta os três quando as peças vêm de mundos diferentes', () => {
    const sorteio = sorteioCom('space-opera', 'distopia', 'cyberpunk');
    expect(nomearMundos(sorteio, opcoesCom('space-opera', true), NOMES)).toBe(
      'Space Opera + Distopia + Cyberpunk',
    );
  });

  it('misturando, ignora o pool comuns, que não é um mundo', () => {
    const sorteio = sorteioCom('comuns', 'distopia', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', true), NOMES)).toBe('Distopia');
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

```bash
npx vitest run src/lib/gerador/prompt.test.ts
```

Esperado: falha ao resolver o import — o arquivo `./prompt` ainda não existe.

- [ ] **Passo 3: Implementar `nomearMundos`**

Criar `src/lib/gerador/prompt.ts`:

```typescript
import type { Opcoes, Sorteio } from './tipos';

/* O pool `comuns` não é um mundo: são os 20 arquétipos que servem a todos. Com
   "misturar mundos" ligado ele entra no sorteio como qualquer outro, e um
   "Distopia + 20 Arquétipos Comuns" na linha "Mundo:" do prompt não descreveria
   mundo nenhum — descreveria o acervo. Por isso ele não contribui com nome. */
const NAO_E_MUNDO = 'comuns';

export function nomearMundos(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarMundos) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  /* A ordem é a das cartas na tela — arquétipo, cenário, elemento — e o Set
     preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na ordem em
     que a pessoa lê as peças, não em ordem alfabética nem de coleção. */
  const usados = [
    sorteio.arquetipo.subgenero,
    sorteio.cenario.subgenero,
    sorteio.elemento.subgenero,
  ].filter((subgenero) => subgenero !== NAO_E_MUNDO);

  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}
```

- [ ] **Passo 4: Rodar e ver passar**

```bash
npx vitest run src/lib/gerador/prompt.test.ts
```

Esperado: 6 testes passando.

- [ ] **Passo 5: Escrever os testes de `montarPrompt`**

Acrescentar ao fim de `src/lib/gerador/prompt.test.ts`:

```typescript
describe('montarPrompt', () => {
  const valores = {
    mundo: 'Cyberpunk',
    arquetipo: 'O Hacker',
    cenario: 'Megacidades superpovoadas',
    elemento: 'Vigilância onipresente',
  };

  it('troca os quatro marcadores pelos valores do sorteio', () => {
    const modelo = 'Mundo: [MUNDO]\nPersonagem: [ARQUÉTIPO]\nLugar: [CENÁRIO]\nMotor: [ELEMENTO NARRATIVO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'Mundo: Cyberpunk\nPersonagem: O Hacker\nLugar: Megacidades superpovoadas\nMotor: Vigilância onipresente',
    );
  });

  it('troca todas as ocorrências do mesmo marcador', () => {
    const modelo = '[MUNDO] e de novo [MUNDO], com [ARQUÉTIPO], [CENÁRIO] e [ELEMENTO NARRATIVO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'Cyberpunk e de novo Cyberpunk, com O Hacker, Megacidades superpovoadas e Vigilância onipresente',
    );
  });

  // O caso real que motivou a checagem: ARQUETIPO sem acento não é o marcador
  // que a função conhece, e sem erro o prompt chegaria na IA com ele cru.
  it('lança quando sobra um marcador em maiúsculas que ela não conhece', () => {
    const modelo = '[MUNDO] [ARQUETIPO] [CENÁRIO] [ELEMENTO NARRATIVO]';
    expect(() => montarPrompt(modelo, valores)).toThrow(/ARQUETIPO/);
  });

  it('deixa passar colchetes em minúsculas, que são texto e não marcador', () => {
    const modelo = '[MUNDO] [ARQUÉTIPO] [CENÁRIO] [ELEMENTO NARRATIVO] [ver nota]';
    expect(montarPrompt(modelo, valores)).toContain('[ver nota]');
  });
});
```

- [ ] **Passo 6: Rodar e ver falhar**

```bash
npx vitest run src/lib/gerador/prompt.test.ts
```

Esperado: os 6 primeiros passam, os 4 novos falham porque `montarPrompt` não
existe.

- [ ] **Passo 7: Implementar `montarPrompt`**

Acrescentar a `src/lib/gerador/prompt.ts`:

```typescript
export type ValoresDoPrompt = {
  mundo: string;
  arquetipo: string;
  cenario: string;
  elemento: string;
};

const MARCADORES: Record<string, keyof ValoresDoPrompt> = {
  '[MUNDO]': 'mundo',
  '[ARQUÉTIPO]': 'arquetipo',
  '[CENÁRIO]': 'cenario',
  '[ELEMENTO NARRATIVO]': 'elemento',
};

/* Marcador é colchete com só maiúsculas e espaço dentro — é a convenção dos
   quatro que existem. A definição é estreita de propósito: um "[ver nota]" em
   minúsculas no meio da prosa continua sendo texto, e a autora pode escrever
   colchetes no prompt-ia.md sem que a montagem pare de funcionar. */
const MARCADOR_QUE_SOBROU = /\[\p{Lu}[\p{Lu} ]*\]/u;

export function montarPrompt(modelo: string, valores: ValoresDoPrompt): string {
  let texto = modelo;
  for (const [marcador, chave] of Object.entries(MARCADORES)) {
    texto = texto.split(marcador).join(valores[chave]);
  }

  /* Falhar alto em vez de devolver o texto pela metade: um marcador escrito
     errado no prompt-ia.md vira teste vermelho, e não um prompt que chega na IA
     com "[ARQUETIPO]" cru no meio. */
  const sobrou = texto.match(MARCADOR_QUE_SOBROU);
  if (sobrou) {
    throw new Error(`marcador desconhecido no modelo do prompt: ${sobrou[0]}`);
  }

  return texto;
}
```

- [ ] **Passo 8: Rodar e ver passar**

```bash
npx vitest run src/lib/gerador/prompt.test.ts
```

Esperado: 10 testes passando.

- [ ] **Passo 9: Exportar pelo ponto único de entrada**

Em `src/lib/gerador/index.ts`, acrescentar as duas linhas junto das que já
existem — nada fora da pasta importa arquivo interno:

```typescript
export { montarPrompt, nomearMundos } from './prompt';
export type { ValoresDoPrompt } from './prompt';
```

- [ ] **Passo 10: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: **82 testes em 10 arquivos**, 0 erros/0 avisos/0 hints, 39 páginas.

- [ ] **Passo 11: Commitar**

```bash
git add src/lib/gerador/
git commit -m "Monta o texto do prompt a partir das peças sorteadas"
```

---

## Task 2: O texto do prompt e o card

**Arquivos:**
- Criar: `src/content/paginas/prompt-ia.md`
- Modificar: `src/pages/gerador.astro`

**Interfaces:**
- Consome: `montarPrompt`, `nomearMundos` e `ValoresDoPrompt` da Task 1,
  importados de `../lib/gerador`.

Os botões continuam onde estão nesta tarefa; a Task 3 os move.

- [ ] **Passo 1: Criar o arquivo de conteúdo**

`src/content/paginas/prompt-ia.md`. O corpo é o texto da autora e entra
exatamente como está aqui — sem corrigir, sem reformatar, sem mexer nas quebras
de linha, que fazem parte do que a IA vai receber:

```markdown
---
titulo: "Prompt para IA"
ordem: 8
---

Você é um roteirista de ficção científica experiente. Crie um enredo estruturado
usando os seguintes elementos sorteados como restrições criativas obrigatórias:

- Mundo: [MUNDO]
- Arquétipo (personagem): [ARQUÉTIPO]
- Cenário: [CENÁRIO]
- Elemento narrativo: [ELEMENTO NARRATIVO]

Estruture a resposta assim:

1. Título e logline — uma frase que resuma a história.
2. Protagonista — nome, motivação central, e uma falha ou ferida interna que
   dialogue com o arquétipo acima.
3. Enredo em ato único — um fluxo contínuo (sem divisão em atos separados) que
   cubra: situação inicial ancorada no cenário, incidente incitante, escalada
   do conflito (com o elemento narrativo como motor principal, não detalhe de
   ambientação), clímax e resolução — resolvendo ou subvertendo a falha do
   protagonista.
4. Pontos de virada — pelo menos 2 reviravoltas explícitas dentro desse fluxo
   único, indicando em que momento da história cada uma ocorre.
5. Arco do personagem — como o protagonista muda do início ao fim.

Restrições:
- Máximo de 400 palavras.
- Evite clichês genéricos do gênero; use os quatro elementos como restrições
  específicas, não como pano de fundo.
- O elemento narrativo precisa ser central ao conflito — se puder remover essa
  peça da história sem nada mudar, refaça.
- Não divida a resposta em atos ou capítulos: é uma história compacta, de
  leitura corrida.
```

**Atenção:** o texto foi entregue entre linhas de `---`. Aquilo delimitava a
mensagem, não faz parte do prompt, e um `---` no início do corpo colidiria com o
frontmatter. O corpo começa em "Você é um roteirista".

- [ ] **Passo 2: Ler o modelo e os nomes dos mundos em build**

Em `src/pages/gerador.astro`, no frontmatter, trocar a linha de import e
acrescentar depois da definição de `mundos`:

```astro
import { getCollection, getEntry } from 'astro:content';
```

```astro
// O texto do prompt é conteúdo da autora, não código: mora em Markdown e é lido
// como texto cru (`body`), nunca renderizado — o que a IA recebe é o que está
// escrito lá.
const modeloDoPrompt = await getEntry('paginas', 'prompt-ia');
if (!modeloDoPrompt) throw new Error("página 'prompt-ia' não encontrada em src/content/paginas");

// Mapa de identificador para nome de exibição, para o prompt dizer "Space Opera"
// e não "space-opera". Só os mundos entram; `comuns` não é mundo e nomearMundos
// o ignora.
const nomesDosMundos = Object.fromEntries(mundos.map((m) => [m.id, m.data.nome]));
```

- [ ] **Passo 3: Acrescentar o card do prompt**

No template, logo **depois** da `<section class="bloco bloco-premissa">` que já
existe:

```astro
  <section class="bloco bloco-prompt" aria-labelledby="prompt-titulo">
    <h2 id="prompt-titulo">Crie enredos com sua IA favorita</h2>
    {/* Sem aria-live, ao contrário da premissa: são cerca de trezentas palavras,
        e relê-las a cada clique em Gerar tornaria a página impraticável com
        leitor de tela. Quem quiser o texto chega nele navegando. */}
    <p id="prompt" class="prompt__texto"></p>
  </section>
```

- [ ] **Passo 4: Renomear o card da premissa**

Com dois cards na página, "Dica de enredo" descreveria melhor o card novo do que
o antigo. A seção da premissa passa a se chamar "Premissa", e o `id` do título
acompanha, porque `dica-titulo` deixou de dizer o que é:

```astro
  <section class="bloco bloco-premissa" aria-labelledby="premissa-titulo">
    <h2 id="premissa-titulo">Premissa</h2>
```

O `aria-labelledby` da seção precisa mudar junto — apontar para um id que não
existe mais deixaria a seção sem nome acessível.

- [ ] **Passo 5: Injetar os dois dados novos**

Logo abaixo do `<script type="application/json" id="pools" ...>` que já existe:

```astro
  <script type="application/json" id="modelo-prompt" is:inline set:html={JSON.stringify(modeloDoPrompt.body)}></script>
  <script type="application/json" id="nomes-dos-mundos" is:inline set:html={JSON.stringify(nomesDosMundos)}></script>
```

- [ ] **Passo 6: Dar estilo ao texto do prompt**

No `<style>`, junto das outras regras:

```css
  /* pre-wrap, e não <pre>: as quebras de linha do prompt-ia.md fazem parte do
     texto — sem elas a lista numerada vira um bloco único ilegível —, mas isto
     é texto para ler, não código, então nada de fonte monoespaçada nem moldura. */
  .prompt__texto {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.5;
  }
```

- [ ] **Passo 7: Montar o prompt a cada sorteio**

No `<script>`, quatro mudanças.

Primeiro, o import e as duas leituras dos dados injetados:

```typescript
  import { montarPrompt, nomearMundos, sortear, redigir, MOLDES } from '../lib/gerador';
  import type { Opcoes, Pools, Sorteio, Travas } from '../lib/gerador';

  const pools: Pools = JSON.parse(document.getElementById('pools')!.textContent!);
  const modeloDoPrompt: string = JSON.parse(document.getElementById('modelo-prompt')!.textContent!);
  const nomesDosMundos: Record<string, string> = JSON.parse(
    document.getElementById('nomes-dos-mundos')!.textContent!,
  );
```

Segundo, a referência ao parágrafo novo, junto das que já existem:

```typescript
  const prompt = document.getElementById('prompt')!;
```

Terceiro, `pintar` passa a receber as opções e a escrever o prompt. As opções
vêm por parâmetro, e não de uma segunda chamada a `lerOpcoes()`, para o prompt
descrever exatamente o sorteio que está na tela:

```typescript
  function pintar(sorteio: Sorteio, molde: string, opcoes: Opcoes) {
    for (const tipo of ['arquetipo', 'cenario', 'elemento'] as const) {
      const carta = document.querySelector(`[data-carta="${tipo}"]`)!;
      const peca = sorteio[tipo];
      carta.querySelector('[data-papel="nome"]')!.textContent = peca.nome;
      carta.querySelector('[data-papel="etiqueta"]')!.textContent = peca.subgenero.replace(/-/g, ' ');
    }
    premissa.textContent = redigir(sorteio, molde);
    prompt.textContent = montarPrompt(modeloDoPrompt, {
      mundo: nomearMundos(sorteio, opcoes, nomesDosMundos),
      arquetipo: sorteio.arquetipo.nome,
      cenario: sorteio.cenario.nome,
      elemento: sorteio.elemento.nome,
    });
  }
```

Quarto, `rolar` lê as opções uma vez e repassa:

```typescript
  function rolar() {
    const opcoes = lerOpcoes();
    atual = sortear(pools, opcoes, travas, atual, Math.random);
    pintar(atual, moldeAoAcaso(), opcoes);
  }
```

- [ ] **Passo 8: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 82 testes em 10 arquivos, 0 erros, 39 páginas. O build é o que valida
o frontmatter do arquivo novo contra o Zod, que é `.strict()`.

- [ ] **Passo 9: Conferir no navegador**

```bash
npm run dev
```

Em `http://localhost:4321/gerador`:

1. O card "Crie enredos com sua IA favorita" aparece depois da premissa.
2. O texto tem as quebras de linha e a lista numerada preservadas — não é um
   parágrafo único.
3. Os quatro valores estão encaixados: "Mundo:", "Arquétipo (personagem):",
   "Cenário:" e "Elemento narrativo:" mostram o que as cartas mostram.
4. Clicar em "Gerar" troca as peças **e** o prompt junto.
5. Marcar "Misturar mundos" e gerar algumas vezes até sair mais de um mundo: a
   linha "Mundo:" mostra os nomes unidos por " + ".
6. Nenhum `[MARCADOR]` sobra visível no texto.

- [ ] **Passo 10: Commitar**

```bash
git add src/content/paginas/prompt-ia.md src/pages/gerador.astro
git commit -m "Acrescenta o card com o prompt pronto para IA"
```

---

## Task 3: Cada botão no rodapé do seu bloco

**Arquivos:**
- Modificar: `src/pages/gerador.astro`

**Interfaces:**
- Consome: o card e o parágrafo `#prompt` da Task 2.

- [ ] **Passo 1: Pôr o "Gerar" dentro do bloco das peças**

Em `src/pages/gerador.astro`, dentro da `<section id="cartas">`, depois do
`{CARTAS.map(...)}` e antes do `</section>`:

```astro
    <div class="acoes">
      <button type="button" class="botao botao--principal" id="sortear">Gerar</button>
    </div>
```

- [ ] **Passo 2: Pôr o "Copiar premissa" dentro do bloco da premissa**

Dentro da `<section class="bloco bloco-premissa">`, depois do `<p id="premissa">`:

```astro
    <div class="acoes">
      <button type="button" class="botao" id="copiar-premissa">Copiar premissa</button>
    </div>
    <span class="aviso" id="aviso-premissa" role="status"></span>
```

- [ ] **Passo 3: Pôr o "Copiar prompt" dentro do card do prompt**

Dentro da `<section class="bloco bloco-prompt">`, depois do `<p id="prompt">`:

```astro
    <div class="acoes">
      <button type="button" class="botao" id="copiar-prompt">Copiar prompt</button>
    </div>
    <span class="aviso" id="aviso-prompt" role="status"></span>
```

- [ ] **Passo 4: Remover a fileira antiga**

Apagar do template o bloco que ficava depois de tudo:

```astro
  <div class="acoes">
    <button type="button" class="botao botao--principal" id="sortear">Gerar</button>
    <button type="button" class="botao" id="copiar">Copiar</button>
  </div>
  <span id="aviso" role="status"></span>
```

- [ ] **Passo 5: Centralizar**

No `<style>`, substituir a regra `.acoes` e a regra `#aviso` por:

```css
  /* Cada bloco termina com a ação que pertence a ele, centralizada no rodapé —
     o botão fica junto do que ele opera, em vez de uma fileira no fim da página
     comandando três coisas distantes. */
  .acoes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin: 16px 0 0;
  }

  /* Um aviso por botão de copiar, logo abaixo dele: a confirmação aparece onde
     a pessoa clicou, e não num canto distante da página. */
  .aviso {
    display: block;
    min-height: 1.2em;
    margin-top: 8px;
    text-align: center;
    color: var(--apagado);
    font-size: 0.85rem;
  }
```

- [ ] **Passo 6: Ligar os dois botões de copiar**

No `<script>`, substituir o bloco inteiro do `document.getElementById('copiar')`
por:

```typescript
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
```

E apagar a linha `const aviso = document.getElementById('aviso')!;` do topo do
script, que não tem mais alvo.

- [ ] **Passo 7: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 82 testes em 10 arquivos, 0 erros, 39 páginas. Um `#aviso` esquecido no
script vira erro de `npm run check`, porque `getElementById` devolveria `null`
com o `!` mentindo — se o check reclamar, sobrou referência ao id antigo.

- [ ] **Passo 8: Conferir no navegador**

Em `http://localhost:4321/gerador`:

1. Três botões, um por bloco, cada um centralizado no rodapé do seu: "Gerar" nas
   peças, "Copiar premissa" na premissa, "Copiar prompt" no prompt.
2. Nenhum botão sobrou no fim da página.
3. "Copiar premissa" copia a frase; cole em qualquer lugar para conferir. O aviso
   "Premissa copiada." aparece embaixo daquele botão, e some sozinho.
4. "Copiar prompt" copia o prompt inteiro, com as quebras de linha.
5. Em 375px de largura, os botões continuam confortáveis e nada sai da tela.
6. Os dois temas, conferindo que o botão principal continua legível.

- [ ] **Passo 9: Commitar**

```bash
git add src/pages/gerador.astro
git commit -m "Move cada botão para o rodapé do bloco a que pertence"
```

---

## Depois do plano

**A coleção `paginas` ganhou uma quarta forma de entrada.** Já tinha páginas
inteiras, os fragmentos `-como-usar` e a home com campos de frontmatter; agora
tem um modelo de texto que não é página nenhuma. Nada quebra hoje porque nenhum
consumidor usa `getCollection('paginas')` — todos buscam entrada nomeada. Se um
dia aparecer um índice de páginas, vale o campo `fragmento: true` que a revisão
anterior sugeriu, para a distinção morar no dado e não no nome do arquivo.

**O CLAUDE.md descreve o gerador** e não menciona o prompt. Vale uma frase na
seção do gerador quando este trabalho estiver no ar.
