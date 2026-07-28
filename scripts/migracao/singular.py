"""Forma singular dos cenários, para uso do gerador de premissas.

Regras cobrem o caso comum. A tabela EXCECOES cobre o que regra nenhuma
alcança: compostos ligados por "e" e complementos que precisam permanecer
no plural. O resultado é sempre revisado por pessoa antes de virar conteúdo.

Suposição importante, não verificada em código: o núcleo do título — a
palavra que decide o artigo indefinido e a forma singular do substantivo —
é sempre a PRIMEIRA palavra do título (ex.: "Ruínas Antigas" -> núcleo
"ruína"). Um título que comece por um adjetivo em vez de substantivo (algo
como "Antigas Ruínas") violaria essa suposição e produziria uma forma
singular errada sem nenhum aviso. Não há detecção automática desse caso
aqui — cabe à revisão humana da Task 5 pegá-lo antes de virar conteúdo.
"""

EXCECOES: dict[str, str] = {
    "Naves e frotas nômades": "uma frota nômade",
    "Estações e bases espaciais": "uma base espacial",
    "Cidades em ruínas": "uma cidade em ruínas",
    "Oásis de elite": "um oásis de elite",
    "Bairros dominados por facções": "um bairro dominado por facções",
}


def _chave_normalizada(titulo: str) -> str:
    """Colapsa espaços (inclusive nas pontas) e ignora caixa, para que um
    título digitado com variação de formatação ainda encontre sua entrada em
    EXCECOES em vez de escorregar em silêncio para as regras gerais."""
    return " ".join(titulo.split()).casefold()


_EXCECOES_NORMALIZADAS = {_chave_normalizada(chave): valor for chave, valor in EXCECOES.items()}

# Palavras que revelam o início de um complemento: tudo dali em diante
# fica intocado, porque singularizá-lo produziria frase errada.
PREPOSICOES = {"de", "do", "da", "dos", "das", "em", "por", "para", "com", "sem", "a", "e"}

# Terminações que são de fato uma regra de português: substantivos abstratos
# derivados do latim "-tio/-sio/-xio" (ção/são/xão) são femininos como classe
# produtiva, então "-xão" é tão válida quanto "-ção" e "-são" já presentes
# aqui — cobre "conexão", "reflexão", "flexão" etc., inclusive palavras que
# ainda não existem no acervo.
FEMININAS = ("a", "ã", "ade", "agem", "ção", "são", "xão", "ise", "ie")

# Núcleos femininos que terminam em "-e", terminação ambígua em português:
# não existe regra de sufixo que separe "o parque"/"o monte"/"o peixe"
# (masculinos) de "a metrópole"/"a ponte"/"a chave" (femininos), então cada
# palavra observada ou plausível num catálogo de cenários de ficção
# científica entra aqui individualmente. Diferente de EXCECOES: isto cobre
# uma palavra isolada (o núcleo já singularizado), não um título inteiro, e
# por isso continua funcionando dentro de qualquer título novo que contenha
# essas palavras — inclusive títulos que a Julia ainda vai escrever.
#
#   metrópole — já no catálogo ("Metrópoles Galácticas").
#   nave      — substantivo central do space opera; já no catálogo via
#               EXCECOES ("Naves e frotas nômades").
#   base      — já no catálogo via EXCECOES ("Estações e bases espaciais").
#   ponte     — cenário plausível de travessia entre setores, estações ou
#               dimensões.
#   fonte     — "fonte de energia/poder" é vocabulário comum do gênero.
#   chave     — "instalação-chave", "zona-chave", vocabulário recorrente.
#   torre     — torres de vigilância/controle, arquétipo comum de ficção
#               científica urbana ou distópica.
#   frente    — "linha de frente", cenário de conflito armado.
#   rede      — redes neurais, redes de contrabando, vocabulário recorrente
#               de cenários tecnológicos.
#   margem    — "à margem da sociedade", cenário de exclusão social.
#   corrente  — correntes de dados/energia, tema recorrente em cenários
#               tecnológicos.
NUCLEOS_FEMININOS = {
    "metrópole",
    "nave",
    "base",
    "ponte",
    "fonte",
    "chave",
    "torre",
    "frente",
    "rede",
    "margem",
    "corrente",
}


def _singularizar_palavra(palavra: str) -> str:
    # Guarda de invariáveis PRIMEIRO. "oásis" e "lápis" também terminam em
    # "is", então se a regra "-is" -> "-il" (para adjetivos como "hostis" ->
    # "hostil") vier antes, ela dispara primeiro e mutila o invariável
    # ("oásis" -> "oásil"). A ordem original do brief tinha essa guarda no
    # fim, dentro do bloco de "-s" genérico, onde nunca era alcançada.
    if palavra.endswith("sis") or palavra.endswith("pis"):
        return palavra

    # Se o singular "óbvio" (removendo só o "s" final) já é um núcleo
    # feminino conhecido, prefira essa forma à regra "-res/-ses/-zes" logo
    # abaixo. Ela existe para substantivos terminados em consoante que
    # ganham "-es" no plural ("flor" -> "flores"), mas colide na superfície
    # com substantivos que já terminam em "-re"/"-se" e só ganham um "-s"
    # regular ("torre" -> "torres", "base" -> "bases"): as duas famílias
    # produzem o mesmíssimo sufixo "-res"/"-ses", e não há como separá-las
    # por sufixo sem recorrer a um dicionário. Checar a lista de exceções
    # primeiro resolve os casos que já conhecemos sem tentar resolver a
    # ambiguidade em geral.
    if palavra.endswith("s") and palavra[:-1] in NUCLEOS_FEMININOS:
        return palavra[:-1]

    if palavra.endswith("ões"):
        return palavra[:-3] + "ão"
    if palavra.endswith("ães"):
        return palavra[:-3] + "ão"
    if palavra.endswith("ais"):
        return palavra[:-3] + "al"
    if palavra.endswith("éis"):
        return palavra[:-3] + "el"
    if palavra.endswith("eis"):
        return palavra[:-3] + "el"
    if palavra.endswith("óis"):
        return palavra[:-3] + "ol"
    if palavra.endswith("is") and len(palavra) > 3:
        return palavra[:-2] + "il"
    if palavra.endswith("ns"):
        return palavra[:-2] + "m"
    if palavra.endswith("res") or palavra.endswith("ses") or palavra.endswith("zes"):
        return palavra[:-2]
    if palavra.endswith("s") and not palavra.endswith("ss"):
        return palavra[:-1]
    return palavra


def _e_feminina(palavra: str) -> bool:
    return palavra.endswith(FEMININAS) or palavra in NUCLEOS_FEMININOS


def _singularizar_titulo(titulo: str) -> list[str] | None:
    """Singulariza palavra a palavra, congelando tudo a partir da primeira
    preposição. Devolve None se o título não tiver nenhuma palavra."""
    palavras = titulo.split()
    if not palavras:
        return None

    saida: list[str] = []
    parou = False
    for palavra in palavras:
        if palavra.lower() in PREPOSICOES:
            parou = True
        saida.append(palavra if parou else _singularizar_palavra(palavra.lower()))
    return saida


def _resolver(titulo: str) -> tuple[str, bool]:
    """Devolve (forma singular completa, gênero_confiável).

    gênero_confiável é True quando uma entrada de EXCECOES ou uma regra/
    exceção de gênero decidiu ativamente o artigo (feminino, via FEMININAS
    ou NUCLEOS_FEMININOS; ou o que quer que EXCECOES tenha decidido). É
    False quando nenhuma delas se aplicou e o "um" masculino saiu por
    padrão, na ausência de qualquer evidência — o caso em que a forma pode
    estar gramaticalmente errada sem nenhum sinal (ex.: um núcleo feminino
    em "-e" que ainda não entrou em NUCLEOS_FEMININOS).
    """
    chave = _chave_normalizada(titulo)
    if chave in _EXCECOES_NORMALIZADAS:
        return _EXCECOES_NORMALIZADAS[chave], True

    saida = _singularizar_titulo(titulo)
    if saida is None:
        # Título vazio: não há nada a decidir, então não há gênero incerto.
        return "", True

    nucleo = saida[0]
    confiavel = _e_feminina(nucleo)
    artigo = "uma" if confiavel else "um"
    return f"{artigo} {' '.join(saida)}", confiavel


def forma_singular(titulo: str) -> str:
    forma, _ = _resolver(titulo)
    return forma


def genero_confiavel(titulo: str) -> bool:
    """Diz se o artigo devolvido por forma_singular(titulo) foi decidido por
    uma regra ou exceção, ou se é só o padrão masculino aplicado por falta
    de uma. A Task 5 usa isto para listar primeiro, na revisão humana, os
    cenários cujo gênero é apenas suposto — não confirmado."""
    _, confiavel = _resolver(titulo)
    return confiavel
