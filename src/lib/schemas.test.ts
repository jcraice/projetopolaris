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

  it('aceita aberturaArquetipos, mas ele é opcional', () => {
    const comAbertura = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
      aberturaArquetipos: 'Nesse subgênero, os arquétipos vivem entre conspirações e aprimoramentos.',
    });
    expect(comAbertura.success).toBe(true);

    const semAbertura = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(semAbertura.success).toBe(true);
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
