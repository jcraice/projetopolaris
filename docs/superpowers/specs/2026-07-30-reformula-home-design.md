# Reformulação da home, textos de Estilos e cantos arredondados — Documento de Design

**Data:** 30 de julho de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. O que muda

Quatro mudanças independentes, pedidas pela autora:

1. A home é reescrita — texto novo, ordem nova, e o gerador vira card.
2. `Estilos & Combinações` ganha um texto de abertura e um de fechamento.
3. Nas páginas de índice de arquétipos, cenários e elementos, o "Como usar esta
   página" desce para depois da lista de subgêneros.
4. Botões e cards ganham cantos arredondados.

Nada disso mexe em cor, tamanho de fonte ou opacidade da aurora, então as contas
de [verificacao-visual.md](../../verificacao-visual.md) não precisam ser
refeitas.

## 2. Decisões tomadas

| Decisão | Escolha |
|---|---|
| Onde a prosa nova mora | `src/content/paginas/`, nunca em `.astro` |
| Seção "Os mundos" na home | Mantida, depois dos três cards |
| Citação da home | Sem autoria |
| Raio dos cantos | 8px em botões e cards, 4px nas peças miúdas |
| Chamada do gerador na home | Texto atual preservado, movido para o Markdown |
| Texto do `sobre.md` | Inalterado |

## 3. Onde a prosa mora

A regra do projeto é que texto autoral não vive em componente. A home é hoje a
exceção torta: ela pesca dois parágrafos do `sobre.md` casando pelo início do
texto (`paragrafoComPrefixo()`) e traz a chamada do gerador escrita direto no
`.astro`. A reformulação substitui os dois, então a home passa a ter arquivo
próprio.

**`src/content/paginas/home.md`** (novo):

```markdown
---
titulo: "Projeto Polaris: Arquétipos da Ficção Científica"
subtitulo: "Recursos narrativos. Sua imaginação dita as regras."
chamadaGerador: "Dê vida a novas tramas. O sistema alinha um arquétipo, um cenário e um elemento narrativo do universo da sua escolha, criando a centelha inicial para a sua história."
citacao: "A ficção científica oferece uma chance de escapar, mas também de refletir sobre o mundo em que vivemos."
ordem: 1
---

Funcionando como um catálogo, o Projeto Polaris reúne arquétipos de personagens,
cenários e elementos narrativos cuidadosamente organizados por subgêneros, desde
Space Operas grandiosas até Distopias e Cyberpunk. Cada arquétipo é uma base
pronta para ser adaptada, misturada ou reinventada, servindo como ponto de
partida para construir universos complexos e personagens memoráveis.

**Como usar:**

- 🧭 Explore os arquétipos para entender seus traços e funções narrativas.
- 🗺️ Consulte os cenários para visualizar ambientes ricos em detalhes.
- 🧩 Combine elementos narrativos para desenvolver conflitos, tecnologias e interações sociais.
- 💡 Use as sugestões e exemplos como inspiração, mas sinta-se livre para adaptar tudo ao seu estilo criativo.
```

Os três campos curtos ficam no frontmatter porque são frases soltas que a página
encaixa em lugares diferentes da estrutura, e não texto corrido — mesma solução
que `esquemaSubgenero` já usa para `citacao`, `citacaoAutor` e
`aberturaArquetipos`. O que é prosa contínua fica no corpo.

`esquemaPagina` em [schemas.ts](../../../src/lib/schemas.ts) ganha os três campos
como opcionais, com um comentário registrando que só `home.md` os usa hoje.

Efeito prático para a autora: a home inteira passa a se editar num arquivo de
texto, sem tocar em código.

## 4. A home

Ordem final de [index.astro](../../../src/pages/index.astro):

1. `<h1>` com `titulo`
2. Subtítulo com `subtitulo`
3. O corpo do Markdown: parágrafo de apresentação e a lista **Como usar**
4. Os três cards — Arquétipos, Cenários, Elementos Narrativos — **sem** o título
   "Comece por aqui" que existe hoje
5. A seção "Os mundos", inalterada, com o botão que recolhe a lista em tela
   estreita
6. O card do Gerador
7. A citação, sem autoria

O bloco do gerador hoje é uma seção com barra lateral de `--apoio`
(`.cta-gerador`). Passa a ser um card com o mesmo tratamento dos três de cima:
mesmo contorno, mesmo preenchimento, mesmo raio. Continua com o botão principal
dentro.

A citação usa `<blockquote>`, que já tem estilo global (barra de `--destaque` à
esquerda, itálico). Sem `<cite>`, porque não há autoria.

**Aba do navegador.** `Base.astro` monta o título como `{titulo} · Projeto
Polaris`, e a home passa hoje a string `"Projeto Polaris"` — a aba já diz
"Projeto Polaris · Projeto Polaris". Com o título novo ficaria longo e repetido,
então a home passa a mandar `"Início"` para o `Base`, e usa o `titulo` do
Markdown só no `<h1>`.

## 5. Estilos & Combinações

Os dois textos são da autora e entram verbatim em
[estilos.md](../../../src/content/paginas/estilos.md).

**Abertura**, antes do primeiro `<div class="bloco">`:

> Mais do que regras rígidas, a ficção científica é feita de possibilidades. Aqui
> você encontra breves conceitos sobre estilos variados e sugestões de
> combinações criativas entre subgêneros, servindo como uma fonte extra de ideias
> para expandir seus horizontes narrativos.

**Fechamento**, depois do segundo bloco, dentro de um card transparente:

> ***Combine** estilos e subgêneros de acordo com o **tom, mensagem** e
> **universo desejados**. Reflita sobre como diferentes abordagens influenciam os
> papéis dos personagens, os conflitos e até as soluções encontradas nas
> histórias.*
>
> *Misture elementos, experimente estilos e descubra novas possibilidades
> narrativas. A criatividade na ficção científica está justamente em cruzar
> fronteiras, de universos, ideias e estilos!*

O negrito dentro do itálico é Markdown e sai formatado.

O "card transparente" é uma variante nova de `.bloco` em
[global.css](../../../src/styles/global.css):

```css
.bloco--vazado {
  background: none;
  border: 2px solid var(--borda-suave);
}
```

Mesmo espaçamento interno do `.bloco`, contorno em vez de preenchimento. A
distinção importa porque este card fica logo abaixo de dois blocos preenchidos:
se fosse igual a eles, viraria um terceiro bloco de conteúdo em vez de um
fechamento.

No Markdown ele se escreve `<div class="bloco bloco--vazado">`, seguindo a
marcação que a página já usa — e valem as mesmas regras que o comentário no topo
daquele arquivo já registra: linha em branco antes e depois, e cada abertura com
o seu fechamento.

## 6. Os três índices

`arquetipos.md`, `cenarios.md` e `elementos.md` têm hoje a abertura e a seção
`## COMO USAR ESTA PÁGINA?` no mesmo arquivo, e a página renderiza o arquivo
inteiro de uma vez com `<Content />` — não há como intercalar a lista de
subgêneros no meio dele.

Cada uma passa a ter dois arquivos:

| Página | Abertura | Como usar |
|---|---|---|
| Arquétipos | `arquetipos.md` | `arquetipos-como-usar.md` |
| Cenários | `cenarios.md` | `cenarios-como-usar.md` |
| Elementos | `elementos.md` | `elementos-como-usar.md` |

O conteúdo é movido, não reescrito: o `## COMO USAR ESTA PÁGINA?` e seus itens
saem de um arquivo e entram no outro, intactos, incluindo o cabeçalho.

As três páginas de índice passam a montar: abertura → lista de subgêneros → como
usar. Cada `getEntry` novo segue o padrão que as páginas já usam — estoura o
build com mensagem explícita se a entrada sumir, em vez de renderizar vazio.

`livros.md` não tem seção "como usar" e fica como está. A página de Livros não é
tocada.

## 7. Cantos arredondados

Dois tokens novos em `:root`:

```css
--raio: 8px;
--raio-pequeno: 4px;
```

Aplicados em:

| Peça | Onde | Raio |
|---|---|---|
| `.botao` (todos) | global.css | `--raio` |
| `.bloco` e `.bloco--vazado` | global.css | `--raio` |
| `.lista-subgeneros a` (retângulos de mundo) | global.css | `--raio` |
| `.etiqueta` (arquétipo felino) | global.css | `--raio-pequeno` |
| `.pilar` (os três cards) | index.astro | `--raio` |
| card do Gerador | index.astro | `--raio` |
| `.abrir-mundos` | index.astro | `--raio` |
| `.busca__campo` e `.busca__lista` | Busca.astro | `--raio` |
| `.nav__abrir` e `.tema` (botões de ícone) | Nav.astro | `--raio` |
| `#opcoes select` e `.cadeado` | gerador.astro | `--raio` |

A sombra deslocada dos botões (`box-shadow: 3px 3px 0`) fica: ela acompanha o
canto arredondado e continua lendo como pôster.

As cartas do gerador (`.carta`) não têm contorno nem preenchimento desde que as
molduras saíram, então não há canto para arredondar.

## 8. O que sai junto

Com a home deixando de pescar parágrafos do `sobre.md`, `paragrafoComPrefixo()`
em [texto.ts](../../../src/lib/texto.ts) fica sem nenhum consumidor. Saem os três
juntos:

- a função;
- os casos dela em [texto.test.ts](../../../src/lib/texto.test.ts);
- o trecho do [CLAUDE.md](../../../CLAUDE.md) que descreve o mecanismo e declara
  os prefixos do `sobre.md` como contrato.

Deixar código morto que a documentação ainda anuncia como contrato é pior que
não ter o mecanismo: o próximo a editar `sobre.md` seria avisado de uma regra que
não vale mais.

**O texto do `sobre.md` não muda.** Ele só deixa de ser fonte da home.

O guard de build que a home tem hoje — estourar se o parágrafo "Meu desejo..."
sumir — sai junto, porque o parágrafo deixa de ser dependência. Em lugar dele
fica o guard equivalente para a entrada `home`.

## 9. Fora de escopo

- **A página de Livros**, que não tem "como usar" e não foi citada.
- **O texto do `sobre.md`** e a página Sobre.
- **Qualquer ajuste de cor, tamanho de fonte ou aurora.** O trabalho é texto e
  geometria de canto.
- **A lista da busca no tema claro**, que continua usando `--painel` a 5% —
  problema anterior, já registrado como próximo passo natural.

## 10. Verificação

`npx vitest run` e `npm run check` continuam sendo o portão, e `npm run build` é
o que valida o frontmatter novo contra o Zod — inclusive os três campos novos de
`esquemaPagina` e as três entradas `-como-usar`. A suíte perde os três casos de
`paragrafoComPrefixo` em `texto.test.ts`, então o total esperado cai de **75 para
72**, e `texto.test.ts` fica só com os dois casos de `paraAncora`. Qualquer outro
número é problema.

No navegador:

- **Home:** a ordem das sete peças; os emojis aparecendo na lista; o card do
  gerador com o mesmo tratamento dos três de cima; a citação em itálico com a
  barra à esquerda; a aba dizendo "Início · Projeto Polaris".
- **Estilos:** abertura antes do primeiro bloco, card vazado no fim, negrito e
  itálico saindo formatados e não como asteriscos crus.
- **Índices:** nas três páginas, "Como usar esta página" depois dos subgêneros,
  com o conteúdo intacto.
- **Cantos:** os dois temas, conferindo que a sombra deslocada dos botões
  acompanha o canto e que nada ficou com canto vivo no meio de peças
  arredondadas.
- **Tela estreita e tela grande**, para confirmar que a coluna de 1280px e a
  barra fixa, recém-terminadas, continuam intactas.
