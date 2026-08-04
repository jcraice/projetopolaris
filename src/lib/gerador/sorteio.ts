import { COMPLICACOES } from './complicacoes';
import type { Opcoes, Peca, Pools, Sorteio, Travas } from './tipos';

/* Exportado para ficha.ts, que sorteia pelo mesmo critério. Não sai da pasta:
   index.ts não o reexporta, porque é peça interna do gerador. */
export function escolher<T>(lista: T[], aleatorio: () => number): T {
  if (lista.length === 0) throw new Error('sem peças disponíveis para sortear');
  return lista[Math.floor(aleatorio() * lista.length) % lista.length];
}

/* A complicação nunca repete a da rodada anterior, nem a família dela — as
   travas congelam as peças do acervo, mas a complicação sempre muda. Estava
   dentro de `sortear` e saiu quando a ficha passou a precisar da mesma regra:
   é uma regra do gerador, e não de um dos dois modos. */
export function sortearComplicacao(
  anterior: { complicacao: string; familia: string } | null,
  aleatorio: () => number,
): { complicacao: string; familia: string } {
  const familias = COMPLICACOES.filter((f) => f.nome !== anterior?.familia);
  const familia = escolher(familias, aleatorio);
  const complicacoes = familia.complicacoes.filter((c) => c !== anterior?.complicacao);
  return { complicacao: escolher(complicacoes, aleatorio), familia: familia.nome };
}

function pertence(peca: Peca, opcoes: Opcoes, aceitaComuns: boolean): boolean {
  if (opcoes.misturarMundos) return true;
  if (peca.subgenero === opcoes.subgenero) return true;
  return aceitaComuns && opcoes.incluirComuns && peca.subgenero === 'comuns';
}

export function poolsFiltrados(pools: Pools, opcoes: Opcoes): Pools {
  return {
    arquetipos: pools.arquetipos.filter((p) => pertence(p, opcoes, true)),
    cenarios: pools.cenarios.filter((p) => pertence(p, opcoes, false)),
    elementos: pools.elementos.filter((p) => pertence(p, opcoes, false)),
  };
}

export function sortear(
  pools: Pools,
  opcoes: Opcoes,
  travas: Travas,
  anterior: Sorteio | null,
  aleatorio: () => number,
): Sorteio {
  const disponivel = poolsFiltrados(pools, opcoes);
  const { complicacao, familia } = sortearComplicacao(anterior, aleatorio);

  return {
    arquetipo: travas.arquetipo && anterior ? anterior.arquetipo : escolher(disponivel.arquetipos, aleatorio),
    cenario: travas.cenario && anterior ? anterior.cenario : escolher(disponivel.cenarios, aleatorio),
    elemento: travas.elemento && anterior ? anterior.elemento : escolher(disponivel.elementos, aleatorio),
    complicacao,
    familia,
  };
}
