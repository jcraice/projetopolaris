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


@pytest.mark.parametrize(
    "titulo,esperado",
    REGULARES + IRREGULARES + EXCECOES + INVARIAVEIS_FORA_DE_EXCECOES + NUCLEOS_FEMININOS_CASOS,
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
        ("Vazios cósmicos", False),  # nenhuma regra decidiu; "um" é só o padrão
        ("Corpos celestes perigosos", False),  # idem
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
