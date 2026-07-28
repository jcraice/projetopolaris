import { COMPLICACOES } from './complicacoes';
import type { Opcoes, Peca, Pools, Sorteio, Travas } from './tipos';

function escolher<T>(lista: T[], aleatorio: () => number): T {
  if (lista.length === 0) throw new Error('sem peças disponíveis para sortear');
  return lista[Math.floor(aleatorio() * lista.length) % lista.length];
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

  const familias = COMPLICACOES.filter((f) => f.nome !== anterior?.familia);
  const familia = escolher(familias, aleatorio);
  const complicacoes = familia.complicacoes.filter((c) => c !== anterior?.complicacao);
  const complicacao = escolher(complicacoes, aleatorio);

  return {
    arquetipo: travas.arquetipo && anterior ? anterior.arquetipo : escolher(disponivel.arquetipos, aleatorio),
    cenario: travas.cenario && anterior ? anterior.cenario : escolher(disponivel.cenarios, aleatorio),
    elemento: travas.elemento && anterior ? anterior.elemento : escolher(disponivel.elementos, aleatorio),
    complicacao,
    familia: familia.nome,
  };
}
