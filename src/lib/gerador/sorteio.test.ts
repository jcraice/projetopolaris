import { describe, expect, it } from 'vitest';
import { poolsFiltrados, sortear } from './sorteio';
import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import type { Opcoes, Pools, Sorteio, Travas } from './tipos';

const pools: Pools = {
  profissoes: [
    { nome: 'Hacker', subgenero: 'cyberpunk', descricao: 'Invasores de redes neurais.' },
    { nome: 'Corretor(a) de Dados', subgenero: 'cyberpunk', descricao: 'Traficantes de informação.' },
    { nome: 'Contrabandista', subgenero: 'space-opera', descricao: 'Evitam bloqueios imperiais.' },
  ],
  locais: [
    { id: 'c1', nome: 'Megacidades', subgenero: 'cyberpunk', singular: 'uma megacidade' },
    { id: 'c2', nome: 'Ruínas Antigas', subgenero: 'space-opera', singular: 'uma ruína antiga' },
  ],
};

const SEM_TRAVA: Travas = { personagemA: false, personagemB: false, local: false };
const base: Opcoes = { subgenero: 'cyberpunk', misturarMundos: false };
const zero = () => 0;

describe('poolsFiltrados', () => {
  it('mantém apenas o mundo escolhido', () => {
    const r = poolsFiltrados(pools, base);
    expect(r.profissoes.map((p) => p.nome)).toEqual(['Hacker', 'Corretor(a) de Dados']);
    expect(r.locais.map((l) => l.id)).toEqual(['c1']);
  });

  it('deixa passar todos os mundos no modo misturar', () => {
    const r = poolsFiltrados(pools, { ...base, misturarMundos: true });
    expect(r.profissoes).toHaveLength(3);
    expect(r.locais).toHaveLength(2);
  });
});

describe('sortear', () => {
  it('respeita o mundo escolhido', () => {
    const s = sortear(pools, base, SEM_TRAVA, null, zero);
    expect(s.personagemA.profissao.subgenero).toBe('cyberpunk');
    expect(s.personagemB.profissao.subgenero).toBe('cyberpunk');
    expect(s.local.subgenero).toBe('cyberpunk');
  });

  it('nunca dá a mesma profissão aos dois personagens', () => {
    for (let i = 0; i < 100; i++) {
      const s = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
      expect(s.personagemA.profissao.nome).not.toBe(s.personagemB.profissao.nome);
    }
  });

  it('mantém profissões diferentes com o personagem A travado', () => {
    let anterior: Sorteio | null = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 100; i++) {
      anterior = sortear(
        pools, { ...base, misturarMundos: true },
        { personagemA: true, personagemB: false, local: false }, anterior, Math.random,
      );
      expect(anterior.personagemA.profissao.nome).not.toBe(anterior.personagemB.profissao.nome);
    }
  });

  /* O caso espelhado do anterior, e o que motivou o pool de A ser filtrado: com
     B travado, é A que precisa desviar — sem isso, A cairia na profissão de B. */
  it('mantém profissões diferentes com o personagem B travado', () => {
    let anterior: Sorteio | null = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 100; i++) {
      anterior = sortear(
        pools, { ...base, misturarMundos: true },
        { personagemA: false, personagemB: true, local: false }, anterior, Math.random,
      );
      expect(anterior.personagemA.profissao.nome).not.toBe(anterior.personagemB.profissao.nome);
    }
  });

  it('preserva cada peça travada', () => {
    const anterior = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, () => 0.9);
    const novo = sortear(
      pools, { ...base, misturarMundos: true },
      { personagemA: true, personagemB: true, local: true }, anterior, () => 0,
    );
    expect(novo.personagemA).toEqual(anterior.personagemA);
    expect(novo.personagemB).toEqual(anterior.personagemB);
    expect(novo.local).toEqual(anterior.local);
  });

  it('nunca repete o fato da rolagem anterior', () => {
    let anterior: Sorteio | null = null;
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, SEM_TRAVA, anterior, Math.random);
      if (anterior) expect(atual.fato).not.toBe(anterior.fato);
      anterior = atual;
    }
  });

  /* O fato é a única peça sem cadeado: travar as três cartas e continuar
     clicando em Gerar é o uso que o cadeado sempre teve — segurar o elenco e o
     lugar e rolar só o que complica. */
  it('traz fato novo mesmo com as três travas ligadas', () => {
    const todas: Travas = { personagemA: true, personagemB: true, local: true };
    let anterior: Sorteio | null = sortear(pools, base, SEM_TRAVA, null, Math.random);
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, todas, anterior, Math.random);
      expect(atual.fato).not.toBe(anterior!.fato);
      anterior = atual;
    }
  });

  /* As três listas universais não passam por Pools nem por filtro de mundo: a
     lib as importa direto. Este caso tranca isso pelo comportamento — com um
     mundo escolhido, o traço sorteado continua vindo da lista inteira. */
  it('usa as listas universais mesmo com um mundo escolhido', () => {
    for (let i = 0; i < 50; i++) {
      const s = sortear(pools, base, SEM_TRAVA, null, Math.random);
      expect(CARACTERISTICAS).toContain(s.personagemA.caracteristica);
      expect(PERSONALIDADES).toContain(s.personagemB.personalidade);
      expect(FATOS).toContain(s.fato);
    }
  });

  it('lança erro quando não há peça disponível', () => {
    const vazio: Pools = { profissoes: [], locais: [] };
    expect(() => sortear(vazio, base, SEM_TRAVA, null, zero)).toThrow(/sem peças/i);
  });

  /* Um mundo com uma profissão só não consegue formar dois personagens
     diferentes. Falhar alto é melhor do que devolver os dois iguais em
     silêncio — e o acervo tem dez por mundo, então isto é guarda-corpo. */
  it('lança erro quando só há uma profissão para os dois personagens', () => {
    const soUma: Pools = {
      profissoes: [{ nome: 'Hacker', subgenero: 'cyberpunk', descricao: 'Invasores de redes neurais.' }],
      locais: pools.locais,
    };
    expect(() => sortear(soUma, base, SEM_TRAVA, null, zero)).toThrow(/sem peças/i);
  });
});
