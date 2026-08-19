import { describe, expect, it } from 'vitest';
import { esquemaArquetipo, esquemaCenario, esquemaElemento, esquemaSubgenero } from './schemas';

describe('esquemaSubgenero', () => {
  it('exige aurora quando é um mundo', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3, mundo: true });
    expect(r.success).toBe(false);
  });

  it('dispensa aurora quando não é um mundo', () => {
    const r = esquemaSubgenero.safeParse({
      nome: '10 Arquétipos Comuns', ordem: 7, mundo: false,
    });
    expect(r.success).toBe(true);
  });

  it('assume mundo verdadeiro por padrão', () => {
    const r = esquemaSubgenero.parse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(r.mundo).toBe(true);
  });

  it('recusa quando mundo e aurora são omitidos', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3 });
    expect(r.success).toBe(false);
  });

  // Uma abertura por tipo de página, e todas opcionais: `comuns` só tem
  // arquétipos, e um mundo pode entrar no acervo antes de a autora escrever
  // os três parágrafos.
  it('aceita as três aberturas, e cada uma é opcional', () => {
    const comAberturas = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
      aberturaArquetipos: 'Nesse subgênero, os arquétipos vivem entre conspirações e aprimoramentos.',
      aberturaCenarios: 'Nesse subgênero, os cenários empilham neon sobre ruína.',
      aberturaElementos: 'Nesse subgênero, os elementos narrativos tratam de quem controla o dado.',
    });
    expect(comAberturas.success).toBe(true);

    const semAbertura = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(semAbertura.success).toBe(true);
  });

  /* O esquema é `.strict()` desde que passou a ter três aberturas de nome
     parecido: sem isso um `aberturaCenários` com acento — que não é o nome do
     campo — seria descartado em silêncio, e a página abriria sem parágrafo
     nenhum sem que build ou teste reclamassem. */
  it('recusa campo desconhecido em vez de descartá-lo calado', () => {
    const r = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
      aberturaCenários: 'Com acento, que não é o nome do campo.',
    });
    expect(r.success).toBe(false);
  });
});

describe('esquemaArquetipo', () => {
  it('aceita uma ficha completa', () => {
    const r = esquemaArquetipo.parse({
      nome: 'Humano Aumentado', artigo: 'o', subgenero: 'cyberpunk', ordem: 4,
    });
    expect(r.felino).toBe(false);
  });

  it('recusa ficha sem subgênero', () => {
    expect(esquemaArquetipo.safeParse({ nome: 'Humano Aumentado', artigo: 'o', ordem: 4 }).success).toBe(false);
  });

  /* Sem padrão de propósito: o artigo é o que o gerador usa para montar
     "a IA Emergente" e para escolher entre "ela" e "ele". Um padrão faria
     todo arquétipo novo nascer masculino sem ninguém perceber. */
  it('exige o artigo, sem cair num padrão', () => {
    const r = esquemaArquetipo.safeParse({ nome: 'IA Emergente', subgenero: 'cyberpunk', ordem: 2 });
    expect(r.success).toBe(false);
  });

  it('só aceita "a" ou "o" como artigo', () => {
    const r = esquemaArquetipo.safeParse({
      nome: 'IA Emergente', artigo: 'A', subgenero: 'cyberpunk', ordem: 2,
    });
    expect(r.success).toBe(false);
  });

  const base = { nome: 'Observador Espacial', artigo: 'o', subgenero: 'space-opera', ordem: 11 };

  it('aceita ficha sem ilustração — é o caso dos outros 75 arquétipos', () => {
    expect(esquemaArquetipo.safeParse(base).success).toBe(true);
  });

  it('aceita ilustração acompanhada do texto alternativo', () => {
    const r = esquemaArquetipo.safeParse({
      ...base, ilustracao: 'observador-espacial', ilustracaoAlt: 'Gato preto sentado.',
    });
    expect(r.success).toBe(true);
  });

  /* Imagem sem descrição é verbete que some para quem usa leitor de tela.
     O esquema recusa em vez de deixar a página sair com alt vazio. */
  it('recusa ilustração sem texto alternativo', () => {
    const r = esquemaArquetipo.safeParse({ ...base, ilustracao: 'observador-espacial' });
    expect(r.success).toBe(false);
  });

  it('deixa passar texto alternativo sozinho, que não renderiza nada', () => {
    const r = esquemaArquetipo.safeParse({ ...base, ilustracaoAlt: 'Gato preto sentado.' });
    expect(r.success).toBe(true);
  });
});

/* A regra de ilustração é uma peça só, compartilhada pelos três esquemas do
   acervo. Este teste existe para o dia em que alguém acrescentar um quarto e
   esquecer de encaixá-la — ou tirar o `.refine` de um deles sem perceber. */
describe('ilustração nas três coleções do acervo', () => {
  const fichas = {
    arquetipo: [esquemaArquetipo, { nome: 'X', artigo: 'o', subgenero: 'space-opera', ordem: 1 }],
    cenario: [esquemaCenario, { titulo: 'X', singular: 'uma x', subgenero: 'space-opera', ordem: 1 }],
    elemento: [esquemaElemento, { titulo: 'X', subgenero: 'space-opera', ordem: 1 }],
  } as const;

  for (const [tipo, [esquema, base]] of Object.entries(fichas)) {
    it(`${tipo}: aceita ilustração com texto alternativo`, () => {
      const r = esquema.safeParse({ ...base, ilustracao: 'x', ilustracaoAlt: 'Um desenho.' });
      expect(r.success).toBe(true);
    });

    it(`${tipo}: recusa ilustração sem texto alternativo`, () => {
      expect(esquema.safeParse({ ...base, ilustracao: 'x' }).success).toBe(false);
    });
  }
});

describe('esquemaCenario', () => {
  it('exige a forma singular com artigo indefinido', () => {
    const bom = esquemaCenario.safeParse({
      titulo: 'Ruínas Antigas', singular: 'uma ruína antiga', subgenero: 'space-opera', ordem: 4,
    });
    expect(bom.success).toBe(true);

    const ruim = esquemaCenario.safeParse({
      titulo: 'Ruínas Antigas', singular: 'ruína antiga', subgenero: 'space-opera', ordem: 4,
    });
    expect(ruim.success).toBe(false);
  });
});
