import { z } from 'astro/zod';

const cor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'cor deve ser hexadecimal de 6 dígitos');

export const esquemaSubgenero = z
  .object({
    nome: z.string().min(1),
    ordem: z.number().int().nonnegative(),
    mundo: z.boolean().default(true),
    aurora: z.tuple([cor, cor, cor]).optional(),
    citacao: z.string().optional(),
    citacaoAutor: z.string().optional(),
    aberturaArquetipos: z.string().optional(),
  })
  .refine((d) => !d.mundo || d.aurora !== undefined, {
    message: 'subgênero com mundo verdadeiro precisa de aurora',
    path: ['aurora'],
  });

export const esquemaArquetipo = z.object({
  nome: z.string().regex(/^[AO] ./, 'nome deve começar com o artigo "A " ou "O "'),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
  felino: z.boolean().default(false),
});

export const esquemaCenario = z.object({
  titulo: z.string().min(1),
  singular: z.string().regex(/^(um|uma) ./, 'singular deve começar com "um " ou "uma "'),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
});

export const esquemaElemento = z.object({
  titulo: z.string().min(1),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
});

export const esquemaLivro = z.object({
  titulo: z.string().min(1),
  autor: z.string().min(1),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
});

/* Os três campos opcionais servem só à home hoje: são frases soltas que a página
   encaixa em lugares diferentes da estrutura — subtítulo abaixo do título,
   chamada dentro do card do gerador, citação no fim — e por isso não cabem no
   corpo corrido do Markdown. Mesma solução que esquemaSubgenero usa para citacao
   e aberturaArquetipos. */
export const esquemaPagina = z.object({
  titulo: z.string().min(1),
  ordem: z.number().int().nonnegative().default(0),
  subtitulo: z.string().optional(),
  chamadaGerador: z.string().optional(),
  citacao: z.string().optional(),
});
