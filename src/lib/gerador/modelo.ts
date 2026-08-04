/* A substituição de marcadores, compartilhada pelos dois textos que a autora
   escreve em Markdown com lacunas: o prompt de IA (prompt-ia.md) e a ficha
   (ficha.md). Estava dentro de prompt.ts e saiu quando a ficha passou a precisar
   do mesmo mecanismo com outros cinco marcadores. */

/* Marcador é colchete com só maiúsculas e espaço dentro — é a convenção de todos
   os que existem, do `[MUNDO]` ao `[ELEMENTO NARRATIVO]`. A definição é estreita
   de propósito: um "[ver nota]" em minúsculas no meio da prosa continua sendo
   texto, e a autora pode escrever colchetes nos moldes sem que a montagem pare
   de funcionar. */
const MARCADOR_QUE_SOBROU = /\[\p{Lu}[\p{Lu} ]*\]/u;

/**
 * Troca cada marcador pelo valor correspondente e falha alto se sobrar algum.
 *
 * @param origem nome do arquivo do molde, só para a mensagem de erro apontar
 *   onde a autora precisa corrigir.
 */
export function preencher(
  modelo: string,
  valores: Record<string, string>,
  origem: string,
): string {
  let texto = modelo;
  for (const [marcador, valor] of Object.entries(valores)) {
    texto = texto.split(marcador).join(valor);
  }

  /* Falhar alto em vez de devolver o texto pela metade: um marcador escrito
     errado no Markdown vira teste vermelho e build quebrado, e não um texto que
     chega na tela — ou na IA — com "[ARQUETIPO]" cru no meio. */
  const sobrou = texto.match(MARCADOR_QUE_SOBROU);
  if (sobrou) {
    throw new Error(`marcador desconhecido em ${origem}: ${sobrou[0]}`);
  }

  return texto;
}
