# Originais das ilustrações

Os arquivos aqui são o desenho como saiu da mão da autora: tamanho cheio, traço
escuro, com ou sem fundo — os primeiros vieram já recortados, os seguintes com o
papel branco atrás, e o script dá conta dos dois casos. **Nenhuma página do site
aponta para eles** — o que entra nas páginas são as duas versões geradas na pasta
acima, uma por tema.

Ficam versionados porque são a fonte: sem eles não há como refazer as versões se
o tamanho de exibição mudar ou se o desenho for retocado.

Para regerar as duas versões a partir de um original:

```bash
python scripts/gerar-ilustracao.py src/assets/ilustracoes/original/<nome>.png
```

O script troca o papel branco por transparência (quando há papel), corta na caixa
do desenho, reduz para a largura de exibição e inverte o traço para a versão do
tema escuro — preservando as partes coloridas, que são cor escolhida e não traço.
