# Plano: painel de subgêneros e cartão de embarque

Spec: [2026-09-29-catalogos-painel-design.md](../specs/2026-09-29-catalogos-painel-design.md)

1. `arquetipos-`, `cenarios-` e `elementos-como-usar.md`: os seis passos saem da
   lista em Markdown para `comoUsar` no frontmatter, verbo em `titulo`, resto em
   `texto`. Conferir contra a lista antiga que o texto não mudou.
2. `PainelDePartidas.astro`: lista de links, número, nome, três escalas e
   flecha; no celular só nome e flecha.
3. `CartaoDeEmbarque.astro`: campos em duas colunas e canhoto com o último
   passo; estoura o build com menos de dois passos.
4. As três páginas de índice passam a usar os dois componentes; `/arquetipos/`
   mantém os comuns, as outras duas filtram por `completo`.
5. `vitest`, `astro check`, `build`, fotos nos dois temas e no celular.
6. CLAUDE.md e o comentário de `comoUsar` em `schemas.ts`.
