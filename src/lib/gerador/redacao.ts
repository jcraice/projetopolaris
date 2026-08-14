import type { Sorteio } from './tipos';

const CONTRACOES: Record<string, Record<string, string>> = {
  em: { um: 'num', uma: 'numa', o: 'no', a: 'na', os: 'nos', as: 'nas' },
  a: {},
  // Só os artigos definidos contraem com "de" (de+a=da, de+o=do, de+as=das,
  // de+os=dos). Indefinidos ("um"/"uma") ficam de fora de propósito: "de um"/
  // "de uma" são a forma padrão escrita — "dum"/"duma" existem, mas são
  // informais e não é o registro do site.
  de: { o: 'do', a: 'da', os: 'dos', as: 'das' },
};

export function contrair(preposicao: 'em' | 'a' | 'de', sintagma: string): string {
  const [artigo, ...resto] = sintagma.split(' ');
  const fundido = CONTRACOES[preposicao][artigo];
  return fundido ? `${fundido} ${resto.join(' ')}` : `${preposicao} ${sintagma}`;
}

/* `mundo` chega pronto de nomearMundos() — pode ser um nome ("Space Opera") ou
   vários unidos por " + " quando "Misturar mundos" está ligado. A minúscula é
   aplicada aqui, e não lá, porque o prompt de IA usa o mesmo valor e quer o
   nome como está escrito na coleção.

   O nome da profissão entra como está na lista, sem tocar em maiúscula: ele já
   nasce com a inicial certa, e é o mesmo texto que o guia e a carta mostram. */
export function redigir(sorteio: Sorteio, molde: string, mundo: string): string {
  const { personagemA, personagemB, local, fato } = sorteio;

  return molde
    .replaceAll('{mundo}', mundo.toLocaleLowerCase('pt-BR'))
    .replaceAll('{profissaoA}', personagemA.profissao.nome)
    .replaceAll('{caracteristica}', personagemA.caracteristica)
    .replaceAll('{profissaoB}', personagemB.profissao.nome)
    .replaceAll('{personalidade}', personagemB.personalidade)
    .replaceAll('{em:local}', contrair('em', local.singular))
    .replaceAll('{fato}', fato);
}
