/* Um molde só, no lugar dos dez que existiam. A variedade passou para as
   listas: dentro de um mundo são 10 × 9 profissões × 30 características × 30
   personalidades × 10 locais × 40 fatos, cerca de 32 milhões de premissas.

   As quebras de linha fazem parte do molde e aparecem na tela — a premissa é um
   bloco de quatro linhas, não um parágrafo corrido, e é por isso que o
   parágrafo da premissa em gerador.astro precisa de `white-space: pre-wrap`.

   O "Um(a)" está aqui e não na lista de profissões: as 60 abrem com o mesmo
   artigo, então não há o que sortear, e o nome guardado fica idêntico ao que
   aparece no guia e na carta. É a diferença em relação ao local, que carrega o
   artigo dentro de `cenarios.singular` porque varia entre "um" e "uma".

   Repare no "é": ele está no molde só na linha da personalidade. Na linha da
   característica o verbo vem de dentro do texto sorteado, o que permite "que
   tem cicatrizes nas mãos" e "que é cego(a) de um olho" na mesma lista. */
export const MOLDE = `Essa é uma ficção científica de {mundo}.

Um(a) {profissaoA} que {caracteristica}.
Um(a) {profissaoB} que é {personalidade}.

Tudo começa {em:local}.

Importante: {fato}.`;
