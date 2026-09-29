# Plano: busca no Google

Spec: [2026-09-29-busca-no-google-design.md](../specs/2026-09-29-busca-no-google-design.md)

1. `resumir()` em `texto.ts`, com testes: texto curto intacto, corte em palavra
   inteira, Markdown fora, sem pontuação antes das reticências.
2. `@astrojs/sitemap` em `astro.config.ts`, filtrando a 404.
3. `Base.astro`: `descricao` obrigatória, `tituloCompleto`, `semIndice`,
   canônico, `og:*`, link do mapa, slot `cabeca`; estoura com descrição vazia.
4. Cada página passa título e descrição; `gerador.md` e
   `guia-de-personagens.md` novos; ficha JSON-LD na home.
5. Build com `GITHUB_REPOSITORY` para conferir os endereços reais.
6. CLAUDE.md.
