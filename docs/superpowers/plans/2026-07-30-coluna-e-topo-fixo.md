# Coluna de conteúdo e topo fixo — Plano de Implementação

> **Para quem executa com agentes:** SUB-SKILL OBRIGATÓRIA: use
> superpowers:subagent-driven-development (recomendado) ou
> superpowers:executing-plans para implementar tarefa por tarefa. Os passos usam
> caixas (`- [ ]`) para acompanhamento.

**Objetivo:** limitar a página a uma coluna de 1280px centralizada e deixar a
barra do topo sempre visível ao rolar.

**Arquitetura:** dois tokens novos em `:root` (`--largura-conteudo` e `--recuo`)
alimentam o `padding-inline` das três faixas — barra do topo, `<main>` e rodapé
—, que continuam com fundo de ponta a ponta enquanto só o conteúdo se alinha à
coluna. A barra do topo vira `position: sticky`, o que exige tirar o
`overflow-x: hidden` do `body`, dar `z-index` à barra, torná-la opaca no tema
claro e acertar duas coisas que passam a aterrissar atrás dela.

**Pilha:** Astro 7, CSS puro com tokens em `:root`, sem framework de interface e
sem dependência de runtime no cliente. Vitest cobre as funções puras de
`src/lib/`.

**Spec:** [2026-07-30-coluna-e-topo-fixo-design.md](../specs/2026-07-30-coluna-e-topo-fixo-design.md)

## Sobre a ausência de testes automatizados neste plano

Nenhuma tarefa aqui escreve teste de vitest, e isso é deliberado: o trabalho é
inteiramente geometria e cor em CSS, e o repositório não tem — nem este plano
introduz — arreio de teste visual ou de DOM renderizado. A suíte existente cobre
funções puras (`src/**/*.test.ts`) e **nenhuma delas deve mudar de resultado**;
rodá-la é verificação de regressão, não de funcionalidade nova.

Escrever `expect(css).toContain('padding: 16px var(--recuo)')` seria teatro: o
teste passaria com a regra em qualquer lugar do arquivo, inclusive num seletor
que não casa com nada.

O que substitui o teste, em cada tarefa:

1. `npm run check` e `npx vitest run` — provam que nada quebrou.
2. `npm run build` — prova que as 39 páginas continuam gerando.
3. Uma lista de conferências no navegador, com larguras e observações exatas.
4. Registro em [docs/verificacao-visual.md](../../verificacao-visual.md), que é
   a forma estabelecida de verificação visual deste repositório — a seção "Tela
   estreita (360px)" já é feita assim, por leitura do CSS.

## Restrições globais

Valem para toda tarefa deste plano, vindas do [CLAUDE.md](../../../CLAUDE.md) e
do spec:

- **Tudo em português do Brasil**: identificadores, comentários e mensagens de
  commit no imperativo ("Adiciona busca global"). O repositório **não** usa
  Conventional Commits — nada de `feat:` nem `fix:`.
- **Sem framework de interface e sem dependência de runtime no cliente.** Este
  plano não adiciona uma linha de JavaScript.
- **Toda cor vem de token em `:root`.** Nenhum valor de cor literal em
  componente. Cor de acento se pede por papel (`--destaque`, `--apoio`), nunca
  por `--ouro`/`--violeta`.
- **`prefers-reduced-motion` respeitado** por qualquer animação. Este plano não
  cria animação nenhuma.
- **Node ≥ 22.12.** `npx vitest run` e `npm run check` precisam passar antes de
  empurrar — são o portão do [deploy.yml](../../../.github/workflows/deploy.yml).
- **Nenhum ajuste em `--painel`, na opacidade da aurora ou nos trios de cores
  dos mundos.** A única mudança de cor do plano é qual token o `.nav` consome no
  tema claro (Task 2), que cai num valor já medido.
- **Comentário no CSS é obrigatório em toda decisão não óbvia.** É o padrão do
  arquivo: cada valor delicado carrega o porquê e o que foi descartado. Os
  comentários deste plano vêm escritos; copie-os.

### Estado do repositório ao começar

O branch é `largura-maxima`, com o spec já commitado. Três arquivos chegam com
edições **pendentes e não relacionadas** a este plano: `CLAUDE.md`, `README.md` e
`docs/verificacao-visual.md`. A Task 0 os tira do caminho para que nenhum commit
deste plano os carregue por acidente.

## Estrutura de arquivos

| Arquivo | Responsabilidade | Tarefas |
|---|---|---|
| `src/styles/global.css` | Tokens (`--largura-conteudo`, `--recuo`) e o `overflow` do `body`/`html` | 1, 2 |
| `src/layouts/Base.astro` | `padding` do `<main>` e do `.rodape` | 1 |
| `src/components/Nav.astro` | `padding`, `position: sticky`, `z-index`, fundo no tema claro, teto do menu aberto | 1, 2, 4 |
| `src/pages/mundos/[subgenero].astro` | `scroll-margin-top` das quatro seções | 3 |
| `docs/verificacao-visual.md` | Registro das superfícies e da tela estreita | 2, 4 |

Nenhum arquivo é criado. Nenhum HTML muda — todas as mudanças são declarações
CSS, exceto as de documentação.

---

## Task 0: Separar as edições pendentes

Tarefa preparatória, sem mudança de comportamento. Existe para que os commits das
tarefas seguintes contenham só o trabalho deste plano.

**Arquivos:**
- Commit: `CLAUDE.md`, `README.md`, `docs/verificacao-visual.md` (edições que já
  estavam na árvore de trabalho)

- [ ] **Passo 1: Ver o que está pendente**

```bash
git status --short
git diff --stat
```

Esperado: os três arquivos como ` M`, com cerca de 92 inserções somadas. As
mudanças em `docs/verificacao-visual.md` são renomeações de token já concluídas
(`--tinta` → `--fundo`, `--papel` → `--texto-forte`); em `README.md`, o texto do
site publicado; em `CLAUDE.md`, seções novas de documentação do repositório.

Se `git status --short` não listar nenhum dos três, a autora já os commitou —
esta tarefa não tem o que fazer, siga para a Task 1.

- [ ] **Passo 2: Commitar os três juntos**

```bash
git add CLAUDE.md README.md docs/verificacao-visual.md
git commit -m "Atualiza a documentação do repositório e os nomes dos tokens"
```

- [ ] **Passo 3: Confirmar a árvore limpa**

```bash
git status --short
```

Esperado: nenhuma saída.

---

## Task 1: A coluna de conteúdo de 1280px

**Arquivos:**
- Modificar: `src/styles/global.css` (bloco `:root`, e o comentário de
  `.abertura`)
- Modificar: `src/layouts/Base.astro` (`main`, `.rodape`)
- Modificar: `src/components/Nav.astro` (`.nav`)

**Interfaces:**
- Produz: os tokens `--largura-conteudo: 1280px` e `--recuo`, consumidos pelo
  `padding-inline` das três faixas. A Task 2 não depende deles.

- [ ] **Passo 1: Declarar os dois tokens**

Em `src/styles/global.css`, dentro do bloco `:root`, logo **depois** da
declaração `--bloco: rgba(44, 34, 62, 0.45);` e antes do `}` que fecha o bloco:

```css

  /* A coluna de conteúdo. O recuo é os mesmos 20px de sempre e, quando a tela
     passa de 1320px (1280 da coluna + as duas margens), vira o que sobrar
     dividido em dois: a página para de crescer e o excesso vira margem. Abaixo
     de 1320px nada muda, o que preserva o ponto de quebra de 1079px da
     navegação e da lista de mundos.

     O 100% é resolvido onde o token é usado, não aqui — custom property é
     substituída como texto e a porcentagem só se resolve na propriedade que a
     recebe. Por isso --recuo vale para filho direto do <body>, onde 100% é a
     largura da tela: usá-lo dentro de um contêiner mais estreito daria um
     recuo silenciosamente errado. */
  --largura-conteudo: 1280px;
  --recuo: max(20px, calc((100% - var(--largura-conteudo)) / 2));
```

- [ ] **Passo 2: Alinhar o `<main>` e o rodapé**

Em `src/layouts/Base.astro`, no `<style>`, trocar as duas regras:

```css
  main {
    padding: 24px var(--recuo);
  }

  .rodape {
    padding: 20px var(--recuo);
    border-top: 2px solid var(--borda-suave);
    color: var(--apagado);
    font-size: 0.8rem;
  }
```

O espaçamento vertical não muda: continuam 24px no `main` e 20px no rodapé.

- [ ] **Passo 3: Alinhar a barra do topo**

Em `src/components/Nav.astro`, na regra `.nav`, trocar só a linha do `padding`:

```css
    padding: 16px var(--recuo);
```

O resto da regra — `display: flex`, `flex-wrap`, `align-items`,
`justify-content: space-between`, `gap`, `border-bottom`, `background`,
`backdrop-filter` — fica exatamente como está. O fundo e a borda continuam
atravessando a tela porque pertencem ao elemento; o recuo só empurra o conteúdo
para dentro.

- [ ] **Passo 4: Atualizar o comentário de `.abertura`**

Em `src/styles/global.css`, o comentário acima de `.abertura` afirma hoje que as
linhas não têm teto nenhum, o que deixa de ser verdade. Substituir o comentário
inteiro (a regra `max-width: none` **continua**, é escolha da autora):

```css
/* Sem limite de largura próprio por escolha da autora: o texto acompanha a
   extensão da página. Havia aqui um `max-width: 68ch`, a medida de linha
   confortável de leitura. As linhas param onde a coluna de conteúdo para —
   --largura-conteudo, 1280px, ou cerca de 145 caracteres —, bem mais largas
   que os 68ch, e é assim de propósito. */
.abertura {
  max-width: none;
}
```

- [ ] **Passo 5: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes passando em 9 arquivos; 0 erros, 0 avisos e 0 hints em 44
arquivos; 39 páginas geradas. Nenhum dos três números deve mudar — se um teste
falhar, o problema não é este plano.

- [ ] **Passo 6: Conferir no navegador que nada se moveu**

```bash
npm run dev
```

Com o painel de dispositivos do navegador, em `http://localhost:4321`:

| Largura | Esperado |
|---|---|
| 375px | Idêntico a antes: menu recolhido no hambúrguer, margem de 20px |
| 1079px | Idêntico a antes: menu ainda recolhido, lista de mundos da home ainda recolhida |
| 1280px | Idêntico a antes: menu aberto em fileira, margem de 20px |

Qualquer diferença aqui é bug: abaixo de 1320px o `max()` escolhe os 20px e o
resultado tem que ser o CSS de antes.

- [ ] **Passo 7: Conferir a coluna em tela grande**

Nas larguras 1440px, 1920px e 2560px, confirmar as quatro coisas:

1. A faixa do topo e a do rodapé continuam atravessando a tela — fundo, vidro
   fosco e bordas de ponta a ponta, sem margem visível dos lados.
2. POLARIS alinha na vertical com o `<h1>` da página e com o texto do rodapé.
3. A aurora cobre o fundo inteiro e continua girando (tema escuro).
4. Em 1920px, cerca de 320px de margem de cada lado; em 2560px, cerca de 640px.

Fazer isso em pelo menos três páginas de formato diferente: a home (`/`), uma
página de mundo (`/mundos/cyberpunk/`) e o gerador (`/gerador`).

- [ ] **Passo 8: Commitar**

```bash
git add src/styles/global.css src/layouts/Base.astro src/components/Nav.astro
git commit -m "Limita a página a uma coluna de 1280px em tela grande"
```

---

## Task 2: A barra do topo fixa

**Arquivos:**
- Modificar: `src/styles/global.css` (`body`)
- Modificar: `src/components/Nav.astro` (`.nav` e uma regra nova de tema claro)
- Modificar: `docs/verificacao-visual.md` (nota na seção do tema claro e na de
  tela estreita)

**Interfaces:**
- Consome: nada da Task 1 — as duas são independentes.
- Produz: a barra fixa. A Task 3 (âncoras) e a Task 4 (teto do menu) existem por
  causa dela e devem vir depois.

- [ ] **Passo 1: Tirar o `overflow-x` do `body`**

Em `src/styles/global.css`, a regra `body` começa hoje com `margin: 0;` seguido
de `overflow-x: hidden;`. Remover essa linha e deixar no lugar dela o comentário
que explica a ausência — sem ele, a linha volta na primeira limpeza de alguém
que estranhe a assimetria com o `html`:

```css
body {
  margin: 0;
  /* Sem `overflow-x: hidden` aqui, e não por descuido: com um eixo em hidden o
     body vira contêiner de rolagem próprio (o outro eixo computa para auto), e
     a barra do topo, que é sticky, passaria a se fixar em relação ao body em
     vez da tela — ou seja, subiria embora ao rolar. O hidden continua no
     <html>, cujo overflow é propagado para a viewport, e é lá que o transbordo
     da aurora é clipado. */
  background: var(--fundo);
```

O resto da regra `body` — `color`, `font-family`, o comentário longo do `dvh` e
o `min-height: 100dvh` — fica intocado.

- [ ] **Passo 2: Fixar a barra**

Em `src/components/Nav.astro`, acrescentar três declarações no **começo** da
regra `.nav`, antes do `display: flex`:

```css
  .nav {
    position: sticky;
    top: 0;
    /* Acima de qualquer descendente posicionado do <main>: o cadeado do gerador
       é absolute e, sem isto, pintaria por cima da barra ao rolar, porque vem
       depois na ordem do documento. A lista da busca (z-index: 20) segue
       funcionando dentro do contexto de empilhamento que este z-index cria. */
    z-index: 10;
    display: flex;
```

- [ ] **Passo 3: Tornar a barra opaca no tema claro**

Em `src/components/Nav.astro`, logo **depois** da regra `.nav` e antes de
`.nav__marca`, acrescentar:

```css
  /* No claro --painel é rgba(20, 24, 31, 0.05), e cinco por cento não seguram o
     texto que passa por baixo de uma barra fixa: ele apareceria atrás dos
     links. Aqui a barra é opaca, e o backdrop-filter sai junto porque não tem
     mais o que borrar — deixa de custar uma recomposição por quadro de
     rolagem, o mesmo raciocínio que tirou a aurora inteira do tema claro.

     Contraste: --painel não muda de valor, e esta superfície já está medida em
     docs/verificacao-visual.md, na coluna "sobre o fundo #f5f7f9" da tabela do
     tema claro — --texto em 11,47 e --texto-forte em 16,57. */
  :global(html[data-tema='claro']) .nav {
    background: var(--fundo);
    backdrop-filter: none;
  }
```

A forma `:global(html[data-tema='claro'])` é a que o arquivo já usa para as
outras trocas de tema (ver `.tema__sol` e `.tema__lua` no fim do `<style>`);
dentro de estilo escopado do Astro o seletor precisa do `:global()`.

- [ ] **Passo 4: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes, 0 erros de check, 39 páginas. Sem mudança.

- [ ] **Passo 5: Conferir a rolagem horizontal**

Este é o passo que valida a remoção do Passo 1, e é o único ponto do plano com
risco real. Com `npm run dev`, em `/arquetipos/cyberpunk/` (página longa e
larga), confirmar que **não** existe barra de rolagem horizontal e que não dá
para arrastar a página para o lado:

- tema escuro e tema claro;
- 375px, 1280px e 2560px de largura.

Se aparecer rolagem horizontal, **não** reponha o `overflow-x` no `body` — isso
desfaz a tarefa inteira. Descubra o que vaza (as ferramentas de desenvolvimento
mostram o elemento mais largo que a viewport) e conserte na origem. A suspeita
natural é a aurora, que é `position: fixed; inset: -45%`: elemento fixo não
entra na área de rolagem do documento nos navegadores atuais, e o
`overflow-x: hidden` que continua no `<html>` é propagado para a viewport e
clipa de qualquer jeito — então o esperado é que nada vaze.

O plano B do spec (`position: fixed` com espaço reservado) só entra se a rolagem
horizontal se mostrar impossível de evitar de outro jeito, e implica recalcular
o espaço reservado por media query, porque a altura da barra muda com a quebra
de linha. Não recorra a ele sem conversar com a autora.

- [ ] **Passo 6: Conferir a barra fixa**

Em `/arquetipos/cyberpunk/`, rolando até o meio da página:

1. A barra fica parada no topo, com os links e a busca alcançáveis.
2. No tema escuro ela lê como vidro fosco: o conteúdo por baixo vira borrão, sem
   texto legível atravessando.
3. No tema claro **nenhum** texto aparece através da barra.
4. Em `/gerador`, rolando com a página no meio: o cadeado das cartas passa por
   **baixo** da barra, nunca por cima.
5. A busca abre e a lista de resultados aparece sobre o conteúdo, não cortada.

- [ ] **Passo 7: Registrar as duas notas na documentação**

Em `docs/verificacao-visual.md`, na seção **Tema claro**, logo depois da tabela
de cinco linhas que termina em `` | `--apoio` | `#1b2a4a` azul-tinta | 13,24 | 11,99 | ``,
acrescentar:

```markdown
**A navegação passou para a primeira coluna.** Desde que a barra do topo é fixa
(`position: sticky`), o fundo dela no tema claro é `--fundo` opaco e não
`--painel`: cinco por cento de véu deixariam o texto rolando por baixo aparecer
atrás dos links. Então, no tema claro, a navegação se lê pela coluna "sobre o
fundo `#f5f7f9`". `--painel` não mudou de valor, e a coluna do painel continua
valendo para a lista de resultados da busca, que é o que ainda o usa aqui.
```

E na seção **Tela estreita (360px)**, o último item da lista diz hoje que
`html` e `body` têm `overflow-x: hidden`. Substituir esse item por:

```markdown
- `html` tem `overflow-x: hidden`, que impede a rolagem horizontal mesmo se algo
  vazar. O `body` **não** tem, de propósito: com um eixo em hidden ele viraria
  contêiner de rolagem e a barra do topo, que é sticky, se fixaria em relação a
  ele em vez da tela. O hidden do `html` é propagado para a viewport e clipa
  igual.
```

- [ ] **Passo 8: Commitar**

```bash
git add src/styles/global.css src/components/Nav.astro docs/verificacao-visual.md
git commit -m "Fixa a barra do topo ao rolar a página"
```

---

## Task 3: As âncoras do sumário dos mundos

**Arquivos:**
- Modificar: `src/pages/mundos/[subgenero].astro` (`<style>`)

**Interfaces:**
- Consome: a barra fixa da Task 2. Sem ela esta tarefa não tem efeito visível.

Contexto: o sumário de `/mundos/[subgenero]/` salta para `#arquetipos`,
`#cenarios`, `#elementos` e `#livros`, que são `<section>` sem
`scroll-margin-top`. Com a barra fixa, o `<h2>` da seção aterrissa atrás dela.
Os verbetes já estão resolvidos — `Cartao.astro` tem `scroll-margin-top: 96px`,
que é o que a busca usa.

- [ ] **Passo 1: Reproduzir o problema**

Com `npm run dev`, abrir `/mundos/cyberpunk/` e clicar em "Cenários" no sumário.
Esperado **antes** da correção: o título "CENÁRIOS" fica escondido atrás da
barra do topo, e o primeiro verbete aparece grudado nela.

Se o título aparecer inteiro, confirme que a Task 2 está aplicada — sem a barra
fixa não há o que corrigir aqui.

- [ ] **Passo 2: Dar folga às quatro seções**

Em `src/pages/mundos/[subgenero].astro`, no `<style>`, acrescentar depois da
regra `section + section`:

```css
  /* As quatro seções são alvo do sumário logo acima. Sem folga, o <h2> para
     debaixo da barra fixa do topo. Os mesmos 96px do scroll-margin-top dos
     verbetes em Cartao.astro, pelo mesmo motivo: a barra recolhida tem cerca de
     68px e o resto é respiro. */
  section[id] {
    scroll-margin-top: 96px;
  }
```

- [ ] **Passo 3: Conferir os quatro atalhos**

Recarregar `/mundos/cyberpunk/` e clicar nos quatro links do sumário —
Arquétipos, Cenários, Elementos Narrativos, Livros. Em cada um, o `<h2>` da
seção precisa aparecer inteiro, abaixo da barra, com folga visível.

Repetir em `/mundos/viagem-no-tempo/` para confirmar que vale para as seis
páginas de mundo, que saem todas da mesma rota.

- [ ] **Passo 4: Conferir o salto da busca**

A outra família de âncoras do site é a da busca, que salta para o verbete —
`/arquetipos/space-opera/#o-capitao-estrategico`, por exemplo. Ela já deveria
estar certa, porque `Cartao.astro` tem `scroll-margin-top: 96px` desde antes
deste plano, mas é o mesmo tipo de falha e precisa de confirmação, não de
suposição.

Abrir a busca, procurar "capitão", escolher o resultado e conferir que o título
do verbete aparece inteiro, abaixo da barra. Repetir com um livro ("duna"), que é
o único tipo com vários parágrafos no corpo.

Se algum dos dois aterrissar atrás da barra, o valor de 96px é que está curto —
meça a altura real da barra e ajuste `scroll-margin-top` nos dois lugares
(`Cartao.astro` e a regra nova do Passo 2), mantendo os dois com o mesmo número.

- [ ] **Passo 5: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
```

Esperado: 75 testes, 0 erros.

- [ ] **Passo 6: Commitar**

```bash
git add src/pages/mundos/
git commit -m "Impede que o sumário do mundo aterrisse atrás da barra"
```

---

## Task 4: O teto do menu aberto em tela estreita

**Arquivos:**
- Modificar: `src/components/Nav.astro` (media query `max-width: 1079px`)
- Modificar: `docs/verificacao-visual.md` (seção de tela estreita)

**Interfaces:**
- Consome: a barra fixa da Task 2.

Contexto: os sete links e a busca vivem dentro do próprio `<header>` e aparecem
por `display`, então quem cresce quando o menu abre é a barra — vai a uns 400px
em 375px de largura. Em celular de pé isso é confortável; em paisagem, com 375px
de altura, a barra fica maior que a tela, e um elemento sticky grudado no topo
não se move mais: os últimos links passam do fim da tela e não há como rolar até
eles.

- [ ] **Passo 1: Reproduzir o problema**

Com `npm run dev` e o painel de dispositivos em **667×375** (paisagem de
celular), abrir o menu no hambúrguer. Esperado **antes** da correção: os últimos
links da lista ficam abaixo do fim da tela e não há como alcançá-los — a página
rola, a barra não.

- [ ] **Passo 2: Dar um teto à lista de links**

Em `src/components/Nav.astro`, dentro da media query `@media (max-width: 1079px)`,
na regra `.nav__abrir[aria-expanded='true'] ~ .nav__links`, acrescentar as duas
declarações no fim do bloco:

```css
    .nav__abrir[aria-expanded='true'] ~ .nav__links {
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
      order: 5;
      /* Com a barra fixa, o menu aberto não pode passar da tela: sticky grudado
         no topo não se move, e o que sobrar embaixo fica inalcançável. Acontece
         em celular na horizontal, onde a altura é 375px e a barra aberta pede
         uns 400px.

         Os 150px são o que fica acima e abaixo da lista dentro da barra: 16px
         de recuo, ~36px da fileira da marca, 12px de intervalo, ~44px da busca,
         12px de intervalo e 16px de recuo.

         O teto vai na lista, e não no <header>: .busca__lista é absolute dentro
         da busca, e overflow-y no header cortaria os resultados em vez de
         deixá-los sobrepor a página. Em tela de pé a lista cabe e nada disto
         entra em ação. */
      max-height: calc(100dvh - 150px);
      overflow-y: auto;
    }
```

- [ ] **Passo 3: Conferir nas duas orientações**

Com o menu aberto:

| Viewport | Esperado |
|---|---|
| 375×667 (de pé) | Os sete links visíveis sem rolagem interna, como antes |
| 667×375 (paisagem) | A lista rola por dentro; todos os sete links alcançáveis; o último é "Sobre" |

Se em 375×667 aparecer rolagem interna na lista, os 150px estão altos demais
para essa altura — meça a barra nas ferramentas de desenvolvimento e ajuste o
valor, mantendo o comentário coerente com o número novo.

- [ ] **Passo 4: Conferir que a busca não foi cortada**

Ainda em 667×375, com o menu aberto, digitar "duna" no campo de busca. A lista
de resultados precisa aparecer inteira, sobrepondo a página, **não** cortada
dentro da barra nem presa à rolagem da lista de links.

- [ ] **Passo 5: Rodar o portão do repositório**

```bash
npx vitest run
npm run check
npm run build
```

Esperado: 75 testes, 0 erros, 39 páginas.

- [ ] **Passo 6: Registrar na documentação**

Em `docs/verificacao-visual.md`, na seção **Tela estreita (360px)**, acrescentar
um item ao fim da lista:

```markdown
- O menu aberto tem teto: `.nav__links` no estado expandido é
  `max-height: calc(100dvh - 150px)` com rolagem interna. Sem isso, em celular
  na horizontal (375px de altura) a barra aberta passaria da tela e, sendo
  sticky, deixaria os últimos links inalcançáveis.
```

- [ ] **Passo 7: Commitar**

```bash
git add src/components/Nav.astro docs/verificacao-visual.md
git commit -m "Impede que o menu aberto passe da tela no celular"
```

---

## Depois do plano

Duas coisas que ficam de fora de propósito:

**Uma linha no CLAUDE.md.** A seção "Estilo nas páginas" merece registrar o
token, porque a limitação dele não é adivinhável: *"A coluna de conteúdo é
`--largura-conteudo` (1280px) e o recuo que a centraliza é `--recuo`, consumido
pelo `padding-inline` das três faixas — barra do topo, `main` e rodapé. O `100%`
dentro do token se resolve no ponto de uso, então ele só vale para filho direto
do `<body>`."* Ficou fora das tarefas para não misturar o commit com as edições
pendentes daquele arquivo; entra depois da Task 0, quando quiser.

**O fundo da lista de busca no tema claro.** A `.busca__lista` usa `--painel`, os
mesmos 5% que motivaram a Task 2, e ela também sobrepõe conteúdo. É problema
anterior a este plano — a lista já flutua sobre a página hoje —, então não entra
aqui, mas é o próximo lugar onde o mesmo raciocínio se aplica.
