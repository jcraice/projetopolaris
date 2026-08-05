import { describe, expect, it } from 'vitest';
import { montarPrompt, nomearMundos } from './prompt';
import type { Opcoes, Sorteio } from './tipos';

const NOMES = {
  'space-opera': 'Space Opera',
  distopia: 'Distopia',
  cyberpunk: 'Cyberpunk',
};

// Só os subgêneros importam para nomearMundos; o resto do sorteio é preenchido
// com valores plausíveis para o objeto ser do tipo certo.
const sorteioCom = (arquetipo: string, cenario: string, elemento: string): Sorteio => ({
  arquetipo: { id: 'a', nome: 'Hacker/Console Cowboy', artigo: 'o', subgenero: arquetipo },
  cenario: { id: 'c', nome: 'Megacidades superpovoadas', subgenero: cenario, singular: 'uma megacidade superpovoada' },
  elemento: { id: 'e', nome: 'Vigilância onipresente', subgenero: elemento },
  complicacao: 'alguém do mesmo lado já negociou a rendição de todos',
  familia: 'Traição e confiança',
});

const opcoesCom = (subgenero: string | null, misturarMundos: boolean): Opcoes => ({
  subgenero,
  misturarMundos,
  incluirComuns: false,
});

describe('nomearMundos', () => {
  it('sem misturar, devolve o nome do mundo escolhido no seletor', () => {
    const sorteio = sorteioCom('distopia', 'distopia', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', false), NOMES)).toBe('Distopia');
  });

  it('sem misturar, devolve o próprio identificador quando o nome é desconhecido', () => {
    const sorteio = sorteioCom('mundo-novo', 'mundo-novo', 'mundo-novo');
    expect(nomearMundos(sorteio, opcoesCom('mundo-novo', false), NOMES)).toBe('mundo-novo');
  });

  it('misturando, não repete o nome quando as três peças são do mesmo mundo', () => {
    const sorteio = sorteioCom('cyberpunk', 'cyberpunk', 'cyberpunk');
    expect(nomearMundos(sorteio, opcoesCom('cyberpunk', true), NOMES)).toBe('Cyberpunk');
  });

  it('misturando, junta dois mundos na ordem arquétipo, cenário, elemento', () => {
    const sorteio = sorteioCom('distopia', 'cyberpunk', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', true), NOMES)).toBe('Distopia + Cyberpunk');
  });

  it('misturando, junta os três quando as peças vêm de mundos diferentes', () => {
    const sorteio = sorteioCom('space-opera', 'distopia', 'cyberpunk');
    expect(nomearMundos(sorteio, opcoesCom('space-opera', true), NOMES)).toBe(
      'Space Opera + Distopia + Cyberpunk',
    );
  });

  it('misturando, ignora o pool comuns, que não é um mundo', () => {
    const sorteio = sorteioCom('comuns', 'distopia', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', true), NOMES)).toBe('Distopia');
  });

  it('misturando, cai no próprio identificador quando o nome é desconhecido', () => {
    const sorteio = sorteioCom('distopia', 'mundo-novo', 'distopia');
    expect(nomearMundos(sorteio, opcoesCom('distopia', true), NOMES)).toBe('Distopia + mundo-novo');
  });
});

describe('montarPrompt', () => {
  const valores = {
    mundo: 'Cyberpunk',
    arquetipo: 'Hacker/Console Cowboy',
    cenario: 'Megacidades superpovoadas',
    elemento: 'Vigilância onipresente',
  };

  it('troca os quatro marcadores pelos valores do sorteio', () => {
    const modelo = 'Mundo: [MUNDO]\nPersonagem: [ARQUÉTIPO]\nLugar: [CENÁRIO]\nMotor: [ELEMENTO NARRATIVO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'Mundo: Cyberpunk\nPersonagem: Hacker/Console Cowboy\nLugar: Megacidades superpovoadas\nMotor: Vigilância onipresente',
    );
  });

  it('troca todas as ocorrências do mesmo marcador', () => {
    const modelo = '[MUNDO] e de novo [MUNDO], com [ARQUÉTIPO], [CENÁRIO] e [ELEMENTO NARRATIVO]';
    expect(montarPrompt(modelo, valores)).toBe(
      'Cyberpunk e de novo Cyberpunk, com Hacker/Console Cowboy, Megacidades superpovoadas e Vigilância onipresente',
    );
  });

  // O caso real que motivou a checagem: ARQUETIPO sem acento não é o marcador
  // que a função conhece, e sem erro o prompt chegaria na IA com ele cru.
  it('lança quando sobra um marcador em maiúsculas que ela não conhece', () => {
    const modelo = '[MUNDO] [ARQUETIPO] [CENÁRIO] [ELEMENTO NARRATIVO]';
    expect(() => montarPrompt(modelo, valores)).toThrow(/ARQUETIPO/);
  });

  it('deixa passar colchetes em minúsculas, que são texto e não marcador', () => {
    const modelo = '[MUNDO] [ARQUÉTIPO] [CENÁRIO] [ELEMENTO NARRATIVO] [ver nota]';
    expect(montarPrompt(modelo, valores)).toContain('[ver nota]');
  });
});
