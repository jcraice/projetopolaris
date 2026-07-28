import re
import unicodedata
from pathlib import Path

from .extrair import Item, Livro


def slug(texto: str) -> str:
    sem_acento = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", sem_acento.lower())).strip("-")



# Exige pelo menos uma letra: sem isso, um título puramente numérico como o
# livro "1984" bateria no padrão (só dígitos e hífen são um subconjunto
# válido do slug) e ficaria sem aspas — e um YAML "titulo: 1984" sem aspas é
# lido como número, não string, quebrando o esquema. Um identificador de
# subgênero de verdade (ex. "space-opera") sempre tem letra, então a
# exigência não custa nada aos casos que a regra existe para cobrir.
_SLUG_SIMPLES = re.compile(r"^(?=[a-z0-9-]*[a-z])[a-z0-9][a-z0-9-]*$")


def _valor_yaml(valor) -> str:
    if isinstance(valor, bool):
        return "true" if valor else "false"
    if isinstance(valor, (int, float)):
        return str(valor)
    if isinstance(valor, list):
        return "[" + ", ".join(_valor_yaml(v) for v in valor) + "]"
    texto = str(valor)
    # Identificadores tipo slug (ex.: "space-opera") são escalares YAML
    # simples e não precisam de aspas; qualquer outra string (com espaço,
    # acento, aspas, dois-pontos ou só dígitos) é citada e escapada por
    # segurança.
    if _SLUG_SIMPLES.match(texto):
        return texto
    return '"' + texto.replace('\\', '\\\\').replace('"', '\\"') + '"'


def arquivo_markdown(frontmatter: dict, corpo: str) -> str:
    linhas = [f"{chave}: {_valor_yaml(valor)}" for chave, valor in frontmatter.items()]
    return "---\n" + "\n".join(linhas) + "\n---\n\n" + corpo.strip() + "\n"


def escrever_arquetipos(itens: list[Item], subgenero: str, destino: Path) -> int:
    pasta = destino / subgenero
    pasta.mkdir(parents=True, exist_ok=True)
    for ordem, item in enumerate(itens, start=1):
        conteudo = arquivo_markdown(
            {"nome": item.nome, "subgenero": subgenero, "ordem": ordem, "felino": item.felino},
            item.descricao,
        )
        (pasta / f"{slug(item.nome)}.md").write_text(conteudo, encoding="utf-8")
    return len(itens)


def escrever_elementos(itens: list[Item], subgenero: str, destino: Path) -> int:
    pasta = destino / subgenero
    pasta.mkdir(parents=True, exist_ok=True)
    for ordem, item in enumerate(itens, start=1):
        conteudo = arquivo_markdown(
            {"titulo": item.nome, "subgenero": subgenero, "ordem": ordem},
            item.descricao,
        )
        (pasta / f"{slug(item.nome)}.md").write_text(conteudo, encoding="utf-8")
    return len(itens)


def escrever_cenarios(itens: list[Item], subgenero: str, destino: Path, forma_singular) -> int:
    pasta = destino / subgenero
    pasta.mkdir(parents=True, exist_ok=True)
    for ordem, item in enumerate(itens, start=1):
        conteudo = arquivo_markdown(
            {
                "titulo": item.nome,
                "singular": forma_singular(item.nome),
                "subgenero": subgenero,
                "ordem": ordem,
            },
            item.descricao,
        )
        (pasta / f"{slug(item.nome)}.md").write_text(conteudo, encoding="utf-8")
    return len(itens)


def escrever_livros(livros: list[Livro], subgenero: str, destino: Path) -> int:
    """Um arquivo por livro, em destino/{subgenero}/. O corpo (quantidade de
    volumes e sinopse) vem literal do catálogo do Notion; se um livro não
    tiver corpo, escreve o título como corpo mínimo, já que arquivo_markdown
    espera um corpo não vazio."""
    pasta = destino / subgenero
    pasta.mkdir(parents=True, exist_ok=True)
    for ordem, livro in enumerate(livros, start=1):
        conteudo = arquivo_markdown(
            {
                "titulo": livro.titulo,
                "autor": livro.autor,
                "subgenero": subgenero,
                "ordem": ordem,
            },
            livro.corpo or livro.titulo,
        )
        (pasta / f"{slug(livro.titulo)}.md").write_text(conteudo, encoding="utf-8")
    return len(livros)


def escrever_subgenero(chave: str, nome: str, ordem: int, destino: Path, *, mundo: bool = True,
                        aurora: list[str] | None = None, citacao: str | None = None,
                        citacao_autor: str | None = None, abertura_arquetipos: str | None = None,
                        corpo: str = "") -> Path:
    """Escreve destino/{chave}.md. `chave` é o identificador do subgênero
    (ex.: "cyberpunk"), usado como slug de pasta em outras coleções.
    `abertura_arquetipos` é o texto do callout da página de arquétipos
    daquele subgênero (fala dos personagens do mundo); `corpo` é o texto do
    callout da página de elementos (fala do mundo em geral) — dois textos
    diferentes, com funções diferentes no site."""
    destino.mkdir(parents=True, exist_ok=True)
    frontmatter = {"nome": nome, "ordem": ordem, "mundo": mundo}
    if aurora is not None:
        frontmatter["aurora"] = aurora
    if citacao is not None:
        frontmatter["citacao"] = citacao
    if citacao_autor is not None:
        frontmatter["citacaoAutor"] = citacao_autor
    if abertura_arquetipos is not None:
        frontmatter["aberturaArquetipos"] = abertura_arquetipos
    conteudo = arquivo_markdown(frontmatter, corpo)
    caminho = destino / f"{chave}.md"
    caminho.write_text(conteudo, encoding="utf-8")
    return caminho


def escrever_pagina(titulo: str, corpo: str, destino: Path, nome_arquivo: str, *, ordem: int = 0) -> Path:
    destino.mkdir(parents=True, exist_ok=True)
    conteudo = arquivo_markdown({"titulo": titulo, "ordem": ordem}, corpo)
    caminho = destino / f"{nome_arquivo}.md"
    caminho.write_text(conteudo, encoding="utf-8")
    return caminho
