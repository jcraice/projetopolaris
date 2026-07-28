import { getCollection } from 'astro:content';
import type { ItemIndice } from '../lib/busca';
import { paraAncora } from '../lib/texto';

export async function GET() {
  const base = import.meta.env.BASE_URL;
  const raiz = base.endsWith('/') ? base : `${base}/`;

  const [arquetipos, cenarios, elementos, livros] = await Promise.all([
    getCollection('arquetipos'),
    getCollection('cenarios'),
    getCollection('elementos'),
    getCollection('livros'),
  ]);

  const indice: ItemIndice[] = [
    ...arquetipos.map((a) => ({
      titulo: a.data.nome,
      tipo: 'arquetipo',
      subgenero: a.data.subgenero,
      url: `${raiz}arquetipos/${a.data.subgenero}/#${paraAncora(a.data.nome)}`,
    })),
    ...cenarios.map((c) => ({
      titulo: c.data.titulo,
      tipo: 'cenario',
      subgenero: c.data.subgenero,
      url: `${raiz}cenarios/${c.data.subgenero}/#${paraAncora(c.data.titulo)}`,
    })),
    ...elementos.map((e) => ({
      titulo: e.data.titulo,
      tipo: 'elemento',
      subgenero: e.data.subgenero,
      url: `${raiz}elementos/${e.data.subgenero}/#${paraAncora(e.data.titulo)}`,
    })),
    ...livros.map((l) => ({
      titulo: l.data.titulo,
      tipo: 'livro',
      subgenero: l.data.subgenero,
      url: `${raiz}livros/${l.data.subgenero}/#${paraAncora(l.data.titulo)}`,
    })),
  ];

  return new Response(JSON.stringify(indice), {
    headers: { 'Content-Type': 'application/json' },
  });
}
