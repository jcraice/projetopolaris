import { defineConfig, fontProviders } from 'astro/config';
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
  /* As três letras da Carta Estelar. O Astro baixa os arquivos no build e os
     publica junto do site: o navegador de quem visita não fala com terceiro
     nenhum, o que mantém a regra de nada carregado de fora em runtime. */
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--fonte-titulo',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--fonte-texto',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--fonte-rotulo',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
