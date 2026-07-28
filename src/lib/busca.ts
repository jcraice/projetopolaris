import { semAcento } from './texto';

export type ItemIndice = { titulo: string; tipo: string; subgenero: string; url: string };

function normalizar(texto: string): string {
  return semAcento(texto).toLowerCase().trim();
}

export function buscar(indice: ItemIndice[], consulta: string): ItemIndice[] {
  const alvo = normalizar(consulta);
  if (!alvo) return [];

  return indice
    .map((item) => ({ item, posicao: normalizar(item.titulo).indexOf(alvo) }))
    .filter(({ posicao }) => posicao >= 0)
    .sort((a, b) => a.posicao - b.posicao || a.item.titulo.localeCompare(b.item.titulo, 'pt-BR'))
    .map(({ item }) => item);
}
