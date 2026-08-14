import { describe, expect, it } from 'vitest';
import { contrair, redigir } from './redacao';
import { MOLDE } from './moldes';
import type { Sorteio } from './tipos';

const sorteio: Sorteio = {
  personagemA: {
    profissao: {
      nome: 'Xenobiólogo(a)', subgenero: 'invasao-alienigena',
      descricao: 'Cientistas encarregados de entender a anatomia dos invasores.',
    },
    caracteristica: 'é cego(a) de um olho',
  },
  personagemB: {
    profissao: {
      nome: 'Contrabandista', subgenero: 'space-opera',
      descricao: 'Mercadores que evitam bloqueios imperiais.',
    },
    personalidade: 'egocêntrico(a)',
  },
  local: {
    id: 'l1', nome: 'Laboratórios Secretos',
    subgenero: 'invasao-alienigena', singular: 'um laboratório secreto',
  },
  fato: 'um personagem está de luto',
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

  it('funde de + a em da', () => {
    expect(contrair('de', 'a busca por autenticidade')).toBe('da busca por autenticidade');
  });

  it('funde de + o em do', () => {
    expect(contrair('de', 'o medo invisível')).toBe('do medo invisível');
  });

  it('funde de + as em das', () => {
    expect(contrair('de', 'as ameaças cósmicas desconhecidas')).toBe('das ameaças cósmicas desconhecidas');
  });

  it('funde de + os em dos', () => {
    expect(contrair('de', 'os conflitos de identidade')).toBe('dos conflitos de identidade');
  });

  it('não funde de + um/uma — "de um"/"de uma" ficam por extenso', () => {
    expect(contrair('de', 'um abrigo subterrâneo')).toBe('de um abrigo subterrâneo');
    expect(contrair('de', 'uma ruína antiga')).toBe('de uma ruína antiga');
  });

  it('não funde de quando o elemento não começa com artigo', () => {
    expect(contrair('de', 'vigilância onipresente')).toBe('de vigilância onipresente');
  });
});

describe('redigir', () => {
  it('monta o bloco inteiro', () => {
    expect(redigir(sorteio, MOLDE, 'Invasão Alienígena')).toBe(
      'Essa é uma ficção científica de invasão alienígena.\n\n'
      + 'Um(a) Xenobiólogo(a) que é cego(a) de um olho.\n'
      + 'Um(a) Contrabandista que é egocêntrico(a).\n\n'
      + 'Tudo começa num laboratório secreto.\n\n'
      + 'Importante: um personagem está de luto.',
    );
  });

  it('escreve o mundo inteiro em minúscula', () => {
    const frase = redigir(sorteio, MOLDE, 'Space Opera');
    expect(frase).toContain('ficção científica de space opera.');
  });

  /* Com "Misturar mundos" a primeira linha recebe mais de um nome, já unido por
     nomearMundos — e a minúscula precisa alcançar os dois. */
  it('abaixa também o nome composto de mundos misturados', () => {
    const frase = redigir(sorteio, MOLDE, 'Space Opera + Invasão Alienígena');
    expect(frase).toContain('de space opera + invasão alienígena.');
  });

  /* O nome entra como está guardado — nada de mexer em maiúscula na redação. O
     mesmo texto aparece na carta e no guia, e um `toLowerCase` aqui estragaria
     as siglas ("Engenheiro(a) de IA" viraria "engenheiro(a) de ia"). */
  it('escreve o nome da profissão como está na lista', () => {
    const frase = redigir(sorteio, MOLDE, 'Distopia');
    expect(frase).toContain('\nUm(a) Xenobiólogo(a) que é cego(a) de um olho.');
    expect(frase).toContain('\nUm(a) Contrabandista que é egocêntrico(a).');
  });

  /* O "é" fica no molde só na linha da personalidade. Na de característica ele
     vem de dentro do texto, e é o que deixa "tem cicatrizes nas mãos" conviver
     com "é cego(a) de um olho" na mesma lista. */
  it('não põe "é" antes da característica', () => {
    const outro: Sorteio = {
      ...sorteio,
      personagemA: { ...sorteio.personagemA, caracteristica: 'tem cicatrizes nas mãos' },
    };
    const frase = redigir(outro, MOLDE, 'Distopia');
    expect(frase).toContain('Um(a) Xenobiólogo(a) que tem cicatrizes nas mãos.');
    expect(frase).not.toContain('que é tem cicatrizes');
  });

  it('contrai a preposição do local com "um"', () => {
    expect(redigir(sorteio, MOLDE, 'Distopia')).toContain('Tudo começa num laboratório secreto.');
  });

  it('contrai a preposição do local com "uma"', () => {
    const outro: Sorteio = {
      ...sorteio,
      local: { ...sorteio.local, singular: 'uma órbita baixa' },
    };
    expect(redigir(outro, MOLDE, 'Distopia')).toContain('Tudo começa numa órbita baixa.');
  });
});
