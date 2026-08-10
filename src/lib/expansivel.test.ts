import { describe, expect, it } from 'vitest';
import { ehTeclaDeFechar, proximoEstado } from './expansivel';

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

describe('ehTeclaDeFechar', () => {
  it('reconhece o Escape dos navegadores atuais', () => {
    expect(ehTeclaDeFechar('Escape')).toBe(true);
  });

  // O "Esc" abreviado é o que o Internet Explorer e o Edge antigo mandam.
  it('reconhece o "Esc" abreviado', () => {
    expect(ehTeclaDeFechar('Esc')).toBe(true);
  });

  it('ignora as outras teclas', () => {
    expect(ehTeclaDeFechar('Enter')).toBe(false);
    expect(ehTeclaDeFechar('ArrowDown')).toBe(false);
    expect(ehTeclaDeFechar('e')).toBe(false);
  });

  // Comparação sensível a caixa: um "escape" minúsculo não é o que o navegador
  // manda, e aceitá-lo esconderia um erro de digitação em quem chamar.
  it('não aceita a tecla em minúsculas', () => {
    expect(ehTeclaDeFechar('escape')).toBe(false);
  });
});
