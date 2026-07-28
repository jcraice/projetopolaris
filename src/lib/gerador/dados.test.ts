import { describe, expect, it } from 'vitest';
import { COMPLICACOES } from './complicacoes';
import { MOLDES } from './moldes';

describe('COMPLICACOES', () => {
  it('tem sete famílias e quarenta complicações', () => {
    expect(COMPLICACOES).toHaveLength(7);
    expect(COMPLICACOES.flatMap((f) => f.complicacoes)).toHaveLength(40);
  });

  it('não tem complicação repetida', () => {
    const todas = COMPLICACOES.flatMap((f) => f.complicacoes);
    expect(new Set(todas).size).toBe(40);
  });

  it('começa em minúscula e não termina em ponto, para encaixar no molde', () => {
    for (const texto of COMPLICACOES.flatMap((f) => f.complicacoes)) {
      expect(texto[0]).toBe(texto[0].toLowerCase());
      expect(texto.endsWith('.')).toBe(false);
    }
  });

  it('nenhuma família fica vazia', () => {
    for (const familia of COMPLICACOES) expect(familia.complicacoes.length).toBeGreaterThan(0);
  });
});

describe('MOLDES', () => {
  it('tem dez moldes', () => {
    expect(MOLDES).toHaveLength(10);
  });

  it('todo molde usa as quatro peças', () => {
    for (const molde of MOLDES) {
      expect(molde).toMatch(/\{(em:|a:)?cenario\}/);
      expect(molde).toMatch(/\{(impera:|de:)?elemento\}/);
      expect(molde).toContain('{arquetipo}');
      expect(molde).toContain('{complicacao}');
    }
  });

  it('todo molde termina em ponto final', () => {
    for (const molde of MOLDES) expect(molde.endsWith('.')).toBe(true);
  });
});
