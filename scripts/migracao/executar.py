"""Orquestrador da migração: baixa o acervo do Notion e escreve o conteúdo
em src/content/. Único ponto do projeto (além de notion.carregar_pagina) que
faz sentido só rodar de verdade, nunca em teste — teste nenhum importa este
módulo para executá-lo contra a rede."""

import argparse
import json
import time
import urllib.error
from pathlib import Path

from . import notion
from .escrever import (
    escrever_arquetipos,
    escrever_cenarios,
    escrever_elementos,
    escrever_livros,
    escrever_pagina,
    escrever_subgenero,
)
from .extrair import citacao_da_pagina, itens, livros_da_pagina, texto_dos_blocos
from .singular import forma_singular, genero_confiavel

SUBGENEROS = {
    "space-opera": {"nome": "Space Opera", "ordem": 1,
                    "arquetipos": "2b0dfe05-91a9-8019-8fc1-eb1d998fc6bd",
                    "elementos": "2b1dfe05-91a9-8078-aac5-dab46ae350e0",
                    "cenarios": "2c5dfe05-91a9-803f-bfbf-e465c02b3ffc"},
    "distopia": {"nome": "Distopia", "ordem": 2,
                 "arquetipos": "2b0dfe05-91a9-80ef-ba87-e04f9581e3d0",
                 "elementos": "2b1dfe05-91a9-8027-9639-ce151dc7bc92",
                 "cenarios": "2c5dfe05-91a9-800f-b0e7-e11ca013d34b"},
    "cyberpunk": {"nome": "Cyberpunk", "ordem": 3,
                  "arquetipos": "2b0dfe05-91a9-807b-89f0-e6e3bc9b7e62",
                  "elementos": "2b1dfe05-91a9-80de-af26-fd0224f62efe",
                  "cenarios": "2c5dfe05-91a9-80f9-bbc5-c64a177cad0e"},
    "pos-apocaliptico": {"nome": "Pós Apocalíptico", "ordem": 4,
                         "arquetipos": "2b0dfe05-91a9-8016-a1b4-c5aa0adcc5a1",
                         "elementos": "2b1dfe05-91a9-80f0-aec4-c8dd59c2fd78",
                         "cenarios": "2c5dfe05-91a9-8049-82eb-c8e7a790afea"},
    "invasao-alienigena": {"nome": "Invasão Alienígena", "ordem": 5,
                           "arquetipos": "2b0dfe05-91a9-8033-8404-fc54bf06b6e7",
                           "elementos": "2b1dfe05-91a9-80c5-b3fa-d71da2f11906",
                           "cenarios": "2c5dfe05-91a9-80f8-9be0-c3c7e85155e9"},
    "viagem-no-tempo": {"nome": "Viagem no Tempo", "ordem": 6,
                        "arquetipos": "2b0dfe05-91a9-80a8-86d9-f6bc78362c2c",
                        "elementos": "2b1dfe05-91a9-807c-9410-c0802ef55499",
                        "cenarios": "2c5dfe05-91a9-8080-871a-f553d2afa05f"},
    "comuns": {"nome": "20 Arquétipos Comuns", "ordem": 7, "mundo": False,
               "arquetipos": "2b1dfe05-91a9-806d-a72c-f959b1d2a4af"},
}
LIVROS = "2b1dfe05-91a9-80d5-86bf-dba736b11deb"
SOBRE = "2b1dfe05-91a9-8054-84e7-f5dbd5c6ad59"
ESTILOS = "2b1dfe05-91a9-805e-ac0d-d5f3cb31fda3"

# Ponto de partida validado no design (Task 5, Step 7).
AURORAS = {
    "cyberpunk": ["#ff2d92", "#7c3aed", "#00e5ff"],
    "space-opera": ["#ffc300", "#ff7a45", "#b07cff"],
    "distopia": ["#ff5f45", "#7a1f2b", "#ffb03a"],
    "pos-apocaliptico": ["#6ee7a0", "#2f6b4f", "#c8b47a"],
    "invasao-alienigena": ["#35e5f0", "#1c5e8f", "#a6ff6e"],
    "viagem-no-tempo": ["#b07cff", "#3b2f8f", "#ffd66e"],
}


def _carregar_com_retry(page_id: str, tentativas: int = 4, espera: float = 2.0) -> dict:
    """A API pública do Notion (não oficial, usada só para leitura) às vezes
    devolve 502/503 sob carga. Tenta de novo algumas vezes antes de desistir
    — a migração real faz ~2 dezenas de chamadas em sequência."""
    ultimo_erro = None
    for tentativa in range(tentativas):
        try:
            return notion.carregar_pagina(page_id)
        except urllib.error.HTTPError as erro:
            ultimo_erro = erro
            if erro.code not in (502, 503, 504):
                raise
            time.sleep(espera * (tentativa + 1))
    raise ultimo_erro


def _corpo_existente(caminho: Path) -> str:
    """Lê o corpo (texto após o segundo '---') de um markdown já existente,
    para não apagar prosa escrita à mão que o Notion não tem como repor
    (a migração regenera o frontmatter, mas não o texto livre de um
    subgênero, que nenhuma página do Notion contém)."""
    if not caminho.exists():
        return ""
    texto = caminho.read_text(encoding="utf-8")
    partes = texto.split("---\n", 2)
    if len(partes) < 3:
        return ""
    return partes[2].strip()


def _normalizar_paragrafos(linhas: list[str]) -> str:
    """Uma página literal (Sobre, Estilos) preserva o texto, só trocando o
    espaço duro (\\xa0) que o Notion insere nas bordas de trechos com
    formatação diferente por um espaço normal — não é reescrita de conteúdo,
    é higienização de um artefato invisível da API."""
    return "\n\n".join(linha.replace("\xa0", " ") for linha in linhas)


def executar(destino: Path) -> dict:
    resumo = {
        "arquetipos": {}, "elementos": {}, "cenarios": {}, "livros": {}, "subgeneros": 0,
        "cenarios_detalhe": [], "avisos": [],
    }

    for chave, info in SUBGENEROS.items():
        mundo = info.get("mundo", True)

        rm_arq = _carregar_com_retry(info["arquetipos"])
        linhas_arq = texto_dos_blocos(rm_arq, info["arquetipos"])
        itens_arq = itens(linhas_arq)
        n_arq = escrever_arquetipos(itens_arq, chave, destino / "arquetipos")
        resumo["arquetipos"][chave] = n_arq

        # Descarte esperado: 2 linhas para subgêneros-mundo (cabeçalho
        # "Arquétipo Felino" + citação final), 0 ou 1 para "comuns" (não tem
        # citação; o cabeçalho felino pode ou não existir).
        descartado = len(linhas_arq) - len(itens_arq)
        if mundo and descartado != 2:
            resumo["avisos"].append(
                f"arquetipos/{chave}: {len(linhas_arq)} linhas, {len(itens_arq)} itens "
                f"(esperava descartar 2: cabeçalho felino + citação, descartou {descartado})"
            )
        elif not mundo and descartado not in (0, 1):
            resumo["avisos"].append(
                f"arquetipos/{chave}: {len(linhas_arq)} linhas, {len(itens_arq)} itens "
                f"(descartou {descartado}, sem cabeçalho felino nem citação esperados)"
            )

        citacao = citacao_da_pagina(linhas_arq) if mundo else None

        if "elementos" in info:
            rm_el = _carregar_com_retry(info["elementos"])
            linhas_el = texto_dos_blocos(rm_el, info["elementos"])
            itens_el = itens(linhas_el)
            if len(linhas_el) != len(itens_el):
                resumo["avisos"].append(
                    f"elementos/{chave}: {len(linhas_el)} linhas, {len(itens_el)} itens (descartou "
                    f"{len(linhas_el) - len(itens_el)} sem motivo esperado)"
                )
            n_el = escrever_elementos(itens_el, chave, destino / "elementos")
            resumo["elementos"][chave] = n_el

        if "cenarios" in info:
            rm_cen = _carregar_com_retry(info["cenarios"])
            linhas_cen = texto_dos_blocos(rm_cen, info["cenarios"])
            itens_cen = itens(linhas_cen)
            if len(linhas_cen) != len(itens_cen):
                resumo["avisos"].append(
                    f"cenarios/{chave}: {len(linhas_cen)} linhas, {len(itens_cen)} itens (descartou "
                    f"{len(linhas_cen) - len(itens_cen)} sem motivo esperado)"
                )
            n_cen = escrever_cenarios(itens_cen, chave, destino / "cenarios", forma_singular)
            resumo["cenarios"][chave] = n_cen
            for item in itens_cen:
                resumo["cenarios_detalhe"].append({
                    "subgenero": chave,
                    "titulo": item.nome,
                    "singular": forma_singular(item.nome),
                    "genero_confiavel": genero_confiavel(item.nome),
                })

        caminho_subgenero = destino / "subgeneros" / f"{chave}.md"
        corpo = _corpo_existente(caminho_subgenero)
        escrever_subgenero(
            chave, info["nome"], info["ordem"], destino / "subgeneros",
            mundo=mundo,
            aurora=AURORAS.get(chave),
            citacao=citacao[0] if citacao else None,
            citacao_autor=citacao[1] if citacao else None,
            corpo=corpo,
        )
        resumo["subgeneros"] += 1
        if mundo and not citacao:
            resumo["avisos"].append(f"subgeneros/{chave}: nenhuma citação encontrada na página de arquétipos")

    # Livros: a raiz tem uma subpágina por subgênero-mundo; cada subpágina
    # tem o catálogo em blocos column_list (ver extrair.livros_da_pagina).
    rm_livros_raiz = _carregar_com_retry(LIVROS)
    bloco_raiz = rm_livros_raiz.get("block", {}).get(LIVROS, {}).get("value", {})
    if isinstance(bloco_raiz.get("value"), dict):
        bloco_raiz = bloco_raiz["value"]
    nome_para_chave = {info["nome"].strip().lower(): chave for chave, info in SUBGENEROS.items() if info.get("mundo", True)}
    subpaginas_encontradas = set()
    for filho_id in bloco_raiz.get("content") or []:
        filho = rm_livros_raiz.get("block", {}).get(filho_id, {}).get("value", {})
        if isinstance(filho.get("value"), dict):
            filho = filho["value"]
        if not filho or filho.get("type") != "page":
            continue
        titulo = "".join(
            str(p[0]) for p in (filho.get("properties") or {}).get("title", []) if isinstance(p, list) and p
        ).strip()
        chave = nome_para_chave.get(titulo.lower())
        if not chave:
            resumo["avisos"].append(f"livros: subpágina '{titulo}' não corresponde a nenhum subgênero conhecido")
            continue
        subpaginas_encontradas.add(chave)
        rm_sub = _carregar_com_retry(filho_id)
        livros = livros_da_pagina(rm_sub, filho_id)
        n_livros = escrever_livros(livros, chave, destino / "livros")
        resumo["livros"][chave] = n_livros

    faltando = set(nome_para_chave.values()) - subpaginas_encontradas
    if faltando:
        resumo["avisos"].append(f"livros: nenhuma subpágina encontrada para {sorted(faltando)}")

    # Páginas de texto livre — literal, sem reescrever nada.
    rm_sobre = _carregar_com_retry(SOBRE)
    corpo_sobre = _normalizar_paragrafos(texto_dos_blocos(rm_sobre, SOBRE))
    escrever_pagina("Sobre", corpo_sobre, destino / "paginas", "sobre", ordem=1)

    rm_estilos = _carregar_com_retry(ESTILOS)
    corpo_estilos = _normalizar_paragrafos(texto_dos_blocos(rm_estilos, ESTILOS))
    escrever_pagina("Estilos & Combinações", corpo_estilos, destino / "paginas", "estilos", ordem=2)

    return resumo


def main() -> None:
    parser = argparse.ArgumentParser(description="Migra o acervo do Notion para src/content/")
    parser.add_argument("--destino", required=True, help="Pasta de destino (ex.: ../src/content)")
    parser.add_argument("--resumo-json", help="Se informado, também grava o resumo estruturado nesse caminho")
    args = parser.parse_args()

    destino = Path(args.destino)
    resumo = executar(destino)

    total_arquetipos = sum(resumo["arquetipos"].values())
    total_elementos = sum(resumo["elementos"].values())
    total_cenarios = sum(resumo["cenarios"].values())
    total_livros = sum(resumo["livros"].values())

    print("== Resumo da migração ==")
    print(f"Subgêneros escritos: {resumo['subgeneros']}")
    print(f"Arquétipos: {total_arquetipos} ({resumo['arquetipos']})")
    print(f"Elementos: {total_elementos} ({resumo['elementos']})")
    print(f"Cenários: {total_cenarios} ({resumo['cenarios']})")
    print(f"Livros: {total_livros} ({resumo['livros']})")
    print("Páginas: sobre, estilos")
    if resumo["avisos"]:
        print("\n== Avisos ==")
        for aviso in resumo["avisos"]:
            print(f"- {aviso}")

    if args.resumo_json:
        Path(args.resumo_json).write_text(
            json.dumps(resumo, ensure_ascii=False, indent=2), encoding="utf-8"
        )


if __name__ == "__main__":
    main()
