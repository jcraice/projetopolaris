export type Familia = { nome: string; complicacoes: string[] };

/* O artigo definido do arquétipo, guardado à parte do nome. Os nomes do acervo
   são limpos ("Megacorporação", "IA Aliada") porque é assim que aparecem no
   catálogo, mas a frase do gerador precisa do artigo — e o artigo é também o
   que diz o gênero, para o {pronome} sair "ela" ou "ele". */
export type Artigo = 'a' | 'o';

export type Peca = { id: string; nome: string; subgenero: string };
export type PecaArquetipo = Peca & { artigo: Artigo };
export type PecaCenario = Peca & { singular: string };

export type Sorteio = {
  arquetipo: PecaArquetipo;
  cenario: PecaCenario;
  elemento: Peca;
  complicacao: string;
  familia: string;
};

export type Pools = {
  arquetipos: PecaArquetipo[];
  cenarios: PecaCenario[];
  elementos: Peca[];
};

export type Travas = { arquetipo: boolean; cenario: boolean; elemento: boolean };

export type Opcoes = {
  subgenero: string | null;
  misturarMundos: boolean;
  incluirComuns: boolean;
};
