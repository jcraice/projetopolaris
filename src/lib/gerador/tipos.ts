export type Familia = { nome: string; complicacoes: string[] };

export type Peca = { id: string; nome: string; subgenero: string };
export type PecaCenario = Peca & { singular: string };

export type Sorteio = {
  arquetipo: Peca;
  cenario: PecaCenario;
  elemento: Peca;
  complicacao: string;
  familia: string;
};

/* O segundo modo do gerador: em vez de uma frase corrida, uma ficha de quatro
   linhas com dois personagens. Não tem elemento narrativo, e tem um arquétipo a
   mais — por isso é um tipo próprio e não um Sorteio com campo opcional, que
   deixaria todo consumidor checando qual dos dois formatos recebeu.

   Personagem A e B são arquétipos, e nunca o mesmo. Ver
   docs/superpowers/plans/2026-08-04-ficha-minima.md. */
export type SorteioFicha = {
  personagemA: Peca;
  personagemB: Peca;
  cenario: PecaCenario;
  complicacao: string;
  familia: string;
};

export type Pools = {
  arquetipos: Peca[];
  cenarios: PecaCenario[];
  elementos: Peca[];
};

export type Travas = { arquetipo: boolean; cenario: boolean; elemento: boolean };

export type TravasFicha = { personagemA: boolean; personagemB: boolean; cenario: boolean };

export type Opcoes = {
  subgenero: string | null;
  misturarMundos: boolean;
  incluirComuns: boolean;
};
