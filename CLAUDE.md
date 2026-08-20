# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm install
npm run dev        # servidor local em http://localhost:4321
npm run build      # gera dist/ — também é o que valida os esquemas do conteúdo
npm run preview    # serve o build
npm run check      # astro check (TypeScript + templates .astro)

npx vitest run                                   # suíte inteira
npx vitest run src/lib/gerador/redacao.test.ts   # um arquivo
npx vitest run -t 'funde em + uma em numa'       # um teste pelo nome
npx vitest                                       # modo watch
```

Testes Python da migração (rodar de dentro de `scripts/`, os testes importam `migracao.*`):

```bash
cd scripts && python -m pytest
```

Depois de adicionar ou editar Markdown em `src/content/`, `npm run build` é o
que confirma que o frontmatter passa na validação Zod — não existe comando de
lint separado para conteúdo.

**Mudou o esquema de uma coleção com `npm run dev` já rodando?** Os campos
novos saem vazios na página, mesmo com o Markdown certo e o build passando —
`.astro/data-store.json` guarda as entradas já interpretadas pelo esquema
antigo, e o Zod descarta chave desconhecida em silêncio em vez de avisar.
Apague `.astro/` e reinicie o servidor.

## Restrições do projeto

Vêm do plano de implementação ([docs/superpowers/plans/2026-07-27-polaris.md](docs/superpowers/plans/2026-07-27-polaris.md)) e valem para código novo. As mudanças posteriores têm cada uma seu par de spec e plano em [docs/superpowers/](docs/superpowers/) — é lá que está o porquê de decisão que o código só mostra pronta (topo fixo, prompt do gerador, home reformulada):

- **Sem framework de interface.** Nada de React/Vue/Svelte. Interatividade em
  TypeScript puro dentro de `<script>` das páginas Astro.
- **Sem dependências de runtime no cliente.** O navegador não carrega
  biblioteca nenhuma; o único `fetch` em tempo de execução é o da busca, que
  pega `indice-busca.json` gerado no build.
- **Node ≥ 22.12** (exigência do Astro 7). TypeScript estrito.
- **Dois temas.** O escuro é o padrão e o único que existe sem JavaScript;
  o claro entra por `data-tema="claro"` na raiz, escrito por um script embutido
  no `<head>` de [Base.astro](src/layouts/Base.astro) antes da primeira pintura.
  Toda cor vem de token em `:root` — nunca escrever cor literal em componente,
  senão ela só funciona num dos dois temas.
- **Cor de acento sempre por papel, nunca por nome de cor.** `--destaque` é o
  que chama o olho (título da página, botão principal, etiqueta, pilares,
  cadeado travado) e `--apoio` é a interface em volta
  (links, botões secundários, foco, barra lateral dos verbetes, retângulos de
  mundo). `--ouro` e `--violeta` existem só como origem dos dois no tema escuro —
  componente nenhum deve consumi-los direto, porque no claro a paleta é outra
  (laranja-tijolo `#b34700` e azul-tinta `#1b2a4a`, sem relação com dourado e
  violeta).
- **Acento com parcimônia, por escolha da autora.** Uma cor quente que salta aos
  olhos e mais nada: o tema claro já teve um ciano no `--destaque` e foi recusado
  justamente por somar um segundo tom frio ao azul-tinta. Título de **verbete**
  não é acento — herda `--texto-forte` (branco no escuro, quase preto no claro),
  e quem separa um do outro é a barra lateral em `--apoio`. Já foi dourado e já
  foi violeta; os dois foram recusados. Não repintar.
- A "aurora" muda de cor por subgênero e **não existe no tema claro**, onde o
  fundo é liso.
- **Mexeu em cor, tamanho de fonte ou opacidade da aurora?** Refaça as contas de
  [docs/verificacao-visual.md](docs/verificacao-visual.md) e atualize o
  documento. Vários valores estão no limite: o `--destaque` do tema claro não
  pode clarear (`#b34700` dá 5,12:1 e é preenchimento com letra na cor do fundo,
  que exige 4,5), e a aurora só pode ir até 0,37 (hoje está em 0,36, em
  [Aurora.astro](src/components/Aurora.astro)). O `h1` em `--destaque` passa por
  ser texto grande — 4,27:1 no pior mundo contra os 3:1 exigidos —, então
  encolhê-lo abaixo de 18,66px reprova.
- **`prefers-reduced-motion` respeitado** por qualquer animação.
- **Tudo em português do Brasil**: identificadores, nomes de arquivo, interface,
  comentários e mensagens de commit (imperativo — "Adiciona busca global").
- Testes ao lado do código (`src/**/*.test.ts`); nenhum teste acessa a rede.

## Arquitetura

Site estático em Astro. O acervo editorial é uma grade de duas dimensões —
**tipo de recurso × subgênero** — e o site abre as duas entradas:

- por tipo: `/arquetipos/`, `/cenarios/`, `/elementos/`, cada um com uma rota
  `[subgenero]` abaixo;
- por mundo: `/mundos/[subgenero]/`, que junta os três tipos de um subgênero
  numa página só.

Houve um quarto tipo, `/livros/` — seis listas de leitura por mundo. Saiu do
site por decisão da autora, com a coleção inteira: o acervo é o que se combina
para escrever, e leitura de apoio não se combina.

### Conteúdo

`src/content/<colecao>/<subgenero>/<slug>.md`, declarado em
[src/content.config.ts](src/content.config.ts) via `glob` loader, com esquemas
Zod isolados em [src/lib/schemas.ts](src/lib/schemas.ts) para poderem ser
testados fora do Astro. Regras do esquema que não são óbvias:

- `arquetipos.nome` vai **sem** artigo ("IA Emergente", "Duplo do Protagonista")
  e o artigo definido mora em `arquetipos.artigo` (`a` ou `o`). O campo continua
  obrigatório e **sem padrão** de propósito — um padrão faria todo arquétipo novo
  nascer masculino em silêncio —, mas não é mais o gerador quem o lê: arquétipos
  saíram do sorteio, e o `{pronome}` que a concordância resolvia a partir dele
  saiu junto. `artigo` continua obrigatório porque é o que registra o gênero de
  cada arquétipo no acervo, não porque algo o consome hoje.
- `cenarios.singular` precisa começar com "um " ou "uma " — é a forma que entra
  no molde da premissa como `{em:local}`, contraída com a preposição.
- `subgeneros.mundo: false` marca um pool que não é um mundo (hoje só
  `comuns.md`, os 10 arquétipos comuns): não gera página em `/mundos/`. Chegou a
  entrar no gerador quando a caixa "Incluir os 10 arquétipos comuns" estava
  ligada; a caixa saiu do formulário junto com os arquétipos, que deixaram de
  entrar no sorteio — o pool continua vivo só no catálogo, em
  `/arquetipos/comuns/`.
- `subgenero` com `mundo: true` exige `aurora` (trio de cores hex).
- `arquetipos.felino: true` marca o arquétipo bônus, renderizado à parte com
  etiqueta própria. Ele aparece na página de catálogo à parte e fica de fora da
  amostra de `/mundos/`. Chegou a **entrar** no sorteio do gerador — decisão da
  autora —, mas não entra mais: arquétipos saíram do gerador inteiro, felino
  incluído.
- `ilustracao` e `ilustracaoAlt` existem nas **três** coleções do acervo —
  arquétipos, cenários e elementos —, por uma peça compartilhada no alto de
  [schemas.ts](src/lib/schemas.ts). `ilustracao` guarda o **nome-base** de um
  desenho em `src/assets/ilustracoes/`, sem sufixo nem extensão. Um nome para
  dois arquivos: `-tema-claro.png` e `-tema-escuro.png`. São dois porque o traço
  precisa ser escuro sobre papel claro e claro sobre fundo escuro, e o tema do
  site é o atributo `data-tema` que um botão escreve — não a preferência do
  sistema. `<picture>` com consulta de mídia daria a versão errada a quem trocar
  o tema na mão. `ilustracaoAlt` é obrigatório junto (um `.refine` recusa um sem
  o outro): imagem sem descrição é verbete que some para quem usa leitor de
  tela. É por causa desse `.refine` que os três esquemas não são objetos
  simples — quem acrescentar uma quarta coleção ao acervo precisa encaixar a
  peça, e há teste em [schemas.test.ts](src/lib/schemas.test.ts) cobrando isso
  das três.
- `subgeneros.abertura{Arquetipos,Cenarios,Elementos}` são os parágrafos que
  abrem as três páginas de catálogo daquele mundo, um por tipo, porque cada um
  fala do que está listado abaixo dele. Todos opcionais (`comuns` só tem
  arquétipos), e por isso `esquemaSubgenero` é `.strict()`: os nomes são
  parecidos o suficiente para um `aberturaCenários` com acento ser descartado em
  silêncio pelo Zod, e a página abrir sem parágrafo sem ninguém reclamar.
- `subgeneros.citacao` e `citacaoAutor` são a epígrafe do mundo, repetida no
  `<blockquote>` das quatro páginas daquele subgênero (os três catálogos e
  `/mundos/`). Vem do frontmatter, não do corpo, justamente por aparecer em
  quatro lugares. A `citacao` de `paginas/home.md` é outra coisa e não tem autor.

O campo `ordem` define a posição nos índices — a ordenação é sempre explícita,
nunca alfabética por acidente.

**O corpo de arquétipo, cenário e elemento entra na página como texto puro**
(`{entrada.body}` dentro de um `<p>`), sem passar por `render()` — Markdown no
corpo apareceria literal, com asterisco e tudo. São um parágrafo só, por isso a
economia, e hoje nenhuma das três coleções do acervo chama `render()` (a de
livros chamava, porque cada livro tinha vários parágrafos; saiu com a coleção).
Verbete que precisar de dois parágrafos ou de ênfase muda a página junto, não só
o Markdown. (A coleção `paginas` é outra história: toda entrada dela passa por
`render()`, porque é prosa corrida com títulos e listas.)

**Todo verbete do site sai de [Cartao.astro](src/components/Cartao.astro)** — as
páginas de catálogo e `/mundos/` só montam a lista e passam título, corpo e
âncora. É lá que mora o `id` que a busca usa como destino, o
`scroll-margin-top: 96px` que compensa a barra fixa e a `.etiqueta` do marcador,
que hoje só o arquétipo felino recebe. Aparência de verbete se muda ali, uma vez,
não página por página.

**O verbete ilustrado** é o mesmo Cartão com um desenho ao lado do texto. Hoje
são oito: o arquétipo felino dos **seis** mundos — Parceiro de Sombra, Infiltrado
Silencioso, Guardião Invisível, Vigia dos Suprimentos, Observador Espacial e
Batedor das Eras — mais Estações e Bases Espaciais e Sucessão dinástica
contestada, os dois do Space Opera que não são arquétipo.

**A ilustração fecha a página, sempre no último verbete da lista** — decisão da
autora. Nos arquétipos esse último é o felino, que já vinha destacado; nos
outros dois é só o de maior `ordem`. Quem escolhe é o frontmatter, não a
página — o código só desenha quem declarar `ilustracao`.

Como o lugar é a última posição e não um verbete em particular, **a lista é que
se ajusta ao desenho**: Estações e Bases Espaciais e Sucessão dinástica
contestada foram deslocados para o fim porque casavam melhor com a sonda e com o
trono do que os que estavam lá. Deslocados, não trocados — o item vai para o fim
e os demais fecham fila mantendo a ordem entre si, que é o que preserva a
sequência da autora. **Reordenar cenário ou elemento mexe em `/mundos/`**, que
mostra os três primeiros de cada tipo: essas duas mudanças tiraram Estações e
Sucessão da amostra e puseram Ruínas Antigas e Tecnologia de dobra espacial no
lugar.

Por isso **os arquivos de desenho têm nome de página, não de verbete** —
`cenarios-space-opera`, não `estacoes-e-bases-espaciais`. O verbete debaixo do
desenho já mudou uma vez e vai mudar de novo; a página, não.

Como o desenho mora no verbete de `ordem` 10 ou 11, ele **não aparece em
`/mundos/`**, que mostra os três primeiros de cada tipo. É o mesmo lugar de onde
o felino já ficava de fora.

Três coisas no arranjo não são óbvias:

- Todo verbete, ilustrado ou não, embrulha o texto num `.verbete__texto`. O
  invólucro existe só para o caso ilustrado — é ele que vira a coluna ao lado do
  desenho —, mas envolve sempre porque `<slot />` só pode aparecer **uma vez**
  num componente Astro: dois ramos de marcação, um com invólucro e outro sem,
  deixariam o corpo vazio em um dos dois.
- O arranjo é `flex`, não `grid`. Com grade o desenho precisaria atravessar as
  linhas do texto por `grid-row: 1 / -1`, e num contêiner sem linhas declaradas
  esse `-1` aponta para a **primeira** linha: o desenho ocupava uma célula só e
  jogava a etiqueta e o título para lugares errados. Já aconteceu.
- As duas versões do desenho são irmãs e quem esconde uma é a classe de tema.
  Por isso o seletor `.ilustracao img` **não** declara `display` — ele tem um
  tipo a mais que `.ilustracao__tema-claro` e venceria por especificidade, e as
  duas versões do gato apareciam empilhadas. Já aconteceu também.

A busca dos dois arquivos a partir do nome-base é
[src/lib/ilustracoes.ts](src/lib/ilustracoes.ts), compartilhada pelas três
páginas de catálogo. É o único arquivo de `src/lib/` sem teste ao lado, e de
propósito: `import.meta.glob` é do Vite e só existe dentro do build.

O par de arquivos sai de [scripts/gerar-ilustracao.py](scripts/gerar-ilustracao.py),
que recorta o papel branco quando o original vem com fundo (os primeiros
chegaram já recortados, os gatos dos outros cinco mundos não — sem esse passo o
desenho apareceria dentro de um retângulo branco no tema escuro), corta o
original na caixa do desenho, encaixa numa **caixa** de 560px de
lado e inverte o traço para a versão do tema escuro — preservando o que é
colorido, que é pigmento escolhido e não traço. Caixa e não largura fixa porque
os desenhos têm formatos muito diferentes: igualados pela largura, o trono da
Sucessão dinástica contestada ficaria com quase o dobro da altura do gato e
abriria um vão enorme ao lado de um verbete de duas linhas. O Cartão lê a largura do
próprio arquivo e mostra na metade — a caixa de 280px na tela.

Os originais em tamanho cheio ficam em `src/assets/ilustracoes/original/`,
versionados, porque sem eles não há como refazer nada. É script de uso ocasional
e por isso pede Pillow sem declará-lo no projeto.

**Antes de acrescentar ou trocar verbete, ler
[docs/revisao-de-repeticoes.md](docs/revisao-de-repeticoes.md).** É o critério
que decide em qual das três coleções um verbete entra — arquétipo é **quem**,
cenário é **onde**, elemento é **o quê / que força** — e a revisão inteira
nasceu de "cenários" que eram condição, não lugar. O documento também nomeia as
sobreposições que são de propósito e não devem ser "corrigidas" (Refugiado da
Invasão × Campos de refugiados, Humano Aumentado × Implantes cibernéticos):
elas são o que a grade de duas dimensões existe para fazer.

O tamanho do acervo (hoje 76 arquétipos — 10 por mundo mais o felino, e mais 10
comuns —, 60 cenários, 60 elementos) está escrito por extenso em
seis lugares que nenhum teste confere: [README.md](README.md),
[sobre.md](src/content/paginas/sobre.md), o comentário sobre os cenários em
[gerador.astro](src/pages/gerador.astro), o `nome` de
[comuns.md](src/content/subgeneros/comuns.md), os dois comentários de
[mundos/[subgenero].astro](src/pages/mundos/[subgenero].astro) (o pool comuns e
a posição do felino) e
[docs/atributos-do-gerador.md](docs/atributos-do-gerador.md), que lista o acervo
verbete a verbete. Entrada nova em `src/content/` desatualiza os seis em
silêncio — os de `mundos/` já tinham ficado para trás uma vez. Eram sete até a
premissa virar personagens: o rótulo "Incluir os 10 arquétipos comuns" saiu do
formulário do gerador junto com a caixa, porque arquétipos deixaram de entrar
no sorteio — não sobrou rótulo para desatualizar no lugar dele.

**Prosa não mora em componente.** Os textos da home, das páginas de índice, de
Sobre, de Estilos e do 404 vêm da coleção `paginas` (`src/content/paginas/*.md`),
buscados com `getEntry` — e a página estoura o build com mensagem explícita se a
entrada sumir, em vez de renderizar vazio. `home.md` é o caso mais completo: o
corpo traz a apresentação e a lista "Como usar", e três campos de frontmatter
(`subtitulo`, `chamadaGerador`, `citacao`) trazem as frases que a página encaixa
fora do texto corrido. Nada de copiar prosa autoral para dentro de um `.astro`.

As páginas de índice de arquétipos, cenários e elementos têm duas entradas cada:
`<pagina>.md` traz a abertura, que fica acima da lista de subgêneros, e
`<pagina>-como-usar.md` traz o bloco "Como usar esta página", que a página
renderiza **depois** da lista. São dois arquivos porque `render()` devolve o
Markdown inteiro de uma vez, e não há como intercalar a lista no meio dele.

`/mundos/[subgenero]/` é porta de entrada, não catálogo: mostra três itens de
cada tipo e manda para a página completa (e deixa o arquétipo felino de fora da
amostra). Listar tudo ali esvazia o "Ver todos".

As quatro rotas `[subgenero]` têm o mesmo `getStaticPaths` — `getCollection('subgeneros')`,
um caminho por entrada —, com **uma assimetria de propósito**: só
[arquetipos/[subgenero].astro](src/pages/arquetipos/[subgenero].astro) não
filtra por `s.data.mundo`, porque `/arquetipos/comuns/` precisa existir. As
outras três filtram, senão gerariam `/cenarios/comuns/` e afins vazias.
"Uniformizar" as quatro apaga a página dos 10 comuns.

**As três páginas de catálogo fecham com a fileira de mundos**
([TrocarDeMundo.astro](src/components/TrocarDeMundo.astro)), depois da
epígrafe: sem ela, trocar de mundo obrigava a subir na barra e voltar ao
índice. A fileira leva ao **mesmo tipo** em outro mundo — de Arquétipos
Cyberpunk para Arquétipos Distopia, não para `/mundos/cyberpunk/` —, e são
links de verdade, sem JavaScript. Três coisas nela não são óbvias:

- Ela reaproveita `.lista-subgeneros`, a mesma fileira da home e dos índices, e
  a única regra nova é a da pílula do mundo aberto. Essa regra mora em
  [global.css](src/styles/global.css), junto do resto da classe e não escopada
  no componente: metade das regras de uma classe num arquivo e metade no outro
  se perdem uma da outra — e o par de tema claro **precisa** estar lá, porque
  `:root[data-tema='claro']` num `<style>` de componente recebe o atributo de
  escopo e deixa de casar.
- O mundo aberto **fica** na fileira, marcado por `aria-current="page"` como o
  link da página atual na barra do topo, em vez de ser omitido: assim a fileira
  não muda de largura nem de ordem a cada troca. É o que o rótulo "Trocar de
  mundo" promete; "Outros mundos" pediria a lista sem ele. No claro a marca é a
  fileira ao contrário — a pílula vazada entre as preenchidas —, porque repetir
  o fundo `--flutuante` do escuro deixaria a letra em `--fundo`, quase branca
  sobre superfície quase branca.
- A fileira lista **só os seis mundos** (`mundo: true`), mas aparece também em
  `/arquetipos/comuns/`, sem nenhuma pílula marcada. Não é descuido: o pool dos
  comuns não é destino de troca, e aquela página é justamente a que ficaria sem
  saída lateral nenhuma.

### Gerador de premissas

[src/lib/gerador/](src/lib/gerador/) é um conjunto de funções puras, exportadas
por `index.ts` (ponto único de entrada; nada fora da pasta importa os arquivos
internos). Fluxo: `sortear()` escolhe **dois personagens, um local e um fato** —
o Personagem A é profissão + característica, o Personagem B é profissão +
personalidade — respeitando travas e filtros, e `redigir()` encaixa o sorteio no
`MOLDE` único.

A página não empilha mais três cartas acima da premissa — a premissa **é** a
interface. O que o sorteio traz aparece em `--destaque` dentro da própria
frase (as duas profissões, os dois traços, o local e o fato, mais o nome do
mundo), e cada linha travável termina num cadeado pequeno e inline, em vez de
um cadeado por carta.

As travas (`Travas`) cobrem as quatro linhas traváveis da premissa —
`personagemA`, `personagemB`, `local` e `fato`: travar uma congela a peça
correspondente na rolagem seguinte, num cadeado no fim daquela linha. **O fato
passa a travar.** Era a única peça sem cadeado, de propósito, para que travar
tudo e continuar clicando em Gerar seguisse trocando alguma coisa; com um
cadeado por linha, deixá-lo de fora faria a última linha parecer esquecimento
em vez de decisão — a autora escolheu a coerência. Solto, o fato continua sem
repetir o da rodada anterior; travado, ele fica parado como as outras três
peças. A linha do mundo é a única sem cadeado nenhum: quem manda nela é o
seletor de Mundo, no alto da página, não um botão dentro do texto. `sortear`
também garante que os dois personagens nunca saiam com a mesma profissão,
checando nos dois sentidos — se o Personagem B está travado, é o A que evita a
profissão dele ao sortear; nos outros casos A sai livre e B evita a que A
acabou de tirar.

[docs/atributos-do-gerador.md](docs/atributos-do-gerador.md) é o inventário do
que o gerador pode produzir — as quatro listas verbete a verbete, o molde com a
tabela de marcadores, a tabela de qual marcador trava qual linha e as regras do
sorteio. Existe porque três das quatro listas — características, personalidades
e fatos — e o molde não aparecem em página nenhuma do site: só se conhece o
repertório rolando o gerador (a quarta, as profissões, ganhou
`/guia-de-personagens/`, mas o inventário continua sendo o único lugar que
junta as quatro num documento só). Mexeu em qualquer uma das quatro listas, no
molde ou na tabela de travas? O documento envelhece junto.

**As quatro listas são a exceção à regra de prosa em Markdown**: moram em
[profissoes.ts](src/lib/gerador/profissoes.ts),
[caracteristicas.ts](src/lib/gerador/caracteristicas.ts),
[personalidades.ts](src/lib/gerador/personalidades.ts) e
[fatos.ts](src/lib/gerador/fatos.ts) porque são peça de molde, não texto de
página — mas são conteúdo editorial (CC BY, como o resto do acervo), não código.
Características, personalidades e fatos começam em minúscula e não terminam em
ponto, senão não encaixam depois de "que" ou de "Importante:". Profissões são a
exceção dentro da exceção: abrem com maiúscula e não terminam em ponto, porque
são nome de arquétipo como os do catálogo — só a `descricao` de cada uma, que
não entra no sorteio e só aparece no guia, é frase inteira e termina em ponto.
[dados.test.ts](src/lib/gerador/dados.test.ts) tranca as contagens (60
profissões, dez por mundo; 30 características; 30 personalidades; 40 fatos):
incluir uma entrada nova é editar esses números junto.

**Um molde só**, `MOLDE`, com sete marcadores — `{mundo}`, `{profissaoA}`,
`{caracteristica}`, `{profissaoB}`, `{personalidade}`, `{em:local}`, `{fato}` —
no lugar dos dez que existiam antes: a variedade que os moldes múltiplos davam
passou para o tamanho das listas. A premissa deixou de ser uma frase corrida e
virou um bloco de quatro linhas — as quebras de linha estão dentro do próprio
molde, e é por isso que o parágrafo da premissa em `gerador.astro` precisa de
`white-space: pre-wrap`. O teste exige que `MOLDE` use os sete marcadores,
termine em ponto final e tenha as quatro linhas separadas por linha em branco.
Ao lado do `MOLDE`, em [moldes.ts](src/lib/gerador/moldes.ts), mora
`TRAVA_DO_MARCADOR`: uma tabela ligando marcador a trava (`{profissaoA}` →
`personagemA`, `{profissaoB}` → `personagemB`, `{em:local}` → `local`,
`{fato}` → `fato`). `{mundo}` fica de fora de propósito — aquela linha não
ganha cadeado —, e `{caracteristica}`/`{personalidade}` também, porque dividem
linha com a profissão do mesmo personagem e o cadeado é da linha inteira, não
da peça.

**`partes()`, em [redacao.ts](src/lib/gerador/redacao.ts), é a irmã de
`redigir()`.** A página precisa saber onde cada peça começa e termina para
pintá-la de `--destaque` e para saber em qual linha pôr o cadeado — informação
que não dá para recuperar de volta de uma string pronta. `partes(sorteio,
molde, mundo)` devolve uma `Linha[]` (tipo `Linha = { trechos: Trecho[]; trava:
keyof Travas | null }`, uma por linha do molde, inclusive as vazias, para a
premissa copiada ter as mesmas quebras que a da tela) lendo `TRAVA_DO_MARCADOR`
para preencher `trava`. **`redigir()` passou a ser só a junção de `partes()`**
— os trechos de cada linha concatenados, as linhas unidas por `\n` — e é isso
que garante que o texto da tela e o texto que "Copiar premissa" leva para a
área de transferência não têm como divergir: os dois saem da mesma passada
sobre o molde, não de duas implementações que podem desalinhar.

`sortear` recebe `aleatorio: () => number` como parâmetro justamente para os
testes serem determinísticos — não chame `Math.random()` dentro da lib. Quem
injeta o acaso de verdade é o `<script>` de `gerador.astro`.

[src/pages/gerador.astro](src/pages/gerador.astro) injeta como JSON estático só
os **locais** — os 60 cenários, que vêm de uma coleção e só existem em tempo de
build. As outras três listas universais não precisam de importação própria no
`<script>`: entram por dentro de `sortear()`, que já as usa internamente. Só
`PROFISSOES` é importada à parte, porque o `<script>` monta `pools.profissoes`
com ela antes de filtrar por mundo. Nenhuma das quatro listas passa por JSON,
diferente dos locais.

A mesma página também monta, a partir do mesmo sorteio, um prompt pronto para
colar numa IA de texto. O molde é conteúdo da autora — não código — em
[prompt-ia.md](src/content/paginas/prompt-ia.md), com cinco marcadores em
maiúsculas (`[MUNDO]`, `[PERSONAGEM A]`, `[PERSONAGEM B]`, `[LOCAL]`, `[FATO]`)
que `montarPrompt()` ([prompt.ts](src/lib/gerador/prompt.ts)) substitui pelos
valores sorteados. Um marcador desconhecido faz `montarPrompt` lançar — e o
frontmatter de `gerador.astro` chama a função uma vez com valores de descarte
só para isso acontecer em `npm run build`, e não em produção no navegador de
alguém.

**Concordância gramatical** encolheu para uma função:
[redacao.ts](src/lib/gerador/redacao.ts) resolve a contração de preposição
(`contrair`, `em`+`uma` → `numa`) — é o único ponto de concordância que sobrou.
O gênero não precisa mais de heurística: as profissões, características e
personalidades carregam o "(a)" dentro do próprio texto ("Executivo(a)
Corporativo(a)", "egocêntrico(a)"), porque a premissa nunca mais se refere a
ninguém por pronome — o antigo `{pronome}` não existe. `numeroDe` e `generoDe`
saíram junto, com as constantes e os comentários que as sustentavam. É no mesmo
arquivo, ao lado de `contrair`, que moram `partes()` e `redigir()` — ver acima.

[src/pages/guia-de-personagens.astro](src/pages/guia-de-personagens.astro) é a
página que mostra as 60 profissões com a `descricao` de cada uma. A `descricao`
mora dentro do mesmo objeto que o `nome`, em `profissoes.ts` — os dois vivem
juntos porque descrevem a mesma peça, e separá-los em arquivos diferentes os
faria divergir na primeira edição. A rota fica **fora do
[Nav](src/components/Nav.astro), sem rota por mundo e fora da busca**: o
[índice de busca](src/pages/indice-busca.json.ts) é montado só a partir das
quatro coleções de `src/content/`, e profissão não é coleção — não há nada para
excluir dali de propósito, é ausência por natureza. Ficar fora do menu não é
esquecimento: é a decisão que impede as profissões de virarem um segundo
catálogo de "quem", competindo com os arquétipos — ver
[docs/revisao-de-repeticoes.md](docs/revisao-de-repeticoes.md). O único caminho
até a página é o link no fim de `gerador.astro`.

### Interatividade sem framework

Cada `<script>` de página ou componente importa funções puras de `src/lib/` e só
faz a ligação com o DOM; a lógica testável fica na lib. O padrão de melhoria
progressiva está em [expansivel.ts](src/lib/expansivel.ts), usado pelo menu do
Nav, pelo submenu "Mais" e pela lista de mundos da home: o botão nasce com
`[hidden]` no HTML e só aparece pelo JavaScript, então sem script a lista fica
visível em vez de virar um menu que não abre. E o estado de aberto/fechado mora
num lugar só, o `aria-expanded` do botão, com o CSS reagindo por seletor de
irmão — nada de estado paralelo que possa divergir do que o leitor de tela
anuncia.

O "Mais" é o único dos três que flutua sobre a página, e por isso ganha o que os
outros dois não precisam: fecha no Escape (devolvendo o foco ao botão) e no
clique fora, como a busca. Abaixo do ponto de quebra ele deixa de existir —
`display: contents` dissolve o agrupamento e os três links voltam a ser irmãos
dos outros quatro dentro do menu recolhido, para não haver menu dentro de menu.
Mexer no que está na barra pede refazer a conta de largura que está comentada
no `@media` de [Nav.astro](src/components/Nav.astro): o ponto de quebra sai
dessa soma, não de uma medida de tablet.

**A página aberta fica pintada na barra**, em `--flutuante` — a mesma superfície
do painel do "Mais", para marcar onde a pessoa está sem inventar tom novo. Quem
decide é `ehPaginaAtual()` ([navegacao.ts](src/lib/navegacao.ts)), que compara
por **prefixo**: `/arquetipos/cyberpunk/` mantém "Arquétipos" aceso, senão a
marca apagaria justo nas páginas de catálogo. A função não serve para a raiz do
site — todo caminho começa por ela —, e é por isso que a marca POLARIS fica de
fora: ela não é item de menu. Estar numa página de `/mundos/` também não acende
nada, porque não há link de mundos na barra.

O estado mora no `aria-current="page"` do próprio link, não numa classe: a marca
que o leitor de tela anuncia é a mesma que o CSS pinta, sem um segundo estado
para divergir dela — o mesmo princípio do `aria-expanded` dos três expansíveis.
As duas exceções são o botão "Mais", que ganha a classe
`nav__mais-botao--atual` quando a página aberta é uma das três de dentro dele
(fechado, o menu esconderia a única marca), e o link atual **dentro** do painel
aberto, que troca `--flutuante` pela camada do item sob o cursor — sobre o
painel, que já é `--flutuante`, ele sumiria de violeta sobre violeta.

### Estilo nas páginas

Os tokens de cor moram todos em [global.css](src/styles/global.css), importado
uma vez por [Base.astro](src/layouts/Base.astro); o resto é `<style>` escopado na
própria página. A única coisa que o site guarda no navegador é a chave
`polaris-tema` do `localStorage`, lida pelo script embutido no `<head>`.

Além dos tokens, `global.css` guarda o punhado de classes que mais de uma página
usa — `.bloco`, `.etiqueta`, `.botao` (com `.botao--principal`),
`.lista-subgeneros`, `.abertura`, `.autor`. Antes de escrever regra nova num
`<style>` escopado, conferir se uma delas já faz o trabalho: `.lista-subgeneros`
só foi parar ali depois de ter sido copiada em quatro páginas. Classe que vale
para uma página só continua escopada.

A coluna de conteúdo é `--largura-conteudo` (1280px) e o recuo que a centraliza
é `--recuo`, consumido pelo `padding-inline` das três faixas — barra do topo,
`main` e rodapé. O `100%` dentro do token se resolve no ponto de uso, então ele
só vale para filho direto do `<body>`; dentro de um contêiner mais estreito o
recuo sai errado sem avisar.

O HTML que sai de `render()` de uma entrada Markdown **não** recebe o atributo de
escopo do Astro — estilizá-lo pede um contêiner escopado e `:global()` dentro
dele (`.conteudo :global(h2)`), como em
[estilos.astro](src/pages/estilos.astro). Sem isso a regra é descartada em
silêncio, o que parece um seletor errado e não é. A mesma armadilha vale para
nó criado por JavaScript em runtime, dentro de um `<script>` — ele também não
carrega o atributo de escopo, mesmo morando dentro de um contêiner escopado.
Foi o que aconteceu com `.sorteado`, os `<span>` que `montarPremissa()` cria em
[gerador.astro](src/pages/gerador.astro): a correção foi
`.premissa :global(.sorteado)`.

A aurora recebe o trio de cores do subgênero por prop de `Base` e o converte em
`conic-gradient` por `gradienteConico()` ([aurora.ts](src/lib/aurora.ts)), que
cai no `AURORA_PADRAO` quando a página não é de mundo.

**A barra do topo é `position: sticky`** ([Nav.astro](src/components/Nav.astro)),
e isso cria duas amarras que o CSS não consegue impor sozinho:

- Todo alvo de âncora precisa de `scroll-margin-top: 96px`, senão o título para
  debaixo da barra. O valor está escrito duas vezes — em
  [Cartao.astro](src/components/Cartao.astro) e nas `section[id]` de
  [mundos/[subgenero].astro](src/pages/mundos/[subgenero].astro) — e os dois
  mudam juntos. Quem chega às âncoras é a busca, então errar aqui quebra a
  busca, não a página.
- A escada de `z-index` é curta e proposital: aurora em `-1`, Nav em `10`, e em
  `20` as duas coisas que abrem por cima da página — a lista de resultados da
  busca e o submenu do "Mais". As duas moram dentro do Nav, e o empate não
  importa porque estão em pontas opostas da fileira. O `10` do Nav vinha do
  cadeado do gerador, que era `absolute` e ancorado no canto de uma carta;
  desde que a premissa virou a própria interface o cadeado é `inline-flex`
  dentro do texto e não precisa mais dessa amarra, mas o valor ficou — é ele
  que sustenta o contexto de empilhamento que a busca e o "Mais" usam para
  abrir por cima do resto da página. E como o Nav abre esse contexto, valor
  novo acima de `20` em componente de página não vence a barra; vai por dentro
  dela ou não vai. O submenu, das duas, é a que não flutua: ela se pendura na
  barra, e o `top: calc(100% + 18px)` que faz isso depende de `.nav__links` e
  `.nav__mais` esticarem na altura da barra (`align-self: stretch`) — os 18px
  são o recuo de baixo mais a borda. Mexeu no `padding` da barra ou tirou um
  dos dois `stretch`? O encaixe sai torto, e nada no CSS explica por quê.
- **Painel que flutua sobre a página é opaco** — `--flutuante`, nunca
  `--painel`. O token de painel é translúcido nos dois temas (0,8 no escuro,
  0,05 no claro) e deixa passar o que está embaixo: o submenu do "Mais" abre
  justo em cima do `h1`, e com `--painel` o título aparecia atrás dos links.
  `backdrop-filter` não resolve texto sobre texto. E no escuro `--painel` é a
  mesma cor de `--fundo` a 80%, então nem serve de atalho para clarear painel
  nenhum. Opaco também não quer dizer `--fundo` puro: aí o painel virava a
  coisa mais escura da tela, mais escura que a própria barra, que a aurora
  tinge — foi recusado. `--flutuante` é `--apoio` misturado ao fundo (14% no
  escuro, 8% no claro), a mesma receita de `--bloco`. A lista da busca é a
  exceção que continua em `--painel` com desfoque: ela abre sobre texto
  corrido, não sobre o título.

### Busca

Índice montado no build por
[src/pages/indice-busca.json.ts](src/pages/indice-busca.json.ts) (título, tipo,
subgênero, URL com âncora); o filtro em si é `buscar()` em
[src/lib/busca.ts](src/lib/busca.ts) — comparação sem acentos, ordenada pela
posição do trecho encontrado. [Busca.astro](src/components/Busca.astro) baixa o
JSON sob demanda, uma vez.

Âncoras e slugs saem sempre de `paraAncora()` em
[src/lib/texto.ts](src/lib/texto.ts) — não montar slug à mão em componente.

### Publicação e `base`

`site`/`base` são derivados de `GITHUB_REPOSITORY` por `resolverBase()` em
[src/lib/config.ts](src/lib/config.ts), consumido por
[astro.config.ts](astro.config.ts). Fora do Actions cai em `localhost:4321` com
base `/`. Por isso **todo link interno precisa passar por
`import.meta.env.BASE_URL`** (o padrão no código é normalizar com
`base.endsWith('/') ? base : base + '/'`); um `href="/arquetipos/"` cru quebra
em produção.

**Dentro de Markdown a regra é a oposta: escreva o caminho cru.** Prosa da
autora não tem como consultar `import.meta.env`, então quem conserta é
`reescreverLinksInternos()`
([src/lib/links-markdown.ts](src/lib/links-markdown.ts)), um plugin rehype
ligado em `markdown.rehypePlugins` do
[astro.config.ts](astro.config.ts): ele percorre o HTML já montado de todo
Markdown e prefixa a base em todo `href` que começa por uma barra só. `mailto:`,
protocolo, `//outro.site`, âncora e caminho relativo passam intactos. Um
`[Gerador](/gerador/)` no Markdown é o jeito certo — e é o único link interno de
conteúdo hoje, em [sobre.md](src/content/paginas/sobre.md). Sem o plugin ele
funcionaria no `npm run dev` e daria 404 no ar, que é o pior jeito de quebrar:
por isso o teste do plugin é o que segura essa garantia, não o build.

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) roda `npx vitest
run` e `npm run check` antes do build e publica no GitHub Pages a partir de
`main` — os dois precisam passar localmente antes de empurrar.

### Migração do Notion

[scripts/migracao/](scripts/migracao/) é um script Python de uso único que gerou
`src/content/` a partir do Notion, já aposentado como fonte de verdade. Só
`notion.py` toca a rede; os testes usam fixtures gravadas. Mexer aqui só se a
migração precisar ser reexecutada — o conteúdo hoje se edita direto no Markdown.

## Licenças

Código MIT ([LICENSE](LICENSE)); conteúdo editorial CC BY 4.0
([LICENSE-CONTEUDO.md](LICENSE-CONTEUDO.md)). O rodapé do site declara as duas.
