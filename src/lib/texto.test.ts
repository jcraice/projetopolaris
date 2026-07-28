import { describe, expect, it } from 'vitest';
import { paraAncora, paragrafoComPrefixo } from './texto';

describe('paraAncora', () => {
  it('remove acentos e junta com hífen', () => {
    expect(paraAncora('A Transumana')).toBe('a-transumana');
    expect(paraAncora('O Fixer/Corretor')).toBe('o-fixer-corretor');
    expect(paraAncora('Pós Apocalíptico')).toBe('pos-apocaliptico');
  });

  it('não deixa hífen sobrando nas pontas', () => {
    expect(paraAncora('  O Hacker  ')).toBe('o-hacker');
  });
});

describe('paragrafoComPrefixo', () => {
  const corpo = 'Primeiro parágrafo.\n\nSegundo parágrafo começa assim.\n\nTerceiro.';

  it('encontra o parágrafo que começa com o prefixo', () => {
    expect(paragrafoComPrefixo(corpo, 'Segundo')).toBe('Segundo parágrafo começa assim.');
  });

  it('retorna undefined quando nenhum parágrafo casa', () => {
    expect(paragrafoComPrefixo(corpo, 'Quarto')).toBeUndefined();
  });

  it('aceita quebras de linha \\r\\n (arquivos salvos no Windows)', () => {
    const corpoWindows = 'Primeiro.\r\n\r\nSegundo começa assim.\r\n\r\nTerceiro.';
    expect(paragrafoComPrefixo(corpoWindows, 'Segundo')).toBe('Segundo começa assim.');
  });
});
