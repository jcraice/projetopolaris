import pytest

from migracao.singular import forma_singular

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


@pytest.mark.parametrize("titulo,esperado", REGULARES + IRREGULARES + EXCECOES)
def test_forma_singular(titulo, esperado):
    assert forma_singular(titulo) == esperado
