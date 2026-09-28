/* Posição de cada subgênero no mapa da home. A ordem do acervo gira em volta
   da Polaris no sentido do relógio, a partir do alto, alternando dois raios
   para que vizinhos não se atropelem. Subgênero novo entra no mapa sem
   ninguém desenhar nada: a função só precisa da quantidade. */
export interface Estrela {
  x: number;
  y: number;
  rotuloX: number;
  rotuloY: number;
  ancora: 'start' | 'middle' | 'end';
}

export const LARGURA_MAPA = 440;
export const ALTURA_MAPA = 300;
export const CENTRO = { x: 220, y: 150 };
const RAIOS = [85, 125] as const;
const FOLGA = 8;

export function posicoesDoMapa(quantidade: number): Estrela[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const angulo = (i / quantidade) * 2 * Math.PI;
    const raio = RAIOS[i % 2];
    const x = CENTRO.x + raio * Math.sin(angulo);
    const y = CENTRO.y - raio * Math.cos(angulo);
    // O nome vai para o lado de fora da estrela, longe da Polaris; as do eixo
    // vertical ficam com o nome centrado, acima ou abaixo.
    if (x > CENTRO.x + 10) return { x, y, rotuloX: x + FOLGA, rotuloY: y + 3, ancora: 'start' };
    if (x < CENTRO.x - 10) return { x, y, rotuloX: x - FOLGA, rotuloY: y + 3, ancora: 'end' };
    return { x, y, rotuloX: x, rotuloY: y < CENTRO.y ? y - FOLGA - 2 : y + FOLGA + 8, ancora: 'middle' };
  });
}
