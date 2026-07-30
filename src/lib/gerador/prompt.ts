import type { Opcoes, Sorteio } from './tipos';

/* O pool `comuns` não é um mundo: são os 20 arquétipos que servem a todos. Com
   "misturar mundos" ligado ele entra no sorteio como qualquer outro, e um
   "Distopia + 20 Arquétipos Comuns" na linha "Mundo:" do prompt não descreveria
   mundo nenhum — descreveria o acervo. Por isso ele não contribui com nome. */
const NAO_E_MUNDO = 'comuns';

export function nomearMundos(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarMundos) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  /* A ordem é a das cartas na tela — arquétipo, cenário, elemento — e o Set
     preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na ordem em
     que a pessoa lê as peças, não em ordem alfabética nem de coleção. */
  const usados = [
    sorteio.arquetipo.subgenero,
    sorteio.cenario.subgenero,
    sorteio.elemento.subgenero,
  ].filter((subgenero) => subgenero !== NAO_E_MUNDO);

  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}

export type ValoresDoPrompt = {
  mundo: string;
  arquetipo: string;
  cenario: string;
  elemento: string;
};

const MARCADORES: Record<string, keyof ValoresDoPrompt> = {
  '[MUNDO]': 'mundo',
  '[ARQUÉTIPO]': 'arquetipo',
  '[CENÁRIO]': 'cenario',
  '[ELEMENTO NARRATIVO]': 'elemento',
};

/* Marcador é colchete com só maiúsculas e espaço dentro — é a convenção dos
   quatro que existem. A definição é estreita de propósito: um "[ver nota]" em
   minúsculas no meio da prosa continua sendo texto, e a autora pode escrever
   colchetes no prompt-ia.md sem que a montagem pare de funcionar. */
const MARCADOR_QUE_SOBROU = /\[\p{Lu}[\p{Lu} ]*\]/u;

export function montarPrompt(modelo: string, valores: ValoresDoPrompt): string {
  let texto = modelo;
  for (const [marcador, chave] of Object.entries(MARCADORES)) {
    texto = texto.split(marcador).join(valores[chave]);
  }

  /* Falhar alto em vez de devolver o texto pela metade: um marcador escrito
     errado no prompt-ia.md vira teste vermelho, e não um prompt que chega na IA
     com "[ARQUETIPO]" cru no meio. */
  const sobrou = texto.match(MARCADOR_QUE_SOBROU);
  if (sobrou) {
    throw new Error(`marcador desconhecido no modelo do prompt: ${sobrou[0]}`);
  }

  return texto;
}
