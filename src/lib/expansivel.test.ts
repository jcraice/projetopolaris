import { describe, expect, it } from 'vitest';
import { proximoEstado } from './expansivel';

describe('proximoEstado', () => {
  it('abre quando está fechado', () => {
    expect(proximoEstado('false')).toBe('true');
  });

  it('fecha quando está aberto', () => {
    expect(proximoEstado('true')).toBe('false');
  });

  // O botão nasce com aria-expanded="false" no HTML, mas se o atributo sumir
  // por qualquer motivo o primeiro clique precisa abrir, não fechar em silêncio.
  it('abre quando o atributo está ausente', () => {
    expect(proximoEstado(null)).toBe('true');
  });

  it('abre diante de qualquer valor que não seja "true"', () => {
    expect(proximoEstado('')).toBe('true');
    expect(proximoEstado('sim')).toBe('true');
  });
});
