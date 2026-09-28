import { describe, expect, it } from 'vitest';
import { ALTURA_MAPA, CENTRO, LARGURA_MAPA, posicoesDoMapa } from './mapa';

describe('posicoesDoMapa', () => {
  for (const n of [10, 12]) {
    it(`põe ${n} estrelas distintas dentro da caixa`, () => {
      const estrelas = posicoesDoMapa(n);
      expect(estrelas).toHaveLength(n);
      const chaves = new Set(estrelas.map((e) => `${e.x.toFixed(1)},${e.y.toFixed(1)}`));
      expect(chaves.size).toBe(n);
      for (const e of estrelas) {
        expect(e.x).toBeGreaterThan(0);
        expect(e.x).toBeLessThan(LARGURA_MAPA);
        expect(e.y).toBeGreaterThan(0);
        expect(e.y).toBeLessThan(ALTURA_MAPA);
      }
    });
  }

  it('começa pelo alto, acima da Polaris', () => {
    const [primeira] = posicoesDoMapa(10);
    expect(primeira.x).toBeCloseTo(CENTRO.x);
    expect(primeira.y).toBeLessThan(CENTRO.y);
  });

  it('manda o rótulo para fora do centro', () => {
    for (const e of posicoesDoMapa(10)) {
      if (e.x > CENTRO.x + 10) expect(e.ancora).toBe('start');
      if (e.x < CENTRO.x - 10) expect(e.ancora).toBe('end');
    }
  });
});
