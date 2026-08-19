import type { HastPluginDefinition } from 'satteri';

/* Link interno escrito dentro de um Markdown do acervo.

   O site não mora na raiz em produção: `base` é `/projetopolaris/` no GitHub
   Pages e `/` aqui no computador. Num `.astro` isso se resolve à mão, com
   `import.meta.env.BASE_URL` — mas o Markdown da coleção `paginas` é prosa da
   autora, não código, e não tem como consultar variável nenhuma. Um
   `[Gerador](/gerador/)` cru chegaria intacto ao HTML e levaria a uma página de
   erro só em produção, calado no desenvolvimento — que é o pior jeito de
   quebrar.

   Então a correção acontece no build, num plugin do processador de Markdown que
   recebe cada `<a>` do HTML já montado e prefixa a base no href. A autora
   escreve o caminho do jeito óbvio e o resto é trabalho de máquina.

   O plugin é `hastPlugins` do Sätteri, o processador nativo do Astro, e não
   `markdown.rehypePlugins`: a chave antiga continua no tipo da configuração,
   mas usá-la exige instalar `@astrojs/markdown-remark` e **trocar o processador
   do site inteiro** por unified/remark. Trocar o motor de Markdown de todas as
   páginas para consertar um href seria caro pelo lado errado. */

/** Prefixa a raiz do site num caminho absoluto interno. Devolve o href
 *  intocado quando ele não é caminho interno: externo (`//outro.site`),
 *  protocolo (`https:`, `mailto:`), âncora (`#topo`) ou relativo. */
export function absolutizar(href: string, raiz: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  return raiz + href.slice(1);
}

/** Fábrica do plugin. Recebe a `base` resolvida em astro.config.ts. */
export function reescreverLinksInternos(base: string): HastPluginDefinition {
  const raiz = base.endsWith('/') ? base : `${base}/`;
  return {
    name: 'polaris-links-internos',
    /* `filter` é peneirado do lado do Rust: só as âncoras atravessam para cá,
       em vez de esta função ser chamada em cada nó do documento. */
    element: {
      filter: ['a'],
      visit(no, ctx) {
        const href = no.properties?.href;
        if (typeof href !== 'string') return;
        ctx.setProperty(no, 'href', absolutizar(href, raiz));
      },
    },
  };
}
