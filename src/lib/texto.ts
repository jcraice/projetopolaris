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
