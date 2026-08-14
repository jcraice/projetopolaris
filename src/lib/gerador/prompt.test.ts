import { describe, expect, it } from 'vitest';
import { montarPrompt, nomearMundos } from './prompt';
import type { Opcoes, Sorteio } from './tipos';

const nomes = {
  'space-opera': 'Space Opera',
  distopia: 'Distopia',
  cyberpunk: 'Cyberpunk',
};

const sorteio: Sorteio = {
  personagemA: {
    profissao: {
      nome: 'Contrabandista', subgenero: 'space-opera',
      descricao: 'Mercadores que evitam bloqueios imperiais.',
    },
    caracteristica: 'é cego(a) de um olho',
  },
  personagemB: {
    profissao: {
      nome: 'Reescritor(a) Histórico(a)', subgenero: 'distopia',
      descricao: 'Funcionários que alteram documentos para apagar a verdade.',
    },
    personalidade: 'egocêntrico(a)',
  },
  local: { id: 'l1', nome: 'Ruínas Antigas', subgenero: 'cyberpunk', singular: 'uma ruína antiga' },
  fato: 'um personagem está de luto',
};

const base: Opcoes = { subgenero: 'space-opera', misturarMundos: false };

describe('nomearMundos', () => {
  it('sem misturar, devolve o mundo do seletor', () => {
    expect(nomearMundos(sorteio, base, nomes)).toBe('Space Opera');
  });

  it('misturando, devolve os mundos usados na ordem A, B, local', () => {
    expect(nomearMundos(sorteio, { ...base, misturarMundos: true }, nomes))
      .toBe('Space Opera + Distopia + Cyberpunk');
  });

  it('misturando, não repete um mundo usado por mais de uma peça', () => {
    const mesmo: Sorteio = {
      ...sorteio,
      personagemB: {
        profissao: {
          nome: 'Navegador(a)', subgenero: 'space-opera',
          descricao: 'Calculam saltos hiperespaciais sem bater em supernovas.',
        },
        personalidade: 'teimoso(a)',
      },
      local: { ...sorteio.local, subgenero: 'space-opera' },
    };
    expect(nomearMundos(mesmo, { ...base, misturarMundos: true }, nomes)).toBe('Space Opera');
  });
});

describe('montarPrompt', () => {
  const valores = {
    mundo: 'Space Opera',
    personagemA: 'Um(a) Contrabandista que é cego(a) de um olho',
    personagemB: 'Um(a) Reescritor(a) Histórico(a) que é egocêntrico(a)',
    local: 'Ruínas Antigas',
    fato: 'um personagem está de luto',
  };

  it('troca os cinco marcadores', () => {
    const modelo = 'M: [MUNDO] A: [PERSONAGEM A] B: [PERSONAGEM B] L: [LOCAL] F: [FATO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'M: Space Opera A: Um(a) Contrabandista que é cego(a) de um olho'
      + ' B: Um(a) Reescritor(a) Histórico(a) que é egocêntrico(a)'
      + ' L: Ruínas Antigas F: um personagem está de luto',
    );
  });

  /* O caso real que justifica a regra: um marcador escrito errado no
     prompt-ia.md quebra `npm run build`, e não chega em produção com o
     colchete cru no meio do texto que vai para a IA. */
  it('lança em marcador desconhecido', () => {
    expect(() => montarPrompt('[PERSONAGEM C]', valores)).toThrow(/marcador desconhecido/i);
  });

  it('deixa passar colchetes em minúscula, que não são marcadores', () => {
    expect(montarPrompt('texto [ver nota] fim', valores)).toBe('texto [ver nota] fim');
  });
});
