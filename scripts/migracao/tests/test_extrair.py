import json
from pathlib import Path

from migracao.extrair import itens, texto_dos_blocos

FIXTURE = Path(__file__).parent / "fixtures" / "arquetipos_space_opera.json"
RAIZ = "2b0dfe05-91a9-8019-8fc1-eb1d998fc6bd"


def carregar():
    return json.loads(FIXTURE.read_text(encoding="utf-8"))["recordMap"]


def test_texto_dos_blocos_preserva_ordem():
    linhas = texto_dos_blocos(carregar(), RAIZ)
    assert any(l.startswith("O Herói Audaz:") for l in linhas)
    assert linhas.index(next(l for l in linhas if l.startswith("O Herói Audaz:"))) < linhas.index(
        next(l for l in linhas if l.startswith("A Pilota Rebelde:"))
    )


def test_itens_separa_nome_e_descricao():
    resultado = itens(texto_dos_blocos(carregar(), RAIZ))
    primeiro = resultado[0]
    assert primeiro.nome == "O Herói Audaz"
    assert primeiro.descricao.startswith("O protagonista carismático")
    assert primeiro.felino is False


def test_itens_ignora_linhas_sem_dois_pontos():
    resultado = itens(["Arquétipos por Subgênero", "O Herói Audaz: descrição"])
    assert len(resultado) == 1


def test_itens_separa_apenas_no_primeiro_dois_pontos():
    resultado = itens(["A Alienígena Diplomata/Guerreira: aliada sábia: ou adversária"])
    assert resultado[0].nome == "A Alienígena Diplomata/Guerreira"
    assert resultado[0].descricao == "aliada sábia: ou adversária"


def test_itens_marca_felino_apos_o_cabecalho():
    linhas = [
        "O Herói Audaz: descrição",
        "Arquétipo Felino",
        "O Observador espacial: um gato contemplativo da nave",
    ]
    resultado = itens(linhas)
    assert resultado[0].felino is False
    assert resultado[1].felino is True


def test_itens_encontra_vinte_e_um_arquetipos_na_space_opera():
    resultado = itens(texto_dos_blocos(carregar(), RAIZ))
    assert len(resultado) == 21
    assert sum(1 for i in resultado if i.felino) == 1


def test_texto_dos_blocos_nao_desce_em_subpaginas():
    record_map = {
        "block": {
            "raiz": {"value": {
                "type": "page",
                "content": ["texto1", "subpagina", "texto2"],
            }},
            "texto1": {"value": {
                "type": "text",
                "properties": {"title": [["Primeiro texto"]]},
            }},
            "subpagina": {"value": {
                "type": "page",
                "properties": {"title": [["Não deveria aparecer"]]},
                "content": ["texto_interno"],
            }},
            "texto_interno": {"value": {
                "type": "text",
                "properties": {"title": [["Texto dentro da subpágina"]]},
            }},
            "texto2": {"value": {
                "type": "text",
                "properties": {"title": [["Segundo texto"]]},
            }},
        }
    }
    linhas = texto_dos_blocos(record_map, "raiz")
    assert linhas == ["Primeiro texto", "Segundo texto"]
    assert "Não deveria aparecer" not in linhas
