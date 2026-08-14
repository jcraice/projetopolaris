import type { Profissao } from './tipos';

/* Conteúdo editorial da autora (CC BY), não código — mesma situação das
   complicações que existiam antes: é peça de sorteio, não verbete de coleção, e
   por isso mora aqui e não em src/content/.

   Os nomes vêm com maiúscula porque são arquétipos de profissão, como os
   verbetes do catálogo, e não ocupações soltas. Sem gênero: a autora escreveu no
   masculino e pediu "(a) quando necessário", com concordância completa —
   substantivo e adjetivo, "Executivo(a) Corporativo(a)". Palavra invariável fica
   limpa ("Hacker", "Contrabandista", "Fixer", "Engenheiro(a) Chefe").

   A `descricao` não é usada no sorteio: ela é o corpo do guia em
   /guia-de-personagens/, e mora junto do nome para os dois não divergirem. */
export const PROFISSOES: Profissao[] = [
  { nome: 'Hacker', subgenero: 'cyberpunk', descricao: 'Invasores de redes neurais e construtos de dados corporativos.' },
  { nome: 'Samurai de Rua', subgenero: 'cyberpunk', descricao: 'Mercenários e guarda-costas com modificações cibernéticas pesadas.' },
  { nome: 'Cirurgião(ã) de Rua', subgenero: 'cyberpunk', descricao: 'Médicos clandestinos que instalam, removem ou consertam implantes ilegais.' },
  { nome: 'Executivo(a) Corporativo(a)', subgenero: 'cyberpunk', descricao: 'Burocratas implacáveis que gerenciam os interesses das megacorporações.' },
  { nome: 'Corretor(a) de Dados', subgenero: 'cyberpunk', descricao: 'Traficantes de informações secretas, segredos industriais e chantagens.' },
  { nome: 'Mensageiro(a) Neural', subgenero: 'cyberpunk', descricao: 'Contrabandistas que transportam dados sensíveis criptografados em seus próprios cérebros.' },
  { nome: 'Detetive Particular', subgenero: 'cyberpunk', descricao: 'Investigadores cínicos que navegam pelo submundo para resolver crimes que a polícia ignora.' },
  { nome: 'Caçador(a) de Recompensas', subgenero: 'cyberpunk', descricao: 'Profissionais focados em rastrear devedores de corporações ou criminosos foragidos.' },
  { nome: 'Técnico(a) de Drones', subgenero: 'cyberpunk', descricao: 'Operadores e engenheiros de vigilância e combate remoto.' },
  { nome: 'Engenheiro(a) de IA', subgenero: 'cyberpunk', descricao: 'Programadores que tentam controlar (ou libertar) inteligências artificiais rebeldes.' },

  { nome: 'Agente de Supressão', subgenero: 'distopia', descricao: 'Fiscais encarregados de monitorar e punir desvios ideológicos.' },
  { nome: 'Reescritor(a) Histórico(a)', subgenero: 'distopia', descricao: 'Funcionários do governo responsáveis por alterar documentos e livros para apagar a verdade.' },
  { nome: 'Operário(a) de Base', subgenero: 'distopia', descricao: 'Trabalhadores de fábricas ou minas que sustentam a elite, geralmente vivendo em condições desumanas.' },
  { nome: 'Líder da Resistência', subgenero: 'distopia', descricao: 'Estrategistas clandestinos que organizam rebeliões contra o sistema.' },
  { nome: 'Propagandista do Estado', subgenero: 'distopia', descricao: 'Criadores de mídia focados em manter a população dócil e alienada.' },
  { nome: 'Geneticista', subgenero: 'distopia', descricao: 'Cientistas que determinam o destino e a função social dos cidadãos antes mesmo do nascimento.' },
  { nome: 'Coletor(a) de Rações', subgenero: 'distopia', descricao: 'Burocratas que distribuem (e muitas vezes desviam) recursos escassos como comida e água.' },
  { nome: 'Contrabandista de Artefatos Antigos', subgenero: 'distopia', descricao: 'Pessoas que vendem itens do "mundo anterior" (livros reais, discos, arte).' },
  { nome: 'Médico(a) de Triagem Social', subgenero: 'distopia', descricao: 'Profissionais que decidem quem vive ou morre com base na utilidade para o estado.' },
  { nome: 'Infiltrado(a)', subgenero: 'distopia', descricao: 'Espiões da resistência trabalhando dentro da máquina do governo.' },

  { nome: 'Xenobiólogo(a)', subgenero: 'invasao-alienigena', descricao: 'Cientistas encarregados de entender a anatomia, fraquezas e evolução dos invasores.' },
  { nome: 'Fuzileiro(a) de Defesa Terrestre', subgenero: 'invasao-alienigena', descricao: 'A linha de frente militar humana contra as forças extraterrestres.' },
  { nome: 'Linguista', subgenero: 'invasao-alienigena', descricao: 'Especialistas desesperados para decifrar as comunicações ou motivos alienígenas.' },
  { nome: 'Piloto de Caça', subgenero: 'invasao-alienigena', descricao: 'Condutores de veículos atmosféricos ou robôs gigantes na defesa aérea e terrestre.' },
  { nome: 'Engenheiro(a) de Engenharia Reversa', subgenero: 'invasao-alienigena', descricao: 'Técnicos que desmontam naves abatidas para adaptar armas alienígenas para uso humano.' },
  { nome: 'Líder de Milícia', subgenero: 'invasao-alienigena', descricao: 'Civis que assumem o comando de grupos de resistência armada após o colapso dos governos.' },
  { nome: 'Negociador(a) Interespécies', subgenero: 'invasao-alienigena', descricao: 'Diplomatas tentando evitar a extinção através do diálogo.' },
  { nome: 'Médico(a) de Combate', subgenero: 'invasao-alienigena', descricao: 'Cirurgiões de campo lidando com armas de plasma e ferimentos desconhecidos.' },
  { nome: 'Catador(a) de Tecnologia', subgenero: 'invasao-alienigena', descricao: 'Sobreviventes que exploram os destroços das batalhas em busca de baterias e armas.' },
  { nome: 'Estrategista de Defesa Orbital', subgenero: 'invasao-alienigena', descricao: 'Generais que coordenam a defesa do planeta a partir de bunkers subterrâneos ou satélites.' },

  { nome: 'Catador(a)', subgenero: 'pos-apocaliptico', descricao: 'Exploradores de ruínas urbanas em busca de comida enlatada, remédios e peças úteis.' },
  { nome: 'Mecânico(a) de Sucata', subgenero: 'pos-apocaliptico', descricao: 'Engenheiros capazes de fazer um gerador ou um carro funcionar com arame e peças velhas.' },
  { nome: 'Líder de Assentamento', subgenero: 'pos-apocaliptico', descricao: 'Figuras políticas ou ditadores locais que mantêm a ordem em comunidades de sobreviventes.' },
  { nome: 'Mercador(a) Itinerante', subgenero: 'pos-apocaliptico', descricao: 'Mascates que viajam entre assentamentos trocando balas por água ou remédios.' },
  { nome: 'Guarda de Caravana', subgenero: 'pos-apocaliptico', descricao: 'Mercenários contratados para proteger mercadores contra saqueadores e mutantes.' },
  { nome: 'Agricultor(a) de Subsistência', subgenero: 'pos-apocaliptico', descricao: 'Fazendeiros que tentam cultivar alimentos em solo irradiado ou estéril.' },
  { nome: 'Curandeiro(a)', subgenero: 'pos-apocaliptico', descricao: 'Médicos que utilizam plantas e conhecimentos antigos na ausência de antibióticos modernos.' },
  { nome: 'Senhor(a) da Guerra', subgenero: 'pos-apocaliptico', descricao: 'Líderes brutais que controlam recursos vitais (como água ou gasolina) pela força.' },
  { nome: 'Arquivista do Velho Mundo', subgenero: 'pos-apocaliptico', descricao: 'Guardiões do conhecimento que tentam preservar livros e história humana.' },
  { nome: 'Rastreador(a)', subgenero: 'pos-apocaliptico', descricao: 'Sobreviventes solitários especialistas em ler o ambiente e encontrar caça ou pessoas perdidas.' },

  { nome: 'Capitão(ã) de Nave Estelar', subgenero: 'space-opera', descricao: 'Líderes carismáticos e independentes que comandam tripulações mercenárias ou contrabandistas.' },
  { nome: 'Navegador(a)', subgenero: 'space-opera', descricao: 'Matemáticos e pilotos responsáveis por calcular saltos hiperespaciais sem bater em supernovas.' },
  { nome: 'Embaixador(a) Galáctico(a)', subgenero: 'space-opera', descricao: 'Representantes de planetas ou federações em concílios alienígenas complexos.' },
  { nome: 'Engenheiro(a) Chefe', subgenero: 'space-opera', descricao: 'Os mecânicos geniais que mantêm os motores de dobra funcionando quando tudo dá errado.' },
  { nome: 'Aristocrata Exilado(a)', subgenero: 'space-opera', descricao: 'Membros da nobreza intergaláctica tentando recuperar seus tronos ou fugindo de impérios opressores.' },
  { nome: 'Caçador(a) de Recompensas Espacial', subgenero: 'space-opera', descricao: 'Rastreadores implacáveis que cruzam a galáxia atrás de alvos valiosos.' },
  { nome: 'Xenoantropólogo(a)', subgenero: 'space-opera', descricao: 'Estudiosos dedicados a compreender as culturas e religiões de milhares de espécies diferentes.' },
  { nome: 'Contrabandista', subgenero: 'space-opera', descricao: 'Mercadores que evitam bloqueios imperiais para transportar cargas ilegais e valiosas.' },
  { nome: 'Comandante de Frota', subgenero: 'space-opera', descricao: 'Estrategistas militares que lideram batalhas com milhares de cruzadores estelares.' },
  { nome: 'Membro da Patrulha Espacial', subgenero: 'space-opera', descricao: 'Soldados treinados para invasões em gravidade zero e abordagens de naves.' },

  { nome: 'Agente da Polícia Temporal', subgenero: 'viagem-no-tempo', descricao: 'Oficiais da lei dedicados a caçar criminosos que tentam alterar eventos do passado.' },
  { nome: 'Piloto de Máquina do Tempo', subgenero: 'viagem-no-tempo', descricao: 'Os testadores e viajantes pioneiros que navegam pelas correntes do tempo.' },
  { nome: 'Historiador(a) de Campo', subgenero: 'viagem-no-tempo', descricao: 'Acadêmicos que viajam a épocas passadas para observação direta, com a regra estrita de nunca interferir.' },
  { nome: 'Físico(a) Quântico(a) Estrutural', subgenero: 'viagem-no-tempo', descricao: 'Os inventores geniais e teóricos que mantêm as máquinas do tempo funcionando e calculam as ramificações.' },
  { nome: 'Investigador(a) de Paradoxo', subgenero: 'viagem-no-tempo', descricao: 'Detetives especializados em descobrir onde a linha do tempo foi fraturada e como consertá-la.' },
  { nome: 'Turista Temporal', subgenero: 'viagem-no-tempo', descricao: 'Viajantes ricos que pagam fortunas para assistir a eventos históricos (e frequentemente causam problemas).' },
  { nome: 'Contrabandista de Anacronismos', subgenero: 'viagem-no-tempo', descricao: 'Ladrões que roubam artefatos famosos (como a verdadeira Monalisa) antes de serem destruídos ou perdidos na história original.' },
  { nome: 'Guardião(ã) da Linha do Tempo', subgenero: 'viagem-no-tempo', descricao: 'Observadores fixos em séculos específicos, encarregados de garantir que certos eventos ocorram exatamente como deveriam.' },
  { nome: 'Técnico(a) de Extração', subgenero: 'viagem-no-tempo', descricao: 'Especialistas focados em resgatar pessoas do passado milissegundos antes de suas mortes registradas.' },
  { nome: 'Fixer', subgenero: 'viagem-no-tempo', descricao: 'Profissionais cuja única função é apagar rastros materiais (celulares, roupas modernas) deixados acidentalmente no passado.' },
];
