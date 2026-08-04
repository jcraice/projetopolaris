import { preencher } from './modelo';
import { contrair } from './redacao';
import { escolher, poolsFiltrados, sortearComplicacao } from './sorteio';
import type { Opcoes, Peca, Pools, SorteioFicha, TravasFicha } from './tipos';

/* O segundo modo do gerador. Em vez de uma frase corrida, uma ficha de quatro
   linhas com dois personagens — molde que a autora escreveu antes deste site.
   Ver docs/superpowers/plans/2026-08-04-ficha-minima.md.

   Esta é a versão mínima: só o que o acervo já sustenta. As linhas de personagem
   saem sem o "que é ..." do molde original, porque característica física e
   personalidade pedem bancos que não existem — e pedem, cada entrada, as duas
   formas de gênero escritas à mão, pelo mesmo motivo que arquetipos.nome é
   obrigado a declarar o artigo. */

/* Sorteia os dois personagens garantindo que sejam diferentes.
 *
 * A ordem importa por causa das travas: quem está congelado é resolvido
 * primeiro, e só então o solto é sorteado excluindo o congelado. Sortear na
 * ordem A, B ingenuamente deixaria passar o caso de B travado — A cairia em cima
 * de B sem nada impedir.
 */
function sortearPersonagens(
  pool: Peca[],
  travas: TravasFicha,
  anterior: SorteioFicha | null,
  aleatorio: () => number,
): [Peca, Peca] {
  const fixoA = travas.personagemA && anterior ? anterior.personagemA : null;
  const fixoB = travas.personagemB && anterior ? anterior.personagemB : null;

  /* Só exige dois quando há de fato o que sortear: com os dois travados nenhum
     sorteio acontece, e eles já eram diferentes na rodada anterior. */
  if ((!fixoA || !fixoB) && pool.length < 2) {
    throw new Error(
      'o pool precisa de pelo menos dois arquétipos para a ficha ter dois personagens diferentes',
    );
  }

  const a = fixoA ?? escolher(pool.filter((p) => p.id !== fixoB?.id), aleatorio);
  const b = fixoB ?? escolher(pool.filter((p) => p.id !== a.id), aleatorio);
  return [a, b];
}

export function sortearFicha(
  pools: Pools,
  opcoes: Opcoes,
  travas: TravasFicha,
  anterior: SorteioFicha | null,
  aleatorio: () => number,
): SorteioFicha {
  const disponivel = poolsFiltrados(pools, opcoes);
  const [personagemA, personagemB] = sortearPersonagens(
    disponivel.arquetipos, travas, anterior, aleatorio,
  );
  const { complicacao, familia } = sortearComplicacao(anterior, aleatorio);

  return {
    personagemA,
    personagemB,
    cenario: travas.cenario && anterior ? anterior.cenario : escolher(disponivel.cenarios, aleatorio),
    complicacao,
    familia,
  };
}

/* O nome do mundo vem de fora, já pronto: é `nomearMundos` que sabe juntar
   "Cyberpunk + Distopia" quando o sorteio mistura, e ignorar o pool `comuns`,
   que não é um mundo.
 *
 * Os nomes dos arquétipos entram como estão no acervo, com a maiúscula — cada um
 * ocupa uma linha inteira da ficha, então não há frase em volta que peça
 * minúscula, ao contrário do que acontece na premissa.
 */
export function redigirFicha(modelo: string, sorteio: SorteioFicha, mundo: string): string {
  return preencher(
    modelo,
    {
      '[MUNDO]': mundo,
      '[PERSONAGEM A]': sorteio.personagemA.nome,
      '[PERSONAGEM B]': sorteio.personagemB.nome,
      // A forma singular do cenário existe para isto: "em" + "um" vira "num".
      '[LOCAL]': contrair('em', sorteio.cenario.singular),
      '[FATO]': sorteio.complicacao,
    },
    'ficha.md',
  );
}
