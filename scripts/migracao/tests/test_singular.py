import pytest

from migracao.singular import forma_singular, genero_confiavel

REGULARES = [
    ("Ruínas Antigas", "uma ruína antiga"),
    ("Estradas infinitas", "uma estrada infinita"),
    ("Megacidades superpovoadas", "uma megacidade superpovoada"),
    ("Abrigos subterrâneos", "um abrigo subterrâneo"),
    ("Mercados improvisados", "um mercado improvisado"),
    ("Comunidades fortificadas", "uma comunidade fortificada"),
    ("Terras devastadas", "uma terra devastada"),
    ("Vazios cósmicos", "um vazio cósmico"),
    ("Governos totalitários", "um governo totalitário"),
    ("Espaços abandonados", "um espaço abandonado"),
]

IRREGULARES = [
    ("Conexões Interdimensionais", "uma conexão interdimensional"),
    ("Setores industriais opressivos", "um setor industrial opressivo"),
    ("Fronteiras hostis", "uma fronteira hostil"),
    ("Habitats artificiais", "um habitat artificial"),
    ("Metrópoles Galácticas", "uma metrópole galáctica"),
    ("Corpos celestes perigosos", "um corpo celeste perigoso"),
]

EXCECOES = [
    ("Naves e frotas nômades", "uma frota nômade"),
    ("Estações e bases espaciais", "uma base espacial"),
    ("Cidades em ruínas", "uma cidade em ruínas"),
    ("Oásis de elite", "um oásis de elite"),
    ("Bairros dominados por facções", "um bairro dominado por facções"),
    ("Praças de doutrinação", "uma praça de doutrinação"),
    ("Espaços de vício e fuga", "um espaço de vício e fuga"),
    # Descobertos ao ler premissas geradas com o acervo real (Task 12):
    # a regra geral produzia formas quebradas para os três.
    ("Campos de batalha globais", "um campo de batalha global"),
    ("Laboratórios e máquinas do tempo", "uma máquina do tempo"),
    ("Memoriais e ruínas temporais", "uma ruína temporal"),
]

# Invariáveis fora de EXCECOES: "Oásis de elite" casa por igualdade exata
# de título e nunca chega às regras. Estes casos forçam a passagem pela
# guarda de invariáveis dentro de _singularizar_palavra.
INVARIAVEIS_FORA_DE_EXCECOES = [
    ("Oásis remotos", "um oásis remoto"),
    ("Lápis mágicos", "um lápis mágico"),
]

# Núcleos femininos em "-e" que não têm regra de sufixo possível — só a
# lista NUCLEOS_FEMININOS resolve. Exercitam tanto a forma quanto a
# confiabilidade do gênero.
NUCLEOS_FEMININOS_CASOS = [
    ("Pontes interdimensionais", "uma ponte interdimensional"),
    ("Chaves perdidas", "uma chave perdida"),
    ("Fontes instáveis", "uma fonte instável"),
    ("Frentes hostis", "uma frente hostil"),
    ("Redes neurais corrompidas", "uma rede neural corrompida"),
    ("Margens esquecidas", "uma margem esquecida"),
    ("Correntes de dados", "uma corrente de dados"),
    ("Naves perdidas", "uma nave perdida"),
]

# Masculinos gregos em "-a" que a regra ingênua "-a é feminino" atropelava:
# 40 títulos reais do acervo expuseram 12 casos assim. Seis são cobertos
# pela regra "-ema/-oma/-grama" (MASCULINAS); os outros seis não têm sufixo
# comum e foram para NUCLEOS_MASCULINOS.
MASCULINOS_GREGOS = [
    ("Sistemas Estelares Exóticos", "um sistema estelar exótico"),  # -ema
    ("Problemas Insolúveis", "um problema insolúvel"),  # -ema
    ("Temas Recorrentes", "um tema recorrente"),  # -ema
    ("Esquemas Ocultos", "um esquema oculto"),  # -ema
    ("Dilemas Morais", "um dilema moral"),  # -ema
    ("Programas Secretos", "um programa secreto"),  # -grama
    ("Diagramas Antigos", "um diagrama antigo"),  # -grama
    ("Climas Extremos", "um clima extremo"),  # NUCLEOS_MASCULINOS
    ("Planetas Distantes", "um planeta distante"),  # NUCLEOS_MASCULINOS
    ("Cometas Errantes", "um cometa errante"),  # NUCLEOS_MASCULINOS
    ("Mapas Perdidos", "um mapa perdido"),  # NUCLEOS_MASCULINOS
    ("Enigmas Profundos", "um enigma profundo"),  # NUCLEOS_MASCULINOS
]

# Contraexemplos reais às regras acima: terminam em "-ema"/"-grama" ou em
# "-o" mas não seguem a regra geral daquela terminação.
CONTRAEXEMPLOS_DE_GENERO = [
    ("Gemas raras", "uma gema rara"),  # "-ema" pareceria masculino; não é
    ("Gramas altas", "uma grama alta"),  # "-grama" pareceria masculino; não é
    ("Fotos antigas", "uma foto antiga"),  # "-o" pareceria masculino; não é
    ("Motos abandonadas", "uma moto abandonada"),  # idem
    ("Tribos nômades", "uma tribo nômade"),  # idem
    ("Libido reprimida", "uma libido reprimida"),  # idem, sem plural comum
]


@pytest.mark.parametrize(
    "titulo,esperado",
    REGULARES
    + IRREGULARES
    + EXCECOES
    + INVARIAVEIS_FORA_DE_EXCECOES
    + NUCLEOS_FEMININOS_CASOS
    + MASCULINOS_GREGOS
    + CONTRAEXEMPLOS_DE_GENERO,
)
def test_forma_singular(titulo, esperado):
    assert forma_singular(titulo) == esperado


@pytest.mark.parametrize(
    "titulo,esperado",
    [("torres vigilantes", "uma torre vigilante"), ("bases orbitais", "uma base orbital")],
)
def test_forma_singular_nucleos_com_res_ses_conhecidos(titulo, esperado):
    # "torres" e "bases" colidem em superfície com a regra "-res/-ses" que
    # existe para consoante+es ("flor" -> "flores"); como "torre" e "base"
    # estão em NUCLEOS_FEMININOS, a exceção é checada antes dessa regra e
    # resolve corretamente sem precisar de um dicionário completo.
    assert forma_singular(titulo) == esperado


def test_forma_singular_oasis_fora_do_titulo_exato_de_excecoes():
    # "Oásis raros" não casa com a entrada exata de EXCECOES ("Oásis de
    # elite"), mas "oásis" já é gênero conhecido (masculino) na categoria
    # estabelecida do acervo — por isso está em NUCLEOS_MASCULINOS, e não
    # deveria sair como duvidoso.
    assert forma_singular("Oásis raros") == "um oásis raro"
    assert genero_confiavel("Oásis raros") is True


def test_forma_singular_titulo_vazio_nao_estoura():
    assert forma_singular("") == ""


def test_forma_singular_titulo_so_espacos_nao_estoura():
    assert forma_singular("   ") == ""


@pytest.mark.parametrize(
    "titulo",
    [
        "Naves e frotas nômades",  # EXCECOES exata
        "  naves E frotas   NÔMADES  ",  # mesma exceção, espaço e caixa variados
    ],
)
def test_forma_singular_excecao_tolera_espaco_e_caixa(titulo):
    assert forma_singular(titulo) == "uma frota nômade"


@pytest.mark.parametrize(
    "titulo,esperado",
    [
        ("Ruínas Antigas", True),  # regra de sufixo "-a" decidiu
        ("Conexões Interdimensionais", True),  # regra de sufixo "-xão" decidiu
        ("Metrópoles Galácticas", True),  # NUCLEOS_FEMININOS decidiu
        ("Pontes interdimensionais", True),  # NUCLEOS_FEMININOS decidiu
        ("Naves e frotas nômades", True),  # EXCECOES decidiu
        ("Oásis de elite", True),  # EXCECOES decidiu (mesmo sendo masculino)
        ("Vazios cósmicos", True),  # regra positiva "-o" decidiu (masculino)
        ("Abrigos subterrâneos", True),  # idem
        ("Sistemas Estelares Exóticos", True),  # regra "-ema" decidiu (masculino)
        ("Planetas Distantes", True),  # NUCLEOS_MASCULINOS decidiu
        ("Gemas raras", True),  # NUCLEOS_FEMININOS venceu a regra "-ema"
        ("Habitats artificiais", False),  # nenhuma regra decidiu; "um" é só o padrão
        ("Setores industriais opressivos", False),  # idem — terminação em consoante
    ],
)
def test_genero_confiavel(titulo, esperado):
    assert genero_confiavel(titulo) is esperado


def test_genero_confiavel_expoe_o_buraco_dos_femininos_em_e_ainda_nao_listados():
    # "luz" é feminina ("a luz") mas não está em NUCLEOS_FEMININOS nem casa
    # com nenhum sufixo de FEMININAS: a forma sai errada ("um luz distante")
    # e, sem genero_confiavel, isso passaria em silêncio. Este teste prova
    # que a incerteza aparece em vez de desaparecer.
    assert genero_confiavel("Luzes distantes") is False


def test_genero_confiavel_titulo_vazio_nao_estoura():
    assert genero_confiavel("") is True
