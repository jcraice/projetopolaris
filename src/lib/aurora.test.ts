import { describe, expect, it } from 'vitest';
import { AURORA_PADRAO, gradienteConico } from './aurora';

describe('gradienteConico', () => {
  it('fecha o círculo repetindo a primeira cor', () => {
    const css = gradienteConico(['#ff2d92', '#7c3aed', '#00e5ff']);
    expect(css).toBe('conic-gradient(from 200deg, #ff2d92, #7c3aed, #00e5ff, #ff2d92)');
  });

  it('cai na aurora padrão quando o subgênero não é um mundo', () => {
    expect(gradienteConico(undefined)).toBe(gradienteConico(AURORA_PADRAO));
  });
});
