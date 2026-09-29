# Plano: Ponto de partida

Spec: [2026-09-29-sobre-ponto-de-partida-design.md](../specs/2026-09-29-sobre-ponto-de-partida-design.md)

1. Campos novos em `esquemaPagina`: `frase`, `fraseDestaque`, `assinatura`,
   `portas` (destino em caminho cru, começando por uma barra só). Teste
   recusando destino sem barra.
2. `sobre.md` com o frontmatter novo e os três parágrafos no corpo;
   `sobre-contato.md` com a linha do e-mail.
3. `sobre.astro` monta a página e estoura o build se `fraseDestaque` não
   estiver dentro de `frase`.
4. `vitest`, `astro check`, `build`, fotos nos dois temas.
5. CLAUDE.md: estrutura da Sobre e o laranja das portas na lista de acentos.
