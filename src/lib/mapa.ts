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

/* As linhas da página de estilos: cada combinação liga duas estrelas do mapa
   por uma reta. As duas funções abaixo servem só a ela. */
export interface Ponto {
  x: number;
  y: number;
}

export type Linha = readonly [Ponto, Ponto];

/* Onde as linhas se cruzam, para a página marcar cada cruzamento com um ponto.
   Duas linhas que só partem da mesma estrela não se cruzam: o encontro fica
   nas pontas, e as pontas estão excluídas. */
export function cruzamentos(linhas: readonly Linha[]): Ponto[] {
  const pontos: Ponto[] = [];
  for (let i = 0; i < linhas.length; i++) {
    for (let j = i + 1; j < linhas.length; j++) {
      const [a, b] = linhas[i];
      const [p, q] = linhas[j];
      const d = (b.x - a.x) * (q.y - p.y) - (b.y - a.y) * (q.x - p.x);
      if (d === 0) continue;
      const t = ((p.x - a.x) * (q.y - p.y) - (p.y - a.y) * (q.x - p.x)) / d;
      const u = ((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)) / d;
      if (t > 0.02 && t < 0.98 && u > 0.02 && u < 0.98) {
        pontos.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
      }
    }
  }
  return pontos;
}

/* Onde vai o número de cada linha. Cada um procura, ao longo da própria reta,
   o ponto mais longe de tudo o que já está desenhado — estrelas, Polaris,
   cruzamentos — e dos números postos antes dele. Na primeira versão o número
   ficava no meio da linha, e dois deles caíam quase um em cima do outro. */
export function posicoesDosNumeros(linhas: readonly Linha[], ocupados: readonly Ponto[]): Ponto[] {
  const tomados = [...ocupados];
  return linhas.map(([p, q]) => {
    let melhor = p;
    let folga = -1;
    for (let passo = 6; passo <= 34; passo++) {
      const t = passo / 40;
      const ponto = { x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) };
      const d = Math.min(...tomados.map((o) => Math.hypot(o.x - ponto.x, o.y - ponto.y)));
      if (d > folga) {
        folga = d;
        melhor = ponto;
      }
    }
    tomados.push(melhor);
    return melhor;
  });
}
