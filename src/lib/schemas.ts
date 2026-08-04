import { z } from 'astro/zod';

const cor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'cor deve ser hexadecimal de 6 dígitos');

/* As três aberturas são os parágrafos que abrem as páginas de catálogo daquele
   mundo — um por tipo, porque cada um fala do que está na lista abaixo dele.
   Todas opcionais: `comuns` só tem arquétipos, e nada impede um mundo de entrar
   no acervo antes de a autora escrever os três.

   `.strict()` porque os nomes são parecidos: sem ele um `aberturaCenários` com
   acento seria descartado em silêncio pelo Zod, e a página abriria sem parágrafo
   sem que build ou teste reclamassem — o mesmo motivo de esquemaPagina. */
export const esquemaSubgenero = z
  .object({
    nome: z.string().min(1),
    ordem: z.number().int().nonnegative(),
    mundo: z.boolean().default(true),
    aurora: z.tuple([cor, cor, cor]).optional(),
    citacao: z.string().optional(),
    citacaoAutor: z.string().optional(),
    aberturaArquetipos: z.string().optional(),
    aberturaCenarios: z.string().optional(),
    aberturaElementos: z.string().optional(),
  })
  .strict()
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
   e aberturaArquetipos. `.strict()` porque um `z.object` comum descarta chave
   desconhecida em silêncio: sem isso, um `subtitlo:` digitado errado em
   `home.md` sumiria sem erro nenhum em vez de estourar o build. */
export const esquemaPagina = z
  .object({
    titulo: z.string().min(1),
    ordem: z.number().int().nonnegative().default(0),
    subtitulo: z.string().optional(),
    chamadaGerador: z.string().optional(),
    citacao: z.string().optional(),
  })
  .strict();
