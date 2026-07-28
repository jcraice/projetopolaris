import { describe, expect, it } from 'vitest';
import { buscar, type ItemIndice } from './busca';

const indice: ItemIndice[] = [
  { titulo: 'A Transumana', tipo: 'arquetipo', subgenero: 'cyberpunk', url: '/a' },
  { titulo: 'Ruínas Antigas', tipo: 'cenario', subgenero: 'space-opera', url: '/b' },
  { titulo: 'Vigilância onipresente', tipo: 'elemento', subgenero: 'distopia', url: '/c' },
];

describe('buscar', () => {
  it('ignora acentuação na consulta e no acervo', () => {
    expect(buscar(indice, 'ruinas')[0].titulo).toBe('Ruínas Antigas');
    expect(buscar(indice, 'vigilância')[0].titulo).toBe('Vigilância onipresente');
  });

  it('ignora caixa', () => {
    expect(buscar(indice, 'TRANSUMANA')).toHaveLength(1);
  });

  it('devolve vazio para consulta em branco', () => {
    expect(buscar(indice, '   ')).toEqual([]);
  });

  it('prioriza quem começa com a consulta', () => {
    const comAmbos: ItemIndice[] = [
      { titulo: 'Uma cidade em ruínas', tipo: 'cenario', subgenero: 'x', url: '/1' },
      { titulo: 'Ruínas tecnológicas', tipo: 'cenario', subgenero: 'x', url: '/2' },
    ];
    expect(buscar(comAmbos, 'ruinas')[0].url).toBe('/2');
  });
});
