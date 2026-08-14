import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import type { Opcoes, Pools, Sorteio, Travas } from './tipos';

function escolher<T>(lista: T[], aleatorio: () => number): T {
  if (lista.length === 0) throw new Error('sem peças disponíveis para sortear');
  return lista[Math.floor(aleatorio() * lista.length) % lista.length];
}

function pertence(peca: { subgenero: string }, opcoes: Opcoes): boolean {
  return opcoes.misturarMundos || peca.subgenero === opcoes.subgenero;
}

export function poolsFiltrados(pools: Pools, opcoes: Opcoes): Pools {
  return {
    profissoes: pools.profissoes.filter((p) => pertence(p, opcoes)),
    locais: pools.locais.filter((l) => pertence(l, opcoes)),
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

  /* Os dois personagens nunca saem com a mesma profissão, e a trava pode estar
     em qualquer um dos dois — por isso o desvio acontece nos dois sentidos.
     Quando B está travado, é A que precisa evitar a profissão dele; nos outros
     casos A sai livre e B evita a de A. Sortear os dois sem olhar um para o
     outro deixaria passar "um(a) contrabandista / um(a) contrabandista". */
  const bTravado = travas.personagemB && anterior ? anterior.personagemB : null;
  const paraA = bTravado
    ? disponivel.profissoes.filter((p) => p.nome !== bTravado.profissao.nome)
    : disponivel.profissoes;

  const personagemA = travas.personagemA && anterior ? anterior.personagemA : {
    profissao: escolher(paraA, aleatorio),
    caracteristica: escolher(CARACTERISTICAS, aleatorio),
  };

  const personagemB = bTravado ?? {
    profissao: escolher(
      disponivel.profissoes.filter((p) => p.nome !== personagemA.profissao.nome),
      aleatorio,
    ),
    personalidade: escolher(PERSONALIDADES, aleatorio),
  };

  /* O fato não tem cadeado e nunca repete o da rodada anterior. As complicações
     de antes tinham famílias e a regra evitava repetir a família também; os
     fatos são uma lista só, e a regra é só não repetir o último. */
  const fato = escolher(FATOS.filter((f) => f !== anterior?.fato), aleatorio);

  return {
    personagemA,
    personagemB,
    local: travas.local && anterior ? anterior.local : escolher(disponivel.locais, aleatorio),
    fato,
  };
}
