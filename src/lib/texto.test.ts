import { describe, expect, it } from 'vitest';
import { paraAncora } from './texto';

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
