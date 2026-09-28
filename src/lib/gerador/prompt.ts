import type { Trecho } from './redacao';
import type { Opcoes, Sorteio } from './tipos';

export function nomearSubgeneros(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarSubgeneros) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  /* A ordem é a das linhas da premissa — personagem A, personagem B, local — e o
     Set preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na ordem
     em que a pessoa lê as peças, não em ordem alfabética nem de coleção.

     O filtro do pool `comuns` que existia aqui saiu junto com os arquétipos: as
     profissões pertencem aos dez subgêneros e a nenhum outro pool. */
  const usados = [
    sorteio.personagemA.profissao.subgenero,
    sorteio.personagemB.profissao.subgenero,
    sorteio.local.subgenero,
  ];

  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}

export type ValoresDoPrompt = {
  subgenero: string;
  personagemA: string;
  personagemB: string;
  local: string;
  fato: string;
};

const MARCADORES: Record<string, keyof ValoresDoPrompt> = {
  '[SUBGENERO]': 'subgenero',
  '[PERSONAGEM A]': 'personagemA',
  '[PERSONAGEM B]': 'personagemB',
  '[LOCAL]': 'local',
  '[FATO]': 'fato',
};

/* Marcador é colchete com só maiúsculas e espaço dentro — é a convenção dos
   cinco que existem. A definição é estreita de propósito: um "[ver nota]" em
   minúsculas no meio da prosa continua sendo texto, e a autora pode escrever
   colchetes no prompt-ia.md sem que a montagem pare de funcionar. */
const MARCADOR_QUE_SOBROU = /\[\p{Lu}[\p{Lu} ]*\]/u;

/* O prompt em trechos, com as peças sorteadas marcadas — a irmã de partes()
   para o prompt. A página precisa dela para pintar de --destaque só o que o
   sorteio trouxe, dentro do texto fixo da autora, e montarPrompt() é a junção
   destes mesmos trechos: o que a tela mostra e o que "Copiar prompt" leva não
   têm como divergir. */
export function trechosDoPrompt(modelo: string, valores: ValoresDoPrompt): Trecho[] {
  const trechos: Trecho[] = [];
  const marcadores = new RegExp(
    Object.keys(MARCADORES).map((m) => m.replace(/[[\]]/g, '\\$&')).join('|'),
    'g',
  );

  let inicio = 0;
  const fixo = (texto: string) => {
    if (!texto) return;
    /* Falhar alto em vez de devolver o texto pela metade: um marcador escrito
       errado no prompt-ia.md vira teste vermelho, e não um prompt que chega na
       IA com "[ARQUETIPO]" cru no meio. */
    const sobrou = texto.match(MARCADOR_QUE_SOBROU);
    if (sobrou) {
      throw new Error(`marcador desconhecido no modelo do prompt: ${sobrou[0]}`);
    }
    trechos.push({ texto, sorteado: false });
  };

  for (const achado of modelo.matchAll(marcadores)) {
    fixo(modelo.slice(inicio, achado.index));
    trechos.push({ texto: valores[MARCADORES[achado[0]]], sorteado: true });
    inicio = achado.index + achado[0].length;
  }
  fixo(modelo.slice(inicio));

  return trechos;
}

export function montarPrompt(modelo: string, valores: ValoresDoPrompt): string {
  return trechosDoPrompt(modelo, valores).map((t) => t.texto).join('');
}
