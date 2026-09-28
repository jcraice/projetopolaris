"""Gera os ícones do site a partir do desenho original do capacete.

Uso (pede Pillow, que o projeto não declara de propósito, como
gerar-ilustracao.py):

    python scripts/gerar-favicon.py src/assets/favicon/original.png

Saídas, todas em public/:

- favicon.svg: as duas versões embutidas, e uma consulta de mídia escolhe entre
  elas. Quem decide é o tema do navegador, não o `data-tema` do site: o ícone
  mora na aba, e a aba segue o sistema, não o botão da página.
- favicon.ico: reserva para navegador que não lê ícone em SVG. Só cabe uma
  versão, e fica a de aba clara.
- apple-touch-icon.png: o desenho sobre o papel creme, opaco, porque o iOS
  pinta de preto o que for transparente na tela inicial.

E em src/assets/, o capacete da barra do topo: capacete-tema-claro.png e
capacete-tema-escuro.png.

O papel vira transparência lendo cada pixel como uma das duas tintas do desenho
(TINTAS) misturada ao creme, e o script guarda a tinta e quanto dela havia. Assim
a borda suavizada do traço e a da estrela saem translúcidas na cor certa, em
vez de ganhar uma franja creme. Os filetes de dentro do capacete são do mesmo
creme do papel e viram transparência junto — é o fundo da aba que aparece
neles, o que funciona nas duas versões.
"""

import base64
import io
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
PUBLICO = RAIZ / 'public'
ASSETS = RAIZ / 'src' / 'assets'

# As duas tintas do desenho, medidas no original: o preto do capacete (que não
# é preto puro) e o laranja da estrela. Desenho novo com outra cor pede outra
# entrada aqui.
TINTAS = ((32, 32, 32), (240, 108, 48))
# Tinta clara da versão de aba escura: o próprio creme do papel do desenho.
CREME = (248, 245, 237)
# Acima dessa diferença entre o maior e o menor canal, a tinta é cor escolhida
# (a estrela) e não traço — não se inverte, como em gerar-ilustracao.py.
LIMITE_COR = 60
LADO_SVG = 96
MARGEM = 0.04


def cor_do_papel(img: Image.Image) -> tuple[int, int, int]:
    """Média dos quatro cantos: o papel não é branco puro."""
    w, h = img.size
    cantos = [img.getpixel(p)[:3] for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
    return tuple(round(sum(c[i] for c in cantos) / 4) for i in range(3))


def para_alfa(img: Image.Image, papel: tuple[int, int, int]) -> Image.Image:
    """Lê cada pixel como papel + uma das duas tintas e devolve só a tinta."""
    saida = Image.new('RGBA', img.size)
    pixels = []
    for pixel in img.convert('RGB').getdata():
        melhor = None
        for tinta in TINTAS:
            eixo = [t - f for t, f in zip(tinta, papel)]
            desvio = [p - f for p, f in zip(pixel, papel)]
            alfa = sum(e * d for e, d in zip(eixo, desvio)) / sum(e * e for e in eixo)
            alfa = max(0.0, min(1.0, alfa))
            residuo = sum((d - alfa * e) ** 2 for d, e in zip(desvio, eixo))
            if melhor is None or residuo < melhor[0]:
                melhor = (residuo, alfa, tinta)
        _, alfa, tinta = melhor
        # Abaixo disso é o grão do papel, não borda de traço.
        pixels.append((*tinta, round(alfa * 255)) if alfa >= 0.06 else (0, 0, 0, 0))
    saida.putdata(pixels)
    return saida


def enquadrar(img: Image.Image) -> Image.Image:
    """Corta na caixa do desenho e centraliza num quadrado com margem curta."""
    img = img.crop(img.getchannel('A').getbbox())
    lado = round(max(img.size) * (1 + 2 * MARGEM))
    quadrado = Image.new('RGBA', (lado, lado))
    quadrado.paste(img, ((lado - img.width) // 2, (lado - img.height) // 2))
    return quadrado


def versao_escura(img: Image.Image) -> Image.Image:
    saida = img.copy()
    saida.putdata([
        (*CREME, a) if a and max(r, g, b) - min(r, g, b) < LIMITE_COR else (r, g, b, a)
        for r, g, b, a in img.getdata()
    ])
    return saida


def png_base64(img: Image.Image, lado: int) -> str:
    buffer = io.BytesIO()
    img.resize((lado, lado), Image.LANCZOS).save(buffer, 'PNG', optimize=True)
    return base64.b64encode(buffer.getvalue()).decode('ascii')


def main(caminho: str) -> None:
    original = Image.open(caminho).convert('RGBA')
    papel = cor_do_papel(original)
    claro = enquadrar(para_alfa(original, papel))
    escuro = versao_escura(claro)

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LADO_SVG} {LADO_SVG}">'
        '<style>.escuro{display:none}'
        '@media (prefers-color-scheme:dark){.claro{display:none}.escuro{display:inline}}'
        '</style>'
        f'<image class="claro" width="{LADO_SVG}" height="{LADO_SVG}" '
        f'href="data:image/png;base64,{png_base64(claro, LADO_SVG)}"/>'
        f'<image class="escuro" width="{LADO_SVG}" height="{LADO_SVG}" '
        f'href="data:image/png;base64,{png_base64(escuro, LADO_SVG)}"/>'
        '</svg>\n'
    )
    (PUBLICO / 'favicon.svg').write_text(svg, encoding='utf-8')

    claro.resize((48, 48), Image.LANCZOS).save(
        PUBLICO / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)],
    )

    toque = Image.new('RGBA', (180, 180), (*papel, 255))
    desenho = claro.resize((140, 140), Image.LANCZOS)
    toque.alpha_composite(desenho, (20, 20))
    toque.convert('RGB').save(PUBLICO / 'apple-touch-icon.png', optimize=True)

    # O capacete da barra do topo, nas duas versões, em 64px: 32 na tela com
    # densidade 2. Vão para src/assets porque a barra os puxa pelo <Image> do
    # Astro, e a troca entre eles é pela classe de tema, como nas ilustrações.
    ASSETS.mkdir(exist_ok=True)
    claro.resize((64, 64), Image.LANCZOS).save(ASSETS / 'capacete-tema-claro.png', optimize=True)
    escuro.resize((64, 64), Image.LANCZOS).save(ASSETS / 'capacete-tema-escuro.png', optimize=True)

    print('favicon.svg, favicon.ico e apple-touch-icon.png gerados em public/, '
          'e o capacete da barra em src/assets/')


if __name__ == '__main__':
    main(sys.argv[1])
