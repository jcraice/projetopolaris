import type { Sorteio } from './tipos';

const CONTRACOES: Record<string, Record<string, string>> = {
  em: { um: 'num', uma: 'numa', o: 'no', a: 'na', os: 'nos', as: 'nas' },
  a: {},
};

export function contrair(preposicao: 'em' | 'a', sintagma: string): string {
  const [artigo, ...resto] = sintagma.split(' ');
  const fundido = CONTRACOES[preposicao][artigo];
  return fundido ? `${fundido} ${resto.join(' ')}` : `${preposicao} ${sintagma}`;
}

export function generoDe(nome: string): 'f' | 'm' {
  return nome.startsWith('A ') ? 'f' : 'm';
}

export function emMinuscula(nome: string): string {
  return nome.charAt(0).toLowerCase() + nome.slice(1);
}

export function redigir(sorteio: Sorteio, molde: string): string {
  const { arquetipo, cenario, elemento, complicacao } = sorteio;

  const frase = molde
    .replaceAll('{em:cenario}', contrair('em', cenario.singular))
    .replaceAll('{a:cenario}', contrair('a', cenario.singular))
    .replaceAll('{cenario}', cenario.singular)
    .replaceAll('{elemento}', emMinuscula(elemento.nome))
    .replaceAll('{arquetipo}', emMinuscula(arquetipo.nome))
    .replaceAll('{pronome}', generoDe(arquetipo.nome) === 'f' ? 'ela' : 'ele')
    .replaceAll('{complicacao}', complicacao);

  return frase.charAt(0).toUpperCase() + frase.slice(1);
}
