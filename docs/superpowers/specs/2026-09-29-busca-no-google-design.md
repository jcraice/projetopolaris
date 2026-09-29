# Busca no Google

Setembro de 2026. A autora quer que o site apareça quando alguém pesquisa
arquétipos de ficção científica e assuntos vizinhos. Posição no Google não se
garante; o que o código pode fazer é deixar cada página legível para a busca.

## O que entrou

- Descrição (`<meta name="description">`) em toda página, tirada do texto da
  autora e cortada em 160 caracteres por `resumir()`. Obrigatória em `<Base>`.
- `<title>` mais descritivo que o `h1`, com "ficção científica" e o tipo de
  recurso: "Arquétipos de Cyberpunk na ficção científica · Projeto Polaris". A
  home usa o título de `home.md`: "Projeto Polaris: Arquétipos da Ficção
  Científica".
- Endereço canônico, `og:*` para a prévia de link compartilhado, `noindex` na
  404 e ficha JSON-LD `WebSite` na home.
- Mapa do site (`@astrojs/sitemap`), 49 páginas, sem a 404.

## O que depende da autora

- Criar a propriedade no Google Search Console (prefixo de URL
  `https://jcraice.github.io/projetopolaris/`), escolher verificação por tag
  HTML e passar o código, que entra como `<meta name="google-site-verification">`
  em `Base.astro`.
- Depois de verificada, enviar `sitemap-index.xml` em Sitemaps.
- Fora do código, o que mais pesa: outros sites apontando para o Polaris.

## O que não entrou

`robots.txt`: o Google só lê o da raiz do domínio, e a raiz de
`jcraice.github.io` não é deste repositório.
