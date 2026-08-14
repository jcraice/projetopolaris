/* Sem `id` como as peças vindas de src/content/: profissão não é entrada de
   coleção, não tem rota e não entra na busca.

   A `descricao` não aparece no sorteio — ela é o corpo do guia em
   /guia-de-personagens/, e mora aqui junto do nome porque os dois descrevem a
   mesma peça. Separá-los em dois arquivos os faria divergir na primeira edição. */
export type Profissao = { nome: string; subgenero: string; descricao: string };

export type Peca = { id: string; nome: string; subgenero: string };
export type PecaCenario = Peca & { singular: string };

export type Sorteio = {
  personagemA: { profissao: Profissao; caracteristica: string };
  personagemB: { profissao: Profissao; personalidade: string };
  local: PecaCenario;
  fato: string;
};

/* Só as duas peças que vêm de fora entram aqui. Características, personalidades
   e fatos são universais e a lib os importa direto, como fazia com as
   complicações — não há o que filtrar por mundo neles. */
export type Pools = {
  profissoes: Profissao[];
  locais: PecaCenario[];
};

export type Travas = { personagemA: boolean; personagemB: boolean; local: boolean };

/* `incluirComuns` saiu junto com os arquétipos: a caixa existia para somar ao
   sorteio os 10 arquétipos comuns, e sem arquétipos no gerador não há o que
   incluir. O pool `comuns` continua intacto no acervo e em /arquetipos/comuns/. */
export type Opcoes = {
  subgenero: string | null;
  misturarMundos: boolean;
};
