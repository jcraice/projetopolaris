# Projeto Polaris — Documento de Design

**Data:** 27 de julho de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. O que estamos construindo

O Projeto Polaris existe hoje como um site no Notion: um catálogo de arquétipos, cenários e
elementos narrativos de ficção científica, organizados por subgênero, feito para quem trava na
página em branco.

Este documento descreve a reconstrução do Polaris como um site próprio, de código aberto,
publicado no GitHub Pages e sem banco de dados. O objetivo não é replicar o Notion — é entregar
duas coisas que ele não entrega:

1. **Um catálogo navegável de verdade**, com busca, links diretos e identidade visual autoral.
2. **Um gerador de combinações**, que transforma o acervo de material de leitura em ferramenta
   de criação.

### Público

Quem escreve ficção científica e precisa de um ponto de partida — não de um texto pronto.
A promessa central, que a licença escolhida sustenta, é: *o que você criar a partir daqui é seu*.

---

## 2. Decisões tomadas

| Decisão | Escolha |
|---|---|
| Coração do projeto | Catálogo sólido + gerador construído sobre ele |
| Comportamento do gerador | Cartas com trava e re-rolagem, fechando numa premissa em texto |
| Destino do resultado | Efêmero: botão de copiar, sem conta e sem armazenamento |
| Fonte de verdade do conteúdo | O repositório (Markdown), Notion aposentado |
| Escopo da v1 | Tudo que existe hoje, menos o blog |
| Direção visual | Pôster neon sobre céu iridescente |
| Paleta | Dourado + violeta fixos; aurora variando por subgênero |
| Base técnica | Astro, publicado por GitHub Actions no GitHub Pages |
| Licença | Código MIT · conteúdo CC BY 4.0 |
| Custo | Zero em todas as camadas |

---

## 3. Modelo de conteúdo

### Princípio

Um arquivo, uma ideia. Cada arquétipo, cenário e elemento é um arquivo Markdown pequeno, fácil
de revisar num Pull Request e fácil de editar pela interface web do GitHub.

### Estrutura

```
src/content/
  subgeneros/          space-opera.md · distopia.md · cyberpunk.md
                       pos-apocaliptico.md · invasao-alienigena.md
                       viagem-no-tempo.md · comuns.md
  arquetipos/
    cyberpunk/         o-hacker.md · a-samurai-de-rua.md · …
    space-opera/       o-capitao-estrategico.md · …
  cenarios/
    cyberpunk/         megacidades-superpovoadas.md · …
  elementos/
    cyberpunk/         dominio-de-megacorporacoes.md · …
  livros/
    cyberpunk/         neuromancer.md · …
  paginas/             sobre.md · estilos.md
```

### Esquemas

**Subgênero**

| Campo | Tipo | Observação |
|---|---|---|
| `nome` | texto | "Space Opera" |
| `ordem` | número | posição nos índices |
| `aurora` | lista de 3 cores | alimenta o gradiente de fundo da seção; opcional quando `mundo` é `false`, caso em que vale a aurora padrão do site |
| `mundo` | booleano | `false` para "20 Arquétipos Comuns", que é um pool e não um mundo: não ganha rota `/mundos/` nem aurora própria |
| `citacao` / `citacaoAutor` | texto | a epígrafe que hoje fecha cada página |
| corpo | Markdown | o texto de abertura da seção |

**Arquétipo**

| Campo | Tipo | Observação |
|---|---|---|
| `nome` | texto | vem com artigo: "A Transumana", "O Hacker" |
| `subgenero` | referência | valida contra a coleção de subgêneros |
| `ordem` | número | |
| `felino` | booleano | padrão `false`; marca o arquétipo felino bônus de cada subgênero |
| corpo | Markdown | a descrição |

O artigo no início do `nome` é a fonte do gênero gramatical usada pelo gerador. Não existe campo
de gênero: ele se deduz sozinho.

**Cenário**

| Campo | Tipo | Observação |
|---|---|---|
| `titulo` | texto | como aparece no catálogo: "Ruínas Antigas" |
| `singular` | texto | forma singular com artigo indefinido: "uma ruína antiga" |
| `subgenero` | referência | |
| `ordem` | número | |
| corpo | Markdown | a descrição |

O campo `singular` existe porque a singularização automática do português falha em silêncio
justamente nos casos mais visíveis. Ver a seção 6.4.

**Elemento narrativo** e **Livro** seguem o mesmo padrão (`titulo`, `subgenero`, `ordem`, corpo);
o livro acrescenta `autor`.

### O que deliberadamente não existe

Classificação de arquétipos por papel narrativo (protagonista, antagonista, apoio) e etiquetas
temáticas. Ambos exigiriam escrever conteúdo novo para mais de 140 fichas e nenhuma
funcionalidade da v1 depende deles. Se um dia forem desejados, entram por script.

---

## 4. Arquitetura do site

### O acervo é uma grade

Arquétipos, Cenários, Elementos e Livros compartilham o mesmo eixo de 6 subgêneros. O acervo é,
portanto, uma grade de duas dimensões: **tipo de recurso × subgênero**. O Notion só permite
entrar por um lado. O site novo abre os dois.

### Rotas

```
/                          Home: os três pilares, o gerador, o convite
/arquetipos/               índice dos subgêneros + "20 Arquétipos Comuns"
/arquetipos/[subgenero]/   cartões + o felino + citação + "Como usar esta página"
/cenarios/    ·  /cenarios/[subgenero]/
/elementos/   ·  /elementos/[subgenero]/
/livros/      ·  /livros/[subgenero]/
/mundos/[subgenero]/       tudo de um subgênero reunido
/estilos/     ·  /sobre/   ·  /gerador/
```

Não há página individual por arquétipo: com uma ou duas frases cada, seriam páginas
esqueléticas, ruins para leitura e para indexação. Em vez disso, cada cartão tem âncora própria
(`/arquetipos/cyberpunk#a-transumana`), o que dá link direto sem fragmentar o conteúdo. Se as
descrições crescerem no futuro, promover a páginas próprias é uma mudança pequena.

A rota `/mundos/` é a resposta para "estou escrevendo cyberpunk, me mostra tudo que você tem".
Não custa conteúdo novo — apenas cruza o outro eixo da grade.

### Busca

Campo único no topo, varrendo os quatro tipos ao mesmo tempo, com resultados aparecendo enquanto
se digita. Ignora acentuação: "cenario" encontra "cenário". Roda inteiramente no navegador sobre
um índice gerado no build, de poucos kilobytes. Sem biblioteca externa — são cerca de 200 itens e
comparação direta de texto resolve com folga.

---

## 5. Identidade visual

**Direção:** cartazes de neon chapado flutuando sobre um céu iridescente.

- **Tipografia** pesada, condensada, em caixa alta nos títulos; descrições em corpo de leitura
  confortável, sempre sobre painel sólido.
- **Cartões** com borda grossa na cor de bloco, fundo quase opaco e desfoque leve — a aurora
  brilha através sem nunca passar por baixo do texto. Foi assim que a legibilidade, fraqueza do
  neon puro, ficou resolvida.
- **Duas cores por mundo:** uma de bloco (etiquetas, botão principal) e uma de traço (barra
  lateral da descrição, contornos). É o que dá ritmo de cartaz sem virar arco-íris.
- **Acentos fixos:** dourado (`#ffc300`) e violeta (`#b07cff`) em todo o site, garantindo unidade.
- **Aurora variável:** cada subgênero define seu próprio trio de cores no arquivo de subgênero.
  Entrar em Distopia sente diferente de entrar em Pós-Apocalíptico. Adicionar um sétimo subgênero
  é criar um arquivo e escolher três cores.
- **Tema escuro apenas.** Uma versão clara seria outro site, não o mesmo com outra pele.
- **A aurora se desloca lentamente.** Com "reduzir movimento" ativado no sistema, ela fica parada.

---

## 6. O gerador

### 6.1 As peças

Três cartas — Arquétipo, Cenário, Elemento Narrativo — sorteadas dos pools do subgênero
escolhido. Os "20 Arquétipos Comuns" entram no sorteio por meio de uma opção ligada/desligada
pelo usuário — desligada por padrão, para que o resultado soe do mundo escolhido; ligada, eles se
somam ao pool de arquétipos daquele subgênero.

Cada carta tem cadeado: o usuário trava o que gostou e re-rola apenas o resto. Há também
"sortear tudo".

**Modo misturar mundos:** cada carta pode vir de um subgênero diferente. Isso não é invenção
nova — é a execução do que a página "Estilos & Combinações" já ensina ("Cyberpunk + Viagem no
Tempo: linhas temporais manipuladas por hackers e corporações"). O gerador passa a fazer o que
aquele texto descreve.

### 6.2 A premissa

Abaixo das cartas, uma frase montada a partir delas. Nenhuma IA está envolvida: sem servidor,
uma chave de API ficaria exposta no código, e um acervo bom com boas regras produz resultado mais
útil que texto genérico de modelo de linguagem.

A frase se monta com três ingredientes: as peças sorteadas, um **molde** e uma **complicação**.

Molde de referência:

> *Em {cenário}, sob {elemento}, {arquétipo} descobre que {complicação}.*

O botão **reescrever** mantém as peças e troca molde e complicação.

### 6.3 Regras de redação

Estas regras são o que separa "parece automático" de "parece escrito", e cada uma nasceu de um
erro observado em teste com dados reais:

1. **Contração da preposição.** O campo `singular` do cenário traz o artigo indefinido
   ("uma ruína antiga"), e o molde aplica `em + uma = numa`, `em + um = num`. Sempre correto.
2. **Artigo do arquétipo em minúscula no meio da frase.** "a Transumana descobre", não
   "A Transumana descobre".
3. **Gênero deduzido do nome.** O artigo inicial do arquétipo determina qualquer concordância
   necessária no molde.
4. **Dez moldes, não um.** Um molde só cansa na terceira rolagem, e certas combinações pedem
   outra preposição — "sob memória histórica alterada" range, "em meio a" ou "marcada por"
   encaixam melhor. A variedade de moldes existe para que sempre haja um encaixe natural.
5. **Sem complicação repetida em rolagens consecutivas.**
6. **Sorteio em dois passos:** primeiro a família de complicação, depois a complicação dentro
   dela. Isso impede duas rolagens seguidas de caírem no mesmo tipo de virada.

### 6.4 Por que o campo `singular` é preenchido à mão

Singularizar por algoritmo acerta a maioria dos casos e erra em silêncio em uma minoria muito
visível:

| Cenário | Algoritmo | Correto |
|---|---|---|
| Naves e frotas nômades | nave e frota nômade | uma frota nômade |
| Cidades em ruínas | cidade em ruína | uma cidade em ruínas |
| Oásis de elite | oási de elite | um oásis de elite |
| Conexões interdimensionais | conexõe interdimensionai | uma conexão interdimensional |
| Bairros dominados por facções | bairro dominado por facção | um bairro dominado por facções |
| Fronteiras hostis | fronteira hosti | uma fronteira hostil |

As irregularidades de terminação (-ões→-ão, -ais→-al, -is→-il) são cobríveis por regra. Os
compostos com "e" e os complementos que precisam permanecer no plural não são: dependem de
entender a frase. Como são cerca de 60 cenários, escrever a forma singular uma vez é barato e
definitivo. A migração gera todos preenchidos; a autora revisa e corrige.

### 6.5 Resultado

Botão de copiar, e só. O gerador é efêmero por decisão de projeto: a faísca sai dali e vai para o
caderno de quem escreve.

### 6.6 O risco principal da v1

**A qualidade das premissas depende do banco de complicações.** Se ele ficar raso, o gerador vira
brinquedo de uma visita só. É o ponto a vigiar de perto durante a implementação, e o lugar onde
mais vale investir tempo de escrita.

---

## 7. Migração do conteúdo

Um script Python roda **uma única vez**. Ele lê as páginas públicas do Notion pela API interna
(`/api/v3/loadPageChunk`) e escreve os arquivos Markdown já no formato final: nome de arquivo
derivado do título, subgênero preenchido, descrição no corpo, felino marcado, `singular`
pré-preenchido para cada cenário.

O resultado é revisado num Pull Request. Depois disso o script permanece no repositório como
registro histórico, mas não roda mais: a fonte de verdade passa a ser o repositório. Sem
sincronização contínua e sem dependência permanente de uma API não-oficial que pode mudar sem
aviso.

**Não migra automaticamente:** as imagens de capa e ícone (baixadas à parte) e o texto do "Sobre",
que tem formatação própria e vale copiar à mão para sair perfeito.

**Volume esperado:** 6 subgêneros × ~21 arquétipos, mais os 20 comuns (~146); 6 × 10 cenários
(60); 6 × 20 elementos (~120); 6 × 6 livros (36).

---

## 8. Qualidade e publicação

- **Publicação:** Pull Request aprovado → GitHub Actions constrói → GitHub Pages publica. Sem
  passo manual.
- **Validação de conteúdo no build:** um arquétipo sem nome, sem subgênero ou sem descrição
  quebra o build antes de publicar. Um Pull Request malformado não entra no site.
- **Testes automatizados** cobrem as regras do gerador: peça travada nunca muda; o subgênero
  escolhido é respeitado; a contração de preposição sai correta; o artigo do arquétipo vira
  minúscula no meio da frase; nenhuma complicação se repete em rolagens consecutivas.
- **O visual não entra em teste automatizado.** É olho.
- **Acessibilidade:** para cada um dos seis mundos, o contraste é verificado nas combinações que
  carregam texto — dourado sobre painel, violeta sobre painel e corpo de texto sobre painel —
  contra a aurora daquele mundo. Somam-se navegação por teclado no gerador e
  `prefers-reduced-motion` respeitado pela aurora.

---

## 9. Fora do escopo da v1

Registrado para que não vire discussão depois:

- **Blog.** Exige listagem, datas e feed, e hoje tem quase nenhum conteúdo. A seção mais cara e a
  menos madura.
- **Link compartilhável da combinação.** Barato de acrescentar depois — o estado já estará
  codificado —, mas o gerador foi decidido como efêmero.
- **Caderno local de favoritas** e **card de imagem para redes sociais.**
- **Filtros por papel narrativo** e **afinidade temática entre peças** (fazer o gerador preferir
  combinar elemento e complicação do mesmo tema). Ambos dependem de metadados que ainda não
  existem.
- **Tema claro** e **outros idiomas.**

---

## 10. Licenciamento

- **Código:** MIT.
- **Conteúdo:** CC BY 4.0 — qualquer pessoa pode usar, adaptar e redistribuir, inclusive
  comercialmente, creditando a autora e o Projeto Polaris.

A escolha de permitir uso comercial é deliberada: uma cláusula não-comercial criaria dúvida
justamente no público-alvo ("posso usar esses arquétipos no romance que pretendo vender?") e
azedaria a promessa central do projeto. Vale lembrar que arquétipos como ideias não são
protegidos por direito autoral; a licença cobre o texto das descrições.

---

## Apêndice A — Banco de complicações

Quarenta viradas curtas, agrupadas em sete famílias. Todas passam em três testes: funcionam nos
seis subgêneros, não citam tecnologia ou cenário específico, e não têm marca de gênero — encaixam
depois de "descobre que…" ou "precisa aceitar que…" sem quebrar a concordância.

Este é um rascunho na direção da autora, não texto final. As famílias com maior potencial de
expansão são "O preço do poder" e "O inimigo que não é inimigo", que produzem os antagonistas
mais interessantes.

**Traição e confiança**

1. quem pagou pelo serviço já sabia a resposta que mandou buscar
2. o aviso que evitou a morte veio de quem mais lucraria com ela
3. a única pessoa digna de confiança ali cumpre ordens desde o primeiro dia
4. a escolha não foi por competência, e sim por ser fácil de descartar depois
5. alguém do mesmo lado já negociou a rendição de todos, e negociou bem
6. o segredo foi guardado a vida inteira por quem prometeu revelá-lo

**O custo moral**

7. salvar a maioria exige entregar exatamente quem confiou primeiro
8. a solução funciona, e funciona porque alguém aceitou não voltar
9. o certo e o possível apontam para lados opostos, e só há tempo para um
10. fazer a coisa certa agora condena quem vier depois
11. o silêncio custa uma vida por dia, e falar custa todas de uma vez
12. existe uma saída limpa, e ela serve para uma pessoa só

**Identidade e revelação**

13. a lembrança mais antiga que possui foi plantada, e plantada com capricho
14. o inimigo procurado há anos usa o próprio rosto
15. pertence, por nascimento, ao lado que jurou destruir
16. o nome que carrega pertenceu antes a outra pessoa, e essa pessoa não morreu
17. existe para isso desde antes de nascer, e nunca houve escolha nenhuma
18. a assinatura no documento que condenou todo mundo é a sua

**Tempo e urgência**

19. o prazo que parecia longo já venceu em algum lugar
20. cada tentativa de consertar aproxima o desastre em um dia
21. a decisão precisa ser tomada antes de existir informação suficiente
22. o resgate está a caminho e chega depois do que acontecer primeiro
23. há uma janela, e ela se fecha com alguém ainda do lado de dentro
24. o aviso chegou no tempo certo, mas para a pessoa errada

**O preço do poder**

25. a única ferramenta capaz de vencer cobra um pedaço de quem a usa
26. aceitar a ajuda oferecida significa dever um favor impagável
27. usar a arma uma vez basta para nunca mais conseguir largá-la
28. a cura existe, e é fabricada com a própria doença
29. o comando só obedece a quem já perdeu o que amava
30. quem detém o poder o mantém justamente por não usá-lo

**O inimigo que não é inimigo**

31. o outro lado tem razão, e provar isso não muda o que precisa ser feito
32. o monstro está fazendo exatamente o que qualquer um faria no lugar dele
33. a ordem absurda recebida era a única capaz de evitar algo pior
34. quem deveria ser resgatado não quer sair de onde está
35. a vitória já aconteceu, e ninguém percebeu porque não se parece com vitória

**Perda e memória**

36. lembrar a verdade exige perder tudo o que veio depois dela
37. a prova procurada existe apenas na cabeça de quem já esqueceu
38. voltar continua sendo possível, mas não há mais para onde
39. todo mundo mudou de lugar, menos quem ficou esperando
40. a casa continua lá, intacta, e é isso que torna impossível voltar

---

## Apêndice B — Exemplos validados

Gerados com peças reais do acervo, já com as regras de redação aplicadas:

> Num **espaço de vício e fuga**, sob **conflitos de identidade**, **a Transumana** descobre que
> *a lembrança mais antiga que possui foi plantada, e plantada com capricho*.

> Numa **praça de doutrinação**, sob **memória histórica alterada**, **o Guardião da Memória**
> descobre que *a assinatura no documento que condenou todo mundo é a sua*.

> Numa **comunidade fortificada**, sob **dilemas éticos de sobrevivência**, **a Médica** descobre
> que *salvar a maioria exige entregar exatamente quem confiou primeiro*.

> Numa **ruína antiga**, sob **a busca por artefatos ancestrais**, **a Colecionadora de
> Artefatos** descobre que *a única ferramenta capaz de vencer cobra um pedaço de quem a usa*.

> Num **abrigo subterrâneo**, sob **propaganda estatal massiva**, **o Agente Corporativo**
> descobre que *o outro lado tem razão, e provar isso não muda o que precisa ser feito*.
> — modo misturar mundos: cenário pós-apocalíptico, elemento distópico, arquétipo cyberpunk.
