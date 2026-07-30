# Gerador de prompt para IA — Documento de Design

**Data:** 30 de julho de 2026
**Autoria do conteúdo:** Julia
**Situação:** design aprovado, pronto para virar plano de implementação

---

## 1. O que muda

Duas coisas, pedidas pela autora:

1. **Os botões mudam de lugar.** Hoje "Gerar" e "Copiar" ficam juntos no fim da
   página, abaixo de tudo. Cada botão passa a ficar centralizado no rodapé do
   bloco a que pertence.
2. **A página ganha um card de prompt.** Um texto longo, escrito pela autora,
   com os quatro valores do sorteio encaixados nele, pronto para colar numa IA.

## 2. A descoberta que mudou o desenho

O card hoje chamado "Dica de enredo" **não** contém uma dica curta: ele contém a
premissa, a frase que `redigir()` monta com as peças sorteadas. Essa frase é a
razão de existir de [redacao.ts](../../../src/lib/gerador/redacao.ts) — contração
de preposição, gênero pelo artigo, número por heurística de superfície — com 213
linhas de teste, e de duas regras de esquema: `arquetipos.nome` começar com
"A "/"O " e `cenarios.singular` existir.

Substituir o conteúdo daquele card, como a leitura literal do pedido sugeria,
apagaria a premissa do site e deixaria tudo isso órfão. **Decisão da autora: a
premissa fica**, e o prompt entra como card novo abaixo dela.

## 3. Decisões tomadas

| Decisão | Escolha |
|---|---|
| A premissa | Fica, em card próprio, agora intitulado "Premissa" |
| O prompt | Card novo, "Crie enredos com sua IA favorita", depois da premissa |
| Botões | Um por bloco, centralizado no rodapé do próprio bloco |
| Copiar | Dois botões: um para a premissa, um para o prompt |
| Texto do prompt | Em `src/content/paginas/prompt-ia.md`, não no `.astro` |
| Montagem | Duas funções puras em `src/lib/gerador/`, com testes |
| `[MUNDO]` misturando | Os mundos de fato usados, sem repetir, unidos por " + " |

## 4. A ordem da página

```
Opções do sorteio

┌─ peças sorteadas ─────────────────────┐
│  Arquétipo / Cenário / Elemento       │
│              [Gerar]                  │
└───────────────────────────────────────┘

┌─ Premissa ────────────────────────────┐
│  Numa megacidade superpovoada, ...    │
│         [Copiar premissa]             │
└───────────────────────────────────────┘

┌─ Crie enredos com sua IA favorita ────┐
│  Você é um roteirista de ficção ...   │
│          [Copiar prompt]              │
└───────────────────────────────────────┘
```

Cada botão fica **dentro** do seu bloco, no rodapé, centralizado. Os três seguem
o mesmo padrão: conteúdo, depois a ação que pertence àquele conteúdo.

O aviso de "copiado" deixa de ser um só no fim da página: cada botão de copiar
tem o seu, logo abaixo dele, para a confirmação aparecer onde a pessoa clicou.

O card da premissa troca de título, de "Dica de enredo" para **"Premissa"** — o
nome antigo agora descreveria melhor o card novo, e dois cards disputando a
mesma ideia confundem.

## 5. Onde o texto do prompt mora

Em **`src/content/paginas/prompt-ia.md`**, com os marcadores no meio do corpo:

```markdown
---
titulo: "Prompt para IA"
ordem: 8
---

Você é um roteirista de ficção científica experiente. Crie um enredo estruturado
usando os seguintes elementos sorteados como restrições criativas obrigatórias:

- Mundo: [MUNDO]
- Arquétipo (personagem): [ARQUÉTIPO]
...
```

O corpo é lido como **texto cru** (`entrada.body`), nunca renderizado como
Markdown — o que a IA recebe é o texto como está escrito. A página lê o arquivo
em tempo de build e injeta o texto na página junto com os pools, no mesmo bloco
`<script type="application/json">` que o acervo já usa: zero requisição em tempo
de execução, como o projeto exige.

Isso segue a regra de que prosa autoral não mora em `.astro`, e tem um ganho
prático: prompt é coisa que se ajusta com o uso, e ajustar passa a ser editar um
arquivo de texto.

**Cuidado na criação do arquivo:** o texto da autora foi entregue entre linhas
de `---`. Aquilo era delimitador da mensagem, não parte do prompt — e um `---`
no início do corpo colidiria com o frontmatter. O corpo começa em "Você é um
roteirista".

## 6. A montagem

Duas funções puras novas em [src/lib/gerador/](../../../src/lib/gerador/),
exportadas por `index.ts` como todo o resto:

### `nomearMundos(sorteio, opcoes, nomes): string`

Produz o valor de `[MUNDO]`.

- Sem "Misturar mundos": o nome do mundo escolhido no seletor.
- Com "Misturar mundos": os mundos de fato usados pelas três peças, na ordem
  arquétipo → cenário → elemento, sem repetir, unidos por `" + "`.
- `nomes` é um mapa de identificador para nome de exibição
  (`space-opera` → `Space Opera`), injetado pela página a partir da coleção.
- **O pool `comuns` nunca entra na lista.** Ele não é um mundo — é o conjunto
  dos 20 arquétipos comuns, e "Distopia + 20 Arquétipos Comuns" não descreve
  mundo nenhum. Com "Misturar mundos" ligado um arquétipo comum pode ser
  sorteado, e nesse caso ele simplesmente não contribui com nome.

### `montarPrompt(modelo, valores): string`

Troca `[MUNDO]`, `[ARQUÉTIPO]`, `[CENÁRIO]` e `[ELEMENTO NARRATIVO]` pelos
valores do sorteio atual.

Se sobrar algum marcador depois da substituição, a função **lança erro** em vez
de devolver o texto pela metade. É o que transforma um erro de digitação no
`prompt-ia.md` (`[ARQUETIPO]` sem acento, por exemplo) em falha visível de teste,
em vez de um prompt que chega na IA com um `[ARQUETIPO]` cru no meio.

"Marcador" tem definição estreita, para a checagem não atrapalhar quem escreve:
colchetes contendo **só letras maiúsculas, acentuadas ou não, e espaços**. É a
convenção dos quatro que existem. Um `[ver nota]` em minúsculas no meio da prosa
não é marcador e passa intacto — a autora pode escrever colchetes no texto sem
que o prompt pare de funcionar.

O `<script>` da página só liga as duas ao DOM, como todos os outros do site.

## 7. Comportamento

O prompt é remontado dentro do mesmo `pintar()` que já redesenha as cartas e a
premissa, então acompanha sozinho o botão "Gerar" e a troca de qualquer opção do
formulário. Travar ou destravar um cadeado não redesenha nada hoje — o
re-sorteio acontece no "Gerar" —, e é lá que o prompt se atualiza junto.

"Copiar premissa" copia a frase; "Copiar prompt" copia o prompt inteiro montado.
Cada um escreve no seu próprio aviso.

**O prompt não recebe `aria-live`.** A premissa tem, e faz sentido: são duas
linhas. O prompt tem cerca de trezentas palavras, e anunciá-lo inteiro a cada
"Gerar" tornaria a página inutilizável com leitor de tela.

**O prompt é exibido com `white-space: pre-wrap`.** Sem isso as quebras de linha
somem e a estrutura numerada vira um bloco único ilegível. Não é bloco de código
— nada de fonte monoespaçada nem moldura de `<pre>`; é o texto do card, com as
quebras que a autora escreveu preservadas.

## 8. O que não muda

- A premissa e todo o motor de concordância.
- O sorteio, as travas, "Misturar mundos" e "Incluir os 20 arquétipos comuns".
- Nenhuma cor, tamanho de fonte ou opacidade da aurora — as contas de
  [verificacao-visual.md](../../verificacao-visual.md) não são refeitas.
- Nenhuma dependência nova; nada é carregado em tempo de execução.

## 9. Fora de escopo

- **Compartilhar ou salvar o prompt.** O gerador é efêmero por decisão de
  projeto: nada é escrito no navegador.
- **Escolher entre vários modelos de prompt.** Um só, editável no Markdown.
- **Botão de copiar na página com confirmação visual elaborada.** O aviso de
  texto que já existe basta.

## 10. Verificação

Diferente dos dois trabalhos anteriores, **este plano tem teste de verdade**: as
duas funções novas são puras e vivem em `src/lib/`, onde a suíte já alcança.
Casos que precisam existir:

- `nomearMundos` sem misturar devolve o nome do seletor.
- `nomearMundos` misturando, com as três peças do mesmo mundo, devolve um nome
  só — não o mesmo nome três vezes.
- `nomearMundos` misturando, com peças de dois e de três mundos, devolve dois e
  três nomes na ordem arquétipo → cenário → elemento.
- `nomearMundos` ignora um arquétipo do pool `comuns`.
- `montarPrompt` troca os quatro marcadores.
- `montarPrompt` lança quando o modelo tem um marcador em maiúsculas que ela não
  conhece — `[ARQUETIPO]` sem acento é o caso real que motivou a regra.
- `montarPrompt` deixa passar colchetes em minúsculas no meio da prosa, que não
  são marcadores.

`npm run build` valida o frontmatter do arquivo novo contra o Zod — e vale
lembrar que `esquemaPagina` agora é `.strict()`, então um campo a mais no
frontmatter quebra o build de propósito.

No navegador: a ordem dos três blocos e dos três botões, cada botão centralizado
no rodapé do seu; o prompt com as quebras de linha preservadas e os quatro
valores encaixados; o prompt mudando junto a cada "Gerar"; os dois botões de
copiar levando o texto certo para a área de transferência; e o caso de misturar
mundos mostrando mais de um nome em "Mundo:".
