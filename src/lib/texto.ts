export function semAcento(texto: string): string {
  // NFKD separa a letra do seu acento; a propriedade Unicode Diacritic remove os
  // acentos soltos. Usar a propriedade, e não uma faixa de caracteres literais,
  // evita que um editor recomponha os acentos e quebre a expressão em silêncio.
  return texto.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
}

export function paraAncora(nome: string): string {
  return semAcento(nome)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "01 / 11": a posição do verbete na lista da página, não o campo `ordem`
 *  — os dois coincidem hoje, mas o que a pessoa vê é a lista. */
export function numeracao(posicao: number, total: number): string {
  return `${String(posicao).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

/** "11 arquétipos", "1 cenário". Só o português do acervo, sem Intl. */
export function contagem(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/* O resumo de uma página para a busca e para a prévia de link compartilhado —
   o <meta name="description">. Sai sempre do texto da autora, então chega aqui
   com Markdown: a marcação sai, as quebras de linha viram espaço, e o corte
   cai na última palavra inteira antes do limite. O Google mostra por volta de
   160 caracteres; o que passa disso ele mesmo corta, no meio de uma palavra. */
export function resumir(texto: string, limite = 160): string {
  const limpo = texto
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite - 1);
  const ultimoEspaco = corte.lastIndexOf(' ');
  return `${corte.slice(0, ultimoEspaco > 0 ? ultimoEspaco : corte.length).replace(/[\s,;:.—-]+$/, '')}…`;
}
