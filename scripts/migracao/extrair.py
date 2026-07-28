import re
from dataclasses import dataclass

CABECALHO_FELINO = "arquétipo felino"
_ASPAS = " \t\"'“”"


@dataclass(frozen=True)
class Item:
    nome: str
    descricao: str
    felino: bool = False


@dataclass(frozen=True)
class Livro:
    titulo: str
    autor: str
    corpo: str


def _valor(record_map: dict, bloco_id: str) -> dict | None:
    bloco = record_map.get("block", {}).get(bloco_id)
    if not bloco:
        return None
    valor = bloco.get("value", {})
    if isinstance(valor.get("value"), dict):
        valor = valor["value"]
    return valor


def _titulo(valor: dict) -> str:
    partes = (valor.get("properties") or {}).get("title") or []
    return "".join(str(p[0]) for p in partes if isinstance(p, list) and p)


def _link_da_anotacao(anotacoes) -> str | None:
    """Numa lista de anotações de um trecho de texto rico do Notion, devolve
    a URL se alguma anotação for um link (`["a", "url"]`); senão, None."""
    if not isinstance(anotacoes, list):
        return None
    for anotacao in anotacoes:
        if isinstance(anotacao, list) and len(anotacao) > 1 and anotacao[0] == "a":
            return str(anotacao[1])
    return None


def _titulo_com_links(valor: dict) -> str:
    """Como _titulo, mas um trecho de texto rico com anotação de link vira
    `[texto](url)` em Markdown em vez de perder o link silenciosamente.
    Usado só onde um link no meio do texto importa de verdade (a página
    Sobre tem um mailto: de contato) — em todo o resto do projeto,
    _titulo/texto_dos_blocos continuam suficientes e mais baratos."""
    partes = (valor.get("properties") or {}).get("title") or []
    pedacos = []
    for parte in partes:
        if not isinstance(parte, list) or not parte:
            continue
        texto = str(parte[0])
        url = _link_da_anotacao(parte[1]) if len(parte) > 1 else None
        pedacos.append(f"[{texto}]({url})" if url else texto)
    return "".join(pedacos)


def texto_dos_blocos(record_map: dict, raiz: str) -> list[str]:
    """Texto de cada bloco filho da raiz, em ordem, sem descer em subpáginas."""
    valor = _valor(record_map, raiz)
    if not valor:
        return []
    linhas = []
    for filho_id in valor.get("content") or []:
        filho = _valor(record_map, filho_id)
        if not filho or filho.get("type") == "page":
            continue
        texto = _titulo(filho).strip()
        if texto:
            linhas.append(texto)
    return linhas


def texto_dos_blocos_com_links(record_map: dict, raiz: str) -> list[str]:
    """Como texto_dos_blocos, mas preservando links de texto rico (ver
    _titulo_com_links). Mesma regra de não descer em subpáginas."""
    valor = _valor(record_map, raiz)
    if not valor:
        return []
    linhas = []
    for filho_id in valor.get("content") or []:
        filho = _valor(record_map, filho_id)
        if not filho or filho.get("type") == "page":
            continue
        texto = _titulo_com_links(filho).strip()
        if texto:
            linhas.append(texto)
    return linhas


def texto_dos_callouts(record_map: dict, raiz: str) -> list[str]:
    """Texto de dentro de cada bloco `callout` filho direto da raiz.

    Um `callout` tem `properties.title` vazio — o texto real mora num
    bloco `text` filho dele. `texto_dos_blocos` só lê o título dos filhos
    diretos da raiz, então nunca vê esse texto (ele "existe", só que com
    título vazio, e é descartado pelo `if texto:` de texto_dos_blocos).
    Esta função é o complemento: ignora tudo que não for callout, e desce
    um nível dentro de cada callout encontrado (via _textos_recursivos) para
    resgatar o texto de verdade. Preserva a ordem tanto dos callouts quanto
    dos parágrafos dentro de cada um."""
    valor = _valor(record_map, raiz)
    if not valor:
        return []
    textos: list[str] = []
    for filho_id in valor.get("content") or []:
        filho = _valor(record_map, filho_id)
        if not filho or filho.get("type") != "callout":
            continue
        textos.extend(_textos_recursivos(record_map, filho_id))
    return textos


def _textos_recursivos(record_map: dict, bloco_id: str) -> list[str]:
    """Texto de um bloco e de todos os seus descendentes, em ordem, descendo
    em qualquer estrutura de layout (colunas, callouts) mas não em
    subpáginas nem em blocos de imagem (cujo "título" é o nome do arquivo,
    não texto de conteúdo). Usado para a página de livros, cujo texto real
    fica dois ou três níveis abaixo dos blocos de topo (column_list >
    column > text), diferente de texto_dos_blocos, que só olha um nível."""
    valor = _valor(record_map, bloco_id)
    if not valor or valor.get("type") in ("page", "image"):
        return []
    textos = []
    texto = _titulo(valor).strip()
    if texto:
        textos.append(texto)
    for filho_id in valor.get("content") or []:
        textos.extend(_textos_recursivos(record_map, filho_id))
    return textos


def livros_da_pagina(record_map: dict, raiz: str) -> list[Livro]:
    """Extrai o catálogo de livros de uma subpágina de livros de subgênero.

    Cada livro é um bloco `column_list` filho direto da raiz: uma coluna com
    a capa (imagem, descartada) e outra com parágrafos de texto — o primeiro
    é sempre "Título, Autor" (separados pela ÚLTIMA vírgula: o autor nunca
    tem vírgula no nome, mas o título às vezes tem um subtítulo com
    dois-pontos, como em "2001: Uma Odisseia no Espaço"), e os demais são
    informação extra (edição/quantidade de volumes, sinopse) preservada
    literalmente no corpo. Blocos que não são `column_list` (callout de
    introdução, divisores, botões) são ignorados: não são livros."""
    valor = _valor(record_map, raiz)
    if not valor:
        return []
    resultado: list[Livro] = []
    for filho_id in valor.get("content") or []:
        filho = _valor(record_map, filho_id)
        if not filho or filho.get("type") != "column_list":
            continue
        textos = _textos_recursivos(record_map, filho_id)
        if not textos or "," not in textos[0]:
            continue
        titulo, autor = textos[0].rsplit(",", 1)
        resultado.append(Livro(titulo=titulo.strip(), autor=autor.strip(), corpo="\n\n".join(textos[1:])))
    return resultado


def itens(linhas: list[str]) -> list[Item]:
    """Converte linhas "Nome: descrição" em itens, marcando os que vêm após o cabeçalho felino."""
    resultado: list[Item] = []
    felino = False
    for linha in linhas:
        if linha.strip().lower() == CABECALHO_FELINO:
            felino = True
            continue
        if ":" not in linha:
            continue
        nome, descricao = linha.split(":", 1)
        nome, descricao = nome.strip(), descricao.strip()
        if not nome or not descricao:
            continue
        resultado.append(Item(nome=nome, descricao=descricao, felino=felino))
    return resultado


def citacao_da_pagina(linhas: list[str]) -> tuple[str, str] | None:
    """Procura, na última linha extraída de uma página de arquétipos de
    subgênero, uma citação de epígrafe no formato observado no Notion:
    uma frase entre aspas (retas ou tipográficas), seguida de " - Autor".

    A última linha é sempre a candidata: `itens()` já descarta qualquer
    linha sem dois-pontos (o que inclui tanto o cabeçalho "Arquétipo
    Felino" quanto a citação), então a citação nunca aparece na lista de
    arquétipos — só precisa ser resgatada de volta de `linhas`. Devolve
    None quando a última linha tem dois-pontos (não é citação, é só mais
    um item) ou quando não casa com o formato de citação esperado."""
    if not linhas:
        return None
    ultima = linhas[-1]
    if ":" in ultima:
        return None
    normalizada = re.sub(r"\xa0+", " ", ultima)
    normalizada = re.sub(r" {2,}", " ", normalizada).strip()
    if not normalizada or normalizada[0] not in "\"'“”":
        return None
    if " - " not in normalizada:
        return None
    bruta, autor = normalizada.rsplit(" - ", 1)
    citacao = bruta.strip(_ASPAS)
    autor = autor.strip()
    if not citacao or not autor:
        return None
    return citacao, autor


MARCADOR_COMO_USAR = "como usar esta página?"


def secao_como_usar(linhas: list[str]) -> list[str] | None:
    """Procura, entre as linhas de uma página-guia (Arquétipos, Cenários,
    Elementos Narrativos, Livros), o cabeçalho "COMO USAR ESTA PÁGINA?" e
    devolve ele junto com tudo que vem depois (os itens da lista de uso).
    `linhas` é o resultado de texto_dos_blocos na raiz da página — como o
    cabeçalho e os itens são blocos de texto simples, filhos diretos da
    raiz, texto_dos_blocos já os enxerga sem precisar descer em nada.
    Devolve None se a página não tiver essa seção (a de livros não tem)."""
    for indice, linha in enumerate(linhas):
        if linha.strip().lower() == MARCADOR_COMO_USAR:
            return linhas[indice:]
    return None
