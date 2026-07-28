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

export type Pools = {
  arquetipos: Peca[];
  cenarios: PecaCenario[];
  elementos: Peca[];
};

export type Travas = { arquetipo: boolean; cenario: boolean; elemento: boolean };

export type Opcoes = {
  subgenero: string | null;
  misturarMundos: boolean;
  incluirComuns: boolean;
};
