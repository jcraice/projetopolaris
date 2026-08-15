import { TRAVA_DO_MARCADOR } from './moldes';
import type { Sorteio, Travas } from './tipos';

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

/* Um pedaço de linha da premissa. `sorteado` é o que a página pinta de
   --destaque: é a diferença entre o que a máquina trouxe e o texto fixo do
   molde. */
export type Trecho = { texto: string; sorteado: boolean };

/* Uma linha da premissa, com a trava que o cadeado do fim dela aciona. `trava`
   é null na linha do mundo, a única sem cadeado, e nas linhas em branco. */
export type Linha = { trechos: Trecho[]; trava: keyof Travas | null };

/* O valor de cada marcador do molde.

   `mundo` chega pronto de nomearMundos() — pode ser um nome ("Space Opera") ou
   vários unidos por " + " quando "Misturar mundos" está ligado. A minúscula é
   aplicada aqui, e não lá, porque o prompt de IA usa o mesmo valor e quer o
   nome como está escrito na coleção.

   O nome da profissão entra como está na lista, sem tocar em maiúscula: ele já
   nasce com a inicial certa, e é o mesmo texto que o guia mostra. */
const VALOR: Record<string, (sorteio: Sorteio, mundo: string) => string> = {
  '{mundo}': (_, mundo) => mundo.toLocaleLowerCase('pt-BR'),
  '{profissaoA}': (s) => s.personagemA.profissao.nome,
  '{caracteristica}': (s) => s.personagemA.caracteristica,
  '{profissaoB}': (s) => s.personagemB.profissao.nome,
  '{personalidade}': (s) => s.personagemB.personalidade,
  '{em:local}': (s) => contrair('em', s.local.singular),
  '{fato}': (s) => s.fato,
};

// Captura o delimitador junto para o split devolver texto e marcador alternados.
const MARCADOR = /(\{[^}]+\})/;

/* A premissa dividida em linhas e trechos, para a página saber onde cada peça
   começa e termina — sem isso não há como pintar de amarelo só o que foi
   sorteado, nem pôr o cadeado na linha certa.

   As linhas em branco do molde entram como linhas de trechos vazios, e não são
   descartadas: é o que faz a premissa copiada ter as mesmas quebras que a da
   tela. */
export function partes(sorteio: Sorteio, molde: string, mundo: string): Linha[] {
  return molde.split('\n').map((linha) => {
    const trechos: Trecho[] = [];
    let trava: keyof Travas | null = null;

    for (const pedaco of linha.split(MARCADOR)) {
      if (!pedaco) continue;

      if (!MARCADOR.test(pedaco)) {
        trechos.push({ texto: pedaco, sorteado: false });
        continue;
      }

      const valor = VALOR[pedaco];
      /* Falhar alto em vez de imprimir "{profissaoC}" na cara de quem está
         usando: o molde é constante e dados.test.ts tranca os marcadores dele,
         então chegar aqui significa que alguém editou um sem editar o outro. */
      if (!valor) throw new Error(`marcador desconhecido no molde: ${pedaco}`);

      trechos.push({ texto: valor(sorteio, mundo), sorteado: true });
      trava = TRAVA_DO_MARCADOR[pedaco] ?? trava;
    }

    return { trechos, trava };
  });
}

/* A premissa como texto corrido — o que "Copiar premissa" leva para a área de
   transferência. Junção de partes(), e não uma segunda passada de substituição,
   para o texto da tela e o texto copiado não terem como divergir. */
export function redigir(sorteio: Sorteio, molde: string, mundo: string): string {
  return partes(sorteio, molde, mundo)
    .map((linha) => linha.trechos.map((trecho) => trecho.texto).join(''))
    .join('\n');
}
