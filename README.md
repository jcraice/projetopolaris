# Projeto Polaris

Catálogo de arquétipos de ficção científica, organizado por subgênero, com um
gerador de combinações de premissas que roda inteiramente no navegador. O
acervo cobre arquétipos de personagem, cenários, elementos narrativos e
livros de referência, e é publicado como site estático no GitHub Pages.

O site está no ar em **https://jcraice.github.io/projetopolaris/**, com 146
arquétipos, 60 cenários, 120 elementos narrativos e 36 livros. São seis mundos —
Cyberpunk, Distopia, Invasão Alienígena, Pós Apocalíptico, Space Opera e Viagem
no Tempo — com 21 arquétipos, 10 cenários e 20 elementos cada, mais um pool de
20 arquétipos comuns que serve a todos. Tem busca em todo o acervo, tema claro e
escuro, e um gerador que combina as peças em premissas prontas para começar uma
história.

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
nome: A Exploradora Silenciosa
subgenero: cyberpunk
ordem: 15
---

Descrição do arquétipo em um ou dois parágrafos.
```

O nome deve começar com o artigo definido ("A " ou "O "), porque o gerador de
premissas usa esse artigo para concordância gramatical. O campo `subgenero`
deve corresponder ao identificador de um arquivo já existente em
`src/content/subgeneros/`.

Depois de adicionar ou editar um arquivo, rode `npm run build` para
confirmar que o conteúdo passa na validação de esquema, e `npx vitest run`
para garantir que nada mais quebrou.

## Licenças

- O código-fonte está sob licença MIT — veja [`LICENSE`](./LICENSE).
- O conteúdo editorial (arquétipos, cenários, elementos narrativos, textos
  das páginas e o banco de complicações) está sob Creative Commons Atribuição
  4.0 Internacional (CC BY 4.0) — veja
  [`LICENSE-CONTEUDO.md`](./LICENSE-CONTEUDO.md).
