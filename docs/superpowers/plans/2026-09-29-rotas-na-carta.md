# Plano: Rotas na carta

Spec: [2026-09-29-rotas-na-carta-design.md](../specs/2026-09-29-rotas-na-carta-design.md)

1. `cruzamentos()` e `posicoesDosNumeros()` em `src/lib/mapa.ts`, com testes em
   `mapa.test.ts`: os doze cruzamentos dos seis pares da página, o número em
   cima da própria linha e a pelo menos 16 de qualquer estrela, cruzamento ou
   outro número (o círculo do número tem raio 8).
2. Campos novos em `esquemaPagina`: `aberturaEstilos`, `aberturaCombinacoes`,
   `eixo` (exatamente dois polos), `lentes`, `combinacoes` (ids de subgênero).
   Teste recusando três polos.
3. `estilos.md` com o frontmatter novo e só a abertura no corpo;
   `estilos-fechamento.md` com o fechamento. As duas `<div class="bloco">` do
   Markdown saem.
4. `RotasNaCarta.astro` desenha mapa e lista, e estoura o build com id de
   subgênero desconhecido. `estilos.astro` monta a página.
5. `vitest`, `astro check`, `build`, e fotos nos dois temas e no celular antes de
   publicar.
6. CLAUDE.md: o mapa não é mais só da home, a estrutura da página de estilos e o
   exemplo de `:global()`, que agora aponta para `index.astro`.
