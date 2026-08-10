# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm install
npm run dev        # servidor local em http://localhost:4321
npm run build      # gera dist/ — também é o que valida os esquemas do conteúdo
npm run preview    # serve o build
npm run check      # astro check (TypeScript + templates .astro)

npx vitest run                                   # suíte inteira
npx vitest run src/lib/gerador/redacao.test.ts   # um arquivo
npx vitest run -t 'funde em + uma em numa'       # um teste pelo nome
npx vitest                                       # modo watch
```

Testes Python da migração (rodar de dentro de `scripts/`, os testes importam `migracao.*`):

```bash
cd scripts && python -m pytest
```

Depois de adicionar ou editar Markdown em `src/content/`, `npm run build` é o
que confirma que o frontmatter passa na validação Zod — não existe comando de
lint separado para conteúdo.

**Mudou o esquema de uma coleção com `npm run dev` já rodando?** Os campos
novos saem vazios na página, mesmo com o Markdown certo e o build passando —
`.astro/data-store.json` guarda as entradas já interpretadas pelo esquema
antigo, e o Zod descarta chave desconhecida em silêncio em vez de avisar.
Apague `.astro/` e reinicie o servidor.

## Restrições do projeto

Vêm do plano de implementação ([docs/superpowers/plans/2026-07-27-polaris.md](docs/superpowers/plans/2026-07-27-polaris.md)) e valem para código novo. As mudanças posteriores têm cada uma seu par de spec e plano em [docs/superpowers/](docs/superpowers/) — é lá que está o porquê de decisão que o código só mostra pronta (topo fixo, prompt do gerador, home reformulada):

- **Sem framework de interface.** Nada de React/Vue/Svelte. Interatividade em
  TypeScript puro dentro de `<script>` das páginas Astro.
- **Sem dependências de runtime no cliente.** O navegador não carrega
  biblioteca nenhuma; o único `fetch` em tempo de execução é o da busca, que
  pega `indice-busca.json` gerado no build.
- **Node ≥ 22.12** (exigência do Astro 7). TypeScript estrito.
- **Dois temas.** O escuro é o padrão e o único que existe sem JavaScript;
  o claro entra por `data-tema="claro"` na raiz, escrito por um script embutido
  no `<head>` de [Base.astro](src/layouts/Base.astro) antes da primeira pintura.
  Toda cor vem de token em `:root` — nunca escrever cor literal em componente,
  senão ela só funciona num dos dois temas.
- **Cor de acento sempre por papel, nunca por nome de cor.** `--destaque` é o
  que chama o olho (título da página, botão principal, etiqueta, pilares,
  cadeado travado) e `--apoio` é a interface em volta
  (links, botões secundários, foco, barra lateral dos verbetes, retângulos de
  mundo). `--ouro` e `--violeta` existem só como origem dos dois no tema escuro —
  componente nenhum deve consumi-los direto, porque no claro a paleta é outra
  (laranja-tijolo `#b34700` e azul-tinta `#1b2a4a`, sem relação com dourado e
  violeta).
- **Acento com parcimônia, por escolha da autora.** Uma cor quente que salta aos
  olhos e mais nada: o tema claro já teve um ciano no `--destaque` e foi recusado
  justamente por somar um segundo tom frio ao azul-tinta. Título de **verbete**
  não é acento — herda `--texto-forte` (branco no escuro, quase preto no claro),
  e quem separa um do outro é a barra lateral em `--apoio`. Já foi dourado e já
  foi violeta; os dois foram recusados. Não repintar.
- A "aurora" muda de cor por subgênero e **não existe no tema claro**, onde o
  fundo é liso.
- **Mexeu em cor, tamanho de fonte ou opacidade da aurora?** Refaça as contas de
  [docs/verificacao-visual.md](docs/verificacao-visual.md) e atualize o
  documento. Vários valores estão no limite: o `--destaque` do tema claro não
  pode clarear (`#b34700` dá 5,12:1 e é preenchimento com letra na cor do fundo,
  que exige 4,5), e a aurora só pode ir até 0,37 (hoje está em 0,36, em
  [Aurora.astro](src/components/Aurora.astro)). O `h1` em `--destaque` passa por
  ser texto grande — 4,27:1 no pior mundo contra os 3:1 exigidos —, então
  encolhê-lo abaixo de 18,66px reprova.
- **`prefers-reduced-motion` respeitado** por qualquer animação.
- **Tudo em português do Brasil**: identificadores, nomes de arquivo, interface,
  comentários e mensagens de commit (imperativo — "Adiciona busca global").
- Testes ao lado do código (`src/**/*.test.ts`); nenhum teste acessa a rede.

## Arquitetura

Site estático em Astro. O acervo editorial é uma grade de duas dimensões —
**tipo de recurso × subgênero** — e o site abre as duas entradas:

- por tipo: `/arquetipos/`, `/cenarios/`, `/elementos/`, `/livros/`, cada um com
  uma rota `[subgenero]` abaixo;
- por mundo: `/mundos/[subgenero]/`, que junta os quatro tipos de um subgênero
  numa página só.

### Conteúdo

`src/content/<colecao>/<subgenero>/<slug>.md`, declarado em
[src/content.config.ts](src/content.config.ts) via `glob` loader, com esquemas
Zod isolados em [src/lib/schemas.ts](src/lib/schemas.ts) para poderem ser
testados fora do Astro. Regras do esquema que não são óbvias:

- `arquetipos.nome` vai **sem** artigo ("Megacorporação", "IA Aliada") e o
  artigo definido mora em `arquetipos.artigo` (`a` ou `o`). O gerador tira dali
  as duas coisas: o artigo que abre a frase ("a Megacorporação descobre que…") e
  o gênero do `{pronome}`. O campo é obrigatório e **não tem padrão** de
  propósito — um padrão faria todo arquétipo novo nascer masculino em silêncio.
  Por isso também o nome do arquétipo nunca passa por `emMinuscula` em
  [redacao.ts](src/lib/gerador/redacao.ts): não há artigo grudado para abaixar, e
  a função estragaria as siglas ("IA Aliada" → "iA Aliada"). Os elementos
  continuam precisando dela, porque os títulos deles abrem com artigo.
- `cenarios.singular` precisa começar com "um " ou "uma " — é a forma que entra
  nos moldes de frase, contraída com preposição.
- `subgeneros.mundo: false` marca um pool que não é um mundo (hoje só
  `comuns.md`, os 10 arquétipos comuns): não gera página em `/mundos/` e só
  entra no gerador quando "incluir comuns" está ligado.
- `subgenero` com `mundo: true` exige `aurora` (trio de cores hex).
- `arquetipos.felino: true` marca o arquétipo bônus, renderizado à parte com
  etiqueta própria. Ele aparece na página de catálogo à parte, fica de fora da
  amostra de `/mundos/` e **entra** no sorteio do gerador — decisão da autora.
- `subgeneros.abertura{Arquetipos,Cenarios,Elementos}` são os parágrafos que
  abrem as três páginas de catálogo daquele mundo, um por tipo, porque cada um
  fala do que está listado abaixo dele. Todos opcionais (`comuns` só tem
  arquétipos), e por isso `esquemaSubgenero` é `.strict()`: os nomes são
  parecidos o suficiente para um `aberturaCenários` com acento ser descartado em
  silêncio pelo Zod, e a página abrir sem parágrafo sem ninguém reclamar.
  Livros não tem abertura.
- `subgeneros.citacao` e `citacaoAutor` são a epígrafe do mundo, repetida no
  `<blockquote>` das cinco páginas daquele subgênero (os quatro catálogos e
  `/mundos/`). Vem do frontmatter, não do corpo, justamente por aparecer em
  cinco lugares. A `citacao` de `paginas/home.md` é outra coisa e não tem autor.

O campo `ordem` define a posição nos índices — a ordenação é sempre explícita,
nunca alfabética por acidente.

**O corpo de arquétipo, cenário e elemento entra na página como texto puro**
(`{entrada.body}` dentro de um `<p>`), sem passar por `render()` — Markdown no
corpo apareceria literal, com asterisco e tudo. São um parágrafo só, por isso a
economia. Só `livros` chama `render()`, porque cada livro tem vários parágrafos
(edição, comentário, sinopse). Verbete que precisar de dois parágrafos ou de
ênfase muda a página junto, não só o Markdown.

**Antes de acrescentar ou trocar verbete, ler
[docs/revisao-de-repeticoes.md](docs/revisao-de-repeticoes.md).** É o critério
que decide em qual das três coleções um verbete entra — arquétipo é **quem**,
cenário é **onde**, elemento é **o quê / que força** — e a revisão inteira
nasceu de "cenários" que eram condição, não lugar. O documento também nomeia as
sobreposições que são de propósito e não devem ser "corrigidas" (Refugiado da
Invasão × Campos de refugiados, Humano Aumentado × Implantes cibernéticos):
elas são o que a grade de duas dimensões existe para fazer.

O tamanho do acervo (hoje 76 arquétipos — 10 por mundo mais o felino, e mais 10
comuns —, 60 cenários, 60 elementos, 36 livros) está escrito por extenso em
seis lugares que nenhum teste confere: [README.md](README.md),
[sobre.md](src/content/paginas/sobre.md), o rótulo de "incluir comuns" e o
comentário dos pools em [gerador.astro](src/pages/gerador.astro), o `nome` de
[comuns.md](src/content/subgeneros/comuns.md) e os dois comentários de
[mundos/[subgenero].astro](src/pages/mundos/[subgenero].astro) (o pool comuns e
a posição do felino). Entrada nova em `src/content/` desatualiza os seis em
silêncio — os de `mundos/` já tinham ficado para trás uma vez.

**Prosa não mora em componente.** Os textos da home, das páginas de índice, de
Sobre, de Estilos e do 404 vêm da coleção `paginas` (`src/content/paginas/*.md`),
buscados com `getEntry` — e a página estoura o build com mensagem explícita se a
entrada sumir, em vez de renderizar vazio. `home.md` é o caso mais completo: o
corpo traz a apresentação e a lista "Como usar", e três campos de frontmatter
(`subtitulo`, `chamadaGerador`, `citacao`) trazem as frases que a página encaixa
fora do texto corrido. Nada de copiar prosa autoral para dentro de um `.astro`.

As páginas de índice de arquétipos, cenários e elementos têm duas entradas cada:
`<pagina>.md` traz a abertura, que fica acima da lista de subgêneros, e
`<pagina>-como-usar.md` traz o bloco "Como usar esta página", que a página
renderiza **depois** da lista. São dois arquivos porque `render()` devolve o
Markdown inteiro de uma vez, e não há como intercalar a lista no meio dele.
Livros não tem esse segundo arquivo.

`/mundos/[subgenero]/` é porta de entrada, não catálogo: mostra três itens de
cada tipo e manda para a página completa (e deixa o arquétipo felino de fora da
amostra). Listar tudo ali esvazia o "Ver todos".

As cinco rotas `[subgenero]` têm o mesmo `getStaticPaths` — `getCollection('subgeneros')`,
um caminho por entrada —, com **uma assimetria de propósito**: só
[arquetipos/[subgenero].astro](src/pages/arquetipos/[subgenero].astro) não
filtra por `s.data.mundo`, porque `/arquetipos/comuns/` precisa existir. As
outras quatro filtram, senão gerariam `/cenarios/comuns/` e afins vazias.
"Uniformizar" as cinco apaga a página dos 10 comuns.

### Gerador de premissas

[src/lib/gerador/](src/lib/gerador/) é um conjunto de funções puras, exportadas
por `index.ts` (ponto único de entrada; nada fora da pasta importa os arquivos
internos). Fluxo: `sortear()` escolhe arquétipo + cenário + elemento +
complicação respeitando travas e filtros, e `redigir()` encaixa o sorteio num
dos `MOLDES`.

`sortear` recebe o sorteio anterior e nunca repete a complicação nem a família
dela em duas rodadas seguidas — as travas (`Travas`) só congelam as três peças
do acervo, e a complicação sempre muda.

**As complicações são a exceção à regra de prosa em Markdown**: o banco vive em
[complicacoes.ts](src/lib/gerador/complicacoes.ts) porque é peça de molde, não
texto de página — mas é conteúdo editorial (CC BY, como o resto do acervo), não
código. Cada complicação começa em minúscula e não termina em ponto, senão não
encaixa depois de "descobre que". [dados.test.ts](src/lib/gerador/dados.test.ts)
tranca as contagens (7 famílias, 40 complicações, 10 moldes): incluir uma
complicação nova é editar esses números junto.

Nos `MOLDES` os marcadores carregam a regência — `{em:cenario}`, `{a:cenario}`,
`{de:elemento}`, `{impera:elemento}`, `{ser:elemento}`, `{pronome}` —, e o teste
exige que todo molde use as quatro peças e termine em ponto final. Molde novo
sem uma das peças quebra a suíte, não o build.

`sortear` recebe `aleatorio: () => number` como parâmetro justamente para os
testes serem determinísticos — não chame `Math.random()` dentro da lib. Quem
injeta o acaso de verdade é o `<script>` de `gerador.astro`, que também sorteia
o molde.

[src/pages/gerador.astro](src/pages/gerador.astro) injeta os pools inteiros como
JSON estático no HTML em tempo de build e liga tudo com um `<script>` sem
framework. Zero requisição em runtime.

A mesma página também monta, a partir do mesmo sorteio, um prompt pronto para
colar numa IA de texto. O molde é conteúdo da autora — não código — em
[prompt-ia.md](src/content/paginas/prompt-ia.md), com quatro marcadores em
maiúsculas (`[MUNDO]`, `[ARQUÉTIPO]`, `[CENÁRIO]`, `[ELEMENTO NARRATIVO]`) que
`montarPrompt()` ([prompt.ts](src/lib/gerador/prompt.ts)) substitui pelos
valores sorteados. Um marcador desconhecido faz `montarPrompt` lançar — e o
frontmatter de `gerador.astro` chama a função uma vez com valores de descarte
só para isso acontecer em `npm run build`, e não em produção no navegador de
alguém.

**Concordância gramatical** é a parte delicada:
[redacao.ts](src/lib/gerador/redacao.ts) resolve contração de preposição
(`em`+`uma` → `numa`), gênero pelo artigo e número do elemento por heurística de
superfície (`numeroDe`). Essa heurística tem exceções nomeadas e comentários
longos explicando por que cada alternativa mais simples foi descartada —
**leia os comentários antes de mexer**, e prefira ampliar uma lista nomeada a
inventar uma regra nova. Cada ajuste ali merece um caso em
[redacao.test.ts](src/lib/gerador/redacao.test.ts) com o título real do acervo
que motivou a mudança.

### Interatividade sem framework

Cada `<script>` de página ou componente importa funções puras de `src/lib/` e só
faz a ligação com o DOM; a lógica testável fica na lib. O padrão de melhoria
progressiva está em [expansivel.ts](src/lib/expansivel.ts), usado pelo menu do
Nav e pela lista de mundos da home: o botão nasce com `[hidden]` no HTML e só
aparece pelo JavaScript, então sem script a lista fica visível em vez de virar
um menu que não abre. E o estado de aberto/fechado mora num lugar só, o
`aria-expanded` do botão, com o CSS reagindo por seletor de irmão — nada de
estado paralelo que possa divergir do que o leitor de tela anuncia.

### Estilo nas páginas

Os tokens de cor moram todos em [global.css](src/styles/global.css), importado
uma vez por [Base.astro](src/layouts/Base.astro); o resto é `<style>` escopado na
própria página. A única coisa que o site guarda no navegador é a chave
`polaris-tema` do `localStorage`, lida pelo script embutido no `<head>`.

Além dos tokens, `global.css` guarda o punhado de classes que mais de uma página
usa — `.bloco`, `.etiqueta`, `.botao` (com `.botao--principal`),
`.lista-subgeneros`, `.abertura`, `.autor`. Antes de escrever regra nova num
`<style>` escopado, conferir se uma delas já faz o trabalho: `.lista-subgeneros`
só foi parar ali depois de ter sido copiada em quatro páginas. Classe que vale
para uma página só continua escopada.

A coluna de conteúdo é `--largura-conteudo` (1280px) e o recuo que a centraliza
é `--recuo`, consumido pelo `padding-inline` das três faixas — barra do topo,
`main` e rodapé. O `100%` dentro do token se resolve no ponto de uso, então ele
só vale para filho direto do `<body>`; dentro de um contêiner mais estreito o
recuo sai errado sem avisar.

O HTML que sai de `render()` de uma entrada Markdown **não** recebe o atributo de
escopo do Astro — estilizá-lo pede um contêiner escopado e `:global()` dentro
dele (`.conteudo :global(h2)`), como em
[estilos.astro](src/pages/estilos.astro). Sem isso a regra é descartada em
silêncio, o que parece um seletor errado e não é.

A aurora recebe o trio de cores do subgênero por prop de `Base` e o converte em
`conic-gradient` por `gradienteConico()` ([aurora.ts](src/lib/aurora.ts)), que
cai no `AURORA_PADRAO` quando a página não é de mundo.

**A barra do topo é `position: sticky`** ([Nav.astro](src/components/Nav.astro)),
e isso cria duas amarras que o CSS não consegue impor sozinho:

- Todo alvo de âncora precisa de `scroll-margin-top: 96px`, senão o título para
  debaixo da barra. O valor está escrito duas vezes — em
  [Cartao.astro](src/components/Cartao.astro) e nas `section[id]` de
  [mundos/[subgenero].astro](src/pages/mundos/[subgenero].astro) — e os dois
  mudam juntos. Quem chega às âncoras é a busca, então errar aqui quebra a
  busca, não a página.
- A escada de `z-index` é curta e proposital: aurora em `-1`, Nav em `10`, lista
  de resultados da busca em `20`. O `10` do Nav existe porque o cadeado do
  gerador é `absolute` e vem depois no documento — sem ele, passaria por cima da
  barra ao rolar. E como o Nav abre um contexto de empilhamento, valor novo
  acima de `20` em componente de página não vence a barra; vai por dentro dela
  ou não vai.

### Busca

Índice montado no build por
[src/pages/indice-busca.json.ts](src/pages/indice-busca.json.ts) (título, tipo,
subgênero, URL com âncora); o filtro em si é `buscar()` em
[src/lib/busca.ts](src/lib/busca.ts) — comparação sem acentos, ordenada pela
posição do trecho encontrado. [Busca.astro](src/components/Busca.astro) baixa o
JSON sob demanda, uma vez.

Âncoras e slugs saem sempre de `paraAncora()` em
[src/lib/texto.ts](src/lib/texto.ts) — não montar slug à mão em componente.

### Publicação e `base`

`site`/`base` são derivados de `GITHUB_REPOSITORY` por `resolverBase()` em
[src/lib/config.ts](src/lib/config.ts), consumido por
[astro.config.ts](astro.config.ts). Fora do Actions cai em `localhost:4321` com
base `/`. Por isso **todo link interno precisa passar por
`import.meta.env.BASE_URL`** (o padrão no código é normalizar com
`base.endsWith('/') ? base : base + '/'`); um `href="/arquetipos/"` cru quebra
em produção.

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) roda `npx vitest
run` e `npm run check` antes do build e publica no GitHub Pages a partir de
`main` — os dois precisam passar localmente antes de empurrar.

### Migração do Notion

[scripts/migracao/](scripts/migracao/) é um script Python de uso único que gerou
`src/content/` a partir do Notion, já aposentado como fonte de verdade. Só
`notion.py` toca a rede; os testes usam fixtures gravadas. Mexer aqui só se a
migração precisar ser reexecutada — o conteúdo hoje se edita direto no Markdown.

## Licenças

Código MIT ([LICENSE](LICENSE)); conteúdo editorial CC BY 4.0
([LICENSE-CONTEUDO.md](LICENSE-CONTEUDO.md)). O rodapé do site declara as duas.
