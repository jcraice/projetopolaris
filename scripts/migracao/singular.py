"""Forma singular dos cenários, para uso do gerador de premissas.

Regras cobrem o caso comum. A tabela EXCECOES cobre o que regra nenhuma
alcança: compostos ligados por "e" e complementos que precisam permanecer
no plural. O resultado é sempre revisado por pessoa antes de virar conteúdo.
"""

EXCECOES: dict[str, str] = {
    "Naves e frotas nômades": "uma frota nômade",
    "Estações e bases espaciais": "uma base espacial",
    "Cidades em ruínas": "uma cidade em ruínas",
    "Oásis de elite": "um oásis de elite",
    "Bairros dominados por facções": "um bairro dominado por facções",
}

# Palavras que revelam o início de um complemento: tudo dali em diante
# fica intocado, porque singularizá-lo produziria frase errada.
PREPOSICOES = {"de", "do", "da", "dos", "das", "em", "por", "para", "com", "sem", "a", "e"}

# Terminações que são de fato uma regra de português: substantivos abstratos
# derivados do latim "-tio/-sio/-xio" (ção/são/xão) são femininos como classe
# produtiva, então "-xão" é tão válida quanto "-ção" e "-são" já presentes
# aqui — cobre "conexão", "reflexão", "flexão" etc., inclusive palavras que
# ainda não existem no acervo.
FEMININAS = ("a", "ã", "ade", "agem", "ção", "são", "xão", "ise", "ie")

# Núcleos femininos que terminam em "-e", terminação ambígua em português
# (ex.: "o parque" vs. "a metrópole", "o monte" vs. "a ponte") — não existe
# regra de sufixo que separe os dois grupos, então cada palavra observada no
# acervo entra aqui individualmente. Diferente de EXCECOES: isto cobre uma
# palavra isolada (o núcleo já singularizado), não um título inteiro, e por
# isso continua funcionando mesmo dentro de títulos novos ainda não vistos.
NUCLEOS_FEMININOS = {"metrópole"}


def _singularizar_palavra(palavra: str) -> str:
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
        # "oásis", "lápis" e afins são invariáveis
        if palavra.endswith("sis") or palavra.endswith("pis"):
            return palavra
        return palavra[:-1]
    return palavra


def _e_feminina(palavra: str) -> bool:
    return palavra.endswith(FEMININAS) or palavra in NUCLEOS_FEMININOS


def forma_singular(titulo: str) -> str:
    if titulo in EXCECOES:
        return EXCECOES[titulo]

    palavras = titulo.split()
    saida: list[str] = []
    parou = False
    for palavra in palavras:
        if palavra.lower() in PREPOSICOES:
            parou = True
        saida.append(palavra if parou else _singularizar_palavra(palavra.lower()))

    nucleo = saida[0]
    artigo = "uma" if _e_feminina(nucleo) else "um"
    return f"{artigo} {' '.join(saida)}"
