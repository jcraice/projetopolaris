import type { ImageMetadata } from 'astro';

/* Busca do par de arquivos de uma ilustração do acervo.

   O frontmatter de um verbete guarda só o nome-base ("observador-espacial") e é
   aqui que ele vira os dois arquivos de tema. Mora em `src/lib/` porque as três
   páginas de catálogo que podem ter ilustração — arquétipos, cenários e
   elementos — precisam da mesma busca, e triplicá-la garantiria três versões
   divergentes na primeira mudança.

   É o único arquivo de `src/lib/` sem teste ao lado, e de propósito:
   `import.meta.glob` é do Vite e só existe dentro do build, então não há como
   exercitá-lo fora dele. O que ele protege — nome que não bate com arquivo —
   é verificado pelo próprio `npm run build`, que passa a estourar. */

/* Eager: tudo resolvido no build, nada baixado em tempo de execução. O caminho
   é relativo a este arquivo, não à página que chama. */
const arquivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/ilustracoes/*.png',
  { eager: true },
);

export interface Ilustracao {
  temaClaro: ImageMetadata;
  temaEscuro: ImageMetadata;
  alt: string;
}

/** Monta a ilustração de um verbete a partir do nome-base do frontmatter.
 *  Nome que não bate com arquivo estoura, com a mesma franqueza do `getEntry`
 *  das páginas de prosa: abrir a página com um buraco no lugar do desenho seria
 *  pior, porque ninguém percebe até alguém reclamar. */
export function buscarIlustracao(nome: string, alt: string): Ilustracao {
  const versao = (sufixo: string) => {
    const chave = `../assets/ilustracoes/${nome}-${sufixo}.png`;
    const arquivo = arquivos[chave];
    if (!arquivo) {
      throw new Error(
        `ilustração '${nome}' não encontrada: falta ${chave.replace('../', 'src/')}. ` +
        'Gere as duas versões com scripts/gerar-ilustracao.py.',
      );
    }
    return arquivo.default;
  };
  return { temaClaro: versao('tema-claro'), temaEscuro: versao('tema-escuro'), alt };
}

/** Atalho para o padrão que as três páginas repetem: o verbete pode não ter
 *  ilustração, e o esquema garante que, se tiver, o texto alternativo veio
 *  junto — o que o TypeScript não sabe sozinho. */
export function ilustracaoDe(dados: { ilustracao?: string; ilustracaoAlt?: string }) {
  return dados.ilustracao ? buscarIlustracao(dados.ilustracao, dados.ilustracaoAlt ?? '') : undefined;
}
