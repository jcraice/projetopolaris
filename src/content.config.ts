import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  esquemaArquetipo, esquemaCenario, esquemaElemento,
  esquemaLivro, esquemaPagina, esquemaSubgenero,
} from './lib/schemas';

const colecao = (pasta: string, schema: any) =>
  defineCollection({ loader: glob({ pattern: '**/*.md', base: `./src/content/${pasta}` }), schema });

export const collections = {
  subgeneros: colecao('subgeneros', esquemaSubgenero),
  arquetipos: colecao('arquetipos', esquemaArquetipo),
  cenarios: colecao('cenarios', esquemaCenario),
  elementos: colecao('elementos', esquemaElemento),
  livros: colecao('livros', esquemaLivro),
  paginas: colecao('paginas', esquemaPagina),
};
