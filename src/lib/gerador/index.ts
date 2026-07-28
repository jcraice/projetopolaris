// Ponto único de entrada para quem consome o gerador de fora da pasta —
// hoje só src/pages/gerador.astro, mas evita que o consumidor precise saber
// em qual arquivo interno cada peça mora (sorteio.ts, redacao.ts, moldes.ts).
export { poolsFiltrados, sortear } from './sorteio';
export { contrair, emMinuscula, generoDe, numeroDe, redigir } from './redacao';
export { MOLDES } from './moldes';
export { COMPLICACOES } from './complicacoes';
export type { Familia, Opcoes, Peca, PecaCenario, Pools, Sorteio, Travas } from './tipos';
