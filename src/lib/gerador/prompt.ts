import type { Opcoes, Sorteio } from './tipos';

export function nomearMundos(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarMundos) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  /* A ordem é a das cartas na tela — personagem A, personagem B, local — e o
     Set preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na ordem
     em que a pessoa lê as peças, não em ordem alfabética nem de coleção.

     O filtro do pool `comuns` que existia aqui saiu junto com os arquétipos: as
     profissões pertencem aos seis mundos e a nenhum outro pool. */
  const usados = [
    sorteio.personagemA.profissao.subgenero,
    sorteio.personagemB.profissao.subgenero,
    sorteio.local.subgenero,
  ];

  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}

export type ValoresDoPrompt = {
  mundo: string;
  personagemA: string;
  personagemB: string;
  local: string;
  fato: string;
};

const MARCADORES: Record<string, keyof ValoresDoPrompt> = {
  '[MUNDO]': 'mundo',
  '[PERSONAGEM A]': 'personagemA',
  '[PERSONAGEM B]': 'personagemB',
  '[LOCAL]': 'local',
  '[FATO]': 'fato',
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
