import json
from pathlib import Path

from migracao.extrair import citacao_da_pagina, itens, livros_da_pagina, texto_dos_blocos

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


def _texto(tipo, titulo="", content=None):
    valor = {"type": tipo, "properties": {"title": [[titulo]]} if titulo else {}}
    if content is not None:
        valor["content"] = content
    return {"value": valor}


def _pagina_livros_fixture():
    """Reflete a estrutura real observada na página de livros do Notion:
    um callout de introdução (não é livro), seguido de pares
    column_list/divider, cada column_list com uma coluna de imagem (a capa,
    descartada) e uma coluna de textos: "Título, Autor", uma linha de
    quantidade de volumes e um ou mais parágrafos de sinopse."""
    return {
        "block": {
            "raiz": _texto("page", content=[
                "intro", "divisor1", "livro1", "divisor2", "livro2",
            ]),
            "intro": _texto("callout", content=["intro_texto"]),
            "intro_texto": _texto("text", "Minhas sugestões para o subgênero..."),
            "divisor1": _texto("divider"),
            "divisor2": _texto("divider"),
            "livro1": _texto("column_list", content=["coluna1a", "coluna1b"]),
            "coluna1a": _texto("column", content=["capa1"]),
            "capa1": _texto("image", "capa1.png"),
            "coluna1b": _texto("column", content=["titulo1", "qtd1", "sinopse1"]),
            "titulo1": _texto("text", "2001: Uma Odisseia no Espaço, Arthur C. Clarke"),
            "qtd1": _texto("text", "A tetralogia tem 4 livros"),
            "sinopse1": _texto("text", "Uma space opera filosófica sobre a evolução humana."),
            "livro2": _texto("column_list", content=["coluna2a", "coluna2b"]),
            "coluna2a": _texto("column", content=["capa2"]),
            "capa2": _texto("image", "capa2.png"),
            "coluna2b": _texto("column", content=["titulo2", "sinopse2"]),
            "titulo2": _texto("text", "Valerian, Pierre Christin e Jean-Claude Mézières"),
            "sinopse2": _texto("text", "Uma clássica HQ franco-belga de space opera."),
        }
    }


def test_livros_da_pagina_separa_titulo_e_autor_pela_ultima_virgula():
    livros = livros_da_pagina(_pagina_livros_fixture(), "raiz")
    assert len(livros) == 2
    assert livros[0].titulo == "2001: Uma Odisseia no Espaço"
    assert livros[0].autor == "Arthur C. Clarke"
    assert livros[1].titulo == "Valerian"
    assert livros[1].autor == "Pierre Christin e Jean-Claude Mézières"


def test_livros_da_pagina_junta_paragrafos_restantes_no_corpo():
    livros = livros_da_pagina(_pagina_livros_fixture(), "raiz")
    assert livros[0].corpo == (
        "A tetralogia tem 4 livros\n\nUma space opera filosófica sobre a evolução humana."
    )
    assert livros[1].corpo == "Uma clássica HQ franco-belga de space opera."


def test_livros_da_pagina_ignora_callout_de_introducao_e_divisores():
    livros = livros_da_pagina(_pagina_livros_fixture(), "raiz")
    textos = [l.titulo for l in livros] + [l.autor for l in livros]
    assert not any("sugestões" in t for t in textos)


def test_livros_da_pagina_ignora_titulo_de_imagem():
    livros = livros_da_pagina(_pagina_livros_fixture(), "raiz")
    assert "capa1.png" not in livros[0].titulo
    assert "capa1.png" not in livros[0].corpo


def test_citacao_da_pagina_aspas_tipograficas_e_nbsp():
    linhas = [
        "O Herói Audaz: descrição",
        "Arquétipo Felino",
        "O Gato: descrição",
        '“Uma frase de efeito sobre o futuro."\xa0 - Autora Exemplo',
    ]
    assert citacao_da_pagina(linhas) == ("Uma frase de efeito sobre o futuro.", "Autora Exemplo")


def test_citacao_da_pagina_aspas_retas_e_nbsp_duplo():
    linhas = [
        "O Herói Audaz: descrição",
        '"Outra frase memorável."\xa0\xa0-\xa0Outro Autor',
    ]
    assert citacao_da_pagina(linhas) == ("Outra frase memorável.", "Outro Autor")


def test_citacao_da_pagina_devolve_none_quando_ultima_linha_e_item_normal():
    linhas = ["O Herói Audaz: descrição", "O Gato: outra descrição"]
    assert citacao_da_pagina(linhas) is None


def test_citacao_da_pagina_devolve_none_para_pagina_vazia():
    assert citacao_da_pagina([]) is None


def test_citacao_da_pagina_devolve_none_sem_padrao_de_citacao():
    linhas = ["O Herói Audaz: descrição", "Um comentário qualquer sem aspas nem traço"]
    assert citacao_da_pagina(linhas) is None
