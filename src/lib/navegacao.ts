/** Diz se um link da barra aponta para a página que está aberta.
 *
 * A comparação é por prefixo, não por igualdade: quem está em
 * `/arquetipos/cyberpunk/` continua dentro de Arquétipos, e apagar a marca ali
 * faria a barra dizer que ninguém está em lugar nenhum justamente nas páginas
 * de catálogo, que são as mais visitadas do site.
 *
 * Os dois lados chegam sem padronização de barra final — o Nav monta os links
 * sem ela e o navegador costuma trazê-la no caminho —, então a comparação
 * normaliza os dois antes de olhar.
 *
 * **Não serve para a raiz do site.** Todo caminho começa por ela, então a marca
 * ficaria acesa em todas as páginas. É por isso que a marca POLARIS, que aponta
 * para a raiz, não passa por aqui: ela não é item de menu.
 */
export function ehPaginaAtual(caminho: string, href: string): boolean {
  const comBarra = (valor: string) => (valor.endsWith('/') ? valor : `${valor}/`);
  return comBarra(caminho).startsWith(comBarra(href));
}
