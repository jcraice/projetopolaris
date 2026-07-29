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
  porque têm 1.2rem, e a aurora só pode ir até 0,37.
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

### Gerador de premissas

[src/lib/gerador/](src/lib/gerador/) é um conjunto de funções puras, exportadas
por `index.ts` (ponto único de entrada; nada fora da pasta importa os arquivos
internos). Fluxo: `sortear()` escolhe arquétipo + cenário + elemento +
complicação respeitando travas e filtros, e `redigir()` encaixa o sorteio num
dos `MOLDES`.

`sortear` recebe `aleatorio: () => number` como parâmetro justamente para os
testes serem determinísticos — não chame `Math.random()` dentro da lib.

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
run` antes do build e publica no GitHub Pages a partir de `main`.

### Migração do Notion

[scripts/migracao/](scripts/migracao/) é um script Python de uso único que gerou
`src/content/` a partir do Notion, já aposentado como fonte de verdade. Só
`notion.py` toca a rede; os testes usam fixtures gravadas. Mexer aqui só se a
migração precisar ser reexecutada — o conteúdo hoje se edita direto no Markdown.

## Licenças

Código MIT ([LICENSE](LICENSE)); conteúdo editorial CC BY 4.0
([LICENSE-CONTEUDO.md](LICENSE-CONTEUDO.md)). O rodapé do site declara as duas.
