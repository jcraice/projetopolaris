# Atributos do gerador

Tudo o que o gerador de premissas pode sortear, em um lugar só. Existe
porque duas das peças — a complicação e o molde da frase — não aparecem em
página nenhuma do site: elas se dissolvem dentro da premissa gerada, e a
única forma de conhecer o repertório inteiro era rolar o gerador até cansar.

As três primeiras peças são o acervo editorial e têm página própria; estão
aqui para o documento ficar completo, mas quem quiser lê-las com a descrição
de cada uma deve ir às páginas de catálogo.

> Contagens conferidas na data em que este documento foi escrito. Entrada
> nova em `src/content/` ou em `complicacoes.ts` desatualiza os números
> daqui — ver a lista de lugares que envelhecem em silêncio no CLAUDE.md.

## O que compõe uma premissa

| Peça | De onde vem | Onde aparece |
| --- | --- | --- |
| Mundo | escolha de quem usa, entre 6 | filtra o sorteio; não entra na frase, só no prompt de IA |
| Arquétipo | `src/content/arquetipos/` (76) | carta na tela **e** frase |
| Cenário | `src/content/cenarios/` (60) | carta na tela **e** frase |
| Elemento narrativo | `src/content/elementos/` (60) | carta na tela **e** frase |
| Complicação | `src/lib/gerador/complicacoes.ts` (40) | **só na frase** |
| Molde | `src/lib/gerador/moldes.ts` (10) | é a forma da frase |

Os livros do acervo não entram no gerador: são leitura de apoio, não peça de
combinação.

## As peças invisíveis

### Complicações — 40, em 7 famílias

É o que vem depois de "descobre que", "precisa aceitar que", "entende tarde
demais que". Cada uma começa em minúscula e não termina em ponto justamente
para encaixar ali. A família existe para o sorteio não repetir o mesmo tipo
de virada em duas rodadas seguidas — nem a complicação, nem a família dela.

**Traição e confiança** (6)

- quem pagou pelo serviço já sabia a resposta que mandou buscar
- o aviso que evitou a morte veio de quem mais lucraria com ela
- a única pessoa digna de confiança ali cumpre ordens desde o primeiro dia
- a escolha não foi por competência, e sim por ser fácil de descartar depois
- alguém do mesmo lado já negociou a rendição de todos, e negociou bem
- o segredo foi guardado a vida inteira por quem prometeu revelá-lo

**O custo moral** (6)

- salvar a maioria exige entregar exatamente quem confiou primeiro
- a solução funciona, e funciona porque alguém aceitou não voltar
- o certo e o possível apontam para lados opostos, e só há tempo para um
- fazer a coisa certa agora condena quem vier depois
- o silêncio custa uma vida por dia, e falar custa todas de uma vez
- existe uma saída limpa, e ela serve para uma pessoa só

**Identidade e revelação** (6)

- a lembrança mais antiga que possui foi plantada, e plantada com capricho
- o inimigo procurado há anos usa o próprio rosto
- pertence, por nascimento, ao lado que jurou destruir
- o nome que carrega pertenceu antes a outra pessoa, e essa pessoa não morreu
- existe para isso desde antes de nascer, e nunca houve escolha nenhuma
- a assinatura no documento que condenou todo mundo é a sua

**Tempo e urgência** (6)

- o prazo que parecia longo já venceu em algum lugar
- cada tentativa de consertar aproxima o desastre em um dia
- a decisão precisa ser tomada antes de existir informação suficiente
- o resgate está a caminho e chega depois do que acontecer primeiro
- há uma janela, e ela se fecha com alguém ainda do lado de dentro
- o aviso chegou no tempo certo, mas para a pessoa errada

**O preço do poder** (6)

- a única ferramenta capaz de vencer cobra um pedaço de quem a usa
- aceitar a ajuda oferecida significa dever um favor impagável
- usar a arma uma vez basta para nunca mais conseguir largá-la
- a cura existe, e é fabricada com a própria doença
- o comando só obedece a quem já perdeu o que amava
- quem detém o poder o mantém justamente por não usá-lo

**O inimigo que não é inimigo** (5)

- o outro lado tem razão, e provar isso não muda o que precisa ser feito
- o monstro está fazendo exatamente o que qualquer um faria no lugar dele
- a ordem absurda recebida era a única capaz de evitar algo pior
- quem deveria ser resgatado não quer sair de onde está
- a vitória já aconteceu, e ninguém percebeu porque não se parece com vitória

**Perda e memória** (5)

- lembrar a verdade exige perder tudo o que veio depois dela
- a prova procurada existe apenas na cabeça de quem já esqueceu
- voltar continua sendo possível, mas não há mais para onde
- todo mundo mudou de lugar, menos quem ficou esperando
- a casa continua lá, intacta, e é isso que torna impossível voltar

### Moldes de frase — 10

A premissa é sempre um destes moldes preenchido. O molde é sorteado à parte,
a cada clique em Gerar, mesmo que as peças estejam travadas — por isso a
mesma combinação pode voltar escrita de outro jeito.

1. `{em:cenario}, sob {elemento}, {arquetipo} descobre que {complicacao}.`
2. `{em:cenario}, onde {impera:elemento}, {arquetipo} precisa aceitar que {complicacao}.`
3. `{em:cenario}, {elemento} {ser:elemento} a regra — e {arquetipo} descobre que {complicacao}.`
4. `tudo começa {em:cenario}, num mundo {de:elemento}: {arquetipo} descobre que {complicacao}.`
5. `{arquetipo} sobrevive {em:cenario}, onde {impera:elemento}, até {pronome} descobrir que {complicacao}.`
6. `{em:cenario}, com {elemento} por todo lado, {arquetipo} entende tarde demais que {complicacao}.`
7. `ninguém avisou {arquetipo} de que, {em:cenario} sob {elemento}, {complicacao}.`
8. `{em:cenario}, {arquetipo} enfrenta {elemento} e precisa aceitar que {complicacao}.`
9. `{arquetipo} chega {a:cenario} e encontra {elemento}. O que ninguém contou: {complicacao}.`
10. `há {elemento} {em:cenario}, e {arquetipo} descobre tarde demais que {complicacao}.`

Os marcadores carregam a regência, e é isso que faz a frase concordar:

| Marcador | O que entra no lugar |
| --- | --- |
| `{arquetipo}` | artigo + nome, como está no acervo: **a IA Emergente**. O nome não é abaixado, senão viraria "iA Emergente" |
| `{em:cenario}` | "em" + o cenário, contraído: em + uma → **numa**, em + as → **nas** |
| `{a:cenario}` | "a" + o cenário, **sem** contrair: sai "chega **a uma** base espacial". Só "em" e "de" contraem |
| `{elemento}` | o título do elemento com a inicial abaixada: **a busca por autenticidade** |
| `{de:elemento}` | "de" + o elemento, contraído só com artigo definido: de + a → **da**. "de uma" fica assim mesmo, porque "duma" não é o registro do site |
| `{impera:elemento}` | o verbo **e** o elemento juntos: "onde **impera a busca**…" ou "onde **imperam os implantes**…" |
| `{ser:elemento}` | só o verbo, concordando: **é** ou **são** |
| `{pronome}` | **ela** ou **ele**, pelo artigo do arquétipo |

O número do elemento — singular ou plural — sai de uma heurística de
superfície sobre o título, não de um campo do frontmatter: é o que decide
entre "impera" e "imperam". Ela tem exceções nomeadas e está comentada em
detalhe em `src/lib/gerador/redacao.ts`. E a primeira letra da premissa é
sempre erguida no fim, depois de o molde estar montado — por isso os moldes
começam em minúscula.

Existe ainda um `{cenario}` sem preposição, que o código sabe preencher mas
que nenhum dos dez moldes usa hoje.

## As peças que têm página

### Arquétipos — 76

Dez por mundo, mais um arquétipo felino em cada, mais um pool de dez comuns
que serve a todos. O felino entra no sorteio como qualquer outro. Os comuns
só entram com a caixa "Incluir os 10 arquétipos comuns" marcada.

**Space Opera** (11)

- Comandante Carismático
- Piloto Habilidoso
- Tirano Galáctico
- Aliado Alienígena
- Fora-da-Lei com Código
- Especialista Técnico
- Figura Política/Diplomata
- Companheiro de Bordo
- Veterano de Guerra
- Recruta em Formação
- Observador Espacial — *felino*

**Distopia** (11)

- Protagonista Desperto
- Rosto do Regime
- Organizador Clandestino
- Colaborador do Sistema
- Autoridade Ameaçadora
- Fiel Verdadeiro
- Par que Desperta a Rebeldia
- Arquiteto do Controle
- Delator
- Mártir da Resistência
- Infiltrado Silencioso — *felino*

**Cyberpunk** (11)

- Hacker/Console Cowboy
- Fundador Recluso
- Detetive Decadente
- Humano Aumentado
- IA Emergente
- Fixer/Informante
- Executivo Corporativo
- Mercenário Urbano
- Andróide em Busca de Humanidade
- Vítima da Desigualdade
- Parceiro de Sombra — *felino*

**Pós Apocalíptico** (11)

- Sobrevivente Solitário
- Líder de Comunidade
- Senhor da Guerra Local
- Criança das Ruínas
- Batedor do Bando
- Guardião do Conhecimento Perdido
- Curandeiro da Comunidade
- Fanático Religioso
- Mutante/Infectado
- Utopista Reconstrutor
- Vigia dos Suprimentos — *felino*

**Invasão Alienígena** (11)

- Cientista Comunicador
- Militar Linha-Dura
- Alienígena Invasor
- Alienígena Incompreendido
- Civil que Vira Herói
- Agente do Encobrimento
- Cético Convertido
- Jornalista/Testemunha
- Colaborador dos Invasores
- Refugiado da Invasão
- Guardião Invisível — *felino*

**Viagem no Tempo** (11)

- Viajante Acidental
- Inventor da Máquina do Tempo
- Desertor da Patrulha
- Vilão Revisionista
- Duplo do Protagonista
- Vítima do Paradoxo
- Investigador de Anomalias
- Figura Histórica Encontrada
- Perseguidor Temporal
- Burocrata Temporal
- Batedor das Eras — *felino*

**10 Arquétipos Comuns** (10) — servem a qualquer mundo

- Cientista/Inventor
- Explorador
- IA Aliada
- IA Hostil
- Visionário Ignorado
- Burocrata do Sistema
- Outsider/Rebelde
- Intérprete
- Mentor
- Outro

### Cenários — 60

O **onde**. A forma entre parênteses é a que entra na frase, contraída com a
preposição do molde — é ela que faz "numa base espacial" sair certo.

**Space Opera** (10)

- Metrópoles Galácticas (uma metrópole galáctica)
- Fronteiras Hostis (uma fronteira hostil)
- Estações e Bases Espaciais (uma base espacial)
- Ruínas Antigas (uma ruína antiga)
- Corpos Celestes Perigosos (um corpo celeste perigoso)
- Mundos Elementais Extremos (um mundo elemental extremo)
- Sistemas Estelares Exóticos (um sistema estelar exótico)
- Naves e Frotas Nômades (uma frota nômade)
- Vazios Cósmicos (um vazio cósmico)
- Conexões Interdimensionais (uma conexão interdimensional)

**Distopia** (10)

- Megacidades sufocantes (uma megacidade sufocante)
- Postos de controle interno (um posto de controle interno)
- Zonas de segregação (uma zona de segregação)
- Infraestruturas decadentes (uma infraestrutura decadente)
- Blocos residenciais sem portas (um bloco residencial sem portas)
- Tribunais populares (um tribunal popular)
- Setores industriais opressivos (um setor industrial opressivo)
- Espaços de resistência subterrânea (um espaço de resistência subterrânea)
- Dormitórios coletivos numerados (um dormitório coletivo numerado)
- Distritos-modelo para visitantes (um distrito-modelo para visitantes)

**Cyberpunk** (10)

- Megacidades superpovoadas (uma megacidade superpovoada)
- Subsolo e galerias de manutenção (uma galeria de manutenção)
- Paisagens sensoriais intensas (uma paisagem sensorial intensa)
- Mercados marginais (um mercado marginal)
- Áreas corporativas exclusivas (uma área corporativa exclusiva)
- Bairros dominados por facções (um bairro dominado por facções)
- Espaços de vício e fuga (um espaço de vício e fuga)
- Cortiços de cápsula (um cortiço de cápsula)
- Cenários ambientais hostis (um cenário ambiental hostil)
- Habitats artificiais (um habitat artificial)

**Pós Apocalíptico** (10)

- Cidades em ruínas (uma cidade em ruínas)
- Estradas infinitas (uma estrada infinita)
- Comunidades fortificadas (uma comunidade fortificada)
- Terras devastadas (uma terra devastada)
- Mercados improvisados (um mercado improvisado)
- Ruínas tecnológicas (uma ruína tecnológica)
- Áreas de ameaça constante (uma área de ameaça constante)
- Oásis raros (um oásis raro)
- Abrigos subterrâneos (um abrigo subterrâneo)
- Ferrovias tomadas pelo mato (uma ferrovia tomada pelo mato)

**Invasão Alienígena** (10)

- Cidades devastadas (uma cidade devastada)
- Campos de refugiados (um campo de refugiados)
- Naves-mãe orbitais (um naves-mãe orbital)
- Bases alienígenas na superfície (uma base alienígena na superfície)
- Ambientes de resistência urbana (um ambiente de resistência urbana)
- Territórios dominados (um território dominado)
- Zonas de quarentena humana (uma zona de quarentena humana)
- Fortalezas governamentais (uma fortaleza governamental)
- Campos de batalha globais (um campo de batalha global)
- Destroços de nave abatida (um destroço de nave abatida)

**Viagem no Tempo** (10)

- Futuros utópicos reluzentes (um futuro utópico reluzente)
- Futuros distópicos arruinados (um futuro distópico arruinado)
- Passados históricos recriados (um passado histórico recriado)
- Museus de um futuro que não aconteceu (um museu de um futuro que não aconteceu)
- Cidades repetindo o mesmo dia (uma cidade repetindo o mesmo dia)
- Laboratórios e máquinas do tempo (uma máquina do tempo)
- Eras primitivas (uma era primitiva)
- Cidades futuristas divergentes (uma cidade futurista divergente)
- Territórios fora do tempo (um território fora do tempo)
- Memoriais e ruínas temporais (uma ruína temporal)

### Elementos narrativos — 60

O **quê** / que força. É a peça que o prompt de IA manda ser o motor do
conflito, e não pano de fundo.

**Space Opera** (10)

- Bloqueio de rotas e cerco a planetas
- Sucessão dinástica contestada
- Culturas alienígenas diversas
- Tecnologia de dobra espacial
- Busca por artefatos ancestrais
- Profecias e lendas cósmicas
- Poderes psíquicos ou místicos
- Conspirações políticas de larga escala
- Escassez do combustível de dobra
- Comércio interestelar

**Distopia** (10)

- Racionamento como forma de obediência
- Vigilância onipresente
- Propaganda estatal massiva
- Supressão da individualidade
- Memória histórica alterada
- Estratificação social por categorias
- Travessia clandestina de fronteira
- Busca pela verdade oculta
- Penas e punições severas
- Restrições à expressão artística

**Cyberpunk** (10)

- Implantes cibernéticos e biônicos
- Interfaces neurais diretas
- Consciências gravadas
- Realidade virtual e espaços digitais
- Sistemas de vigilância avançados
- Dívida como forma de servidão
- Divisão social extrema
- A busca por autenticidade
- Corpos e órgãos como mercadoria
- Hacktivismo e subversão digital

**Pós Apocalíptico** (10)

- Escassez de recursos vitais
- Sementes e bancos genéticos disputados
- Cultura da sucata e reaproveitamento
- Emergência de novas crenças ou cultos
- Interações com fauna e flora mutantes
- Formação de novas leis e códigos morais
- Degradação ambiental severa
- O papel da memória e do legado
- O retorno da eletricidade
- Doença sem nome e sem cura

**Invasão Alienígena** (10)

- Primeiro contato hostil
- Tecnologia alienígena superior
- Infiltração e disfarce alienígena
- Assimilação cultural ou biológica
- Cativeiro e experimentação humana
- Estratégias de guerrilha e sabotagem
- Engenharia reversa de tecnologia alienígena
- Vulnerabilidades inesperadas dos invasores
- Desespero e colapso social
- Silêncio absoluto dos invasores

**Viagem no Tempo** (10)

- Paradoxos temporais
- Efeito borboleta
- Loops temporais
- Conflito entre destino e livre-arbítrio
- Encontros consigo mesmo
- Viagem sem retorno possível
- Múltiplas linhas temporais
- Viagens ao passado para corrigir erros
- Ameaça de anacronismos
- Consequências físicas da viagem temporal

## Quantas premissas diferentes existem

Dentro de um mundo só, sem misturar e sem os comuns:

| Mundo | Arquétipos | Cenários | Elementos | Combinações de peças |
| --- | --- | --- | --- | --- |
| Space Opera | 11 | 10 | 10 | 1.100 |
| Distopia | 11 | 10 | 10 | 1.100 |
| Cyberpunk | 11 | 10 | 10 | 1.100 |
| Pós Apocalíptico | 11 | 10 | 10 | 1.100 |
| Invasão Alienígena | 11 | 10 | 10 | 1.100 |
| Viagem no Tempo | 11 | 10 | 10 | 1.100 |

São 6.600 trios de peças somando os seis mundos. Cada trio ainda recebe
uma das 40 complicações e um dos 10 moldes, o que dá
2.640.000 premissas distintas.

Ligando "misturar mundos", cada peça pode vir de qualquer lugar e a conta
passa a ser 66 × 60 × 60 = 237.600 trios, ou
95.040.000 premissas. Com os comuns também ligados, os arquétipos sobem
de 66 para 76 e o total chega a
109.440.000.

## Regras do sorteio

- **Travar uma peça** congela arquétipo, cenário ou elemento, nos três
  cadeados. A complicação nunca trava: ela muda a cada rodada, e a família
  dela também não se repete de uma rodada para a seguinte.
- **Misturar mundos** deixa cada peça vir de um mundo diferente. O nome do
  mundo no prompt de IA vira a lista dos que apareceram, na ordem das cartas.
- **Incluir os comuns** acrescenta os dez arquétipos comuns ao sorteio. Eles
  não são um mundo: não têm página em `/mundos/` e não entram na linha
  "Mundo:" do prompt.
- **Trocar qualquer opção** zera o sorteio e os cadeados, para não sobrar
  peça travada de um mundo que não está mais selecionado.
