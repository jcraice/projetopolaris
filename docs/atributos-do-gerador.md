# Atributos do gerador

Tudo o que o gerador de premissas pode sortear, em um lugar só. Existe porque
três das quatro listas de peças — características, personalidades e fatos — e
o molde do bloco não aparecem em página nenhuma do site: eles se dissolvem
dentro da premissa gerada, e a única forma de conhecer o repertório inteiro é
rolar o gerador até cansar. A quarta lista, as profissões, ganhou página própria
em [`/guia-de-personagens/`](../src/pages/guia-de-personagens.astro) — mas o
inventário continua sendo o único lugar que junta as quatro num documento só,
por isso ela também está aqui.

Arquétipos e elementos narrativos tinham seção neste documento numa versão
anterior do gerador. Saíram do sorteio nesta reescrita — a premissa passou a
girar em torno de dois personagens, um local e um fato — mas continuam com
página própria em `/arquetipos/` e `/elementos/`, na busca e em `/mundos/`.
Livros nunca entraram no gerador: são leitura de apoio, não peça de combinação.

> Contagens conferidas na data em que este documento foi escrito. Entrada nova
> em `src/lib/gerador/*.ts` ou em `src/content/cenarios/` desatualiza os
> números daqui — ver a lista de lugares que envelhecem em silêncio no
> CLAUDE.md.

## O que compõe uma premissa

| Peça | De onde vem | Onde aparece |
| --- | --- | --- |
| Mundo | escolha de quem usa, entre 6 | filtra o sorteio; aparece na primeira linha da premissa e do prompt de IA — sem cadeado, porque quem trava a linha é o seletor de Mundo |
| Profissão (Personagem A e B) | `src/lib/gerador/profissoes.ts` (60) | premissa, em `--destaque`; a `descricao` de cada uma só aparece em `/guia-de-personagens/`, fora do gerador |
| Característica (Personagem A) | `src/lib/gerador/caracteristicas.ts` (30) | premissa, em `--destaque` |
| Personalidade (Personagem B) | `src/lib/gerador/personalidades.ts` (30) | premissa, em `--destaque` |
| Local | `src/content/cenarios/` (60) | premissa, em `--destaque`, já contraído com a preposição |
| Fato | `src/lib/gerador/fatos.ts` (40) | premissa, em `--destaque` — trava com cadeado próprio, como as outras três peças |
| Molde | `src/lib/gerador/moldes.ts` (1) | é a forma da premissa |

## As peças invisíveis

### Profissões — 60, dez por mundo

O **quem**, dos dois personagens da premissa. Cada profissão tem um `nome` — que
entra sem alteração na premissa e no guia — e uma `descricao`, que só
aparece em [`/guia-de-personagens/`](../src/pages/guia-de-personagens.astro).
Os nomes vêm sem gênero marcado: a autora escreveu no masculino e pediu "(a)"
onde a concordância pede, cobrindo substantivo e adjetivo juntos
("Executivo(a) Corporativo(a)"). Onde a palavra é invariável, fica limpa
("Hacker", "Contrabandista", "Fixer").

A `descricao` está no **singular** — o guia descreve o personagem que vai sair
sorteado, um só, não a categoria inteira — e por isso carrega o mesmo "(a)" dos
nomes: quase toda ela começa por um substantivo com gênero. Onde o "(a)" não
produz o feminino correto ("ladrão" faz "ladra"), a frase é refeita com palavra
invariável em vez de forçar a marcação.

**Cyberpunk**

| Profissão | Descrição |
| --- | --- |
| Hacker | Invasor(a) de redes neurais e construtos de dados corporativos. |
| Samurai de Rua | Mercenário(a) ou guarda-costas com modificações cibernéticas pesadas. |
| Cirurgião(ã) de Rua | Médico(a) clandestino(a) que instala, remove ou conserta implantes ilegais. |
| Executivo(a) Corporativo(a) | Burocrata implacável que gerencia os interesses das megacorporações. |
| Corretor(a) de Dados | Traficante de informações secretas, segredos industriais e chantagens. |
| Mensageiro(a) Neural | Contrabandista que transporta dados sensíveis criptografados no próprio cérebro. |
| Detetive Particular | Investigador(a) cínico(a) que navega pelo submundo para resolver crimes que a polícia ignora. |
| Caçador(a) de Recompensas | Profissional focado(a) em rastrear devedores de corporações ou criminosos foragidos. |
| Técnico(a) de Drones | Operador(a) e engenheiro(a) de vigilância e combate remoto. |
| Engenheiro(a) de IA | Programador(a) que tenta controlar (ou libertar) inteligências artificiais rebeldes. |

**Distopia**

| Profissão | Descrição |
| --- | --- |
| Agente de Supressão | Fiscal encarregado(a) de monitorar e punir desvios ideológicos. |
| Reescritor(a) Histórico(a) | Funcionário(a) do governo responsável por alterar documentos e livros para apagar a verdade. |
| Operário(a) de Base | Trabalhador(a) de fábrica ou mina que sustenta a elite, geralmente vivendo em condições desumanas. |
| Líder da Resistência | Estrategista clandestino(a) que organiza rebeliões contra o sistema. |
| Propagandista do Estado | Criador(a) de mídia focado(a) em manter a população dócil e alienada. |
| Geneticista | Cientista que determina o destino e a função social dos cidadãos antes mesmo do nascimento. |
| Coletor(a) de Rações | Burocrata que distribui (e muitas vezes desvia) recursos escassos como comida e água. |
| Contrabandista de Artefatos Antigos | Pessoa que vende itens do "mundo anterior" (livros reais, discos, arte). |
| Médico(a) de Triagem Social | Profissional que decide quem vive ou morre com base na utilidade para o estado. |
| Infiltrado(a) | Espião(ã) da resistência trabalhando dentro da máquina do governo. |

**Invasão Alienígena**

| Profissão | Descrição |
| --- | --- |
| Xenobiólogo(a) | Cientista encarregado(a) de entender a anatomia, as fraquezas e a evolução dos invasores. |
| Fuzileiro(a) de Defesa Terrestre | Soldado(a) na linha de frente militar humana contra as forças extraterrestres. |
| Linguista | Especialista desesperado(a) para decifrar as comunicações ou motivos alienígenas. |
| Piloto de Caça | Condutor(a) de veículos atmosféricos ou robôs gigantes na defesa aérea e terrestre. |
| Engenheiro(a) de Engenharia Reversa | Técnico(a) que desmonta naves abatidas para adaptar armas alienígenas para uso humano. |
| Líder de Milícia | Civil que assume o comando de um grupo de resistência armada após o colapso dos governos. |
| Negociador(a) Interespécies | Diplomata tentando evitar a extinção através do diálogo. |
| Médico(a) de Combate | Cirurgião(ã) de campo lidando com armas de plasma e ferimentos desconhecidos. |
| Catador(a) de Tecnologia | Sobrevivente que explora os destroços das batalhas em busca de baterias e armas. |
| Estrategista de Defesa Orbital | General que coordena a defesa do planeta a partir de bunkers subterrâneos ou satélites. |

**Pós Apocalíptico**

| Profissão | Descrição |
| --- | --- |
| Catador(a) | Explorador(a) de ruínas urbanas em busca de comida enlatada, remédios e peças úteis. |
| Mecânico(a) de Sucata | Engenheiro(a) capaz de fazer um gerador ou um carro funcionar com arame e peças velhas. |
| Líder de Assentamento | Figura política ou ditador(a) local que mantém a ordem numa comunidade de sobreviventes. |
| Mercador(a) Itinerante | Mascate que viaja entre assentamentos trocando balas por água ou remédios. |
| Guarda de Caravana | Mercenário(a) contratado(a) para proteger mercadores contra saqueadores e mutantes. |
| Agricultor(a) de Subsistência | Fazendeiro(a) que tenta cultivar alimentos em solo irradiado ou estéril. |
| Curandeiro(a) | Médico(a) que utiliza plantas e conhecimentos antigos na ausência de antibióticos modernos. |
| Senhor(a) da Guerra | Líder brutal que controla recursos vitais (como água ou gasolina) pela força. |
| Arquivista do Velho Mundo | Guardião(ã) do conhecimento que tenta preservar livros e história humana. |
| Rastreador(a) | Sobrevivente solitário(a) especialista em ler o ambiente e encontrar caça ou pessoas perdidas. |

**Space Opera**

| Profissão | Descrição |
| --- | --- |
| Capitão(ã) de Nave Estelar | Líder carismático(a) e independente que comanda uma tripulação mercenária ou contrabandista. |
| Navegador(a) | Matemático(a) e piloto responsável por calcular saltos hiperespaciais sem bater em supernovas. |
| Embaixador(a) Galáctico(a) | Representante de um planeta ou federação em concílios alienígenas complexos. |
| Engenheiro(a) Chefe | O(A) mecânico(a) genial que mantém os motores de dobra funcionando quando tudo dá errado. |
| Aristocrata Exilado(a) | Membro(a) da nobreza intergaláctica tentando recuperar seu trono ou fugindo de um império opressor. |
| Caçador(a) de Recompensas Espacial | Rastreador(a) implacável que cruza a galáxia atrás de alvos valiosos. |
| Xenoantropólogo(a) | Estudioso(a) dedicado(a) a compreender as culturas e religiões de milhares de espécies diferentes. |
| Contrabandista | Mercador(a) que evita bloqueios imperiais para transportar cargas ilegais e valiosas. |
| Comandante de Frota | Estrategista militar que lidera batalhas com milhares de cruzadores estelares. |
| Membro da Patrulha Espacial | Soldado(a) treinado(a) para invasões em gravidade zero e abordagens de naves. |

**Viagem no Tempo**

| Profissão | Descrição |
| --- | --- |
| Agente da Polícia Temporal | Oficial da lei dedicado(a) a caçar criminosos que tentam alterar eventos do passado. |
| Piloto de Máquina do Tempo | O(A) testador(a) e viajante pioneiro(a) que navega pelas correntes do tempo. |
| Historiador(a) de Campo | Acadêmico(a) que viaja a épocas passadas para observação direta, com a regra estrita de nunca interferir. |
| Físico(a) Quântico(a) Estrutural | O(A) inventor(a) genial e teórico(a) que mantém as máquinas do tempo funcionando e calcula as ramificações. |
| Investigador(a) de Paradoxo | Detetive especializado(a) em descobrir onde a linha do tempo foi fraturada e como consertá-la. |
| Turista Temporal | Viajante rico(a) que paga fortunas para assistir a eventos históricos (e frequentemente causa problemas). |
| Contrabandista de Anacronismos | Especialista em roubar artefatos famosos (como a verdadeira Monalisa) antes de serem destruídos ou perdidos na história original. |
| Guardião(ã) da Linha do Tempo | Observador(a) fixo(a) num século específico, com a incumbência de garantir que certos eventos ocorram exatamente como deveriam. |
| Técnico(a) de Extração | Especialista focado(a) em resgatar pessoas do passado milissegundos antes de suas mortes registradas. |
| Fixer | Profissional cuja única função é apagar rastros materiais (celulares, roupas modernas) deixados acidentalmente no passado. |

### Características — 30

O traço do Personagem A. Cada entrada já vem com o verbo ("é", "tem", "usa",
"não sente"...), porque o molde escreve `{profissaoA} que {caracteristica}` sem
verbo próprio — é o que deixa "é cego(a) de um olho" e "tem cicatrizes nas mãos"
conviverem na mesma lista sem precisar de duas.

- é cego(a) de um olho
- tem cicatrizes nas mãos
- é muito mais alto(a) que todo mundo ali
- tem uma tatuagem que não sabe explicar
- anda com dificuldade desde criança
- tem as mãos sempre frias
- perdeu dois dedos
- tem uma queimadura no pescoço
- é surdo(a) de um ouvido
- tem cabelo branco desde os vinte anos
- tem olhos de cores diferentes
- usa um braço mecânico mal ajustado
- é pequeno(a) e passa despercebido(a)
- tem uma voz rouca que não melhora
- tem uma marca de nascença no rosto
- respira com esforço
- tem os dentes da frente quebrados
- carrega um tremor na mão direita
- tem calos de quem trabalha com corda
- é magro(a) demais para a idade
- tem uma cicatriz atravessando a sobrancelha
- não sente dor
- tem manchas na pele que ninguém soube diagnosticar
- usa óculos grossos e não enxerga sem eles
- tem ombros largos de nadador(a)
- anda com um mancar antigo
- tem uma prótese na perna
- tem as unhas sempre roídas
- tem uma cicatriz de queimadura na palma da mão
- é ruivo(a), o que naquele lugar chama atenção

### Personalidades — 30

O traço do Personagem B. Ao contrário das características, entra sem verbo: o
molde escreve `{profissaoB} que é {personalidade}`, com o "é" já fixo ali, então
aqui só cabe o adjetivo ou o sintagma que o segue.

- egocêntrico(a)
- leal demais
- incapaz de mentir
- de poucas palavras
- desconfiado(a) de todo mundo
- impaciente
- covarde, e sabe disso
- generoso(a) até o prejuízo
- teimoso(a)
- viciado(a) em risco
- sarcástico(a)
- obcecado(a) por ordem
- incapaz de pedir ajuda
- maternal com quem não devia
- rancoroso(a)
- otimista sem motivo
- curioso(a) além da conta
- orgulhoso(a) demais para recuar
- calculista
- distraído(a)
- rígido(a) com regras
- cínico(a)
- protetor(a) de quem é mais fraco
- mentiroso(a) por hábito
- ingênuo(a)
- ciumento(a)
- incapaz de ficar parado(a)
- severo(a) consigo mesmo(a)
- sedento(a) por reconhecimento
- paciente até o limite

### Fatos — 40

O que vem depois de "Importante:". Substituem as antigas complicações — mas com
uma diferença de forma: as complicações vinham depois de "descobre que" e podiam
não ter sujeito próprio ("pertence, por nascimento, ao lado que jurou
destruir"). O fato entra sozinho, então cada um é uma oração completa que fala
dos dois personagens de fora, sem se grudar em nenhum dos dois. Não há mais
famílias — a única regra é não repetir o fato da rodada anterior.

- um personagem está de luto
- os dois já se conheceram antes
- um dos dois está mentindo sobre o nome
- chove sem parar há trinta dias
- um dos dois deve dinheiro ao outro
- ninguém ali sabe usar uma arma
- um dos dois foi enviado para vigiar o outro
- os dois são procurados por motivos diferentes
- um deles tem menos de uma semana de vida
- o lugar vai ser evacuado em dois dias
- um dos dois já esteve preso
- eles são a última esperança de alguém que não sabem quem é
- um dos dois não consegue dormir
- existe uma criança escondida ali
- um dos dois trabalha para quem eles estão fugindo
- a comida acaba antes do fim da semana
- um dos dois perdeu a família no mesmo dia
- os dois se odeiam e precisam um do outro
- um deles carrega uma carta que não abriu
- ninguém pode saber que eles estiveram ali
- um dos dois é o único que sabe voltar
- há um corpo que ninguém enterrou
- um deles reconhece o lugar e não diz nada
- os dois assinaram um acordo que não leram
- um dos dois está armado e o outro não sabe
- o rádio parou de responder há três dias
- um deles é irmão de quem eles procuram
- eles têm um prazo e não sabem qual
- um dos dois já tentou desistir uma vez
- existe uma testemunha viva
- o combustível dá para a ida, não para a volta
- um dos dois está doente e esconde
- eles carregam algo que não abriram
- alguém está seguindo os dois desde o começo
- um deles tem medo do escuro
- a rota que eles conhecem não existe mais
- um dos dois prometeu voltar e não vai conseguir
- ninguém acredita na versão que eles vão contar
- um deles guarda a chave de algo que perdeu
- há um terceiro que os dois preferem não mencionar

## O molde

Um molde só, `MOLDE`, no lugar dos dez que existiam antes de o gerador
combinar dois personagens em vez de um arquétipo. A variedade que os dez moldes
davam passou para o tamanho das listas: dentro de um mundo já são 10 × 9
profissões (a segunda não repete a primeira) × 30 características × 30
personalidades × 10 locais × 40 fatos.

```
Essa é uma ficção científica de {mundo}.

Um(a) {profissaoA} que {caracteristica}.
Um(a) {profissaoB} que é {personalidade}.

Tudo começa {em:local}.

Importante: {fato}.
```

As quebras de linha são parte do molde, não um efeito de página: a premissa
virou um bloco de quatro linhas, e é por isso que o parágrafo da premissa em
`gerador.astro` precisa de `white-space: pre-wrap` — sem ele o navegador
colapsaria tudo numa linha só.

| Marcador | O que entra no lugar |
| --- | --- |
| `{mundo}` | o nome do mundo (ou dos mundos, unidos por " + " com "Misturar mundos"), com a inicial abaixada |
| `{profissaoA}` | o `nome` da profissão do Personagem A, como está na lista — sem abaixar inicial, para não estragar siglas ("Engenheiro(a) de IA") |
| `{caracteristica}` | o traço do Personagem A, já com verbo embutido: "é cego(a) de um olho" |
| `{profissaoB}` | o `nome` da profissão do Personagem B, como está na lista |
| `{personalidade}` | o traço do Personagem B, sem verbo — o "é" que o precede está fixo no molde |
| `{em:local}` | "em" + o `singular` do cenário, contraído: em + uma → **numa**, em + um → **num** |
| `{fato}` | o fato sorteado, sozinho, sem alteração |

O "Um(a)" que abre as duas linhas de personagem está escrito no molde, não nas
profissões: as 60 abrem todas com o mesmo artigo indefinido, então não há o que
sortear ali, e o `nome` guardado fica idêntico ao que aparece na premissa e no
guia. É a diferença em relação ao local, que carrega o artigo dentro de
`cenarios.singular` porque varia entre "um" e "uma".

### Os cadeados traváveis

A premissa é a própria interface do gerador: cada linha travável termina num
cadeado pequeno, e é esta tabela — `TRAVA_DO_MARCADOR`, ao lado do `MOLDE` em
[moldes.ts](../src/lib/gerador/moldes.ts) — que diz qual marcador põe cadeado em
qual linha.

| Marcador | Trava |
| --- | --- |
| `{profissaoA}` | `personagemA` |
| `{profissaoB}` | `personagemB` |
| `{em:local}` | `local` |
| `{fato}` | `fato` |
| `{mundo}` | nenhuma — quem trava a linha é o seletor de Mundo, no alto da página |

`{caracteristica}` e `{personalidade}` não têm entrada própria: cada uma divide
a linha com a profissão do mesmo personagem, e o cadeado é da linha inteira, não
da peça. Um cadeado por peça (seis ícones dentro do texto corrido) foi
considerado e recusado pela autora, por picotar a leitura.

## Regras do sorteio

- **Travar Personagem A, Personagem B, Local ou Fato** congela a peça
  correspondente na rolagem seguinte, num cadeado por linha travável — quatro
  ao todo. A linha do mundo é a única sem cadeado: quem manda nela é o seletor
  de Mundo, no alto da página.
- **O fato passa a travar.** Era a única peça sem cadeado, de propósito, para
  que travar tudo e continuar clicando em Gerar seguisse trocando alguma
  coisa. Com um cadeado no fim de cada linha da premissa, deixá-lo de fora
  faria a última linha parecer esquecimento em vez de decisão — a autora
  escolheu a coerência. Solto, o fato continua sem repetir o da rodada
  anterior; travado, ele fica parado como as outras três peças.
- **Os dois personagens nunca saem com a mesma profissão.** A checagem olha
  para os dois lados: se o Personagem B está travado, é o A que evita a
  profissão dele ao sortear; nos outros casos, A sai livre e B evita a
  profissão que A acabou de tirar.
- **Filtro por mundo só existe em profissões e locais.** Características,
  personalidades e fatos são universais — não pertencem a subgênero nenhum — e
  entram sempre da lista inteira, mesmo com um mundo escolhido.
- **Misturar mundos** deixa profissão e local virem de qualquer um dos seis. O
  nome do mundo no prompt de IA vira a lista dos que apareceram, na ordem
  Personagem A, Personagem B, Local, sem repetir um mundo usado por mais de
  uma peça.
- **Trocar qualquer opção do formulário** zera o sorteio e os quatro cadeados,
  para não sobrar peça travada de um mundo que não está mais selecionado.

## Quantas premissas diferentes existem

Dentro de um mundo só: 10 profissões para o Personagem A × 9 para o Personagem B
(a lista menos a que A já usou) × 30 características × 30 personalidades × 10
locais × 40 fatos — **32.400.000** premissas, cerca de 32 milhões, sem sair do
mundo escolhido.

Com "Misturar mundos" ligado, profissão e local passam a vir de qualquer um dos
seis: 60 × 59 × 30 × 30 × 60 × 40 — **7.646.400.000** premissas, cerca de 7,6
bilhões.
