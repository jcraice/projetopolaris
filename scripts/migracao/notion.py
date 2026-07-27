import json
import urllib.request

URL = "https://projetopolaris.notion.site/api/v3/loadPageChunk"


def carregar_pagina(page_id: str) -> dict:
    """Baixa uma página do Notion. Único ponto do projeto que acessa a rede."""
    corpo = json.dumps({
        "pageId": page_id,
        "limit": 400,
        "cursor": {"stack": []},
        "chunkNumber": 0,
        "verticalColumns": False,
    }).encode()
    requisicao = urllib.request.Request(
        URL, data=corpo,
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(requisicao) as resposta:
        return json.load(resposta)["recordMap"]
