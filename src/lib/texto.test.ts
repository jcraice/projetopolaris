import { describe, expect, it } from 'vitest';
import { contagem, numeracao, paraAncora, resumir } from './texto';

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

describe('numeracao', () => {
  it('põe zero à esquerda até dois dígitos', () => {
    expect(numeracao(1, 11)).toBe('01 / 11');
    expect(numeracao(11, 11)).toBe('11 / 11');
  });

  it('não corta número de três dígitos', () => {
    expect(numeracao(7, 100)).toBe('07 / 100');
  });
});

describe('contagem', () => {
  it('usa o singular só para um', () => {
    expect(contagem(1, 'arquétipo', 'arquétipos')).toBe('1 arquétipo');
    expect(contagem(11, 'arquétipo', 'arquétipos')).toBe('11 arquétipos');
    expect(contagem(0, 'cenário', 'cenários')).toBe('0 cenários');
  });
});

describe('resumir', () => {
  it('devolve o texto inteiro quando ele cabe', () => {
    expect(resumir('Um ponto de partida.', 160)).toBe('Um ponto de partida.');
  });

  it('corta na última palavra inteira e fecha com reticências', () => {
    expect(resumir('Arquétipos são sementes do enredo', 20)).toBe('Arquétipos são…');
  });

  it('tira a marcação de Markdown e junta as linhas', () => {
    expect(resumir('Um *ponto de partida*\npara o [Gerador](/gerador/).', 160)).toBe(
      'Um ponto de partida para o Gerador.',
    );
  });

  it('não deixa vírgula nem espaço antes das reticências', () => {
    expect(resumir('Cenários, arquétipos e elementos', 11)).toBe('Cenários…');
  });
});
