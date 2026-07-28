from migracao.escrever import arquivo_markdown, escrever_arquetipos, escrever_livros, slug
from migracao.extrair import Item, Livro


def test_slug_remove_acentos_e_artigos_ficam():
    assert slug("A Transumana") == "a-transumana"
    assert slug("O Fixer/Corretor") == "o-fixer-corretor"
    assert slug("Pós Apocalíptico") == "pos-apocaliptico"
    assert slug("Naves e frotas nômades") == "naves-e-frotas-nomades"


def test_arquivo_markdown_monta_frontmatter_e_corpo():
    texto = arquivo_markdown({"nome": "A Transumana", "ordem": 14}, "Trocou tanto de si.")
    assert texto.startswith("---\n")
    assert 'nome: "A Transumana"' in texto
    assert "ordem: 14" in texto
    assert texto.endswith("Trocou tanto de si.\n")


def test_arquivo_markdown_escapa_aspas():
    texto = arquivo_markdown({"nome": 'O "Fantasma"'}, "corpo")
    assert 'nome: "O \\"Fantasma\\""' in texto


def test_arquivo_markdown_cita_titulo_puramente_numerico():
    # "1984" bate no padrão de slug (só dígitos e hífen são um subconjunto
    # válido), mas sem aspas um YAML "titulo: 1984" é lido como número, não
    # string — quebra o esquema de livros, que exige `titulo: z.string()`.
    texto = arquivo_markdown({"titulo": "1984"}, "corpo")
    assert 'titulo: "1984"' in texto


def test_escrever_arquetipos_cria_um_arquivo_por_item(tmp_path):
    itens = [
        Item("O Herói Audaz", "O protagonista carismático."),
        Item("O Observador espacial", "Um gato contemplativo.", felino=True),
    ]
    total = escrever_arquetipos(itens, "space-opera", tmp_path)

    assert total == 2
    criado = (tmp_path / "space-opera" / "o-heroi-audaz.md").read_text(encoding="utf-8")
    assert "subgenero: space-opera" in criado
    assert "ordem: 1" in criado
    assert "felino: false" in criado

    gato = (tmp_path / "space-opera" / "o-observador-espacial.md").read_text(encoding="utf-8")
    assert "felino: true" in gato


def test_escrever_livros_cria_um_arquivo_por_livro(tmp_path):
    livros = [
        Livro("Duna", "Frank Herbert", "A saga original tem 6 livros.\n\nSinopse aqui."),
    ]
    total = escrever_livros(livros, "space-opera", tmp_path)

    assert total == 1
    criado = (tmp_path / "space-opera" / "duna.md").read_text(encoding="utf-8")
    assert 'titulo: "Duna"' in criado
    assert 'autor: "Frank Herbert"' in criado
    assert "subgenero: space-opera" in criado
    assert "ordem: 1" in criado
    assert "Sinopse aqui." in criado
