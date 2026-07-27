from dataclasses import dataclass

CABECALHO_FELINO = "arquétipo felino"


@dataclass(frozen=True)
class Item:
    nome: str
    descricao: str
    felino: bool = False


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
