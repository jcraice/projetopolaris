export function resolverBase(repositorio: string | undefined): { site: string; base: string } {
  if (!repositorio) {
    return { site: 'http://localhost:4321', base: '/' };
  }
  const [dono, nome] = repositorio.split('/');
  const site = `https://${dono}.github.io`;
  const base = nome === `${dono}.github.io` ? '/' : `/${nome}`;
  return { site, base };
}
