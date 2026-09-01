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
   /guia-de-personagens/, e mora junto do nome para os dois não divergirem.
   Ela está no **singular**, por escolha da autora: o guia descreve o personagem
   que vai sair sorteado, um só, não a categoria inteira. Isso põe um substantivo
   com gênero na frente de quase toda descrição, e por isso ela carrega o mesmo
   "(a)" dos nomes. Onde o "(a)" não produz o feminino certo — "ladrão" faz
   "ladra" —, a frase é refeita com palavra invariável em vez de forçar a
   marcação. */
export const PROFISSOES: Profissao[] = [
  { nome: 'Hacker', subgenero: 'cyberpunk', descricao: 'Invasor(a) de redes neurais e construtos de dados corporativos.' },
  { nome: 'Samurai de Rua', subgenero: 'cyberpunk', descricao: 'Mercenário(a) ou guarda-costas com modificações cibernéticas pesadas.' },
  { nome: 'Cirurgião(ã) de Rua', subgenero: 'cyberpunk', descricao: 'Médico(a) clandestino(a) que instala, remove ou conserta implantes ilegais.' },
  { nome: 'Executivo(a) Corporativo(a)', subgenero: 'cyberpunk', descricao: 'Burocrata implacável que gerencia os interesses das megacorporações.' },
  { nome: 'Corretor(a) de Dados', subgenero: 'cyberpunk', descricao: 'Traficante de informações secretas, segredos industriais e chantagens.' },
  { nome: 'Mensageiro(a) Neural', subgenero: 'cyberpunk', descricao: 'Contrabandista que transporta dados sensíveis criptografados no próprio cérebro.' },
  { nome: 'Detetive Particular', subgenero: 'cyberpunk', descricao: 'Investigador(a) cínico(a) que navega pelo submundo para resolver crimes que a polícia ignora.' },
  { nome: 'Caçador(a) de Recompensas', subgenero: 'cyberpunk', descricao: 'Profissional focado(a) em rastrear devedores de corporações ou criminosos foragidos.' },
  { nome: 'Técnico(a) de Drones', subgenero: 'cyberpunk', descricao: 'Operador(a) e engenheiro(a) de vigilância e combate remoto.' },
  { nome: 'Engenheiro(a) de IA', subgenero: 'cyberpunk', descricao: 'Programador(a) que tenta controlar (ou libertar) inteligências artificiais rebeldes.' },

  { nome: 'Agente de Supressão', subgenero: 'distopia', descricao: 'Fiscal encarregado(a) de monitorar e punir desvios ideológicos.' },
  { nome: 'Reescritor(a) Histórico(a)', subgenero: 'distopia', descricao: 'Funcionário(a) do governo responsável por alterar documentos e livros para apagar a verdade.' },
  { nome: 'Operário(a) de Base', subgenero: 'distopia', descricao: 'Trabalhador(a) de fábrica ou mina que sustenta a elite, geralmente vivendo em condições desumanas.' },
  { nome: 'Líder da Resistência', subgenero: 'distopia', descricao: 'Estrategista clandestino(a) que organiza rebeliões contra o sistema.' },
  { nome: 'Propagandista do Estado', subgenero: 'distopia', descricao: 'Criador(a) de mídia focado(a) em manter a população dócil e alienada.' },
  { nome: 'Geneticista', subgenero: 'distopia', descricao: 'Cientista que determina o destino e a função social dos cidadãos antes mesmo do nascimento.' },
  { nome: 'Coletor(a) de Rações', subgenero: 'distopia', descricao: 'Burocrata que distribui (e muitas vezes desvia) recursos escassos como comida e água.' },
  { nome: 'Contrabandista de Artefatos Antigos', subgenero: 'distopia', descricao: 'Pessoa que vende itens do "mundo anterior" (livros reais, discos, arte).' },
  { nome: 'Médico(a) de Triagem Social', subgenero: 'distopia', descricao: 'Profissional que decide quem vive ou morre com base na utilidade para o estado.' },
  { nome: 'Infiltrado(a)', subgenero: 'distopia', descricao: 'Espião(ã) da resistência trabalhando dentro da máquina do governo.' },

  { nome: 'Xenobiólogo(a)', subgenero: 'invasao-alienigena', descricao: 'Cientista encarregado(a) de entender a anatomia, as fraquezas e a evolução dos invasores.' },
  { nome: 'Fuzileiro(a) de Defesa Terrestre', subgenero: 'invasao-alienigena', descricao: 'Soldado(a) na linha de frente militar humana contra as forças extraterrestres.' },
  { nome: 'Linguista', subgenero: 'invasao-alienigena', descricao: 'Especialista desesperado(a) para decifrar as comunicações ou motivos alienígenas.' },
  { nome: 'Piloto de Caça', subgenero: 'invasao-alienigena', descricao: 'Condutor(a) de veículos atmosféricos ou robôs gigantes na defesa aérea e terrestre.' },
  { nome: 'Engenheiro(a) de Engenharia Reversa', subgenero: 'invasao-alienigena', descricao: 'Técnico(a) que desmonta naves abatidas para adaptar armas alienígenas para uso humano.' },
  { nome: 'Líder de Milícia', subgenero: 'invasao-alienigena', descricao: 'Civil que assume o comando de um grupo de resistência armada após o colapso dos governos.' },
  { nome: 'Negociador(a) Interespécies', subgenero: 'invasao-alienigena', descricao: 'Diplomata tentando evitar a extinção através do diálogo.' },
  { nome: 'Médico(a) de Combate', subgenero: 'invasao-alienigena', descricao: 'Cirurgião(ã) de campo lidando com armas de plasma e ferimentos desconhecidos.' },
  { nome: 'Catador(a) de Tecnologia', subgenero: 'invasao-alienigena', descricao: 'Sobrevivente que explora os destroços das batalhas em busca de baterias e armas.' },
  { nome: 'Estrategista de Defesa Orbital', subgenero: 'invasao-alienigena', descricao: 'General que coordena a defesa do planeta a partir de bunkers subterrâneos ou satélites.' },

  { nome: 'Catador(a)', subgenero: 'pos-apocaliptico', descricao: 'Explorador(a) de ruínas urbanas em busca de comida enlatada, remédios e peças úteis.' },
  { nome: 'Mecânico(a) de Sucata', subgenero: 'pos-apocaliptico', descricao: 'Engenheiro(a) capaz de fazer um gerador ou um carro funcionar com arame e peças velhas.' },
  { nome: 'Líder de Assentamento', subgenero: 'pos-apocaliptico', descricao: 'Figura política ou ditador(a) local que mantém a ordem numa comunidade de sobreviventes.' },
  { nome: 'Mercador(a) Itinerante', subgenero: 'pos-apocaliptico', descricao: 'Mascate que viaja entre assentamentos trocando balas por água ou remédios.' },
  { nome: 'Guarda de Caravana', subgenero: 'pos-apocaliptico', descricao: 'Mercenário(a) contratado(a) para proteger mercadores contra saqueadores e mutantes.' },
  { nome: 'Agricultor(a) de Subsistência', subgenero: 'pos-apocaliptico', descricao: 'Fazendeiro(a) que tenta cultivar alimentos em solo irradiado ou estéril.' },
  { nome: 'Curandeiro(a)', subgenero: 'pos-apocaliptico', descricao: 'Médico(a) que utiliza plantas e conhecimentos antigos na ausência de antibióticos modernos.' },
  { nome: 'Senhor(a) da Guerra', subgenero: 'pos-apocaliptico', descricao: 'Líder brutal que controla recursos vitais (como água ou gasolina) pela força.' },
  { nome: 'Arquivista do Velho Mundo', subgenero: 'pos-apocaliptico', descricao: 'Guardião(ã) do conhecimento que tenta preservar livros e história humana.' },
  { nome: 'Rastreador(a)', subgenero: 'pos-apocaliptico', descricao: 'Sobrevivente solitário(a) especialista em ler o ambiente e encontrar caça ou pessoas perdidas.' },

  { nome: 'Capitão(ã) de Nave Estelar', subgenero: 'space-opera', descricao: 'Líder carismático(a) e independente que comanda uma tripulação mercenária ou contrabandista.' },
  { nome: 'Navegador(a)', subgenero: 'space-opera', descricao: 'Matemático(a) e piloto responsável por calcular saltos hiperespaciais sem bater em supernovas.' },
  { nome: 'Embaixador(a) Galáctico(a)', subgenero: 'space-opera', descricao: 'Representante de um planeta ou federação em concílios alienígenas complexos.' },
  { nome: 'Engenheiro(a) Chefe', subgenero: 'space-opera', descricao: 'O(A) mecânico(a) genial que mantém os motores de dobra funcionando quando tudo dá errado.' },
  { nome: 'Aristocrata Exilado(a)', subgenero: 'space-opera', descricao: 'Membro(a) da nobreza intergaláctica tentando recuperar seu trono ou fugindo de um império opressor.' },
  { nome: 'Caçador(a) de Recompensas Espacial', subgenero: 'space-opera', descricao: 'Rastreador(a) implacável que cruza a galáxia atrás de alvos valiosos.' },
  { nome: 'Xenoantropólogo(a)', subgenero: 'space-opera', descricao: 'Estudioso(a) dedicado(a) a compreender as culturas e religiões de milhares de espécies diferentes.' },
  { nome: 'Contrabandista', subgenero: 'space-opera', descricao: 'Mercador(a) que evita bloqueios imperiais para transportar cargas ilegais e valiosas.' },
  { nome: 'Comandante de Frota', subgenero: 'space-opera', descricao: 'Estrategista militar que lidera batalhas com milhares de cruzadores estelares.' },
  { nome: 'Membro da Patrulha Espacial', subgenero: 'space-opera', descricao: 'Soldado(a) treinado(a) para invasões em gravidade zero e abordagens de naves.' },

  { nome: 'Agente da Polícia Temporal', subgenero: 'viagem-no-tempo', descricao: 'Oficial da lei dedicado(a) a caçar criminosos que tentam alterar eventos do passado.' },
  { nome: 'Piloto de Máquina do Tempo', subgenero: 'viagem-no-tempo', descricao: 'O(A) testador(a) e viajante pioneiro(a) que navega pelas correntes do tempo.' },
  { nome: 'Historiador(a) de Campo', subgenero: 'viagem-no-tempo', descricao: 'Acadêmico(a) que viaja a épocas passadas para observação direta, com a regra estrita de nunca interferir.' },
  { nome: 'Físico(a) Quântico(a) Estrutural', subgenero: 'viagem-no-tempo', descricao: 'O(A) inventor(a) genial e teórico(a) que mantém as máquinas do tempo funcionando e calcula as ramificações.' },
  { nome: 'Investigador(a) de Paradoxo', subgenero: 'viagem-no-tempo', descricao: 'Detetive especializado(a) em descobrir onde a linha do tempo foi fraturada e como consertá-la.' },
  { nome: 'Turista Temporal', subgenero: 'viagem-no-tempo', descricao: 'Viajante rico(a) que paga fortunas para assistir a eventos históricos (e frequentemente causa problemas).' },
  { nome: 'Contrabandista de Anacronismos', subgenero: 'viagem-no-tempo', descricao: 'Especialista em roubar artefatos famosos (como a verdadeira Monalisa) antes de serem destruídos ou perdidos na história original.' },
  { nome: 'Guardião(ã) da Linha do Tempo', subgenero: 'viagem-no-tempo', descricao: 'Observador(a) fixo(a) num século específico, com a incumbência de garantir que certos eventos ocorram exatamente como deveriam.' },
  { nome: 'Técnico(a) de Extração', subgenero: 'viagem-no-tempo', descricao: 'Especialista focado(a) em resgatar pessoas do passado milissegundos antes de suas mortes registradas.' },
  { nome: 'Fixer', subgenero: 'viagem-no-tempo', descricao: 'Profissional cuja única função é apagar rastros materiais (celulares, roupas modernas) deixados acidentalmente no passado.' },

  { nome: 'Mecânico(a) de Exoesqueleto', subgenero: 'fc-militar', descricao: 'Quem mantém a armadura pesada de pé entre uma missão e outra.' },
  { nome: 'Paramédico(a) de Combate', subgenero: 'fc-militar', descricao: 'Socorrista que trabalha sob fogo, com o que couber na mochila.' },
  { nome: 'Operador(a) de Radar', subgenero: 'fc-militar', descricao: 'Vigia de turno que lê no ruído da tela o que ainda não apareceu.' },
  { nome: 'Cozinheiro(a) de Rancho', subgenero: 'fc-militar', descricao: 'Alimenta o pelotão inteiro e ouve tudo o que se fala na fila.' },
  { nome: 'Sapador(a)', subgenero: 'fc-militar', descricao: 'Abre caminho e desarma o que foi deixado para trás para matar.' },
  { nome: 'Piloto de Transporte de Tropa', subgenero: 'fc-militar', descricao: 'Leva gente para a zona de pouso e tenta trazer todo mundo de volta.' },
  { nome: 'Intendente', subgenero: 'fc-militar', descricao: 'Controla munição, ração e peça de reposição — e decide quem recebe primeiro.' },
  { nome: 'Instrutor(a) de Recrutas', subgenero: 'fc-militar', descricao: 'Transforma civil em soldado no prazo curto que a guerra permite.' },
  { nome: 'Correspondente de Guerra', subgenero: 'fc-militar', descricao: 'Acompanha a tropa para contar o que acontece, sob censura do comando.' },
  { nome: 'Capelão(ã) Militar', subgenero: 'fc-militar', descricao: 'Escuta confissão antes do combate e enterra quem não voltou.' },

  { nome: 'Hidrólogo(a)', subgenero: 'fc-climatica', descricao: 'Mede o que resta de água doce e diz a verdade que ninguém quer ouvir.' },
  { nome: 'Engenheiro(a) de Diques', subgenero: 'fc-climatica', descricao: 'Levanta e remenda a barreira que segura o mar fora da cidade.' },
  { nome: 'Agrônomo(a) de Cultivo Resistente', subgenero: 'fc-climatica', descricao: 'Procura a semente que ainda germina no clima que chegou.' },
  { nome: 'Brigadista Florestal', subgenero: 'fc-climatica', descricao: 'Enfrenta o fogo em temporada que já não tem começo nem fim.' },
  { nome: 'Piloto de Drone de Semeadura', subgenero: 'fc-climatica', descricao: 'Replanta encosta inteira do ar, onde ninguém consegue subir a pé.' },
  { nome: 'Perito(a) em Seguro Climático', subgenero: 'fc-climatica', descricao: 'Calcula o preço do desastre e decide o que a apólice ainda cobre.' },
  { nome: 'Coletor(a) de Água de Neblina', subgenero: 'fc-climatica', descricao: 'Tira do ar úmido o que a chuva parou de trazer.' },
  { nome: 'Guarda de Reservatório', subgenero: 'fc-climatica', descricao: 'Vigia o que virou a coisa mais valiosa da região.' },
  { nome: 'Meteorologista de Emergência', subgenero: 'fc-climatica', descricao: 'Decide a hora de mandar uma cidade inteira sair de casa.' },
  { nome: 'Mediador(a) de Reassentamento', subgenero: 'fc-climatica', descricao: 'Negocia para onde vai quem perdeu o lugar onde morava.' },

  { nome: 'Radioastrônomo(a)', subgenero: 'primeiro-contato', descricao: 'Passa a carreira ouvindo o céu e um dia escuta resposta.' },
  { nome: 'Analista de Sinais', subgenero: 'primeiro-contato', descricao: 'Separa o que é ruído do que tem intenção dentro.' },
  { nome: 'Tradutor(a) Simultâneo(a)', subgenero: 'primeiro-contato', descricao: 'Verte em tempo real uma fala que ninguém garante ter entendido.' },
  { nome: 'Chefe de Protocolo', subgenero: 'primeiro-contato', descricao: 'Decide quem cumprimenta quem primeiro, quando não há precedente nenhum.' },
  { nome: 'Assessor(a) de Imprensa', subgenero: 'primeiro-contato', descricao: 'Escolhe o que o público sabe e a que horas fica sabendo.' },
  { nome: 'Bioeticista', subgenero: 'primeiro-contato', descricao: 'Pergunta o que é permitido fazer com o visitante — e com quem o recebe.' },
  { nome: 'Operador(a) de Antena', subgenero: 'primeiro-contato', descricao: 'Aponta o prato e mantém o enlace de pé no turno da madrugada.' },
  { nome: 'Psicólogo(a) de Crise', subgenero: 'primeiro-contato', descricao: 'Cuida de quem viu primeiro e não conseguiu voltar a dormir.' },
  { nome: 'Documentarista', subgenero: 'primeiro-contato', descricao: 'Registra tudo, porque isso vai ser a memória da espécie.' },
  { nome: 'Segurança de Perímetro', subgenero: 'primeiro-contato', descricao: 'Mantém a curiosidade humana do lado de fora da cerca.' },

  { nome: 'Biotécnico(a) de Bancada', subgenero: 'biopunk', descricao: 'Executa o protocolo que outra pessoa desenhou e assina o resultado.' },
  { nome: 'Cultivador(a) de Órgãos', subgenero: 'biopunk', descricao: 'Cria tecido humano sob encomenda e conhece o prazo de cada peça.' },
  { nome: 'Perito(a) em Patente Genética', subgenero: 'biopunk', descricao: 'Prova em juízo de quem é a sequência que está dentro de alguém.' },
  { nome: 'Veterinário(a) de Híbridos', subgenero: 'biopunk', descricao: 'Atende o que a medicina humana e a animal recusam por não saber classificar.' },
  { nome: 'Fiscal de Biossegurança', subgenero: 'biopunk', descricao: 'Lacra laboratório e assina o auto que fecha o lugar.' },
  { nome: 'Corretor(a) de Genoma', subgenero: 'biopunk', descricao: 'Aproxima quem tem a sequência rara de quem paga por ela.' },
  { nome: 'Enfermeiro(a) de Clínica Ilegal', subgenero: 'biopunk', descricao: 'Cuida do pós-operatório que nenhum hospital vai registrar.' },
  { nome: 'Analista de Sequenciamento', subgenero: 'biopunk', descricao: 'Lê o genoma inteiro e percebe o que foi acrescentado nele.' },
  { nome: 'Zelador(a) de Biotério', subgenero: 'biopunk', descricao: 'Alimenta e limpa a criação do laboratório, e vê o que ninguém anota.' },
  { nome: 'Entregador(a) de Material Refrigerado', subgenero: 'biopunk', descricao: 'Transporta a caixa fria sem perguntar o que tem dentro.' },
];
