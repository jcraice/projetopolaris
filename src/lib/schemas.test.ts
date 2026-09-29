import { describe, expect, it } from 'vitest';
import { esquemaArquetipo, esquemaCenario, esquemaElemento, esquemaPagina, esquemaSubgenero } from './schemas';

describe('esquemaSubgenero', () => {
  it('aceita subgênero completo sem campo de cor', () => {
    const r = esquemaSubgenero.safeParse({ nome: 'Cyberpunk', ordem: 3, completo: true });
    expect(r.success).toBe(true);
  });

  it('aceita o pool que não é subgênero completo', () => {
    const r = esquemaSubgenero.safeParse({
      nome: '10 Arquétipos Comuns', ordem: 11, completo: false,
    });
    expect(r.success).toBe(true);
  });

  it('assume completo verdadeiro por padrão', () => {
    const r = esquemaSubgenero.parse({
      nome: 'Cyberpunk', ordem: 3,
    });
    expect(r.completo).toBe(true);
  });

  /* A aurora saiu na Carta Estelar. Com o esquema .strict(), um arquivo que
     ainda traga o campo quebra o build em vez de carregar cor que ninguém lê. */
  it('recusa o campo aurora, que saiu do site', () => {
    const r = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3, aurora: ['#ff2d92', '#7c3aed', '#00e5ff'],
    });
    expect(r.success).toBe(false);
  });

  // Uma abertura por tipo de página, e todas opcionais: `comuns` só tem
  // arquétipos, e um subgênero pode entrar no acervo antes de a autora escrever
  // os três parágrafos.
  it('aceita as três aberturas, e cada uma é opcional', () => {
    const comAberturas = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3,
      aberturaArquetipos: 'Nesse subgênero, os arquétipos vivem entre conspirações e aprimoramentos.',
      aberturaCenarios: 'Nesse subgênero, os cenários empilham neon sobre ruína.',
      aberturaElementos: 'Nesse subgênero, os elementos narrativos tratam de quem controla o dado.',
    });
    expect(comAberturas.success).toBe(true);

    const semAbertura = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3,
    });
    expect(semAbertura.success).toBe(true);
  });

  /* O esquema é `.strict()` desde que passou a ter três aberturas de nome
     parecido: sem isso um `aberturaCenários` com acento — que não é o nome do
     campo — seria descartado em silêncio, e a página abriria sem parágrafo
     nenhum sem que build ou teste reclamassem. */
  it('recusa campo desconhecido em vez de descartá-lo calado', () => {
    const r = esquemaSubgenero.safeParse({
      nome: 'Cyberpunk', ordem: 3,
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

describe('esquemaPagina', () => {
  // O "Como usar" da home: cada passo tem um título curto e a frase da
  // autora. A página põe um ícone por posição, então a ordem importa.
  it('aceita os passos do Como usar', () => {
    const r = esquemaPagina.safeParse({
      titulo: 'Início',
      comoUsar: [{ titulo: 'Explore', texto: 'Explore os arquétipos.' }],
    });
    expect(r.success).toBe(true);
  });

  it('recusa passo sem texto', () => {
    const r = esquemaPagina.safeParse({
      titulo: 'Início',
      comoUsar: [{ titulo: 'Explore' }],
    });
    expect(r.success).toBe(false);
  });

  // A régua da página de estilos tem uma ponta de cada lado: nem mais, nem menos.
  it('recusa eixo de estilos com três polos', () => {
    const polo = { nome: 'Hard SF', texto: 'Foca na precisão científica.' };
    const r = esquemaPagina.safeParse({
      titulo: 'Estilos',
      eixo: { rotulo: 'Do rigor ao social', polos: [polo, polo, polo] },
    });
    expect(r.success).toBe(false);
  });

  // O destino da porta é caminho cru, e a página põe a base na frente:
  // endereço de fora ou caminho sem barra sairia quebrado em produção.
  it('recusa porta da Sobre com destino sem barra', () => {
    const r = esquemaPagina.safeParse({
      titulo: 'Sobre',
      portas: {
        rotulo: 'Por onde começar',
        itens: [{ rotulo: 'Se você escreve', titulo: 'Autores', texto: 'Sorteie.', destino: 'gerador/', destinoNome: 'Gerador' }],
      },
    });
    expect(r.success).toBe(false);
  });

  it('aceita combinação entre dois subgêneros', () => {
    const r = esquemaPagina.safeParse({
      titulo: 'Estilos',
      combinacoes: [{ a: 'cyberpunk', b: 'fc-militar', texto: 'Soldados com implantes alugados.' }],
    });
    expect(r.success).toBe(true);
  });
});
