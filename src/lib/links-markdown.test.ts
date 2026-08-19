import { describe, expect, it } from 'vitest';
import { absolutizar, reescreverLinksInternos } from './links-markdown';

describe('absolutizar', () => {
  it('prefixa a base num caminho interno', () => {
    expect(absolutizar('/gerador/', '/projetopolaris/')).toBe('/projetopolaris/gerador/');
  });

  it('não duplica barra quando a base é a raiz', () => {
    expect(absolutizar('/gerador/', '/')).toBe('/gerador/');
  });

  it('deixa o mailto em paz', () => {
    const href = 'mailto:projetopolaris84@gmail.com';
    expect(absolutizar(href, '/projetopolaris/')).toBe(href);
  });

  it('deixa link externo em paz, com protocolo ou sem', () => {
    expect(absolutizar('https://exemplo.com/x', '/p/')).toBe('https://exemplo.com/x');
    expect(absolutizar('//exemplo.com/x', '/p/')).toBe('//exemplo.com/x');
  });

  it('deixa âncora e caminho relativo em paz', () => {
    expect(absolutizar('#topo', '/p/')).toBe('#topo');
    expect(absolutizar('../gerador/', '/p/')).toBe('../gerador/');
  });
});

describe('reescreverLinksInternos', () => {
  /* O processador de verdade só entrega <a> ao visitante e é ele quem grava a
     propriedade. Aqui o dublê registra as gravações para o teste conferir. */
  function rodar(base: string, href: unknown) {
    const gravados: Array<[string, unknown]> = [];
    const plugin = reescreverLinksInternos(base);
    const visitante = plugin.element as { visit: (no: unknown, ctx: unknown) => void };
    visitante.visit(
      { type: 'element', tagName: 'a', properties: { href }, children: [] },
      { setProperty: (_no: unknown, chave: string, valor: unknown) => gravados.push([chave, valor]) },
    );
    return gravados;
  }

  it('só pede o filtro das âncoras', () => {
    const plugin = reescreverLinksInternos('/p/');
    expect((plugin.element as { filter: string[] }).filter).toEqual(['a']);
  });

  it('grava o href com a base na frente', () => {
    expect(rodar('/projetopolaris/', '/gerador/')).toEqual([['href', '/projetopolaris/gerador/']]);
  });

  it('aceita base sem barra no fim', () => {
    expect(rodar('/projetopolaris', '/gerador/')).toEqual([['href', '/projetopolaris/gerador/']]);
  });

  it('regrava o mailto igual ao que era', () => {
    expect(rodar('/projetopolaris/', 'mailto:a@b.c')).toEqual([['href', 'mailto:a@b.c']]);
  });

  it('não grava nada em âncora sem href', () => {
    expect(rodar('/projetopolaris/', undefined)).toEqual([]);
  });
});
