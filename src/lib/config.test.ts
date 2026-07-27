import { describe, expect, it } from 'vitest';
import { resolverBase } from './config';

describe('resolverBase', () => {
  it('usa o subdiretório do repositório em um site de projeto', () => {
    expect(resolverBase('julia/polaris')).toEqual({
      site: 'https://julia.github.io',
      base: '/polaris',
    });
  });

  it('usa a raiz quando o repositório é o site do usuário', () => {
    expect(resolverBase('julia/julia.github.io')).toEqual({
      site: 'https://julia.github.io',
      base: '/',
    });
  });

  it('cai no servidor local fora do GitHub Actions', () => {
    expect(resolverBase(undefined)).toEqual({
      site: 'http://localhost:4321',
      base: '/',
    });
  });
});
