import { describe, expect, it } from 'vitest';
import { contrair, emMinuscula, generoDe, numeroDe, redigir } from './redacao';
import type { Sorteio } from './tipos';

const sorteio: Sorteio = {
  arquetipo: { id: 'a', nome: 'A Colecionadora de Artefatos', subgenero: 'space-opera' },
  cenario: { id: 'c', nome: 'Ruínas Antigas', subgenero: 'space-opera', singular: 'uma ruína antiga' },
  elemento: { id: 'e', nome: 'Busca por artefatos ancestrais', subgenero: 'space-opera' },
  complicacao: 'a cura existe, e é fabricada com a própria doença',
  familia: 'O preço do poder',
};

describe('contrair', () => {
  it('funde em + uma em numa', () => {
    expect(contrair('em', 'uma ruína antiga')).toBe('numa ruína antiga');
  });

  it('funde em + um em num', () => {
    expect(contrair('em', 'um abrigo subterrâneo')).toBe('num abrigo subterrâneo');
  });

  it('não funde a + uma', () => {
    expect(contrair('a', 'uma ruína antiga')).toBe('a uma ruína antiga');
  });
});

describe('generoDe', () => {
  it('deduz o gênero do artigo inicial', () => {
    expect(generoDe('A Transumana')).toBe('f');
    expect(generoDe('O Capitão Estratégico')).toBe('m');
  });
});

describe('emMinuscula', () => {
  it('abaixa só o artigo, preservando o nome', () => {
    expect(emMinuscula('A Colecionadora de Artefatos')).toBe('a Colecionadora de Artefatos');
    expect(emMinuscula('O Hacker')).toBe('o Hacker');
  });
});

describe('numeroDe', () => {
  it('reconhece núcleo singular sem artigo', () => {
    expect(numeroDe('Vigilância onipresente')).toBe('singular');
  });

  it('reconhece núcleo plural sem artigo', () => {
    expect(numeroDe('Comunidades de sobreviventes')).toBe('plural');
  });

  it('pula o artigo inicial antes de olhar o núcleo — singular', () => {
    expect(numeroDe('A busca por autenticidade')).toBe('singular');
    expect(numeroDe('O medo invisível')).toBe('singular');
  });

  it('pula o artigo inicial antes de olhar o núcleo — plural', () => {
    expect(numeroDe('As ameaças cósmicas desconhecidas')).toBe('plural');
    expect(numeroDe('Os conflitos de identidade')).toBe('plural');
  });

  it('não confunde o artigo "A"/"O" com o núcleo', () => {
    // Sem pular o artigo, "A" seria lido como núcleo e sairia singular por
    // acidente (e "As" sairia plural pelo motivo errado, não pelo núcleo).
    expect(numeroDe('A busca por autenticidade')).toBe(numeroDe('Busca por autenticidade'));
    expect(numeroDe('As ameaças cósmicas desconhecidas')).toBe(numeroDe('Ameaças cósmicas desconhecidas'));
  });
});

describe('redigir', () => {
  it('monta a frase com contração e artigo em minúscula', () => {
    const frase = redigir(sorteio, '{em:cenario}, sob {elemento}, {arquetipo} descobre que {complicacao}.');
    expect(frase).toBe(
      'Numa ruína antiga, sob busca por artefatos ancestrais, ' +
        'a Colecionadora de Artefatos descobre que a cura existe, e é fabricada com a própria doença.',
    );
  });

  it('conjuga "impera" no singular quando o elemento é singular', () => {
    const frase = redigir(sorteio, '{em:cenario}, onde {impera:elemento}, {arquetipo} descobre que {complicacao}.');
    expect(frase).toContain('onde impera busca por artefatos ancestrais');
  });

  it('conjuga "impera" no plural quando o elemento é plural', () => {
    const plural = { ...sorteio, elemento: { id: 'e2', nome: 'Comunidades de sobreviventes', subgenero: 'pos-apocaliptico' } };
    const frase = redigir(plural, '{em:cenario}, onde {impera:elemento}, {arquetipo} descobre que {complicacao}.');
    expect(frase).toContain('onde imperam comunidades de sobreviventes');
  });

  it('resolve o pronome pelo gênero do arquétipo', () => {
    const frase = redigir(sorteio, '{arquetipo} some {em:cenario} com {elemento} até {pronome} ver que {complicacao}.');
    expect(frase).toContain('até ela ver que');
  });

  it('usa ele quando o arquétipo é masculino', () => {
    const masculino = { ...sorteio, arquetipo: { id: 'b', nome: 'O Hacker', subgenero: 'cyberpunk' } };
    const frase = redigir(masculino, '{arquetipo} some {em:cenario} com {elemento} até {pronome} ver que {complicacao}.');
    expect(frase).toContain('até ele ver que');
  });

  it('capitaliza somente a primeira letra da frase', () => {
    const frase = redigir(sorteio, '{em:cenario}, sob {elemento}, {arquetipo} descobre que {complicacao}.');
    expect(frase[0]).toBe('N');
    expect(frase).toContain(', a Colecionadora');
  });

  it('não deixa marcador por resolver', () => {
    for (const molde of [
      '{em:cenario} {elemento} {arquetipo} {complicacao} {pronome} {a:cenario} {impera:elemento}.',
    ]) {
      expect(redigir(sorteio, molde)).not.toMatch(/\{|\}/);
    }
  });
});
