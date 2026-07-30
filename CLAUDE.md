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

## Restrições do projeto

Vêm do plano de implementação ([docs/superpowers/plans/2026-07-27-polaris.md](docs/superpowers/plans/2026-07-27-polaris.md)) e valem para código novo:

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
  que chama o olho (títulos de verbete, botão principal, etiqueta, pilares) e
  `--apoio` é a interface em volta (links, botões secundários, foco, barras).
  `--ouro` e `--violeta` existem só como origem dos dois no tema escuro —
  componente nenhum deve consumi-los direto, porque no claro a paleta é outra
  (ciano `#0e6e7d` e azul-tinta `#1b2a4a`, sem relação com dourado e violeta).
- A "aurora" muda de cor por subgênero e **não existe no tema claro**, onde o
  fundo é liso.
- **Mexeu em cor, tamanho de fonte ou opacidade da aurora?** Refaça as contas de
  [docs/verificacao-visual.md](docs/verificacao-visual.md) e atualize o
  documento. Vários valores estão no limite: os títulos dos verbetes só passam
  porque têm 1.2rem, e a aurora só pode ir até 0,37 (hoje está em 0,36, em
  [Aurora.astro](src/components/Aurora.astro)).
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

- `arquetipos.nome` **precisa** começar com "A " ou "O " — o gerador deriva
  gênero gramatical e pronome desse artigo.
- `cenarios.singular` precisa começar com "um " ou "uma " — é a forma que entra
  nos moldes de frase, contraída com preposição.
- `subgeneros.mundo: false` marca um pool que não é um mundo (hoje só
  `comuns.md`, os 20 arquétipos comuns): não gera página em `/mundos/` e só
  entra no gerador quando "incluir comuns" está ligado.
- `subgenero` com `mundo: true` exige `aurora` (trio de cores hex).
- `arquetipos.felino: true` marca o arquétipo bônus, renderizado à parte com
  etiqueta própria.

O campo `ordem` define a posição nos índices — a ordenação é sempre explícita,
nunca alfabética por acidente.

**Prosa não mora em componente.** Os textos das páginas de índice, de Sobre e de
Estilos vêm da coleção `paginas` (`src/content/paginas/*.md`), buscados com
`getEntry` — e a página estoura o build com mensagem explícita se a entrada
sumir, em vez de renderizar vazio. A home vai além e reaproveita parágrafos já
escritos em `sobre.md` por `paragrafoComPrefixo()`
([texto.ts](src/lib/texto.ts)), casando pelo início do parágrafo; ao editar
`sobre.md`, esses prefixos são contrato. Nada de copiar prosa autoral para
dentro de um `.astro`.

`/mundos/[subgenero]/` é porta de entrada, não catálogo: mostra três itens de
cada tipo e manda para a página completa (e deixa o arquétipo felino de fora da
amostra). Listar tudo ali esvazia o "Ver todos".

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
