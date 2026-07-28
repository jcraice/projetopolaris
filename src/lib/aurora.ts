export const AURORA_PADRAO = ['#ff2d92', '#7c3aed', '#00e5ff'] as const;

export function gradienteConico(cores: readonly [string, string, string] | undefined): string {
  const [a, b, c] = cores ?? AURORA_PADRAO;
  return `conic-gradient(from 200deg, ${a}, ${b}, ${c}, ${a})`;
}
