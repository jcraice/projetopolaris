import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { resolverBase } from './src/lib/config.ts';
import { reescreverLinksInternos } from './src/lib/links-markdown.ts';

const { site, base } = resolverBase(process.env.GITHUB_REPOSITORY);

export default defineConfig({
  site,
  base,
  /* `satteri()` é o processador que o Astro já usa por padrão — nomeá-lo aqui
     não troca nada, só abre a lista de plugins. Vale para todo Markdown do
     site: link escrito como /gerador/ sai do build já com a base na frente.
     Ver src/lib/links-markdown.ts. */
  markdown: { processor: satteri({ hastPlugins: [reescreverLinksInternos(base)] }) },
});
