import { describe, expect, it } from 'vitest';
import { ehPaginaAtual } from './navegacao';

describe('ehPaginaAtual', () => {
  it('reconhece a própria página', () => {
    expect(ehPaginaAtual('/arquetipos/', '/arquetipos')).toBe(true);
  });

  it('não se importa com a barra final de nenhum dos dois lados', () => {
    expect(ehPaginaAtual('/arquetipos', '/arquetipos')).toBe(true);
    expect(ehPaginaAtual('/arquetipos/', '/arquetipos/')).toBe(true);
    expect(ehPaginaAtual('/arquetipos', '/arquetipos/')).toBe(true);
  });

  it('mantém a marca acesa nas páginas de dentro', () => {
    expect(ehPaginaAtual('/arquetipos/cyberpunk/', '/arquetipos')).toBe(true);
  });

  it('não acende um link parecido', () => {
    expect(ehPaginaAtual('/arquetipos/', '/cenarios')).toBe(false);
    // O prefixo é de caminho, não de texto: /gerador não acende em
    // /guia-de-personagens/, e /elementos não acende num hipotético
    // /elementos-comuns/.
    expect(ehPaginaAtual('/guia-de-personagens/', '/gerador')).toBe(false);
    expect(ehPaginaAtual('/elementos-comuns/', '/elementos')).toBe(false);
  });

  it('funciona com o site publicado numa subpasta', () => {
    expect(ehPaginaAtual('/projetopolaris/estilos/', '/projetopolaris/estilos')).toBe(true);
    expect(ehPaginaAtual('/projetopolaris/estilos/', '/projetopolaris/sobre')).toBe(false);
  });

  it('acende em tudo se receber a raiz — por isso a marca POLARIS não a usa', () => {
    expect(ehPaginaAtual('/cenarios/', '/')).toBe(true);
  });
});
