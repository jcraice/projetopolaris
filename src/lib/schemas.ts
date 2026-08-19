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

/* O nome vem sem artigo ("IA Emergente", "Duplo do Protagonista") porque é assim que ele
   aparece no catálogo, e o artigo mora num campo próprio. Já foi embutido no
   nome, obrigado por regex a começar com "A " ou "O " — mudou porque a autora
   reescreveu o acervo com nomes limpos.

   O campo é obrigatório e não tem padrão de propósito: o gerador tira dele o
   artigo da frase e o gênero do pronome ("até ela descobrir que"), e um padrão
   silencioso faria todo arquétipo novo nascer masculino sem ninguém notar. */
/* Ilustração de verbete, igual nas três coleções do acervo — arquétipos,
   cenários e elementos. Uma peça só porque a regra é a mesma nas três, e três
   cópias divergiriam na primeira mudança.

   `ilustracao` é o nome-base do desenho em src/assets/ilustracoes/, sem sufixo
   e sem extensão: "observador-espacial" acha o par -tema-claro.png e
   -tema-escuro.png. Um nome para dois arquivos porque as duas versões são o
   mesmo desenho — quem escolhe entre elas é o tema, não o frontmatter. Nome que
   não bata com arquivo nenhum estoura o build, em vez de abrir a página com um
   buraco no lugar da imagem.

   Os dois campos andam juntos: imagem sem descrição é verbete que some para
   quem usa leitor de tela, e o alternativo é texto da autora, como o corpo do
   verbete. Por isso os três esquemas terminam em `.refine` em vez de serem
   objetos simples — e é também por isso que nenhum deles pode ser `.strict()`
   sem que o refine venha depois. */
const camposIlustracao = {
  ilustracao: z.string().min(1).optional(),
  ilustracaoAlt: z.string().min(1).optional(),
};

const exigeTextoAlternativo = (v: { ilustracao?: string; ilustracaoAlt?: string }) =>
  !v.ilustracao || Boolean(v.ilustracaoAlt);

const ERRO_SEM_ALTERNATIVO = {
  message: 'ilustracao exige ilustracaoAlt',
  path: ['ilustracaoAlt'],
};

export const esquemaArquetipo = z.object({
  nome: z.string().min(1),
  artigo: z.enum(['a', 'o']),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
  felino: z.boolean().default(false),
  ...camposIlustracao,
}).refine(exigeTextoAlternativo, ERRO_SEM_ALTERNATIVO);

export const esquemaCenario = z.object({
  titulo: z.string().min(1),
  singular: z.string().regex(/^(um|uma) ./, 'singular deve começar com "um " ou "uma "'),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
  ...camposIlustracao,
}).refine(exigeTextoAlternativo, ERRO_SEM_ALTERNATIVO);

export const esquemaElemento = z.object({
  titulo: z.string().min(1),
  subgenero: z.string().min(1),
  ordem: z.number().int().nonnegative(),
  ...camposIlustracao,
}).refine(exigeTextoAlternativo, ERRO_SEM_ALTERNATIVO);

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
