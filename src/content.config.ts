import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  esquemaArquetipo, esquemaCenario, esquemaElemento,
  esquemaLivro, esquemaPagina, esquemaSubgenero,
} from './lib/schemas';

type EsquemaPorPasta = {
  subgeneros: typeof esquemaSubgenero;
  arquetipos: typeof esquemaArquetipo;
  cenarios: typeof esquemaCenario;
  elementos: typeof esquemaElemento;
  livros: typeof esquemaLivro;
  paginas: typeof esquemaPagina;
};

const colecao = <Pasta extends keyof EsquemaPorPasta>(pasta: Pasta, schema: EsquemaPorPasta[Pasta]) =>
  defineCollection({ loader: glob({ pattern: '**/*.md', base: `./src/content/${pasta}` }), schema });

export const collections = {
  subgeneros: colecao('subgeneros', esquemaSubgenero),
  arquetipos: colecao('arquetipos', esquemaArquetipo),
  cenarios: colecao('cenarios', esquemaCenario),
  elementos: colecao('elementos', esquemaElemento),
  livros: colecao('livros', esquemaLivro),
  paginas: colecao('paginas', esquemaPagina),
};
