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
| Mundo | escolha de quem usa, entre 6 | filtra o sorteio; não entra no bloco, só na primeira linha do prompt de IA |
| Profissão (Personagem A e B) | `src/lib/gerador/profissoes.ts` (60) | carta na tela **e** bloco; a `descricao` de cada uma só aparece em `/guia-de-personagens/`, fora do gerador |
| Característica (Personagem A) | `src/lib/gerador/caracteristicas.ts` (30) | carta na tela **e** bloco |
| Personalidade (Personagem B) | `src/lib/gerador/personalidades.ts` (30) | carta na tela **e** bloco |
| Local | `src/content/cenarios/` (60) | carta na tela **e** bloco |
| Fato | `src/lib/gerador/fatos.ts` (40) | **só no bloco** |
| Molde | `src/lib/gerador/moldes.ts` (1) | é a forma do bloco |

## As peças invisíveis

### Profissões — 60, dez por mundo

O **quem**, dos dois personagens da premissa. Cada profissão tem um `nome` — que
entra sem alteração na carta, no bloco e no guia — e uma `descricao`, que só
aparece em [`/guia-de-personagens/`](../src/pages/guia-de-personagens.astro).
Os nomes vêm sem gênero marcado: a autora escreveu no masculino e pediu "(a)"
onde a concordância pede, cobrindo substantivo e adjetivo juntos
("Executivo(a) Corporativo(a)"). Onde a palavra é invariável, fica limpa
("Hacker", "Contrabandista", "Fixer").

**Cyberpunk**

| Profissão | Descrição |
| --- | --- |
| Hacker | Invasores de redes neurais e construtos de dados corporativos. |
| Samurai de Rua | Mercenários e guarda-costas com modificações cibernéticas pesadas. |
| Cirurgião(ã) de Rua | Médicos clandestinos que instalam, removem ou consertam implantes ilegais. |
| Executivo(a) Corporativo(a) | Burocratas implacáveis que gerenciam os interesses das megacorporações. |
| Corretor(a) de Dados | Traficantes de informações secretas, segredos industriais e chantagens. |
| Mensageiro(a) Neural | Contrabandistas que transportam dados sensíveis criptografados em seus próprios cérebros. |
| Detetive Particular | Investigadores cínicos que navegam pelo submundo para resolver crimes que a polícia ignora. |
| Caçador(a) de Recompensas | Profissionais focados em rastrear devedores de corporações ou criminosos foragidos. |
| Técnico(a) de Drones | Operadores e engenheiros de vigilância e combate remoto. |
| Engenheiro(a) de IA | Programadores que tentam controlar (ou libertar) inteligências artificiais rebeldes. |

**Distopia**

| Profissão | Descrição |
| --- | --- |
| Agente de Supressão | Fiscais encarregados de monitorar e punir desvios ideológicos. |
| Reescritor(a) Histórico(a) | Funcionários do governo responsáveis por alterar documentos e livros para apagar a verdade. |
| Operário(a) de Base | Trabalhadores de fábricas ou minas que sustentam a elite, geralmente vivendo em condições desumanas. |
| Líder da Resistência | Estrategistas clandestinos que organizam rebeliões contra o sistema. |
| Propagandista do Estado | Criadores de mídia focados em manter a população dócil e alienada. |
| Geneticista | Cientistas que determinam o destino e a função social dos cidadãos antes mesmo do nascimento. |
| Coletor(a) de Rações | Burocratas que distribuem (e muitas vezes desviam) recursos escassos como comida e água. |
| Contrabandista de Artefatos Antigos | Pessoas que vendem itens do "mundo anterior" (livros reais, discos, arte). |
| Médico(a) de Triagem Social | Profissionais que decidem quem vive ou morre com base na utilidade para o estado. |
| Infiltrado(a) | Espiões da resistência trabalhando dentro da máquina do governo. |

**Invasão Alienígena**

| Profissão | Descrição |
| --- | --- |
| Xenobiólogo(a) | Cientistas encarregados de entender a anatomia, fraquezas e evolução dos invasores. |
| Fuzileiro(a) de Defesa Terrestre | A linha de frente militar humana contra as forças extraterrestres. |
| Linguista | Especialistas desesperados para decifrar as comunicações ou motivos alienígenas. |
| Piloto de Caça | Condutores de veículos atmosféricos ou robôs gigantes na defesa aérea e terrestre. |
| Engenheiro(a) de Engenharia Reversa | Técnicos que desmontam naves abatidas para adaptar armas alienígenas para uso humano. |
| Líder de Milícia | Civis que assumem o comando de grupos de resistência armada após o colapso dos governos. |
| Negociador(a) Interespécies | Diplomatas tentando evitar a extinção através do diálogo. |
| Médico(a) de Combate | Cirurgiões de campo lidando com armas de plasma e ferimentos desconhecidos. |
| Catador(a) de Tecnologia | Sobreviventes que exploram os destroços das batalhas em busca de baterias e armas. |
| Estrategista de Defesa Orbital | Generais que coordenam a defesa do planeta a partir de bunkers subterrâneos ou satélites. |

**Pós Apocalíptico**

| Profissão | Descrição |
| --- | --- |
| Catador(a) | Exploradores de ruínas urbanas em busca de comida enlatada, remédios e peças úteis. |
| Mecânico(a) de Sucata | Engenheiros capazes de fazer um gerador ou um carro funcionar com arame e peças velhas. |
| Líder de Assentamento | Figuras políticas ou ditadores locais que mantêm a ordem em comunidades de sobreviventes. |
| Mercador(a) Itinerante | Mascates que viajam entre assentamentos trocando balas por água ou remédios. |
| Guarda de Caravana | Mercenários contratados para proteger mercadores contra saqueadores e mutantes. |
| Agricultor(a) de Subsistência | Fazendeiros que tentam cultivar alimentos em solo irradiado ou estéril. |
| Curandeiro(a) | Médicos que utilizam plantas e conhecimentos antigos na ausência de antibióticos modernos. |
| Senhor(a) da Guerra | Líderes brutais que controlam recursos vitais (como água ou gasolina) pela força. |
| Arquivista do Velho Mundo | Guardiões do conhecimento que tentam preservar livros e história humana. |
| Rastreador(a) | Sobreviventes solitários especialistas em ler o ambiente e encontrar caça ou pessoas perdidas. |

**Space Opera**

| Profissão | Descrição |
| --- | --- |
| Capitão(ã) de Nave Estelar | Líderes carismáticos e independentes que comandam tripulações mercenárias ou contrabandistas. |
| Navegador(a) | Matemáticos e pilotos responsáveis por calcular saltos hiperespaciais sem bater em supernovas. |
| Embaixador(a) Galáctico(a) | Representantes de planetas ou federações em concílios alienígenas complexos. |
| Engenheiro(a) Chefe | Os mecânicos geniais que mantêm os motores de dobra funcionando quando tudo dá errado. |
| Aristocrata Exilado(a) | Membros da nobreza intergaláctica tentando recuperar seus tronos ou fugindo de impérios opressores. |
| Caçador(a) de Recompensas Espacial | Rastreadores implacáveis que cruzam a galáxia atrás de alvos valiosos. |
| Xenoantropólogo(a) | Estudiosos dedicados a compreender as culturas e religiões de milhares de espécies diferentes. |
| Contrabandista | Mercadores que evitam bloqueios imperiais para transportar cargas ilegais e valiosas. |
| Comandante de Frota | Estrategistas militares que lideram batalhas com milhares de cruzadores estelares. |
| Membro da Patrulha Espacial | Soldados treinados para invasões em gravidade zero e abordagens de naves. |

**Viagem no Tempo**

| Profissão | Descrição |
| --- | --- |
| Agente da Polícia Temporal | Oficiais da lei dedicados a caçar criminosos que tentam alterar eventos do passado. |
| Piloto de Máquina do Tempo | Os testadores e viajantes pioneiros que navegam pelas correntes do tempo. |
| Historiador(a) de Campo | Acadêmicos que viajam a épocas passadas para observação direta, com a regra estrita de nunca interferir. |
| Físico(a) Quântico(a) Estrutural | Os inventores geniais e teóricos que mantêm as máquinas do tempo funcionando e calculam as ramificações. |
| Investigador(a) de Paradoxo | Detetives especializados em descobrir onde a linha do tempo foi fraturada e como consertá-la. |
| Turista Temporal | Viajantes ricos que pagam fortunas para assistir a eventos históricos (e frequentemente causam problemas). |
| Contrabandista de Anacronismos | Ladrões que roubam artefatos famosos (como a verdadeira Monalisa) antes de serem destruídos ou perdidos na história original. |
| Guardião(ã) da Linha do Tempo | Observadores fixos em séculos específicos, encarregados de garantir que certos eventos ocorram exatamente como deveriam. |
| Técnico(a) de Extração | Especialistas focados em resgatar pessoas do passado milissegundos antes de suas mortes registradas. |
| Fixer | Profissionais cuja única função é apagar rastros materiais (celulares, roupas modernas) deixados acidentalmente no passado. |

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
sortear ali, e o `nome` guardado fica idêntico ao que aparece na carta e no
guia. É a diferença em relação ao local, que carrega o artigo dentro de
`cenarios.singular` porque varia entre "um" e "uma".

## Regras do sorteio

- **Travar Personagem A, Personagem B ou Local** congela a peça correspondente
  na rolagem seguinte, nos três cadeados.
- **O fato nunca trava** e nunca repete o da rodada anterior — travar as três
  cartas e continuar clicando em Gerar é o uso que o cadeado sempre teve:
  segurar o elenco e o lugar e deixar só o fato mudar.
- **Os dois personagens nunca saem com a mesma profissão.** A checagem olha
  para os dois lados: se o Personagem B está travado, é o A que evita a
  profissão dele ao sortear; nos outros casos, A sai livre e B evita a
  profissão que A acabou de tirar.
- **Filtro por mundo só existe em profissões e locais.** Características,
  personalidades e fatos são universais — não pertencem a subgênero nenhum — e
  entram sempre da lista inteira, mesmo com um mundo escolhido.
- **Misturar mundos** deixa profissão e local virem de qualquer um dos seis. O
  nome do mundo no prompt de IA vira a lista dos que apareceram, na ordem das
  cartas (Personagem A, Personagem B, Local), sem repetir um mundo usado por
  mais de uma peça.
- **Trocar qualquer opção do formulário** zera o sorteio e os três cadeados,
  para não sobrar peça travada de um mundo que não está mais selecionado.

## Quantas premissas diferentes existem

Dentro de um mundo só: 10 profissões para o Personagem A × 9 para o Personagem B
(a lista menos a que A já usou) × 30 características × 30 personalidades × 10
locais × 40 fatos — **32.400.000** premissas, cerca de 32 milhões, sem sair do
mundo escolhido.

Com "Misturar mundos" ligado, profissão e local passam a vir de qualquer um dos
seis: 60 × 59 × 30 × 30 × 60 × 40 — **7.646.400.000** premissas, cerca de 7,6
bilhões.
