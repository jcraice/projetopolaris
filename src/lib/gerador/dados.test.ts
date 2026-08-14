import { describe, expect, it } from 'vitest';
import { CARACTERISTICAS } from './caracteristicas';
import { FATOS } from './fatos';
import { PERSONALIDADES } from './personalidades';
import { PROFISSOES } from './profissoes';

const MUNDOS = [
  'cyberpunk', 'distopia', 'invasao-alienigena',
  'pos-apocaliptico', 'space-opera', 'viagem-no-tempo',
];

describe('PROFISSOES', () => {
  it('tem sessenta profissões, dez por mundo', () => {
    expect(PROFISSOES).toHaveLength(60);
    for (const mundo of MUNDOS) {
      expect(PROFISSOES.filter((p) => p.subgenero === mundo)).toHaveLength(10);
    }
  });

  it('não usa nenhum mundo fora dos seis', () => {
    for (const p of PROFISSOES) expect(MUNDOS).toContain(p.subgenero);
  });

  it('não tem profissão repetida', () => {
    expect(new Set(PROFISSOES.map((p) => p.nome)).size).toBe(60);
  });

  /* A descrição é o corpo do guia em /guia-de-personagens/. Uma vazia passaria
     no build e deixaria um verbete mudo na página, que é justamente o problema
     que o guia existe para resolver. */
  it('toda profissão tem descrição própria', () => {
    for (const p of PROFISSOES) expect(p.descricao.trim().length).toBeGreaterThan(0);
    expect(new Set(PROFISSOES.map((p) => p.descricao)).size).toBe(60);
  });

  /* Ao contrário das outras três listas, os nomes de profissão abrem com
     maiúscula (são arquétipos, como os verbetes do catálogo) e as descrições
     terminam em ponto (são frases inteiras, não peça de molde). */
  it('os nomes começam com maiúscula e não terminam em ponto', () => {
    for (const p of PROFISSOES) {
      expect(p.nome[0]).toBe(p.nome[0].toUpperCase());
      expect(p.nome.endsWith('.')).toBe(false);
    }
  });
});

describe('as três listas universais', () => {
  it('têm os tamanhos trancados', () => {
    expect(CARACTERISTICAS).toHaveLength(30);
    expect(PERSONALIDADES).toHaveLength(30);
    expect(FATOS).toHaveLength(40);
  });

  it('não têm entrada repetida', () => {
    expect(new Set(CARACTERISTICAS).size).toBe(30);
    expect(new Set(PERSONALIDADES).size).toBe(30);
    expect(new Set(FATOS).size).toBe(40);
  });
});

/* As três listas universais entram no meio de uma frase que o molde já começou
   ("Um(a) Hacker que ...", "Importante: ..."), então nenhuma abre com maiúscula
   e nenhuma fecha com ponto — quem fecha a linha é o molde, e uma entrada com
   ponto produziria "egocêntrico(a)..".

   As profissões são a exceção e têm regra própria acima: abrem com maiúscula
   porque são nomes de arquétipo, não trechos de frase. */
describe('a forma do texto das três listas universais', () => {
  const todas = [...CARACTERISTICAS, ...PERSONALIDADES, ...FATOS];

  it('nenhuma entrada termina em ponto', () => {
    for (const texto of todas) expect(texto.endsWith('.')).toBe(false);
  });

  it('toda entrada começa em minúscula', () => {
    for (const texto of todas) expect(texto[0]).toBe(texto[0].toLowerCase());
  });
});
