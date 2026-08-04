import { describe, expect, it } from 'vitest';
import { redigirFicha, sortearFicha } from './ficha';
import type { Opcoes, Pools, SorteioFicha, TravasFicha } from './tipos';

const pools: Pools = {
  arquetipos: [
    { id: 'a1', nome: 'O Hacker', subgenero: 'cyberpunk' },
    { id: 'a2', nome: 'A Samurai de Rua', subgenero: 'cyberpunk' },
    { id: 'a3', nome: 'O Agente Corporativo', subgenero: 'cyberpunk' },
    { id: 'a4', nome: 'O Capitão Estratégico', subgenero: 'space-opera' },
    { id: 'a5', nome: 'A Mentora', subgenero: 'comuns' },
  ],
  cenarios: [
    { id: 'c1', nome: 'Megacidades', subgenero: 'cyberpunk', singular: 'uma megacidade' },
    { id: 'c2', nome: 'Laboratórios Secretos', subgenero: 'cyberpunk', singular: 'um laboratório secreto' },
    { id: 'c3', nome: 'Ruínas Antigas', subgenero: 'space-opera', singular: 'uma ruína antiga' },
  ],
  elementos: [{ id: 'e1', nome: 'Vigilância onipresente', subgenero: 'cyberpunk' }],
};

const SEM_TRAVA: TravasFicha = { personagemA: false, personagemB: false, cenario: false };
const base: Opcoes = { subgenero: 'cyberpunk', misturarMundos: false, incluirComuns: false };
const zero = () => 0;

// Sequência de sorteios determinística: cada chamada devolve o próximo valor da
// lista e volta ao começo no fim. É como se testa uma escolha que não é a
// primeira da lista sem depender de Math.random.
const sequencia = (valores: number[]) => {
  let i = 0;
  return () => valores[i++ % valores.length]!;
};

describe('sortearFicha', () => {
  it('respeita o mundo escolhido nas três peças do acervo', () => {
    const f = sortearFicha(pools, base, SEM_TRAVA, null, zero);
    expect(f.personagemA.subgenero).toBe('cyberpunk');
    expect(f.personagemB.subgenero).toBe('cyberpunk');
    expect(f.cenario.subgenero).toBe('cyberpunk');
  });

  // A regra que motivou este modo ter sorteio próprio: são dois personagens, e
  // dois personagens iguais não são dois personagens.
  it('nunca sorteia o mesmo personagem duas vezes', () => {
    for (let i = 0; i < 40; i++) {
      const f = sortearFicha(pools, base, SEM_TRAVA, null, () => i / 40);
      expect(f.personagemA.id).not.toBe(f.personagemB.id);
    }
  });

  it('lança quando o pool tem um só arquétipo, em vez de repetir o personagem', () => {
    const poolMagro: Pools = { ...pools, arquetipos: [pools.arquetipos[0]!] };
    expect(() => sortearFicha(poolMagro, base, SEM_TRAVA, null, zero)).toThrow(
      /dois personagens/,
    );
  });

  it('soma os comuns aos personagens quando pedido', () => {
    const opcoes = { ...base, incluirComuns: true };
    const vistos = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const f = sortearFicha(pools, opcoes, SEM_TRAVA, null, () => i / 60);
      vistos.add(f.personagemA.subgenero);
      vistos.add(f.personagemB.subgenero);
    }
    expect(vistos).toContain('comuns');
  });

  describe('travas', () => {
    const anterior: SorteioFicha = {
      personagemA: pools.arquetipos[0]!,
      personagemB: pools.arquetipos[1]!,
      cenario: pools.cenarios[0]!,
      complicacao: 'alguém do mesmo lado já negociou a rendição de todos',
      familia: 'Traição e confiança',
    };

    it('congela a peça travada e troca a solta', () => {
      const travas: TravasFicha = { personagemA: true, personagemB: false, cenario: true };
      const f = sortearFicha(pools, base, travas, anterior, zero);
      expect(f.personagemA.id).toBe('a1');
      expect(f.cenario.id).toBe('c1');
    });

    // O caso delicado: com A travado, B é sorteado de novo e poderia cair
    // justamente em A. O pool de B tem que excluir o A congelado, não o A que
    // teria sido sorteado.
    it('com A travado, B continua diferente de A', () => {
      const travas: TravasFicha = { personagemA: true, personagemB: false, cenario: false };
      for (let i = 0; i < 40; i++) {
        const f = sortearFicha(pools, base, travas, anterior, () => i / 40);
        expect(f.personagemA.id).toBe('a1');
        expect(f.personagemB.id).not.toBe('a1');
      }
    });

    it('com B travado, A continua diferente de B', () => {
      const travas: TravasFicha = { personagemA: false, personagemB: true, cenario: false };
      for (let i = 0; i < 40; i++) {
        const f = sortearFicha(pools, base, travas, anterior, () => i / 40);
        expect(f.personagemB.id).toBe('a2');
        expect(f.personagemA.id).not.toBe('a2');
      }
    });
  });

  it('não repete a complicação nem a família da rodada anterior', () => {
    let anterior = sortearFicha(pools, base, SEM_TRAVA, null, zero);
    for (let i = 0; i < 20; i++) {
      const proximo = sortearFicha(pools, base, SEM_TRAVA, anterior, sequencia([0.3, 0.7, 0.1]));
      expect(proximo.complicacao).not.toBe(anterior.complicacao);
      expect(proximo.familia).not.toBe(anterior.familia);
      anterior = proximo;
    }
  });
});

describe('redigirFicha', () => {
  const sorteio: SorteioFicha = {
    personagemA: { id: 'a1', nome: 'O Hacker', subgenero: 'cyberpunk' },
    personagemB: { id: 'a2', nome: 'A Samurai de Rua', subgenero: 'cyberpunk' },
    cenario: {
      id: 'c2', nome: 'Laboratórios Secretos', subgenero: 'cyberpunk',
      singular: 'um laboratório secreto',
    },
    complicacao: 'um personagem está de luto',
    familia: 'Perda e memória',
  };

  const modelo = [
    'Essa é uma ficção científica de [MUNDO].',
    '',
    '[PERSONAGEM A]',
    '[PERSONAGEM B]',
    '',
    'Tudo começa [LOCAL].',
    '',
    'Importante: [FATO].',
  ].join('\n');

  it('preenche as cinco lacunas do molde', () => {
    expect(redigirFicha(modelo, sorteio, 'Cyberpunk')).toBe(
      [
        'Essa é uma ficção científica de Cyberpunk.',
        '',
        'O Hacker',
        'A Samurai de Rua',
        '',
        'Tudo começa num laboratório secreto.',
        '',
        'Importante: um personagem está de luto.',
      ].join('\n'),
    );
  });

  // A contração é o motivo de o cenário guardar a forma singular com artigo:
  // "em" + "um" vira "num", e "em" + "uma" vira "numa".
  it('contrai a preposição com o artigo do cenário, nos dois gêneros', () => {
    const masculino = redigirFicha(modelo, sorteio, 'Cyberpunk');
    expect(masculino).toContain('Tudo começa num laboratório secreto.');

    const feminino = redigirFicha(
      modelo,
      { ...sorteio, cenario: { ...sorteio.cenario, singular: 'uma megacidade superpovoada' } },
      'Cyberpunk',
    );
    expect(feminino).toContain('Tudo começa numa megacidade superpovoada.');
  });

  it('mantém o nome do arquétipo com a maiúscula do acervo', () => {
    const ficha = redigirFicha(modelo, sorteio, 'Cyberpunk');
    expect(ficha).toContain('O Hacker');
    expect(ficha).toContain('A Samurai de Rua');
  });

  it('aceita o nome composto que sai de misturar mundos', () => {
    expect(redigirFicha(modelo, sorteio, 'Cyberpunk + Distopia')).toContain(
      'ficção científica de Cyberpunk + Distopia.',
    );
  });

  // Mesma proteção do prompt: um marcador escrito errado no ficha.md estoura o
  // build em vez de chegar na tela com "[PERSONAGEM C]" cru no meio.
  it('lança quando sobra um marcador desconhecido no molde', () => {
    expect(() => redigirFicha(`${modelo}\nE também [PERSONAGEM C].`, sorteio, 'Cyberpunk')).toThrow(
      /PERSONAGEM C/,
    );
  });
});
