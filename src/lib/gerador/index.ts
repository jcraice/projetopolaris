// Ponto único de entrada para quem consome o gerador de fora da pasta —
// hoje gerador.astro (a premissa) e ficha.astro (a ficha), mas evita que o
// consumidor precise saber em qual arquivo interno cada peça mora.
//
// `escolher` e `sortearComplicacao` ficam de fora de propósito: são peças
// internas, compartilhadas entre sorteio.ts e ficha.ts, e ninguém fora da pasta
// deve sortear por conta própria.
export { poolsFiltrados, sortear } from './sorteio';
export { redigirFicha, sortearFicha } from './ficha';
export { contrair, emMinuscula, generoDe, numeroDe, redigir } from './redacao';
export { MOLDES } from './moldes';
export { COMPLICACOES } from './complicacoes';
export { montarPrompt, nomearMundos, nomearMundosDe } from './prompt';
export type {
  Familia, Opcoes, Peca, PecaCenario, Pools, Sorteio, SorteioFicha, Travas, TravasFicha,
} from './tipos';
export type { ValoresDoPrompt } from './prompt';
