import { describe, expect, it } from 'vitest';
import { ALTURA_MAPA, CENTRO, LARGURA_MAPA, cruzamentos, posicoesDoMapa, posicoesDosNumeros } from './mapa';

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

/* As seis combinações da página de estilos: cada subgênero ligado ao que está
   quatro posições adiante no círculo. */
const PARES_DA_PAGINA = [
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
  [5, 9],
] as const;

function linhasDaPagina() {
  const estrelas = posicoesDoMapa(10);
  return PARES_DA_PAGINA.map(([a, b]) => [estrelas[a], estrelas[b]] as const);
}

describe('cruzamentos', () => {
  it('acha os doze pontos em que as seis linhas da página se cruzam', () => {
    expect(cruzamentos(linhasDaPagina())).toHaveLength(12);
  });

  it('não conta como cruzamento duas linhas que só partem da mesma estrela', () => {
    const a = { x: 0, y: 0 };
    expect(cruzamentos([[a, { x: 10, y: 0 }], [a, { x: 0, y: 10 }]])).toEqual([]);
  });

  it('acha o ponto certo num X simples', () => {
    const [p] = cruzamentos([
      [{ x: 0, y: 0 }, { x: 10, y: 10 }],
      [{ x: 0, y: 10 }, { x: 10, y: 0 }],
    ]);
    expect(p.x).toBeCloseTo(5);
    expect(p.y).toBeCloseTo(5);
  });
});

describe('posicoesDosNumeros', () => {
  const linhas = linhasDaPagina();
  const estrelas = posicoesDoMapa(10);
  const ocupados = [...estrelas, CENTRO, ...cruzamentos(linhas)];
  const numeros = posicoesDosNumeros(linhas, ocupados);

  it('põe cada número em cima da própria linha', () => {
    numeros.forEach((n, i) => {
      const [p, q] = linhas[i];
      const cruz = (q.x - p.x) * (n.y - p.y) - (q.y - p.y) * (n.x - p.x);
      expect(Math.abs(cruz) / Math.hypot(q.x - p.x, q.y - p.y)).toBeLessThan(0.01);
    });
  });

  /* O número é um círculo de raio 8: abaixo de 16 ele encosta no vizinho. */
  it('deixa cada número longe das estrelas, dos cruzamentos e dos outros números', () => {
    numeros.forEach((n, i) => {
      const outros = [...ocupados, ...numeros.filter((_, j) => j !== i)];
      for (const o of outros) expect(Math.hypot(o.x - n.x, o.y - n.y)).toBeGreaterThanOrEqual(16);
    });
  });
});
