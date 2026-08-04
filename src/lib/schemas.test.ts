import { describe, expect, it } from 'vitest';
import { esquemaArquetipo, esquemaCenario, esquemaSubgenero } from './schemas';

describe('esquemaSubgenero', () => {
  it('exige aurora quando é um mundo', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3, mundo: true });
    expect(r.success).toBe(false);
  });

  it('dispensa aurora quando não é um mundo', () => {
    const r = esquemaSubgenero.safeParse({
      nome: '20 Arquétipos Comuns', ordem: 7, mundo: false,
    });
    expect(r.success).toBe(true);
  });

  it('assume mundo verdadeiro por padrão', () => {
    const r = esquemaSubgenero.parse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(r.mundo).toBe(true);
  });

  it('recusa quando mundo e aurora são omitidos', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3 });
    expect(r.success).toBe(false);
  });

  // Uma abertura por tipo de página, e todas opcionais: `comuns` só tem
  // arquétipos, e um mundo pode entrar no acervo antes de a autora escrever
  // os três parágrafos.
  it('aceita as três aberturas, e cada uma é opcional', () => {
    const comAberturas = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
      aberturaArquetipos: 'Nesse subgênero, os arquétipos vivem entre conspirações e aprimoramentos.',
      aberturaCenarios: 'Nesse subgênero, os cenários empilham neon sobre ruína.',
      aberturaElementos: 'Nesse subgênero, os elementos narrativos tratam de quem controla o dado.',
    });
    expect(comAberturas.success).toBe(true);

    const semAbertura = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(semAbertura.success).toBe(true);
  });

  /* O esquema é `.strict()` desde que passou a ter três aberturas de nome
     parecido: sem isso um `aberturaCenários` com acento — que não é o nome do
     campo — seria descartado em silêncio, e a página abriria sem parágrafo
     nenhum sem que build ou teste reclamassem. */
  it('recusa campo desconhecido em vez de descartá-lo calado', () => {
    const r = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
      aberturaCenários: 'Com acento, que não é o nome do campo.',
    });
    expect(r.success).toBe(false);
  });
});

describe('esquemaArquetipo', () => {
  it('aceita uma ficha completa', () => {
    const r = esquemaArquetipo.parse({ nome: 'A Transumana', subgenero: 'cyberpunk', ordem: 14 });
    expect(r.felino).toBe(false);
  });

  it('recusa ficha sem subgênero', () => {
    expect(esquemaArquetipo.safeParse({ nome: 'A Transumana', ordem: 14 }).success).toBe(false);
  });

  it('exige que o nome comece com artigo definido', () => {
    const r = esquemaArquetipo.safeParse({ nome: 'Transumana', subgenero: 'cyberpunk', ordem: 14 });
    expect(r.success).toBe(false);
  });
});

describe('esquemaCenario', () => {
  it('exige a forma singular com artigo indefinido', () => {
    const bom = esquemaCenario.safeParse({
      titulo: 'Ruínas Antigas', singular: 'uma ruína antiga', subgenero: 'space-opera', ordem: 4,
    });
    expect(bom.success).toBe(true);

    const ruim = esquemaCenario.safeParse({
      titulo: 'Ruínas Antigas', singular: 'ruína antiga', subgenero: 'space-opera', ordem: 4,
    });
    expect(ruim.success).toBe(false);
  });
});
