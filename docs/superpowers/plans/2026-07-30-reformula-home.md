# Reformulação da home, textos de Estilos e cantos arredondados — Plano de Implementação

> **Para quem executa com agentes:** SUB-SKILL OBRIGATÓRIA: use
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para implementar tarefa por tarefa. Os passos usam
> caixas (`- [ ]`) para acompanhamento.

**Objetivo:** reescrever a home com o texto novo da autora, acrescentar dois
textos à página de Estilos, descer o "Como usar esta página" para depois dos
subgêneros nos três índices, e arredondar os cantos de botões e cards.

**Arquitetura:** toda a prosa nova entra em `src/content/paginas/*.md`, nunca em
`.astro` — inclusive a home, que ganha arquivo próprio e para de pescar
parágrafos do `sobre.md`. Os cantos saem de dois tokens novos em `:root`, no
mesmo padrão dos tokens de cor.

**Pilha:** Astro 7, coleções de conteúdo com esquemas Zod, CSS puro com tokens em
`:root`, sem framework de interface e sem dependência de runtime no cliente.

**Spec:** [2026-07-30-reformula-home-design.md](../specs/2026-07-30-reformula-home-design.md)

## Sobre os testes deste plano

A suíte de vitest cobre funções puras de `src/lib/`. Deste plano, só a **Task 5**
toca uma função — e para removê-la, junto com os testes dela. As demais tarefas
são conteúdo Markdown, template `.astro` e CSS, que este repositório não tem como
testar automaticamente e não passa a ter aqui.

O que verifica cada tarefa:

1. `npm run build` — é ele que valida o frontmatter novo contra o Zod. Uma
   entrada de conteúdo com campo errado quebra o build, e é o mais próximo de um
   teste que este trabalho tem.
2. `npx vitest run` e `npm run check` — provam que nada mais quebrou.
3. Conferência no navegador, com o que olhar descrito passo a passo.

**Contagem de testes:** 75 até a Task 4. A Task 5 remove três casos e o esperado
passa a ser **72**. Qualquer outro número em qualquer tarefa é problema.

## Restrições globais

Do [CLAUDE.md](../../../CLAUDE.md) e do spec, valem para toda tarefa:

- **Tudo em português do Brasil**: identificadores, nomes de arquivo, comentários
  e mensagens de commit (imperativo — "Adiciona busca global"). O repositório
  **não** usa Conventional Commits: nada de `feat:` ou `fix:`.
- **Prosa autoral não entra em `.astro`.** Todo texto novo vai para
  `src/content/paginas/`. Copiar um parágrafo da autora para dentro de um
  template é o erro que este plano existe em parte para desfazer.
- **Os textos da autora entram verbatim.** Não corrija, não reescreva, não
  "melhore" pontuação, acentuação ou quebras. Copie do spec.
- **Sem framework de interface e sem dependência de runtime.** Nenhuma tarefa
  adiciona JavaScript ou mexe no `package.json`.
- **Toda cor vem de token em `:root`**, pedida por papel (`--destaque`,
  `--apoio`), nunca `--ouro`/`--violeta` direto.
- **Nenhuma mudança de cor, tamanho de fonte de texto existente ou opacidade da
  aurora.** As contas de [verificacao-visual.md](../../verificacao-visual.md)
  não são refeitas. A única regra nova que usa `--destaque` em texto é o
  subtítulo da home, e ela tem 1.2rem justamente para cair na faixa de "texto
  grande" do WCAG, como os títulos dos verbetes — ver Task 4.
- **`sobre.md` não muda.**
- **Todo link interno passa por `import.meta.env.BASE_URL`**, normalizado com
  `base.endsWith('/') ? base : base + '/'`.
- Comentário no CSS é obrigatório em decisão não óbvia — é o padrão do
  repositório. Os comentários deste plano vêm escritos; copie-os.

### Estado ao começar

Branch `reformula-home`, criado a partir de `main`, com o spec já commitado. A
árvore de trabalho está limpa. O trabalho anterior (coluna de 1280px e barra
fixa) já está em `main` e não deve ser desfeito por nenhuma tarefa aqui.

## Estrutura de arquivos

| Arquivo | Responsabilidade | Tarefas |
|---|---|---|
| `src/styles/global.css` | Tokens `--raio`/`--raio-pequeno`, raio nas peças globais, `.bloco--vazado` | 1, 2 |
| `src/components/Busca.astro` | Raio do campo e da lista | 1 |
| `src/components/Nav.astro` | Raio dos botões de ícone | 1 |
| `src/pages/gerador.astro` | Raio do seletor e do cadeado | 1 |
| `src/content/paginas/estilos.md` | Abertura e fechamento novos | 2 |
| `src/content/paginas/{arquetipos,cenarios,elementos}.md` | Perdem a seção "Como usar" | 3 |
| `src/content/paginas/{arquetipos,cenarios,elementos}-como-usar.md` | **Novos** — recebem a seção | 3 |
| `src/pages/{arquetipos,cenarios,elementos}/index.astro` | Montam abertura → subgêneros → como usar | 3 |
| `src/lib/schemas.ts` | Três campos opcionais em `esquemaPagina` | 4 |
| `src/content/paginas/home.md` | **Novo** — todo o texto da home | 4 |
| `src/pages/index.astro` | Nova ordem, card do gerador, raio dos pilares | 1, 4 |
| `src/lib/texto.ts` + `texto.test.ts` | Perdem `paragrafoComPrefixo` | 5 |
| `CLAUDE.md` | Deixa de documentar o mecanismo removido | 5 |

---

## Task 1: Cantos arredondados

Independente das demais. Vem primeiro porque é a mudança mais visível e a que a
autora quer ver logo.

**Arquivos:**
- Modificar: `src/styles/global.css`, `src/components/Busca.astro`,
  `src/components/Nav.astro`, `src/pages/gerador.astro`, `src/pages/index.astro`

**Interfaces:**
- Produz: os tokens `--raio: 8px` e `--raio-pequeno: 4px`. As Tasks 2 e 4 os
  consomem em regras novas.

- [ ] **Passo 1: Declarar os dois tokens**

Em `src/styles/global.css`, no bloco `:root`, logo **depois** da linha
`--recuo: max(20px, calc((100% - var(--largura-conteudo)) / 2));`:

```css

  /* O raio dos cantos. 8px tira o aspecto quadrado sem descaracterizar o pôster:
     a partir de uns 16px a página passa a ler como aplicativo, e a sombra
     deslocada dos botões começa a brigar com a curva. O raio pequeno é para as
     peças miúdas — a etiqueta tem 20px de altura, e 8px nela viraria cápsula. */
  --raio: 8px;
  --raio-pequeno: 4px;
```

- [ ] **Passo 2: Arredondar as peças globais**

Ainda em `src/styles/global.css`, acrescentar uma linha `border-radius` a cada
uma destas quatro regras, mantendo tudo o mais como está:

| Regra | Declaração a acrescentar |
|---|---|
| `.etiqueta` | `border-radius: var(--raio-pequeno);` |
| `.botao` | `border-radius: var(--raio);` |
| `.lista-subgeneros a` | `border-radius: var(--raio);` |
| `.bloco` | `border-radius: var(--raio);` |

- [ ] **Passo 3: Arredondar a busca**

Em `src/components/Busca.astro`, acrescentar `border-radius: var(--raio);` às
regras `.busca__campo` e `.busca__lista`.

- [ ] **Passo 4: Arredondar os botões de ícone da navegação**

Em `src/components/Nav.astro`, acrescentar `border-radius: var(--raio);` às
regras `.nav__abrir` e `.tema`. Atenção: `.tema` aparece duas vezes no arquivo —
a regra de verdade é a que define `width`, `height` e `background`, não a que
está dentro da media query só com `order: 2`, nem a que está sob
`prefers-reduced-motion`.

- [ ] **Passo 5: Arredondar o gerador**

Em `src/pages/gerador.astro`, acrescentar `border-radius: var(--raio);` às regras
`#opcoes select` e `.cadeado`.

- [ ] **Passo 6: Arredondar os pilares e o botão de mundos**

Em `src/pages/index.astro`, acrescentar `border-radius: var(--raio);` às regras
`.pilar` e `.abrir-mundos`.

- [ ] **Passo 7: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes em 9 arquivos, 0 erros/0 avisos/0 hints em 44 arquivos, 39
páginas.

- [ ] **Passo 8: Commitar**

```bash
git add src/
git commit -m "Arredonda os cantos de botões e cards"
```

---

## Task 2: Os dois textos de Estilos & Combinações

**Arquivos:**
- Modificar: `src/content/paginas/estilos.md`, `src/styles/global.css`

**Interfaces:**
- Consome: `--raio` da Task 1.

- [ ] **Passo 1: Criar a variante de card transparente**

Em `src/styles/global.css`, logo **depois** das regras
`.bloco > :first-child` / `.bloco > :last-child` (o fim do grupo do `.bloco`):

```css

/* O mesmo agrupamento do .bloco, com contorno em vez de preenchimento. Existe
   para o fechamento da página de Estilos, que vem logo abaixo de dois blocos
   cheios: repetir o preenchimento ali faria dele um terceiro bloco de conteúdo,
   quando o que ele é são as considerações finais. */
.bloco--vazado {
  background: none;
  border: 2px solid var(--borda-suave);
}
```

- [ ] **Passo 2: Acrescentar a abertura**

Em `src/content/paginas/estilos.md`, entre o comentário HTML que abre o arquivo e
o primeiro `<div class="bloco">`, com uma linha em branco de cada lado:

```markdown
Mais do que regras rígidas, a ficção científica é feita de possibilidades. Aqui você encontra breves conceitos sobre estilos variados e sugestões de combinações criativas entre subgêneros, servindo como uma fonte extra de ideias para expandir seus horizontes narrativos.
```

Uma linha só, sem quebras internas — é como o resto do arquivo escreve parágrafo.

- [ ] **Passo 3: Acrescentar o fechamento**

No fim de `src/content/paginas/estilos.md`, depois do `</div>` que fecha o
segundo bloco, com linha em branco entre eles:

```markdown
<div class="bloco bloco--vazado">

***Combine** estilos e subgêneros de acordo com o **tom, mensagem** e **universo desejados**. Reflita sobre como diferentes abordagens influenciam os papéis dos personagens, os conflitos e até as soluções encontradas nas histórias.*

*Misture elementos, experimente estilos e descubra novas possibilidades narrativas. A criatividade na ficção científica está justamente em cruzar fronteiras, de universos, ideias e estilos!*

</div>
```

As linhas em branco em volta das `<div>` são obrigatórias — o comentário no topo
do arquivo explica por quê: sem elas o Markdown de dentro sai como marcação crua.
Os asteriscos são ênfase de Markdown e devem sair como negrito e itálico, não
como asteriscos visíveis.

- [ ] **Passo 4: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes, 0 erros, 39 páginas.

- [ ] **Passo 5: Conferir a página**

Com `npm run dev`, abrir `http://localhost:4321/estilos`:

1. O parágrafo de abertura aparece antes do bloco "Estilos", fora dele.
2. No fim da página há um card de contorno, sem preenchimento, visivelmente
   diferente dos dois blocos cheios acima.
3. Dentro dele, "Combine" está em negrito **e** itálico, "tom, mensagem" e
   "universo desejados" em negrito, e o resto em itálico. Nenhum asterisco
   visível.
4. Os dois temas: no claro o contorno precisa continuar visível.

- [ ] **Passo 6: Commitar**

```bash
git add src/content/paginas/estilos.md src/styles/global.css
git commit -m "Acrescenta abertura e fechamento à página de Estilos"
```

---

## Task 3: "Como usar" abaixo dos subgêneros

**Arquivos:**
- Criar: `src/content/paginas/arquetipos-como-usar.md`,
  `src/content/paginas/cenarios-como-usar.md`,
  `src/content/paginas/elementos-como-usar.md`
- Modificar: `src/content/paginas/{arquetipos,cenarios,elementos}.md`,
  `src/pages/{arquetipos,cenarios,elementos}/index.astro`

A página de Livros não tem seção "Como usar" e **não** é tocada.

- [ ] **Passo 1: Criar os três arquivos novos**

O conteúdo é **movido, não reescrito**: recorte a seção `## COMO USAR ESTA
PÁGINA?` e todos os itens dela do arquivo de origem e cole no novo, intactos —
mesmo cabeçalho, mesmos itens, mesma pontuação.

`src/content/paginas/arquetipos-como-usar.md`:

```markdown
---
titulo: "Como usar esta página"
ordem: 20
---

## COMO USAR ESTA PÁGINA?

- Escolha um subgênero (Distopia, Invasão Alienígena, Cyberpunk...)
- Analise os arquétipos, seus conflitos, potenciais e riscos
- Roube o esqueleto psicológico e vista-o com sua cultura, estética e reviravoltas
- Teste combinações (ex: "O Capitão estratégico" com vício em tranquilizantes)
- Quebre as regras: Transforme "O Líder Tirano" num adolescente inseguro ou numa IA benevolente
- Lembre-se: Arquétipos são sementes. O ecossistema narrativo é você quem cria
```

`src/content/paginas/cenarios-como-usar.md`:

```markdown
---
titulo: "Como usar esta página"
ordem: 21
---

## COMO USAR ESTA PÁGINA?

- Escolha o bioma (Cyberpunk, Pós-Apocalíptico, Space Opera...)
- Mapeie o terreno, suas leis físicas, hierarquias sociais e perigos ambientais
- Roube a infraestrutura e decore com sua arquitetura, clima e tecnologia local
- Teste fusões (ex: "Infraestruturas Decadentes" situadas dentro de uma nave estelar de luxo)
- Quebre as regras: Converta "Buracos de Minhoca" em anomalias instáveis que exigem pilotos suicidas ou esconda "Bases da Resistência" em zonas de alta radiação onde o inimigo não ousa pisar
- Lembre-se: O cenário não é apenas pano de fundo. É o antagonista silencioso da sua história.
```

`src/content/paginas/elementos-como-usar.md`:

```markdown
---
titulo: "Como usar esta página"
ordem: 22
---

## COMO USAR ESTA PÁGINA?

- Escolha um subgênero (Viagem no Tempo, Invasão Alienígena, Pós Apocalíptico...)
- Examine o componente, sua função técnica, custo moral e impacto no enredo
- Roube o mecanismo e altere a fonte de energia, as limitações e as consequências
- Teste variações (ex: "Vulnerabilidades Inesperadas" onde a falha biológica não mata os invasores, mas os deixa viciados na atmosfera da Terra)
- Quebre regras: Faça das "Máquinas do Tempo" estruturas orgânicas vivas ou transforme um "Vírus Mortal" em uma cura incompreendida
- Lembre-se: Clichês são ferramentas. A engenharia da inovação está em como você as opera.
```

O campo `ordem` não é usado por estas entradas — elas não aparecem em índice
nenhum —, mas o esquema tem valor padrão e números altos deixam claro que são
peças auxiliares.

- [ ] **Passo 2: Tirar a seção dos três arquivos de origem**

Em `src/content/paginas/arquetipos.md`, `cenarios.md` e `elementos.md`, apagar da
linha `## COMO USAR ESTA PÁGINA?` até o fim do arquivo. Cada um fica só com o
frontmatter e o parágrafo de abertura, sem linha em branco sobrando no fim.

- [ ] **Passo 3: Montar a nova ordem nas três páginas**

Em `src/pages/arquetipos/index.astro`, acrescentar ao frontmatter, depois do
`const { Content } = await render(pagina);`:

```astro
const comoUsar = await getEntry('paginas', 'arquetipos-como-usar');
if (!comoUsar) throw new Error("página 'arquetipos-como-usar' não encontrada em src/content/paginas");
const { Content: ComoUsar } = await render(comoUsar);
```

E no template, acrescentar `<ComoUsar />` depois do `</ul>`, deixando assim:

```astro
<Base titulo={pagina.data.titulo}>
  <h1>{pagina.data.titulo}</h1>
  <Content />
  <ul class="lista-subgeneros">
    {subgeneros.map((s) => (
      <li>
        <a href={`${raiz}arquetipos/${s.id}/`}>{s.data.nome}</a>
      </li>
    ))}
  </ul>
  <ComoUsar />
</Base>
```

Repetir em `src/pages/cenarios/index.astro` e `src/pages/elementos/index.astro`,
trocando `arquetipos` por `cenarios` e `elementos` nos três lugares de cada
arquivo: o `getEntry`, a mensagem de erro e o `href`. **Não** mexer no `href` da
lista de subgêneros de cada página — cada uma aponta para a sua própria rota.

O `Content: ComoUsar` é renomeado na desestruturação porque componente de Astro
precisa começar com maiúscula, e porque `Content` já está em uso no mesmo escopo.

- [ ] **Passo 4: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes, 0 erros, 39 páginas. Se o build reclamar de entrada não
encontrada, o `id` do arquivo novo não bate com o nome passado ao `getEntry` — o
`id` é o nome do arquivo sem `.md`.

- [ ] **Passo 5: Conferir as três páginas**

Com `npm run dev`, abrir `/arquetipos`, `/cenarios` e `/elementos`. Em cada uma:
abertura no topo, os seis retângulos de subgênero no meio, "COMO USAR ESTA
PÁGINA?" embaixo de tudo, com todos os itens presentes e na ordem original.

- [ ] **Passo 6: Commitar**

```bash
git add src/content/paginas/ src/pages/
git commit -m "Desce o como usar para depois dos subgêneros nos índices"
```

---

## Task 4: A home

A maior das tarefas. Depende da Task 1 para o `--raio`.

**Arquivos:**
- Criar: `src/content/paginas/home.md`
- Modificar: `src/lib/schemas.ts`, `src/pages/index.astro`

**Interfaces:**
- Consome: `--raio` (Task 1).
- Produz: a entrada de conteúdo `home` e os campos `subtitulo`,
  `chamadaGerador` e `citacao` em `esquemaPagina`. A Task 5 depende de esta
  tarefa ter tirado o último uso de `paragrafoComPrefixo`.

- [ ] **Passo 1: Abrir o esquema para os três campos**

Em `src/lib/schemas.ts`, substituir `esquemaPagina` por:

```typescript
/* Os três campos opcionais servem só à home hoje: são frases soltas que a página
   encaixa em lugares diferentes da estrutura — subtítulo abaixo do título,
   chamada dentro do card do gerador, citação no fim — e por isso não cabem no
   corpo corrido do Markdown. Mesma solução que esquemaSubgenero usa para citacao
   e aberturaArquetipos. */
export const esquemaPagina = z.object({
  titulo: z.string().min(1),
  ordem: z.number().int().nonnegative().default(0),
  subtitulo: z.string().optional(),
  chamadaGerador: z.string().optional(),
  citacao: z.string().optional(),
});
```

- [ ] **Passo 2: Criar o conteúdo da home**

`src/content/paginas/home.md`. Os textos são da autora e entram exatamente como
estão aqui — sem reescrever, sem corrigir pontuação, sem trocar os emojis:

```markdown
---
titulo: "Projeto Polaris: Arquétipos da Ficção Científica"
subtitulo: "Recursos narrativos. Sua imaginação dita as regras."
chamadaGerador: "Dê vida a novas tramas. O sistema alinha um arquétipo, um cenário e um elemento narrativo do universo da sua escolha, criando a centelha inicial para a sua história."
citacao: "A ficção científica oferece uma chance de escapar, mas também de refletir sobre o mundo em que vivemos."
ordem: 1
---

Funcionando como um catálogo, o Projeto Polaris reúne arquétipos de personagens, cenários e elementos narrativos cuidadosamente organizados por subgêneros, desde Space Operas grandiosas até Distopias e Cyberpunk. Cada arquétipo é uma base pronta para ser adaptada, misturada ou reinventada, servindo como ponto de partida para construir universos complexos e personagens memoráveis.

**Como usar:**

- 🧭 Explore os arquétipos para entender seus traços e funções narrativas.
- 🗺️ Consulte os cenários para visualizar ambientes ricos em detalhes.
- 🧩 Combine elementos narrativos para desenvolver conflitos, tecnologias e interações sociais.
- 💡 Use as sugestões e exemplos como inspiração, mas sinta-se livre para adaptar tudo ao seu estilo criativo.
```

`chamadaGerador` é o texto que já existia na home, movido para cá sem alteração.

- [ ] **Passo 3: Reescrever o frontmatter de `index.astro`**

Substituir todo o bloco entre os `---` de `src/pages/index.astro` por:

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import Base from '../layouts/Base.astro';

const pagina = await getEntry('paginas', 'home');
if (!pagina) throw new Error("página 'home' não encontrada em src/content/paginas");
const { Content } = await render(pagina);

const mundos = (await getCollection('subgeneros', (s) => s.data.mundo)).sort(
  (a, b) => a.data.ordem - b.data.ordem,
);

const base = import.meta.env.BASE_URL;
const raiz = base.endsWith('/') ? base : `${base}/`;

// As descrições são resumos das aberturas de src/content/paginas/{arquetipos,
// cenarios,elementos}.md — curtas o bastante para caber num cartão, e escritas
// para dizer o que cada pilar é a quem chega pela primeira vez.
const pilares = [
  {
    titulo: 'Arquétipos',
    descricao: 'Personagens de partida: papéis, conflitos e riscos para roubar e vestir com o seu estilo.',
    href: `${raiz}arquetipos`,
  },
  {
    titulo: 'Cenários',
    descricao: 'Mais que pano de fundo: espaços que moldam a trama, os personagens e os dilemas.',
    href: `${raiz}cenarios`,
  },
  {
    titulo: 'Elementos Narrativos',
    descricao: 'Temas, conflitos, tecnologias e estruturas sociais que definem o tom de cada subgênero.',
    href: `${raiz}elementos`,
  },
];
---
```

Some tudo que dizia respeito a `sobre.md`: o `paragrafoComPrefixo`, o
`apresentacao`, o `chamadaGerador` escrito no código e os dois `throw` ligados a
eles.

- [ ] **Passo 4: Reescrever o template**

Substituir o `<Base>...</Base>` de `src/pages/index.astro` por:

```astro
<Base titulo="Início">
  <h1>{pagina.data.titulo}</h1>
  {pagina.data.subtitulo && <p class="subtitulo">{pagina.data.subtitulo}</p>}
  <div class="conteudo">
    <Content />
  </div>

  <div class="pilares">
    {pilares.map((p) => (
      <a class="pilar" href={p.href}>
        <h3>{p.titulo}</h3>
        <p>{p.descricao}</p>
      </a>
    ))}
  </div>

  <section aria-labelledby="mundos-titulo">
    <h2 id="mundos-titulo">Os mundos</h2>
    {/* Mesmo mecanismo do menu da navegação: nasce escondido, só aparece por
        JavaScript, e sem script a lista dos seis fica visível como antes. */}
    <button
      type="button"
      class="abrir-mundos"
      id="abrir-mundos"
      hidden
      aria-expanded="false"
      aria-controls="lista-mundos"
    >
      Escolher um mundo
    </button>
    <ul class="lista-subgeneros" id="lista-mundos">
      {mundos.map((m) => (
        <li>
          <a href={`${raiz}mundos/${m.id}/`}>{m.data.nome}</a>
        </li>
      ))}
    </ul>
  </section>

  <section class="cta-gerador" aria-labelledby="gerador-titulo">
    <h2 id="gerador-titulo">Gerador de Combinações</h2>
    <p>{pagina.data.chamadaGerador}</p>
    <a class="botao botao--principal" href={`${raiz}gerador`}>Ir para o Gerador</a>
  </section>

  {pagina.data.citacao && <blockquote>{pagina.data.citacao}</blockquote>}
</Base>
```

Três mudanças a notar: o título "Comece por aqui" e a `<section>` que o envolvia
saíram (os cards ficam soltos, como a autora pediu); a home manda `"Início"` para
o `Base`, e não mais o título da página, senão a aba diria "Projeto Polaris:
Arquétipos da Ficção Científica · Projeto Polaris"; e a citação não tem `<cite>`
porque não tem autoria.

- [ ] **Passo 5: Ajustar o CSS da página**

No `<style>` de `src/pages/index.astro`, acrescentar no começo:

```css
  /* 1.2rem e não menos, pela mesma razão dos títulos de verbete: sobre o céu o
     --destaque fica em 4,27:1 no pior mundo, abaixo dos 4,5 que texto pequeno
     exige, mas a partir de 18,66px em negrito o WCAG trata como texto grande e
     o mínimo cai para 3:1. 1.2rem dá 19,2px. Encolher aqui reprova o contraste. */
  .subtitulo {
    margin-block: 0 24px;
    color: var(--destaque);
    font-weight: 800;
    font-size: 1.2rem;
  }

  /* O corpo vem de render() do Markdown e não recebe o atributo de escopo do
     Astro, então o alcance tem que vir do contêiner. */
  .conteudo :global(p) {
    line-height: 1.55;
  }

  /* O emoji de cada item já é o marcador; o disco do navegador em cima dele
     ficaria marcador duplicado. */
  .conteudo :global(ul) {
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
```

E substituir a regra `.cta-gerador` inteira por:

```css
  /* Era uma seção com barra lateral. Virou card, com o mesmo par de contorno e
     painel dos três pilares acima, para a home ler como uma sequência de cards.

     Não recebe o preenchimento que o .pilar ganha no tema claro: o botão
     principal dentro dele também é --destaque, e um sobre o outro sumiria. */
  .cta-gerador {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    background: var(--painel);
    border: 2px solid var(--destaque);
    border-radius: var(--raio);
    padding: 16px;
  }

  .cta-gerador h2 {
    margin: 0;
  }

  .cta-gerador p {
    margin: 0;
  }
```

Manter tudo o mais do `<style>` como está — `.pilares`, `.pilar` (com o
`border-radius` que a Task 1 acrescentou), as regras de tema claro do pilar,
`.abrir-mundos` e a media query de 1079px.

- [ ] **Passo 6: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes, 0 erros, 39 páginas. Este é o passo que valida os três
campos novos do frontmatter contra o Zod: se um nome de campo estiver errado no
`home.md`, o build falha aqui.

- [ ] **Passo 7: Conferir a home**

Com `npm run dev`, em `http://localhost:4321/`, na ordem de cima para baixo:

1. Título "Projeto Polaris: Arquétipos da Ficção Científica".
2. Subtítulo "Recursos narrativos. Sua imaginação dita as regras." em destaque.
3. O parágrafo de apresentação.
4. "Como usar:" em negrito e os quatro itens, **com os emojis aparecendo** e sem
   bolinha de lista antes deles.
5. Os três cards, sem nenhum título acima deles.
6. "Os mundos" com os seis retângulos.
7. O card do Gerador, com contorno e preenchimento como os três de cima, e o
   botão dentro.
8. A citação em itálico com a barra à esquerda, sem nome de autor.

E ainda: a aba do navegador dizendo "Início · Projeto Polaris"; a página nos dois
temas, conferindo que no claro o botão dentro do card do gerador continua
visível; e em 1079px de largura, que a lista de mundos ainda recolhe no botão
"Escolher um mundo".

- [ ] **Passo 8: Commitar**

```bash
git add src/content/paginas/home.md src/lib/schemas.ts src/pages/index.astro
git commit -m "Reformula a home com o texto novo da autora"
```

---

## Task 5: Tirar o que ficou sem uso

Só depois da Task 4 — é ela que remove o último consumidor.

**Arquivos:**
- Modificar: `src/lib/texto.ts`, `src/lib/texto.test.ts`, `CLAUDE.md`

**Interfaces:**
- Consome: a Task 4 ter deixado `paragrafoComPrefixo` sem nenhum uso.

- [ ] **Passo 1: Confirmar que não sobrou consumidor**

```bash
grep -rn "paragrafoComPrefixo" src/ docs/ CLAUDE.md
```

Esperado: ocorrências apenas em `src/lib/texto.ts`, `src/lib/texto.test.ts` e
`CLAUDE.md`. **Se aparecer em qualquer arquivo `.astro`, pare e reporte** — a
Task 4 não terminou o serviço e remover a função quebraria a página.

- [ ] **Passo 2: Remover a função**

Em `src/lib/texto.ts`, apagar a função `paragrafoComPrefixo` e o comentário de
três linhas acima dela. O arquivo fica só com `semAcento` e `paraAncora`, que
continuam em uso pela busca e pelas âncoras.

- [ ] **Passo 3: Remover os testes**

Em `src/lib/texto.test.ts`, apagar o `describe('paragrafoComPrefixo', ...)`
inteiro, com os três `it` dentro dele. Fica o `describe('paraAncora', ...)` com
os dois casos. Se o `import` do topo tiver referência à função removida, tirar
também.

- [ ] **Passo 4: Rodar a suíte e confirmar a nova contagem**

```bash
npx vitest run
```

Esperado: **72 testes em 9 arquivos** — três a menos que antes, e nenhum
arquivo a menos.

- [ ] **Passo 5: Atualizar o CLAUDE.md**

Na seção "Conteúdo", o parágrafo que começa com **Prosa não mora em componente.**
descreve um mecanismo que deixou de existir. Substituir o parágrafo inteiro por:

```markdown
**Prosa não mora em componente.** Os textos da home, das páginas de índice, de
Sobre e de Estilos vêm da coleção `paginas` (`src/content/paginas/*.md`),
buscados com `getEntry` — e a página estoura o build com mensagem explícita se a
entrada sumir, em vez de renderizar vazio. `home.md` é o caso mais completo: o
corpo traz a apresentação e a lista "Como usar", e três campos de frontmatter
(`subtitulo`, `chamadaGerador`, `citacao`) trazem as frases que a página encaixa
fora do texto corrido. Nada de copiar prosa autoral para dentro de um `.astro`.
```

E, logo depois desse parágrafo, acrescentar este outro, que registra a forma nova
dos índices:

```markdown
As páginas de índice de arquétipos, cenários e elementos têm duas entradas cada:
`<pagina>.md` traz a abertura, que fica acima da lista de subgêneros, e
`<pagina>-como-usar.md` traz o bloco "Como usar esta página", que a página
renderiza **depois** da lista. São dois arquivos porque `render()` devolve o
Markdown inteiro de uma vez, e não há como intercalar a lista no meio dele.
Livros não tem esse segundo arquivo.
```

- [ ] **Passo 6: Rodar o portão completo**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 72 testes, 0 erros, 39 páginas.

- [ ] **Passo 7: Commitar**

```bash
git add src/lib/ CLAUDE.md
git commit -m "Remove o resgate de parágrafos do sobre.md, agora sem uso"
```

---

## Depois do plano

**Conferir a home em tela grande e no celular.** A coluna de 1280px e a barra
fixa acabaram de entrar em `main`; a home é a página que mais mudou de estrutura
desde então, e vale um olhar em 2560px e em 375px antes de publicar.

**A lista da busca no tema claro** continua com fundo de 5% sobre conteúdo —
problema anterior a este plano e ao anterior, e o próximo candidato natural.
