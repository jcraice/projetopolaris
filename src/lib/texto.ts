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

// Busca um parágrafo já existente pelo início, em vez de repetir prosa autoral
// como string solta em algum componente — usado pela home para reaproveitar
// trechos do texto de Sobre (src/content/paginas/sobre.md) sem duplicá-los.
export function paragrafoComPrefixo(corpo: string, prefixo: string): string | undefined {
  const paragrafos = corpo.trim().split(/\r?\n\s*\r?\n/);
  return paragrafos.map((p) => p.trim()).find((p) => p.startsWith(prefixo));
}
