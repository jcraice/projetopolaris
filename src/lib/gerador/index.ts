// Ponto único de entrada para quem consome o gerador de fora da pasta —
// hoje só src/pages/gerador.astro, mas evita que o consumidor precise saber
// em qual arquivo interno cada peça mora (sorteio.ts, redacao.ts, moldes.ts).
export { poolsFiltrados, sortear } from './sorteio';
export { contrair, redigir } from './redacao';
export { MOLDE } from './moldes';
export { PROFISSOES } from './profissoes';
export { CARACTERISTICAS } from './caracteristicas';
export { PERSONALIDADES } from './personalidades';
export { FATOS } from './fatos';
export { montarPrompt, nomearMundos } from './prompt';
export type { Opcoes, Peca, PecaCenario, Pools, Profissao, Sorteio, Travas } from './tipos';
export type { ValoresDoPrompt } from './prompt';
