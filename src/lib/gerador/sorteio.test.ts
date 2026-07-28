import { describe, expect, it } from 'vitest';
import { poolsFiltrados, sortear } from './sorteio';
import type { Opcoes, Pools, Sorteio, Travas } from './tipos';

const pools: Pools = {
  arquetipos: [
    { id: 'a1', nome: 'A Transumana', subgenero: 'cyberpunk' },
    { id: 'a2', nome: 'O Capitão Estratégico', subgenero: 'space-opera' },
    { id: 'a3', nome: 'A Mentora', subgenero: 'comuns' },
  ],
  cenarios: [
    { id: 'c1', nome: 'Megacidades', subgenero: 'cyberpunk', singular: 'uma megacidade' },
    { id: 'c2', nome: 'Ruínas Antigas', subgenero: 'space-opera', singular: 'uma ruína antiga' },
  ],
  elementos: [
    { id: 'e1', nome: 'Vigilância onipresente', subgenero: 'cyberpunk' },
    { id: 'e2', nome: 'Profecias cósmicas', subgenero: 'space-opera' },
  ],
};

const SEM_TRAVA: Travas = { arquetipo: false, cenario: false, elemento: false };
const base: Opcoes = { subgenero: 'cyberpunk', misturarMundos: false, incluirComuns: false };
const zero = () => 0;

describe('poolsFiltrados', () => {
  it('mantém apenas o subgênero escolhido', () => {
    const r = poolsFiltrados(pools, base);
    expect(r.arquetipos.map((a) => a.id)).toEqual(['a1']);
  });

  it('soma os arquétipos comuns quando pedido', () => {
    const r = poolsFiltrados(pools, { ...base, incluirComuns: true });
    expect(r.arquetipos.map((a) => a.id).sort()).toEqual(['a1', 'a3']);
  });

  it('deixa passar todos os mundos no modo misturar', () => {
    const r = poolsFiltrados(pools, { ...base, misturarMundos: true });
    expect(r.arquetipos).toHaveLength(3);
    expect(r.cenarios).toHaveLength(2);
  });
});

describe('sortear', () => {
  it('respeita o subgênero escolhido', () => {
    const s = sortear(pools, base, SEM_TRAVA, null, zero);
    expect(s.arquetipo.subgenero).toBe('cyberpunk');
    expect(s.cenario.subgenero).toBe('cyberpunk');
    expect(s.elemento.subgenero).toBe('cyberpunk');
  });

  it('preserva a peça travada', () => {
    const anterior = sortear(pools, { ...base, misturarMundos: true }, SEM_TRAVA, null, () => 0.9);
    const novo = sortear(
      pools, { ...base, misturarMundos: true },
      { arquetipo: true, cenario: false, elemento: false }, anterior, () => 0,
    );
    expect(novo.arquetipo).toEqual(anterior.arquetipo);
  });

  it('nunca repete a complicação da rolagem anterior', () => {
    let anterior: Sorteio | null = null;
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, SEM_TRAVA, anterior, Math.random);
      if (anterior) expect(atual.complicacao).not.toBe(anterior.complicacao);
      anterior = atual;
    }
  });

  it('nunca repete a família da rolagem anterior', () => {
    let anterior: Sorteio | null = null;
    for (let i = 0; i < 50; i++) {
      const atual = sortear(pools, base, SEM_TRAVA, anterior, Math.random);
      if (anterior) expect(atual.familia).not.toBe(anterior.familia);
      anterior = atual;
    }
  });

  it('lança erro quando não há peça disponível', () => {
    const vazio: Pools = { arquetipos: [], cenarios: [], elementos: [] };
    expect(() => sortear(vazio, base, SEM_TRAVA, null, zero)).toThrow(/sem peças/i);
  });
});
