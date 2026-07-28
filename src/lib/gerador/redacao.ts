import type { Sorteio } from './tipos';

const CONTRACOES: Record<string, Record<string, string>> = {
  em: { um: 'num', uma: 'numa', o: 'no', a: 'na', os: 'nos', as: 'nas' },
  a: {},
};

export function contrair(preposicao: 'em' | 'a', sintagma: string): string {
  const [artigo, ...resto] = sintagma.split(' ');
  const fundido = CONTRACOES[preposicao][artigo];
  return fundido ? `${fundido} ${resto.join(' ')}` : `${preposicao} ${sintagma}`;
}

export function generoDe(nome: string): 'f' | 'm' {
  return nome.startsWith('A ') ? 'f' : 'm';
}

export function emMinuscula(nome: string): string {
  return nome.charAt(0).toLowerCase() + nome.slice(1);
}

// Artigos que abrem o nome de um elemento no acervo (ex.: "A busca por
// autenticidade", "O medo invisível"). Precisam ser pulados antes de olhar
// o núcleo — senão "A" seria lido como núcleo singular por acidente, e "As"
// daria plural pelo motivo errado (o artigo, não o substantivo).
const ARTIGOS = new Set(['a', 'o', 'as', 'os', 'um', 'uma']);

// Substantivos cujo singular termina em "s" e por isso pareceriam plurais
// pela regra de sufixo abaixo. Nenhum aparece hoje como núcleo de elemento
// no acervo real (verificado contra os 120 elementos), mas a lista fica
// aqui como guarda-corpo caso um título futuro comece por uma destas
// palavras — mesmo espírito de NUCLEOS_FEMININOS em singular.py.
const NUCLEOS_SINGULARES_TERMINADOS_EM_S = new Set(['lápis', 'vírus', 'ônibus', 'atlas', 'tênis', 'país']);

// Preposições que marcam o início de um complemento. Usadas para decidir se
// um "e" encontrado no título liga dois núcleos do sujeito (sujeito
// composto, plural: "Propaganda e desinformação") ou se está dentro do
// complemento de um único núcleo já fechado por uma preposição antes dele
// ("Formação de novas leis e códigos morais" — o "de" vem antes do "e", e a
// coordenação fica presa ao complemento, não ao sujeito).
//
// Lista original tinha um buraco: "entre" não estava presente, e por isso
// "Conflito entre destino e livre-arbítrio" e "Conflito entre segurança e
// liberdade" (o "e" ali liga as duas metades do complemento de "entre", não
// dois núcleos do sujeito) saíam classificados como compostos por engano.
// "sob", "sobre", "até", "ante", "após", "contra", "desde" e "perante" não
// tinham nenhuma instância errada no acervo atual, mas compartilham a mesma
// lacuna estrutural e entraram por precaução, para não repetir o mesmo erro
// assim que um título futuro as usar antes de um "e".
const PREPOSICOES = new Set([
  'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na',
  'por', 'para', 'com', 'sem',
  'a', 'ao', 'à',
  'entre', 'sob', 'sobre', 'até', 'ante', 'após', 'contra', 'desde', 'perante',
]);

// Exceções à regra de sujeito composto — e só a essa regra, não à regra de
// sufixo. Existem porque a regra "'e' antes de preposição ⇒ plural" não
// distingue duas situações que têm a mesma superfície:
//
//   substantivo E substantivo → sujeito composto, plural
//     ("Propaganda e desinformação" → imperam)
//   adjetivo E adjetivo (do mesmo substantivo único) → sujeito continua
//   singular ("Corrupção governamental e corporativa" — uma corrupção só,
//     que é ao mesmo tempo governamental e corporativa → impera)
//
// Não existe regra de superfície que separe as duas sem saber a classe
// gramatical de cada palavra (substantivo vs. adjetivo) — três tentativas
// foram descartadas por quebrar em algum título real do acervo: "o 'e' logo
// depois do núcleo" quebra em "Realidade virtual e espaços digitais" (é
// composto de verdade, mas o 'e' também vem logo depois de um adjetivo);
// "concordância de gênero e número dos dois lados do 'e'" quebra em
// "Propaganda e desinformação" (concorda — feminino singular dos dois lados
// — e ainda assim é composto); "olhar a palavra depois do 'e'" exigiria
// saber que é substantivo ou adjetivo, que é exatamente o que falta.
//
// Por isso: exceção nomeada, não regra. Esta lista é só para coordenação de
// adjetivos — não é depósito geral de "títulos difíceis". Um título que
// caia aqui por outro motivo (não for dois adjetivos coordenados por "e"
// descrevendo um único núcleo) está no lugar errado.
const EXCECOES_COORDENACAO_DE_ADJETIVOS = new Set([
  'corrupção governamental e corporativa',
  'economia centralizada e controlada',
]);

function limpar(palavra: string): string {
  return palavra.toLowerCase().replace(/[.,;:!?"'）)]+$/, '');
}

export function numeroDe(nome: string): 'singular' | 'plural' {
  const chaveCompleta = nome.trim().toLowerCase().replace(/\s+/g, ' ');
  if (EXCECOES_COORDENACAO_DE_ADJETIVOS.has(chaveCompleta)) return 'singular';

  const palavras = nome.trim().split(/\s+/);
  const inicio = ARTIGOS.has((palavras[0] ?? '').toLowerCase()) ? 1 : 0;

  for (let i = inicio; i < palavras.length; i++) {
    const palavra = limpar(palavras[i] ?? '');
    if (PREPOSICOES.has(palavra)) break;
    if (palavra === 'e') return 'plural';
  }

  const nucleo = limpar(palavras[inicio] ?? '');
  if (NUCLEOS_SINGULARES_TERMINADOS_EM_S.has(nucleo)) return 'singular';
  return nucleo.endsWith('s') ? 'plural' : 'singular';
}

export function redigir(sorteio: Sorteio, molde: string): string {
  const { arquetipo, cenario, elemento, complicacao } = sorteio;

  const frase = molde
    .replaceAll('{em:cenario}', contrair('em', cenario.singular))
    .replaceAll('{a:cenario}', contrair('a', cenario.singular))
    .replaceAll('{cenario}', cenario.singular)
    .replaceAll('{impera:elemento}', `${numeroDe(elemento.nome) === 'plural' ? 'imperam' : 'impera'} ${emMinuscula(elemento.nome)}`)
    .replaceAll('{ser:elemento}', numeroDe(elemento.nome) === 'plural' ? 'são' : 'é')
    .replaceAll('{elemento}', emMinuscula(elemento.nome))
    .replaceAll('{arquetipo}', emMinuscula(arquetipo.nome))
    .replaceAll('{pronome}', generoDe(arquetipo.nome) === 'f' ? 'ela' : 'ele')
    .replaceAll('{complicacao}', complicacao);

  return frase.charAt(0).toUpperCase() + frase.slice(1);
}
