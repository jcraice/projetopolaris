import { preencher } from './modelo';
import type { Opcoes, Sorteio } from './tipos';

/* O pool `comuns` não é um mundo: são os 20 arquétipos que servem a todos. Com
   "misturar mundos" ligado ele entra no sorteio como qualquer outro, e um
   "Distopia + 20 Arquétipos Comuns" na linha "Mundo:" do prompt não descreveria
   mundo nenhum — descreveria o acervo. Por isso ele não contribui com nome. */
const NAO_E_MUNDO = 'comuns';

/**
 * Nome do mundo a partir dos subgêneros das peças sorteadas.
 *
 * @param subgeneros na ordem em que as cartas aparecem na tela. Importa: o Set
 *   abaixo preserva a ordem de inserção, então "Distopia + Cyberpunk" sai na
 *   ordem em que a pessoa lê as peças, e não em ordem alfabética nem de coleção.
 *   Cada modo do gerador tem a sua — a premissa é arquétipo, cenário, elemento;
 *   a ficha é personagem A, personagem B, local.
 */
export function nomearMundosDe(
  subgeneros: string[],
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  if (!opcoes.misturarMundos) {
    const id = opcoes.subgenero;
    return id ? (nomes[id] ?? id) : '';
  }

  const usados = subgeneros.filter((subgenero) => subgenero !== NAO_E_MUNDO);
  return [...new Set(usados)].map((id) => nomes[id] ?? id).join(' + ');
}

export function nomearMundos(
  sorteio: Sorteio,
  opcoes: Opcoes,
  nomes: Record<string, string>,
): string {
  return nomearMundosDe(
    [sorteio.arquetipo.subgenero, sorteio.cenario.subgenero, sorteio.elemento.subgenero],
    opcoes,
    nomes,
  );
}

export type ValoresDoPrompt = {
  mundo: string;
  arquetipo: string;
  cenario: string;
  elemento: string;
};

export function montarPrompt(modelo: string, valores: ValoresDoPrompt): string {
  return preencher(
    modelo,
    {
      '[MUNDO]': valores.mundo,
      '[ARQUÉTIPO]': valores.arquetipo,
      '[CENÁRIO]': valores.cenario,
      '[ELEMENTO NARRATIVO]': valores.elemento,
    },
    'prompt-ia.md',
  );
}
