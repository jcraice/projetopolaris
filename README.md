# Projeto Polaris

Catálogo de arquétipos de ficção científica, organizado por subgênero, com um
gerador de premissas que roda inteiramente no navegador. O acervo cobre
arquétipos de personagem, cenários, elementos narrativos e livros de referência,
e é publicado como site estático no GitHub Pages.

O site está no ar em **https://jcraice.github.io/projetopolaris/**, com 76
arquétipos, 60 cenários, 60 elementos narrativos e 36 livros. São seis mundos —
Cyberpunk, Distopia, Invasão Alienígena, Pós Apocalíptico, Space Opera e Viagem
no Tempo — com 11 arquétipos, 10 cenários e 10 elementos cada, mais um pool de
10 arquétipos comuns que serve a todos. Tem busca em todo o acervo e tema claro
e escuro.

## O gerador de premissas

Em `/gerador/`, o site monta uma premissa para começar uma história: dois
personagens, um lugar e um fato que complica tudo.

```
Essa é uma ficção científica de space opera.

Um(a) Contrabandista que é cego(a) de um olho.
Um(a) Engenheiro(a) Chefe que é leal demais.

Tudo começa numa frota nômade.

Importante: os dois já se conheceram antes.
```

Cada peça vem de uma lista própria: **60 profissões** (dez por mundo), **30
características físicas**, **30 personalidades**, os **60 locais** do acervo de
cenários e **40 fatos**. Dentro de um mundo só isso dá mais de 32 milhões de
premissas diferentes.

A premissa é a própria interface. O que o sorteio trouxe aparece destacado
dentro da frase, e cada linha tem um cadeado: trave o que gostou e gere de novo
até o resto encaixar. Os dois personagens nunca saem com a mesma profissão, e as
descrições das 60 estão em `/guia-de-personagens/`.

A página monta também um prompt pronto para colar numa IA de texto, com as
mesmas peças.

Arquétipos e elementos narrativos não entram no sorteio — eles são o acervo que
se lê, não peça de combinação.

Nada é carregado de fora e nada é guardado sobre quem visita: o gerador roda
inteiramente no navegador, a partir de dados embutidos na página em tempo de
build, e a única coisa que fica no navegador é a escolha entre tema claro e
escuro.

## Como rodar

Requisitos: Node 22.12 ou superior e `npm`.

```bash
npm install
npm run dev
```

O site fica disponível em `http://localhost:4321`.

Outros comandos úteis:

```bash
npm run build     # gera o site estático em dist/
npm run preview   # serve o build de dist/ localmente
npm run check     # confere TypeScript e templates .astro
npx vitest run    # roda a suíte de testes
```

`npx vitest run` e `npm run check` são o que a publicação roda antes de
construir o site — se um dos dois falhar, o deploy para.

## Como contribuir com um arquétipo novo

O acervo editorial vive em `src/content/`, como arquivos Markdown com
frontmatter validado por esquema. Um arquétipo novo é um arquivo em
`src/content/arquetipos/<subgenero>/<slug-do-arquetipo>.md`, com pelo menos:

```markdown
---
nome: Exploradora Silenciosa
artigo: a
subgenero: cyberpunk
ordem: 15
---

Descrição do arquétipo em um ou dois parágrafos.
```

O nome vai sem artigo — é assim que ele aparece no catálogo. O artigo definido
fica no campo `artigo` (`a` ou `o`), que registra o gênero do arquétipo no
acervo; é obrigatório e sem valor padrão de propósito, para nenhum arquétipo
novo nascer masculino em silêncio. O campo `subgenero` deve corresponder ao
identificador de um arquivo já existente em `src/content/subgeneros/`.

Depois de adicionar ou editar um arquivo, rode `npm run build` para
confirmar que o conteúdo passa na validação de esquema, e `npx vitest run`
para garantir que nada mais quebrou.

## Licenças

- O código-fonte está sob licença MIT — veja [`LICENSE`](./LICENSE).
- O conteúdo editorial (arquétipos, cenários, elementos narrativos, livros,
  textos das páginas e as listas do gerador — profissões, características,
  personalidades e fatos) está sob Creative Commons Atribuição 4.0
  Internacional (CC BY 4.0) — veja
  [`LICENSE-CONTEUDO.md`](./LICENSE-CONTEUDO.md).
