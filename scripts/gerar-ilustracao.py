"""Gera as duas versões de tema de uma ilustração do acervo.

O desenho da autora é traço escuro sobre fundo claro: serve ao tema claro como
está, e some no escuro, que é o padrão do site. Este script recorta o papel,
corta, reduz e produz a segunda versão invertendo só o traço — as partes
coloridas passam intactas, porque cor é escolha do desenho e não consequência
do tema.

    python scripts/gerar-ilustracao.py src/assets/ilustracoes/original/<nome>.png

Escreve <nome>-tema-claro.png e <nome>-tema-escuro.png na pasta acima da do
original. É de uso ocasional — só roda quando um desenho entra ou é retocado —,
por isso pede Pillow sem declará-lo no projeto: `python -m pip install Pillow`.
"""

import colorsys
import os
import sys

from PIL import Image

CAIXA = 560    # o dobro do lado da caixa de exibição no verbete, para tela retina
MARGEM = 0.02  # folga em volta do desenho, em fração do lado maior
# A partir de quão claro um pixel opaco conta como papel, num desenho que já
# chegou com o lado de fora recortado. Alto de propósito: entre papel e traço
# de lápis fraco, o erro barato é deixar o traço em paz.
LIMITE_PAPEL = 230


def eh_cor_escolhida(r: int, g: int, b: int) -> bool:
    """Distingue cor de traço.

    O traço é grafite: preto ou quase, com o antisserrilhado todo no canal alfa.
    Qualquer pixel saturado e claro o bastante é pigmento que a autora pôs de
    propósito — no Observador Espacial, o planeta laranja — e não pode ser
    invertido junto, senão ele fica azul no tema escuro.
    """
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return s > 0.40 and v > 0.30


def recortar_do_papel(imagem: Image.Image) -> Image.Image:
    """Troca o branco por transparência, onde ele for papel.

    Os desenhos chegam de três jeitos. Uns já vêm recortados, com o traço sobre
    nada. Outros vêm como saem do programa da autora, traço escuro sobre papel
    branco chapado — e sem este passo apareceriam dentro de um retângulo branco
    no tema escuro. E outros vêm pela metade: o lado de fora recortado, mas o
    miolo das formas preenchido de branco opaco.

    O terceiro caso é o que obriga a decidir por pixel. A versão anterior
    desta função pulava tudo quando o arquivo trazia qualquer transparência,
    concluindo que já viera recortado; nos híbridos o papel de dentro
    sobrevivia, e a inversão do tema escuro o transformava em preto chapado
    dentro do gato. Agora o que manda é o pixel: opaco e claro é papel, venha
    de onde vier.

    Só pixel **inteiramente opaco** passa por aqui. Pixel que já tem alfa
    parcial é borda antisserrilhada de um traço já recortado, e mexer nela
    devolveria opacidade cheia a uma borda que devia ser suave.

    E no híbrido a conversão alcança só o que é claro o bastante para ser
    papel. Num desenho que chega inteiro opaco não há como distinguir papel de
    traço pelo alfa, e a conta da distância até o branco resolve os dois de uma
    vez; num que já vem recortado, o miolo opaco que sobrou é traço, e passá-lo
    pela mesma conta trocaria cinza opaco por preto translúcido — o que clareia
    a linha no tema escuro e mexeria em desenho já publicado.

    O que vira alfa é a distância até o branco: quanto mais escuro o pixel,
    mais opaco ele fica, e o traço volta a ser preto puro. É a conta inversa da
    que o navegador faz ao compor sobre o fundo, então o resultado sobre papel
    branco é idêntico ao original — o antisserrilhado e o traço fraco do lápis
    inclusive. Cor escolhida não passa por isso: ela fica opaca e com o
    pigmento intacto, senão o laranja clarearia junto com o papel.
    """
    inteira_opaca = imagem.getchannel('A').getextrema()[0] == 255

    saida = imagem.copy()
    px = saida.load()
    for y in range(saida.height):
        for x in range(saida.width):
            r, g, b, a = px[x, y]
            if a != 255 or eh_cor_escolhida(r, g, b):
                continue
            if not inteira_opaca and max(r, g, b) < LIMITE_PAPEL:
                continue
            px[x, y] = (0, 0, 0, 255 - max(r, g, b))
    return saida


def cortar(imagem: Image.Image) -> Image.Image:
    caixa = imagem.getbbox()
    if caixa is None:
        raise SystemExit('a imagem está inteira transparente')
    x0, y0, x1, y1 = caixa
    folga = int(max(x1 - x0, y1 - y0) * MARGEM)
    return imagem.crop((
        max(0, x0 - folga), max(0, y0 - folga),
        min(imagem.width, x1 + folga), min(imagem.height, y1 + folga),
    ))


def inverter_tracos(imagem: Image.Image) -> Image.Image:
    """Traço escuro vira claro. O alfa passa intocado, então a linha invertida
    guarda a mesma suavidade de borda que a original."""
    saida = imagem.copy()
    px = saida.load()
    for y in range(saida.height):
        for x in range(saida.width):
            r, g, b, a = px[x, y]
            if a == 0 or eh_cor_escolhida(r, g, b):
                continue
            px[x, y] = (255 - r, 255 - g, 255 - b, a)
    return saida


def caber_na_caixa(largura: int, altura: int) -> tuple[int, int]:
    """Encolhe até caber num quadrado de CAIXA de lado, sem deformar.

    Caixa e não largura fixa porque os desenhos têm formatos muito diferentes —
    o trono é alto e estreito, o planeta é largo e baixo. Igualados pela
    largura, o trono ficaria com quase o dobro da altura dos outros e abriria
    um vão enorme ao lado de um verbete de duas linhas. Pela caixa, os três
    ocupam mais ou menos o mesmo espaço na página e lêem como um conjunto.
    """
    escala = CAIXA / max(largura, altura)
    return round(largura * escala), round(altura * escala)


def main(caminho: str) -> None:
    original = cortar(recortar_do_papel(Image.open(caminho).convert('RGBA')))
    largura, altura = caber_na_caixa(original.width, original.height)

    destino = os.path.dirname(os.path.dirname(os.path.abspath(caminho)))
    base = os.path.splitext(os.path.basename(caminho))[0]

    versoes = {
        'tema-claro': original,
        'tema-escuro': inverter_tracos(original),
    }
    for sufixo, imagem in versoes.items():
        saida = os.path.join(destino, f'{base}-{sufixo}.png')
        imagem.resize((largura, altura), Image.LANCZOS).save(saida, optimize=True)
        print(f'{saida}  {largura}x{altura}  {os.path.getsize(saida) / 1024:.0f} KB')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
